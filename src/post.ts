import type { ImageMetadata } from "astro";
import type { SupportedLocale } from "./strings/types";

interface Cover {
  image: ImageMetadata;
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
