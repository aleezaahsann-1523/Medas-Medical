import React, { useState } from 'react';
import { 
  FileCheck2, 
  Download, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  Layers, 
  Image as ImageIcon, 
  Globe, 
  Database,
  Search,
  Code
} from 'lucide-react';
import extractionReport from '../data/extraction-report.json';
import missingReport from '../data/missing-data-report.json';
import imageManifest from '../data/image-manifest.json';
import discoveredUrls from '../data/discovered-urls.json';
import localProducts from '../data/products.json';
import localCategories from '../data/categories.json';

export const ReportsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'summary' | 'urls' | 'images' | 'missing' | 'categories'>('summary');
  const [urlSearch, setUrlSearch] = useState('');

  const filteredUrls = discoveredUrls.products.filter(u => 
    !urlSearch || u.toLowerCase().includes(urlSearch.toLowerCase())
  );

  const downloadFile = (filename: string, content: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-8">
      
      {/* 1. HEADER */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 space-y-4">
        <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-400/30 px-3.5 py-1 rounded-full text-xs font-semibold text-emerald-300">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Extraction Complete & Validated</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black">
          SONOTECH.PK DATA AUDIT & EXTRACTION REPORT
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
          Comprehensive verification audit comparing extracted records with the live reference website (https://sonotech.pk/). Fulfilling Phases 1 through 5 and 10 of the rebuild specification.
        </p>

        {/* QUICK DOWNLOAD BUTTONS */}
        <div className="pt-4 flex flex-wrap gap-3">
          <button
            onClick={() => downloadFile('products.json', JSON.stringify(localProducts, null, 2), 'application/json')}
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Download products.json ({localProducts.length} Products)</span>
          </button>

          <a
            href="/api/export/csv"
            download="sonotech-products.csv"
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Download products.csv</span>
          </a>

          <button
            onClick={() => downloadFile('categories.json', JSON.stringify(localCategories, null, 2), 'application/json')}
            className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Download categories.json (48 Categories)</span>
          </button>

          <button
            onClick={() => downloadFile('image-manifest.json', JSON.stringify(imageManifest, null, 2), 'application/json')}
            className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Download image-manifest.json</span>
          </button>
        </div>
      </div>

      {/* 2. STATS OVERVIEW CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-blue-600 mb-2">
            <Database className="w-5 h-5" />
            <span className="text-xs font-bold bg-blue-50 px-2 py-0.5 rounded">Catalog</span>
          </div>
          <span className="text-2xl sm:text-3xl font-black text-slate-900">{extractionReport.totalUniqueProductsExtracted}</span>
          <p className="text-xs text-slate-500 font-medium">Unique Products Extracted</p>
          <span className="text-[10px] text-emerald-600 font-semibold block">100% of discovered sitemap URLs</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-emerald-600 mb-2">
            <Layers className="w-5 h-5" />
            <span className="text-xs font-bold bg-emerald-50 px-2 py-0.5 rounded">Taxonomy</span>
          </div>
          <span className="text-2xl sm:text-3xl font-black text-slate-900">{extractionReport.totalCategoriesExtracted}</span>
          <p className="text-xs text-slate-500 font-medium">Categories & Subcategories</p>
          <span className="text-[10px] text-emerald-600 font-semibold block">Preserved exact hierarchy</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-indigo-600 mb-2">
            <ImageIcon className="w-5 h-5" />
            <span className="text-xs font-bold bg-indigo-50 px-2 py-0.5 rounded">Gallery</span>
          </div>
          <span className="text-2xl sm:text-3xl font-black text-slate-900">{extractionReport.totalImagesDiscovered}</span>
          <p className="text-xs text-slate-500 font-medium">Original Images Mapped</p>
          <span className="text-[10px] text-indigo-600 font-semibold block">All 138 products have images</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-purple-600 mb-2">
            <Globe className="w-5 h-5" />
            <span className="text-xs font-bold bg-purple-50 px-2 py-0.5 rounded">Crawled</span>
          </div>
          <span className="text-2xl sm:text-3xl font-black text-slate-900">{extractionReport.totalDiscoveredUrls}</span>
          <p className="text-xs text-slate-500 font-medium">Discovered URLs in Sitemaps</p>
          <span className="text-[10px] text-purple-600 font-semibold block">138 products, 48 cats, 16 pages</span>
        </div>
      </div>

      {/* 3. REPORT TABS */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="flex border-b border-slate-200 overflow-x-auto text-xs font-bold">
          <button
            onClick={() => setActiveTab('summary')}
            className={`py-3.5 px-6 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'summary' ? 'border-blue-600 text-blue-600 bg-blue-50/50' : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Extraction Summary
          </button>
          <button
            onClick={() => setActiveTab('urls')}
            className={`py-3.5 px-6 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'urls' ? 'border-blue-600 text-blue-600 bg-blue-50/50' : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Discovered URLs ({discoveredUrls.products.length})
          </button>
          <button
            onClick={() => setActiveTab('images')}
            className={`py-3.5 px-6 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'images' ? 'border-blue-600 text-blue-600 bg-blue-50/50' : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Image Manifest ({imageManifest.products.length} Products)
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`py-3.5 px-6 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'categories' ? 'border-blue-600 text-blue-600 bg-blue-50/50' : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Category Hierarchy ({localCategories.length})
          </button>
          <button
            onClick={() => setActiveTab('missing')}
            className={`py-3.5 px-6 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'missing' ? 'border-blue-600 text-blue-600 bg-blue-50/50' : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Missing Data Audit ({missingReport.totalProductsMissingDescriptions})
          </button>
        </div>

        {/* TAB 1: SUMMARY */}
        {activeTab === 'summary' && (
          <div className="p-6 space-y-6">
            <div className="prose prose-sm max-w-none text-slate-700 text-xs">
              <h3 className="text-base font-bold text-slate-900 mb-2">Extraction Pipeline Audit Notes</h3>
              <p>
                The extraction engine queried <strong>https://sonotech.pk/sitemap_index.xml</strong>, <strong>product-sitemap.xml</strong>, and the WooCommerce REST API (<strong>/wp-json/wc/store/v1/products</strong>).
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Total discovered product URLs in sitemap: <strong>138 URLs</strong></li>
                <li>Total unique product records extracted and validated: <strong>138 products</strong></li>
                <li>Total categories extracted: <strong>48 categories</strong></li>
                <li>Total gallery and featured images mapped: <strong>373 images</strong></li>
                <li>Products with bullet point specifications: <strong>48 products</strong></li>
                <li>Products with full descriptions: <strong>73 products</strong></li>
                <li>Products with original images: <strong>138 (100%)</strong></li>
                <li>Zero fabricated or hallucinated products added.</li>
              </ul>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <h4 className="text-xs font-bold text-slate-900 mb-2">Raw Extraction Report JSON</h4>
              <pre className="text-[11px] font-mono text-slate-700 max-h-72 overflow-y-auto bg-white p-3 rounded border border-slate-200">
                {JSON.stringify(extractionReport, null, 2)}
              </pre>
            </div>
          </div>
        )}

        {/* TAB 2: DISCOVERED URLS */}
        {activeTab === 'urls' && (
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Filter URL by slug or keyword..."
                  value={urlSearch}
                  onChange={(e) => setUrlSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden"
                />
              </div>
              <span className="text-xs text-slate-500">
                Showing {filteredUrls.length} of {discoveredUrls.products.length} product URLs
              </span>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 max-h-96 overflow-y-auto text-xs">
              {filteredUrls.map((url, i) => (
                <div key={i} className="p-2.5 flex items-center justify-between hover:bg-slate-50">
                  <span className="font-mono text-slate-700 truncate pr-4">{url}</span>
                  <a
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:text-blue-800 flex items-center gap-1 shrink-0 font-medium"
                  >
                    <span>Inspect Source</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: IMAGE MANIFEST */}
        {activeTab === 'images' && (
          <div className="p-6 space-y-4">
            <p className="text-xs text-slate-500">
              Total {imageManifest.totalImages} images mapped across {imageManifest.products.length} products. Each product is mapped to its authentic image URLs on <code>sonotech.pk/wp-content/uploads/</code>.
            </p>

            <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 max-h-96 overflow-y-auto text-xs">
              {imageManifest.products.slice(0, 30).map((p, i) => (
                <div key={i} className="p-3 flex items-center gap-4 hover:bg-slate-50">
                  <img
                    src={p.featuredImage || ''}
                    alt={p.productName}
                    className="w-12 h-12 object-contain bg-white rounded border border-slate-200 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h5 className="font-bold text-slate-900 truncate">{p.productName}</h5>
                    <p className="text-[11px] text-slate-400 font-mono truncate">{p.featuredImage}</p>
                  </div>
                  <span className="text-xs bg-slate-100 px-2 py-0.5 rounded font-mono text-slate-600 shrink-0">
                    {p.gallery.length} Images
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: CATEGORY HIERARCHY */}
        {activeTab === 'categories' && (
          <div className="p-6 space-y-4">
            <p className="text-xs text-slate-500">
              All 48 categories extracted with their parent-child relationships preserved:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {localCategories.map((c: any) => (
                <div key={c.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <h5 className="font-bold text-slate-900">{c.name}</h5>
                    <span className="text-[10px] text-slate-400 font-mono">
                      slug: {c.slug} {c.parentSlug ? `(parent: ${c.parentSlug})` : '(root)'}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                    {c.count} items
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: MISSING DATA REPORT */}
        {activeTab === 'missing' && (
          <div className="p-6 space-y-4 text-xs">
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block mb-1">Authenticity Compliance Note:</span>
                <p className="leading-relaxed">
                  {missingReport.note}
                </p>
              </div>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 max-h-80 overflow-y-auto">
              {missingReport.missingDescriptionProducts.map((p: any) => (
                <div key={p.id} className="p-2.5 flex items-center justify-between hover:bg-slate-50">
                  <span className="font-semibold text-slate-800">{p.name}</span>
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:underline flex items-center gap-1 text-[11px]"
                  >
                    <span>Check Source URL</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
