import React from 'react';
import { Play, Award, Video, FileText, ExternalLink, ShieldCheck } from 'lucide-react';
import { useQuote } from '../context/QuoteContext';

export const MediaPage: React.FC = () => {
  const { setCurrentPage, setSelectedCategory, openQuoteModal } = useQuote();

  const mediaItems = [
    {
      title: 'G20 Vet Ultrasound System Clinical Demonstration',
      category: 'Veterinary Diagnostics',
      date: '2024',
      description: 'Hands-on clinical review of the G20 portable veterinary scanner showing reproductive examination and high-contrast transducer presets.',
      image: 'https://sonotech.pk/wp-content/uploads/2023/06/Our-trendy-categoriy-veterinary-medical-equipment.jpg',
      link: 'https://www.youtube.com/@sonotech'
    },
    {
      title: 'Wireless D3 Handheld Ultrasound WiFi Probe Testing',
      category: 'Point of Care (POCUS)',
      date: '2024',
      description: 'Zero-latency mobile tablet imaging demonstration with D3 convex and linear wireless ultrasound probes.',
      image: 'https://sonotech.pk/wp-content/uploads/2023/06/wireless-D3-probe.jpg',
      link: 'https://www.youtube.com/@sonotech'
    },
    {
      title: 'Vet EMP-7 Cardiac Color Doppler System Overview',
      category: 'Cardiovascular Doppler',
      date: '2023',
      description: 'Comprehensive walkthrough of pulsed wave Doppler, color flow mapping, and cardiac phased array imaging.',
      image: 'https://sonotech.pk/wp-content/uploads/2023/06/Our-trendy-categoriy-Humen-ultrasound-scanner.jpg',
      link: 'https://www.youtube.com/@sonotech'
    },
    {
      title: 'Medical Ultrasound Probe Acoustic Crystal Calibration',
      category: 'Biomedical Engineering',
      date: '2023',
      description: 'Quality testing laboratory protocol at SonoTech Lahore facility: testing pin continuity, acoustic lens safety, and element sensitivity.',
      image: 'https://sonotech.pk/wp-content/uploads/2023/07/Toshiba-PVT-375BT.jpg',
      link: 'https://www.youtube.com/@sonotech'
    }
  ];

  return (
    <div className="space-y-12 pb-16">
      
      {/* HEADER */}
      <section className="bg-slate-900 text-white py-14 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-400 bg-blue-950/60 border border-blue-800 px-3 py-1 rounded-full">
            Technical Showcases & Demos
          </span>
          <h1 className="text-3xl sm:text-4xl font-black">
            SONOTECH CLINICAL & TECHNICAL MEDIA
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
            Explore video demonstrations, clinical ultrasound presentations, and biomedical engineering protocols from our YouTube channel and training events.
          </p>
        </div>
      </section>

      {/* MEDIA GRID */}
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {mediaItems.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg transition-all group flex flex-col justify-between"
            >
              <div className="w-full h-56 bg-slate-900 relative overflow-hidden flex items-center justify-center p-4">
                <img
                  src={item.image}
                  alt={item.title}
                  className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300 opacity-90 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-blue-600/90 group-hover:bg-blue-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Play className="w-5 h-5 ml-1 fill-current" />
                  </div>
                </div>
                <span className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                  {item.category}
                </span>
              </div>

              <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-base text-slate-900 group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">Recorded by SonoTech Biomedical Team</span>
                  <a
                    href="https://www.youtube.com"
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    <span>Watch Demonstration</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
