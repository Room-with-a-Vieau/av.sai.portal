import sitecoreImageLoader, { shouldBypassOptimizer } from '@/lib/sitecore-image-loader';

describe('sitecore-image-loader', () => {
  it('bypasses the optimizer for Content Hub and sandbox hosts', () => {
    expect(
      shouldBypassOptimizer('https://example.sitecorecontenthub.cloud/api/public/content/x.jpg')
    ).toBe(true);
    expect(shouldBypassOptimizer('https://images.unsplash.com/photo-x')).toBe(true);
  });

  it('returns the original URL for Content Hub instead of /_next/image', () => {
    const src = 'https://example.sitecorecontenthub.cloud/api/public/content/x.jpg';
    expect(sitecoreImageLoader({ src, width: 320 })).toBe(src);
  });

  it('uses the Next optimizer for other https hosts', () => {
    const src = 'https://edge.example.com/media/foo.jpg';
    expect(shouldBypassOptimizer(src)).toBe(false);
    expect(sitecoreImageLoader({ src, width: 640, quality: 80 })).toBe(
      '/_next/image?url=https%3A%2F%2Fedge.example.com%2Fmedia%2Ffoo.jpg&w=640&q=80'
    );
  });
});
