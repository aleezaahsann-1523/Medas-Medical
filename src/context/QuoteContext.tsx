import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, QuoteItem } from '../types';

interface QuoteContextType {
  quoteItems: QuoteItem[];
  addToQuote: (product: Product, quantity?: number) => void;
  removeFromQuote: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearQuote: () => void;
  quoteCount: number;

  wishlist: Product[];
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: number) => boolean;

  activeProduct: Product | null;
  openProductModal: (product: Product) => void;
  closeProductModal: () => void;

  isQuoteModalOpen: boolean;
  openQuoteModal: (product?: Product) => void;
  closeQuoteModal: () => void;

  currentPage: string;
  setCurrentPage: (page: string) => void;
  selectedCategory: string;
  setSelectedCategory: (slug: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  toastMessage: string | null;
  showToast: (msg: string) => void;

  navigateToProduct: (slugOrProduct: string | Product) => void;
}

const QuoteContext = createContext<QuoteContextType | undefined>(undefined);

export const QuoteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [quoteItems, setQuoteItems] = useState<QuoteItem[]>(() => {
    try {
      const saved = localStorage.getItem('sonotech_quote');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('sonotech_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('sonotech_quote', JSON.stringify(quoteItems));
    } catch {}
  }, [quoteItems]);

  useEffect(() => {
    try {
      localStorage.setItem('sonotech_wishlist', JSON.stringify(wishlist));
    } catch {}
  }, [wishlist]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const addToQuote = (product: Product, quantity = 1) => {
    setQuoteItems(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        showToast(`Updated quantity for ${product.name}`);
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      showToast(`Added ${product.name} to Quote List`);
      return [...prev, { product, quantity }];
    });
  };

  const removeFromQuote = (productId: number) => {
    setQuoteItems(prev => prev.filter(item => item.product.id !== productId));
    showToast('Item removed from Quote List');
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromQuote(productId);
      return;
    }
    setQuoteItems(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearQuote = () => {
    setQuoteItems([]);
  };

  const toggleWishlist = (product: Product) => {
    setWishlist(prev => {
      const exists = prev.some(p => p.id === product.id);
      if (exists) {
        showToast(`Removed from Wishlist`);
        return prev.filter(p => p.id !== product.id);
      } else {
        showToast(`Saved to Wishlist`);
        return [...prev, product];
      }
    });
  };

  const isInWishlist = (productId: number) => {
    return wishlist.some(p => p.id === productId);
  };

  const openProductModal = (product: Product) => {
    setActiveProduct(product);
    setCurrentPage('product');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const closeProductModal = () => {
    setActiveProduct(null);
  };

  const openQuoteModal = (product?: Product) => {
    if (product) {
      addToQuote(product, 1);
    }
    setIsQuoteModalOpen(true);
  };

  const closeQuoteModal = () => {
    setIsQuoteModalOpen(false);
  };

  const navigateToProduct = (slugOrProduct: string | Product) => {
    if (typeof slugOrProduct === 'object') {
      setActiveProduct(slugOrProduct);
      setCurrentPage('product');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <QuoteContext.Provider
      value={{
        quoteItems,
        addToQuote,
        removeFromQuote,
        updateQuantity,
        clearQuote,
        quoteCount: quoteItems.reduce((acc, curr) => acc + curr.quantity, 0),
        wishlist,
        toggleWishlist,
        isInWishlist,
        activeProduct,
        openProductModal,
        closeProductModal,
        isQuoteModalOpen,
        openQuoteModal,
        closeQuoteModal,
        currentPage,
        setCurrentPage: (page: string) => {
          setCurrentPage(page);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        },
        selectedCategory,
        setSelectedCategory: (slug: string) => {
          setSelectedCategory(slug);
          setCurrentPage('shop');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        },
        searchQuery,
        setSearchQuery,
        toastMessage,
        showToast,
        navigateToProduct
      }}
    >
      {children}
    </QuoteContext.Provider>
  );
};

export const useQuote = () => {
  const context = useContext(QuoteContext);
  if (!context) {
    throw new Error('useQuote must be used within a QuoteProvider');
  }
  return context;
};
