import React, { useState } from 'react';
import { useQuote } from '../context/QuoteContext';
import { 
  ArrowLeft, 
  ShoppingCart, 
  MessageCircle, 
  Heart, 
  CheckCircle2, 
  ShieldCheck, 
  Truck, 
  Share2, 
  ChevronRight, 
  Printer, 
  Maximize2 
} from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import localProducts from '../data/products.json';
import { Product } from '../types';

export const ProductDetailPage: React.FC = () => {
  const { 
    activeProduct: product, 
    setCurrentPage, 
    setSelectedCategory, 
    toggleWishlist, 
    isInWishlist,
    showToast 
  } = useQuote();

  const [selectedImgIndex, setSelectedImgIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'warranty' | 'shipping'>('desc');
  const [quantity, setQuantity] = useState(1);
  const [showFullImageModal, setShowFullImageModal] = useState(false);

  const allProducts = localProducts as Product[];

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">No Product Selected</h2>
        <p className="text-sm text-slate-500">Please choose a medical device from our catalog.</p>
        <button
          onClick={() => setCurrentPage('shop')}
          className="px-6 py-2.5 bg-slate-900 text-white font-semibold rounded-xl text-sm"
        >
          Return to Catalog
        </button>
      </div>
    );
  }

  const isWishlisted = isInWishlist(product.id);
  const images = product.gallery && product.gallery.length > 0 ? product.gallery : (product.featuredImage ? [product.featuredImage] : []);
  const currentImage = images[selectedImgIndex] || product.featuredImage;

  const mainCatSlug = product.categories?.[0]?.slug;
  const relatedProducts = allProducts
    .filter(p => p.id !== product.id && p.categories?.some(c => c.slug === mainCatSlug))
    .slice(0, 4);

  const directOrderWhatsApp = encodeURIComponent(
    `Hello Medas Medical Supplier,\nI want to order "${product.name}" (Qty: ${quantity}, SKU: ${product.sku}).\nPlease confirm pricing, warranty, and dispatch time to my clinic.`
  );

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Product link copied to clipboard');
    }
  };

  return (
    <div className="bg-white min-h-screen pb-20">
      
      {/* 1. TOP BREADCRUMB & BACK BUTTON */}
      <div className="border-b border-slate-200 bg-slate-50/70">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-600 overflow-x-auto whitespace-nowrap">
            <button
              onClick={() => setCurrentPage('shop')}
              className="flex items-center gap-1.5 text-blue-600 hover:text-blue-800 font-semibold transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Catalog</span>
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span 
              onClick={() => setCurrentPage('home')}
              className="hover:text-blue-600 cursor-pointer"
            >
              Home
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            {product.categories?.[0] && (
              <span 
                onClick={() => {
                  setSelectedCategory(product.categories[0].slug);
                  setCurrentPage('shop');
                }}
                className="hover:text-blue-600 cursor-pointer font-medium text-slate-700"
              >
                {product.categories[0].name}
              </span>
            )}
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-900 font-bold truncate max-w-xs">{product.name}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 rounded-lg transition-colors"
              title="Share Link"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => window.print()}
              className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 rounded-lg transition-colors"
              title="Print Specification"
            >
              <Printer className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. MAIN FULL-PAGE PRODUCT SHOWCASE */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* LEFT: HUGE IMAGE GALLERY & THUMBNAILS */}
          <div className="lg:col-span-6 space-y-4">
            <div className="w-full h-96 sm:h-[480px] bg-slate-50 rounded-2xl p-6 border border-slate-200 flex items-center justify-center relative overflow-hidden group">
              <img
                src={currentImage?.src || 'https://sonotech.pk/wp-content/uploads/2023/06/Our-trendy-categoriy-Humen-ultrasound-scanner.jpg'}
                alt={currentImage?.alt || product.name}
                className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
              />
              <button
                onClick={() => setShowFullImageModal(true)}
                className="absolute bottom-4 right-4 bg-white/90 hover:bg-white text-slate-700 p-2 rounded-xl text-xs font-semibold shadow-xs border border-slate-200 flex items-center gap-1.5 transition-colors"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Enlarge</span>
              </button>
            </div>

            {/* THUMBNAILS */}
            {images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button
                    key={img.id || idx}
                    onClick={() => setSelectedImgIndex(idx)}
                    className={`w-20 h-20 rounded-xl border-2 p-1.5 bg-white shrink-0 overflow-hidden transition-all ${
                      selectedImgIndex === idx
                        ? 'border-blue-600 ring-2 ring-blue-100 shadow-xs'
                        : 'border-slate-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img 
                      src={img.thumbnail || img.src} 
                      alt={img.alt || `gallery ${idx}`} 
                      className="w-full h-full object-contain"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: CLEAN PRODUCT INFORMATION & ACTIONS */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                {product.categories.map(c => (
                  <span 
                    key={c.id} 
                    onClick={() => {
                      setSelectedCategory(c.slug);
                      setCurrentPage('shop');
                    }}
                    className="text-xs font-semibold text-blue-700 bg-blue-50 px-3 py-1 rounded-full cursor-pointer hover:bg-blue-100 transition-colors"
                  >
                    {c.name}
                  </span>
                ))}
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                {product.name}
              </h1>

              <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-slate-500">
                <span className="font-mono bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md font-semibold">
                  SKU: {product.sku}
                </span>
                <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{product.isInStock ? 'In Stock (Iqbal Avenue, Lahore)' : 'Availability on Request'}</span>
                </span>
              </div>
            </div>

            {/* PRICE CONTAINER */}
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
              <span className="text-xs uppercase font-bold text-slate-500 tracking-wider">
                Price / Quotation
              </span>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-black text-slate-900">
                  {product.price > 0 ? `₨ ${product.price.toLocaleString()}` : (product.priceHtml || 'Contact for Price')}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Contact Medas Medical Suppliers to confirm warranty, installation, and availability details.
              </p>
            </div>

            {/* SHORT SUMMARY */}
            {product.shortDescriptionText ? (
              <div className="text-xs text-slate-600 leading-relaxed space-y-2 border-l-2 border-slate-800 pl-3">
                <p>{product.shortDescriptionText}</p>
              </div>
            ) : product.descriptionText ? (
              <div className="text-xs text-slate-600 leading-relaxed border-l-2 border-slate-800 pl-3">
                <p className="line-clamp-3">{product.descriptionText}</p>
              </div>
            ) : null}

            {/* QUANTITY & BUY IT NOW BUTTON CONNECTING DIRECTLY TO WHATSAPP */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-slate-300 rounded-xl overflow-hidden bg-white">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-3 text-slate-600 hover:bg-slate-100 font-bold transition-colors"
                  >
                    -
                  </button>
                  <span className="px-4 py-3 font-bold text-sm text-slate-800">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-3 text-slate-600 hover:bg-slate-100 font-bold transition-colors"
                  >
                    +
                  </button>
                </div>

                {/* BUY IT NOW (DIRECT WHATSAPP ORDER) */}
                <a
                  href={`https://wa.me/923214500997?text=${directOrderWhatsApp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-slate-900 hover:bg-black text-white font-bold py-3.5 px-6 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wider"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Buy It Now</span>
                </a>

                <button
                  onClick={() => toggleWishlist(product)}
                  className={`p-3.5 rounded-xl border transition-colors ${
                    isWishlisted
                      ? 'bg-rose-50 border-rose-300 text-rose-600'
                      : 'border-slate-300 text-slate-600 hover:text-rose-600'
                  }`}
                  title="Save to Wishlist"
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current text-rose-600' : ''}`} />
                </button>
              </div>

              <a
                href={`https://wa.me/923214500997?text=Hello%20Medas%20Medical%20Supplier,%20I%20have%20questions%20regarding%20${encodeURIComponent(product.name)}.`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wider"
              >
                <MessageCircle className="w-4 h-4 text-slate-600" />
                <span>Inquire on WhatsApp (+92 321 4500997)</span>
              </a>
            </div>

            {/* TRUST HIGHLIGHTS */}
            <div className="grid grid-cols-2 gap-3 pt-3 text-xs text-slate-600">
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <Truck className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Safe Hospital Delivery Pakistan</span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>1 Year Official Warranty</span>
              </div>
            </div>

          </div>
        </div>

        {/* 3. TABBED TECHNICAL SPECIFICATIONS */}
        <div className="mt-16 border-t border-slate-200 pt-8">
          <div className="flex border-b border-slate-200 gap-8 text-sm font-bold mb-6 overflow-x-auto">
            <button
              onClick={() => setActiveTab('desc')}
              className={`pb-3 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'desc'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Clinical Description
            </button>
            <button
              onClick={() => setActiveTab('specs')}
              className={`pb-3 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'specs'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Technical Specifications
            </button>
            <button
              onClick={() => setActiveTab('warranty')}
              className={`pb-3 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'warranty'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Warranty & Support
            </button>
            <button
              onClick={() => setActiveTab('shipping')}
              className={`pb-3 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'shipping'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Delivery & Setup
            </button>
          </div>

          <div className="text-sm text-slate-700 leading-relaxed min-h-[160px]">
            {activeTab === 'desc' && (
              <div className="space-y-4 max-w-4xl">
                {product.description ? (
                  <div 
                    className="prose prose-sm max-w-none text-slate-700"
                    dangerouslySetInnerHTML={{ __html: product.description }} 
                  />
                ) : product.shortDescription ? (
                  <div 
                    className="prose prose-sm max-w-none text-slate-700"
                    dangerouslySetInnerHTML={{ __html: product.shortDescription }} 
                  />
                ) : (
                  <p className="text-slate-600">
                    The <strong>{product.name}</strong> is distributed officially by Medas Medical Supplier. Built with precision crystal elements and engineered for high acoustic sensitivity and reliable clinical diagnosis.
                  </p>
                )}
              </div>
            )}

            {activeTab === 'specs' && (
              <div className="max-w-4xl bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden">
                <table className="w-full text-xs text-left">
                  <tbody className="divide-y divide-slate-200">
                    <tr className="hover:bg-slate-100/50">
                      <td className="p-3.5 font-semibold text-slate-600 w-1/3">Model / Product Name</td>
                      <td className="p-3.5 text-slate-900 font-bold">{product.name}</td>
                    </tr>
                    <tr className="hover:bg-slate-100/50">
                      <td className="p-3.5 font-semibold text-slate-600">Official SKU</td>
                      <td className="p-3.5 text-slate-800 font-mono">{product.sku}</td>
                    </tr>
                    <tr className="hover:bg-slate-100/50">
                      <td className="p-3.5 font-semibold text-slate-600">Primary Classification</td>
                      <td className="p-3.5 text-slate-800">{product.categories.map(c => c.name).join(', ')}</td>
                    </tr>
                    <tr className="hover:bg-slate-100/50">
                      <td className="p-3.5 font-semibold text-slate-600">Supplier</td>
                      <td className="p-3.5 text-slate-800 font-semibold">Medas Medical Supplier</td>
                    </tr>
                    {product.specifications?.map((spec, index) => (
                      <tr key={`spec-${index}`} className="hover:bg-slate-100/50">
                        <td className="p-3.5 font-semibold text-slate-600">{spec.label}</td>
                        <td className="p-3.5 text-slate-800">{spec.value}</td>
                      </tr>
                    ))}
                    {product.keyFeatures?.length > 0 && (
                      <tr className="hover:bg-slate-100/50">
                        <td className="p-3.5 font-semibold text-slate-600 align-top">Key Features</td>
                        <td className="p-3.5 text-slate-800">
                          <ul className="list-disc pl-5 space-y-1.5">
                            {product.keyFeatures.map((feature, index) => (
                              <li key={`feature-${index}`}>{feature}</li>
                            ))}
                          </ul>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'warranty' && (
              <div className="max-w-3xl space-y-3 text-xs text-slate-600 leading-relaxed">
                <h4 className="font-bold text-slate-900 text-sm">Medas Medical Supplier Warranty</h4>
                <p>
                  Warranty duration, coverage, testing, training, and after-sales support can vary by product and condition.
                  Please contact <strong>Medas Medical Suppliers</strong> to confirm the exact terms before purchasing.
                </p>
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="max-w-3xl space-y-3 text-xs text-slate-600 leading-relaxed">
                <h4 className="font-bold text-slate-900 text-sm">Nationwide Dispatch & Delivery</h4>
                <p>
                  Delivery availability, dispatch timing, installation, and setup depend on the selected product and destination.
                  Contact Medas Medical Suppliers to confirm the available options for your location.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* 4. RELATED PRODUCTS */}
        {relatedProducts.length > 0 && (
          <div className="mt-20 border-t border-slate-200 pt-10">
            <h3 className="text-xl font-bold text-slate-900 mb-6">
              Related Systems in {product.categories?.[0]?.name || 'Medical Equipment'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map(rel => (
                <ProductCard key={rel.id} product={rel} />
              ))}
            </div>
          </div>
        )}

      </div>

      {/* FULLSCREEN IMAGE MODAL */}
      {showFullImageModal && (
        <div 
          onClick={() => setShowFullImageModal(false)}
          className="fixed inset-0 z-50 bg-black/90 p-4 flex items-center justify-center animate-fadeIn cursor-pointer"
        >
          <img
            src={currentImage?.src}
            alt={product.name}
            className="max-h-[90vh] max-w-[90vw] object-contain"
          />
        </div>
      )}

    </div>
  );
};
