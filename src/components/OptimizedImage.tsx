import { useState, ImgHTMLAttributes } from 'react';

interface OptimizedImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet'> {
  /** Base path without extension (e.g., '/optimized/portraits/Hero') */
  srcBase: string;
  /** Whether to use AVIF (best compression) */
  avif?: boolean;
  /** Whether to use WebP */
  webp?: boolean;
  /** Fallback format extension */
  fallbackExt?: string;
  /** Priority hint for LCP images */
  priority?: boolean;
  /** Sizes attribute for responsive images */
  sizes?: string;
}

export function OptimizedImage({
  srcBase,
  avif = true,
  webp = true,
  fallbackExt = '.png',
  priority = false,
  sizes = '100vw',
  alt = '',
  className,
  style,
  ...props
}: OptimizedImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const avifSrc = `${srcBase}.avif`;
  const webpSrc = `${srcBase}.webp`;
  const fallbackSrc = `${srcBase}${fallbackExt}`;

  return (
    <picture>
      {avif && (
        <source
          srcSet={avifSrc}
          type="image/avif"
          sizes={sizes}
        />
      )}
      {webp && (
        <source
          srcSet={webpSrc}
          type="image/webp"
          sizes={sizes}
        />
      )}
      <img
        src={error ? fallbackSrc : (loaded ? fallbackSrc : fallbackSrc)}
        alt={alt}
        className={className}
        style={{
          opacity: loaded || error ? 1 : 0,
          transition: 'opacity 0.3s ease',
          ...style,
        }}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        {...props}
      />
    </picture>
  );
}

/** Hero image component with LCP optimization */
export function HeroImage({ srcBase, alt = '', ...props }: Omit<OptimizedImageProps, 'priority' | 'sizes'>) {
  return (
    <OptimizedImage
      srcBase={srcBase}
      alt={alt}
      priority
      sizes="100vw"
      avif
      webp
      {...props}
    />
  );
}

/** Project thumbnail with responsive sizing */
export function ProjectImage({ srcBase, alt = '', ...props }: Omit<OptimizedImageProps, 'priority'>) {
  return (
    <OptimizedImage
      srcBase={srcBase}
      alt={alt}
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      {...props}
    />
  );
}

/** Portrait/avatar image */
export function AvatarImage({ srcBase, alt = '', size = 100, ...props }: Omit<OptimizedImageProps, 'priority' | 'sizes'> & { size?: number }) {
  return (
    <OptimizedImage
      srcBase={srcBase}
      alt={alt}
      sizes={`${size}px`}
      style={{ width: size, height: size, objectFit: 'cover', ...props.style }}
      {...props}
    />
  );
}