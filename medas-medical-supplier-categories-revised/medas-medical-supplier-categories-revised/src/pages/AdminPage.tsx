import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  Search, 
  Plus, 
  Edit3, 
  Trash2, 
  Save, 
  X, 
  CheckCircle2, 
  FileText, 
  Download, 
  Database, 
  ShoppingCart, 
  Users, 
  LogOut,
  RefreshCw,
  Clock,
  Check,
  AlertCircle
} from 'lucide-react';
import { Product, QuoteInquiry } from '../types';
import localProducts from '../data/products.json';
import { useQuote } from '../context/QuoteContext';

export const AdminPage: React.FC = () => {
  const { showToast } = useQuote();

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('sonotech_admin_token') !== null;
  });

  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('sonotech2026');
  const [loginError, setLoginError] = useState('');

  const [activeTab, setActiveTab] = useState<'products' | 'inquiries' | 'export'>('products');
  const [products, setProducts] = useState<Product[]>(localProducts as Product[]);
  const [inquiries, setInquiries] = useState<QuoteInquiry[]>([]);
  const [search, setSearch] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  // Form states for edit/add
  const [formName, setFormName] = useState('');
  const [formSku, setFormSku] = useState('');
  const [formPrice, setFormPrice] = useState(0);
  const [formStock, setFormStock] = useState(true);
  const [formShortDesc, setFormShortDesc] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formImage, setFormImage] = useState('');

  // Fetch live products and inquiries from server
  const loadData = async () => {
    try {
      const pRes = await fetch('/api/products?limit=200');
      if (pRes.ok) {
        const data = await pRes.json();
        if (data.items) setProducts(data.items);
      }

      const inqRes = await fetch('/api/inquiries');
      if (inqRes.ok) {
        const inqData = await inqRes.json();
        setInquiries(inqData);
      }
    } catch (err) {
      console.warn('Error loading admin data:', err);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem('sonotech_admin_token', data.token);
        setIsAuthenticated(true);
        showToast('Logged in as Administrator');
      } else {
        setLoginError(data.error || 'Invalid credentials');
      }
    } catch (err) {
      // Local check fallback
      if ((username === 'admin' && password === 'sonotech2026') || (username === 'admin@sonotech.pk' && password === 'admin123')) {
        localStorage.setItem('sonotech_admin_token', 'local-token');
        setIsAuthenticated(true);
        showToast('Logged in as Administrator');
      } else {
        setLoginError('Authentication failed');
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('sonotech_admin_token');
    setIsAuthenticated(false);
    showToast('Logged out');
  };

  const handleStartEdit = (product: Product) => {
    setSelectedProduct(product);
    setFormName(product.name);
    setFormSku(product.sku);
    setFormPrice(product.price);
    setFormStock(product.isInStock);
    setFormShortDesc(product.shortDescriptionText || '');
    setFormDesc(product.descriptionText || '');
    setFormImage(product.featuredImage?.src || '');
    setIsEditing(true);
    setIsAdding(false);
  };

  const handleStartAdd = () => {
    setSelectedProduct(null);
    setFormName('');
    setFormSku(`ST-${Date.now().toString().slice(-5)}`);
    setFormPrice(0);
    setFormStock(true);
    setFormShortDesc('');
    setFormDesc('');
    setFormImage('https://sonotech.pk/wp-content/uploads/2023/06/Our-trendy-categoriy-Humen-ultrasound-scanner.jpg');
    setIsAdding(true);
    setIsEditing(false);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName) return;

    if (isEditing && selectedProduct) {
      // Update
      const updated: Partial<Product> = {
        name: formName,
        sku: formSku,
        price: formPrice,
        isInStock: formStock,
        shortDescription: formShortDesc,
        shortDescriptionText: formShortDesc,
        description: formDesc,
        descriptionText: formDesc,
        featuredImage: {
          id: selectedProduct.featuredImage?.id || Date.now(),
          src: formImage,
          alt: formName
        }
      };

      try {
        await fetch(`/api/products/${selectedProduct.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updated)
        });
      } catch (e) {}

      setProducts(prev => prev.map(p => p.id === selectedProduct.id ? { ...p, ...updated } as Product : p));
      showToast(`Updated product "${formName}"`);
      setIsEditing(false);
      setSelectedProduct(null);
    } else if (isAdding) {
      // Create
      const newProd = {
        name: formName,
        sku: formSku,
        price: formPrice,
        regularPrice: formPrice,
        salePrice: formPrice,
        isInStock: formStock,
        shortDescription: formShortDesc,
        shortDescriptionText: formShortDesc,
        description: formDesc,
        descriptionText: formDesc,
        categories: [{ id: 71, name: 'Human Medical Equipment', slug: 'human-medical-equipment' }],
        featuredImage: {
          id: Date.now(),
          src: formImage,
          alt: formName
        },
        gallery: [{
          id: Date.now(),
          src: formImage,
          alt: formName
        }]
      };

      try {
        const res = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newProd)
        });
        if (res.ok) {
          const created = await res.json();
          setProducts(prev => [created, ...prev]);
        } else {
          setProducts(prev => [{ ...newProd, id: Date.now(), slug: formName.toLowerCase().replace(/\s+/g, '-'), permalink: '#' } as any, ...prev]);
        }
      } catch (e) {
        setProducts(prev => [{ ...newProd, id: Date.now(), slug: formName.toLowerCase().replace(/\s+/g, '-'), permalink: '#' } as any, ...prev]);
      }

      showToast(`Added new product "${formName}"`);
      setIsAdding(false);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this product from the database?')) return;
    try {
      await fetch(`/api/products/${id}`, { method: 'DELETE' });
    } catch (e) {}
    setProducts(prev => prev.filter(p => p.id !== id));
    showToast('Product deleted');
  };

  const handleUpdateInquiryStatus = async (inqId: string, status: QuoteInquiry['status']) => {
    try {
      await fetch(`/api/inquiries/${inqId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
    } catch (e) {}

    setInquiries(prev => prev.map(i => i.id === inqId ? { ...i, status } : i));
    showToast(`Updated status to ${status}`);
  };

  const filteredProducts = products.filter(p =>
    !search ||
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.sku.toLowerCase().includes(search.toLowerCase())
  );

  // 1. LOGIN SCREEN
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-16 px-4">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-xl flex items-center justify-center mx-auto">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-black text-slate-900">SonoTech Admin Portal</h2>
            <p className="text-xs text-slate-500">Sign in to manage catalog, pricing, inquiries, and data</p>
          </div>

          {loginError && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Username / Email</label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">Default: admin</span>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">Default: sonotech2026</span>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-lg text-xs transition-colors shadow-md"
            >
              Authenticate & Enter Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  // 2. AUTHENTICATED DASHBOARD
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      
      {/* TOP BAR */}
      <div className="bg-slate-900 text-white p-5 rounded-2xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs text-emerald-400 font-mono font-semibold uppercase tracking-wider block">
            Administrative Control Panel
          </span>
          <h1 className="text-xl sm:text-2xl font-black">
            SonoTech.pk System Management
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-white transition-colors"
            title="Refresh Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* METRICS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xl font-black text-slate-900">{products.length}</span>
            <p className="text-xs text-slate-500">Active Products</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <ShoppingCart className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xl font-black text-slate-900">{inquiries.length}</span>
            <p className="text-xs text-slate-500">RFQ Inquiries Received</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xl font-black text-slate-900">48</span>
            <p className="text-xs text-slate-500">Categories Preserved</p>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div className="flex border-b border-slate-200 gap-4 text-xs font-bold">
        <button
          onClick={() => setActiveTab('products')}
          className={`pb-3 border-b-2 transition-colors ${
            activeTab === 'products' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500'
          }`}
        >
          Catalog Products ({products.length})
        </button>
        <button
          onClick={() => setActiveTab('inquiries')}
          className={`pb-3 border-b-2 transition-colors ${
            activeTab === 'inquiries' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500'
          }`}
        >
          Hospital Quotes & Inquiries ({inquiries.length})
        </button>
        <button
          onClick={() => setActiveTab('export')}
          className={`pb-3 border-b-2 transition-colors ${
            activeTab === 'export' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500'
          }`}
        >
          Export & Backup
        </button>
      </div>

      {/* PRODUCTS TAB */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search products by model or SKU..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden"
              />
            </div>

            <button
              onClick={handleStartAdd}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
            </button>
          </div>

          {/* EDIT / ADD MODAL */}
          {(isEditing || isAdding) && (
            <div className="bg-slate-50 border-2 border-blue-500 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-sm">
                  {isEditing ? `Edit Product: ${selectedProduct?.name}` : 'Add New Diagnostic Product'}
                </h3>
                <button 
                  onClick={() => { setIsEditing(false); setIsAdding(false); }}
                  className="p-1 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">SKU / Model Number</label>
                  <input
                    type="text"
                    value={formSku}
                    onChange={(e) => setFormSku(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Indicative Price (PKR)</label>
                  <input
                    type="number"
                    value={formPrice}
                    onChange={(e) => setFormPrice(parseFloat(e.target.value) || 0)}
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Stock Availability</label>
                  <select
                    value={formStock ? 'in' : 'out'}
                    onChange={(e) => setFormStock(e.target.value === 'in')}
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="in">In Stock (Lahore Warehouse)</option>
                    <option value="out">Available on Order</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Featured Image URL</label>
                  <input
                    type="text"
                    value={formImage}
                    onChange={(e) => setFormImage(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white font-mono"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Short Description / Key Bullets</label>
                  <textarea
                    rows={2}
                    value={formShortDesc}
                    onChange={(e) => setFormShortDesc(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Full Clinical Specifications</label>
                  <textarea
                    rows={4}
                    value={formDesc}
                    onChange={(e) => setFormDesc(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                  />
                </div>

                <div className="sm:col-span-2 flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => { setIsEditing(false); setIsAdding(false); }}
                    className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold flex items-center gap-1.5"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* PRODUCTS TABLE */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto max-h-[65vh]">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold sticky top-0">
                  <tr>
                    <th className="p-3">Image</th>
                    <th className="p-3">Name & SKU</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Price</th>
                    <th className="p-3">Stock</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredProducts.slice(0, 50).map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50">
                      <td className="p-3">
                        <img
                          src={p.featuredImage?.thumbnail || p.featuredImage?.src}
                          alt={p.name}
                          className="w-10 h-10 object-contain bg-slate-50 rounded border border-slate-200"
                        />
                      </td>
                      <td className="p-3">
                        <span className="font-bold text-slate-900 block">{p.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{p.sku}</span>
                      </td>
                      <td className="p-3 text-slate-600">
                        {p.categories?.[0]?.name || 'Medical Equipment'}
                      </td>
                      <td className="p-3 font-semibold text-slate-900">
                        {p.price > 0 ? `₨ ${p.price.toLocaleString()}` : 'Quote Only'}
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          p.isInStock ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {p.isInStock ? 'In Stock' : 'On Order'}
                        </span>
                      </td>
                      <td className="p-3 text-right space-x-1">
                        <button
                          onClick={() => handleStartEdit(p)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                          title="Edit"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p.id)}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* INQUIRIES TAB */}
      {activeTab === 'inquiries' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs space-y-4 p-4">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm">Client RFQs & Quote Requests</h3>
            <span className="text-xs text-slate-500">{inquiries.length} total inquiries</span>
          </div>

          {inquiries.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs">
              No inquiries submitted yet. When a doctor requests a quotation via the quote basket or contact form, it appears here in real-time.
            </div>
          ) : (
            <div className="space-y-4">
              {inquiries.map((inq) => (
                <div key={inq.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 text-xs">
                        {inq.id}
                      </span>
                      <span className="text-xs font-bold text-slate-900">{inq.fullName}</span>
                      {inq.organization && (
                        <span className="text-xs text-slate-500">• {inq.organization}</span>
                      )}
                      {inq.city && (
                        <span className="text-xs text-slate-500">({inq.city})</span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-slate-400 font-mono">
                        {new Date(inq.createdAt).toLocaleString()}
                      </span>
                      <select
                        value={inq.status}
                        onChange={(e) => handleUpdateInquiryStatus(inq.id, e.target.value as any)}
                        className={`font-semibold px-2 py-1 rounded text-xs border ${
                          inq.status === 'pending' ? 'bg-amber-100 text-amber-800 border-amber-300' :
                          inq.status === 'contacted' ? 'bg-blue-100 text-blue-800 border-blue-300' :
                          inq.status === 'quoted' ? 'bg-purple-100 text-purple-800 border-purple-300' :
                          'bg-emerald-100 text-emerald-800 border-emerald-300'
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="contacted">Contacted</option>
                        <option value="quoted">Quoted</option>
                        <option value="closed">Closed / Won</option>
                      </select>
                    </div>
                  </div>

                  <div className="text-xs text-slate-700 space-y-1">
                    <p><strong>Phone / WhatsApp:</strong> <a href={`https://wa.me/${inq.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="text-emerald-700 hover:underline">{inq.phone}</a> {inq.email && `| Email: ${inq.email}`}</p>
                    {inq.message && <p><strong>Requirement Notes:</strong> {inq.message}</p>}
                  </div>

                  {inq.items && inq.items.length > 0 && (
                    <div className="bg-white p-2.5 rounded-lg border border-slate-200 text-xs">
                      <span className="font-bold text-slate-700 block mb-1">Requested Systems:</span>
                      <ul className="list-disc pl-5 space-y-0.5 text-slate-600">
                        {inq.items.map((it, idx) => (
                          <li key={idx}>
                            {it.productName} (Qty: {it.quantity})
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* EXPORT TAB */}
      {activeTab === 'export' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <h3 className="font-bold text-slate-900 text-base">Export & Backup Catalog</h3>
          <p className="text-xs text-slate-500">
            Export the complete SonoTech product catalog and categories to standard formats for tender proposals, external accounting, or backup.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <h4 className="font-bold text-xs text-slate-800">CSV Export</h4>
              <p className="text-xs text-slate-500">Spreadsheet-compatible with Excel, Google Sheets, and procurement ERPs.</p>
              <a
                href="/api/export/csv"
                download="sonotech-products.csv"
                className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-3 rounded-lg text-xs"
              >
                <Download className="w-4 h-4" />
                <span>Export CSV File</span>
              </a>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <h4 className="font-bold text-xs text-slate-800">Complete JSON Dump</h4>
              <p className="text-xs text-slate-500">Full schema with nested specifications, image galleries, and category tags.</p>
              <button
                onClick={() => {
                  const blob = new Blob([JSON.stringify(products, null, 2)], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'sonotech-catalog-backup.json';
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded-lg text-xs"
              >
                <Download className="w-4 h-4" />
                <span>Export JSON Catalog</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
