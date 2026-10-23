import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;
const DATA_DIR = path.resolve(__dirname, 'data');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');
const CATEGORIES_FILE = path.join(DATA_DIR, 'categories.json');
const INQUIRIES_FILE = path.join(DATA_DIR, 'inquiries.json');

// Helper to safely read JSON
function readJsonFile<T>(filePath: string, fallback: T): T {
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data) as T;
    }
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
  }
  return fallback;
}

// Helper to safely write JSON
function writeJsonFile(filePath: string, data: unknown): boolean {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    // Also keep src/data in sync if it exists
    const srcCopy = path.join(__dirname, 'src', 'data', path.basename(filePath));
    if (fs.existsSync(path.dirname(srcCopy))) {
      fs.writeFileSync(srcCopy, JSON.stringify(data, null, 2), 'utf8');
    }
    return true;
  } catch (err) {
    console.error(`Error writing ${filePath}:`, err);
    return false;
  }
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '10mb' }));

  // Initialize inquiries file if missing
  if (!fs.existsSync(INQUIRIES_FILE)) {
    writeJsonFile(INQUIRIES_FILE, []);
  }

  // --- API ROUTES ---

  // Health check
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Get categories
  app.get('/api/categories', (req: Request, res: Response) => {
    const categories = readJsonFile(CATEGORIES_FILE, []);
    res.json(categories);
  });

  // Get products with search, category filtering, pagination, sorting
  app.get('/api/products', (req: Request, res: Response) => {
    const products = readJsonFile<any[]>(PRODUCTS_FILE, []);
    const {
      search = '',
      category = '',
      stock = 'all',
      sort = 'default',
      page = '1',
      limit = '12'
    } = req.query as Record<string, string>;

    let filtered = [...products];

    // Search filter
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      filtered = filtered.filter(p => 
        (p.name && p.name.toLowerCase().includes(q)) ||
        (p.slug && p.slug.toLowerCase().includes(q)) ||
        (p.sku && p.sku.toLowerCase().includes(q)) ||
        (p.descriptionText && p.descriptionText.toLowerCase().includes(q)) ||
        (p.shortDescriptionText && p.shortDescriptionText.toLowerCase().includes(q)) ||
        (p.categories && p.categories.some((c: any) => c.name.toLowerCase().includes(q)))
      );
    }

    // Category filter (matches category slug or subcategory)
    if (category.trim() && category !== 'all') {
      const catSlug = category.trim().toLowerCase();
      filtered = filtered.filter(p => 
        p.categories && p.categories.some((c: any) => 
          c.slug.toLowerCase() === catSlug || c.slug.toLowerCase().includes(catSlug)
        )
      );
    }

    // Stock filter
    if (stock === 'in_stock') {
      filtered = filtered.filter(p => p.isInStock);
    } else if (stock === 'out_of_stock') {
      filtered = filtered.filter(p => !p.isInStock);
    }

    // Sorting
    if (sort === 'name_asc') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === 'name_desc') {
      filtered.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sort === 'price_asc') {
      filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sort === 'price_desc') {
      filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
    } else if (sort === 'rating') {
      filtered.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
    }

    const total = filtered.length;
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, parseInt(limit, 10) || 12);
    const totalPages = Math.ceil(total / limitNum);
    const startIndex = (pageNum - 1) * limitNum;
    const items = filtered.slice(startIndex, startIndex + limitNum);

    res.json({
      items,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages
    });
  });

  // Get single product by slug or id
  app.get('/api/products/:slugOrId', (req: Request, res: Response) => {
    const products = readJsonFile<any[]>(PRODUCTS_FILE, []);
    const param = req.params.slugOrId;
    const product = products.find(p => p.slug === param || p.id.toString() === param);

    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    // Find related products in same category
    const mainCat = product.categories?.[0]?.slug;
    const related = products
      .filter(p => p.id !== product.id && p.categories?.some((c: any) => c.slug === mainCat))
      .slice(0, 4);

    res.json({
      product,
      related
    });
  });

  // Admin: Create product
  app.post('/api/products', (req: Request, res: Response) => {
    const products = readJsonFile<any[]>(PRODUCTS_FILE, []);
    const newProduct = req.body;

    if (!newProduct.name) {
      res.status(400).json({ error: 'Product name is required' });
      return;
    }

    const id = Date.now();
    const slug = newProduct.slug || newProduct.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const productRecord = {
      ...newProduct,
      id,
      slug,
      sku: newProduct.sku || `ST-${id}`,
      permalink: `https://sonotech.pk/product/${slug}/`,
      averageRating: newProduct.averageRating || 5,
      reviewCount: newProduct.reviewCount || 0,
      categories: newProduct.categories || [],
      gallery: newProduct.gallery || (newProduct.featuredImage ? [newProduct.featuredImage] : [])
    };

    products.unshift(productRecord);
    writeJsonFile(PRODUCTS_FILE, products);
    res.status(201).json(productRecord);
  });

  // Admin: Update product
  app.put('/api/products/:id', (req: Request, res: Response) => {
    const products = readJsonFile<any[]>(PRODUCTS_FILE, []);
    const id = parseInt(req.params.id, 10);
    const index = products.findIndex(p => p.id === id);

    if (index === -1) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    products[index] = {
      ...products[index],
      ...req.body,
      id
    };

    writeJsonFile(PRODUCTS_FILE, products);
    res.json(products[index]);
  });

  // Admin: Delete product
  app.delete('/api/products/:id', (req: Request, res: Response) => {
    const products = readJsonFile<any[]>(PRODUCTS_FILE, []);
    const id = parseInt(req.params.id, 10);
    const filtered = products.filter(p => p.id !== id);

    if (filtered.length === products.length) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    writeJsonFile(PRODUCTS_FILE, filtered);
    res.json({ success: true, message: 'Product deleted' });
  });

  // Submit quote or inquiry
  app.post('/api/inquiries', (req: Request, res: Response) => {
    const inquiries = readJsonFile<any[]>(INQUIRIES_FILE, []);
    const { fullName, email, phone, organization, city, message, items } = req.body;

    if (!fullName || !phone) {
      res.status(400).json({ error: 'Full name and phone number are required' });
      return;
    }

    const inquiryRecord = {
      id: `INQ-${Date.now().toString(36).toUpperCase()}`,
      createdAt: new Date().toISOString(),
      fullName,
      email: email || '',
      phone,
      organization: organization || '',
      city: city || '',
      message: message || '',
      items: items || [],
      status: 'pending'
    };

    inquiries.unshift(inquiryRecord);
    writeJsonFile(INQUIRIES_FILE, inquiries);
    res.status(201).json({ success: true, inquiry: inquiryRecord });
  });

  // Admin: Get all inquiries
  app.get('/api/inquiries', (req: Request, res: Response) => {
    const inquiries = readJsonFile(INQUIRIES_FILE, []);
    res.json(inquiries);
  });

  // Admin: Update inquiry status
  app.patch('/api/inquiries/:id', (req: Request, res: Response) => {
    const inquiries = readJsonFile<any[]>(INQUIRIES_FILE, []);
    const id = req.params.id;
    const inquiry = inquiries.find(i => i.id === id);

    if (!inquiry) {
      res.status(404).json({ error: 'Inquiry not found' });
      return;
    }

    if (req.body.status) {
      inquiry.status = req.body.status;
    }

    writeJsonFile(INQUIRIES_FILE, inquiries);
    res.json(inquiry);
  });

  // Reports endpoint
  app.get('/api/reports/:type', (req: Request, res: Response) => {
    const type = req.params.type;
    const validFiles: Record<string, string> = {
      'extraction': path.join(DATA_DIR, 'extraction-report.json'),
      'missing': path.join(DATA_DIR, 'missing-data-report.json'),
      'images': path.join(DATA_DIR, 'image-manifest.json'),
      'urls': path.join(DATA_DIR, 'discovered-urls.json'),
      'categories': path.join(DATA_DIR, 'categories.json')
    };

    const filePath = validFiles[type];
    if (!filePath || !fs.existsSync(filePath)) {
      res.status(404).json({ error: 'Report not found' });
      return;
    }

    res.json(readJsonFile(filePath, {}));
  });

  // Admin login endpoint
  app.post('/api/admin/login', (req: Request, res: Response) => {
    const { username, password } = req.body;
    // Default admin credentials for Sonotech Admin portal
    if ((username === 'admin' && password === 'sonotech2026') || (username === 'admin@sonotech.pk' && password === 'admin123')) {
      res.json({
        success: true,
        token: `sonotech-admin-${Date.now()}`,
        user: { username: 'admin', role: 'administrator', name: 'SonoTech Administrator' }
      });
    } else {
      res.status(401).json({ error: 'Invalid username or password' });
    }
  });

  // Export endpoints
  app.get('/api/export/csv', (req: Request, res: Response) => {
    const csvFile = path.join(DATA_DIR, 'products.csv');
    if (fs.existsSync(csvFile)) {
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="sonotech-products.csv"');
      res.sendFile(csvFile);
    } else {
      res.status(404).send('CSV not found');
    }
  });

  // Mount Vite middleware in development
  const isProduction = process.env.NODE_ENV === 'production';
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // In production serve dist
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SonoTech Full-Stack Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
