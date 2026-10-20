export interface ProductImage {
  id: number;
  src: string;
  thumbnail?: string;
  alt: string;
  name?: string;
}

export interface ProductCategoryRef {
  id: number;
  name: string;
  slug: string;
  link?: string;
}

export interface ProductTagRef {
  id: number;
  name: string;
  slug: string;
}

export interface ProductSpecification {
  label: string;
  value: string;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  permalink: string;
  sku: string;
  type: string;
  onSale: boolean;
  isInStock: boolean;
  price: number;
  regularPrice: number;
  salePrice: number;
  priceHtml: string;
  currency: string;
  currencySymbol: string;
  averageRating: number;
  reviewCount: number;
  shortDescription: string;
  shortDescriptionText: string;
  description: string;
  descriptionText: string;
  keyFeatures: string[];
  specifications: ProductSpecification[];
  technicalData: Record<string, string>;
  categories: ProductCategoryRef[];
  tags: ProductTagRef[];
  featuredImage: ProductImage | null;
  gallery: ProductImage[];
  isFeatured?: boolean;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  count: number;
  image: {
    id: number;
    src: string;
  } | null;
  parentSlug: string | null;
  isRoot: boolean;
  children?: Category[];
}

export interface QuoteItem {
  product: Product;
  quantity: number;
  notes?: string;
}

export interface QuoteInquiry {
  id: string;
  createdAt: string;
  fullName: string;
  email: string;
  phone: string;
  organization?: string;
  city?: string;
  message: string;
  items: {
    productId: number;
    productName: string;
    quantity: number;
  }[];
  status: 'pending' | 'contacted' | 'quoted' | 'closed';
}

export interface CatalogFilterState {
  search: string;
  categorySlug: string;
  inStockOnly: boolean;
  sortBy: 'featured' | 'name-asc' | 'name-desc' | 'price-low' | 'price-high';
  page: number;
  itemsPerPage: number;
}
