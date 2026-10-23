import React, { useState, useEffect, useMemo } from 'react';
import { useQuote } from '../context/QuoteContext';
import { ProductCard } from '../components/ProductCard';
import { Product, Category } from '../types';
import localProducts from '../data/products.json';
import localCategories from '../data/categories.json';
import { 
  Search, 
  SlidersHorizontal, 
  Grid, 
  List, 
  X, 
  ChevronRight, 
  Check, 
  ChevronDown,
  Layers,
  Sparkles
} from 'lucide-react';

export const ShopPage: React.FC = () => {
  const { 
    selectedCategory, 
    setSelectedCategory, 
    searchQuery, 
    setSearchQuery: setGlobalSearch 
  } = useQuote();

  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'default' | 'name-asc' | 'name-desc' | 'price-low' | 'price-high'>('default');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const categories = localCategories as Category[];
  const allProducts = localProducts as Product[];

  // Sync global search with local
  useEffect(() => {
    setLocalSearch(searchQuery);
    setCurrentPage(1);
  }, [searchQuery]);

  // Reset page when category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, inStockOnly, sortBy]);

  // Filter & Sort Products
  const filteredProducts = useMemo(() => {
    let result = [...allProducts];

    // Search query
    if (localSearch.trim()) {
      const q = localSearch.trim().toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.descriptionText?.toLowerCase().includes(q) ||
        p.shortDescriptionText?.toLowerCase().includes(q) ||
        p.categories.some(c => c.name.toLowerCase().includes(q))
      );
    }

    // Category filter
    if (selectedCategory && selectedCategory !== 'all') {
      const cat = selectedCategory.toLowerCase();
      result = result.filter(p =>
        p.categories.some(c => c.slug.toLowerCase() === cat || c.slug.toLowerCase().includes(cat))
      );
    }

    // In stock filter
    if (inStockOnly) {
      result = result.filter(p => p.isInStock);
    }

    // Sorting
    if (sortBy === 'name-asc') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'name-desc') {
      result.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sortBy === 'price-low') {
      result.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => (b.price || 0) - (a.price || 0));
    }

    return result;
  }, [allProducts, localSearch, selectedCategory, inStockOnly, sortBy]);

  // Pagination calculation
  const totalItems = filteredProducts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  const currentCatObj = categories.find(c => c.slug === selectedCategory);

  // Group categories into root divisions
  const humanCategories = categories.filter(c => 
    c.parentSlug === 'human-medical-equipment' || 
    c.slug === 'human-medical-equipment' ||
    c.parentSlug === 'ultrasound-scanners' ||
    c.parentSlug === 'ultrasound-probes' ||
    c.parentSlug === 'accessories' ||
    c.parentSlug === 'lab-daignistic-equipment'
  );

  const vetCategories = categories.filter(c => 
    c.parentSlug === 'vterinary-medical-equipment' || 
    c.slug === 'vterinary-medical-equipment' ||
    c.parentSlug === 'veterinary-ultrasound'
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      
      {/* 1. BREADCRUMBS & PAGE HEADER */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
          <span 
            className="hover:text-blue-600 cursor-pointer"
            onClick={() => setSelectedCategory('all')}
          >
            All Products
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-900 font-semibold">
            {currentCatObj ? currentCatObj.name : 'Complete Equipment Catalog'}
          </span>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              {currentCatObj ? currentCatObj.name : 'All Diagnostic Systems & Accessories'}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              {currentCatObj?.description || `${totalItems} diagnostic ultrasound and healthcare devices available`}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">
              Total Systems: <strong className="text-slate-900">{totalItems}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* 2. MAIN LAYOUT: SIDEBAR + PRODUCT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* SIDEBAR FILTERS */}
        <div className="space-y-6">
          
          {/* SEARCH IN SHOP */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Filter By Keyword</h4>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search models, probes, Doppler..."
                value={localSearch}
                onChange={(e) => {
                  setLocalSearch(e.target.value);
                  setGlobalSearch(e.target.value);
                }}
                className="w-full pl-9 pr-8 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
              {localSearch && (
                <button
                  onClick={() => {
                    setLocalSearch('');
                    setGlobalSearch('');
                  }}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* STOCK STATUS FILTER */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Availability</h4>
            <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
              />
              <span>In Stock in Lahore Warehouse Only</span>
            </label>
          </div>

          {/* CATEGORIES ACCORDION */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Categories</h4>
              {selectedCategory !== 'all' && (
                <button
                  onClick={() => setSelectedCategory('all')}
                  className="text-[11px] text-blue-600 hover:underline"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="space-y-4 text-xs max-h-[60vh] overflow-y-auto pr-1">
              
              {/* ALL PRODUCTS OPTION */}
              <button
                onClick={() => setSelectedCategory('all')}
                className={`w-full text-left py-1.5 px-2.5 rounded-lg flex items-center justify-between font-medium transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-blue-600 text-white font-bold'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>All Products</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded ${selectedCategory === 'all' ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-500'}`}>
                  {allProducts.length}
                </span>
              </button>

              {/* HUMAN MEDICAL HEADING */}
              <div className="pt-2">
                <span className="font-bold text-[11px] uppercase tracking-wider text-blue-900 block mb-1 px-2">
                  Human Medical Equipment ({categories.find(c => c.slug === 'human-medical-equipment')?.count ?? 0})
                </span>
                <div className="space-y-1 pl-2">
                  {humanCategories.slice(0, 16).map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.slug)}
                      className={`w-full text-left py-1 px-2 rounded-md flex items-center justify-between transition-colors ${
                        selectedCategory === cat.slug
                          ? 'bg-blue-100 text-blue-900 font-bold'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span className="truncate pr-1">{cat.name}</span>
                      <span className="text-[10px] text-slate-400 font-mono shrink-0">{cat.count}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* VETERINARY MEDICAL HEADING */}
              <div className="pt-2 border-t border-slate-100">
                <span className="font-bold text-[11px] uppercase tracking-wider text-emerald-900 block mb-1 px-2">
                  Veterinary Medical Equipment ({categories.find(c => c.slug === 'vterinary-medical-equipment')?.count ?? 0})
                </span>
                <div className="space-y-1 pl-2">
                  {vetCategories.slice(0, 12).map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.slug)}
                      className={`w-full text-left py-1 px-2 rounded-md flex items-center justify-between transition-colors ${
                        selectedCategory === cat.slug
                          ? 'bg-emerald-100 text-emerald-900 font-bold'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span className="truncate pr-1">{cat.name}</span>
                      <span className="text-[10px] text-slate-400 font-mono shrink-0">{cat.count}</span>
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* ACTIVE FILTER RESET */}
          {(selectedCategory !== 'all' || localSearch || inStockOnly) && (
            <button
              onClick={() => {
                setSelectedCategory('all');
                setLocalSearch('');
                setGlobalSearch('');
                setInStockOnly(false);
              }}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors"
            >
              Reset All Filters
            </button>
          )}

        </div>

        {/* MAIN PRODUCT CATALOG (3 COLS) */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* CONTROL BAR: SORT & VIEW SWITCH */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
            
            <div className="text-xs text-slate-500 font-medium">
              Showing <span className="font-bold text-slate-800">{totalItems === 0 ? 0 : startIndex + 1} - {Math.min(startIndex + itemsPerPage, totalItems)}</span> of <span className="font-bold text-slate-800">{totalItems}</span> diagnostic products
            </div>

            <div className="flex items-center gap-3">
              {/* SORT SELECTOR */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-500 hidden sm:inline">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 focus:outline-hidden"
                >
                  <option value="default">Default Catalog Order</option>
                  <option value="name-asc">Product Name (A - Z)</option>
                  <option value="name-desc">Product Name (Z - A)</option>
                  <option value="price-low">Price (Low to High)</option>
                  <option value="price-high">Price (High to Low)</option>
                </select>
              </div>

              {/* VIEW MODE TOGGLE */}
              <div className="flex items-center border border-slate-200 rounded-lg p-0.5 bg-slate-50">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-md transition-colors ${
                    viewMode === 'grid' ? 'bg-white shadow-xs text-blue-600' : 'text-slate-400 hover:text-slate-600'
                  }`}
                  title="Grid View"
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-md transition-colors ${
                    viewMode === 'list' ? 'bg-white shadow-xs text-blue-600' : 'text-slate-400 hover:text-slate-600'
                  }`}
                  title="List View"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>

          {/* ACTIVE FILTER CHIPS */}
          {(selectedCategory !== 'all' || localSearch || inStockOnly) && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-400">Active Filters:</span>
              
              {selectedCategory !== 'all' && (
                <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-xs px-2.5 py-1 rounded-full font-medium border border-blue-200">
                  <span>Category: {currentCatObj?.name || selectedCategory}</span>
                  <button onClick={() => setSelectedCategory('all')}>
                    <X className="w-3 h-3 hover:text-blue-900" />
                  </button>
                </span>
              )}

              {localSearch && (
                <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-xs px-2.5 py-1 rounded-full font-medium border border-blue-200">
                  <span>Keyword: "{localSearch}"</span>
                  <button onClick={() => { setLocalSearch(''); setGlobalSearch(''); }}>
                    <X className="w-3 h-3 hover:text-blue-900" />
                  </button>
                </span>
              )}

              {inStockOnly && (
                <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-xs px-2.5 py-1 rounded-full font-medium border border-emerald-200">
                  <span>In Stock Only</span>
                  <button onClick={() => setInStockOnly(false)}>
                    <X className="w-3 h-3 hover:text-emerald-900" />
                  </button>
                </span>
              )}
            </div>
          )}

          {/* PRODUCT LISTING */}
          {paginatedProducts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
              <Layers className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-lg font-bold text-slate-800">No matching medical products found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try searching for broader keywords like "Ultrasound", "Doppler", "Probe", or reset active filters.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setLocalSearch('');
                  setGlobalSearch('');
                  setInStockOnly(false);
                }}
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className={
              viewMode === 'grid' 
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' 
                : 'space-y-4'
            }>
              {paginatedProducts.map(p => (
                <ProductCard key={p.id} product={p} viewMode={viewMode} />
              ))}
            </div>
          )}

          {/* PAGINATION CONTROLS */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6">
              <button
                onClick={() => {
                  setCurrentPage(Math.max(1, currentPage - 1));
                  window.scrollTo({ top: 120, behavior: 'smooth' });
                }}
                disabled={currentPage === 1}
                className="px-3.5 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40"
              >
                Previous
              </button>

              <div className="flex items-center gap-1">
                {[...Array(totalPages)].map((_, i) => {
                  const pNum = i + 1;
                  return (
                    <button
                      key={pNum}
                      onClick={() => {
                        setCurrentPage(pNum);
                        window.scrollTo({ top: 120, behavior: 'smooth' });
                      }}
                      className={`w-8 h-8 rounded-lg text-xs font-bold transition-colors ${
                        currentPage === pNum
                          ? 'bg-blue-600 text-white'
                          : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {pNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => {
                  setCurrentPage(Math.min(totalPages, currentPage + 1));
                  window.scrollTo({ top: 120, behavior: 'smooth' });
                }}
                disabled={currentPage === totalPages}
                className="px-3.5 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
