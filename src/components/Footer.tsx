import React from 'react';
import { 
  Phone, 
  Mail, 
  MapPin
} from 'lucide-react';
import { useQuote } from '../context/QuoteContext';
import { Logo } from './Logo';

export const Footer: React.FC = () => {
  const { setCurrentPage, setSelectedCategory } = useQuote();

  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-900 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          
          {/* COL 1: BRAND OVERVIEW */}
          <div className="lg:col-span-5 space-y-4">
            <div className="cursor-pointer" onClick={() => setCurrentPage('home')}>
              <Logo className="h-10 brightness-0 invert" />
            </div>

            <p className="text-xs leading-relaxed text-slate-400 max-w-sm">
              Medas Medical Supplier is a trusted distributor of diagnostic medical and veterinary ultrasound systems, color dopplers, and transducers in Pakistan.
            </p>

            <div className="pt-2 space-y-2 text-slate-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>Iqbal Avenue Housing Society, Lahore, Pakistan</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href="tel:+923214500997" className="hover:text-white transition-colors">
                  +92 321 4500997
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <a href="mailto:medasmedicalsuppliers@gmail.com" className="hover:text-white transition-colors">
                  medasmedicalsuppliers@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* COL 2: HUMAN MEDICAL */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Human Medical
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button 
                  onClick={() => { setSelectedCategory('ultrasound-scanners'); setCurrentPage('shop'); }}
                  className="hover:text-white transition-colors text-left"
                >
                  Ultrasound Scanners
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setSelectedCategory('portable-color-dopplers'); setCurrentPage('shop'); }}
                  className="hover:text-white transition-colors text-left"
                >
                  Portable Color Dopplers
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setSelectedCategory('trolly-mounted-color-dopplers'); setCurrentPage('shop'); }}
                  className="hover:text-white transition-colors text-left"
                >
                  Trolley Mounted Color Dopplers
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setSelectedCategory('usb-and-wifi-ultrasound'); setCurrentPage('shop'); }}
                  className="hover:text-white transition-colors text-left"
                >
                  Wireless & USB Probes
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setSelectedCategory('ultrasound-probes'); setCurrentPage('shop'); }}
                  className="hover:text-white transition-colors text-left"
                >
                  Compatible Probes
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setSelectedCategory('patient-monitors'); setCurrentPage('shop'); }}
                  className="hover:text-white transition-colors text-left"
                >
                  Patient Monitors & CTG
                </button>
              </li>
            </ul>
          </div>

          {/* COL 3: VETERINARY */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Veterinary Equipment
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button 
                  onClick={() => { setSelectedCategory('veterinary-ultrasound'); setCurrentPage('shop'); }}
                  className="hover:text-white transition-colors text-left"
                >
                  Vet Ultrasound
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setSelectedCategory('portable-veterinary-ultrasound-machines'); setCurrentPage('shop'); }}
                  className="hover:text-white transition-colors text-left"
                >
                  Portable Vet Scanners
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setSelectedCategory('handheld-veterinary-ultrasound-machines'); setCurrentPage('shop'); }}
                  className="hover:text-white transition-colors text-left"
                >
                  Handheld Scanners
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setSelectedCategory('estrous-detectors'); setCurrentPage('shop'); }}
                  className="hover:text-white transition-colors text-left"
                >
                  Estrous Detectors
                </button>
              </li>
            </ul>
          </div>

          {/* COL 4: QUICK NAVIGATION (NO ADMIN PORTAL) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button onClick={() => setCurrentPage('about')} className="hover:text-white transition-colors">
                  About Medas
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('reviews')} className="hover:text-white transition-colors">
                  Customer Reviews
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('contact')} className="hover:text-white transition-colors">
                  Contact Us
                </button>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* BOTTOM COPYRIGHT */}
      <div className="border-t border-slate-900 py-5 px-4 text-center text-slate-500 text-[11px]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Medas Medical Supplier © 2026. All rights reserved.</span>
          <span>Iqbal Avenue Housing Society, Lahore, Pakistan • +92 321 4500997</span>
        </div>
      </div>
    </footer>
  );
};
