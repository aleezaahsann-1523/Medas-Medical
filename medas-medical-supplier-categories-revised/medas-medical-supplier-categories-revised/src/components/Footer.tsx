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

  const goToCategory = (slug: string) => {
    setSelectedCategory(slug);
    setCurrentPage('shop');
  };

  const linkClass = 'hover:text-blue-600 transition-colors text-left';

  return (
    <footer className="bg-white text-slate-600 border-t border-slate-200 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          
          {/* COL 1: BRAND OVERVIEW */}
          <div className="lg:col-span-5 space-y-4">
            <div className="cursor-pointer inline-block" onClick={() => setCurrentPage('home')}>
              <Logo className="h-24 sm:h-28" />
            </div>

            <p className="text-xs leading-relaxed text-slate-600 max-w-sm">
              Medas Medical Supplier is a trusted distributor of diagnostic medical and veterinary ultrasound systems, color dopplers, and transducers in Pakistan.
            </p>

            <div className="pt-2 space-y-2 text-slate-700">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span>Iqbal Avenue Housing Society, Lahore, Pakistan</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                <a href="tel:+923214500997" className="hover:text-blue-600 transition-colors">
                  +92 321 4500997
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-blue-600 shrink-0" />
                <a href="mailto:medasmedicalsuppliers@gmail.com" className="hover:text-blue-600 transition-colors">
                  medasmedicalsuppliers@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* COL 2: HUMAN MEDICAL */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Human Medical
            </h4>
            <ul className="space-y-2 text-slate-600">
              <li>
                <button onClick={() => goToCategory('ultrasound-scanners')} className={linkClass}>
                  Ultrasound Scanners
                </button>
              </li>
              <li>
                <button onClick={() => goToCategory('portable-color-dopplers')} className={linkClass}>
                  Portable Color Dopplers
                </button>
              </li>
              <li>
                <button onClick={() => goToCategory('trolly-mounted-color-dopplers')} className={linkClass}>
                  Trolley Mounted Color Dopplers
                </button>
              </li>
              <li>
                <button onClick={() => goToCategory('usb-and-wifi-ultrasound')} className={linkClass}>
                  Wireless & USB Probes
                </button>
              </li>
              <li>
                <button onClick={() => goToCategory('ultrasound-probes')} className={linkClass}>
                  Compatible Probes
                </button>
              </li>
              <li>
                <button onClick={() => goToCategory('patient-monitors')} className={linkClass}>
                  Patient Monitors & CTG
                </button>
              </li>
            </ul>
          </div>

          {/* COL 3: VETERINARY */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Veterinary Equipment
            </h4>
            <ul className="space-y-2 text-slate-600">
              <li>
                <button onClick={() => goToCategory('veterinary-ultrasound')} className={linkClass}>
                  Vet Ultrasound
                </button>
              </li>
              <li>
                <button onClick={() => goToCategory('portable-veterinary-ultrasound-machines')} className={linkClass}>
                  Portable Vet Scanners
                </button>
              </li>
              <li>
                <button onClick={() => goToCategory('handheld-veterinary-ultrasound-machines')} className={linkClass}>
                  Handheld Scanners
                </button>
              </li>
              <li>
                <button onClick={() => goToCategory('estrous-detectors')} className={linkClass}>
                  Estrous Detectors
                </button>
              </li>
            </ul>
          </div>

          {/* COL 4: QUICK LINKS */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-2 text-slate-600">
              <li>
                <button onClick={() => setCurrentPage('about')} className={linkClass}>
                  About Medas
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('reviews')} className={linkClass}>
                  Customer Reviews
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('contact')} className={linkClass}>
                  Contact Us
                </button>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* BOTTOM COPYRIGHT */}
      <div className="border-t border-slate-200 bg-slate-50 py-5 px-4 text-center text-slate-500 text-[11px]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Medas Medical Supplier © 2026. All rights reserved.</span>
          <span>Iqbal Avenue Housing Society, Lahore, Pakistan • +92 321 4500997</span>
        </div>
      </div>
    </footer>
  );
};