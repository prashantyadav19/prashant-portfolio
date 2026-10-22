import type { MetadataRoute } from "next";
import { content } from "@/content";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: content.site.url, lastModified: new Date() }];
}
