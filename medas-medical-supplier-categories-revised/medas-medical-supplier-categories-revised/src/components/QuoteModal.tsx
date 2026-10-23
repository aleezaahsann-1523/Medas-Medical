import React, { useState } from 'react';
import { useQuote } from '../context/QuoteContext';
import { 
  X, 
  Trash2, 
  ShoppingCart, 
  Phone, 
  Building, 
  User, 
  MapPin, 
  MessageCircle
} from 'lucide-react';
import { submitQuoteInquiry } from '../services/api';

export const QuoteModal: React.FC = () => {
  const { 
    isQuoteModalOpen, 
    closeQuoteModal, 
    quoteItems, 
    removeFromQuote, 
    updateQuantity, 
    clearQuote,
    showToast 
  } = useQuote();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [organization, setOrganization] = useState('');
  const [city, setCity] = useState('');
  const [notes, setNotes] = useState('');

  if (!isQuoteModalOpen) return null;

  const getWhatsAppOrderText = () => {
    const itemsList = quoteItems.length > 0 
      ? quoteItems.map((item, i) => `${i + 1}. ${item.product.name} (Qty: ${item.quantity}, SKU: ${item.product.sku})`).join('\n')
      : 'Consultation / Equipment order inquiry';

    return encodeURIComponent(
      `*ORDER INQUIRY - MEDAS MEDICAL SUPPLIER*\n\n` +
      `*Customer / Doctor:* ${fullName || 'Client'}\n` +
      `*Hospital/Clinic:* ${organization || 'Private Practice'}\n` +
      `*City:* ${city || 'Pakistan'}\n` +
      `*Phone:* ${phone || 'Not provided'}\n\n` +
      `*Ordered Equipment:*\n${itemsList}\n\n` +
      `*Notes:* ${notes || 'Please confirm total price and dispatch timeframe.'}`
    );
  };

  const handleDispatchOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) {
      alert('Please enter your WhatsApp/Phone number.');
      return;
    }

    // Save background record
    submitQuoteInquiry({
      fullName: fullName || 'Client',
      phone,
      email: '',
      organization,
      city,
      message: notes,
      items: quoteItems.map(item => ({
        productId: item.product.id,
        productName: item.product.name,
        quantity: item.quantity
      }))
    }).catch(() => {});

    showToast('Redirecting order to Medas Medical WhatsApp...');
    window.open(`https://wa.me/923214500997?text=${getWhatsAppOrderText()}`, '_blank');
    closeQuoteModal();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div 
        className="relative bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="p-4 bg-slate-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShoppingCart className="w-5 h-5 text-blue-400" />
            <div>
              <h3 className="font-bold text-sm sm:text-base">Order Equipment via WhatsApp</h3>
              <p className="text-[11px] text-slate-400">Direct hospital dispatch & invoice with Medas Medical Supplier</p>
            </div>
          </div>
          <button 
            onClick={closeQuoteModal}
            className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* ITEMS LIST */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                Selected Equipment ({quoteItems.length} {quoteItems.length === 1 ? 'item' : 'items'})
              </h4>
              {quoteItems.length > 0 && (
                <button
                  onClick={clearQuote}
                  className="text-xs text-rose-600 hover:text-rose-700 font-medium"
                >
                  Clear All
                </button>
              )}
            </div>

            {quoteItems.length === 0 ? (
              <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl text-center text-slate-500 text-xs">
                No items added yet. You can still enter your details below to place a custom inquiry.
              </div>
            ) : (
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-white max-h-48 overflow-y-auto text-xs">
                {quoteItems.map((item) => (
                  <div key={item.product.id} className="p-3 flex items-center justify-between gap-3">
                    <img 
                      src={item.product.featuredImage?.thumbnail || item.product.featuredImage?.src} 
                      alt={item.product.name}
                      className="w-10 h-10 object-contain bg-slate-50 rounded border border-slate-200 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h5 className="font-bold text-slate-900 truncate">{item.product.name}</h5>
                      <span className="text-[10px] text-slate-400 font-mono">SKU: {item.product.sku}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center border border-slate-200 rounded bg-slate-50">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="px-2 py-1 text-slate-600 hover:bg-slate-200 font-bold"
                        >
                          -
                        </button>
                        <span className="px-2 font-semibold text-slate-800">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="px-2 py-1 text-slate-600 hover:bg-slate-200 font-bold"
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeFromQuote(item.product.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ORDER FORM */}
          <form onSubmit={handleDispatchOrder} className="space-y-4 pt-2 text-xs">
            <h4 className="font-bold text-slate-800 uppercase tracking-wide border-t border-slate-200 pt-4">
              Your Contact & Delivery Location
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Doctor / Purchaser Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Dr. Tariq Mahmood"
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-800 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  WhatsApp / Phone Number *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0321 1234567"
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-800 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Hospital / Clinic Name
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    placeholder="City Care Clinic"
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-800 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  City / Region in Pakistan
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Lahore, Karachi, Islamabad..."
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-800 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">
                  Additional Notes / Specific Probes Required
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Please quote with convex probe and UPS unit."
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-800 focus:outline-hidden"
                />
              </div>
            </div>

            {/* SEND ORDER TO WHATSAPP BUTTON */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-slate-900 hover:bg-black text-white font-bold py-3.5 px-6 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wider"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>Submit Order Directly to WhatsApp (+92 321 4500997)</span>
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
};
