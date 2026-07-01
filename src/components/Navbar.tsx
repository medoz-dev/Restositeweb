import { useState, useEffect } from 'react';
import { LOGO_URL } from '../data';
import { Menu, X } from 'lucide-react';

interface NavbarProps {
  onStaffClick: () => void;
  isStaffActive: boolean;
}

export default function Navbar({ onStaffClick, isStaffActive }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('accueil');

  // Handle scroll detection for sticky background & scroll-spy
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      // Scroll Spy logic (only for pages in viewport)
      const sections = ['accueil', 'menu', 'traiteur', 'galerie'];
      const scrollPosition = window.scrollY + 120;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Sync navbar active state with URL hash directly (essential for isolated pages like Contact)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#contact') {
        setActiveSection('contact');
      } else if (hash === '#accueil' || !hash) {
        setActiveSection('accueil');
      } else {
        const matched = ['accueil', 'menu', 'traiteur', 'galerie'].find(section => hash === `#${section}`);
        if (matched) {
          setActiveSection(matched);
        }
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navLinks = [
    { label: 'ACCUEIL', href: '#accueil', id: 'accueil' },
    { label: 'NOTRE MENU', href: '#menu', id: 'menu' },
    { label: 'SERVICE TRAITEUR', href: '#traiteur', id: 'traiteur' },
    { label: 'GALERIE', href: '#galerie', id: 'galerie' },
    { label: 'CONTACT', href: '#contact', id: 'contact' },
  ];

  return (
    <>
      <header
        id="navbar"
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 bg-white border-b border-warm-200 shadow-sm ${
          isScrolled || isStaffActive ? 'py-1 pb-2' : 'py-2 pb-3'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[75px] md:h-[90px]">
            {/* Logo */}
            <a href="#accueil" className="flex items-center focus:outline-none shrink-0 relative z-50" id="nav-logo">
              <img
                src={LOGO_URL}
                alt="Escale du Pont Logo"
                className="h-[60px] md:h-[80px] w-auto object-contain transition-all duration-300 drop-shadow-md translate-y-1"
              />
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6 lg:gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.href}
                  className={`font-sans font-semibold text-xs tracking-widest transition-all duration-200 hover:text-gold-600 relative py-1 ${
                    activeSection === link.id
                      ? 'text-gold-700 font-extrabold'
                      : 'text-warm-800'
                  }`}
                >
                  {link.label}
                  {activeSection === link.id && (
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gold-500 rounded-full animate-fade-in" />
                  )}
                </a>
              ))}
            </nav>

            {/* Phone & Reservation Button */}
            <div className="hidden lg:flex items-center gap-6">
              <button
                onClick={onStaffClick}
                className={`text-[10px] tracking-widest border px-2 py-1.5 rounded transition-all duration-200 ${
                  isStaffActive
                    ? 'bg-gold-700 text-white border-gold-700'
                    : 'border-warm-350 text-warm-800 hover:bg-warm-100'
                }`}
                id="btn-staff-panel"
              >
                {isStaffActive ? 'SITE PUBLIC' : 'STAFF AREA'}
              </button>
            </div>

            {/* Mobile elements (Menu toggle) */}
            <div className="flex lg:hidden items-center gap-3">
              <button
                onClick={onStaffClick}
                className={`text-[9px] tracking-widest border px-2 py-1 rounded transition-colors ${
                  isStaffActive
                    ? 'bg-gold-700 text-white border-gold-700'
                    : 'border-warm-300 text-warm-800'
                }`}
              >
                {isStaffActive ? 'PUBLIC' : 'STAFF'}
              </button>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-full focus:outline-none text-warm-900 hover:bg-warm-100"
                id="mobile-menu-toggle"
              >
                {isOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Dropdown Overlay */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px]" onClick={() => setIsOpen(false)}>
          <div
            className="fixed right-4 top-[85px] w-48 bg-white border-t-2 border-gold-500 border-x border-b border-warm-150 shadow-xl rounded-md p-3 flex flex-col gap-1"
            onClick={(e) => e.stopPropagation()}
            id="mobile-drawer"
          >
            <nav className="flex flex-col">
              {navLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`font-sans font-medium text-[10px] tracking-[0.2em] py-2.5 px-2 border-b border-warm-100 last:border-none block transition-all duration-150 ${
                    activeSection === link.id ? 'text-gold-700 bg-warm-50/50 font-bold' : 'text-warm-800 hover:text-gold-600'
                  }`}
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
