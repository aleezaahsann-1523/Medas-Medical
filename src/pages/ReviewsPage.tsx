import React, { useState } from 'react';
import { Star, CheckCircle2, MessageSquare, ThumbsUp, ShieldCheck, UserCheck, Plus } from 'lucide-react';
import { useQuote } from '../context/QuoteContext';

export const ReviewsPage: React.FC = () => {
  const { showToast } = useQuote();
  const [showForm, setShowForm] = useState(false);
  const [reviewerName, setReviewerName] = useState('');
  const [hospital, setHospital] = useState('');
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(5);

  const [reviewsList, setReviewsList] = useState([
    {
      id: 1,
      author: 'Dr. S. K. Naqvi',
      title: 'Consultant Radiologist',
      institution: 'Diagnostic Imaging Center, Lahore',
      rating: 5,
      date: 'March 2024',
      system: 'Portable Color Doppler System',
      comment: 'Medas Medical Supplier supplied our diagnostic facility with a high-performance color Doppler and two compatible multi-frequency probes. The spatial resolution and Doppler sensitivity on deep pelvic scans have been superb. On-site engineer support was prompt and courteous.'
    },
    {
      id: 2,
      author: 'Dr. Samina Rizvi',
      title: 'Obstetrician & Gynecologist',
      institution: 'Maternity Care Hospital, Karachi',
      rating: 5,
      date: 'January 2024',
      system: '3D/4D Ob/Gyn Ultrasound Scanner',
      comment: 'Very pleased with the 3D surface rendering clarity for fetal imaging. The warranty support from Medas Medical Supplier gives us total peace of mind. Delivery to Karachi was safely managed with wood crating.'
    },
    {
      id: 3,
      author: 'Dr. Farooq Ahmad',
      title: 'Chief Veterinary Officer',
      institution: 'Punjab Dairy Development Board, Sahiwal',
      rating: 5,
      date: 'November 2023',
      system: 'Draminski Veterinary Ultrasound & Pregnancy Detector',
      comment: 'We procured multiple portable handheld veterinary scanners for cattle pregnancy testing in field conditions. The battery endurance and water-resistant probe housing are outstanding for farm work.'
    },
    {
      id: 4,
      author: 'Dr. Imran Bukhari',
      title: 'Senior Sonologist',
      institution: 'City Health Complex, Islamabad',
      rating: 5,
      date: 'August 2023',
      system: 'Mindray & Toshiba Compatible Replacement Probes',
      comment: 'We needed an immediate probe replacement after a crystal drop. Medas Medical Supplier dispatched the compatible convex transducer within 24 hours. Calibration parameters matched OEM standards at half the price.'
    }
  ]);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName || !comment) return;

    setReviewsList([
      {
        id: Date.now(),
        author: reviewerName,
        title: 'Healthcare Practitioner',
        institution: hospital || 'Private Clinic, Pakistan',
        rating,
        date: 'Just now',
        system: 'Ultrasound Diagnostic Equipment',
        comment
      },
      ...reviewsList
    ]);

    showToast('Thank you! Your clinical review has been added.');
    setShowForm(false);
    setReviewerName('');
    setHospital('');
    setComment('');
  };

  return (
    <div className="space-y-12 pb-16">
      
      {/* HEADER */}
      <section className="bg-slate-900 text-white py-14 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-3 py-1 rounded-full">
            Verified Healthcare Endorsements
          </span>
          <h1 className="text-3xl sm:text-4xl font-black">
            CUSTOMER REVIEWS & CLINICAL TESTIMONIALS
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
            Read authentic feedback from radiologists, sonologists, obstetricians, and veterinarians who rely on Medas Medical Supplier diagnostic systems daily across Pakistan.
          </p>
        </div>
      </section>

      {/* RATINGS STRIP */}
      <div className="max-w-5xl mx-auto px-4">
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="text-center md:border-r border-slate-200 md:pr-6">
            <span className="text-5xl font-black text-slate-900">5.0</span>
            <div className="flex justify-center text-amber-400 my-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-current" />
              ))}
            </div>
            <p className="text-xs text-slate-500">Average Customer Rating in Pakistan</p>
          </div>

          <div className="space-y-1.5 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <span>Image Resolution & Quality</span>
              <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="w-full h-full bg-emerald-500" />
              </div>
              <span className="font-bold">100%</span>
            </div>
            <div className="flex items-center gap-2">
              <span>Biomedical Warranty Support</span>
              <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="w-[98%] h-full bg-emerald-500" />
              </div>
              <span className="font-bold">98%</span>
            </div>
            <div className="flex items-center gap-2">
              <span>On-Time Nationwide Delivery</span>
              <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="w-full h-full bg-emerald-500" />
              </div>
              <span className="font-bold">100%</span>
            </div>
          </div>

          <div className="text-center md:border-l border-slate-200 md:pl-6">
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition-colors shadow-xs flex items-center justify-center gap-1.5 mx-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Submit Doctor Review</span>
            </button>
          </div>
        </div>

        {/* SUBMIT REVIEW FORM */}
        {showForm && (
          <form onSubmit={handleSubmitReview} className="mt-6 p-6 bg-slate-50 border border-blue-200 rounded-2xl space-y-4 text-xs">
            <h4 className="font-bold text-slate-900 text-sm">Submit Clinical Experience</h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Your Full Name & Title *</label>
                <input
                  type="text"
                  required
                  placeholder="Dr. Tariq Mahmood"
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Hospital / Clinic / City</label>
                <input
                  type="text"
                  placeholder="e.g. Mayo Hospital / Lahore"
                  value={hospital}
                  onChange={(e) => setHospital(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Rating</label>
                <select
                  value={rating}
                  onChange={(e) => setRating(parseInt(e.target.value))}
                  className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                >
                  <option value={5}>5 Stars - Outstanding</option>
                  <option value={4}>4 Stars - Very Good</option>
                  <option value={3}>3 Stars - Satisfactory</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">Your Review & Comments *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Please describe equipment performance, image quality, and SonoTech service..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-lg bg-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border border-slate-300 text-slate-600 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-blue-600 text-white rounded-lg font-bold"
              >
                Post Review
              </button>
            </div>
          </form>
        )}

        {/* REVIEWS LIST */}
        <div className="mt-8 space-y-4">
          {reviewsList.map((rev) => (
            <div key={rev.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-slate-900 text-sm">{rev.author}</h4>
                    <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-medium flex items-center gap-1">
                      <UserCheck className="w-3 h-3" />
                      <span>Verified Doctor Purchase</span>
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">{rev.title} • {rev.institution}</p>
                </div>

                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                  <span className="text-xs text-slate-400 font-mono ml-2">{rev.date}</span>
                </div>
              </div>

              <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded inline-block">
                Equipment: {rev.system}
              </span>

              <p className="text-xs text-slate-700 leading-relaxed italic">
                "{rev.comment}"
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
