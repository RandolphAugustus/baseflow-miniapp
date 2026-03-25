import { siteConfig } from '@/lib/site';

export function GET() {
  return Response.json({
    accountAssociation: {
      header: '',
      payload: '',
      signature: '',
    },
    baseBuilder: {
      ownerAddress: siteConfig.builderOwnerAddress,
    },
    frame: {
      version: '1',
      name: siteConfig.name,
      iconUrl: siteConfig.iconUrl,
      homeUrl: siteConfig.url,
      imageUrl: siteConfig.ogImageUrl,
      buttonTitle: 'Open BaseFlow',
      splashImageUrl: siteConfig.splashImageUrl,
      splashBackgroundColor: siteConfig.splashBackgroundColor,
      subtitle: siteConfig.subtitle,
      description: siteConfig.description,
      primaryCategory: siteConfig.primaryCategory,
      tags: siteConfig.tags,
      webhookUrl: `${siteConfig.url}/api/webhook`,
    },
    miniapp: {
      version: '1',
      name: siteConfig.name,
      homeUrl: siteConfig.url,
      iconUrl: siteConfig.iconUrl,
      splashImageUrl: siteConfig.splashImageUrl,
      splashBackgroundColor: siteConfig.splashBackgroundColor,
      subtitle: siteConfig.subtitle,
      description: siteConfig.description,
      screenshotUrls: siteConfig.screenshotUrls,
      primaryCategory: siteConfig.primaryCategory,
      tags: siteConfig.tags,
      heroImageUrl: siteConfig.ogImageUrl,
      tagline: siteConfig.tagline,
      ogTitle: siteConfig.ogTitle,
      ogDescription: siteConfig.ogDescription,
      ogImageUrl: siteConfig.ogImageUrl,
      webhookUrl: `${siteConfig.url}/api/webhook`,
      noindex: false,
    },
  });
}
