import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Menu, 
  X, 
  ChevronDown, 
  ShoppingCart,
  Heart
} from 'lucide-react';
import { useQuote } from '../context/QuoteContext';
import { Logo } from './Logo';
import { Product } from '../types';
import localProducts from '../data/products.json';
import localCategories from '../data/categories.json';

export const Header: React.FC = () => {
  const { 
    quoteCount, 
    openQuoteModal, 
    wishlist, 
    currentPage, 
    setCurrentPage, 
    selectedCategory,
    setSelectedCategory,
    setSearchQuery: setGlobalSearch,
    openProductModal
  } = useQuote();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const products = localProducts as Product[];
  const categories = localCategories as { name: string; slug: string }[];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchInput.trim().length >= 2) {
      const q = searchInput.trim().toLowerCase();
      const matched = products.filter(p => 
        p.name.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.categories.some(c => c.name.toLowerCase().includes(q))
      );
      setSearchResults(matched.slice(0, 5));
      setShowSearchDropdown(true);
    } else {
      setSearchResults([]);
      setShowSearchDropdown(false);
    }
  }, [searchInput, products]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSearchDropdown(false);
    setGlobalSearch(searchInput);
    setSelectedCategory('all');
    setCurrentPage('shop');
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
      
      {/* 1. MOVING TICKER WITH NEW CONTACT DETAILS */}
      <div className="bg-slate-950 text-slate-300 text-xs py-2 overflow-hidden border-b border-slate-900 select-none">
        <div className="animate-marquee whitespace-nowrap flex items-center gap-12 font-medium">
          <span>• Medas Medical Supplier — Official Diagnostic Ultrasound & Medical Equipment</span>
          <span>• Iqbal Avenue Housing Society, Lahore, Pakistan • Helplines: +92 321 4500997</span>
          <span>• Email: medasmedicalsuppliers@gmail.com • Direct Delivery across Pakistan</span>
          <span>• Ask Our Team About Warranty, Testing & Installation Support</span>
          <span>• Medas Medical Supplier — Official Diagnostic Ultrasound & Medical Equipment</span>
          <span>• Iqbal Avenue Housing Society, Lahore, Pakistan • Helplines: +92 321 4500997</span>
          <span>• Email: medasmedicalsuppliers@gmail.com • Direct Delivery across Pakistan</span>
          <span>• Ask Our Team About Warranty, Testing & Installation Support</span>
        </div>
      </div>

      {/* 2. MAIN HEADER (LOGO GRAPHIC ONLY, SEARCH BAR, ORDER ACTIONS) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5">
        <div className="flex items-center justify-between gap-6">
          
          {/* COMPLETE GRAPHIC LOGO (NO SEPARATE TEXT BESIDE IT) */}
          <div 
            onClick={() => setCurrentPage('home')}
            className="cursor-pointer shrink-0"
            title="Medas Medical Supplier"
          >
            <Logo className="h-10 sm:h-12" />
          </div>

          {/* SEARCH BAR */}
          <div ref={searchRef} className="hidden md:flex flex-1 max-w-lg relative">
            <form onSubmit={handleSearchSubmit} className="flex w-full rounded-xl border border-slate-200 bg-slate-50 focus-within:bg-white focus-within:border-slate-800 focus-within:ring-2 focus-within:ring-slate-100 transition-all overflow-hidden">
              <input
                type="text"
                placeholder="Search ultrasound scanners, probes, ECG, monitors..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onFocus={() => { if (searchResults.length > 0) setShowSearchDropdown(true); }}
                className="w-full px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 bg-transparent focus:outline-hidden"
              />

              {searchInput && (
                <button
                  type="button"
                  onClick={() => setSearchInput('')}
                  className="px-2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              <button
                type="submit"
                className="px-4 text-slate-500 hover:text-slate-900 transition-colors"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>

            {/* INSTANT SEARCH RESULTS */}
            {showSearchDropdown && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden divide-y divide-slate-100">
                {searchResults.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => {
                      setShowSearchDropdown(false);
                      openProductModal(product);
                    }}
                    className="flex items-center gap-3 p-3 hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <img 
                      src={product.featuredImage?.thumbnail || product.featuredImage?.src} 
                      alt={product.name}
                      className="w-10 h-10 object-contain bg-slate-50 rounded-lg border border-slate-200 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 truncate">{product.name}</h4>
                      <p className="text-[10px] text-slate-500 font-mono">{product.sku}</p>
                    </div>
                    <span className="text-xs font-semibold text-slate-800 shrink-0">
                      View →
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ACTIONS */}
          <div className="flex items-center gap-3">
            <a
              href="https://wa.me/923214500997?text=Hello%20Medas%20Medical%20Supplier,%20I%20would%20like%20to%20place%20an%20order."
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-2 bg-slate-900 hover:bg-black text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-xs transition-colors uppercase tracking-wider"
            >
              <span>Order on WhatsApp</span>
            </a>

            <button
              onClick={() => {
                setSelectedCategory('all');
                setCurrentPage('shop');
              }}
              title="Saved Items"
              className="p-2.5 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-xl relative transition-colors"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 bg-rose-600 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            <button
              onClick={() => openQuoteModal()}
              className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-900 px-3.5 py-2.5 rounded-xl font-bold text-xs transition-colors"
            >
              <ShoppingCart className="w-4 h-4 text-slate-700" />
              <span className="hidden sm:inline">Orders</span>
              {quoteCount > 0 && (
                <span className="bg-slate-900 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                  {quoteCount}
                </span>
              )}
            </button>

            {/* MOBILE MENU TOGGLE */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-slate-700 md:hidden rounded-lg hover:bg-slate-100"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>

        {/* MOBILE SEARCH */}
        <div className="mt-3 md:hidden">
          <form onSubmit={handleSearchSubmit} className="flex rounded-xl border border-slate-200 bg-slate-50 overflow-hidden">
            <input
              type="text"
              placeholder="Search equipment, models, probes..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full px-3 py-2 text-xs text-slate-800 placeholder-slate-400 bg-transparent focus:outline-hidden"
            />
            <button
              type="submit"
              className="bg-slate-900 text-white px-3 flex items-center justify-center"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* 3. CENTERED MENUS WITH EQUAL AUTO SPACING ACROSS ALL PAGES */}
      <nav className="hidden md:block border-t border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-center gap-8 lg:gap-12 py-3 text-xs font-semibold uppercase tracking-wider text-slate-700">
            
            <button
              onClick={() => setCurrentPage('home')}
              className={`hover:text-blue-600 transition-colors py-1 ${
                currentPage === 'home' ? 'text-blue-600 font-bold border-b-2 border-blue-600' : ''
              }`}
            >
              Home
            </button>

            {/* ALL CATEGORIES MENU */}
            <div className="relative group">
              <button className="flex items-center gap-1 hover:text-blue-600 transition-colors py-1">
                <span>All Categories</span><ChevronDown className="w-3.5 h-3.5 opacity-60 group-hover:rotate-180 transition-transform" />
              </button>
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-72 max-h-[70vh] overflow-y-auto bg-white rounded-2xl shadow-xl border border-slate-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                {categories.map((category) => (
                  <button key={category.slug} onClick={() => { setSelectedCategory(category.slug); setCurrentPage('shop'); }} className="w-full text-left px-4 py-2 text-[11px] normal-case tracking-normal hover:bg-blue-50 hover:text-blue-700 transition-colors text-slate-700">
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            {/* HUMAN MEDICAL DROPDOWN */}
            <div className="relative group">
              <button
                onClick={() => {
                  setSelectedCategory('human-medical-equipment');
                  setCurrentPage('shop');
                }}
                className={`flex items-center gap-1 hover:text-blue-600 transition-colors py-1 ${
                  currentPage === 'shop' && selectedCategory.includes('human') ? 'text-blue-600 font-bold border-b-2 border-blue-600' : ''
                }`}
              >
                <span>Human Medical</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 group-hover:rotate-180 transition-transform" />
              </button>

              <div className="absolute top-full left-1/2 -translate-x-1/2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 py-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <button
                  onClick={() => {
                    setSelectedCategory('ultrasound-scanners');
                    setCurrentPage('shop');
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-slate-50 hover:text-blue-600 transition-colors text-slate-700"
                >
                  Ultrasound Scanners
                </button>
                <button
                  onClick={() => {
                    setSelectedCategory('portable-color-dopplers');
                    setCurrentPage('shop');
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-slate-50 hover:text-blue-600 transition-colors text-slate-700"
                >
                  Portable Color Dopplers
                </button>
                <button
                  onClick={() => {
                    setSelectedCategory('trolly-mounted-color-dopplers');
                    setCurrentPage('shop');
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-slate-50 hover:text-blue-600 transition-colors text-slate-700"
                >
                  Trolley Color Dopplers
                </button>
                <button
                  onClick={() => {
                    setSelectedCategory('usb-and-wifi-ultrasound');
                    setCurrentPage('shop');
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-slate-50 hover:text-blue-600 transition-colors text-slate-700"
                >
                  Wireless & USB Probes
                </button>
                <button
                  onClick={() => {
                    setSelectedCategory('ultrasound-probes');
                    setCurrentPage('shop');
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-slate-50 hover:text-blue-600 transition-colors text-slate-700"
                >
                  Compatible Probes
                </button>
                <button
                  onClick={() => {
                    setSelectedCategory('patient-monitors');
                    setCurrentPage('shop');
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-slate-50 hover:text-blue-600 transition-colors text-slate-700"
                >
                  Patient Monitors & CTG
                </button>
                <button
                  onClick={() => {
                    setSelectedCategory('accessories');
                    setCurrentPage('shop');
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-slate-50 hover:text-blue-600 transition-colors text-slate-700"
                >
                  Medical Accessories
                </button>
              </div>
            </div>

            {/* VETERINARY MEDICAL DROPDOWN */}
            <div className="relative group">
              <button
                onClick={() => {
                  setSelectedCategory('vterinary-medical-equipment');
                  setCurrentPage('shop');
                }}
                className={`flex items-center gap-1 hover:text-blue-600 transition-colors py-1 ${
                  currentPage === 'shop' && selectedCategory.includes('vet') ? 'text-blue-600 font-bold border-b-2 border-blue-600' : ''
                }`}
              >
                <span>Veterinary Equipment</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 group-hover:rotate-180 transition-transform" />
              </button>

              <div className="absolute top-full left-1/2 -translate-x-1/2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 py-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <button
                  onClick={() => {
                    setSelectedCategory('veterinary-ultrasound');
                    setCurrentPage('shop');
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-slate-50 hover:text-blue-600 transition-colors text-slate-700"
                >
                  Veterinary Ultrasound Scanners
                </button>
                <button
                  onClick={() => {
                    setSelectedCategory('portable-veterinary-ultrasound-machines');
                    setCurrentPage('shop');
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-slate-50 hover:text-blue-600 transition-colors text-slate-700"
                >
                  Portable Vet Scanners
                </button>
                <button
                  onClick={() => {
                    setSelectedCategory('handheld-veterinary-ultrasound-machines');
                    setCurrentPage('shop');
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-slate-50 hover:text-blue-600 transition-colors text-slate-700"
                >
                  Handheld Vet Ultrasound
                </button>
                <button
                  onClick={() => {
                    setSelectedCategory('estrous-detectors');
                    setCurrentPage('shop');
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-slate-50 hover:text-blue-600 transition-colors text-slate-700"
                >
                  Estrous & Pregnancy Detectors
                </button>
                <button
                  onClick={() => {
                    setSelectedCategory('veterinay-lab-equipment');
                    setCurrentPage('shop');
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-slate-50 hover:text-blue-600 transition-colors text-slate-700"
                >
                  Veterinary Lab Equipment
                </button>
              </div>
            </div>

            <button
              onClick={() => {
                setSelectedCategory('all');
                setCurrentPage('shop');
              }}
              className={`hover:text-blue-600 transition-colors py-1 ${
                currentPage === 'shop' && selectedCategory === 'all' ? 'text-blue-600 font-bold border-b-2 border-blue-600' : ''
              }`}
            >
              All Products
            </button>

            <button
              onClick={() => setCurrentPage('about')}
              className={`hover:text-blue-600 transition-colors py-1 ${
                currentPage === 'about' ? 'text-blue-600 font-bold border-b-2 border-blue-600' : ''
              }`}
            >
              About Medas
            </button>

            <button
              onClick={() => setCurrentPage('reviews')}
              className={`hover:text-blue-600 transition-colors py-1 ${
                currentPage === 'reviews' ? 'text-blue-600 font-bold border-b-2 border-blue-600' : ''
              }`}
            >
              Reviews
            </button>

            <button
              onClick={() => setCurrentPage('contact')}
              className={`hover:text-blue-600 transition-colors py-1 ${
                currentPage === 'contact' ? 'text-blue-600 font-bold border-b-2 border-blue-600' : ''
              }`}
            >
              Contact Us
            </button>

          </div>
        </div>
      </nav>

      {/* 4. MOBILE DRAWER */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 md:hidden flex justify-start">
          <div className="w-4/5 max-w-sm bg-white h-full shadow-2xl flex flex-col overflow-y-auto">
            <div className="p-4 bg-slate-950 text-white flex justify-between items-center">
              <Logo className="h-9" />
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-4 border-b border-slate-200 text-xs">
              <a href="tel:+923214500997" className="font-bold text-slate-900 block mb-1">
                +92 321 4500997
              </a>
              <p className="text-slate-500">Iqbal Avenue Housing Society, Lahore</p>
            </div>

            <div className="py-2 flex-1 text-xs">
              <button
                onClick={() => { setCurrentPage('home'); setIsMobileMenuOpen(false); }}
                className="w-full text-left px-5 py-3 font-semibold text-slate-800 hover:bg-slate-50 border-b border-slate-100"
              >
                Home
              </button>
              
              <button
                onClick={() => { setSelectedCategory('human-medical-equipment'); setCurrentPage('shop'); setIsMobileMenuOpen(false); }}
                className="w-full text-left px-5 py-3 font-semibold text-slate-800 hover:bg-slate-50 border-b border-slate-100 flex items-center justify-between"
              >
                <span>Human Medical Equipment</span>
                <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded">82</span>
              </button>

              <button
                onClick={() => { setSelectedCategory('vterinary-medical-equipment'); setCurrentPage('shop'); setIsMobileMenuOpen(false); }}
                className="w-full text-left px-5 py-3 font-semibold text-slate-800 hover:bg-slate-50 border-b border-slate-100 flex items-center justify-between"
              >
                <span>Veterinary Medical Equipment</span>
                <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded">54</span>
              </button>

              <button
                onClick={() => { setSelectedCategory('all'); setCurrentPage('shop'); setIsMobileMenuOpen(false); }}
                className="w-full text-left px-5 py-3 font-semibold text-slate-800 hover:bg-slate-50 border-b border-slate-100"
              >
                All Products ({products.length})
              </button>

              <button
                onClick={() => { setCurrentPage('about'); setIsMobileMenuOpen(false); }}
                className="w-full text-left px-5 py-3 font-semibold text-slate-800 hover:bg-slate-50 border-b border-slate-100"
              >
                About Medas Medical Supplier
              </button>

              <button
                onClick={() => { setCurrentPage('reviews'); setIsMobileMenuOpen(false); }}
                className="w-full text-left px-5 py-3 font-semibold text-slate-800 hover:bg-slate-50 border-b border-slate-100"
              >
                Customer Reviews
              </button>

              <button
                onClick={() => { setCurrentPage('contact'); setIsMobileMenuOpen(false); }}
                className="w-full text-left px-5 py-3 font-semibold text-slate-800 hover:bg-slate-50 border-b border-slate-100"
              >
                Contact Us
              </button>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200">
              <a
                href="https://wa.me/923214500997"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-black text-white py-2.5 rounded-xl font-bold text-xs"
              >
                <span>WhatsApp: +92 321 4500997</span>
              </a>
            </div>
          </div>
        </div>
      )}

    </header>
  );
};
