export interface Product {
  id: string;
  slug: string;
  name: string;
  type: string;
  category: string;
  subcategory: string;
  price: number;
  image: string;
  description: string;
  features: string[];
  includes: string[];
  createdBy: string;
  compatibility: string;
  badge?: string;
  isFreebie?: boolean;
}

export interface Bundle {
  id: string;
  slug: string;
  name: string;
  color: string;
  saveAmount: number;
  products: string[];
  image: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface Video {
  id: string;
  title: string;
  thumbnail: string;
  url: string;
}

export interface Category {
  id: string;
  name: string;
  subcategories: Subcategory[];
}

export interface Subcategory {
  id: string;
  name: string;
}
