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
