import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  MessageCircle,
  PhoneCall,
  ShieldCheck,
  Headphones,
  BadgeCheck,
  ChevronRight,
  Star,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  Play,
  Volume2,
  VolumeX,
} from 'lucide-react';

import localProducts from '../data/products.json';
import localCategories from '../data/categories.json';
import { Product } from '../types';
import { ProductCard } from '../components/ProductCard';
import { useQuote } from '../context/QuoteContext';

// Local circular images for sub-categories (public/images/categories).
// Change a file name here if you want a different picture for any category.
const CATEGORY_IMAGE_BASE = '/images/categories/';

const categoryImageFiles: Record<string, string> = {
  // Human Medical Equipment
  accessories: 'accessories.webp',
  'electrocardiogram-ecg': 'ecg.webp',
  'fetal-dopplers': 'ctg.webp',
  'fetal-maternal-monitors-ctg': 'ctg.webp',
  'lab-daignistic-equipment': 'lab equipment.webp',
  'patient-monitors': 'vital-signs.webp',
  'radiology-equipment': 'radiology.webp',
  'ultrasound-probes': 'usb n ultrasound.webp',
  'ultrasound-scanners': 'ultrasound.webp',
  'usb-and-wifi-ultrasound': 'usb n wifi.webp',

  // Veterinary Medical Equipment
  'estrous-detectors': 'motion-detector.webp',
  'm-veterniary': 'vet radiology.webp',
  'mastitis-detectors': 'mastitis.webp',
  'pregnancy-detectors': 'pregnancy-test.webp',
  'vet-ultrasound-scanners': 'vet.webp',
  'veterinary-patient-monitor': 'veterinary patient.webp',
  'veterinary-ultrasound': 'usb n wifi.webp',
  'veterinay-lab-equipment': 'vet lab.webp',
};

const getCategoryImage = (category: any): string | null => {
  const file = categoryImageFiles[category.slug];
  if (file) return encodeURI(`${CATEGORY_IMAGE_BASE}${file}`);
  return null;
};

export const HomePage: React.FC = () => {
  // Product video carousel: only the center video auto-plays, muted.
  const videoItems = [
    { src: '/videos/video1.mp4', label: 'Product video 1' },
    { src: '/videos/video2.mp4', label: 'Product video 2' },
    { src: '/videos/video3.mp4', label: 'Product video 3' },
  ];
  const [activeVideo, setActiveVideo] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const centerVideoRef = useRef<HTMLVideoElement | null>(null);

  const moveVideo = (direction: number) => {
    setActiveVideo((current) => (current + direction + videoItems.length) % videoItems.length);
    setSoundEnabled(false);
  };

  const selectVideo = (index: number) => {
    setActiveVideo(index);
    setSoundEnabled(true);
  };

  useEffect(() => {
    const video = centerVideoRef.current;
    if (!video) return;
    video.muted = !soundEnabled;
    const playPromise = video.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(() => {
        // Some browsers block playback until the visitor interacts with the page.
      });
    }
  }, [activeVideo, soundEnabled]);

  const {
    setCurrentPage,
    setSelectedCategory,
    openProductModal,
  } = useQuote();

  // Normalize technicalData to prevent undefined values.
  const products: Product[] = (
    localProducts as unknown as Product[]
  ).map((product) => ({
    ...product,
    technicalData: Object.fromEntries(
      Object.entries(product.technicalData ?? {}).filter(
        ([, value]) => typeof value === 'string'
      )
    ),
  }));

  const categories = localCategories as any[];

  const bestSlugs = [
    'volta-notepad-345',
    'volta-vsonic-295',
    'volta-vsonic-plus12',
    'volta-sonobook',
  ];

  const best = bestSlugs
    .map((slug) => products.find((product) => product.slug === slug))
    .filter((product): product is Product => Boolean(product));

  const humanRoot = categories.find(
    (category: any) =>
      category.slug === 'human-medical-equipment'
  );

  const vetRoot = categories.find(
    (category: any) =>
      category.slug === 'vterinary-medical-equipment'
  );

  const humanCategories = categories
    .filter(
      (category: any) =>
        category.parentSlug === 'human-medical-equipment' &&
        category.slug !== 'fetal-maternal-monitors-ctg'
    )
    .sort((a: any, b: any) => a.name.localeCompare(b.name));

  const vetCategories = categories
    .filter(
      (category: any) =>
        category.parentSlug === 'vterinary-medical-equipment'
    )
    .sort((a: any, b: any) => a.name.localeCompare(b.name));

  const choose = (slug: string) => {
    setSelectedCategory(slug);
    setCurrentPage('shop');
  };

  const categoryGroups = [
    {
      root: humanRoot,
      subs: humanCategories,
      fallback:
        'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1000&q=85',
      title: 'Human Medical Equipment',
      label: 'Human healthcare',
    },
    {
      root: vetRoot,
      subs: vetCategories,
      fallback:
        'https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?auto=format&fit=crop&w=1000&q=85',
      title: 'Veterinary Medical Equipment',
      label: 'Veterinary care',
    },
  ];

  return (
    <div className="home-redesign text-slate-900">
      {/* Hero */}
      <section className="hero-clean relative overflow-hidden text-white">
        <div className="hero-photo" />
        <div className="hero-shade" />

        <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-10 px-5 py-20 md:grid-cols-[1.1fr_.9fr] md:py-28">
          <div>
            <span className="inline-flex rounded-full border border-blue-300/40 bg-blue-950/40 px-4 py-2 text-xs font-bold uppercase tracking-widest text-blue-100">
              Medas Medical Suppliers · Lahore
            </span>

            <h1 className="mt-6 text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
              Precision imaging.
              <br />
              <span className="text-blue-300">Better care.</span>
            </h1>

            <p className="mt-5 max-w-xl text-base leading-8 text-slate-200 md:text-lg">
              Explore dependable human and veterinary ultrasound systems,
              portable scanners, probes and diagnostic equipment for clinics
              and healthcare professionals.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={() => choose('all')}
                className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 font-bold hover:bg-blue-500"
              >
                Explore equipment <ArrowRight size={17} />
              </button>

              <a
                className="flex items-center gap-2 rounded-xl border border-white/40 bg-white/10 px-6 py-3.5 font-bold hover:bg-white/20"
                href="https://wa.me/923214500997"
                target="_blank"
                rel="noreferrer"
              >
                <MessageCircle size={17} /> WhatsApp us
              </a>
            </div>

            <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-200">
              <span>✓ Human &amp; veterinary systems</span>
              <span>✓ Supplier support</span>
              <span>✓ Nationwide inquiries</span>
            </div>
          </div>

          <div className="hero-feature rounded-3xl border border-white/20 bg-white/10 p-5 backdrop-blur-sm md:p-7">
            <img
              className="h-64 w-full object-contain md:h-80"
              src={
                best[0]?.featuredImage?.src ||
                'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=900&q=85'
              }
              alt="Portable ultrasound system"
            />

            <div className="flex items-center justify-between gap-4 border-t border-white/20 pt-5">
              <div>
                <p className="text-xs uppercase tracking-widest text-blue-200">
                  Featured system
                </p>
                <h3 className="mt-1 text-xl font-bold">VOLTA NOTEPAD</h3>
                <p className="mt-1 text-sm text-slate-200">
                  Portable notebook ultrasound
                </p>
              </div>

              <button
                onClick={() => best[0] && openProductModal(best[0])}
                className="rounded-full bg-white p-3 text-blue-900"
                aria-label="View Volta Notepad"
              >
                <ArrowRight />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="mx-auto max-w-7xl px-5 py-16 md:py-20">
        <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
          <div className="rounded-3xl bg-blue-50 p-5 md:p-8">
            <img
              src="https://images.unsplash.com/photo-1584982751601-97dcc096659c?auto=format&fit=crop&w=1000&q=85"
              alt="Medical diagnostic equipment"
              className="h-72 w-full rounded-2xl object-cover md:h-96"
            />
          </div>

          <div>
            <p className="text-xs font-extrabold uppercase tracking-[.2em] text-blue-600">
              About Medas
            </p>

            <h2 className="mt-3 text-3xl font-extrabold leading-tight md:text-4xl">
              Medical equipment that supports confident decisions.
            </h2>

            <p className="mt-5 leading-7 text-slate-600">
              Medas Medical Suppliers provides ultrasound and diagnostic
              equipment for human healthcare and veterinary practices. We help
              customers explore suitable systems, ask product-specific
              questions and confirm pricing, availability and technical details
              before purchase.
            </p>

            <div className="mt-7 grid gap-4 sm:grid-cols-2">
              <div className="flex gap-3">
                <BadgeCheck className="shrink-0 text-blue-600" />
                <div>
                  <b>Product guidance</b>
                  <p className="mt-1 text-sm text-slate-500">
                    Ask about features and compatible probes.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Headphones className="shrink-0 text-blue-600" />
                <div>
                  <b>Direct assistance</b>
                  <p className="mt-1 text-sm text-slate-500">
                    Talk to our team about your requirements.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setCurrentPage('about')}
              className="mt-7 inline-flex items-center gap-2 font-bold text-blue-700"
            >
              More about us <ArrowRight size={17} />
            </button>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="border-y border-slate-100 bg-slate-50 py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-5">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-extrabold uppercase tracking-[.2em] text-blue-600">
              Browse by equipment
            </p>
            <h2 className="mt-3 text-3xl font-extrabold md:text-4xl">
              Our Categories
            </h2>
            <p className="mt-3 text-slate-500">
              Choose a medical category first, then explore its related
              equipment.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:gap-8 lg:grid-cols-2">
            {categoryGroups.map((group: any) => (
              <div
                key={group.root?.slug || group.title}
                className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
              >
                <button
                  onClick={() => choose(group.root?.slug || 'all')}
                  className="group relative block w-full text-left"
                >
                  <img
                    src={group.root?.image?.src || group.fallback}
                    alt={group.title}
                    className="h-52 w-full object-cover transition-transform duration-500 group-hover:scale-[1.02] sm:h-64"
                  />

                  <span className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-900/20 to-transparent" />

                  <span className="absolute bottom-5 left-5 right-5 text-white">
                    <span className="block text-xs font-bold uppercase tracking-[.2em] text-blue-200">
                      {group.label}
                    </span>
                    <span className="mt-1 block text-2xl font-extrabold sm:text-3xl">
                      {group.title}
                    </span>
                    <span className="mt-3 inline-flex items-center gap-2 text-sm font-bold">
                      Explore category <ArrowRight size={16} />
                    </span>
                  </span>
                </button>

                <div className="p-5 sm:p-6">
                  <div className="grid grid-cols-3 gap-x-3 gap-y-6 sm:grid-cols-4">
                    {group.subs.map((category: any) => {
                      const imageSrc = getCategoryImage(category);

                      return (
                        <button
                          key={category.slug}
                          onClick={() => choose(category.slug)}
                          className="group flex min-w-0 flex-col items-center text-center"
                        >
                          <span className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border border-slate-100 bg-slate-50 ring-4 ring-slate-50 transition-all group-hover:ring-blue-100 sm:h-24 sm:w-24">
                            {imageSrc ? (
                              <img
                                src={imageSrc}
                                alt={category.name}
                                loading="lazy"
                                className="h-full w-full object-contain p-3"
                                onError={(event) => {
                                  event.currentTarget.style.visibility = 'hidden';
                                }}
                              />
                            ) : (
                              <span className="px-2 text-center text-xs text-slate-400">
                                Image unavailable
                              </span>
                            )}
                          </span>

                          <span className="mt-3 text-xs font-bold leading-snug text-slate-800 group-hover:text-blue-700 sm:text-sm">
                            {category.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {group.subs.length === 0 && (
                    <p className="text-sm text-slate-500">
                      Browse all related equipment.
                    </p>
                  )}

                  <button
                    onClick={() => choose(group.root?.slug || 'all')}
                    className="mt-6 w-full rounded-xl border border-blue-200 bg-blue-50/60 px-4 py-3 text-sm font-bold text-blue-700 hover:bg-blue-100"
                  >
                    View all {group.title}{' '}
                    <ArrowRight className="ml-1 inline" size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={() => choose('all')}
              className="rounded-xl bg-blue-700 px-6 py-3 font-bold text-white hover:bg-blue-600"
            >
              View all products <ArrowRight className="ml-2 inline" size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* Best selling products */}
      <section className="mx-auto max-w-7xl px-5 py-16 md:py-20">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[.2em] text-blue-600">
              Customer favourites
            </p>
            <h2 className="mt-2 text-3xl font-extrabold md:text-4xl">
              Best Selling Products
            </h2>
            <p className="mt-3 text-slate-500">
              Featured portable and clinical ultrasound systems.
            </p>
          </div>

          <button
            onClick={() => {
              setCurrentPage('shop');
              setSelectedCategory('all');
            }}
            className="font-bold text-blue-700"
          >
            View all products <ArrowRight className="ml-1 inline" size={16} />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {best.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Why choose us */}
      <section className="bg-slate-950 py-16 text-white md:py-20">
        <div className="mx-auto max-w-7xl px-5">
          <div className="max-w-2xl">
            <p className="text-xs font-extrabold uppercase tracking-[.2em] text-blue-300">
              The Medas difference
            </p>
            <h2 className="mt-3 text-3xl font-extrabold md:text-4xl">
              Why Choose Us?
            </h2>
            <p className="mt-3 text-slate-400">
              Helpful product information and a straightforward way to connect
              with our team.
            </p>
          </div>

          <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                n: '01',
                title: 'Product-first guidance',
                desc: 'Discuss your clinical needs before deciding on a system.',
              },
              {
                n: '02',
                title: 'Human & veterinary range',
                desc: 'Explore equipment for different diagnostic environments.',
              },
              {
                n: '03',
                title: 'Clear price inquiries',
                desc: 'Confirm current price and availability directly with our team.',
              },
              {
                n: '04',
                title: 'Responsive support',
                desc: 'Reach out for product information and purchase assistance.',
              },
            ].map((item) => (
              <div
                key={item.n}
                className="rounded-2xl border border-white/10 bg-white/[.04] p-6"
              >
                <span className="text-5xl font-black text-blue-500 md:text-6xl">
                  {item.n}
                </span>
                <h3 className="mt-5 text-lg font-bold">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      
      {/* Product video carousel */}
      <section
        className="overflow-hidden bg-white py-16 md:py-20"
        aria-label="Product videos"
      >
        <div className="mx-auto max-w-7xl px-5">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-extrabold uppercase tracking-[.2em] text-blue-600">
              Product in action
            </p>
            <h2 className="mt-3 text-3xl font-extrabold text-slate-900 md:text-4xl">
              Watch Our Products
            </h2>
          </div>

          <div className="relative mx-auto mt-10 flex max-w-6xl items-center justify-center gap-3 sm:gap-5 md:gap-7">
            {/* Previous */}
            <button
              type="button"
              onClick={() => moveVideo(-1)}
              aria-label="Previous product video"
              className="absolute left-0 z-30 flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-800 shadow-lg hover:bg-blue-600 hover:text-white sm:static sm:h-12 sm:w-12 sm:shrink-0"
            >
              <ChevronLeft size={24} />
            </button>

            {[-1, 0, 1].map((offset) => {
              const index =
                (activeVideo + offset + videoItems.length) %
                videoItems.length;

              const isCenter = offset === 0;

              return (
                <button
                  type="button"
                  key={`${offset}-${index}`}
                  onClick={() => {
                    if (!isCenter) {
                      selectVideo(index);
                    } else {
                      setSoundEnabled((enabled) => !enabled);
                    }
                  }}
                  aria-label={
                    isCenter
                      ? soundEnabled
                        ? 'Mute current video'
                        : 'Enable sound'
                      : `Play ${videoItems[index].label}`
                  }
                  className={[
                    'group relative block min-w-0 overflow-hidden rounded-2xl bg-slate-950 shadow-xl transition-all duration-500 focus-visible:ring-4 focus-visible:ring-blue-400',
                    isCenter
                      ? 'z-10 aspect-[4/5] w-[68%] sm:aspect-video sm:w-[58%] md:w-[54%]'
                      : 'aspect-[4/5] w-[16%] sm:w-[20%] md:w-[21%]',
                  ].join(' ')}
                >
                  <video
                    key={videoItems[index].src}
                    src={videoItems[index].src}
                    autoPlay
                    muted={!isCenter || !soundEnabled}
                    playsInline
                    loop
                    preload="auto"
                    controls={false}
                    onError={(event) => {
                      console.error(
                        'Video failed to load:',
                        videoItems[index].src,
                        event.currentTarget.error
                      );
                    }}
                    className={[
                      'absolute inset-0 h-full w-full object-cover',
                      !isCenter ? 'pointer-events-none' : '',
                    ].join(' ')}
                  />

                  {/* Play button on side previews */}
                  {!isCenter && (
                    <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/10">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-blue-700 shadow-lg sm:h-12 sm:w-12">
                        <Play size={22} fill="currentColor" />
                      </span>
                    </span>
                  )}

                  {/* Sound indicator on center video */}
                  {isCenter && (
                    <span className="pointer-events-none absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm">
                      {soundEnabled ? (
                        <Volume2 size={20} />
                      ) : (
                        <VolumeX size={20} />
                      )}
                    </span>
                  )}
                </button>
              );
            })}

            {/* Next */}
            <button
              type="button"
              onClick={() => moveVideo(1)}
              aria-label="Next product video"
              className="absolute right-0 z-30 flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-800 shadow-lg hover:bg-blue-600 hover:text-white sm:static sm:h-12 sm:w-12 sm:shrink-0"
            >
              <ChevronRightIcon size={24} />
            </button>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="contact-cta relative overflow-hidden">
        <div className="cta-bg" />
        <div className="relative mx-auto max-w-7xl px-5 py-14 text-center text-white md:py-20">
          <p className="text-xs font-extrabold uppercase tracking-[.2em] text-blue-200">
            Let's talk equipment
          </p>
          <h2 className="mt-3 text-3xl font-extrabold md:text-5xl">
            Need help choosing a system?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-200">
            Contact Medas Medical Suppliers for product availability, pricing
            and technical information.
          </p>

          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <a
              href="https://wa.me/923214500997"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 font-bold hover:bg-blue-500"
            >
              <MessageCircle size={18} /> WhatsApp: +92 321 4500997
            </a>
            <a
              href="tel:+923214500997"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 font-bold text-slate-900 hover:bg-blue-50"
            >
              <PhoneCall size={18} /> Call us
            </a>
          </div>

          <p className="mt-5 text-sm text-slate-300">
            Iqbal Avenue Housing Society, Lahore, Pakistan ·
            medasmedicalsuppliers@gmail.com
          </p>
        </div>
      </section>
    </div>
  );
};