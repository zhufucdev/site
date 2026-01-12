import type { ImageMetadata } from "astro";

export default interface QnaPost {
  mask: ImageMetadata;
  question: string;
  answer: string;
}
