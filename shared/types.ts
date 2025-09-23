export type ProductImagePair = [string, string]; // [mainImage, hoverImage]

export type Product = {
  id: string | number;
  name: string;
  price: number;
  images: ProductImagePair;
};
