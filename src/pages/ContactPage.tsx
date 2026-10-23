import React, { useState } from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  MessageCircle, 
  Send, 
  CheckCircle2
} from 'lucide-react';
import { submitQuoteInquiry } from '../services/api';
import { useQuote } from '../context/QuoteContext';

export const ContactPage: React.FC = () => {
  const { showToast } = useQuote();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [organization, setOrganization] = useState('');
  const [city, setCity] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inquiryId, setInquiryId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone) {
      alert('Please enter your Name and Phone Number.');
      return;
    }

    setIsSubmitting(true);
    const res = await submitQuoteInquiry({
      fullName,
      phone,
      email,
      organization,
      city,
      message,
      items: []
    });
    setIsSubmitting(false);

    if (res.success && res.inquiry) {
      setInquiryId(res.inquiry.id);
      showToast('Message sent! Medas Medical Supplier will contact you shortly.');
      setFullName('');
      setPhone('');
      setEmail('');
      setOrganization('');
      setCity('');
      setMessage('');
    } else {
      alert('Direct WhatsApp inquiry available at +92 321 4500997');
    }
  };

  return (
    <div className="space-y-12 pb-16">
      
      {/* 1. HERO HEADER */}
      <section className="bg-slate-950 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-400 bg-blue-950/70 border border-blue-800 px-4 py-1.5 rounded-full inline-block">
            Medas Medical Supplier
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            CONTACT & ORDERS
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
            Headquartered in Lahore, serving hospitals, diagnostic centers, and clinics across Pakistan.
          </p>
        </div>
      </section>

      {/* 2. CONTACT DETAILS & FORM */}
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* CONTACT INFO CARD */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
              <h3 className="text-lg font-bold text-slate-900 pb-3 border-b border-slate-100">
                Office Information
              </h3>

              <div className="space-y-4 text-xs text-slate-600">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900">Head Office Location</h5>
                    <p className="mt-0.5">Iqbal Avenue Housing Society, Lahore, Pakistan</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900">Direct Phone / WhatsApp</h5>
                    <p className="mt-0.5 font-bold text-slate-900">
                      <a href="tel:+923214500997" className="hover:text-blue-600">+92 321 4500997</a>
                    </p>
                    <p className="text-[11px] text-slate-400">Available for calls and instant orders</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900">Official Inquiries Email</h5>
                    <p className="mt-0.5">
                      <a href="mailto:medasmedicalsuppliers@gmail.com" className="text-blue-600 hover:underline">
                        medasmedicalsuppliers@gmail.com
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900">Business Hours</h5>
                    <p className="mt-0.5">Monday to Saturday: 9:00 AM – 6:00 PM</p>
                  </div>
                </div>
              </div>


              {/* SOCIAL MEDIA PLATFORMS */}
              <div className="pt-2">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 mb-3">Social Media Platforms</h4>
                <div className="flex flex-wrap items-center gap-3">
                  <a aria-label="Facebook" title="Facebook" href="https://www.facebook.com/share/1GrGPciXBH/" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-[#1877F2] text-white flex items-center justify-center text-3xl font-bold hover:scale-105 transition-transform">f</a>
                  <a aria-label="YouTube" title="YouTube" href="https://youtube.com/@medasmedicalsuppliers?si=h1VozAACJMvLWQwd" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-[#FF0000] text-white flex items-center justify-center hover:scale-105 transition-transform"><svg viewBox="0 0 24 24" className="w-7 h-7" fill="currentColor"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.6V8.4l6.2 3.6-6.2 3.6Z"/></svg></a>
                  <a aria-label="TikTok" title="TikTok" href="https://www.tiktok.com/@medasmedicalsuppliers?_r=1&_t=ZS-9Ai0NwOyRIV" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center hover:scale-105 transition-transform"><svg viewBox="0 0 24 24" className="w-7 h-7" fill="currentColor"><path d="M19.6 7.1a6.8 6.8 0 0 1-4.2-1.4v9.1a6.7 6.7 0 1 1-5.8-6.6v3.7a3 3 0 1 0 2.1 2.9V0h3.7c.2 2.2 1.7 4 4.2 4.4v2.7Z"/></svg></a>
                  <a aria-label="WhatsApp" title="WhatsApp" href="https://wa.me/923214500997" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-[#25D366] text-white flex items-center justify-center hover:scale-105 transition-transform"><svg viewBox="0 0 24 24" className="w-7 h-7" fill="currentColor"><path d="M20.5 3.5A11.8 11.8 0 0 0 2 17.7L.5 23.5l6-1.6A11.8 11.8 0 0 0 20.5 3.5ZM12 21a9.8 9.8 0 0 1-5-1.4l-.4-.2-3.5.9.9-3.4-.2-.4A9.8 9.8 0 1 1 12 21Zm5.4-7.3c-.3-.2-1.8-.9-2.1-1s-.5-.2-.7.2-.8 1-1 1.2-.4.2-.7 0a8 8 0 0 1-2.4-1.5 9 9 0 0 1-1.7-2.1c-.2-.3 0-.5.2-.7l.5-.6.2-.5-.1-.5-.9-2.1c-.2-.5-.5-.4-.7-.4h-.6c-.2 0-.5.1-.8.4s-1.1 1.1-1.1 2.6 1.1 3 1.3 3.2a11.5 11.5 0 0 0 4.4 3.9c.6.3 1.1.5 1.5.6.6.2 1.2.2 1.6.1.5-.1 1.8-.7 2.1-1.4s.3-1.3.2-1.4-.2-.2-.5-.4Z"/></svg></a>
                </div>
              </div>
            </div>

            {/* MAP CARD */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Location Map</h4>
              <div className="w-full h-44 bg-slate-50 rounded-xl overflow-hidden border border-slate-200 relative flex items-center justify-center text-center p-4">
                <div className="space-y-1.5">
                  <MapPin className="w-7 h-7 text-rose-500 mx-auto" />
                  <p className="text-xs font-bold text-slate-900">Iqbal Avenue Housing Society, Lahore</p>
                  <p className="text-[11px] text-slate-500">Accessible from Raiwind Road & Shaukat Khanum flyover</p>
                </div>
              </div>
            </div>
          </div>

          {/* CONTACT INQUIRY FORM */}
          <div className="lg:col-span-7">
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Send an Inquiry or Order Request</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Fill in your details below or message directly on WhatsApp.
                </p>
              </div>

              {inquiryId && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <span className="font-bold">Inquiry Reference: {inquiryId}</span>
                    <p className="text-emerald-700">Thank you! Medas Medical Supplier will reach out shortly.</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Doctor / Purchaser Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Dr. Muhammad Ali"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-800 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      WhatsApp / Mobile Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="0321 1234567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-800 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="contact@hospital.pk"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-800 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Hospital / Clinic / Institute
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. City Hospital / Diagnostic Clinic"
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-800 focus:outline-hidden"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      City in Pakistan
                    </label>
                    <input
                      type="text"
                      placeholder="Lahore, Karachi, Islamabad, Multan, Faisalabad, Peshawar..."
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-800 focus:outline-hidden"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Message / Equipment Needed
                    </label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Please specify ultrasound machine model or probe required..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full p-3 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-800 focus:outline-hidden"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-slate-900 hover:bg-black text-white font-bold py-3 px-6 rounded-xl text-xs transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 uppercase tracking-wider"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Sending...' : 'Send Inquiry to Medas Medical Supplier'}</span>
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
