import type { SupportedLocale } from "./strings/types";

export default interface Post {
  created: number;
  header: string;
  title: string;
  summary: string;
  cover?: string;
  mask: string;
}

