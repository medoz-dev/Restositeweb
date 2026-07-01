import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Menu from './components/Menu';
import Catering from './components/Catering';
import Gallery from './components/Gallery';
import Reviews from './components/Reviews';
import Contact from './components/Contact';
import StaffDashboard from './components/StaffDashboard';
import AdminLogin from './components/AdminLogin';
import { LOGO_URL } from './data';
import { Sparkles, ArrowUp } from 'lucide-react';

export default function App() {
  const [isStaffActive, setIsStaffActive] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => sessionStorage.getItem('olabissi_authenticated') === 'true');
  const [reservationTrigger, setReservationTrigger] = useState(0);
  const [activeExtraPage, setActiveExtraPage] = useState<'mentions' | 'confidentialite' | 'presse' | 'carrieres' | 'contact' | 'traiteur' | null>(null);

  // Trigger reactive data reload across components when booking is made
  const handleReservationAdded = () => {
    setReservationTrigger((prev) => prev + 1);
  };

  const handleStaffToggle = () => {
    setActiveExtraPage(null);
    setIsStaffActive((prev) => !prev);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const showScrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reset extra pages when navigating to page hashes, but handle #contact as a standalone page
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#contact') {
        setActiveExtraPage('contact');
        setIsStaffActive(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (hash === '#accueil' || hash === '#menu' || hash === '#traiteur' || hash === '#galerie') {
        setActiveExtraPage(null);
        setIsStaffActive(false);
      } else if (hash) {
        setActiveExtraPage(null);
        setIsStaffActive(false);
      }
    };
    
    // Check hash on mount to handle direct links (e.g. refresh on #contact)
    handleHashChange();

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-gold-500 selection:text-white bg-warm-50 text-warm-900 overflow-x-hidden">
      
      {/* Universal Header with Navigation & Staff Area Trigger */}
      <Navbar onStaffClick={handleStaffToggle} isStaffActive={isStaffActive} />

      {activeExtraPage ? (
        /* --- DEDICATED EXTRA PAGES (MENTIONS, CONFIDENTIALITÉ, PRESSE, CARRIÈRES, CONTACT) --- */
        <div className="pt-28 pb-20 bg-warm-50 min-h-[80vh] flex flex-col justify-start">
          <div className={`${(activeExtraPage === 'contact' || activeExtraPage === 'traiteur') ? 'max-w-7xl' : 'max-w-4xl'} mx-auto px-4 sm:px-6 lg:px-8 w-full`}>
            {/* Close / Back button */}
            {activeExtraPage !== 'contact' && (
              <button
                onClick={() => {
                  setActiveExtraPage(null);
                  window.location.hash = '#accueil';
                }}
                className="mb-8 flex items-center gap-2 font-sans font-bold text-xs tracking-wider uppercase text-gold-700 hover:text-gold-800 transition-colors cursor-pointer"
              >
                ← Retour au site principal
              </button>
            )}

            {activeExtraPage === 'contact' && (
              <Contact />
            )}

            {activeExtraPage === 'traiteur' && (
              <Catering isFullPage={true} />
            )}

            {activeExtraPage === 'mentions' && (
              <div className="bg-white rounded-2xl border border-warm-200 shadow-xl p-8 sm:p-12 space-y-8 animate-fade-in">
                <div className="border-b border-warm-200 pb-6">
                  <span className="font-sans font-bold text-[10px] text-gold-700 tracking-[0.3em] uppercase block mb-2">
                    TRANSPARENCE ET RÈGLEMENTS
                  </span>
                  <h1 className="font-title text-3xl sm:text-4xl lg:text-5xl font-semibold text-warm-900 tracking-[-0.5px] leading-tight">
                    Mentions Légales
                  </h1>
                </div>

                <div className="space-y-6 text-warm-800 font-sans text-sm sm:text-base leading-relaxed">
                  <section className="space-y-2">
                    <h2 className="font-serif font-bold text-lg text-warm-900">1. Édition du site</h2>
                    <p>
                      Le présent site internet est édité par la société <strong>Escale du Pont SARL</strong>, au capital de 10 000 €, immatriculée au Registre du Commerce et des Sociétés (RCS) de Saint-Quentin sous le numéro FR-829119333.
                    </p>
                    <p>
                      <strong>Siège social :</strong> 22 Rue des Beaux-Arts, 02100 Saint-Quentin, France.<br />
                      <strong>Numéro de téléphone :</strong> +33 3 23 62 10 20.<br />
                      <strong>Directeur de la publication :</strong> Chef Olabissi.
                    </p>
                  </section>

                  <section className="space-y-2">
                    <h2 className="font-serif font-bold text-lg text-warm-900">2. Hébergement</h2>
                    <p>
                      Le site est hébergé de manière sécurisée et performante par :<br />
                      <strong>Google Cloud Platform</strong>, Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irlande.
                    </p>
                  </section>

                  <section className="space-y-2">
                    <h2 className="font-serif font-bold text-lg text-warm-900">3. Propriété intellectuelle</h2>
                    <p>
                      L’ensemble des éléments constituant ce site internet (textes, graphismes, logos, marques, créations culinaires et recettes représentées) est protégé par la législation française et internationale relative au droit d'auteur et à la propriété intellectuelle.
                    </p>
                    <p>
                      Toute reproduction, représentation, modification, publication, adaptation de tout ou partie des éléments du site, quel que soit le moyen ou le procédé utilisé, est strictement interdite sans l'autorisation écrite préalable de la société Escale du Pont.
                    </p>
                  </section>

                  <section className="space-y-2">
                    <h2 className="font-serif font-bold text-lg text-warm-900">4. Contact et réclamations</h2>
                    <p>
                      Pour toute question relative à l’utilisation du site ou à nos services, notre équipe est à votre entière écoute à l’adresse électronique suivante : <a href="mailto:contact@escaledupont.fr" className="text-gold-700 underline font-bold">contact@escaledupont.fr</a>.
                    </p>
                  </section>
                </div>
              </div>
            )}

            {activeExtraPage === 'confidentialite' && (
              <div className="bg-white rounded-2xl border border-warm-200 shadow-xl p-8 sm:p-12 space-y-8 animate-fade-in">
                <div className="border-b border-warm-200 pb-6">
                  <span className="font-sans font-bold text-[10px] text-gold-700 tracking-[0.3em] uppercase block mb-2">
                    DONNÉES PERSONNELLES ET RGPD
                  </span>
                  <h1 className="font-title text-3xl sm:text-4xl lg:text-5xl font-semibold text-warm-900 tracking-[-0.5px] leading-tight">
                    Politique de Confidentialité
                  </h1>
                </div>

                <div className="space-y-6 text-warm-800 font-sans text-sm sm:text-base leading-relaxed">
                  <p>
                    Chez Escale du Pont, nous accordons une importance primordiale à la protection de la vie privée et des données personnelles de nos visiteurs. La présente politique détaille notre démarche de transparence.
                  </p>

                  <section className="space-y-2">
                    <h2 className="font-serif font-bold text-lg text-warm-900">1. Collecte des données</h2>
                    <p>
                      Pour traiter vos demandes de contact ou de renseignements, nous recueillons uniquement les données personnelles strictement nécessaires : Nom complet, Adresse e-mail, Numéro de téléphone portable, et l'objet de votre demande.
                    </p>
                  </section>

                  <section className="space-y-2">
                    <h2 className="font-serif font-bold text-lg text-warm-900">2. Utilisation de vos informations</h2>
                    <p>
                      Ces données sont exclusivement traitées pour :
                    </p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Répondre à vos messages et demandes d'information.</li>
                      <li>Vous contacter rapidement par e-mail ou SMS au sujet de votre demande.</li>
                      <li>Améliorer la qualité de notre accueil et de nos services.</li>
                    </ul>
                  </section>

                  <section className="space-y-2">
                    <h2 className="font-serif font-bold text-lg text-warm-900">3. Conservation et Partage</h2>
                    <p>
                      Vos données de contact sont conservées de manière sécurisée pour une durée maximale de 2 ans. Nous ne partageons, ne vendons et ne louons jamais vos données personnelles à des prestataires commerciaux tiers.
                    </p>
                  </section>

                  <section className="space-y-2">
                    <h2 className="font-serif font-bold text-lg text-warm-900">4. Vos droits (RGPD)</h2>
                    <p>
                      Conformément à la réglementation européenne sur le RGPD, vous disposez d'un droit permanent d’accès, de rectification, d’opposition et de suppression de vos informations personnelles. Vous pouvez exercer ce droit à tout moment par simple e-mail à l'adresse : <a href="mailto:dpo@escaledupont.fr" className="text-gold-700 underline font-bold">dpo@escaledupont.fr</a>.
                    </p>
                  </section>
                </div>
              </div>
            )}

            {activeExtraPage === 'presse' && (
              <div className="bg-white rounded-2xl border border-warm-200 shadow-xl p-8 sm:p-12 space-y-8 animate-fade-in">
                <div className="border-b border-warm-200 pb-6">
                  <span className="font-sans font-bold text-[10px] text-gold-700 tracking-[0.3em] uppercase block mb-2">
                    MÉDIAS & COLLABORATIONS
                  </span>
                  <h1 className="font-title text-3xl sm:text-4xl lg:text-5xl font-semibold text-warm-900 tracking-[-0.5px] leading-tight">
                    Presse & Partenariats
                  </h1>
                </div>

                <div className="space-y-6 text-warm-800 font-sans text-sm sm:text-base leading-relaxed">
                  <p>
                    Découvrez l’univers de Escale du Pont à travers nos revues de presse, nos reportages, et notre dossier d'actualités exclusif.
                  </p>

                  <div className="bg-gold-50/50 border border-gold-100 rounded-xl p-6 my-6 space-y-3">
                    <h3 className="font-serif font-bold text-warm-900 text-base">Télécharger notre Kit Média</h3>
                    <p className="text-xs sm:text-sm text-warm-800">
                      Notre kit presse contient notre histoire complète, les portraits du Chef Olabissi en haute définition, les photographies de nos plats emblématiques et la présentation détaillée de notre philosophie gastronomique.
                    </p>
                    <button
                      onClick={() => alert("Le téléchargement du kit média va démarrer.")}
                      className="bg-gold-700 hover:bg-gold-800 text-white font-sans font-bold text-xs tracking-wider px-5 py-2.5 rounded shadow transition-all duration-200 uppercase cursor-pointer"
                    >
                      Télécharger le Dossier de Presse (.ZIP)
                    </button>
                  </div>

                  <section className="space-y-2">
                    <h2 className="font-serif font-bold text-lg text-warm-900">Demandes de reportages & interviews</h2>
                    <p>
                      Pour toute demande de tournage, d'interview du Chef Olabissi, d'accréditation photo ou d'invitation média, veuillez contacter notre équipe :
                    </p>
                    <p className="bg-warm-50 p-4 rounded-lg border border-warm-200 font-mono text-sm space-y-1">
                      <strong>✉️ E-mail :</strong> presse@escaledupont.fr<br />
                      <strong>📞 Téléphone :</strong> +33 (0)3 23 62 10 20 (Service Presse)<br />
                      <strong>📍 Bureau :</strong> 22 Rue des Beaux-Arts, 02100 Saint-Quentin.
                    </p>
                  </section>

                  <section className="space-y-2">
                    <h2 className="font-serif font-bold text-lg text-warm-900">Partenariats de Sourcing</h2>
                    <p>
                      Nous bâtissons des partenariats durables basés sur la confiance avec nos fournisseurs maraîchers, vignerons et éleveurs. Si vous proposez des produits biologiques ou issus d'un terroir d'exception en harmonie avec notre cuisine métissée, écrivez-nous à <strong className="text-gold-700">sourcing@escaledupont.fr</strong>.
                    </p>
                  </section>
                </div>
              </div>
            )}

            {activeExtraPage === 'carrieres' && (
              <div className="bg-white rounded-2xl border border-warm-200 shadow-xl p-8 sm:p-12 space-y-8 animate-fade-in">
                <div className="border-b border-warm-200 pb-6">
                  <span className="font-sans font-bold text-[10px] text-gold-700 tracking-[0.3em] uppercase block mb-2">
                    REJOINDRE LA BRIGADE
                  </span>
                  <h1 className="font-title text-3xl sm:text-4xl lg:text-5xl font-semibold text-warm-900 tracking-[-0.5px] leading-tight">
                    Carrières & Recrutement
                  </h1>
                </div>

                <div className="space-y-6 text-warm-800 font-sans text-sm sm:text-base leading-relaxed">
                  <p>
                    Vous êtes passionné, exigeant et animé par la quête constante de la satisfaction client ? Rejoignez une équipe talentueuse, soudée et audacieuse, désireuse de réinventer l'art de recevoir.
                  </p>

                  <div className="space-y-4">
                    <h2 className="font-serif font-bold text-lg text-warm-900">Nos Opportunités Actuelles :</h2>
                    
                    <div className="grid gap-4">
                      <div className="border border-warm-200 rounded-xl p-5 hover:border-gold-500/50 transition-colors bg-warm-50/50">
                        <div className="flex justify-between items-start gap-4 flex-wrap">
                          <h3 className="font-serif font-bold text-warm-900 text-base">Chef de partie de Cuisine (H/F)</h3>
                          <span className="bg-gold-100 text-gold-800 text-[9px] tracking-wider font-sans font-extrabold px-2.5 py-1 rounded uppercase">CDI Plein Temps</span>
                        </div>
                        <p className="text-xs text-warm-800 mt-2">
                          Sous la responsabilité du Chef Olabissi, vous orchestrerez le dressage et les préparations chaudes/froides de votre poste de travail. Expérience exigée de 2 ans minimum dans un restaurant de niveau gastronomique.
                        </p>
                      </div>

                      <div className="border border-warm-200 rounded-xl p-5 hover:border-gold-500/50 transition-colors bg-warm-50/50">
                        <div className="flex justify-between items-start gap-4 flex-wrap">
                          <h3 className="font-serif font-bold text-warm-900 text-base">Chef de rang / Service en Salle (H/F)</h3>
                          <span className="bg-gold-100 text-gold-800 text-[9px] tracking-wider font-sans font-extrabold px-2.5 py-1 rounded uppercase">CDI Plein Temps</span>
                        </div>
                        <p className="text-xs text-warm-800 mt-2">
                          Garant de la qualité d’accueil, de service et de fidélisation de notre clientèle de connaisseurs. Excellente élocution, bilingue anglais de préférence.
                        </p>
                      </div>

                      <div className="border border-warm-200 rounded-xl p-5 hover:border-gold-500/50 transition-colors bg-warm-50/50">
                        <div className="flex justify-between items-start gap-4 flex-wrap">
                          <h3 className="font-serif font-bold text-warm-900 text-base">Apprenti Pâtissier (H/F)</h3>
                          <span className="bg-gold-100 text-gold-800 text-[9px] tracking-wider font-sans font-extrabold px-2.5 py-1 rounded uppercase">Contrat d'Apprentissage</span>
                        </div>
                        <p className="text-xs text-warm-800 mt-2">
                          Vous assisterez notre chef de partie pâtisserie dans l'élaboration de nos créations sucrées. Rigueur, curiosité et passion pour le détail exigées.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Form for candidates */}
                  <div className="bg-warm-50 rounded-2xl border border-warm-200 p-6 md:p-8 space-y-6 mt-8">
                    <div>
                      <h3 className="font-serif font-bold text-warm-900 text-lg">Candidature Spontanée</h3>
                      <p className="text-xs text-warm-800 mt-1">Envoyez-nous vos motivations en quelques lignes, notre secrétariat vous contactera sous 48h.</p>
                    </div>

                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        alert("Votre candidature a bien été transmise à notre chef de brigade. Merci pour votre intérêt !");
                        (e.target as HTMLFormElement).reset();
                      }}
                      className="space-y-4"
                    >
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] tracking-wider font-sans font-bold text-warm-800 uppercase block mb-1">Nom complet</label>
                          <input required type="text" placeholder="Jean Dupont" className="w-full bg-white text-warm-900 font-sans text-sm rounded-lg px-4 py-2.5 border border-warm-200 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500" />
                        </div>
                        <div>
                          <label className="text-[10px] tracking-wider font-sans font-bold text-warm-800 uppercase block mb-1">Adresse email</label>
                          <input required type="email" placeholder="jean.dupont@gmail.com" className="w-full bg-white text-warm-900 font-sans text-sm rounded-lg px-4 py-2.5 border border-warm-200 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500" />
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] tracking-wider font-sans font-bold text-warm-800 uppercase block mb-1">Poste convoité</label>
                        <select required className="w-full bg-white text-warm-900 font-sans text-sm rounded-lg px-4 py-2.5 border border-warm-200 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500">
                          <option value="chef_partie">Chef de partie de Cuisine</option>
                          <option value="chef_rang">Chef de rang / Service en Salle</option>
                          <option value="apprenti">Apprenti Pâtissier</option>
                          <option value="autre">Autre poste ou Candidature libre</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[10px] tracking-wider font-sans font-bold text-warm-800 uppercase block mb-1">Message & Présentation</label>
                        <textarea required rows={4} placeholder="Partagez-nous vos motivations ou votre parcours culinaire en quelques lignes..." className="w-full bg-white text-warm-900 font-sans text-sm rounded-lg px-4 py-2.5 border border-warm-200 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 resize-none"></textarea>
                      </div>

                      <button type="submit" className="w-full bg-gold-700 hover:bg-gold-800 text-white font-sans font-bold text-xs tracking-widest px-6 py-3.5 rounded-lg uppercase shadow transition-all duration-200 cursor-pointer">
                        Soumettre ma Candidature
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : isStaffActive ? (
        /* --- SECURE ADMIN STAFF VIEW WITH PIN PROTECTION --- */
        isAdminLoggedIn ? (
          <StaffDashboard
            onUpdate={handleReservationAdded}
            reservationTrigger={reservationTrigger}
            onLogout={() => {
              sessionStorage.removeItem('olabissi_authenticated');
              setIsAdminLoggedIn(false);
              setIsStaffActive(false);
            }}
          />
        ) : (
          <AdminLogin
            onLoginSuccess={() => setIsAdminLoggedIn(true)}
            onCancel={() => setIsStaffActive(false)}
          />
        )
      ) : (
        /* --- PUBLIC ELEGANT VISITOR VIEW --- */
        <div className="space-y-0">
          <Hero />
          <Menu />
          <Catering isFullPage={false} onOpenFullPage={() => { setActiveExtraPage('traiteur'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />
          <Gallery />
          <Reviews />
        </div>
      )}

      {/* --- BRANDED FOOTER --- */}
      <footer className="bg-noir-900 text-white border-t border-warm-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-12 border-b border-warm-800">
            {/* Logo and Pitch */}
            <div className="md:col-span-5 space-y-6 text-center md:text-left flex flex-col items-center md:items-start">
              <div className="bg-white p-4 rounded-xl inline-block max-w-[200px] shadow-lg">
                <img
                  src={LOGO_URL}
                  alt="Escale du Pont"
                  className="h-14 w-auto object-contain grayscale opacity-90 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                />
              </div>
              <p className="text-warm-300 text-sm max-w-sm leading-relaxed font-sans font-light">
                Une table d'exception dédiée à la valorisation et à la réinterprétation moderne du patrimoine culinaire du Bénin par le Chef Olabissi.
              </p>
              <div className="flex gap-4 text-xs font-semibold tracking-wider font-sans text-gold-500">
                <span>✦ Terroir Béninois</span>
                <span>✦ Excellence Culinaire</span>
              </div>
            </div>

            {/* Quick Links */}
            <div className="md:col-span-3 space-y-4 text-center md:text-left">
              <h4 className="font-serif font-bold text-base text-white tracking-wide">Plan du site</h4>
              <ul className="space-y-2.5 font-sans text-xs text-warm-300">
                <li><a href="#accueil" className="hover:text-gold-500 transition-colors">Accueil</a></li>
                <li><a href="#menu" className="hover:text-gold-500 transition-colors">Notre Menu d'exception</a></li>
                <li><a href="#galerie" className="hover:text-gold-500 transition-colors">Galerie Photo</a></li>
              </ul>
            </div>

            {/* Support and Legal Links */}
            <div className="md:col-span-4 space-y-4 text-center md:text-left">
              <h4 className="font-serif font-bold text-base text-white tracking-wide">Informations Légales</h4>
              <ul className="space-y-2.5 font-sans text-xs text-warm-300 flex flex-col items-center md:items-start">
                <li>
                  <button
                    onClick={() => { setActiveExtraPage('mentions'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className="hover:text-gold-500 transition-colors underline cursor-pointer"
                  >
                    Mentions Légales
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => { setActiveExtraPage('confidentialite'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className="hover:text-gold-500 transition-colors underline cursor-pointer"
                  >
                    Politique de Confidentialité
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => { setActiveExtraPage('presse'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className="hover:text-gold-500 transition-colors underline cursor-pointer"
                  >
                    Presse & Partenariats
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => { setActiveExtraPage('carrieres'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className="hover:text-gold-500 transition-colors underline cursor-pointer"
                  >
                    Carrières & Recrutement
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Copyright Block */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-sans text-warm-300">
            <p className="text-center sm:text-left">
              © {new Date().getFullYear()} Escale du Pont. Tous droits réservés.
            </p>
            <div className="flex items-center gap-1.5 text-[10px] tracking-wider uppercase font-bold text-gold-500">
              <Sparkles size={12} />
              <span>Cuisine d'exception par le Chef Olabissi</span>
            </div>
          </div>

        </div>
      </footer>

      {/* --- FLOATING UTILITY CONTROLS --- */}
      {!isStaffActive && (
        <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3 animate-fade-in">
          {/* Scroll to Top */}
          <button
            onClick={showScrollTop}
            className="bg-noir-900/90 hover:bg-noir-900 text-white p-3 rounded-full shadow-lg border border-white/10 hover:-translate-y-1 transition-all focus:outline-none cursor-pointer"
            title="Remonter en haut"
            id="btn-scroll-top"
          >
            <ArrowUp size={16} />
          </button>
        </div>
      )}

    </div>
  );
}
