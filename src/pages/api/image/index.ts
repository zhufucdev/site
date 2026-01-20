import type { APIRoute } from "astro";
import db from "../../../db/connection";
import { imagesTable } from "../../../db/schema/images";
import { eq } from "drizzle-orm";
import loadEnv from "../../../utils/load-env";

export const prerender = false;

export const PUT: APIRoute = async ({ request }) => {
  let _body;
  try {
    _body = JSON.parse(await request.text());
  } catch (e) {
    return new Response("body must be a JSON string", { status: 400 });
  }
  const { url, alt } = _body;
  if (!url || typeof url !== "string") {
    return new Response("url is required", { status: 400 });
  }
  if (!alt || typeof alt !== "string") {
    return new Response("alt is required", { status: 400 });
  }

  const existingImages = await db
    .select({ id: imagesTable.id, alt: imagesTable.alt })
    .from(imagesTable)
    .where(eq(imagesTable.url, url))
    .limit(1);
  if (existingImages.length <= 0) {
    const newImages = await db
      .insert(imagesTable)
      .values({ url, alt })
      .returning({ id: imagesTable.id });
    return new Response(String(newImages[0].id), { status: 201 });
  } else if (existingImages[0].alt == alt) {
    return new Response(String(existingImages[0].id), { status: 304 });
  } else {
    await db
      .update(imagesTable)
      .set({ alt })
      .where(eq(imagesTable.id, existingImages[0].id));
    return new Response(String(existingImages[0].id));
  }
};

const { PUBLIC_CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET } = loadEnv();
export const POST: APIRoute = async ({ request }) => {
  if (!PUBLIC_CLOUDINARY_CLOUD_NAME) {
    return new Response("Service unavailble", { status: 503 });
  }

  const altText = request.headers.get("X-Alt-Text");
  if (!altText) {
    return new Response("X-Alt-Text is required", { status: 400 });
  }
  const fileName = request.headers.get("X-File-Name");
  if (!fileName) {
    return new Response("X-File-Name is required", { status: 400 });
  }

  const _contentLength = request.headers.get("Content-Length");
  if (_contentLength === null) {
    return new Response("Content-Length is required", { status: 400 });
  }
  const contentLength = Number.parseInt(_contentLength);
  if (!Number.isInteger(contentLength)) {
    return new Response("Invalid Content-Length", { status: 400 });
  }

  const imageBytes = request.body;
  if (!imageBytes) {
    return new Response("Empty request body", { status: 400 });
  }

  try {
    const preset = CLOUDINARY_UPLOAD_PRESET ?? "default";
    let url: string;
    if (contentLength > (5 * 1) << 20) {
      const { secureUrl } = await chunkedUpload(
        imageBytes,
        contentLength,
        fileName,
        PUBLIC_CLOUDINARY_CLOUD_NAME,
        preset,
      );
      url = secureUrl;
    } else {
      const { secureUrl } = await upload(
        imageBytes,
        fileName,
        PUBLIC_CLOUDINARY_CLOUD_NAME,
        preset,
      );
      url = secureUrl;
    }
    const newImages = await db
      .insert(imagesTable)
      .values({ url, alt: altText })
      .returning({ id: imagesTable.id });
    return new Response(
      JSON.stringify({
        id: newImages[0].id,
        url,
      }),
      { status: 201 },
    );
  } catch (error) {
    return new Response((error as Error).message, { status: 500 });
  }
};

async function chunkedUpload(
  imageBytes: ReadableStream<Uint8Array<ArrayBuffer>>,
  contentLength: number,
  fileName: string,
  cloudName: string,
  presetName: string,
) {
  let sentBytes = 0;
  const uniqueUploadId = crypto.randomUUID();
  let response!: Response;
  for await (const chunk of imageBytes) {
    const formData = new FormData();
    formData.append("file", new File([chunk], fileName));
    formData.append("cloud_name", cloudName);
    formData.append("upload_preset", presetName);
    const contentRange = `bytes ${sentBytes}-${sentBytes + chunk.length - 1}/${contentLength}`;
    response = await fetch(
      `https://api.cloudinary.com/v1_1/${PUBLIC_CLOUDINARY_CLOUD_NAME}/auto/upload`,
      {
        method: "POST",
        body: formData,
        headers: {
          "X-Unique-Upload-Id": uniqueUploadId,
          "Content-Range": contentRange,
        },
      },
    );
    if (!response.ok) {
      throw new Error(`Error from upstream service: ${await response.text()}`);
    }
    sentBytes += chunk.length;
  }

  const { secure_url } = await response.json();
  return { secureUrl: secure_url as string };
}

async function upload(
  imageBytes: ReadableStream<Uint8Array<ArrayBuffer>>,
  fileName: string,
  cloudName: string,
  presetName: string,
) {
  const imageBuffer: BlobPart[] = [];
  for await (const chunk of imageBytes) {
    imageBuffer.push(chunk);
  }
  const formData = new FormData();
  formData.append("file", new File(imageBuffer, fileName));
  formData.append("upload_preset", presetName);
  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
    {
      method: "POST",
      body: formData,
    },
  );
  const { secure_url } = await response.json();
  return { secureUrl: secure_url as string };
}
