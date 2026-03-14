type Runtime = import("@astrojs/cloudflare").Runtime<Env>;
type PoW = import("./utils/proof-of-work").PoW;

declare interface ImportMetaEnv {
  PUBLIC_SITE?: string;
  PUBLIC_CLOUDINARY_CLOUD_NAME?: string;

  POST_AUTH_KEY?: string;
  DB_URL?: string;
  CLOUDINARY_API_KEY?: string;
  CLOUDINARY_API_SECRET?: string;
  CLOUDINARY_UPLOAD_PRESET?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare namespace App {
  interface SessionData {
    pageViews: { pageId: string; timestamp: Date; ip: string }[];
    pow: PoW;
    fingerprint: string;
  }

  interface Locals extends Runtime {
    otherLocals: {
      SESSION: KVNamespace;
    };
  }
}
