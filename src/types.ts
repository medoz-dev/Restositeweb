export interface MenuItem {
  id: string;
  name: string;
  price: number;
  description: string;
  category: 'entrées' | 'plats' | 'desserts' | 'boissons';
  image: string;
  tags?: string[];
  allergens?: string[];
  isSignature?: boolean;
  spicyLevel?: number; // 0 to 3
}

export interface Reservation {
  id: string;
  date: string;
  time: string;
  guestsCount: number;
  phone: string;
  fullName: string;
  email: string;
  tablePreference: 'terrasse' | 'salle_principale' | 'fenetre' | 'sans_preference';
  specialRequest?: string;
  status: 'en_attente' | 'confirme' | 'annule';
  createdAt: string;
}

export interface Review {
  id: string;
  authorName: string;
  rating: number; // 1 to 5
  comment: string;
  date: string;
  recommend: boolean;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  signatureDish?: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'plats' | 'ambiance' | 'equipe';
  image: string;
}
