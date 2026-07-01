import { MenuItem, Review, TeamMember, GalleryItem } from './types';
// @ts-ignore
import heroBg from './assets/images/hero_bg_1782911741338.jpg';
// @ts-ignore
import escaleLogo from './assets/images/escale_logo_new_1782911933393.jpg';

export const LOGO_URL = escaleLogo;
export const HERO_BG = "https://gv7cup5twsas7kqm.public.blob.vercel-storage.com/imagehero-cdbA5BySwfSXdFTSgunfCKK91JArrJ.png";
export const HISTORY_IMG = "https://lh3.googleusercontent.com/aida-public/AB6AXuAvNI3m5cBOVyKY5fekpvPqEr9hIt42eHDozpOJeTqm_NPn7O6CguxsJx_RGc2sK-Bh67RZ_ocxR_vy-zgbf6xzPmf9pXnmpsiMk1LvjTxnXnbTyOPJqH_nXDAjxfSlXNOCrE5JJWciVQAmIs379VMQRX_DPuTy1aRKlrBajzFSX9rNrmxupxsPbUcJQoBCBKAmRkDfq3wea_TMUXx3BpVqydiEqGegoNiyqd51TZGDDqH6mA6mhmZV86Q6qgCkY-aH4powcAjunncT";

export const menuItems: MenuItem[] = [
  // --- ENTRÉES ---
  {
    id: 'entree-1',
    name: "Monyo Traditionnel aux Crevettes",
    price: 3500,
    description: "Sauce froide traditionnelle faite de tomates fraîches concassées, oignons émincés et piments verts doux, servie avec des crevettes fraîches sautées.",
    category: 'entrées',
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80",
    tags: ["Frais", "Tradition"],
    allergens: ["Crustacés"],
    isSignature: true,
    spicyLevel: 1
  },
  {
    id: 'entree-2',
    name: "Pastels Croustillants au Wagassi",
    price: 3000,
    description: "Beignets feuilletés bien dorés farcis au fromage local Wagassi poêlé et herbes, servis chauds avec une sauce tomate maison.",
    category: 'entrées',
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDPcz7AWjxfgfoDWWPzX8etOqtOW-3YWsDeU2WpfhBeitPiU4L_fQQYI_G-XRMH9VvAJtuLmsvcAqixhMxycoByk2D0hZ9eBvgWqNDRGcscpwom9xIud880A7nAyNnU5fiY8AaCGeBHnbIcitgkhZjmtunjHpcjPkUOaqyICiQddoeGEOfa8pRiZH4ZdIUvEdrn49mlEs3pDfPy6k7Rv0pTrONWjnqNCIaRDojkXGbncq5JDi24CDJB-Xo8Fw9qh8sEGOLq1TW9u20M",
    tags: ["Végétarien", "Chaud"],
    allergens: ["Gluten", "Lactose"],
    isSignature: false,
    spicyLevel: 0
  },
  {
    id: 'entree-3',
    name: "Klako de Banane Plantain",
    price: 2500,
    description: "Beignets de bananes plantains très mûres râpées et épicées au gingembre d'Allada, frits et servis bien croustillants.",
    category: 'entrées',
    image: "https://images.unsplash.com/photo-1547592180-85f173990554?w=600&auto=format&fit=crop&q=80",
    tags: ["Végétarien", "Croustillant"],
    allergens: [],
    isSignature: false,
    spicyLevel: 1
  },

  // --- PLATS ---
  {
    id: 'plat-1',
    name: "Amiwo de Poulet Bicyclette",
    price: 6500,
    description: "Pâte rouge de farine de maïs préparée dans un jus de tomate concentré et d'épices, accompagnée de poulet local fermier braisé et de sa sauce d'oignons frits.",
    category: 'plats',
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBGTcRDX6uZKVJ9Pn8SYfOg-qO4t7MJlAB3gDemkL20vPsBvj-30xa4KzNyt4wnz5DGNjbdCYGkPWft5ms148v6-xLS1WB_2vGDbhIIkqaYoNQ0Jlipuc1R2XNbbZ9xX3_sqLH3XVMzYYKZswCsKo4pTHtBX-7O9AjcHZRNbyrJUsB9FATxaosxn7HcUOhRz3n76PriuTm_qkjKuN_0pQKAK-DxgU7YNG0hCh7BkAY0uT4Hu2wNBQVzTMMuq2XeoGdrceH_MkTBWqKz",
    tags: ["Populaire", "Traditionnel"],
    allergens: [],
    isSignature: true,
    spicyLevel: 1
  },
  {
    id: 'plat-2',
    name: "Pâte Noire (Télibo) & Légumes Gboma",
    price: 5500,
    description: "Pâte traditionnelle à base de farine de cossettes d'igname séchées, servie avec sa sauce de légumes Gboma (épinards locaux) richement garnie de poisson frais ou de viande.",
    category: 'plats',
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&auto=format&fit=crop&q=80",
    tags: ["Légendes", "Terroir"],
    allergens: [],
    isSignature: false,
    spicyLevel: 1
  },
  {
    id: 'plat-3',
    name: "Gbo Kpètè de Mouton",
    price: 7500,
    description: "Sauce traditionnelle de mouton cuite aux abats et aromates locaux, servie chaude avec de la pâte blanche de maïs ou de l'igname pilée.",
    category: 'plats',
    image: "https://images.unsplash.com/photo-1514516345957-556ca7d90a29?w=600&auto=format&fit=crop&q=80",
    tags: ["Spécialité", "Copieux"],
    allergens: [],
    isSignature: true,
    spicyLevel: 1
  },
  {
    id: 'plat-4',
    name: "Attiéké au Poisson Frit d'Exception",
    price: 6000,
    description: "Semoule de manioc légère et savoureuse servie avec un poisson frit entier bien assaisonné, accompagné de piments écrasés, d'oignons et de tomates fraîches.",
    category: 'plats',
    image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&auto=format&fit=crop&q=80",
    tags: ["Mer", "Incontournable"],
    allergens: ["Poissons"],
    isSignature: false,
    spicyLevel: 2
  },
  {
    id: 'plat-5',
    name: "Riz au Gras & Sauce Tomate à la Béninoise",
    price: 5000,
    description: "Riz savoureux cuit dans une sauce tomate assaisonnée, servi avec de la viande de bœuf frite et une sauce tomate pimentée.",
    category: 'plats',
    image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&auto=format&fit=crop&q=80",
    tags: ["Classique", "Chaud"],
    allergens: [],
    isSignature: false,
    spicyLevel: 1
  },

  // --- DESSERTS ---
  {
    id: 'dessert-1',
    name: "Ananas Pain de Sucre d'Allada",
    price: 3000,
    description: "Le célèbre ananas Pain de Sucre d'Allada très doux, découpé en tranches et rôti avec une touche de miel sauvage.",
    category: 'desserts',
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBhZPke8VONiKrxdjypGsXW5bxTF4s-0qQZhgPeOpOqtpmF_k-QlZrtNs6_Ro3pSTEnUkjpeUbZGzcgNcJMaQSMzH98BRb1deVlcj-cH-AdN867t0I4gs5GjKYXCFlfZbc-Emog4xOc39mRzXc7FK82uHHPlXPMRbnqeoswGoLlHAus_zEbWfBer0MOYl0f7LV2bsbMtaVjlhhUh_Aem3lWn9TWCMPYEBO00MdauNOhqltwkoMUAfi6i-RE4cyJFIZ7rKEOFmLEF81g",
    tags: ["Sucré", "Frais"],
    allergens: [],
    isSignature: true,
    spicyLevel: 0
  },
  {
    id: 'dessert-2',
    name: "Crème de Baobab & éclats de Cajou",
    price: 3500,
    description: "Une crème veloutée préparée au jus de pain de singe (fruit du baobab) acidulé, recouverte de noix de cajou locales grillées de Parakou.",
    category: 'desserts',
    image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=600&auto=format&fit=crop&q=80",
    tags: ["Douceur", "Cajou"],
    allergens: ["Fruits à coque"],
    isSignature: false,
    spicyLevel: 0
  },
  {
    id: 'dessert-3',
    name: "Moelleux de Manioc au Chocolat de Ouidah",
    price: 3500,
    description: "Un gâteau de manioc râpé et chocolat noir de qualité supérieure, servi tiède avec une crème glacée.",
    category: 'desserts',
    image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600&auto=format&fit=crop&q=80",
    tags: ["Chocolat", "Gourmand"],
    allergens: ["Œufs", "Lactose"],
    isSignature: false,
    spicyLevel: 0
  },

  // --- BOISSONS ---
  {
    id: 'boisson-1',
    name: "Bissap Royal Glacé",
    price: 2000,
    description: "Boisson rafraîchissante faite de fleurs d'hibiscus infusées avec des feuilles de menthe et une pointe de gingembre frais.",
    category: 'boissons',
    image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=600&auto=format&fit=crop&q=80",
    tags: ["Sans Alcool", "Frais"],
    allergens: [],
    isSignature: true,
    spicyLevel: 0
  },
  {
    id: 'boisson-2',
    name: "Cocktail Sodabi & Passion",
    price: 4500,
    description: "Liqueur traditionnelle Sodabi de première qualité mélangée avec du jus de fruits de la passion frais et du gingembre pressé.",
    category: 'boissons',
    image: "https://images.unsplash.com/photo-1536935338788-846bb9981813?w=600&auto=format&fit=crop&q=80",
    tags: ["Cocktail", "Alcoolisé"],
    allergens: [],
    isSignature: true,
    spicyLevel: 1
  },
  {
    id: 'boisson-3',
    name: "Tchoukourou Glacé Maison",
    price: 2500,
    description: "Boisson locale fermentée à base de sorgho, brassée selon la tradition et servie bien fraîche avec une touche de miel.",
    category: 'boissons',
    image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600&auto=format&fit=crop&q=80",
    tags: ["Maison", "Traditionnel"],
    allergens: [],
    isSignature: false,
    spicyLevel: 0
  }
];

export const initialReviews: Review[] = [
  {
    id: 'rev-1',
    authorName: "Sarah M.",
    rating: 5,
    comment: "Une expérience inoubliable ! L'Amiwo de poulet bicyclette est préparé avec un respect admirable de la recette traditionnelle béninoise, et la pâte est consistante et parfumée. L'accueil est chaleureux et très professionnel. Je recommande vivement.",
    date: "2026-06-15",
    recommend: true
  },
  {
    id: 'rev-2',
    authorName: "Koffi A.",
    rating: 5,
    comment: "Excellent restaurant. La pâte noire de Télibo avec les légumes Gboma et le poisson frais est un vrai régal. Le goût authentique de chez nous est bien présent.",
    date: "2026-06-22",
    recommend: true
  },
  {
    id: 'rev-3',
    authorName: "Amina K.",
    rating: 5,
    comment: "Le service est impeccable et les plats sont savoureux. Le Monyo de crevettes est particulièrement frais et très bien assaisonné. Une adresse incontournable.",
    date: "2026-06-28",
    recommend: true
  }
];

export const teamMembers: TeamMember[] = [
  {
    id: 'team-1',
    name: "Chef Olabissi",
    role: "Chef Exécutif & Fondateur",
    bio: "Fort d'une grande expérience dans la gastronomie africaine, le Chef Olabissi valorise les recettes traditionnelles béninoises pour proposer une cuisine de qualité supérieure à Saint-Quentin.",
    image: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=600&auto=format&fit=crop&q=80",
    signatureDish: "Amiwo de Poulet Bicyclette"
  }
];

export const galleryItems: GalleryItem[] = [
  {
    id: 'gal-1',
    title: "Monyo Traditionnel aux Crevettes",
    category: "plats",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDPcz7AWjxfgfoDWWPzX8etOqtOW-3YWsDeU2WpfhBeitPiU4L_fQQYI_G-XRMH9VvAJtuLmsvcAqixhMxycoByk2D0hZ9eBvgWqNDRGcscpwom9xIud880A7nAyNnU5fiY8AaCGeBHnbIcitgkhZjmtunjHpcjPkUOaqyICiQddoeGEOfa8pRiZH4ZdIUvEdrn49mlEs3pDfPy6k7Rv0pTrONWjnqNCIaRDojkXGbncq5JDi24CDJB-Xo8Fw9qh8sEGOLq1TW9u20M"
  },
  {
    id: 'gal-2',
    title: "Amiwo de Poulet Bicyclette",
    category: "plats",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBGTcRDX6uZKVJ9Pn8SYfOg-qO4t7MJlAB3gDemkL20vPsBvj-30xa4KzNyt4wnz5DGNjbdCYGkPWft5ms148v6-xLS1WB_2vGDbhIIkqaYoNQ0Jlipuc1R2XNbbZ9xX3_sqLH3XVMzYYKZswCsKo4pTHtBX-7O9AjcHZRNbyrJUsB9FATxaosxn7HcUOhRz3n76PriuTm_qkjKuN_0pQKAK-DxgU7YNG0hCh7BkAY0uT4Hu2wNBQVzTMMuq2XeoGdrceH_MkTBWqKz"
  },
  {
    id: 'gal-3',
    title: "Ananas Pain de Sucre d'Allada",
    category: "plats",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBhZPke8VONiKrxdjypGsXW5bxTF4s-0qQZhgPeOpOqtpmF_k-QlZrtNs6_Ro3pSTEnUkjpeUbZGzcgNcJMaQSMzH98BRb1deVlcj-cH-AdN867t0I4gs5GjKYXCFlfZbc-Emog4xOc39mRzXc7FK82uHHPlXPMRbnqeoswGoLlHAus_zEbWfBer0MOYl0f7LV2bsbMtaVjlhhUh_Aem3lWn9TWCMPYEBO00MdauNOhqltwkoMUAfi6i-RE4cyJFIZ7rKEOFmLEF81g"
  },
  {
    id: 'gal-4',
    title: "Notre Salle Chaleureuse",
    category: "ambiance",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: 'gal-5',
    title: "Nos Cocktails Maison",
    category: "ambiance",
    image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: 'gal-6',
    title: "Service et Rigueur",
    category: "equipe",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAvNI3m5cBOVyKY5fekpvPqEr9hIt42eHDozpOJeTqm_NPn7O6CguxsJx_RGc2sK-Bh67RZ_ocxR_vy-zgbf6xzPmf9pXnmpsiMk1LvjTxnXnbTyOPJqH_nXDAjxfSlXNOCrE5JJWciVQAmIs379VMQRX_DPuTy1aRKlrBajzFSX9rNrmxupxsPbUcJQoBCBKAmRkDfq3wea_TMUXx3BpVqydiEqGegoNiyqd51TZGDDqH6mA6mhmZV86Q6qgCkY-aH4powcAjunncT"
  }
];

export const openingHours = {
  monday: { open: "Fermé", close: "Fermé", closed: true },
  tuesday: { open: "19:00", close: "23:00", closed: false },
  wednesday: { open: "19:00", close: "23:00", closed: false },
  thursday: { open: "19:00", close: "23:00", closed: false },
  friday: { open: "19:00", close: "23:30", closed: false },
  saturday: { open: "12:00", close: "14:30", openEvening: "19:00", closeEvening: "23:30", closed: false },
  sunday: { open: "12:00", close: "15:00", closed: false }
};

export const restaurantContact = {
  phone: "+33 3 23 62 10 20",
  address: "22 Rue des Beaux-Arts, 02100 Saint-Quentin, France",
  email: "contact@escaledupont.fr",
  mapCoordinates: { lat: 49.847, lng: 3.287 }
};
