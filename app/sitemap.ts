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
  ];

  const modelPages: MetadataRoute.Sitemap = MODELS.map((m) => ({
    url: `${SITE_URL}/models/${m.id}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  const useCasePages: MetadataRoute.Sitemap = Object.keys(USE_CASES_INFO).map((uc) => ({
    url: `${SITE_URL}/best-for/${uc}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...modelPages, ...useCasePages];
}
