import { useEffect } from 'react';

interface SEOHeadProps {
  title: string;
  description: string;
  lang?: 'tr' | 'en';
  ogType?: 'website' | 'article';
  ogImage?: string;
  keywords?: string;
  canonicalUrl?: string;
}

export default function SEOHead({
  title,
  description,
  lang = 'tr',
  ogType = 'website',
  ogImage = '/image.png',
  keywords,
  canonicalUrl,
}: SEOHeadProps) {
  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = title;

    const metaTags = [
      { name: 'description', content: description },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:type', content: ogType },
      { property: 'og:image', content: ogImage.startsWith('http') ? ogImage : `${window.location.origin}${ogImage}` },
      { property: 'og:url', content: canonicalUrl || window.location.href },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: ogImage.startsWith('http') ? ogImage : `${window.location.origin}${ogImage}` },
    ];

    if (keywords) {
      metaTags.push({ name: 'keywords', content: keywords });
    }

    metaTags.forEach(({ name, property, content }) => {
      const attribute = name ? 'name' : 'property';
      const value = name || property;
      let element = document.querySelector(`meta[${attribute}="${value}"]`);

      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, value!);
        document.head.appendChild(element);
      }

      element.setAttribute('content', content);
    });

    if (canonicalUrl) {
      let linkElement = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
      if (!linkElement) {
        linkElement = document.createElement('link');
        linkElement.rel = 'canonical';
        document.head.appendChild(linkElement);
      }
      linkElement.href = canonicalUrl;
    }
  }, [title, description, lang, ogType, ogImage, keywords, canonicalUrl]);

  return null;
}
