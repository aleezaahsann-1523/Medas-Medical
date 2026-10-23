import React, { useState } from 'react';
import { Product } from '../types';
import { useQuote } from '../context/QuoteContext';
import { ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  viewMode?: 'grid' | 'list';
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { openProductModal } = useQuote();
  const [imgError, setImgError] = useState(false);

  const imgSrc = !imgError && product.featuredImage?.thumbnail
    ? product.featuredImage.thumbnail
    : (!imgError && product.featuredImage?.src ? product.featuredImage.src : 'https://sonotech.pk/wp-content/uploads/2023/06/Our-trendy-categoriy-Humen-ultrasound-scanner.jpg');

  const formatPrice = (product: Product) => {
    return 'Contact for price';
  };

  const directOrderWhatsApp = encodeURIComponent(
    `Hello Medas Medical Supplier,\nI want to order "${product.name}" (SKU: ${product.sku}).\nPlease confirm pricing, warranty, and dispatch time to my clinic.`
  );

  return (
    <div 
      onClick={() => openProductModal(product)}
      className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-slate-400 transition-all duration-200 flex flex-col h-full cursor-pointer group overflow-hidden"
    >
      {/* 1. CLEAN PRODUCT PHOTOGRAPHY */}
      <div className="w-full h-56 bg-slate-50 p-4 flex items-center justify-center relative overflow-hidden border-b border-slate-100">
        <img
          src={imgSrc}
          alt={product.name}
          onError={() => setImgError(true)}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </div>

      {/* 2. PRODUCT DETAILS & BUY IT NOW */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <h3 className="font-bold text-slate-900 text-sm leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">
            {product.name}
          </h3>
          <p className="text-xs font-bold text-slate-700 mt-2">
            {formatPrice(product)}
          </p>
        </div>

        {/* 3. PROFESSIONAL "BUY IT NOW" BUTTON CONNECTING DIRECTLY TO WHATSAPP */}
        <div onClick={(e) => e.stopPropagation()}>
          <a
            href={`https://wa.me/923214500997?text=${directOrderWhatsApp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-slate-900 hover:bg-black text-white py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors tracking-wide uppercase"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>Buy It Now</span>
          </a>
        </div>
      </div>
    </div>
  );
};
