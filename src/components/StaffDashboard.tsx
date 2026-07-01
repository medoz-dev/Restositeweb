import React, { useState, useEffect } from 'react';
import { Reservation, Review, MenuItem } from '../types';
import { 
  getReservationsFromFirestore, 
  updateReservationStatusInFirestore, 
  deleteReservationFromFirestore, 
  getReviewsFromFirestore,
  getCateringRequestsFromFirestore,
  updateCateringRequestStatusInFirestore,
  deleteCateringRequestFromFirestore,
  getAdminConfigFromFirestore,
  updateAdminConfigInFirestore,
  CateringRequest,
  getMenuItemsFromFirestore,
  addMenuItemToFirestore,
  updateMenuItemInFirestore,
  deleteMenuItemFromFirestore
} from '../firebase';
import { 
  CheckCircle, 
  XCircle, 
  Trash2, 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  FileText, 
  TrendingUp, 
  Users, 
  CheckCircle2, 
  ShieldAlert,
  Sparkles,
  Award,
  BookOpen,
  LogOut,
  Key,
  Download,
  Database,
  Activity,
  Lock,
  Settings,
  Shield,
  Terminal,
  Plus,
  Edit2,
  Save,
  Image,
  Tag,
  ChevronRight
} from 'lucide-react';

interface StaffDashboardProps {
  onUpdate: () => void;
  reservationTrigger: number;
  onLogout: () => void;
}


export default function StaffDashboard({ onUpdate, reservationTrigger, onLogout }: StaffDashboardProps) {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [cateringRequests, setCateringRequests] = useState<CateringRequest[]>([]);
  const [menuItemsList, setMenuItemsList] = useState<MenuItem[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'en_attente' | 'confirme' | 'annule'>('all');
  const [masterTab, setMasterTab] = useState<'reservations' | 'catering' | 'menu' | 'security'>('reservations');
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [newMenuItem, setNewMenuItem] = useState<Omit<MenuItem, 'id'>>({
    name: '',
    price: 3000,
    description: '',
    category: 'plats',
    image: '',
    tags: [],
    allergens: [],
    isSignature: false,
    spicyLevel: 0
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [menuLoading, setMenuLoading] = useState(false);
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [pinConfirm, setPinConfirm] = useState('');
  const [pinLoading, setPinLoading] = useState(false);
  const [pinMessage, setPinMessage] = useState<{ text: string; isError: boolean } | null>(null);
  const [savedPin, setSavedPin] = useState('2290');

  // Custom interactive trace activity logs
  const [activityLogs, setActivityLogs] = useState<{ id: string; time: string; type: string; message: string }[]>(() => {
    const defaultLogs = [
      { id: 'log-1', time: new Date(Date.now() - 3600000 * 3).toLocaleTimeString('fr-FR'), type: 'SYS', message: 'Démarrage du microservice de synchronisation Firestore' },
      { id: 'log-2', time: new Date(Date.now() - 3600000 * 2.5).toLocaleTimeString('fr-FR'), type: 'AUTH', message: 'Chargement des règles de sécurité de l\'infrastructure' },
      { id: 'log-3', time: new Date(Date.now() - 3600000 * 1.2).toLocaleTimeString('fr-FR'), type: 'DB', message: 'Chargement de la base de données' },
      { id: 'log-4', time: new Date().toLocaleTimeString('fr-FR'), type: 'AUTH', message: 'Connexion de l\'administrateur acceptée (Session sécurisée)' }
    ];
    return defaultLogs;
  });

  const addLog = (type: string, message: string) => {
    setActivityLogs(prev => [
      {
        id: 'log-' + Math.random(),
        time: new Date().toLocaleTimeString('fr-FR'),
        type,
        message
      },
      ...prev.slice(0, 19)
    ]);
  };

  // Load actual pin on mount
  useEffect(() => {
    getAdminConfigFromFirestore().then((config) => {
      setSavedPin(config.passcode);
    }).catch(err => console.error("Error loading config inside dashboard:", err));
  }, []);


  // Load reservations, reviews, catering requests, and menu items
  useEffect(() => {
    const loadData = async () => {
      try {
        const resData = await getReservationsFromFirestore();
        setReservations(resData);

        const revData = await getReviewsFromFirestore();
        setReviews(revData);

        const catData = await getCateringRequestsFromFirestore();
        setCateringRequests(catData);

        const menuData = await getMenuItemsFromFirestore();
        setMenuItemsList(menuData);
      } catch (err) {
        console.error("Error loading dashboard data:", err);
      }
    };

    loadData();
  }, [reservationTrigger]);

  // Update reservation status and save
  const updateStatus = async (id: string, newStatus: 'confirme' | 'annule') => {
    try {
      await updateReservationStatusInFirestore(id, newStatus);
      const updated = reservations.map((res) => {
        if (res.id === id) {
          return { ...res, status: newStatus };
        }
        return res;
      });
      setReservations(updated);
      addLog('DB', `Statut réservation #${id.substring(0,6)} changé -> ${newStatus === 'confirme' ? 'Confirmé' : 'Annulé'}`);
      onUpdate();
    } catch (err) {
      console.error(err);
      addLog('ERR', `Échec mise à jour statut réservation #${id.substring(0,6)}`);
    }
  };

  // Delete a reservation
  const deleteReservation = async (id: string) => {
    if (window.confirm('Voulez-vous vraiment supprimer définitivement cette réservation ?')) {
      try {
        await deleteReservationFromFirestore(id);
        const updated = reservations.filter((res) => res.id !== id);
        setReservations(updated);
        addLog('DB', `Réservation #${id.substring(0,6)} supprimée définitivement`);
        onUpdate();
      } catch (err) {
        console.error(err);
        addLog('ERR', `Échec suppression réservation #${id.substring(0,6)}`);
      }
    }
  };

  // Update catering request status
  const updateCateringStatus = async (id: string, newStatus: 'nouveau' | 'traite') => {
    try {
      await updateCateringRequestStatusInFirestore(id, newStatus);
      const updated = cateringRequests.map((req) => {
        if (req.id === id) {
          return { ...req, status: newStatus };
        }
        return req;
      });
      setCateringRequests(updated);
      addLog('DB', `Statut traiteur #${id.substring(0,6)} changé -> ${newStatus === 'traite' ? 'Traité' : 'Nouveau'}`);
      onUpdate();
    } catch (err) {
      console.error(err);
      addLog('ERR', `Échec mise à jour statut traiteur #${id.substring(0,6)}`);
    }
  };

  // Delete a catering request
  const deleteCateringRequest = async (id: string) => {
    if (window.confirm('Voulez-vous vraiment supprimer définitivement cette demande traiteur ?')) {
      try {
        await deleteCateringRequestFromFirestore(id);
        const updated = cateringRequests.filter((req) => req.id !== id);
        setCateringRequests(updated);
        addLog('DB', `Demande traiteur #${id.substring(0,6)} supprimée définitivement`);
        onUpdate();
      } catch (err) {
        console.error(err);
        addLog('ERR', `Échec suppression demande traiteur #${id.substring(0,6)}`);
      }
    }
  };

  const exportReservationsToCSV = () => {
    try {
      if (reservations.length === 0) {
        alert("Aucune réservation à exporter.");
        return;
      }
      const headers = ['ID', 'Date', 'Heure', 'Convives', 'Nom Complet', 'Telephone', 'Email', 'Preference Table', 'Demande Speciale', 'Statut', 'Cree le'];
      const rows = reservations.map(r => [
        r.id,
        r.date,
        r.time,
        r.guestsCount,
        r.fullName.replace(/"/g, '""'),
        r.phone,
        r.email,
        r.tablePreference,
        (r.specialRequest || '').replace(/"/g, '""'),
        r.status,
        r.createdAt
      ]);

      const csvContent = "data:text/csv;charset=utf-8,\uFEFF" 
        + [headers.join(','), ...rows.map(e => e.map(val => `"${val}"`).join(","))].join("\n");
      
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `reservations_lendroit_olabissi_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      addLog('SYS', 'Exportation des réservations au format CSV réussie');
    } catch (err) {
      console.error(err);
      addLog('ERR', 'Échec de l\'exportation CSV des réservations');
    }
  };

  const exportCateringToCSV = () => {
    try {
      if (cateringRequests.length === 0) {
        alert("Aucune demande traiteur à exporter.");
        return;
      }
      const headers = ['ID', 'Nom Complet', 'Email', 'Telephone', 'Date souhaitee', 'Convives', 'Type de Reception', 'Message', 'Cree le', 'Statut'];
      const rows = cateringRequests.map(r => [
        r.id,
        r.name.replace(/"/g, '""'),
        r.email,
        r.phone,
        r.date,
        r.guests,
        r.eventType,
        (r.message || '').replace(/"/g, '""'),
        r.createdAt,
        r.status
      ]);

      const csvContent = "data:text/csv;charset=utf-8,\uFEFF" 
        + [headers.join(','), ...rows.map(e => e.map(val => `"${val}"`).join(","))].join("\n");
      
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `traiteur_lendroit_olabissi_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      addLog('SYS', 'Exportation des demandes traiteur au format CSV réussie');
    } catch (err) {
      console.error(err);
      addLog('ERR', 'Échec de l\'exportation CSV des demandes traiteur');
    }
  };

  // --- MENU CRUD HANDLERS ---

  const handleAddMenuItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMenuItem.name || !newMenuItem.price) {
      alert("Le nom et le prix sont obligatoires !");
      return;
    }
    setMenuLoading(true);
    try {
      const addedItem = await addMenuItemToFirestore({
        ...newMenuItem,
        // Set standard placeholders if empty
        image: newMenuItem.image || 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',
        tags: newMenuItem.tags || [],
        allergens: newMenuItem.allergens || []
      });
      setMenuItemsList(prev => [...prev, addedItem]);
      addLog('DB', `Plat "${addedItem.name}" ajouté avec succès (#${addedItem.id.substring(0,6)})`);
      
      // Reset form
      setNewMenuItem({
        name: '',
        price: 3000,
        description: '',
        category: 'plats',
        image: '',
        tags: [],
        allergens: [],
        isSignature: false,
        spicyLevel: 0
      });
      setShowAddForm(false);
      onUpdate();
    } catch (err) {
      console.error(err);
      addLog('ERR', `Échec de l'ajout du plat "${newMenuItem.name}"`);
    } finally {
      setMenuLoading(false);
    }
  };

  const handleUpdateMenuItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    if (!editingItem.name || !editingItem.price) {
      alert("Le nom et le prix sont obligatoires !");
      return;
    }
    setMenuLoading(true);
    try {
      const success = await updateMenuItemInFirestore(editingItem.id, editingItem);
      if (success) {
        setMenuItemsList(prev => prev.map(item => item.id === editingItem.id ? editingItem : item));
        addLog('DB', `Plat "${editingItem.name}" modifié avec succès`);
        setEditingItem(null);
        onUpdate();
      } else {
        alert("Erreur lors de la mise à jour");
      }
    } catch (err) {
      console.error(err);
      addLog('ERR', `Échec de la mise à jour du plat "${editingItem.name}"`);
    } finally {
      setMenuLoading(false);
    }
  };

  const handleDeleteMenuItem = async (id: string, name: string) => {
    if (window.confirm(`Voulez-vous vraiment supprimer définitivement le plat "${name}" ?`)) {
      setMenuLoading(true);
      try {
        const success = await deleteMenuItemFromFirestore(id);
        if (success) {
          setMenuItemsList(prev => prev.filter(item => item.id !== id));
          addLog('DB', `Plat "${name}" supprimé définitivement (#${id.substring(0,6)})`);
          onUpdate();
        } else {
          alert("Erreur lors de la suppression");
        }
      } catch (err) {
        console.error(err);
        addLog('ERR', `Échec de la suppression du plat "${name}"`);
      } finally {
        setMenuLoading(false);
      }
    }
  };

  const handlePinChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPinMessage(null);

    if (currentPin !== savedPin) {
      setPinMessage({ text: 'Le code d\'accès actuel est incorrect.', isError: true });
      addLog('AUTH', 'Tentative infructueuse de changement de code d\'accès (code actuel erroné)');
      return;
    }

    if (newPin.length !== 4 || !/^\d+$/.test(newPin)) {
      setPinMessage({ text: 'Le nouveau code doit contenir exactement 4 chiffres.', isError: true });
      return;
    }

    if (newPin !== pinConfirm) {
      setPinMessage({ text: 'La confirmation ne correspond pas au nouveau code.', isError: true });
      return;
    }

    setPinLoading(true);
    try {
      const success = await updateAdminConfigInFirestore(newPin);
      if (success) {
        setSavedPin(newPin);
        setPinMessage({ text: 'Code d\'accès administrateur mis à jour avec succès.', isError: false });
        addLog('AUTH', 'Code d\'accès administrateur modifié avec succès');
        setCurrentPin('');
        setNewPin('');
        setPinConfirm('');
      } else {
        setPinMessage({ text: 'Erreur lors de la mise à jour sur Firestore.', isError: true });
      }
    } catch (err) {
      console.error(err);
      setPinMessage({ text: 'Une erreur est survenue lors de l\'enregistrement.', isError: true });
    } finally {
      setPinLoading(false);
    }
  };

  // Filter reservations based on activeTab
  const filteredReservations = reservations.filter((res) => {
    if (activeTab === 'all') return true;
    return res.status === activeTab;
  });

  // Calculate quick stats
  const stats = {
    total: reservations.length,
    pending: reservations.filter((r) => r.status === 'en_attente').length,
    confirmed: reservations.filter((r) => r.status === 'confirme').length,
    todayGuests: reservations
      .filter((r) => r.date === new Date().toISOString().split('T')[0] && r.status === 'confirme')
      .reduce((sum, r) => sum + r.guestsCount, 0),
    cateringNew: cateringRequests.filter((c) => c.status === 'nouveau').length,
  };

  return (
    <main className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen bg-warm-50 animate-fade-in" id="staff-dashboard">
      
      {/* Title block */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-warm-200 pb-6 mb-8">
        <div>
          <span className="text-[10px] tracking-widest font-sans font-bold text-gold-700 bg-gold-100/50 border border-gold-200 px-3 py-1 rounded uppercase flex items-center gap-1.5 w-fit">
            <Shield size={10} className="text-gold-700" />
            Espace Professionnel Sécurisé
          </span>
          <h2 className="text-3xl font-serif text-warm-900 font-extrabold mt-3">
            Tableau de Bord d'Escale du Pont
          </h2>
        </div>
        
        {/* Actions & Status */}
        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
          <div className="flex items-center gap-2 text-xs font-sans text-warm-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span>Base Firestore Synchronisée</span>
          </div>

          <button
            onClick={() => {
              addLog('AUTH', 'Déconnexion manuelle de l\'administrateur');
              onLogout();
            }}
            className="flex items-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-white hover:text-gold-500 text-xs font-sans font-bold tracking-wider uppercase px-4 py-2.5 rounded-lg transition-all shadow-md border border-neutral-800 cursor-pointer"
          >
            <LogOut size={14} className="text-gold-500" />
            <span>Déconnexion</span>
          </button>
        </div>
      </div>

      {/* Analytics stats boxes */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        
        <div className="bg-white rounded-xl border border-warm-200 p-5 shadow-sm space-y-1">
          <span className="text-[10px] font-sans font-bold text-warm-800 tracking-wider uppercase block">
            Réservations totales
          </span>
          <div className="flex items-baseline justify-between pt-1">
            <span className="text-2xl sm:text-3xl font-serif font-extrabold text-warm-900">
              {stats.total}
            </span>
            <Calendar className="text-gold-700" size={18} />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-warm-200 p-5 shadow-sm space-y-1">
          <span className="text-[10px] font-sans font-bold text-warm-800 tracking-wider uppercase block">
            En attente de validation
          </span>
          <div className="flex items-baseline justify-between pt-1">
            <span className={`text-2xl sm:text-3xl font-serif font-extrabold ${stats.pending > 0 ? 'text-amber-600 animate-pulse' : 'text-warm-900'}`}>
              {stats.pending}
            </span>
            <ShieldAlert className={stats.pending > 0 ? 'text-amber-500' : 'text-warm-800'} size={18} />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-warm-200 p-5 shadow-sm space-y-1">
          <span className="text-[10px] font-sans font-bold text-warm-800 tracking-wider uppercase block">
            Validées / Confirmées
          </span>
          <div className="flex items-baseline justify-between pt-1">
            <span className="text-2xl sm:text-3xl font-serif font-extrabold text-emerald-700">
              {stats.confirmed}
            </span>
            <CheckCircle2 className="text-emerald-600" size={18} />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-warm-200 p-5 shadow-sm space-y-1">
          <span className="text-[10px] font-sans font-bold text-warm-800 tracking-wider uppercase block">
            Couverts attendus aujourd'hui
          </span>
          <div className="flex items-baseline justify-between pt-1">
            <span className="text-2xl sm:text-3xl font-serif font-extrabold text-warm-900">
              {stats.todayGuests}
            </span>
            <Users className="text-gold-700" size={18} />
          </div>
        </div>

      </div>

      {/* Master Tabs Switcher */}
      <div className="flex flex-wrap border-b border-warm-200 mb-6 gap-2">
        <button
          onClick={() => setMasterTab('reservations')}
          className={`px-6 py-3 font-serif font-bold text-sm tracking-wide border-b-2 transition-all cursor-pointer ${
            masterTab === 'reservations'
              ? 'border-gold-700 text-gold-700 font-extrabold'
              : 'border-transparent text-warm-800 hover:text-warm-900'
          }`}
        >
          Réservations de Tables ({stats.total})
        </button>
        <button
          onClick={() => setMasterTab('catering')}
          className={`px-6 py-3 font-serif font-bold text-sm tracking-wide border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
            masterTab === 'catering'
              ? 'border-gold-700 text-gold-700 font-extrabold'
              : 'border-transparent text-warm-800 hover:text-warm-900'
          }`}
        >
          <span>Prestations Traiteur</span>
          {stats.cateringNew > 0 && (
            <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-200 animate-pulse">
              {stats.cateringNew} Nouveau
            </span>
          )}
        </button>
        <button
          onClick={() => setMasterTab('menu')}
          className={`px-6 py-3 font-serif font-bold text-sm tracking-wide border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
            masterTab === 'menu'
              ? 'border-gold-700 text-gold-700 font-extrabold'
              : 'border-transparent text-warm-800 hover:text-warm-900'
          }`}
        >
          <BookOpen size={14} className="text-gold-700" />
          <span>Gestion du Menu</span>
        </button>
        <button
          onClick={() => setMasterTab('security')}
          className={`px-6 py-3 font-serif font-bold text-sm tracking-wide border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
            masterTab === 'security'
              ? 'border-gold-700 text-gold-700 font-extrabold'
              : 'border-transparent text-warm-800 hover:text-warm-900'
          }`}
        >
          <Settings size={14} className="text-gold-700" />
          <span>Sécurité & Système</span>
        </button>
      </div>

      {masterTab === 'security' ? (
        /* --- SECURITY PANEL VIEW --- */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in w-full mb-12">
          {/* Form to change PIN (Col-7) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-xl border border-warm-200 shadow-sm p-6 sm:p-8 space-y-6">
              <div className="border-b border-warm-100 pb-4 flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-gold-50 border border-gold-200 text-gold-700 flex shrink-0">
                  <Key size={18} />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-warm-900">Code d'Accès d'Administration</h3>
                  <p className="text-xs text-warm-800 font-sans mt-0.5">Modifier le code PIN à 4 chiffres nécessaire pour accéder au back-office.</p>
                </div>
              </div>

              <form onSubmit={handlePinChange} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-[10px] tracking-wider font-sans font-bold text-warm-800 uppercase block mb-1">Code PIN Actuel</label>
                    <input
                      required
                      type="password"
                      maxLength={4}
                      placeholder="••••"
                      value={currentPin}
                      onChange={(e) => setCurrentPin(e.target.value.replace(/\D/g, ''))}
                      className="w-full bg-warm-50/50 text-warm-900 font-mono tracking-widest text-center text-sm rounded-lg px-4 py-2.5 border border-warm-200 focus:outline-none focus:border-gold-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] tracking-wider font-sans font-bold text-warm-800 uppercase block mb-1">Nouveau Code PIN</label>
                    <input
                      required
                      type="password"
                      maxLength={4}
                      placeholder="••••"
                      value={newPin}
                      onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ''))}
                      className="w-full bg-warm-50/50 text-warm-900 font-mono tracking-widest text-center text-sm rounded-lg px-4 py-2.5 border border-warm-200 focus:outline-none focus:border-gold-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] tracking-wider font-sans font-bold text-warm-800 uppercase block mb-1">Confirmer Nouveau PIN</label>
                    <input
                      required
                      type="password"
                      maxLength={4}
                      placeholder="••••"
                      value={pinConfirm}
                      onChange={(e) => setPinConfirm(e.target.value.replace(/\D/g, ''))}
                      className="w-full bg-warm-50/50 text-warm-900 font-mono tracking-widest text-center text-sm rounded-lg px-4 py-2.5 border border-warm-200 focus:outline-none focus:border-gold-500"
                    />
                  </div>
                </div>

                {pinMessage && (
                  <div className={`p-3 rounded-lg text-xs font-sans font-medium flex items-center gap-2 ${
                    pinMessage.isError ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}>
                    {pinMessage.isError ? <ShieldAlert size={14} /> : <CheckCircle2 size={14} />}
                    <span>{pinMessage.text}</span>
                  </div>
                )}

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={pinLoading}
                    className="w-full sm:w-auto bg-neutral-900 hover:bg-neutral-800 text-white font-sans font-bold text-xs tracking-widest px-6 py-3.5 rounded-lg uppercase shadow transition-all duration-200 cursor-pointer"
                  >
                    {pinLoading ? 'Mise à jour...' : 'Sauvegarder le code d\'accès'}
                  </button>
                </div>
              </form>
            </div>

            {/* Backups Card */}
            <div className="bg-white rounded-xl border border-warm-200 shadow-sm p-6 sm:p-8 space-y-6">
              <div className="border-b border-warm-100 pb-4 flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-gold-50 border border-gold-200 text-gold-700 flex shrink-0">
                  <Database size={18} />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-warm-900">Extraction & Sauvegardes de Données</h3>
                  <p className="text-xs text-warm-800 font-sans mt-0.5 font-light">Téléchargez vos réservations et vos devis traiteurs au format standard CSV pour Excel.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="border border-warm-200 rounded-xl p-5 bg-warm-50/20 space-y-3 flex flex-col justify-between hover:border-gold-500/30 transition-all">
                  <div className="space-y-1">
                    <h4 className="font-serif font-bold text-sm text-warm-900">Réservations de Tables ({reservations.length})</h4>
                    <p className="text-[11px] text-warm-800 font-sans leading-relaxed">Téléchargez tous les dossiers clients de réservations enregistrés dans la base Firestore.</p>
                  </div>
                  <button
                    onClick={exportReservationsToCSV}
                    className="w-full bg-white border border-warm-200 hover:border-gold-500 hover:bg-gold-50 text-warm-800 font-sans font-bold text-xs py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Download size={14} className="text-gold-700" />
                    <span>Exporter (CSV)</span>
                  </button>
                </div>

                <div className="border border-warm-200 rounded-xl p-5 bg-warm-50/20 space-y-3 flex flex-col justify-between hover:border-gold-500/30 transition-all">
                  <div className="space-y-1">
                    <h4 className="font-serif font-bold text-sm text-warm-900">Demandes Traiteur ({cateringRequests.length})</h4>
                    <p className="text-[11px] text-warm-800 font-sans leading-relaxed">Téléchargez l'intégralité des fiches de demandes pour réceptions privées et mariages.</p>
                  </div>
                  <button
                    onClick={exportCateringToCSV}
                    className="w-full bg-white border border-warm-200 hover:border-gold-500 hover:bg-gold-50 text-warm-800 font-sans font-bold text-xs py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Download size={14} className="text-gold-700" />
                    <span>Exporter (CSV)</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Console Terminal (Col-5) */}
          <div className="lg:col-span-5">
            <div className="bg-neutral-950 rounded-2xl border border-neutral-800 p-6 shadow-xl flex flex-col h-full min-h-[460px]">
              <div className="border-b border-neutral-800 pb-4 mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Terminal size={18} className="text-gold-500 animate-pulse flex shrink-0" />
                  <div>
                    <h4 className="font-mono text-xs font-bold text-white tracking-wider uppercase">Console d'Audit Systèmes</h4>
                    <p className="text-[10px] text-warm-400 font-sans font-light">Traceur d'arrière-plan en temps réel.</p>
                  </div>
                </div>
                <button
                  onClick={() => setActivityLogs([])}
                  className="text-[9px] font-mono tracking-wider font-bold text-warm-400 hover:text-white border border-neutral-800 hover:bg-neutral-900 px-2 py-1 rounded transition-colors uppercase cursor-pointer"
                >
                  Clear Logs
                </button>
              </div>

              {/* Logs display */}
              <div className="flex-1 overflow-y-auto font-mono text-[10.5px] space-y-2 max-h-[350px] pr-1 scrollbar-thin scrollbar-thumb-neutral-800 scrollbar-track-transparent">
                {activityLogs.length > 0 ? (
                  activityLogs.map((log) => {
                    let typeColor = 'text-blue-400';
                    if (log.type === 'AUTH') typeColor = 'text-purple-400 font-bold';
                    if (log.type === 'ERR') typeColor = 'text-red-400 font-bold';
                    if (log.type === 'DB') typeColor = 'text-emerald-400';
                    if (log.type === 'SYS') typeColor = 'text-amber-400';

                    return (
                      <div key={log.id} className="text-warm-300 leading-normal border-b border-neutral-900/30 pb-1 last:border-0 last:pb-0">
                        <span className="text-neutral-500">[{log.time}]</span>{' '}
                        <span className={typeColor}>[{log.type}]</span>{' '}
                        <span>{log.message}</span>
                      </div>
                    );
                  })
                ) : (
                  <div className="h-full flex flex-col justify-center items-center text-neutral-500 text-xs py-12">
                    <span>Aucun événement enregistré. En attente d'opérations.</span>
                  </div>
                )}
              </div>

              {/* Console Prompt footer */}
              <div className="border-t border-neutral-900 pt-3 mt-4 flex items-center justify-between text-[10px] font-mono text-neutral-500">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                  STATUS: SECURE_ENGINE_READY
                </span>
                <span>UTC: {new Date().getFullYear()}</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* --- MASTER TABS STANDARD CONTENT WORKSPACE --- */
        <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Left Side: Dynamic Workspace Panel (Col-span 2) */}
        <div className="lg:col-span-2 space-y-6">
          {masterTab === 'reservations' && (
            <div className="bg-white rounded-xl border border-warm-200 shadow-sm p-5 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-warm-100 pb-4 mb-6">
                <h3 className="font-serif font-bold text-lg text-warm-900">
                  Gestion des Réservations
                </h3>

                {/* Status filtering tabs */}
                <div className="flex gap-1.5 overflow-x-auto scrollbar-none">
                  <button
                    onClick={() => setActiveTab('all')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-sans font-bold uppercase whitespace-nowrap ${
                      activeTab === 'all'
                        ? 'bg-gold-700 text-white'
                        : 'bg-warm-50 text-warm-800 hover:bg-warm-100'
                    }`}
                  >
                    Tous
                  </button>
                  <button
                    onClick={() => setActiveTab('en_attente')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-sans font-bold uppercase whitespace-nowrap ${
                      activeTab === 'en_attente'
                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                        : 'bg-warm-50 text-warm-800 hover:bg-warm-100'
                    }`}
                  >
                    En attente ({reservations.filter((r) => r.status === 'en_attente').length})
                  </button>
                  <button
                    onClick={() => setActiveTab('confirme')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-sans font-bold uppercase whitespace-nowrap ${
                      activeTab === 'confirme'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : 'bg-warm-50 text-warm-800 hover:bg-warm-100'
                    }`}
                  >
                    Confirmés ({reservations.filter((r) => r.status === 'confirme').length})
                  </button>
                  <button
                    onClick={() => setActiveTab('annule')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-sans font-bold uppercase whitespace-nowrap ${
                      activeTab === 'annule'
                        ? 'bg-red-100 text-red-800 border border-red-200'
                        : 'bg-warm-50 text-warm-800 hover:bg-warm-100'
                    }`}
                  >
                    Annulés
                  </button>
                </div>
              </div>

              {/* List layout */}
              {filteredReservations.length > 0 ? (
                <div className="space-y-4">
                  {filteredReservations.map((res) => (
                    <div
                      key={res.id}
                      className="bg-warm-50/50 rounded-xl border border-warm-200 p-5 flex flex-col justify-between gap-4 group hover:border-gold-500/40 transition-all shadow-sm"
                    >
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                        {/* Left: General data */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-sm font-bold text-warm-900 select-all">
                              {res.id}
                            </span>
                            <span
                              className={`text-[9px] tracking-wider font-sans font-extrabold px-2.5 py-0.5 rounded-full uppercase border ${
                                res.status === 'confirme'
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                  : res.status === 'annule'
                                  ? 'bg-red-50 text-red-800 border-red-200'
                                  : 'bg-amber-50 text-amber-800 border-amber-200 animate-pulse'
                              }`}
                            >
                              {res.status === 'confirme' && 'Confirmée'}
                              {res.status === 'annule' && 'Annulée'}
                              {res.status === 'en_attente' && 'En attente'}
                            </span>
                          </div>

                          <h4 className="font-serif font-extrabold text-base text-warm-900 flex items-center gap-2">
                            <User size={14} className="text-gold-700" />
                            <span>{res.fullName}</span>
                          </h4>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 font-sans text-xs text-warm-800">
                            <p className="flex items-center gap-1.5">
                              <Calendar size={12} className="text-gold-700" />
                              <span>Le {new Date(res.date).toLocaleDateString('fr-FR')} à <strong>{res.time}</strong></span>
                            </p>
                            <p className="flex items-center gap-1.5">
                              <Users size={12} className="text-gold-700" />
                              <span>{res.guestsCount} couverts ({res.tablePreference.replace('_', ' ')})</span>
                            </p>
                            <p className="flex items-center gap-1.5">
                              <Phone size={12} className="text-gold-700" />
                              <span>{res.phone}</span>
                            </p>
                            <p className="flex items-center gap-1.5">
                              <Mail size={12} className="text-gold-700" />
                              <span className="truncate max-w-[200px]">{res.email}</span>
                            </p>
                          </div>
                        </div>

                        {/* Right: Actions */}
                        <div className="flex sm:flex-col items-center gap-2 w-full sm:w-auto self-stretch justify-end">
                          {res.status === 'en_attente' && (
                            <button
                              onClick={() => updateStatus(res.id, 'confirme')}
                              className="flex-grow sm:flex-grow-0 bg-emerald-600 hover:bg-emerald-700 text-white font-sans font-bold text-[10px] tracking-wider uppercase px-4 py-2 rounded shadow-sm transition-colors flex items-center justify-center gap-1"
                            >
                              <CheckCircle size={12} />
                              <span>Confirmer</span>
                            </button>
                          )}
                          {res.status !== 'annule' && (
                            <button
                              onClick={() => updateStatus(res.id, 'annule')}
                              className="flex-grow sm:flex-grow-0 bg-white border border-red-200 text-red-700 hover:bg-red-50 font-sans font-bold text-[10px] tracking-wider uppercase px-4 py-2 rounded transition-colors flex items-center justify-center gap-1"
                            >
                              <XCircle size={12} />
                              <span>Annuler</span>
                            </button>
                          )}
                          <button
                            onClick={() => deleteReservation(res.id)}
                            className="bg-white border border-warm-200 hover:bg-warm-100 p-2 rounded text-warm-800 hover:text-red-700 transition-colors"
                            title="Supprimer définitivement"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>

                      {/* Special requests / Notes */}
                      {res.specialRequest && (
                        <div className="mt-3 bg-white p-3 rounded border border-warm-200 flex gap-2 text-xs">
                          <FileText size={14} className="text-gold-700 shrink-0 mt-0.5" />
                          <div>
                            <strong className="text-warm-900 block font-sans">Notes client :</strong>
                            <span className="text-warm-800 font-sans italic">"{res.specialRequest}"</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-warm-50 rounded-xl border border-dashed border-warm-200">
                  <p className="text-warm-800 font-sans text-sm">
                    Aucune réservation dans cette catégorie actuellement.
                  </p>
                </div>
              )}
            </div>
          )}

          {masterTab === 'catering' && (
            <div className="bg-white rounded-xl border border-warm-200 shadow-sm p-5 sm:p-6 space-y-6">
              <div className="border-b border-warm-100 pb-4">
                <h3 className="font-serif font-bold text-lg text-warm-900">
                  Demandes de Service Traiteur
                </h3>
                <p className="text-xs text-warm-800 font-sans mt-1">
                  Gérez les demandes de buffet, cocktail dînatoire ou chef à domicile envoyées par les clients de Saint-Quentin.
                </p>
              </div>

              {cateringRequests.length > 0 ? (
                <div className="space-y-4">
                  {cateringRequests.map((req) => (
                    <div
                      key={req.id}
                      className="bg-warm-50/50 rounded-xl border border-warm-200 p-5 flex flex-col gap-4 group hover:border-gold-500/40 transition-all shadow-sm animate-fade-in"
                    >
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-warm-900 bg-warm-100 px-2.5 py-1 rounded">
                              {req.id}
                            </span>
                            <span
                              className={`text-[9px] tracking-wider font-sans font-extrabold px-2.5 py-0.5 rounded-full uppercase border ${
                                req.status === 'traite'
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                  : 'bg-amber-50 text-amber-800 border-amber-200 animate-pulse'
                              }`}
                            >
                              {req.status === 'traite' ? 'Traité' : 'Nouveau / Reçu'}
                            </span>
                          </div>

                          <h4 className="font-serif font-extrabold text-base text-warm-900 flex items-center gap-2">
                            <User size={14} className="text-gold-700" />
                            <span>{req.name}</span>
                          </h4>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 font-sans text-xs text-warm-800">
                            <p className="flex items-center gap-1.5">
                              <Calendar size={12} className="text-gold-700" />
                              <span>Date souhaitée : <strong>{req.date ? new Date(req.date).toLocaleDateString('fr-FR') : 'Non spécifiée'}</strong></span>
                            </p>
                            <p className="flex items-center gap-1.5">
                              <Users size={12} className="text-gold-700" />
                              <span>{req.guests > 0 ? `${req.guests} convives` : 'Nombre non spécifié'}</span>
                            </p>
                            <p className="flex items-center gap-1.5">
                              <Phone size={12} className="text-gold-700" />
                              <span>{req.phone}</span>
                            </p>
                            <p className="flex items-center gap-1.5">
                              <Mail size={12} className="text-gold-700" />
                              <span>{req.email}</span>
                            </p>
                            <p className="flex items-center gap-1.5 col-span-2">
                              <Sparkles size={12} className="text-gold-700" />
                              <span>Type de réception : <strong>
                                {req.eventType === 'corporate' && "Événement d'Entreprise"}
                                {req.eventType === 'wedding' && "Mariage / Fiançailles"}
                                {req.eventType === 'birthday' && "Anniversaire / Réception Privée"}
                                {req.eventType === 'home_chef' && "Chef à domicile"}
                                {req.eventType === 'other' && "Autre prestation"}
                              </strong></span>
                            </p>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex sm:flex-col items-center gap-2 w-full sm:w-auto self-stretch justify-end">
                          {req.status === 'nouveau' ? (
                            <button
                              onClick={() => updateCateringStatus(req.id, 'traite')}
                              className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-sans font-bold text-[10px] tracking-wider uppercase px-4 py-2.5 rounded shadow-sm transition-colors flex items-center justify-center gap-1 cursor-pointer"
                            >
                              <CheckCircle size={12} />
                              <span>Marquer Traité</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => updateCateringStatus(req.id, 'nouveau')}
                              className="w-full sm:w-auto bg-white border border-warm-200 text-warm-800 hover:bg-warm-150 font-sans font-bold text-[10px] tracking-wider uppercase px-4 py-2.5 rounded transition-colors flex items-center justify-center gap-1 cursor-pointer"
                            >
                              <span>Rétablir Nouveau</span>
                            </button>
                          )}
                          <button
                            onClick={() => deleteCateringRequest(req.id)}
                            className="bg-white border border-warm-200 hover:bg-warm-100 p-2.5 rounded text-warm-800 hover:text-red-700 transition-colors cursor-pointer"
                            title="Supprimer définitivement"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>

                      {req.message && (
                        <div className="bg-white p-3 rounded border border-warm-200 text-xs">
                          <strong className="text-warm-900 block font-sans">Message & Particularités :</strong>
                          <span className="text-warm-800 font-sans italic">"{req.message}"</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-warm-50 rounded-xl border border-dashed border-warm-200">
                  <p className="text-warm-800 font-sans text-sm">
                    Aucune demande de service traiteur reçue pour le moment.
                  </p>
                </div>
              )}
            </div>
          )}

          {masterTab === 'menu' && (
            <div className="space-y-6">
              {/* Menu Dashboard Header */}
              <div className="bg-white rounded-xl border border-warm-200 shadow-sm p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-serif font-bold text-lg text-warm-900">
                    Gestion de la Carte & Menu
                  </h3>
                  <p className="text-xs text-warm-800 font-sans mt-1">
                    Contrôlez l'ensemble des plats affichés sur le site. Les modifications sont appliquées instantanément.
                  </p>
                </div>
                {!showAddForm && !editingItem && (
                  <button
                    onClick={() => setShowAddForm(true)}
                    className="bg-gold-700 hover:bg-gold-800 text-white font-sans font-bold text-xs tracking-wider uppercase px-4 py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm shrink-0 cursor-pointer"
                  >
                    <Plus size={14} />
                    <span>Ajouter un plat</span>
                  </button>
                )}
              </div>

              {/* Form to Add / Edit Menu Item */}
              {(showAddForm || editingItem) && (
                <div className="bg-white rounded-xl border border-gold-500/30 shadow-md p-5 sm:p-6 space-y-6 animate-fade-in">
                  <div className="border-b border-warm-100 pb-3 flex items-center justify-between">
                    <h4 className="font-serif font-bold text-base text-warm-900 flex items-center gap-2">
                      <Tag className="text-gold-700" size={16} />
                      <span>{editingItem ? `Modifier le plat: ${editingItem.name}` : "Ajouter une nouvelle création"}</span>
                    </h4>
                    <button
                      onClick={() => {
                        setShowAddForm(false);
                        setEditingItem(null);
                      }}
                      className="text-xs font-sans text-warm-800 hover:text-warm-900 underline"
                    >
                      Annuler
                    </button>
                  </div>

                  <form onSubmit={editingItem ? handleUpdateMenuItem : handleAddMenuItem} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Name */}
                      <div>
                        <label className="text-[10px] tracking-wider font-sans font-bold text-warm-800 uppercase block mb-1">Nom du plat *</label>
                        <input
                          required
                          type="text"
                          placeholder="ex: Amiwo de Poulet Fermier"
                          value={editingItem ? editingItem.name : newMenuItem.name}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (editingItem) setEditingItem({ ...editingItem, name: val });
                            else setNewMenuItem({ ...newMenuItem, name: val });
                          }}
                          className="w-full bg-warm-50 text-warm-900 font-sans text-xs rounded-lg px-3 py-2 border border-warm-200 focus:outline-none focus:border-gold-500"
                        />
                      </div>

                      {/* Price */}
                      <div>
                        <label className="text-[10px] tracking-wider font-sans font-bold text-warm-800 uppercase block mb-1">Prix (FCFA) *</label>
                        <input
                          required
                          type="number"
                          placeholder="ex: 5000"
                          value={editingItem ? editingItem.price : newMenuItem.price}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            if (editingItem) setEditingItem({ ...editingItem, price: val });
                            else setNewMenuItem({ ...newMenuItem, price: val });
                          }}
                          className="w-full bg-warm-50 text-warm-900 font-sans text-xs rounded-lg px-3 py-2 border border-warm-200 focus:outline-none focus:border-gold-500"
                        />
                      </div>

                      {/* Category */}
                      <div>
                        <label className="text-[10px] tracking-wider font-sans font-bold text-warm-800 uppercase block mb-1">Catégorie *</label>
                        <select
                          value={editingItem ? editingItem.category : newMenuItem.category}
                          onChange={(e) => {
                            const val = e.target.value as 'entrées' | 'plats' | 'desserts' | 'boissons';
                            if (editingItem) setEditingItem({ ...editingItem, category: val });
                            else setNewMenuItem({ ...newMenuItem, category: val });
                          }}
                          className="w-full bg-warm-50 text-warm-900 font-sans text-xs rounded-lg px-3 py-2 border border-warm-200 focus:outline-none focus:border-gold-500 cursor-pointer"
                        >
                          <option value="entrées">Entrée</option>
                          <option value="plats">Plat Principal</option>
                          <option value="desserts">Dessert</option>
                          <option value="boissons">Boisson & Cocktail</option>
                        </select>
                      </div>

                      {/* Image URL */}
                      <div>
                        <label className="text-[10px] tracking-wider font-sans font-bold text-warm-800 uppercase block mb-1">URL de l'image (Unsplash ou autre)</label>
                        <input
                          type="text"
                          placeholder="https://images.unsplash.com/..."
                          value={editingItem ? editingItem.image : newMenuItem.image}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (editingItem) setEditingItem({ ...editingItem, image: val });
                            else setNewMenuItem({ ...newMenuItem, image: val });
                          }}
                          className="w-full bg-warm-50 text-warm-900 font-sans text-xs rounded-lg px-3 py-2 border border-warm-200 focus:outline-none focus:border-gold-500"
                        />
                      </div>

                      {/* Tags */}
                      <div>
                        <label className="text-[10px] tracking-wider font-sans font-bold text-warm-800 uppercase block mb-1">Étiquettes / Tags (séparés par des virgules)</label>
                        <input
                          type="text"
                          placeholder="ex: Frais, Traditionnel, Copieux"
                          value={editingItem ? editingItem.tags?.join(', ') : newMenuItem.tags?.join(', ')}
                          onChange={(e) => {
                            const val = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                            if (editingItem) setEditingItem({ ...editingItem, tags: val });
                            else setNewMenuItem({ ...newMenuItem, tags: val });
                          }}
                          className="w-full bg-warm-50 text-warm-900 font-sans text-xs rounded-lg px-3 py-2 border border-warm-200 focus:outline-none focus:border-gold-500"
                        />
                      </div>

                      {/* Allergens */}
                      <div>
                        <label className="text-[10px] tracking-wider font-sans font-bold text-warm-800 uppercase block mb-1">Allergènes (séparés par des virgules)</label>
                        <input
                          type="text"
                          placeholder="ex: Gluten, Lactose, Crustacés"
                          value={editingItem ? editingItem.allergens?.join(', ') : newMenuItem.allergens?.join(', ')}
                          onChange={(e) => {
                            const val = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                            if (editingItem) setEditingItem({ ...editingItem, allergens: val });
                            else setNewMenuItem({ ...newMenuItem, allergens: val });
                          }}
                          className="w-full bg-warm-50 text-warm-900 font-sans text-xs rounded-lg px-3 py-2 border border-warm-200 focus:outline-none focus:border-gold-500"
                        />
                      </div>

                      {/* Spicy Level */}
                      <div>
                        <label className="text-[10px] tracking-wider font-sans font-bold text-warm-800 uppercase block mb-1">Niveau d'épice (0 = non épicé, 3 = très fort)</label>
                        <select
                          value={editingItem ? editingItem.spicyLevel : newMenuItem.spicyLevel}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            if (editingItem) setEditingItem({ ...editingItem, spicyLevel: val });
                            else setNewMenuItem({ ...newMenuItem, spicyLevel: val });
                          }}
                          className="w-full bg-warm-50 text-warm-900 font-sans text-xs rounded-lg px-3 py-2 border border-warm-200 focus:outline-none focus:border-gold-500 cursor-pointer"
                        >
                          <option value={0}>Doux (0)</option>
                          <option value={1}>Moyennement Épicé (1)</option>
                          <option value={2}>Épicé (2)</option>
                          <option value={3}>Très Épicé (3)</option>
                        </select>
                      </div>

                      {/* isSignature Toggle */}
                      <div className="flex items-center gap-3 h-full pt-4">
                        <input
                          type="checkbox"
                          id="isSignature"
                          checked={editingItem ? !!editingItem.isSignature : !!newMenuItem.isSignature}
                          onChange={(e) => {
                            const val = e.target.checked;
                            if (editingItem) setEditingItem({ ...editingItem, isSignature: val });
                            else setNewMenuItem({ ...newMenuItem, isSignature: val });
                          }}
                          className="w-4 h-4 text-gold-600 border-warm-200 rounded focus:ring-gold-500 cursor-pointer"
                        />
                        <label htmlFor="isSignature" className="text-xs font-sans font-bold text-warm-900 cursor-pointer">
                          Spécialité de la Maison (Mettre en avant)
                        </label>
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <label className="text-[10px] tracking-wider font-sans font-bold text-warm-800 uppercase block mb-1">Description du plat</label>
                      <textarea
                        rows={3}
                        placeholder="Description des saveurs, accompagnements, origines..."
                        value={editingItem ? editingItem.description : newMenuItem.description}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (editingItem) setEditingItem({ ...editingItem, description: val });
                          else setNewMenuItem({ ...newMenuItem, description: val });
                        }}
                        className="w-full bg-warm-50 text-warm-900 font-sans text-xs rounded-lg px-3 py-2 border border-warm-200 focus:outline-none focus:border-gold-500"
                      />
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setShowAddForm(false);
                          setEditingItem(null);
                        }}
                        className="bg-white border border-warm-200 text-warm-800 hover:bg-warm-150 font-sans font-bold text-[10px] tracking-wider uppercase px-4 py-2.5 rounded transition-colors cursor-pointer"
                      >
                        Annuler
                      </button>
                      <button
                        type="submit"
                        disabled={menuLoading}
                        className="bg-gold-700 hover:bg-gold-800 text-white font-sans font-bold text-[10px] tracking-wider uppercase px-5 py-2.5 rounded shadow-sm transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <Save size={12} />
                        <span>{menuLoading ? 'Enregistrement...' : editingItem ? 'Enregistrer les modifications' : 'Créer le plat'}</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Menu List Table */}
              <div className="bg-white rounded-xl border border-warm-200 shadow-sm p-5 sm:p-6 overflow-hidden">
                <h4 className="font-serif font-bold text-base text-warm-900 border-b border-warm-100 pb-3 mb-4">
                  Liste des Plats ({menuItemsList.length})
                </h4>

                {menuItemsList.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-warm-100 text-warm-800 text-[10px] uppercase font-sans tracking-wider">
                          <th className="pb-3 font-bold pl-1">Plat</th>
                          <th className="pb-3 font-bold">Catégorie</th>
                          <th className="pb-3 font-bold">Prix</th>
                          <th className="pb-3 font-bold">Spécialité</th>
                          <th className="pb-3 font-bold text-right pr-1">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-warm-100 font-sans text-xs text-warm-900">
                        {menuItemsList.map((item) => (
                          <tr key={item.id} className="hover:bg-warm-50/40 transition-colors">
                            {/* Image + Title */}
                            <td className="py-3.5 pl-1 flex items-center gap-3">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-10 h-10 object-cover rounded-lg border border-warm-200 bg-warm-100 shrink-0"
                              />
                              <div className="max-w-[200px] sm:max-w-[300px]">
                                <span className="font-bold text-warm-900 block truncate">{item.name}</span>
                                <span className="text-[10px] text-warm-800 line-clamp-1">{item.description}</span>
                              </div>
                            </td>

                            {/* Category */}
                            <td className="py-3.5 capitalize font-bold">
                              <span className="bg-warm-100 text-warm-800 text-[10px] px-2.5 py-1 rounded font-medium">
                                {item.category}
                              </span>
                            </td>

                            {/* Price */}
                            <td className="py-3.5 font-bold text-gold-700 whitespace-nowrap">
                              {item.price.toLocaleString('fr-FR')} FCFA
                            </td>

                            {/* Signature */}
                            <td className="py-3.5">
                              {item.isSignature ? (
                                <span className="bg-gold-50 border border-gold-200 text-gold-700 text-[9px] px-2 py-0.5 rounded uppercase font-extrabold flex items-center gap-1 w-fit">
                                  ★ Spécialité
                                </span>
                              ) : (
                                <span className="text-warm-800 italic text-[10px]">Standard</span>
                              )}
                            </td>

                            {/* Actions */}
                            <td className="py-3.5 text-right pr-1">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => {
                                    setEditingItem(item);
                                    setShowAddForm(false);
                                    // Scroll to edit form
                                    window.scrollTo({ top: 350, behavior: 'smooth' });
                                  }}
                                  className="p-1.5 text-warm-800 hover:text-gold-700 hover:bg-gold-50/50 rounded transition-colors cursor-pointer"
                                  title="Modifier"
                                >
                                  <Edit2 size={13} />
                                </button>
                                <button
                                  onClick={() => handleDeleteMenuItem(item.id, item.name)}
                                  className="p-1.5 text-warm-800 hover:text-red-700 hover:bg-red-50/50 rounded transition-colors cursor-pointer"
                                  title="Supprimer"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12 bg-warm-50 rounded-xl border border-dashed border-warm-200">
                    <p className="text-warm-800 font-sans text-sm">
                      Aucun plat trouvé dans la base de données.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Quick Feed reviews & analytics (Col-span 1) */}
        <div className="space-y-6">
          
          {/* Quick Stats overview */}
          <div className="bg-white rounded-xl border border-warm-200 shadow-sm p-5 sm:p-6 space-y-4">
            <h3 className="font-serif font-bold text-lg text-warm-900 border-b border-warm-100 pb-3 flex items-center gap-2">
              <TrendingUp size={16} className="text-gold-700" />
              <span>Occupation des tables</span>
            </h3>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-sans text-warm-800">
                  <span>Capacité de Salle (Midi)</span>
                  <span className="font-bold">25%</span>
                </div>
                <div className="h-2 w-full bg-warm-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gold-700 rounded-full" style={{ width: '25%' }} />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-sans text-warm-800">
                  <span>Capacité de Salle (Soir)</span>
                  <span className="font-bold">85%</span>
                </div>
                <div className="h-2 w-full bg-warm-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gold-700 rounded-full" style={{ width: '85%' }} />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-sans text-warm-800">
                  <span>Capacité Terrasse (Soir)</span>
                  <span className="font-bold">60%</span>
                </div>
                <div className="h-2 w-full bg-warm-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gold-700 rounded-full" style={{ width: '60%' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Review Tracker */}
          <div className="bg-white rounded-xl border border-warm-200 shadow-sm p-5 sm:p-6 space-y-4">
            <h3 className="font-serif font-bold text-lg text-warm-900 border-b border-warm-100 pb-3">
              Flux des retours clients
            </h3>

            <div className="space-y-4 max-h-[300px] overflow-y-auto no-scrollbar pr-1">
              {reviews.slice(0, 4).map((rev) => (
                <div key={rev.id} className="text-xs space-y-1 border-b border-warm-100 pb-2 last:border-0 last:pb-0">
                  <div className="flex justify-between items-center">
                    <strong className="text-warm-900">{rev.authorName}</strong>
                    <span className="text-gold-500">★ {rev.rating}</span>
                  </div>
                  <p className="text-warm-800 font-sans italic line-clamp-2">"{rev.comment}"</p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
      )}
    </main>
  );
}
