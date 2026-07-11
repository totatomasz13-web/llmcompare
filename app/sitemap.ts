import type { MetadataRoute } from 'next';
import { MODELS, USE_CASES_INFO } from '@/data/models';

const SITE_URL = 'https://llmcompare.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/ranking`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE_URL}/open-source`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/paid`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/best-for`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/compare`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/login`, lastModified: now, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${SITE_URL}/register`, lastModified: now, changeFrequency: 'monthly', priority: 0.3 },
  ];

  return staticPages;
}
