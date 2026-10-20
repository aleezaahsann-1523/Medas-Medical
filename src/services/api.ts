import { Product, Category, QuoteInquiry } from '../types';
import localProducts from '../data/products.json';
import localCategories from '../data/categories.json';

export async function fetchProducts(params: {
  search?: string;
  category?: string;
  stock?: string;
  sort?: string;
  page?: number;
  limit?: number;
} = {}): Promise<{ items: Product[]; total: number; page: number; totalPages: number }> {
  try {
    const query = new URLSearchParams();
    if (params.search) query.set('search', params.search);
    if (params.category && params.category !== 'all') query.set('category', params.category);
    if (params.stock) query.set('stock', params.stock);
    if (params.sort) query.set('sort', params.sort);
    if (params.page) query.set('page', params.page.toString());
    if (params.limit) query.set('limit', params.limit.toString());

    const res = await fetch(`/api/products?${query.toString()}`);
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('API fetch failed, falling back to local data:', err);
  }

  // Client-side fallback
  let items = [...(localProducts as Product[])];

  if (params.search) {
    const q = params.search.toLowerCase();
    items = items.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.slug.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q) ||
      p.descriptionText?.toLowerCase().includes(q) ||
      p.shortDescriptionText?.toLowerCase().includes(q)
    );
  }

  if (params.category && params.category !== 'all') {
    const cat = params.category.toLowerCase();
    items = items.filter(p =>
      p.categories.some(c => c.slug.toLowerCase() === cat || c.slug.toLowerCase().includes(cat))
    );
  }

  if (params.stock === 'in_stock') {
    items = items.filter(p => p.isInStock);
  }

  if (params.sort === 'name_asc') {
    items.sort((a, b) => a.name.localeCompare(b.name));
  } else if (params.sort === 'name_desc') {
    items.sort((a, b) => b.name.localeCompare(a.name));
  } else if (params.sort === 'price_asc') {
    items.sort((a, b) => (a.price || 0) - (b.price || 0));
  } else if (params.sort === 'price_desc') {
    items.sort((a, b) => (b.price || 0) - (a.price || 0));
  }

  const limit = params.limit || 12;
  const page = params.page || 1;
  const total = items.length;
  const totalPages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;

  return {
    items: items.slice(startIndex, startIndex + limit),
    total,
    page,
    totalPages
  };
}

export async function fetchProductBySlug(slug: string): Promise<{ product: Product; related: Product[] } | null> {
  try {
    const res = await fetch(`/api/products/${slug}`);
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('API fetch single product failed, using local:', err);
  }

  const products = localProducts as Product[];
  const product = products.find(p => p.slug === slug || p.id.toString() === slug);
  if (!product) return null;

  const mainCat = product.categories?.[0]?.slug;
  const related = products
    .filter(p => p.id !== product.id && p.categories?.some(c => c.slug === mainCat))
    .slice(0, 4);

  return { product, related };
}

export async function fetchCategories(): Promise<Category[]> {
  try {
    const res = await fetch('/api/categories');
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('API fetch categories failed, using local:', err);
  }

  return localCategories as Category[];
}

export async function submitQuoteInquiry(inquiry: {
  fullName: string;
  email: string;
  phone: string;
  organization?: string;
  city?: string;
  message: string;
  items: { productId: number; productName: string; quantity: number }[];
}): Promise<{ success: boolean; inquiry?: QuoteInquiry; error?: string }> {
  try {
    const res = await fetch('/api/inquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(inquiry)
    });
    return await res.json();
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
