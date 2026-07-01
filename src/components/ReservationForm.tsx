import React, { useState } from 'react';
import { Reservation } from '../types';
import { addReservationToFirestore } from '../firebase';
import { CalendarDays, Clock, Users, Phone, User, Mail, Compass, ClipboardList, CheckCircle2, QrCode } from 'lucide-react';

interface ReservationFormProps {
  onReservationAdded: () => void;
}

export default function ReservationForm({ onReservationAdded }: ReservationFormProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    date: '',
    time: '19:30',
    guestsCount: 2,
    tablePreference: 'sans_preference' as 'sans_preference' | 'terrasse' | 'salle_principale' | 'fenetre',
    specialRequest: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [confirmedReservation, setConfirmedReservation] = useState<Reservation | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const timeOptions = [
    '12:00', '12:30', '13:00', '13:30', '14:00',
    '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00'
  ];

  const guestOptions = [
    { label: '1 Personne', value: 1 },
    { label: '2 Personnes', value: 2 },
    { label: '3 Personnes', value: 3 },
    { label: '4 Personnes', value: 4 },
    { label: '5 Personnes', value: 5 },
    { label: '6 Personnes', value: 6 },
    { label: '7+ Personnes (Groupe)', value: 8 },
  ];

  const tablePreferences = [
    { label: 'Sans préférence particulière', value: 'sans_preference' },
    { label: 'En Terrasse extérieure', value: 'terrasse' },
    { label: 'Dans la Salle Principale', value: 'salle_principale' },
    { label: 'Près d’une Fenêtre', value: 'fenetre' },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'guestsCount' ? parseInt(value) || 2 : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Basic Validations
    if (!formData.fullName.trim()) return setErrorMessage('Veuillez saisir votre nom complet.');
    if (!formData.email.trim()) return setErrorMessage('Veuillez saisir votre adresse email.');
    if (!formData.phone.trim()) return setErrorMessage('Veuillez saisir votre numéro de téléphone.');
    if (!formData.date) return setErrorMessage('Veuillez choisir une date pour votre venue.');

    setIsLoading(true);

    const reservationData = {
      date: formData.date,
      time: formData.time,
      guestsCount: formData.guestsCount,
      phone: formData.phone,
      fullName: formData.fullName,
      email: formData.email,
      tablePreference: formData.tablePreference,
      specialRequest: formData.specialRequest,
      status: 'en_attente' as const,
      createdAt: new Date().toISOString(),
    };

    addReservationToFirestore(reservationData)
      .then((savedReservation) => {
        setConfirmedReservation(savedReservation);
        setIsLoading(false);
        onReservationAdded();
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          date: '',
          time: '19:30',
          guestsCount: 2,
          tablePreference: 'sans_preference',
          specialRequest: '',
        });
      })
      .catch((error) => {
        console.error('Error saving reservation to Firestore:', error);
        setErrorMessage('Une erreur est survenue lors de l\'enregistrement de votre réservation. Veuillez réessayer.');
        setIsLoading(false);
      });
  };

  const resetConfirmation = () => {
    setConfirmedReservation(null);
  };

  return (
    <section id="reservations" className="py-24 bg-warm-50 border-b border-warm-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Reservation Engine Layout */}
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-10 lg:p-12 border border-warm-200 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold-100/40 rounded-full blur-3xl -mr-32 -mt-32" />

          {confirmedReservation ? (
            /* --- CONFIRMATION SCREEN --- */
            <div className="relative z-10 text-center space-y-8 animate-fade-in" id="reservation-success">
              <div className="flex justify-center">
                <div className="bg-gold-50 p-4 rounded-full text-gold-700 shadow-inner border border-gold-100">
                  <CheckCircle2 size={56} className="animate-pulse" />
                </div>
              </div>

              <div className="space-y-2">
                <span className="font-sans font-extrabold text-xs text-gold-700 tracking-[0.2em] uppercase">
                  CONFIRMATION DE RÉSERVATION
                </span>
                <h3 className="text-2xl sm:text-3xl font-serif text-warm-900 font-extrabold">
                  Votre table vous attend !
                </h3>
                <p className="text-warm-800 text-sm max-w-lg mx-auto leading-relaxed">
                  Merci <strong>{confirmedReservation.fullName}</strong>, votre demande de réservation a bien été enregistrée sous le code d'accès :
                </p>
                <div className="inline-block bg-warm-100 text-warm-900 border border-warm-200 font-mono text-lg font-bold px-4 py-1.5 rounded-md tracking-wider mt-2 select-all">
                  {confirmedReservation.id}
                </div>
              </div>

              {/* Booking Summary Box */}
              <div className="bg-warm-50 rounded-xl p-6 border border-warm-200 text-left max-w-md mx-auto space-y-4 shadow-sm text-sm">
                <h4 className="font-serif font-bold text-warm-900 border-b border-warm-200 pb-2">Récapitulatif :</h4>
                <div className="grid grid-cols-2 gap-y-3">
                  <div className="text-warm-800 font-sans flex items-center gap-2">
                    <CalendarDays size={14} className="text-gold-700" />
                    <span>Date :</span>
                  </div>
                  <div className="text-warm-900 font-bold font-sans">
                    {new Date(confirmedReservation.date).toLocaleDateString('fr-FR', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </div>

                  <div className="text-warm-800 font-sans flex items-center gap-2">
                    <Clock size={14} className="text-gold-700" />
                    <span>Heure :</span>
                  </div>
                  <div className="text-warm-900 font-bold font-sans">{confirmedReservation.time}</div>

                  <div className="text-warm-800 font-sans flex items-center gap-2">
                    <Users size={14} className="text-gold-700" />
                    <span>Convives :</span>
                  </div>
                  <div className="text-warm-900 font-bold font-sans">
                    {confirmedReservation.guestsCount} {confirmedReservation.guestsCount > 1 ? 'personnes' : 'personne'}
                  </div>

                  <div className="text-warm-800 font-sans flex items-center gap-2">
                    <Compass size={14} className="text-gold-700" />
                    <span>Préférence :</span>
                  </div>
                  <div className="text-warm-900 font-bold font-sans capitalize">
                    {confirmedReservation.tablePreference === 'sans_preference' && 'Sans préférence'}
                    {confirmedReservation.tablePreference === 'terrasse' && 'En terrasse'}
                    {confirmedReservation.tablePreference === 'salle_principale' && 'Salle principale'}
                    {confirmedReservation.tablePreference === 'fenetre' && 'Près de la fenêtre'}
                  </div>
                </div>

                {confirmedReservation.specialRequest && (
                  <div className="pt-2 border-t border-warm-200">
                    <span className="font-bold text-warm-900">Demande spéciale :</span>
                    <p className="text-warm-800 italic mt-1 font-sans">"{confirmedReservation.specialRequest}"</p>
                  </div>
                )}
              </div>

              {/* QR Code section */}
              <div className="bg-white p-4 rounded-xl border border-warm-200 inline-flex flex-col items-center gap-2 shadow-inner">
                <div className="text-gold-700">
                  <QrCode size={120} strokeWidth={1.5} />
                </div>
                <span className="text-[10px] font-sans font-bold text-warm-800 tracking-wider uppercase">
                  QR Code d'accueil
                </span>
              </div>

              <div className="text-xs text-warm-800 space-y-1">
                <p>📍 Un e-mail de confirmation contenant votre coupon a été expédié à <em className="underline">{confirmedReservation.email}</em>.</p>
                <p className="text-gold-700 font-semibold font-serif italic">Notre service commercial vous contactera sous peu si nécessaire.</p>
              </div>

              <div className="pt-4 flex justify-center gap-4">
                <button
                  onClick={resetConfirmation}
                  className="bg-gold-700 hover:bg-gold-800 text-white font-sans font-bold text-xs tracking-widest px-6 py-3.5 rounded-lg uppercase shadow"
                >
                  Faire une autre réservation
                </button>
                <a
                  href="#accueil"
                  className="bg-warm-100 hover:bg-warm-200 text-warm-900 font-sans font-bold text-xs tracking-widest px-6 py-3.5 rounded-lg uppercase border border-warm-200"
                >
                  Retour à l'accueil
                </a>
              </div>
            </div>
          ) : (
            /* --- FORM SCREEN --- */
            <div className="relative z-10" id="reservation-form">
              <div className="text-center mb-10">
                <span className="font-sans font-bold text-[10px] md:text-xs text-gold-700 tracking-[0.3em] uppercase mb-2 block">
                  EXPÉRIENCE PRIVÉE
                </span>
                <h2 className="text-4xl sm:text-5xl font-serif text-warm-900 font-light tracking-tight mb-4">
                  Réservez <span className="font-serif italic text-gold-700">votre Table</span>
                </h2>
                <div className="flex items-center justify-center gap-1.5 mb-6">
                  <span className="h-[1px] w-12 bg-gold-500/50 block" />
                  <span className="text-[10px] text-gold-500">✦</span>
                  <span className="h-[1px] w-12 bg-gold-500/50 block" />
                </div>
                <p className="text-warm-800 font-sans text-sm max-w-md mx-auto">
                  Vivez un voyage culinaire suspendu au cœur de notre restaurant. Réservation vivement recommandée.
                </p>
              </div>

              {errorMessage && (
                <div className="bg-red-50 text-red-700 border border-red-200 rounded-lg p-4 text-sm font-sans mb-6">
                  ⚠️ {errorMessage}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Section 1: Qui réserve? */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-sans font-bold text-warm-900 tracking-wider uppercase block flex items-center gap-2">
                      <User size={12} className="text-gold-700" />
                      <span>Nom complet *</span>
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      placeholder="M. ou Mme Martin"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                      className="w-full bg-warm-50 text-warm-900 placeholder-warm-800 font-sans text-sm border border-warm-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-colors"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-sans font-bold text-warm-900 tracking-wider uppercase block flex items-center gap-2">
                      <Mail size={12} className="text-gold-700" />
                      <span>Email *</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      placeholder="martin@domain.fr"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full bg-warm-50 text-warm-900 placeholder-warm-800 font-sans text-sm border border-warm-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-colors"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-sans font-bold text-warm-900 tracking-wider uppercase block flex items-center gap-2">
                      <Phone size={12} className="text-gold-700" />
                      <span>Téléphone *</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="+33 6 00 00 00 00"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full bg-warm-50 text-warm-900 placeholder-warm-800 font-sans text-sm border border-warm-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-colors"
                    />
                  </div>
                </div>

                {/* Section 2: Quand et Combien? */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-sans font-bold text-warm-900 tracking-wider uppercase block flex items-center gap-2">
                      <CalendarDays size={12} className="text-gold-700" />
                      <span>Date *</span>
                    </label>
                    <input
                      type="date"
                      name="date"
                      min={new Date().toISOString().split('T')[0]}
                      value={formData.date}
                      onChange={handleChange}
                      required
                      className="w-full bg-warm-50 text-warm-900 placeholder-warm-800 font-sans text-sm border border-warm-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-colors cursor-pointer"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-sans font-bold text-warm-900 tracking-wider uppercase block flex items-center gap-2">
                      <Clock size={12} className="text-gold-700" />
                      <span>Heure *</span>
                    </label>
                    <div className="relative">
                      <select
                        name="time"
                        value={formData.time}
                        onChange={handleChange}
                        className="w-full bg-warm-50 text-warm-900 font-sans text-sm border border-warm-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-colors appearance-none cursor-pointer"
                      >
                        {timeOptions.map((time) => (
                          <option key={time} value={time}>
                            {time}
                          </option>
                        ))}
                      </select>
                      <Clock size={12} className="absolute right-4 top-4 text-warm-800 pointer-events-none" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-sans font-bold text-warm-900 tracking-wider uppercase block flex items-center gap-2">
                      <Users size={12} className="text-gold-700" />
                      <span>Nombre d'invités *</span>
                    </label>
                    <div className="relative">
                      <select
                        name="guestsCount"
                        value={formData.guestsCount}
                        onChange={handleChange}
                        className="w-full bg-warm-50 text-warm-900 font-sans text-sm border border-warm-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-colors appearance-none cursor-pointer"
                      >
                        {guestOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                      <Users size={12} className="absolute right-4 top-4 text-warm-800 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Section 3: Préférences de Table & Notes */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-1 space-y-2">
                    <label className="text-xs font-sans font-bold text-warm-900 tracking-wider uppercase block flex items-center gap-2">
                      <Compass size={12} className="text-gold-700" />
                      <span>Choix de l'emplacement</span>
                    </label>
                    <div className="relative">
                      <select
                        name="tablePreference"
                        value={formData.tablePreference}
                        onChange={handleChange}
                        className="w-full bg-warm-50 text-warm-900 font-sans text-sm border border-warm-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-colors appearance-none cursor-pointer"
                      >
                        {tablePreferences.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                      <Compass size={12} className="absolute right-4 top-4 text-warm-800 pointer-events-none" />
                    </div>
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <label className="text-xs font-sans font-bold text-warm-900 tracking-wider uppercase block flex items-center gap-2">
                      <ClipboardList size={12} className="text-gold-700" />
                      <span>Allergies ou demandes particulières</span>
                    </label>
                    <input
                      type="text"
                      name="specialRequest"
                      placeholder="Ex: Allergie au gluten, anniversaire, chaise haute bébé..."
                      value={formData.specialRequest}
                      onChange={handleChange}
                      className="w-full bg-warm-50 text-warm-900 placeholder-warm-800 font-sans text-sm border border-warm-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-colors"
                    />
                  </div>
                </div>

                {/* Submit button */}
                <div className="pt-6">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gold-500 hover:bg-gold-600 disabled:bg-gold-500/50 text-white font-sans font-bold text-sm tracking-widest py-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 uppercase flex items-center justify-center gap-3 cursor-pointer"
                    id="btn-confirm-booking"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Transmission de la demande...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 size={16} />
                        <span>Confirmer la réservation</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>
      </div>
    </section>
  );
}
