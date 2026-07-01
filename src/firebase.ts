import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  getDoc,
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy,
  setDoc
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';
import { Reservation, Review, MenuItem } from './types';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = (firebaseConfig as any).firestoreDatabaseId 
  ? getFirestore(app, (firebaseConfig as any).firestoreDatabaseId) 
  : getFirestore(app);

// Collection Names
const RESERVATIONS_COLLECTION = 'reservations';
const REVIEWS_COLLECTION = 'reviews';

/**
 * --- RESERVATIONS SERVICES ---
 */

// Load all reservations from Firestore
export async function getReservationsFromFirestore(): Promise<Reservation[]> {
  try {
    const q = query(collection(db, RESERVATIONS_COLLECTION), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const reservations: Reservation[] = [];
    querySnapshot.forEach((docSnapshot) => {
      const data = docSnapshot.data();
      reservations.push({
        id: docSnapshot.id,
        date: data.date || '',
        time: data.time || '19:30',
        guestsCount: Number(data.guestsCount) || 2,
        phone: data.phone || '',
        fullName: data.fullName || '',
        email: data.email || '',
        tablePreference: data.tablePreference || 'sans_preference',
        specialRequest: data.specialRequest || '',
        status: data.status || 'en_attente',
        createdAt: data.createdAt || new Date().toISOString(),
      });
    });
    return reservations;
  } catch (error) {
    console.error('Error fetching reservations from Firestore:', error);
    // Fallback to localStorage
    const stored = localStorage.getItem('olabissi_reservations');
    return stored ? JSON.parse(stored) : [];
  }
}

// Save a new reservation
export async function addReservationToFirestore(res: Omit<Reservation, 'id'> & { id?: string }): Promise<Reservation> {
  try {
    const docRef = doc(collection(db, RESERVATIONS_COLLECTION));
    const finalId = res.id || docRef.id;
    const reservationToSave: Reservation = {
      ...res,
      id: finalId,
      createdAt: res.createdAt || new Date().toISOString(),
    };

    // Use setDoc to control the ID
    await setDoc(doc(db, RESERVATIONS_COLLECTION, finalId), {
      ...reservationToSave
    });

    // Mirror to localStorage
    const stored = localStorage.getItem('olabissi_reservations');
    const existing: Reservation[] = stored ? JSON.parse(stored) : [];
    existing.unshift(reservationToSave);
    localStorage.setItem('olabissi_reservations', JSON.stringify(existing));

    return reservationToSave;
  } catch (error) {
    console.error('Error adding reservation to Firestore:', error);
    const finalId = res.id || 'OL-' + Math.floor(1000 + Math.random() * 9000);
    const reservationToSave: Reservation = {
      ...res,
      id: finalId,
      createdAt: res.createdAt || new Date().toISOString(),
    };
    // Fallback save in localStorage
    const stored = localStorage.getItem('olabissi_reservations');
    const existing: Reservation[] = stored ? JSON.parse(stored) : [];
    existing.unshift(reservationToSave);
    localStorage.setItem('olabissi_reservations', JSON.stringify(existing));
    return reservationToSave;
  }
}

// Update reservation status
export async function updateReservationStatusInFirestore(id: string, status: 'confirme' | 'annule'): Promise<boolean> {
  try {
    const docRef = doc(db, RESERVATIONS_COLLECTION, id);
    await updateDoc(docRef, { status });

    // Mirror in localStorage
    const stored = localStorage.getItem('olabissi_reservations');
    if (stored) {
      const existing: Reservation[] = JSON.parse(stored);
      const updated = existing.map((res) => res.id === id ? { ...res, status } : res);
      localStorage.setItem('olabissi_reservations', JSON.stringify(updated));
    }
    return true;
  } catch (error) {
    console.error('Error updating reservation in Firestore:', error);
    // Fallback localStorage edit
    const stored = localStorage.getItem('olabissi_reservations');
    if (stored) {
      const existing: Reservation[] = JSON.parse(stored);
      const updated = existing.map((res) => res.id === id ? { ...res, status } : res);
      localStorage.setItem('olabissi_reservations', JSON.stringify(updated));
    }
    return true;
  }
}

// Delete reservation
export async function deleteReservationFromFirestore(id: string): Promise<boolean> {
  try {
    const docRef = doc(db, RESERVATIONS_COLLECTION, id);
    await deleteDoc(docRef);

    // Mirror in localStorage
    const stored = localStorage.getItem('olabissi_reservations');
    if (stored) {
      const existing: Reservation[] = JSON.parse(stored);
      const updated = existing.filter((res) => res.id !== id);
      localStorage.setItem('olabissi_reservations', JSON.stringify(updated));
    }
    return true;
  } catch (error) {
    console.error('Error deleting reservation in Firestore:', error);
    // Fallback localStorage delete
    const stored = localStorage.getItem('olabissi_reservations');
    if (stored) {
      const existing: Reservation[] = JSON.parse(stored);
      const updated = existing.filter((res) => res.id !== id);
      localStorage.setItem('olabissi_reservations', JSON.stringify(updated));
    }
    return true;
  }
}

/**
 * --- REVIEWS SERVICES ---
 */

// Load all reviews
export async function getReviewsFromFirestore(): Promise<Review[]> {
  try {
    const q = query(collection(db, REVIEWS_COLLECTION), orderBy('date', 'desc'));
    const querySnapshot = await getDocs(q);
    const reviews: Review[] = [];
    querySnapshot.forEach((docSnapshot) => {
      const data = docSnapshot.data();
      reviews.push({
        id: docSnapshot.id,
        authorName: data.authorName || '',
        rating: Number(data.rating) || 5,
        comment: data.comment || '',
        date: data.date || new Date().toISOString().split('T')[0],
        recommend: data.recommend !== false,
      });
    });
    return reviews;
  } catch (error) {
    console.error('Error fetching reviews from Firestore:', error);
    const stored = localStorage.getItem('olabissi_reviews');
    return stored ? JSON.parse(stored) : [];
  }
}

// Add a new review
export async function addReviewToFirestore(rev: Omit<Review, 'id'>): Promise<Review> {
  try {
    const docRef = doc(collection(db, REVIEWS_COLLECTION));
    const reviewToSave: Review = {
      ...rev,
      id: docRef.id,
    };

    await setDoc(doc(db, REVIEWS_COLLECTION, docRef.id), {
      ...reviewToSave
    });

    // Mirror in localStorage
    const stored = localStorage.getItem('olabissi_reviews');
    const existing: Review[] = stored ? JSON.parse(stored) : [];
    existing.unshift(reviewToSave);
    localStorage.setItem('olabissi_reviews', JSON.stringify(existing));

    return reviewToSave;
  } catch (error) {
    console.error('Error adding review to Firestore:', error);
    const finalId = 'REV-' + Math.floor(1000 + Math.random() * 9000);
    const reviewToSave: Review = {
      ...rev,
      id: finalId,
    };
    // Fallback localStorage
    const stored = localStorage.getItem('olabissi_reviews');
    const existing: Review[] = stored ? JSON.parse(stored) : [];
    existing.unshift(reviewToSave);
    localStorage.setItem('olabissi_reviews', JSON.stringify(existing));
    return reviewToSave;
  }
}

/**
 * --- CATERING SERVICES ---
 */

const CATERING_COLLECTION = 'catering';

export interface CateringRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  guests: number;
  eventType: string;
  message: string;
  createdAt: string;
  status: 'nouveau' | 'traite';
}

export async function getCateringRequestsFromFirestore(): Promise<CateringRequest[]> {
  try {
    const q = query(collection(db, CATERING_COLLECTION), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const requests: CateringRequest[] = [];
    querySnapshot.forEach((docSnapshot) => {
      const data = docSnapshot.data();
      requests.push({
        id: docSnapshot.id,
        name: data.name || '',
        email: data.email || '',
        phone: data.phone || '',
        date: data.date || '',
        guests: Number(data.guests) || 0,
        eventType: data.eventType || 'corporate',
        message: data.message || '',
        createdAt: data.createdAt || new Date().toISOString(),
        status: data.status || 'nouveau',
      });
    });
    return requests;
  } catch (error) {
    console.error('Error fetching catering requests:', error);
    const stored = localStorage.getItem('olabissi_catering');
    return stored ? JSON.parse(stored) : [];
  }
}

export async function updateCateringRequestStatusInFirestore(id: string, status: 'nouveau' | 'traite'): Promise<boolean> {
  try {
    const docRef = doc(db, CATERING_COLLECTION, id);
    await updateDoc(docRef, { status });

    const stored = localStorage.getItem('olabissi_catering');
    if (stored) {
      const existing: CateringRequest[] = JSON.parse(stored);
      const updated = existing.map((req) => req.id === id ? { ...req, status } : req);
      localStorage.setItem('olabissi_catering', JSON.stringify(updated));
    }
    return true;
  } catch (error) {
    console.error('Error updating catering request status:', error);
    return false;
  }
}

export async function deleteCateringRequestFromFirestore(id: string): Promise<boolean> {
  try {
    const docRef = doc(db, CATERING_COLLECTION, id);
    await deleteDoc(docRef);

    const stored = localStorage.getItem('olabissi_catering');
    if (stored) {
      const existing: CateringRequest[] = JSON.parse(stored);
      const updated = existing.filter((req) => req.id !== id);
      localStorage.setItem('olabissi_catering', JSON.stringify(updated));
    }
    return true;
  } catch (error) {
    console.error('Error deleting catering request:', error);
    return false;
  }
}

/**
 * --- ADMIN SECURITY CONFIG ---
 */

const SETTINGS_COLLECTION = 'settings';
const ADMIN_DOC_ID = 'admin_config';

export interface AdminConfig {
  passcode: string;
  lastChanged: string;
}

export async function getAdminConfigFromFirestore(): Promise<AdminConfig> {
  try {
    const docRef = doc(db, SETTINGS_COLLECTION, ADMIN_DOC_ID);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        passcode: data.passcode || '2290', // fallback default code
        lastChanged: data.lastChanged || new Date().toISOString()
      };
    } else {
      // Create default admin settings if not present
      const defaultConfig: AdminConfig = {
        passcode: '2290', // '+229' Cotonou Benin
        lastChanged: new Date().toISOString()
      };
      await setDoc(docRef, defaultConfig);
      return defaultConfig;
    }
  } catch (error) {
    console.error('Error getting admin config:', error);
    // fallback local values
    const stored = localStorage.getItem('olabissi_admin_passcode') || '2290';
    return {
      passcode: stored,
      lastChanged: new Date().toISOString()
    };
  }
}

export async function updateAdminConfigInFirestore(newPasscode: string): Promise<boolean> {
  try {
    const docRef = doc(db, SETTINGS_COLLECTION, ADMIN_DOC_ID);
    await setDoc(docRef, {
      passcode: newPasscode,
      lastChanged: new Date().toISOString()
    }, { merge: true });

    localStorage.setItem('olabissi_admin_passcode', newPasscode);
    return true;
  } catch (error) {
    console.error('Error updating admin config:', error);
    localStorage.setItem('olabissi_admin_passcode', newPasscode);
    return true; // return true on local storage fallback
  }
}

/**
 * --- MENU ITEMS SERVICES ---
 */

const MENU_COLLECTION = 'menu_items';

import { menuItems as defaultMenuItems } from './data';

// Load all menu items from Firestore (with automatic seeding)
export async function getMenuItemsFromFirestore(): Promise<MenuItem[]> {
  try {
    const q = query(collection(db, MENU_COLLECTION));
    const querySnapshot = await getDocs(q);
    const items: MenuItem[] = [];
    
    querySnapshot.forEach((docSnapshot) => {
      const data = docSnapshot.data();
      items.push({
        id: docSnapshot.id,
        name: data.name || '',
        price: Number(data.price) || 0,
        description: data.description || '',
        category: data.category || 'plats',
        image: data.image || '',
        tags: data.tags || [],
        allergens: data.allergens || [],
        isSignature: !!data.isSignature,
        spicyLevel: Number(data.spicyLevel) || 0,
      });
    });

    if (items.length === 0) {
      console.log('No menu items found in Firestore. Seeding defaults...');
      // Seed default menu items
      for (const item of defaultMenuItems) {
        await setDoc(doc(db, MENU_COLLECTION, item.id), {
          name: item.name,
          price: item.price,
          description: item.description,
          category: item.category,
          image: item.image,
          tags: item.tags || [],
          allergens: item.allergens || [],
          isSignature: !!item.isSignature,
          spicyLevel: item.spicyLevel || 0,
        });
        items.push(item);
      }
      // Store to localstorage
      localStorage.setItem('olabissi_menu_items', JSON.stringify(items));
    } else {
      localStorage.setItem('olabissi_menu_items', JSON.stringify(items));
    }

    return items;
  } catch (error) {
    console.error('Error fetching menu items from Firestore:', error);
    // Fallback to localStorage or defaultMenuItems
    const stored = localStorage.getItem('olabissi_menu_items');
    return stored ? JSON.parse(stored) : defaultMenuItems;
  }
}

// Add a new menu item
export async function addMenuItemToFirestore(item: Omit<MenuItem, 'id'>): Promise<MenuItem> {
  try {
    const docRef = doc(collection(db, MENU_COLLECTION));
    const newItem: MenuItem = {
      ...item,
      id: docRef.id,
    };

    await setDoc(doc(db, MENU_COLLECTION, docRef.id), {
      name: item.name,
      price: Number(item.price) || 0,
      description: item.description,
      category: item.category,
      image: item.image,
      tags: item.tags || [],
      allergens: item.allergens || [],
      isSignature: !!item.isSignature,
      spicyLevel: Number(item.spicyLevel) || 0,
    });

    // Mirror in localstorage
    const stored = localStorage.getItem('olabissi_menu_items');
    const existing: MenuItem[] = stored ? JSON.parse(stored) : [];
    existing.push(newItem);
    localStorage.setItem('olabissi_menu_items', JSON.stringify(existing));

    return newItem;
  } catch (error) {
    console.error('Error adding menu item:', error);
    const mockId = 'menu-' + Math.floor(1000 + Math.random() * 9000);
    const newItem: MenuItem = { ...item, id: mockId };
    
    const stored = localStorage.getItem('olabissi_menu_items');
    const existing: MenuItem[] = stored ? JSON.parse(stored) : [];
    existing.push(newItem);
    localStorage.setItem('olabissi_menu_items', JSON.stringify(existing));
    
    return newItem;
  }
}

// Update an existing menu item
export async function updateMenuItemInFirestore(id: string, updatedFields: Partial<MenuItem>): Promise<boolean> {
  try {
    const docRef = doc(db, MENU_COLLECTION, id);
    const cleanFields: any = {};
    if (updatedFields.name !== undefined) cleanFields.name = updatedFields.name;
    if (updatedFields.price !== undefined) cleanFields.price = Number(updatedFields.price);
    if (updatedFields.description !== undefined) cleanFields.description = updatedFields.description;
    if (updatedFields.category !== undefined) cleanFields.category = updatedFields.category;
    if (updatedFields.image !== undefined) cleanFields.image = updatedFields.image;
    if (updatedFields.tags !== undefined) cleanFields.tags = updatedFields.tags;
    if (updatedFields.allergens !== undefined) cleanFields.allergens = updatedFields.allergens;
    if (updatedFields.isSignature !== undefined) cleanFields.isSignature = !!updatedFields.isSignature;
    if (updatedFields.spicyLevel !== undefined) cleanFields.spicyLevel = Number(updatedFields.spicyLevel);

    await updateDoc(docRef, cleanFields);

    // Mirror in localstorage
    const stored = localStorage.getItem('olabissi_menu_items');
    if (stored) {
      const existing: MenuItem[] = JSON.parse(stored);
      const updated = existing.map(item => item.id === id ? { ...item, ...updatedFields } : item);
      localStorage.setItem('olabissi_menu_items', JSON.stringify(updated));
    }
    return true;
  } catch (error) {
    console.error('Error updating menu item:', error);
    const stored = localStorage.getItem('olabissi_menu_items');
    if (stored) {
      const existing: MenuItem[] = JSON.parse(stored);
      const updated = existing.map(item => item.id === id ? { ...item, ...updatedFields } : item);
      localStorage.setItem('olabissi_menu_items', JSON.stringify(updated));
    }
    return true;
  }
}

// Delete a menu item
export async function deleteMenuItemFromFirestore(id: string): Promise<boolean> {
  try {
    const docRef = doc(db, MENU_COLLECTION, id);
    await deleteDoc(docRef);

    // Mirror in localstorage
    const stored = localStorage.getItem('olabissi_menu_items');
    if (stored) {
      const existing: MenuItem[] = JSON.parse(stored);
      const updated = existing.filter(item => item.id !== id);
      localStorage.setItem('olabissi_menu_items', JSON.stringify(updated));
    }
    return true;
  } catch (error) {
    console.error('Error deleting menu item:', error);
    const stored = localStorage.getItem('olabissi_menu_items');
    if (stored) {
      const existing: MenuItem[] = JSON.parse(stored);
      const updated = existing.filter(item => item.id !== id);
      localStorage.setItem('olabissi_menu_items', JSON.stringify(updated));
    }
    return true;
  }
}

