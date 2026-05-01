export type ProductStatus = "active" | "inactive" | "out_of_stock";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  status: ProductStatus;
  imageUrl?: string;
  category: string;
}
