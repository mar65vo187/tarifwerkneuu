import type { MetadataRoute } from "next";
import { SERVICES, SITE } from "@/lib/content";
import { getActiveAdvisors } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const statics: MetadataRoute.Sitemap = [
    { url: `${SITE.url}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE.url}/berater`, lastModified: now, changeFrequency: "weekly", priority: 0.95 },
    { url: `${SITE.url}/anfrage`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE.url}/leistungen`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE.url}/ueber-uns`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE.url}/karriere`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE.url}/faq`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
  ];
  const services: MetadataRoute.Sitemap = SERVICES.map((s) => ({
    url: `${SITE.url}/leistungen/${s.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: s.featured ? 0.9 : 0.8,
  }));
  const advisors = await getActiveAdvisors();
  const advisorUrls: MetadataRoute.Sitemap = advisors.map((a) => ({
    url: `${SITE.url}/berater/${a.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));
  return [...statics, ...services, ...advisorUrls];
}
