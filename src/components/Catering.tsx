import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, doc, setDoc } from 'firebase/firestore';
import { 
  Calendar, 
  Users, 
  Phone, 
  Mail, 
  User, 
  Sparkles, 
  CheckCircle2, 
  Briefcase, 
  Heart, 
  Home,
  MapPin,
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CateringProps {
  isFullPage?: boolean;
  onOpenFullPage?: () => void;
}

export default function Catering({ isFullPage = true, onOpenFullPage }: CateringProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    guests: '',
    eventType: 'corporate',
    message: ''
  });
  const [activeTab, setActiveTab] = useState('corporate');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const services = [
    {
      id: 'corporate',
      icon: Briefcase,
      title: "Entreprise",
      fullName: "Événements d'Entreprise",
      desc: "Cocktails dînatoires, séminaires, lancements de produits ou repas d'affaires. Des formules sur mesure adaptées à votre image de marque."
    },
    {
      id: 'wedding',
      icon: Heart,
      title: "Privé / Mariage",
      fullName: "Réceptions Privées",
      desc: "Mariages, anniversaires, fêtes de famille. Offrez à vos convives une expérience mémorable autour du patrimoine culinaire du Bénin."
    },
    {
      id: 'home_chef',
      icon: Home,
      title: "À Domicile",
      fullName: "Chef à Domicile",
      desc: "Un dîner intime à votre table orchestré par le Chef Olabissi. Service soigné, dressage raffiné et raffinement préservé."
    }
  ];

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setFormData(prev => ({ 
      ...prev, 
      eventType: tabId 
    }));
  };

  const handleEventTypeChange = (val: string) => {
    setFormData(prev => ({ ...prev, eventType: val }));
    if (val === 'corporate') {
      setActiveTab('corporate');
    } else if (val === 'wedding' || val === 'birthday') {
      setActiveTab('wedding');
    } else if (val === 'home_chef') {
      setActiveTab('home_chef');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) {
      setErrorMsg('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    const cateringRequest = {
      ...formData,
      guests: Number(formData.guests) || 0,
      createdAt: new Date().toISOString(),
      status: 'nouveau'
    };

    try {
      // Save to Firestore
      const docRef = doc(collection(db, 'catering'));
      await setDoc(docRef, {
        id: docRef.id,
        ...cateringRequest
      });

      // Mirror in localStorage
      const stored = localStorage.getItem('olabissi_catering');
      const existing = stored ? JSON.parse(stored) : [];
      existing.unshift({ id: docRef.id, ...cateringRequest });
      localStorage.setItem('olabissi_catering', JSON.stringify(existing));

      setIsSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        date: '',
        guests: '',
        eventType: 'corporate',
        message: ''
      });
    } catch (err) {
      console.error('Error saving catering request:', err);
      // LocalStorage fallback
      const mockId = 'CAT-' + Math.floor(1000 + Math.random() * 9000);
      const stored = localStorage.getItem('olabissi_catering');
      const existing = stored ? JSON.parse(stored) : [];
      existing.unshift({ id: mockId, ...cateringRequest });
      localStorage.setItem('olabissi_catering', JSON.stringify(existing));

      setIsSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        date: '',
        guests: '',
        eventType: 'corporate',
        message: ''
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentService = services.find(s => s.id === activeTab) || services[0];

  // Render simplified homepage layout (No complex form to avoid tedious scrolling)
  if (!isFullPage) {
    return (
      <section id="traiteur" className="py-24 bg-[#FCFBFA] border-b border-warm-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl sm:text-[40px] font-title font-semibold text-warm-900 tracking-[-0.5px]">
              Service Traiteur de Prestige
            </h2>
            <div className="flex items-center justify-center gap-1.5">
              <span className="h-[1px] w-12 bg-gold-500/30 block" />
              <span className="text-[10px] text-gold-500">✦</span>
              <span className="h-[1px] w-12 bg-gold-500/30 block" />
            </div>
          </div>

          {/* Luxury Minimalist Grid */}
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8 mb-16">
            {services.map((service) => {
              const IconComponent = service.icon;
              return (
                <div 
                  key={service.id}
                  className="bg-white border border-warm-200/60 rounded-xl p-6 lg:p-8 hover:border-gold-500/40 hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    <div className="bg-warm-50 border border-warm-200/50 w-12 h-12 rounded-xl flex items-center justify-center text-gold-700 group-hover:bg-gold-500 group-hover:text-white transition-all duration-500">
                      <IconComponent size={22} />
                    </div>
                    <h3 className="font-serif font-bold text-lg text-warm-900">
                      {service.fullName}
                    </h3>
                    <p className="text-xs sm:text-sm text-warm-800 leading-relaxed font-sans font-light">
                      {service.desc}
                    </p>
                  </div>
                  
                  <div className="pt-6 mt-6 border-t border-warm-100 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-gold-700 tracking-widest uppercase">
                      Sur-mesure
                    </span>
                    <ArrowRight size={14} className="text-warm-800 group-hover:text-gold-600 transform group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Call with Classy Hover-Wave Button */}
          <div className="text-center flex flex-col items-center">
            <button
              onClick={onOpenFullPage}
              className="relative overflow-hidden w-full sm:w-auto bg-noir-950 border border-gold-500/20 text-white font-sans font-semibold text-xs tracking-[0.25em] px-10 py-5 rounded-lg shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-3 group uppercase cursor-pointer"
            >
              {/* Solid dark baseline */}
              <span className="absolute inset-0 bg-noir-950" />
              
              {/* Sweeping color wave (moves from left to right and covers the button on hover) */}
              <span 
                className="absolute inset-0 w-full h-full bg-gradient-to-r from-gold-600 via-[#ffd700] to-gold-500 -translate-x-full group-hover:translate-x-0 transition-transform duration-700 ease-out z-0"
              />
              
              {/* Highlighting sheen animation line */}
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out z-0 delay-75" />

              {/* Text elements that change elegantly to contrast with gold on hover */}
              <span className="relative z-10 flex items-center gap-2 text-[#FAF9F6] group-hover:text-noir-950 transition-colors duration-500">
                <span>Créer mon événement & Demander un Devis</span>
                <ChevronRight size={16} className="transform group-hover:translate-x-1.5 transition-transform duration-300" />
              </span>
            </button>
          </div>

        </div>
      </section>
    );
  }

  // Otherwise, render full detailed view with interactive form
  return (
    <section id="traiteur" className="py-4 bg-transparent">
      <div className="max-w-7xl mx-auto">
        
        {/* Title Block - Clean and light */}
        <div className="text-center mb-10 space-y-3">
          <h2 className="text-2xl sm:text-[36px] font-title font-semibold text-warm-900 tracking-[-0.5px]">
            Concevez Votre Événement Privé ou d'Entreprise
          </h2>
          <div className="flex items-center justify-center gap-1.5">
            <span className="h-[1px] w-12 bg-gold-500/30 block" />
            <span className="text-[10px] text-gold-500">✦</span>
            <span className="h-[1px] w-12 bg-gold-500/30 block" />
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Interactive Offerings */}
          <div className="lg:col-span-5 space-y-6 animate-fade-in">
            <div className="bg-white rounded-2xl border border-warm-200/80 p-5 sm:p-6 shadow-sm space-y-5">
              <div>
                <h3 className="font-serif font-bold text-lg text-warm-900 mb-2">
                  Prestations d'Excellence
                </h3>
                <p className="text-xs sm:text-sm text-warm-800 leading-relaxed font-sans">
                  Sélectionnez un type d'événement pour voir les détails et configurer directement votre demande de devis.
                </p>
              </div>

              {/* Segmented Tab Controls */}
              <div className="grid grid-cols-3 gap-1 bg-warm-50 p-1 rounded-xl border border-warm-200/50">
                {services.map((service) => {
                  const IconComponent = service.icon;
                  const isSelected = activeTab === service.id;
                  return (
                    <button
                      key={service.id}
                      type="button"
                      onClick={() => handleTabChange(service.id)}
                      className={`relative flex flex-col items-center justify-center py-3 px-2 rounded-lg transition-all duration-300 select-none cursor-pointer ${
                        isSelected 
                          ? 'text-white z-10' 
                          : 'text-warm-800 hover:text-warm-950 hover:bg-warm-100/50'
                      }`}
                    >
                      {/* Spring background animation slide */}
                      {isSelected && (
                        <motion.span
                          layoutId="activeCateringTab"
                          className="absolute inset-0 bg-gold-500 rounded-lg shadow-md -z-10"
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                      )}
                      <IconComponent size={18} className={`mb-1 transition-colors ${isSelected ? 'text-white' : 'text-gold-700'}`} />
                      <span className="text-[10px] sm:text-xs font-title font-semibold tracking-wide text-center">
                        {service.title}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Description box */}
              <div className="relative min-h-[90px] flex flex-col justify-center bg-warm-50/30 rounded-xl p-4 border border-warm-100">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    className="space-y-1.5"
                  >
                    <h4 className="font-serif font-bold text-sm text-warm-900 flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-gold-500" />
                      {currentService.fullName}
                    </h4>
                    <p className="text-xs text-warm-800 leading-relaxed font-sans">
                      {currentService.desc}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Service Zones */}
              <div className="pt-3 border-t border-warm-100 flex items-start gap-2 text-warm-900 font-sans">
                <MapPin className="text-gold-500 shrink-0 mt-0.5" size={14} />
                <div className="space-y-0.5">
                  <span className="text-[9px] font-bold text-gold-700 tracking-wider uppercase block">
                    ZONES DE SERVICE
                  </span>
                  <p className="text-[11px] leading-relaxed text-warm-800">
                    Saint-Quentin et alentours dans l'Aisne (Laon, Soissons sur demande).
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Request Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-2xl border border-warm-200/80 shadow-sm p-5 sm:p-6 space-y-4">
              <div className="space-y-1">
                <h3 className="font-serif font-bold text-lg text-warm-900 flex items-center gap-2">
                  <Sparkles className="text-gold-700 animate-pulse" size={18} />
                  Formulaire d'Évaluation & Devis Gratuit
                </h3>
                <p className="text-xs text-warm-800 font-sans">
                  Complétez vos coordonnées et notre service traiteur prendra contact sous 24 heures ouvrées.
                </p>
              </div>

              {isSuccess ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center space-y-4 py-8"
                >
                  <div className="bg-emerald-100 text-emerald-800 p-3 rounded-full inline-block">
                    <CheckCircle2 size={32} />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-serif font-bold text-lg text-emerald-900">Demande enregistrée !</h4>
                    <p className="text-xs sm:text-sm text-emerald-800 font-sans max-w-sm mx-auto">
                      Merci pour votre confiance. Notre secrétariat traiteur étudie vos besoins et vous recontactera très rapidement.
                    </p>
                  </div>
                  <button 
                    onClick={() => setIsSuccess(false)}
                    className="mt-2 text-xs font-bold text-gold-700 hover:text-gold-800 transition-colors uppercase tracking-wider cursor-pointer"
                  >
                    Faire une nouvelle demande
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3.5">
                  
                  {/* Name */}
                  <div>
                    <label className="text-[10px] tracking-wider font-sans font-bold text-warm-800 uppercase block mb-1">
                      Nom complet *
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-warm-800">
                        <User size={16} />
                      </span>
                      <input
                        required
                        type="text"
                        placeholder="Ex: Koffi Mensah"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full bg-white text-warm-900 font-sans text-xs rounded-lg pl-9 pr-4 py-2 border border-warm-200 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-all duration-200"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3.5">
                    {/* Email */}
                    <div>
                      <label className="text-[10px] tracking-wider font-sans font-bold text-warm-800 uppercase block mb-1">
                        Adresse email *
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-warm-800">
                          <Mail size={16} />
                        </span>
                        <input
                          required
                          type="email"
                          placeholder="Ex: koffi@gmail.com"
                          value={formData.email}
                          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                          className="w-full bg-white text-warm-900 font-sans text-xs rounded-lg pl-9 pr-4 py-2 border border-warm-200 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-all duration-200"
                        />
                      </div>
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="text-[10px] tracking-wider font-sans font-bold text-warm-800 uppercase block mb-1">
                        Téléphone *
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-warm-800">
                          <Phone size={16} />
                        </span>
                        <input
                          required
                          type="text"
                          placeholder="Ex: +229 97 00 00 00"
                          value={formData.phone}
                          onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                          className="w-full bg-white text-warm-900 font-sans text-xs rounded-lg pl-9 pr-4 py-2 border border-warm-200 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-all duration-200"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3.5">
                    {/* Event Date */}
                    <div>
                      <label className="text-[10px] tracking-wider font-sans font-bold text-warm-800 uppercase block mb-1">
                        Date souhaitée
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-warm-800">
                          <Calendar size={16} />
                        </span>
                        <input
                          type="date"
                          value={formData.date}
                          onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                          className="w-full bg-white text-warm-900 font-sans text-xs rounded-lg pl-9 pr-4 py-2 border border-warm-200 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-all duration-200"
                        />
                      </div>
                    </div>

                    {/* Guests Count */}
                    <div>
                      <label className="text-[10px] tracking-wider font-sans font-bold text-warm-800 uppercase block mb-1">
                        Nombre de convives
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-warm-800">
                          <Users size={16} />
                        </span>
                        <input
                          type="number"
                          placeholder="Ex: 50"
                          value={formData.guests}
                          onChange={(e) => setFormData(prev => ({ ...prev, guests: e.target.value }))}
                          className="w-full bg-white text-warm-900 font-sans text-xs rounded-lg pl-9 pr-4 py-2 border border-warm-200 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-all duration-200"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Event Type */}
                  <div>
                    <label className="text-[10px] tracking-wider font-sans font-bold text-warm-800 uppercase block mb-1">
                      Type de réception
                    </label>
                    <select
                      value={formData.eventType}
                      onChange={(e) => handleEventTypeChange(e.target.value)}
                      className="w-full bg-white text-warm-900 font-sans text-xs rounded-lg px-3 py-2 border border-warm-200 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-all duration-200"
                    >
                      <option value="corporate">Entreprise (Séminaire, Cocktail, Gala)</option>
                      <option value="wedding">Mariage / Fiançailles</option>
                      <option value="birthday">Anniversaire / Réception Privée</option>
                      <option value="home_chef">Chef à domicile / Repas Privé</option>
                      <option value="other">Autre formule personnalisée</option>
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="text-[10px] tracking-wider font-sans font-bold text-warm-800 uppercase block mb-1">
                      Détails & Besoins particuliers
                    </label>
                    <textarea
                      rows={2.5}
                      placeholder="Indiquez vos préférences culinaires, votre budget, ou le type de service recherché..."
                      value={formData.message}
                      onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                      className="w-full bg-white text-warm-900 font-sans text-xs rounded-lg px-3 py-2 border border-warm-200 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 resize-none transition-all duration-200"
                    ></textarea>
                  </div>

                  {errorMsg && (
                    <p className="text-red-600 font-sans text-xs">{errorMsg}</p>
                  )}

                  <button
                    disabled={isSubmitting}
                    type="submit"
                    className="relative overflow-hidden w-full bg-gold-700 hover:bg-gold-800 text-white font-sans font-bold text-xs tracking-widest py-3.5 rounded-lg uppercase shadow hover:shadow-md transition-all duration-300 disabled:opacity-50 cursor-pointer"
                  >
                    <span className="relative z-10">
                      {isSubmitting ? 'Transmission en cours...' : 'Envoyer ma Demande'}
                    </span>
                  </button>

                </form>
              )}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
