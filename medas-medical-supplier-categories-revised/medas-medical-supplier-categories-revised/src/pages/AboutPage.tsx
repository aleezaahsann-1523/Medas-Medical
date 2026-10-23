import React from 'react';
import { 
  Target, 
  Eye, 
  CheckCircle2, 
  ArrowRight
} from 'lucide-react';
import { useQuote } from '../context/QuoteContext';

export const AboutPage: React.FC = () => {
  const { setCurrentPage, setSelectedCategory } = useQuote();

  return (
    <div className="space-y-16 pb-16">
      
      {/* 1. HERO HEADER */}
      <section className="bg-slate-950 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-3">
          <span className="text-xs uppercase tracking-widest font-extrabold text-blue-400 bg-blue-950/70 border border-blue-800 px-4 py-1.5 rounded-full inline-block">
            Medas Medical Supplier
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            ABOUT MEDAS MEDICAL SUPPLIER
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Leading provider of diagnostic ultrasound scanners, color doppler systems, and healthcare equipment across Pakistan.
          </p>
        </div>
      </section>

      {/* 2. CORE COMPANY HISTORY & COMMITMENT */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-7 space-y-5 text-sm text-slate-700 leading-relaxed">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block">
              Professional Diagnostic Solutions
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Why Healthcare Professionals Choose Medas Medical Supplier
            </h2>
            <p>
              At <strong>Medas Medical Supplier</strong>, we take pride in supplying state-of-the-art medical technology that meets the stringent requirements for clinical quality, imaging resolution, and long-term durability.
            </p>
            <p>
              We distribute a comprehensive portfolio of point-of-care ultrasound machines, 3D/4D color dopplers, multi-parameter patient monitors, veterinary diagnostic scanners, and compatible OEM replacement probes for GE, Toshiba, Mindray, and Honda systems.
            </p>
            <p>
              Our dedicated technical and biomedical team ensures every machine is calibrated and validated before dispatch. We are committed to offering competitive, economical pricing without compromising on diagnostic accuracy.
            </p>

            <div className="pt-2 flex flex-wrap gap-4">
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setCurrentPage('shop');
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl text-xs uppercase tracking-wider transition-colors"
              >
                Explore Full Equipment Catalog
              </button>
              <a
                href="https://wa.me/923214500997?text=Hello%20Medas%20Medical%20Supplier,%20I%20would%20like%20to%20inquire%20about%20equipment."
                target="_blank"
                rel="noopener noreferrer"
                className="bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold px-6 py-3 rounded-xl text-xs uppercase tracking-wider transition-colors"
              >
                Contact on WhatsApp
              </a>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
              <div className="w-full h-64 rounded-xl overflow-hidden bg-white border border-slate-200 flex items-center justify-center p-4">
                <img
                  src="https://sonotech.pk/wp-content/uploads/2023/06/Our-trendy-categoriy-Humen-medical-equipment.jpg"
                  alt="Medas Medical Diagnostic Equipment"
                  className="max-h-full max-w-full object-contain"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 text-center text-xs">
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <span className="text-xl font-extrabold text-blue-600">100%</span>
                  <p className="text-slate-500 font-medium mt-0.5">Pre-Delivery Tested</p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <span className="text-xl font-extrabold text-slate-900">155+</span>
                  <p className="text-slate-500 font-medium mt-0.5">Diagnostic Systems</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 3. MISSION & VISION */}
      <section className="bg-slate-50 py-16 border-y border-slate-200">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Our Mission</h3>
            <p className="text-xs text-slate-600 leading-relaxed border-l-4 border-blue-500 pl-3">
              "To be the most reliable and accessible medical equipment supplier across Pakistan by providing advanced diagnostic systems at economical, transparent pricing."
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center">
              <Eye className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Our Vision</h3>
            <p className="text-xs text-slate-600 leading-relaxed border-l-4 border-slate-800 pl-3">
              "To supply professional healthcare solutions that enhance diagnostic precision, empower clinicians, and improve patient quality of life."
            </p>
          </div>

        </div>
      </section>

      {/* 4. QUALITY COMMITMENTS */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block mb-1">
            Engineered Reliability
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Medas Biomedical Engineering Standards
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs text-slate-600">
          <div className="p-5 bg-white rounded-xl border border-slate-200 space-y-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <h4 className="font-bold text-slate-900 text-sm">Full Pre-Delivery Testing</h4>
            <p>Every unit is tested for beam uniformity, acoustic signal strength, and power safety before delivery.</p>
          </div>

          <div className="p-5 bg-white rounded-xl border border-slate-200 space-y-2">
            <CheckCircle2 className="w-5 h-5 text-blue-600" />
            <h4 className="font-bold text-slate-900 text-sm">12-Month Official Warranty</h4>
            <p>Complete warranty covering internal motherboards, ultrasound beamformers, monitors, and probe arrays.</p>
          </div>

          <div className="p-5 bg-white rounded-xl border border-slate-200 space-y-2">
            <CheckCircle2 className="w-5 h-5 text-slate-800" />
            <h4 className="font-bold text-slate-900 text-sm">Doctor & Staff Training</h4>
            <p>On-site application walkthrough and calibration training at the time of machine setup.</p>
          </div>

          <div className="p-5 bg-white rounded-xl border border-slate-200 space-y-2">
            <CheckCircle2 className="w-5 h-5 text-purple-600" />
            <h4 className="font-bold text-slate-900 text-sm">Probe Replacements</h4>
            <p>Ready stock of replacement transducers (Convex, Linear, Phased Array, TVS) in Lahore for fast dispatch.</p>
          </div>
        </div>
      </section>

      {/* 5. LOCATION & CONTACT CALLOUT */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="bg-slate-950 text-white rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-xl font-bold">Medas Medical Supplier Head Office</h3>
            <p className="text-xs text-slate-400">
              Iqbal Avenue Housing Society, Lahore, Pakistan
            </p>
            <p className="text-xs text-blue-400">
              Helpline / WhatsApp: +92 321 4500997 • Email: medasmedicalsuppliers@gmail.com
            </p>
          </div>

          <button
            onClick={() => setCurrentPage('contact')}
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-xl text-xs uppercase tracking-wider transition-colors shrink-0"
          >
            Contact & Location →
          </button>
        </div>
      </section>

    </div>
  );
};
