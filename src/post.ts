import type { ImageMetadata } from "astro";

interface Cover {
  image: ImageMetadata | string;
  alt: string;
}
export default interface Post {
  created: number;
  header: string;
  title: string;
  summary: string;
  cover?: Cover;
  mask: ImageMetadata;
}
