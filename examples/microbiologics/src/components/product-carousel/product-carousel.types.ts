export type ProductCarouselItem = {
  id: string;
  title: string;
  description: string;
  imageSrc?: string;
  imageAlt?: string;
  href?: string;
};

export type ProductCarouselData = {
  title?: string;
  products: ProductCarouselItem[];
};
