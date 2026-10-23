import React from 'react';
import { QuoteProvider, useQuote } from './context/QuoteContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { QuoteModal } from './components/QuoteModal';
import { WhatsAppButton } from './components/WhatsAppButton';
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { ReviewsPage } from './pages/ReviewsPage';
import { ReportsPage } from './pages/ReportsPage';
import { CheckCircle2 } from 'lucide-react';

const MainContent: React.FC = () => {
  const { currentPage, toastMessage } = useQuote();

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'shop':
        return <ShopPage />;
      case 'product':
        return <ProductDetailPage />;
      case 'about':
        return <AboutPage />;
      case 'contact':
        return <ContactPage />;
      case 'reviews':
        return <ReviewsPage />;
      case 'reports':
        return <ReportsPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800 antialiased selection:bg-blue-600 selection:text-white">
      <Header />
      
      <main className="flex-1">
        {renderPage()}
      </main>

      <Footer />
      
      <QuoteModal />
      <WhatsAppButton />

      {/* TOAST POPUP */}
      {toastMessage && (
        <div className="fixed bottom-6 left-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 text-xs font-medium border border-slate-700 animate-slideUp">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <QuoteProvider>
      <MainContent />
    </QuoteProvider>
  );
}
