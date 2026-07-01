import { useState, useMemo, useEffect } from 'react';
import { menuItems as localMenuItems } from '../data';
import { MenuItem } from '../types';
import { Search, Info, Sparkles, Filter, X } from 'lucide-react';
import { getMenuItemsFromFirestore } from '../firebase';

export default function Menu() {
  const [activeCategory, setActiveCategory] = useState<'all' | 'entrées' | 'plats' | 'desserts' | 'boissons'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  const [itemsList, setItemsList] = useState<MenuItem[]>(() => {
    const cached = localStorage.getItem('olabissi_menu_items');
    return cached ? JSON.parse(cached) : localMenuItems;
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let active = true;
    const fetchMenu = async () => {
      try {
        setIsLoading(true);
        const fetched = await getMenuItemsFromFirestore();
        if (active) {
          setItemsList(fetched);
        }
      } catch (err) {
        console.error("Error loading menu:", err);
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };
    fetchMenu();
    return () => {
      active = false;
    };
  }, []);

  // Filter items based on Category, Search query, and Tag
  const filteredItems = useMemo(() => {
    return itemsList.filter((item) => {
      const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      let matchesTag = true;
      if (selectedTag !== 'all') {
        if (selectedTag === 'Signature') {
          matchesTag = !!item.isSignature;
        } else if (selectedTag === 'Sans Gluten') {
          matchesTag = item.tags?.includes('Sans Gluten') || !item.allergens?.includes('Gluten');
        } else if (selectedTag === 'Végétarien') {
          matchesTag = item.tags?.includes('Végétarien') || item.tags?.includes('Végétalien') || false;
        }
      }

      return matchesCategory && matchesSearch && matchesTag;
    });
  }, [itemsList, activeCategory, searchQuery, selectedTag]);

  // Extract the top 3 items to show as "Highlights" first
  const highlights = useMemo(() => {
    const signatureItems = itemsList.filter(item => item.isSignature);
    if (signatureItems.length >= 3) {
      return signatureItems.slice(0, 3);
    }
    const mixed = [...signatureItems, ...itemsList.filter(item => !item.isSignature)];
    return mixed.slice(0, 3);
  }, [itemsList]);

  const categories = [
    { label: 'Tous', value: 'all' as const },
    { label: 'Entrées', value: 'entrées' as const },
    { label: 'Plats', value: 'plats' as const },
    { label: 'Desserts', value: 'desserts' as const },
    { label: 'Boissons & Cocktails', value: 'boissons' as const },
  ];

  const tags = [
    { label: 'Tous les régimes', value: 'all' },
    { label: 'Spécialités de la Maison ✦', value: 'Signature' },
    { label: 'Options Sans Gluten', value: 'Sans Gluten' },
    { label: 'Végétarien / Vegan', value: 'Végétarien' },
  ];

  // Helper for drink pairings based on items
  const getDrinkPairing = (item: MenuItem) => {
    if (item.name.includes("Amiwo")) {
      return "Notre Bissap Royal glacé bien frais, ou un vin rouge rond et structuré.";
    }
    if (item.name.includes("Monyo")) {
      return "Notre cocktail maison Sodabi & Passion, ou un vin blanc sec de Loire.";
    }
    if (item.name.includes("Pâte Noire") || item.name.includes("Télibo")) {
      return "Une boisson locale froide de sorgho ou un vin blanc minéral.";
    }
    if (item.name.includes("Gbo Kpètè")) {
      return "Un vin rouge chaleureux et légèrement épicé de la Vallée du Rhône.";
    }
    if (item.name.includes("Attiéké")) {
      return "Un blanc sec fruité et vif ou notre boisson locale glacée.";
    }
    if (item.name.includes("Riz au Gras")) {
      return "Un vin rouge fruité ou une infusion glacée au gingembre d'Allada.";
    }
    if (item.name.includes("Pastels")) {
      return "Un verre de vin blanc pétillant frais ou un de nos cocktails de fruits.";
    }
    if (item.name.includes("Klako")) {
      return "Un vin blanc fruité ou notre infusion froide à la menthe.";
    }
    return "Une tasse de notre infusion douce à la citronnelle ou un cocktail maison.";
  };

  return (
    <section id="menu" className="py-24 bg-warm-100 border-b border-warm-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-[42px] font-title font-semibold text-warm-900 tracking-[-0.5px] leading-[1.2] mb-4">
            Notre Menu
          </h2>
          <div className="flex items-center justify-center gap-1.5 mb-6">
            <span className="h-[1px] w-12 bg-gold-500/50 block" />
            <span className="text-[10px] text-gold-500">✦</span>
            <span className="h-[1px] w-12 bg-gold-500/50 block" />
          </div>
        </div>

        {/* --- SECTION 1: SELECTIONS RECOMMANDÉES --- */}
        <div className="mb-20">
          <div className="flex items-center gap-3 mb-8">
            <Sparkles className="text-gold-500" size={18} />
            <h3 className="font-serif font-bold text-xl text-warm-900 tracking-tight">Nos Recommandations</h3>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8" id="menu-highlights">
            {highlights.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col group border border-warm-200 cursor-pointer"
                onClick={() => setSelectedItem(item)}
              >
                {/* Image */}
                <div className="relative h-56 w-full overflow-hidden select-none bg-warm-100">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  {item.isSignature && (
                    <div className="absolute top-4 left-4 bg-gold-700/90 text-white text-[10px] tracking-widest font-sans font-extrabold px-3 py-1 rounded shadow">
                      SPÉCIALITÉ
                    </div>
                  )}
                </div>

                {/* Info Card */}
                <div className="p-6 flex flex-col flex-grow justify-between space-y-4">
                  <div>
                    <div className="flex justify-between items-start gap-3">
                      <h4 className="font-serif font-bold text-lg text-warm-900 leading-tight group-hover:text-gold-700 transition-colors">
                        {item.name}
                      </h4>
                      <span className="font-serif font-bold text-lg text-gold-700 whitespace-nowrap">
                        {item.price.toLocaleString('fr-FR')} FCFA
                      </span>
                    </div>
                    <p className="text-warm-800 text-xs sm:text-sm font-sans mt-3 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Tags & Action */}
                  <div className="flex items-center justify-between pt-4 border-t border-warm-100">
                    <div className="flex flex-wrap gap-1.5">
                      {item.tags?.slice(0, 2).map((tag, idx) => (
                        <span
                          key={idx}
                          className="bg-warm-100 text-warm-800 text-[10px] tracking-wider font-sans font-bold px-2.5 py-1 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <span className="text-[10px] font-sans font-bold text-gold-700 uppercase tracking-wider group-hover:underline">
                      En savoir plus
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- SECTION 2: THE COMPLETE INTERACTIVE CARTE --- */}
        <div className="bg-white rounded-2xl shadow-xl border border-warm-200 p-6 sm:p-8 lg:p-10" id="full-carte">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-warm-200 mb-8">
            <h3 className="font-serif font-extrabold text-2xl text-warm-900">Rechercher des plats</h3>
            
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4 w-full lg:max-w-2xl">
              {/* Search Bar */}
              <div className="relative flex-grow">
                <input
                  type="text"
                  placeholder="Rechercher un plat, un ingrédient..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-warm-50 text-warm-900 placeholder-warm-800 font-sans text-sm rounded-lg pl-10 pr-4 py-2.5 border border-warm-200 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-colors"
                />
                <Search size={16} className="absolute left-3.5 top-3.5 text-warm-800" />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3.5 top-3.5 text-warm-800 hover:text-warm-900"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Tag selector */}
              <div className="relative select-none sm:min-w-[200px]">
                <select
                  value={selectedTag}
                  onChange={(e) => setSelectedTag(e.target.value)}
                  className="w-full bg-warm-50 text-warm-900 font-sans text-sm rounded-lg px-4 py-2.5 border border-warm-200 appearance-none focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 cursor-pointer"
                >
                  {tags.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
                <Filter size={14} className="absolute right-4 top-4 text-warm-800 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Category tabs */}
          <div className="flex overflow-x-auto pb-4 gap-2 border-b border-warm-100 mb-8 scrollbar-thin no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className={`px-5 py-2.5 rounded-lg font-sans font-bold text-xs tracking-wider uppercase transition-all whitespace-nowrap ${
                  activeCategory === cat.value
                    ? 'bg-gold-700 text-white shadow'
                    : 'bg-warm-50 text-warm-800 hover:bg-warm-100 hover:text-warm-900'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Grid Layout of filtered items */}
          {filteredItems.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className="bg-warm-50/50 hover:bg-white rounded-xl border border-warm-200 hover:border-gold-500/50 p-5 cursor-pointer transition-all duration-300 flex flex-col justify-between group h-full hover:shadow-md"
                >
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex justify-between items-start gap-4">
                      <h4 className="font-serif font-bold text-base text-warm-900 group-hover:text-gold-700 transition-colors leading-snug">
                        {item.name}
                      </h4>
                      <span className="font-serif font-bold text-base text-gold-700 whitespace-nowrap">{item.price.toLocaleString('fr-FR')} FCFA</span>
                    </div>

                    {/* Desc */}
                    <p className="text-warm-800 font-sans text-xs leading-relaxed line-clamp-2">
                      {item.description}
                    </p>
                  </div>

                  {/* Foot tags & icons */}
                  <div className="flex items-center justify-between pt-4 mt-4 border-t border-warm-100/60">
                    <div className="flex items-center gap-1.5">
                      {item.isSignature && (
                        <span className="bg-gold-100 text-gold-800 text-[9px] tracking-wider font-sans font-extrabold px-2 py-0.5 rounded uppercase">
                          ★ SPÉCIALITÉ
                        </span>
                      )}
                      {item.allergens && item.allergens.length > 0 && (
                        <span
                          className="text-warm-800 hover:text-warm-900 relative group flex items-center gap-1"
                          title={`Allergènes: ${item.allergens.join(', ')}`}
                        >
                          <Info size={12} />
                          <span className="text-[9px] font-sans">Allergènes</span>
                        </span>
                      )}
                    </div>
                    <span className="text-[9px] font-sans font-extrabold text-warm-800 group-hover:text-gold-700 uppercase tracking-widest">
                      Détails ➜
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-warm-50 rounded-xl border border-dashed border-warm-200">
              <p className="text-warm-800 font-sans text-sm">
                Aucun plat ne correspond à vos critères de recherche.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('all');
                  setSelectedTag('all');
                }}
                className="mt-4 text-xs font-sans font-bold text-gold-700 underline uppercase tracking-wider"
              >
                Réinitialiser les filtres
              </button>
            </div>
          )}
        </div>

      </div>

      {/* --- MENU ITEM MODAL DETAILS --- */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          onClick={() => setSelectedItem(null)}
          id="menu-modal"
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-warm-200 animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header image */}
            <div className="relative h-64 md:h-80 w-full select-none bg-warm-100">
              <img src={selectedItem.image} alt={selectedItem.name} className="w-full h-full object-cover" />
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 bg-black/60 text-white hover:bg-black/80 p-2 rounded-full focus:outline-none shadow-lg transition-colors"
                id="close-menu-modal"
              >
                <X size={18} />
              </button>

              {selectedItem.isSignature && (
                <div className="absolute bottom-4 left-4 bg-gold-700 text-white text-[10px] tracking-widest font-sans font-extrabold px-3 py-1 rounded shadow">
                  SPÉCIALITÉ DU CHEF ✦
                </div>
              )}
            </div>

            {/* Content area */}
            <div className="p-6 md:p-8 space-y-6">
              <div className="flex justify-between items-start gap-4 border-b border-warm-200 pb-4">
                <div>
                  <span className="text-[10px] tracking-widest font-sans font-bold text-gold-700 uppercase">
                    {selectedItem.category}
                  </span>
                  <h3 className="font-serif font-extrabold text-2xl md:text-3xl text-warm-900 mt-1">
                    {selectedItem.name}
                  </h3>
                </div>
                <span className="font-serif font-extrabold text-2xl text-gold-700 whitespace-nowrap">{selectedItem.price.toLocaleString('fr-FR')} FCFA</span>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <h4 className="font-serif font-bold text-sm text-warm-900">Description :</h4>
                <p className="text-warm-800 font-sans text-sm leading-relaxed">{selectedItem.description}</p>
              </div>

              {/* Drink Pairing */}
              <div className="bg-gold-50/50 rounded-xl border border-gold-100 p-4 space-y-1">
                <span className="text-[10px] tracking-widest font-sans font-bold text-gold-700 uppercase block">
                  BOISSON RECOMMANDÉE
                </span>
                <p className="text-warm-900 font-serif italic text-sm">{getDrinkPairing(selectedItem)}</p>
              </div>

              {/* Allergen & Dietary Tags */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-warm-100">
                {selectedItem.tags && selectedItem.tags.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[10px] tracking-wider font-sans font-bold text-warm-800 uppercase block">
                      Caractéristiques
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedItem.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="bg-warm-100 text-warm-800 text-[10px] font-sans font-semibold px-2.5 py-1 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-1.5">
                  <span className="text-[10px] tracking-wider font-sans font-bold text-warm-800 uppercase block">
                    Allergènes déclarés
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedItem.allergens && selectedItem.allergens.length > 0 ? (
                      selectedItem.allergens.map((all, idx) => (
                        <span
                          key={idx}
                          className="bg-red-50 text-red-700 border border-red-100 text-[10px] font-sans font-semibold px-2.5 py-1 rounded"
                        >
                          {all}
                        </span>
                      ))
                    ) : (
                      <span className="text-warm-800 font-sans text-xs italic">Aucun allergène à déclarer.</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="pt-4 text-center">
                <a
                  href="#contact"
                  onClick={() => setSelectedItem(null)}
                  className="inline-block bg-gold-700 hover:bg-gold-800 text-white font-sans font-bold text-xs tracking-widest px-6 py-3 rounded-lg uppercase shadow transition-colors"
                >
                  Nous contacter pour réserver
                </a>
              </div>
            </div>

          </div>
        </div>
      )}
    </section>
  );
}
