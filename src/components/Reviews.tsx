import React, { useState, useEffect } from 'react';
import { initialReviews } from '../data';
import { Review } from '../types';
import { Star, CheckCircle, PlusCircle, MessageSquare } from 'lucide-react';

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [authorName, setAuthorName] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [recommend, setRecommend] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Load reviews on mount
  useEffect(() => {
    const existing = localStorage.getItem('olabissi_reviews');
    if (existing) {
      setReviews(JSON.parse(existing));
    } else {
      setReviews(initialReviews);
      localStorage.setItem('olabissi_reviews', JSON.stringify(initialReviews));
    }
  }, []);

  // Recalculate dynamic statistics
  const stats = useState(() => {
    const total = reviews.length;
    const average = total > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / total).toFixed(1) : '5.0';
    return { total, average };
  });

  const dynamicStats = {
    total: reviews.length,
    average: reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : '5.0'
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !comment.trim()) return;

    const newReview: Review = {
      id: 'rev-' + Date.now(),
      authorName,
      rating,
      comment,
      date: new Date().toISOString().split('T')[0],
      recommend,
    };

    const updated = [newReview, ...reviews];
    setReviews(updated);
    localStorage.setItem('olabissi_reviews', JSON.stringify(updated));

    // Clear form
    setAuthorName('');
    setRating(5);
    setComment('');
    setRecommend(true);
    setIsSuccess(true);
    setShowForm(false);

    setTimeout(() => {
      setIsSuccess(false);
    }, 4000);
  };

  return (
    <section id="avis" className="py-24 bg-warm-100 border-b border-warm-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title and Ratings Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 border-b border-warm-200 pb-8">
          <div className="space-y-3">
            <span className="text-[10px] tracking-widest font-sans font-bold text-gold-700 uppercase block">
              TÉMOIGNAGES CLIENTS
            </span>
            <h2 className="text-3xl sm:text-[42px] font-title font-semibold text-warm-900 tracking-[-0.5px] leading-[1.2]">
              Avis de nos Hôtes
            </h2>
            <div className="flex items-center gap-1.5 pt-1">
              <span className="h-[1px] w-12 bg-gold-500/50 block" />
              <span className="text-[10px] text-gold-500">✦</span>
              <span className="h-[1px] w-12 bg-gold-500/50 block" />
            </div>
          </div>

          {/* Average Rating Stats Box */}
          <div className="flex items-center gap-6 bg-white p-5 rounded-xl border border-warm-200 shadow-sm shrink-0">
            <div className="text-center">
              <span className="text-3xl font-serif font-extrabold text-warm-900 block leading-none">
                {dynamicStats.average}
              </span>
              <span className="text-[10px] text-warm-800 font-sans tracking-wide uppercase mt-1 block">
                sur 5 étoiles
              </span>
            </div>
            
            <div className="h-10 w-[1px] bg-warm-200" />

            <div>
              <div className="flex text-gold-500 gap-0.5 mb-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    fill={i < Math.round(parseFloat(dynamicStats.average)) ? 'currentColor' : 'none'}
                  />
                ))}
              </div>
              <span className="text-xs text-warm-800 font-sans block">
                {dynamicStats.total} avis authentifiés
              </span>
            </div>
          </div>
        </div>

        {/* Buttons to write review */}
        <div className="flex justify-between items-center mb-8">
          <h3 className="font-serif font-bold text-lg text-warm-900 tracking-tight">Ce que pensent nos visiteurs</h3>
          <button
            onClick={() => {
              setShowForm(!showForm);
              setIsSuccess(false);
            }}
            className="flex items-center gap-2 bg-gold-700 hover:bg-gold-800 text-white font-sans font-bold text-xs tracking-wider uppercase px-4 py-2.5 rounded-lg shadow-sm transition-all hover:scale-[1.02]"
            id="btn-add-review"
          >
            <PlusCircle size={14} />
            <span>Écrire un avis</span>
          </button>
        </div>

        {/* Success Alert */}
        {isSuccess && (
          <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg p-4 font-sans text-sm mb-6 flex items-center gap-3 animate-fade-in">
            <CheckCircle size={18} className="text-emerald-700" />
            <span>Merci infiniment ! Votre avis a bien été publié avec succès.</span>
          </div>
        )}

        {/* Create Review Form Container */}
        {showForm && (
          <div className="bg-white rounded-xl border border-warm-200 shadow-lg p-6 mb-8 max-w-xl animate-fade-in" id="review-form">
            <div className="flex justify-between items-center pb-4 border-b border-warm-100 mb-6">
              <h4 className="font-serif font-bold text-warm-900 flex items-center gap-2">
                <MessageSquare size={16} className="text-gold-700" />
                <span>Publier votre avis</span>
              </h4>
              <button
                onClick={() => setShowForm(false)}
                className="text-xs font-sans text-warm-800 hover:text-warm-900"
              >
                Annuler
              </button>
            </div>

            <form onSubmit={handlePublish} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-sans font-bold text-warm-900 block">Votre nom *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Sophie Martin"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    className="w-full bg-warm-50 text-warm-900 placeholder-warm-800 font-sans text-sm border border-warm-200 rounded-lg px-3 py-2 focus:outline-none focus:border-gold-500 transition-colors"
                  />
                </div>

                {/* Star rating picker */}
                <div className="space-y-1.5">
                  <label className="text-xs font-sans font-bold text-warm-900 block">Note de l'expérience *</label>
                  <div className="flex text-gold-500 gap-1 pt-1 cursor-pointer">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setRating(i + 1)}
                        className="hover:scale-110 transition-transform"
                      >
                        <Star size={20} fill={i < rating ? 'currentColor' : 'none'} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-sans font-bold text-warm-900 block">Votre commentaire *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Décrivez brièvement la qualité de nos plats, le service, le cadre..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full bg-warm-50 text-warm-900 placeholder-warm-800 font-sans text-sm border border-warm-200 rounded-lg px-3 py-2 focus:outline-none focus:border-gold-500 transition-colors"
                />
              </div>

              {/* Recommendation toggle */}
              <div className="flex items-center gap-3 bg-warm-50 p-3 rounded-lg border border-warm-100">
                <input
                  type="checkbox"
                  id="recommend-check"
                  checked={recommend}
                  onChange={(e) => setRecommend(e.target.checked)}
                  className="rounded border-warm-200 text-gold-700 focus:ring-gold-500"
                />
                <label htmlFor="recommend-check" className="text-xs font-sans text-warm-900 cursor-pointer select-none">
                  Je recommande vivement cet établissement à mon entourage.
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-gold-700 hover:bg-gold-800 text-white font-sans font-bold text-xs tracking-wider uppercase py-3 rounded-lg shadow-sm transition-colors"
              >
                Publier mon avis authentifié
              </button>
            </form>
          </div>
        )}

        {/* Testimonials List */}
        <div className="grid md:grid-cols-3 gap-8" id="testimonials-grid">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white rounded-xl border border-warm-200 p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow h-full"
            >
              <div className="space-y-4">
                {/* Rating stars */}
                <div className="flex justify-between items-center">
                  <div className="flex text-gold-500 gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={14} fill={i < rev.rating ? 'currentColor' : 'none'} />
                    ))}
                  </div>
                  <span className="text-[10px] text-warm-800 font-sans">
                    {new Date(rev.date).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>

                {/* Comment body */}
                <p className="text-warm-800 font-sans text-xs sm:text-sm italic leading-relaxed">
                  "{rev.comment}"
                </p>
              </div>

              {/* Author Footer */}
              <div className="pt-4 mt-4 border-t border-warm-100 flex items-center justify-between">
                <span className="font-serif font-bold text-sm text-warm-900">
                  {rev.authorName}
                </span>
                {rev.recommend && (
                  <span className="text-[9px] tracking-wider font-sans font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full uppercase">
                    ✔ Recommande
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
