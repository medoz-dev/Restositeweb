import { useState, useMemo } from 'react';
import { galleryItems } from '../data';
import { GalleryItem } from '../types';
import { Maximize2, X, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Gallery() {
  const [activeTab, setActiveTab] = useState<'all' | 'plats' | 'ambiance' | 'equipe'>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const tabs = [
    { label: 'Tous', value: 'all' as const },
    { label: 'Les Plats', value: 'plats' as const },
    { label: 'L’Ambiance', value: 'ambiance' as const },
    { label: 'Le Savoir-Faire', value: 'equipe' as const },
  ];

  // Filter gallery items
  const filteredItems = useMemo(() => {
    return galleryItems.filter((item) => activeTab === 'all' || item.category === activeTab);
  }, [activeTab]);

  // Handle lightbox slide controls
  const handlePrev = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : filteredItems.length - 1));
  };

  const handleNext = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev !== null && prev < filteredItems.length - 1 ? prev + 1 : 0));
  };

  return (
    <section id="galerie" className="py-24 bg-warm-50 border-b border-warm-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title & Intro */}
        <div className="text-center mb-16">
          <span className="font-sans font-bold text-[10px] md:text-xs text-gold-700 tracking-[0.3em] uppercase block mb-3">
            PORTFOLIO VISUEL
          </span>
          <h2 className="text-3xl sm:text-[42px] font-title font-semibold text-warm-900 tracking-[-0.5px] leading-[1.2] mb-4">
            Galerie de l'Escale du Pont
          </h2>
          <div className="flex items-center justify-center gap-1.5 mb-6">
            <span className="h-[1px] w-12 bg-gold-500/50 block" />
            <span className="text-[10px] text-gold-500">✦</span>
            <span className="h-[1px] w-12 bg-gold-500/50 block" />
          </div>
          <p className="text-warm-800 font-sans text-sm sm:text-base max-w-2xl mx-auto">
            Découvrez en images nos spécialités béninoises présentées avec soin et l'ambiance chaleureuse de notre établissement.
          </p>
        </div>

        {/* Tab Filters */}
        <div className="flex justify-center gap-2 flex-wrap mb-10 select-none">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => {
                setActiveTab(tab.value);
                setLightboxIndex(null);
              }}
              className={`px-5 py-2.5 rounded-full font-sans font-bold text-xs tracking-wider uppercase transition-all ${
                activeTab === tab.value
                  ? 'bg-gold-700 text-white shadow-md'
                  : 'bg-white border border-warm-200 text-warm-800 hover:bg-warm-100 hover:text-warm-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" id="gallery-grid">
          {filteredItems.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => setLightboxIndex(idx)}
              className="group relative rounded-xl overflow-hidden shadow-sm aspect-[4/3] bg-warm-100 border border-warm-200 cursor-pointer select-none"
            >
              {/* Image */}
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />

              {/* Hover Dark Overlay & Title */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 text-white">
                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 space-y-2">
                  <span className="text-[9px] tracking-widest font-sans font-extrabold text-gold-500 uppercase block">
                    {item.category}
                  </span>
                  <h4 className="font-serif font-bold text-lg leading-tight">{item.title}</h4>
                  <span className="flex items-center gap-1.5 text-xs text-white/80 font-sans mt-2">
                    <Maximize2 size={12} className="text-gold-500" />
                    <span>Agrandir l'image</span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* --- IMMERSIVE LIGHTBOX --- */}
      {lightboxIndex !== null && filteredItems[lightboxIndex] && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 select-none animate-fade-in"
          onClick={() => setLightboxIndex(null)}
          id="gallery-lightbox"
        >
          {/* Top Navbar in Lightbox */}
          <div className="flex items-center justify-between text-white py-2 px-4 relative z-10">
            <div>
              <span className="text-[10px] tracking-widest font-sans font-bold text-gold-500 uppercase block">
                {filteredItems[lightboxIndex].category}
              </span>
              <h3 className="font-serif font-bold text-lg md:text-xl leading-tight">
                {filteredItems[lightboxIndex].title}
              </h3>
            </div>
            <button
              onClick={() => setLightboxIndex(null)}
              className="bg-white/10 text-white hover:bg-white/20 p-2.5 rounded-full transition-colors"
              title="Fermer"
            >
              <X size={20} />
            </button>
          </div>

          {/* Core Image Area */}
          <div className="flex-grow flex items-center justify-between relative" onClick={(e) => e.stopPropagation()}>
            {/* Left Button */}
            <button
              onClick={handlePrev}
              className="absolute left-2 md:left-4 bg-white/10 text-white hover:bg-white/20 p-3 rounded-full transition-colors z-10 focus:outline-none"
              title="Précédent"
            >
              <ChevronLeft size={24} />
            </button>

            {/* Displaying Image with smooth animations */}
            <div className="max-w-4xl max-h-[70vh] w-full mx-auto flex items-center justify-center p-4">
              <img
                src={filteredItems[lightboxIndex].image}
                alt={filteredItems[lightboxIndex].title}
                className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-2xl border border-white/10 animate-scale-up"
              />
            </div>

            {/* Right Button */}
            <button
              onClick={handleNext}
              className="absolute right-2 md:right-4 bg-white/10 text-white hover:bg-white/20 p-3 rounded-full transition-colors z-10 focus:outline-none"
              title="Suivant"
            >
              <ChevronRight size={24} />
            </button>
          </div>

          {/* Bottom Counter Indicators */}
          <div className="text-center text-xs text-white/60 font-sans py-4 relative z-10">
            {lightboxIndex + 1} / {filteredItems.length}
          </div>
        </div>
      )}
    </section>
  );
}
