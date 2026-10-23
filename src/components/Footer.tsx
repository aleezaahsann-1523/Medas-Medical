import React from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';
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
    <footer
      style={{ backgroundColor: '#ffffff', color: '#475569' }}
      className="bg-white text-slate-600 border-t border-slate-200 text-xs"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">

          {/* COL 1: BRAND OVERVIEW */}
          <div className="lg:col-span-5 space-y-4">

            <div 
  onClick={() => setCurrentPage('home')}
  className="cursor-pointer shrink-0"
  title="Medas Medical Supplier"
>
  <Logo height={96} />
</div>

            <p className="text-xs leading-relaxed text-slate-600 max-w-sm">
              Medas Medical Supplier is a trusted distributor of diagnostic medical and veterinary ultrasound systems, color dopplers, and transducers in Pakistan.
            </p>

            {/* CONTACT INFORMATION */}
            <div className="pt-2 space-y-3 text-slate-700">
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
                <a
                  href="mailto:medasmedicalsuppliers@gmail.com"
                  className="hover:text-blue-600 transition-colors break-all"
                >
                  medasmedicalsuppliers@gmail.com
                </a>
              </div>
            </div>

            {/* SOCIAL MEDIA PLATFORMS */}
            <div className="pt-5 space-y-4">

              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Social Media Platforms
              </h4>

              <div className="flex flex-wrap items-center gap-3">

                {/* FACEBOOK */}
                <a
                  href="https://www.facebook.com/share/1GrGPciXBH/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Visit Medas Medical Suppliers on Facebook"
                  title="Facebook"
                  className="group flex items-center justify-center w-11 h-11 rounded-full bg-[#1877F2] text-white shadow-md transition-all duration-300 hover:scale-110 hover:shadow-lg"
                >
                  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor" aria-hidden="true">
                    <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073c0 6.019 4.388 11.016 10.125 11.927v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.973h-1.513c-1.49 0-1.956.931-1.956 1.886v2.265h3.328l-.532 3.49h-2.796V24C19.612 23.089 24 18.092 24 12.073Z" />
                  </svg>
                </a>

                {/* YOUTUBE */}
                <a
                  href="https://youtube.com/@medasmedicalsuppliers?si=h1VozAACJMvLWQwd"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Visit Medas Medical Suppliers on YouTube"
                  title="YouTube"
                  className="group flex items-center justify-center w-11 h-11 rounded-full bg-[#FF0000] text-white shadow-md transition-all duration-300 hover:scale-110 hover:shadow-lg"
                >
                  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor" aria-hidden="true">
                    <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.6V8.4l6.2 3.6-6.2 3.6Z" />
                  </svg>
                </a>

                {/* TIKTOK */}
                <a
                  href="https://www.tiktok.com/@medasmedicalsuppliers?_r=1&_t=ZS-9Ai0NwOyRIV"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="TikTok"
                  title="TikTok"
                  className="flex items-center justify-center w-11 h-11 rounded-full bg-black shadow-md transition-transform duration-300 hover:scale-110"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="27"
                    height="27"
                    aria-hidden="true"
                  >
                    <path
                      fill="#25F4EE"
                      d="M19.321 5.562a5.124 5.124 0 0 1-3.03-3.03A5.043 5.043 0 0 1 16.02 1H12.4v14.7a3.018 3.018 0 1 1-3.018-3.018c.31 0 .608.047.89.134V9.13a7.027 7.027 0 1 0 5.748 6.89V8.51a8.71 8.71 0 0 0 5.1 1.64V6.53a5.1 5.1 0 0 1-1.799-.968Z"
                      transform="translate(-1 -0.5)"
                    />
                    <path
                      fill="#FE2C55"
                      d="M19.321 5.562a5.124 5.124 0 0 1-3.03-3.03A5.043 5.043 0 0 1 16.02 1H12.4v14.7a3.018 3.018 0 1 1-3.018-3.018c.31 0 .608.047.89.134V9.13a7.027 7.027 0 1 0 5.748 6.89V8.51a8.71 8.71 0 0 0 5.1 1.64V6.53a5.1 5.1 0 0 1-1.799-.968Z"
                      transform="translate(0.3 0.2)"
                    />
                    <path
                      fill="#FFFFFF"
                      d="M19.321 5.562a5.124 5.124 0 0 1-3.03-3.03A5.043 5.043 0 0 1 16.02 1H12.4v14.7a3.018 3.018 0 1 1-3.018-3.018c.31 0 .608.047.89.134V9.13a7.027 7.027 0 1 0 5.748 6.89V8.51a8.71 8.71 0 0 0 5.1 1.64V6.53a5.1 5.1 0 0 1-1.799-.968Z"
                    />
                  </svg>
                </a>

                {/* WHATSAPP */}
                <a
                  href="https://wa.me/923214500997"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Chat with Medas Medical Suppliers on WhatsApp"
                  title="WhatsApp"
                  className="group flex items-center justify-center w-11 h-11 rounded-full bg-[#25D366] text-white shadow-md transition-all duration-300 hover:scale-110 hover:shadow-lg"
                >
                  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor" aria-hidden="true">
                    <path d="M20.52 3.48A11.82 11.82 0 0 0 12.04 0C5.5 0 .18 5.32.18 11.86c0 2.09.55 4.13 1.59 5.93L.08 24l6.37-1.67a11.88 11.88 0 0 0 5.59 1.42h.01c6.54 0 11.86-5.32 11.86-11.86 0-3.17-1.24-6.15-3.39-8.41ZM12.04 21.7a9.83 9.83 0 0 1-5.01-1.37l-.36-.21-3.78.99 1.01-3.69-.24-.38a9.82 9.82 0 1 1 8.38 4.66Zm5.39-7.36c-.3-.15-1.78-.88-2.05-.98-.28-.1-.48-.15-.68.15-.2.3-.78.98-.95 1.18-.18.2-.35.22-.65.07-.3-.15-1.27-.47-2.42-1.49-.89-.79-1.49-1.77-1.67-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.53.15-.17.2-.3.3-.5.1-.2.05-.38-.03-.53-.08-.15-.68-1.63-.93-2.23-.24-.58-.49-.5-.68-.51h-.58c-.2 0-.53.07-.8.37-.28.3-1.05 1.03-1.05 2.5s1.08 2.9 1.23 3.1c.15.2 2.12 3.24 5.14 4.54.72.31 1.28.5 1.71.64.72.23 1.38.2 1.9.12.58-.09 1.78-.73 2.03-1.43.25-.7.25-1.3.17-1.43-.08-.12-.28-.2-.58-.35Z" />
                  </svg>
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
              <li><button onClick={() => goToCategory('ultrasound-scanners')} className={linkClass}>Ultrasound Scanners</button></li>
              <li><button onClick={() => goToCategory('portable-color-dopplers')} className={linkClass}>Portable Color Dopplers</button></li>
              <li><button onClick={() => goToCategory('trolly-mounted-color-dopplers')} className={linkClass}>Trolley Mounted Color Dopplers</button></li>
              <li><button onClick={() => goToCategory('usb-and-wifi-ultrasound')} className={linkClass}>Wireless & USB Probes</button></li>
              <li><button onClick={() => goToCategory('ultrasound-probes')} className={linkClass}>Compatible Probes</button></li>
              <li><button onClick={() => goToCategory('patient-monitors')} className={linkClass}>Patient Monitors & CTG</button></li>
            </ul>
          </div>

          {/* COL 3: VETERINARY */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Veterinary Equipment
            </h4>
            <ul className="space-y-2 text-slate-600">
              <li><button onClick={() => goToCategory('veterinary-ultrasound')} className={linkClass}>Vet Ultrasound</button></li>
              <li><button onClick={() => goToCategory('portable-veterinary-ultrasound-machines')} className={linkClass}>Portable Vet Scanners</button></li>
              <li><button onClick={() => goToCategory('handheld-veterinary-ultrasound-machines')} className={linkClass}>Handheld Scanners</button></li>
              <li><button onClick={() => goToCategory('estrous-detectors')} className={linkClass}>Estrous Detectors</button></li>
            </ul>
          </div>

          {/* COL 4: QUICK LINKS */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-2 text-slate-600">
              <li><button onClick={() => setCurrentPage('about')} className={linkClass}>About Medas</button></li>
              <li><button onClick={() => setCurrentPage('reviews')} className={linkClass}>Customer Reviews</button></li>
              <li><button onClick={() => setCurrentPage('contact')} className={linkClass}>Contact Us</button></li>
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