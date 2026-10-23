import React, { useState } from 'react';
import { useQuote } from '../context/QuoteContext';
import { 
  X, 
  ShoppingCart, 
  MessageCircle, 
  Heart, 
  CheckCircle2, 
  ShieldCheck, 
  Truck, 
  FileText, 
  Share2, 
  Star,
  ChevronRight,
  Printer,
  Sliders,
  ExternalLink,
  PlayCircle
} from 'lucide-react';
import { Product } from '../types';

export const ProductDetailModal: React.FC = () => {
  const { 
    activeProduct: product, 
    closeProductModal, 
    openQuoteModal, 
    toggleWishlist, 
    isInWishlist,
    setSelectedCategory,
    openProductModal,
    showToast
  } = useQuote();

  const [selectedImgIndex, setSelectedImgIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'warranty' | 'shipping'>('desc');
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const isWishlisted = isInWishlist(product.id);
  const images = product.gallery && product.gallery.length > 0 ? product.gallery : (product.featuredImage ? [product.featuredImage] : []);
  const currentImage = images[selectedImgIndex] || product.featuredImage;

  const whatsappMessage = encodeURIComponent(
    `Hello SonoTech Pakistan,\nI am interested in acquiring "${product.name}" (Model/SKU: ${product.sku}).\nPlease share the formal hospital quotation, availability in Lahore/Karachi, and technical datasheet.\nSource: sonotech.pk`
  );

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Product link copied to clipboard');
    }
  };

  const handlePrintSpecs = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div 
        className="relative bg-white rounded-2xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* TOP BAR / BREADCRUMB */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 overflow-x-auto whitespace-nowrap scrollbar-none">
            <span className="hover:text-blue-600 cursor-pointer" onClick={closeProductModal}>Home</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            {product.categories?.[0] && (
              <span 
                className="hover:text-blue-600 cursor-pointer text-slate-700 font-medium"
                onClick={() => {
                  setSelectedCategory(product.categories[0].slug);
                  closeProductModal();
                }}
              >
                {product.categories[0].name}
              </span>
            )}
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="text-slate-900 font-semibold truncate max-w-[200px] sm:max-w-xs">{product.name}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-1.5 text-slate-500 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
              title="Share"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={handlePrintSpecs}
              className="p-1.5 text-slate-500 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
              title="Print Specification"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={closeProductModal}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* MODAL BODY (SCROLLABLE) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            
            {/* LEFT: IMAGE GALLERY */}
            <div className="space-y-4">
              <div className="w-full h-80 sm:h-96 bg-slate-50 rounded-xl p-4 border border-slate-200 flex items-center justify-center relative overflow-hidden group">
                <img
                  src={currentImage?.src || 'https://sonotech.pk/wp-content/uploads/2023/06/Our-trendy-categoriy-Humen-ultrasound-scanner.jpg'}
                  alt={currentImage?.alt || product.name}
                  className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                />
                {product.onSale && (
                  <span className="absolute top-3 left-3 bg-rose-600 text-white text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                    Special Offer
                  </span>
                )}
                <a
                  href={currentImage?.src || product.permalink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute bottom-3 right-3 bg-white/90 hover:bg-white text-slate-700 p-2 rounded-lg text-xs font-medium border border-slate-200 shadow-xs flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>View Full Image</span>
                </a>
              </div>

              {/* THUMBNAILS CAROUSEL */}
              {images.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-2">
                  {images.map((img, idx) => (
                    <button
                      key={img.id || idx}
                      onClick={() => setSelectedImgIndex(idx)}
                      className={`w-16 h-16 rounded-lg border-2 p-1 bg-white shrink-0 overflow-hidden transition-all ${
                        selectedImgIndex === idx 
                          ? 'border-blue-600 ring-2 ring-blue-100' 
                          : 'border-slate-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img 
                        src={img.thumbnail || img.src} 
                        alt={img.alt || `thumbnail ${idx}`} 
                        className="w-full h-full object-contain"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* PRODUCT VIDEO: add a YouTube embed URL in technicalData.videoUrl for these products */}
              {(['volta-notepad-345', 'volta-vsonic-295'].includes(product.slug)) && (
                <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-3">
                  <div><h3 className="font-bold text-slate-900">Product Video</h3><p className="text-xs text-slate-500 mt-1">Optional product demonstration video</p></div>
                  {((product.technicalData as any)?.videoUrl) ? (
                    <div className="aspect-video overflow-hidden rounded-lg bg-slate-100"><iframe className="w-full h-full" src={(product.technicalData as any).videoUrl} title={`${product.name} video`} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen /></div>
                  ) : (
                    <div className="aspect-video rounded-lg bg-slate-50 border border-dashed border-slate-300 flex flex-col items-center justify-center text-center p-5"><PlayCircle className="w-9 h-9 text-blue-500"/><p className="mt-2 text-sm font-semibold text-slate-700">Video not added yet</p><p className="mt-1 text-xs text-slate-500">Add a YouTube embed URL to this product's technicalData.videoUrl in src/data/products.json.</p></div>
                  )}
                </div>
              )}

              {/* ORIGINAL SOURCE VERIFICATION BADGE */}
              <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-200/60 text-xs text-blue-900 flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" />
                <div>
                  <span className="font-semibold block">Authentic SonoTech.pk Product Data</span>
                  <span className="text-blue-700">Original high-res photography and specifications verified from reference catalog.</span>
                </div>
              </div>
            </div>

            {/* RIGHT: PRODUCT INFO & PURCHASE CONTROLS */}
            <div className="space-y-5">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  {product.categories.map(c => (
                    <span 
                      key={c.id} 
                      className="text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full"
                    >
                      {c.name}
                    </span>
                  ))}
                </div>

                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                  {product.name}
                </h1>

                <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                  <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-700">
                    SKU: {product.sku}
                  </span>
                  <div className="flex items-center text-amber-500">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="ml-1 font-bold text-slate-700">5.0</span>
                    <span className="ml-1 text-slate-400">({product.reviewCount || 1} clinical reviews)</span>
                  </div>
                  <span className="text-emerald-600 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{product.isInStock ? 'In Stock (Warehouse Lahore)' : 'Available on Order'}</span>
                  </span>
                </div>
              </div>

              {/* PRICE BOX */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-xs text-slate-600 block uppercase font-semibold">
                  Indicative Hospital & Clinic Pricing
                </span>
                <div className="flex items-baseline gap-3 mt-1">
                  <span className="text-3xl font-black text-slate-900">
                    Contact for price
                  </span>
                  {false && product.regularPrice > product.price && product.price > 0 && (
                    <span className="text-base text-slate-400 line-through">
                      ₨ {product.regularPrice.toLocaleString()}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Includes official manufacturer warranty, initial calibration, and biomedical doctor training across Pakistan.
                </p>
              </div>

              {/* KEY BULLET POINTS */}
              {product.keyFeatures && product.keyFeatures.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Key Clinical Features:</h4>
                  <ul className="space-y-1.5 text-xs text-slate-600">
                    {product.keyFeatures.slice(0, 5).map((feat, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* QUANTITY & ACTIONS */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden bg-white">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-2 text-slate-600 hover:bg-slate-100 font-bold"
                    >
                      -
                    </button>
                    <span className="px-4 py-2 font-bold text-sm text-slate-800">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 py-2 text-slate-600 hover:bg-slate-100 font-bold"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      openQuoteModal(product);
                      closeProductModal();
                    }}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 text-sm"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Request Official Quotation</span>
                  </button>

                  <button
                    onClick={() => toggleWishlist(product)}
                    className={`p-3 rounded-xl border transition-colors ${
                      isWishlisted
                        ? 'bg-rose-50 border-rose-300 text-rose-600'
                        : 'border-slate-300 text-slate-600 hover:text-rose-600'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current text-rose-600' : ''}`} />
                  </button>
                </div>

                <a
                  href={`https://wa.me/923354000190?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 text-sm"
                >
                  <MessageCircle className="w-5 h-5 text-white" />
                  <span>Instant Inquiry on WhatsApp (+92 335 4000190)</span>
                </a>
              </div>

              {/* BADGES ROW */}
              <div className="grid grid-cols-2 gap-3 pt-2 text-xs text-slate-600">
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                  <Truck className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Safe Hospital Delivery Pakistan</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>1 Year Warranty & Free Installation</span>
                </div>
              </div>

            </div>
          </div>

          {/* TABBED DETAILS & SPECIFICATIONS */}
          <div className="border-t border-slate-200 pt-6">
            <div className="flex border-b border-slate-200 gap-6 text-sm font-semibold mb-6 overflow-x-auto">
              <button
                onClick={() => setActiveTab('desc')}
                className={`pb-3 border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'desc'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Description & Clinical Use
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
                Warranty & Calibration
              </button>
              <button
                onClick={() => setActiveTab('shipping')}
                className={`pb-3 border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'shipping'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Delivery & Installation
              </button>
            </div>

            {/* TAB CONTENT */}
            <div className="text-sm text-slate-700 leading-relaxed min-h-[140px]">
              {activeTab === 'desc' && (
                <div className="space-y-4">
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
                    <div className="space-y-2 text-slate-600">
                      <p>
                        The <strong>{product.name}</strong> is an engineered diagnostic ultrasound system distributed officially by SonoTech Pakistan. Designed to meet the stringent diagnostic imaging requirements of modern clinics and healthcare centers.
                      </p>
                      <p>
                        Engineered with multi-frequency transducer elements, superior signal-to-noise ratio, and reliable acoustic beamforming technology for high-contrast tissue resolution.
                      </p>
                    </div>
                  )}

                  {product.technicalData && Object.keys(product.technicalData).length > 0 && (
                    <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                      <h4 className="font-bold text-slate-900 mb-2">Technical Attributes:</h4>
                      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-xs">
                        {Object.entries(product.technicalData).map(([key, val]) => (
                          <div key={key} className="flex justify-between border-b border-slate-200 py-1">
                            <dt className="text-slate-500 font-medium">{key}</dt>
                            <dd className="text-slate-800 font-semibold">{val}</dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'specs' && (
                <div className="space-y-4">
                  <div className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
                    <table className="w-full text-xs text-left">
                      <tbody className="divide-y divide-slate-200">
                        <tr className="hover:bg-slate-100/50">
                          <td className="p-3 font-semibold text-slate-600 w-1/3">Model / Name</td>
                          <td className="p-3 text-slate-800">{product.name}</td>
                        </tr>
                        <tr className="hover:bg-slate-100/50">
                          <td className="p-3 font-semibold text-slate-600">System SKU</td>
                          <td className="p-3 text-slate-800 font-mono">{product.sku}</td>
                        </tr>
                        <tr className="hover:bg-slate-100/50">
                          <td className="p-3 font-semibold text-slate-600">Primary Category</td>
                          <td className="p-3 text-slate-800">{product.categories.map(c => c.name).join(', ')}</td>
                        </tr>
                        <tr className="hover:bg-slate-100/50">
                          <td className="p-3 font-semibold text-slate-600">Availability</td>
                          <td className="p-3 text-slate-800">{product.isInStock ? 'In Stock (Lahore)' : 'Made to Order'}</td>
                        </tr>
                        <tr className="hover:bg-slate-100/50">
                          <td className="p-3 font-semibold text-slate-600">Currency / Country</td>
                          <td className="p-3 text-slate-800">PKR (Pakistan)</td>
                        </tr>
                        <tr className="hover:bg-slate-100/50">
                          <td className="p-3 font-semibold text-slate-600">Gallery Images</td>
                          <td className="p-3 text-slate-800">{images.length} high-resolution views</td>
                        </tr>
                        <tr className="hover:bg-slate-100/50">
                          <td className="p-3 font-semibold text-slate-600">Original Reference URL</td>
                          <td className="p-3 text-blue-600 break-all">
                            <a href={product.permalink} target="_blank" rel="noreferrer" className="hover:underline">
                              {product.permalink}
                            </a>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === 'warranty' && (
                <div className="space-y-3 text-xs text-slate-600">
                  <h4 className="font-bold text-slate-900 text-sm">Comprehensive Biomedical Support in Pakistan</h4>
                  <p>
                    Every diagnostic ultrasound system and probe supplied by <strong>SonoTech Healthcare Equipment</strong> comes standard with:
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>12 months full warranty covering internal electronics and transducer crystal calibration.</li>
                    <li>Pre-delivery acoustic performance test & safety validation according to international standards.</li>
                    <li>Free initial on-site training for sonologists, gynecologists, radiologists, and veterinarians.</li>
                    <li>Availability of spare parts, replacement cables, and probe loaner units during service periods.</li>
                  </ul>
                </div>
              )}

              {activeTab === 'shipping' && (
                <div className="space-y-3 text-xs text-slate-600">
                  <h4 className="font-bold text-slate-900 text-sm">Nationwide Dispatch & On-Site Setup</h4>
                  <p>
                    SonoTech provides direct hospital and clinic delivery across all major cities of Pakistan:
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-medium text-slate-800">
                    <div className="p-2 bg-slate-50 rounded border border-slate-200">Lahore & Punjab: Same-day / 24h</div>
                    <div className="p-2 bg-slate-50 rounded border border-slate-200">Karachi & Sindh: 2-3 business days</div>
                    <div className="p-2 bg-slate-50 rounded border border-slate-200">Islamabad / Rawalpindi: 24-48h</div>
                    <div className="p-2 bg-slate-50 rounded border border-slate-200">KPK & Balochistan: 2-4 business days</div>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* MODAL FOOTER */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="text-slate-500">
            For urgent procurement or tender inquiries: <span className="font-semibold text-slate-800">+92 335 4000190</span>
          </div>
          <button
            onClick={closeProductModal}
            className="px-5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg font-semibold transition-colors"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};
