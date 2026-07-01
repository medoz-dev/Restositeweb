import React, { useState } from 'react';
import { restaurantContact } from '../data';
import { Phone, MapPin, Mail, MessageSquare, Send, CheckCircle2 } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setIsSuccess(false), 5000);
    }, 800);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div id="contact" className="py-6 bg-warm-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Isolated Luxurious Page Header with Great Vibes cursive title */}
        <div className="relative rounded-3xl overflow-hidden mb-16 bg-gradient-to-br from-noir-950 via-noir-900 to-warm-900 border border-warm-800 shadow-2xl p-10 md:p-16 text-center">
          {/* Accent light/glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gold-500/10 rounded-full blur-[100px] pointer-events-none" />
          
          <span className="font-sans font-bold text-[10px] md:text-xs text-gold-500 tracking-[0.4em] uppercase block mb-3">
            PRENDRE CONTACT
          </span>
          
          <h2 className="text-4xl sm:text-[52px] font-title font-semibold text-warm-50 tracking-[-0.5px] leading-[1.2] mb-6">
            Contact
          </h2>

          <h3 
            className="text-5xl sm:text-7xl lg:text-8xl text-gold-400 font-normal tracking-[0.5px] leading-[1.1] mb-6 font-calligraphy block"
            style={{ 
              fontFamily: '"Great Vibes", "Alex Brush", cursive',
              textShadow: '0 0 15px rgba(212, 175, 55, 0.3), 2px 2px 8px rgba(0,0,0,0.8)' 
            }}
          >
            Venez nous visiter
          </h3>
          
          <p className="text-warm-300 font-sans text-xs sm:text-sm tracking-wide max-w-xl mx-auto font-light leading-relaxed">
            Une expérience culinaire d'exception au cœur de Saint-Quentin, mêlant traditions et créativité. Rejoignez notre table pour un voyage mémorable.
          </p>
        </div>

        {/* Info Blocks Grid */}
        <div className="grid lg:grid-cols-12 gap-12" id="contact-blocks">
          
          {/* Left Column: Coordinates */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-white rounded-xl border border-warm-200 shadow-sm p-6 sm:p-8 space-y-6">
              <h3 className="font-title font-semibold text-lg text-warm-900 border-b border-warm-200 pb-3">
                Coordonnées de l'Établissement
              </h3>

              <div className="space-y-4 font-sans text-sm">
                <div className="flex items-start gap-4">
                  <div className="bg-gold-50 p-2.5 rounded-lg border border-gold-100 text-gold-700 shrink-0">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-warm-800 tracking-wider uppercase block">Adresse</span>
                    <p className="text-warm-900 font-semibold mt-0.5">{restaurantContact.address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-gold-50 p-2.5 rounded-lg border border-gold-100 text-gold-700 shrink-0">
                    <Phone size={18} />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-warm-800 tracking-wider uppercase block">Réservations directes</span>
                    <a href={`tel:${restaurantContact.phone.replace(/\s/g, '')}`} className="text-warm-900 font-semibold mt-0.5 hover:underline block">
                      {restaurantContact.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-gold-50 p-2.5 rounded-lg border border-gold-100 text-gold-700 shrink-0">
                    <Mail size={18} />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-warm-800 tracking-wider uppercase block">Courriel</span>
                    <a href={`mailto:${restaurantContact.email}`} className="text-warm-900 font-semibold mt-0.5 hover:underline block">
                      {restaurantContact.email}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Map & Message Form */}
          <div className="lg:col-span-7 bg-white rounded-xl border border-warm-200 shadow-sm p-6 sm:p-8 lg:p-10 space-y-8 relative">
            
            {/* Success message */}
            {isSuccess && (
              <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg p-4 font-sans text-sm flex items-center gap-3 animate-fade-in">
                <CheckCircle2 size={18} className="text-emerald-700" />
                <span>Votre message de contact a bien été transmis. Nous vous répondrons sous 24 heures.</span>
              </div>
            )}

            <div className="space-y-4">
              <h3 className="font-serif font-bold text-lg text-warm-900 flex items-center gap-2">
                <MessageSquare size={16} className="text-gold-700" />
                <span>Envoyer un message en ligne</span>
              </h3>
              <p className="text-xs sm:text-sm font-sans text-warm-800">
                Vous organisez un événement privé, un dîner d'entreprise ou avez des questions ? Remplissez ce formulaire d'information.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-sans font-bold text-warm-900 block">Nom complet *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="Votre nom"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-warm-50 text-warm-900 placeholder-warm-800 font-sans text-sm border border-warm-200 rounded-lg px-3 py-2.5 focus:outline-none focus:border-gold-500 transition-colors"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-sans font-bold text-warm-900 block">Adresse email *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="nom@exemple.fr"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-warm-50 text-warm-900 placeholder-warm-800 font-sans text-sm border border-warm-200 rounded-lg px-3 py-2.5 focus:outline-none focus:border-gold-500 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-sans font-bold text-warm-900 block">Message *</label>
                <textarea
                  name="message"
                  required
                  rows={4}
                  placeholder="Écrivez votre message ici..."
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full bg-warm-50 text-warm-900 placeholder-warm-800 font-sans text-sm border border-warm-200 rounded-lg px-3 py-2.5 focus:outline-none focus:border-gold-500 transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gold-700 hover:bg-gold-800 disabled:bg-gold-700/50 text-white font-sans font-bold text-xs tracking-widest uppercase py-3.5 rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
                id="btn-send-contact"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Envoi en cours...</span>
                  </>
                ) : (
                  <>
                    <Send size={14} />
                    <span>Envoyer mon message</span>
                  </>
                )}
              </button>
            </form>

            {/* Custom high-end interactive mock map frame */}
            <div className="rounded-xl overflow-hidden shadow-inner border border-warm-200 h-48 bg-warm-100 relative select-none">
              <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&auto=format&fit=crop&q=80')" }}></div>
              <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center text-center p-4">
                <div className="bg-white/95 text-warm-900 rounded-lg shadow-md border border-warm-200 p-4 max-w-xs space-y-1">
                  <h4 className="font-serif font-bold text-sm leading-none flex items-center justify-center gap-1.5">
                    <MapPin size={12} className="text-gold-700" />
                    <span>Escale du Pont</span>
                  </h4>
                  <p className="text-[10px] text-warm-800 font-sans leading-tight pt-1">
                    22 Rue des Beaux-Arts, 02100 Saint-Quentin
                  </p>
                  <span className="text-[9px] font-sans font-bold text-gold-700 tracking-wider uppercase pt-1 inline-block hover:underline cursor-pointer">
                    Itinéraire Google Maps ↗
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
