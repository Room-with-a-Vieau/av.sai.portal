import sitecoreImageLoader, { shouldBypassOptimizer } from '@/lib/sitecore-image-loader';

describe('sitecore-image-loader', () => {
  it('bypasses the optimizer for Quanex, ERA, and AmesburyTruth product CDNs', () => {
    expect(shouldBypassOptimizer('https://www.quanex.com/wp-content/uploads/x.jpg')).toBe(true);
    expect(
      shouldBypassOptimizer('https://www.eraeverywhere.com/globalassets/era/product-1500max/11099.jpg')
    ).toBe(true);
    expect(
      shouldBypassOptimizer(
        'https://www.amesburytruth.com/images/products/Maxim%20HP%20Casement%20Hinge_clear%20bkgr,%20no%20shadow1.png'
      )
    ).toBe(true);
  });

  it('returns the original URL for ERA media instead of /_next/image', () => {
    const src = 'https://www.eraeverywhere.com/globalassets/era/product-1500max/11099.jpg';
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
