import { HERO_BG } from '../data';
import { ChevronRight } from 'lucide-react';

export default function Hero() {
  return (
    <section
      id="accueil"
      className="relative min-h-screen flex items-center justify-start pt-24 pb-20 overflow-hidden bg-noir-950"
    >
      {/* Background Image with elegant slow zoom animation */}
      <div className="absolute inset-0 z-0 select-none overflow-hidden">
        <div
          className="bg-cover bg-center w-full h-full absolute inset-0 transform scale-105"
          style={{
            backgroundImage: `url('${HERO_BG}')`,
            filter: 'brightness(0.95)',
          }}
        />
        {/* Elegant left-to-right dark transparent gradient for perfect text legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent md:max-w-3xl" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-noir-950" />
      </div>

      {/* Hero content aligned to the left */}
      <div className="relative z-10 text-left px-4 sm:px-6 lg:px-8 max-w-7xl w-full mx-auto flex flex-col items-start md:pl-12 lg:pl-16">
        {/* Captions */}
        <span className="font-sans font-extrabold text-xs md:text-sm text-gold-500 tracking-[0.3em] uppercase mb-4 block animate-fade-in-down">
          Escale du Pont
        </span>

        <h1 
          className="text-5xl sm:text-7xl lg:text-8xl text-[#FAF9F6] mb-6 max-w-3xl"
          style={{ 
            fontFamily: '"Great Vibes", "Alex Brush", cursive',
            fontWeight: 400,
            lineHeight: '1.1',
            letterSpacing: '0.5px',
            textShadow: '2px 2px 12px rgba(0, 0, 0, 0.8)'
          }}
        >
          Saveurs Ancestrales,<br />Cuisine Moderne
        </h1>

        <p className="text-base sm:text-lg lg:text-xl font-sans text-warm-100 font-light mb-10 max-w-xl drop-shadow-md leading-relaxed">
          Une table d'exception qui sublime le patrimoine culinaire du Bénin, orchestrée par le Chef Olabissi dans un cadre chaleureux et élégant.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-start items-start w-full">
          <a
            href="#menu"
            className="relative overflow-hidden w-full sm:w-auto text-white font-title font-semibold text-xs sm:text-sm tracking-[0.22em] px-8 py-4.5 rounded-lg shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-3 group uppercase animate-fade-in border border-gold-500/10"
          >
            {/* Default gold background */}
            <span className="absolute inset-0 bg-gold-500 transition-colors duration-500 group-hover:bg-gold-600" />
            
            {/* Sweeping color wave / current (slides from left to right on hover and covers fully) */}
            <span 
              className="absolute inset-0 w-full h-full bg-gradient-to-r from-gold-600 via-[#ffd700] to-gold-500 -translate-x-full group-hover:translate-x-0 transition-transform duration-700 ease-out z-0"
            />
            
            {/* Ambient shimmer reflection wave */}
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out z-0 delay-100" />

            {/* Button content (must be on top of layers) */}
            <span className="relative z-10 flex items-center gap-2">
              <span>Découvrir le Menu</span>
              <ChevronRight size={16} className="transform group-hover:translate-x-1.5 transition-transform duration-300" />
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
