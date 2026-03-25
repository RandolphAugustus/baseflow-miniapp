import './globals.css';
import { siteConfig } from '@/lib/site';
import { Providers } from './providers';

const framePayload = JSON.stringify({
  version: 'next',
  imageUrl: siteConfig.ogImageUrl,
  button: {
    title: 'Open BaseFlow',
    action: {
      type: 'launch_frame',
      name: siteConfig.name,
      url: siteConfig.url,
      splashImageUrl: siteConfig.splashImageUrl,
      splashBackgroundColor: siteConfig.splashBackgroundColor,
    },
  },
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>{siteConfig.name}</title>
        <meta name="description" content={siteConfig.description} />
        <meta name="application-name" content={siteConfig.name} />
        <meta name="generator" content="BaseFlow" />
        <meta name="keywords" content="base,mini app,task,note,workflow,onchain" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover" />
        <meta name="robots" content="index,follow" />
        <meta name="base:app_id" content="69c358615262875b1be38c69" />
        <meta
          name="talentapp:project_verification"
          content="0c0de1a3180d820f3b76e0353d21433b7ddfaea97ae79ed0bf1a630baec2a876c36b79c6d2093095e79470ebc4dc079be14a36176811a1a9462303f26d0c5313"
        />
        <link rel="canonical" href={siteConfig.url} />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={siteConfig.name} />
        <meta property="og:title" content={siteConfig.ogTitle} />
        <meta property="og:description" content={siteConfig.ogDescription} />
        <meta property="og:url" content={siteConfig.url} />
        <meta property="og:image" content={siteConfig.ogImageUrl} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={siteConfig.ogTitle} />
        <meta name="twitter:description" content={siteConfig.ogDescription} />
        <meta name="twitter:image" content={siteConfig.ogImageUrl} />
        <meta name="fc:frame" content={framePayload} />
        <meta name="fc:miniapp" content={framePayload} />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
