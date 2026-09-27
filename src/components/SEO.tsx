import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: 'website' | 'article';
}

const SITE_URL = 'https://rajeshponnapure.dev';
const DEFAULT_IMAGE = '/og-image.png';

export function SEO({ title, description, path, image = DEFAULT_IMAGE, type = 'website' }: SEOProps) {
  const fullUrl = `${SITE_URL}${path}`;
  const imageUrl = `${SITE_URL}${image}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Gnana Rajeswara Reddy',
    url: SITE_URL,
    image: imageUrl,
    sameAs: [
      'https://github.com/Rajeshponnapure',
      'https://www.linkedin.com/in/gnanarajeswarareddy/',
      'https://www.instagram.com/_rajeshponnapureddy_',
    ],
    jobTitle: 'Full-stack AI Builder & Agentic Systems Engineer',
    worksFor: {
      '@type': 'Organization',
      name: 'Rajesh OS',
    },
    knowsAbout: [
      'AI Agents',
      'Full-stack Development',
      'Realtime Systems',
      'IoT & Smart City',
      'Automation',
      'Machine Learning',
    ],
  };

  return (
    <Helmet>
      <html lang="en" />
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="theme-color" content="#05060a" />

      <link rel="canonical" href={fullUrl} />

      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="Rajesh OS Portfolio" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />

      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
    </Helmet>
  );
}