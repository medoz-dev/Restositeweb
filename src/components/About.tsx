import React, { useState, useEffect } from 'react';
import { HISTORY_IMG, restaurantContact } from '../data';
import { Sparkles, Leaf, Award, Clock, MapPin } from 'lucide-react';

export default function About() {
  const [statusText, setStatusText] = useState({ text: 'Chargement...', open: false });

  useEffect(() => {
    const checkOpenStatus = () => {
      const now = new Date();
      const day = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const timeDecimal = hours + minutes / 60;

      let isOpen = false;
      let nextOpening = '';

      if (day === 1) {
        isOpen = false;
        nextOpening = "Mardi à 19:00";
      } else if (day >= 2 && day <= 5) {
        const closeTime = day === 5 ? 23.5 : 23;
        if (timeDecimal >= 19 && timeDecimal < closeTime) {
          isOpen = true;
        } else {
          nextOpening = timeDecimal < 19 ? "Ce soir à 19:00" : "Demain soir à 19:00";
        }
      } else if (day === 6) {
        if ((timeDecimal >= 12 && timeDecimal < 14.5) || (timeDecimal >= 19 && timeDecimal < 23.5)) {
          isOpen = true;
        } else if (timeDecimal < 12) {
          nextOpening = "Ce midi à 12:00";
        } else if (timeDecimal < 19) {
          nextOpening = "Ce soir à 19:00";
        } else {
          nextOpening = "Dimanche midi à 12:00";
        }
      } else if (day === 0) {
        if (timeDecimal >= 12 && timeDecimal < 15) {
          isOpen = true;
        } else if (timeDecimal < 12) {
          nextOpening = "Ce midi à 12:00";
        } else {
          nextOpening = "Mardi soir à 19:00";
        }
      }

      if (isOpen) {
        setStatusText({ text: "OUVERT ACTUELLEMENT", open: true });
      } else {
        setStatusText({ text: `FERMÉ - Ouvre ${nextOpening}`, open: false });
      }
    };

    checkOpenStatus();
    const interval = setInterval(checkOpenStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  const highlights = [
    {
      icon: <Leaf className="text-gold-500" size={20} />,
      title: "Produits de Saison",
      desc: "Des ingrédients locaux rigoureusement sélectionnés auprès des meilleurs producteurs.",
    },
    {
      icon: <Sparkles className="text-gold-500" size={20} />,
      title: "Cuisine Créative",
      desc: "Le raffinement de la gastronomie africaine moderne sublimant les produits nobles du terroir.",
    },
    {
      icon: <Award className="text-gold-500" size={20} />,
      title: "Rigueur & Excellence",
      desc: "Chaque plat est guidé par le respect des goûts authentiques et une présentation soignée.",
    },
  ];

  return (
    <section id="histoire" className="py-24 bg-warm-50 border-b border-warm-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Side: Content */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-4">
              <span className="font-sans font-bold text-[10px] md:text-xs text-gold-700 tracking-[0.3em] uppercase block">
                NOTRE ADN
              </span>
              <h2 
                className="text-3xl sm:text-[42px] font-title font-semibold text-warm-900 tracking-[-0.5px] leading-[1.2]"
              >
                Notre Histoire
              </h2>
              <div className="flex items-center gap-1.5 pt-1">
                <span className="h-[1px] w-12 bg-gold-500/50 block" />
                <span className="text-[10px] text-gold-500">✦</span>
                <span className="h-[1px] w-12 bg-gold-500/50 block" />
              </div>
            </div>

            <div className="space-y-5 text-warm-800 text-sm sm:text-base leading-relaxed font-sans">
              <p className="font-medium text-warm-900 text-base sm:text-lg">
                Porté par une passion profonde pour notre culture, <strong className="font-bold text-gold-700">Escale du Pont</strong> est une destination culinaire d'exception dédiée à la gastronomie béninoise.
              </p>
              <p>
                Valoriser la richesse de notre terroir d'origine est au cœur de notre démarche. Nous mettons en lumière des saveurs authentiques, à la fois traditionnelles et revisitées de manière moderne et soignée, à travers des ingrédients de premier choix.
              </p>
              <p>
                Chaque plat est préparé avec rigueur et passion. Notre équipe vous accueille dans un cadre élégant et chaleureux pour vous offrir une expérience mémorable et conviviale.
              </p>
            </div>

            {/* Highlights bullet grid */}
            <div className="grid sm:grid-cols-3 gap-6 pt-6 border-t border-warm-200">
              {highlights.map((h, i) => (
                <div key={i} className="space-y-2">
                  <div className="bg-white w-10 h-10 rounded-lg flex items-center justify-center shadow-sm border border-warm-200">
                    {h.icon}
                  </div>
                  <h3 className="font-serif font-bold text-sm text-warm-900">{h.title}</h3>
                  <p className="text-xs text-warm-800 leading-normal font-sans">{h.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side: Image and Decorative Frame */}
          <div className="lg:col-span-5 relative" id="history-media">
            <div className="absolute inset-0 bg-gold-500 rounded-2xl transform translate-x-3 translate-y-3 lg:translate-x-4 lg:translate-y-4 z-0" />
            
            <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl border border-warm-200 aspect-[4/5] lg:aspect-auto lg:h-[550px]">
              <img
                src={HISTORY_IMG}
                alt="Chef cuisinant"
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700 select-none"
              />
              
              {/* Overlay with subtle tagline */}
              <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
                <p className="font-serif italic text-lg text-gold-100 mb-1">“Sublimer notre patrimoine culinaire au quotidien.”</p>
                <p className="font-sans text-[10px] tracking-widest text-white/70 uppercase">Chef Olabissi, Escale du Pont</p>
              </div>
            </div>
          </div>

        </div>

        {/* Horaires et Accès */}
        <div className="mt-20 pt-16 border-t border-warm-200">
          <div className="grid md:grid-cols-2 gap-12 items-stretch">
            
            {/* Service Hours Card */}
            <div className="bg-white rounded-2xl border border-warm-200 shadow-sm p-8 flex flex-col justify-between">
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <h3 className="font-title font-semibold text-lg sm:text-xl text-warm-900 flex items-center gap-2">
                    <Clock className="text-gold-700 shrink-0" size={20} />
                    <span>Heures de service</span>
                  </h3>
                  
                  {/* Dynamic live badge */}
                  <span
                    className={`font-sans font-extrabold text-[10px] tracking-widest px-3 py-1 rounded-full border self-start sm:self-auto ${
                      statusText.open
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200 animate-pulse'
                        : 'bg-amber-50 text-amber-800 border-amber-200'
                    }`}
                  >
                    ● {statusText.text}
                  </span>
                </div>

                <div className="space-y-4 font-sans text-sm text-warm-800">
                  <div className="flex justify-between pb-2 border-b border-warm-100/60">
                    <span>Lundi</span>
                    <span className="font-semibold text-red-700 italic">Fermé</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-warm-100/60">
                    <span className="font-medium">Mardi - Jeudi</span>
                    <span className="font-semibold text-warm-900">19:00 - 23:00</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-warm-100/60">
                    <span className="font-medium">Vendredi</span>
                    <span className="font-semibold text-warm-900">19:00 - 23:30</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-warm-100/60">
                    <span className="font-medium">Samedi</span>
                    <span className="font-semibold text-warm-900">12:00 - 14:30 & 19:00 - 23:30</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Dimanche</span>
                    <span className="font-semibold text-warm-900">12:00 - 15:00</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Access and Location Card */}
            <div className="bg-white rounded-2xl border border-warm-200 shadow-sm p-8 flex flex-col justify-between gap-6">
              <div className="space-y-6">
                <h3 className="font-title font-semibold text-lg sm:text-xl text-warm-900 flex items-center gap-2">
                  <MapPin className="text-gold-700 shrink-0" size={20} />
                  <span>Accès & Situation</span>
                </h3>
                
                <p className="font-sans text-sm text-warm-800 leading-relaxed">
                  Notre établissement d'exception est situé au cœur de Saint-Quentin, offrant un cadre intimiste, élégant et haut de gamme pour vos déjeuners et dîners.
                </p>

                <div className="space-y-3 font-sans text-sm">
                  <div>
                    <span className="text-[10px] font-bold text-warm-500 tracking-wider uppercase block">Notre Adresse</span>
                    <p className="text-warm-900 font-semibold mt-0.5">{restaurantContact.address}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-[10px] font-bold text-warm-500 tracking-wider uppercase block">Téléphone</span>
                      <a href={`tel:${restaurantContact.phone.replace(/\s/g, '')}`} className="text-gold-700 font-semibold hover:underline block mt-0.5">
                        {restaurantContact.phone}
                      </a>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-warm-500 tracking-wider uppercase block">Adresse Email</span>
                      <a href={`mailto:${restaurantContact.email}`} className="text-gold-700 font-semibold hover:underline block mt-0.5">
                        {restaurantContact.email}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t border-warm-100/60">
                <a 
                  href={`https://maps.google.com/?q=${encodeURIComponent(restaurantContact.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-sans font-bold text-gold-700 hover:text-gold-800 transition-colors inline-flex items-center gap-1 cursor-pointer"
                >
                  Consulter l'itinéraire sur Google Maps ↗
                </a>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
