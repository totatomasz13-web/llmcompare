import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { AuthProvider } from '@/components/auth-provider';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-sans',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

const siteUrl = 'https://llmcompare.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'LLM Compare — Profesjonalny portal do porównywania modeli AI',
    template: '%s | LLM Compare',
  },
  description:
    'Porównuj najlepsze modele LLM: GPT-4o, Claude 3.5, Gemini, Llama, Qwen, DeepSeek i inne. Rankingi, wykresy, tabele porównawcze i rekomendacje — wszystko w jednym miejscu.',
  keywords: [
    'LLM',
    'porównanie modeli AI',
    'GPT-4o',
    'Claude',
    'Gemini',
    'Llama',
    'Qwen',
    'DeepSeek',
    'Mistral',
    'Open Source AI',
    'ranking modeli AI',
  ],
  authors: [{ name: 'LLM Compare Team' }],
  creator: 'LLM Compare',
  openGraph: {
    type: 'website',
    locale: 'pl_PL',
    url: siteUrl,
    title: 'LLM Compare — Profesjonalny portal do porównywania modeli AI',
    description:
      'Porównuj najlepsze modele LLM: Open Source i API. Rankingi, wykresy, rekomendacje.',
    siteName: 'LLM Compare',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LLM Compare — Porównaj najlepsze modele AI',
    description: 'Rankingi, wykresy i rekomendacje dla modeli LLM — Open Source i API.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0f' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'LLM Compare',
    description: metadata.description as string,
    url: siteUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteUrl}/ranking?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
  return (
    <html lang="pl" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange={false}
        >
          <AuthProvider>
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground focus:shadow-lg"
            >
              Przejdź do treści
            </a>
            <div className="relative flex min-h-screen flex-col">
              <Navbar />
              <main id="main-content" className="flex-1">
                {children}
              </main>
              <Footer />
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
