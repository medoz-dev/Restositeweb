import React, { useState, useEffect } from 'react';
import { Shield, KeyRound, Lock, ArrowLeft, Loader2, Sparkles, CheckCircle } from 'lucide-react';
import { getAdminConfigFromFirestore } from '../firebase';

interface AdminLoginProps {
  onLoginSuccess: () => void;
  onCancel: () => void;
}

export default function AdminLogin({ onLoginSuccess, onCancel }: AdminLoginProps) {
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [shaking, setShaking] = useState(false);
  const [adminPin, setAdminPin] = useState('2290'); // Default fallback

  // Load actual pin from Firestore on mount
  useEffect(() => {
    let active = true;
    getAdminConfigFromFirestore().then((config) => {
      if (active) {
        setAdminPin(config.passcode);
      }
    }).catch(err => console.error("Error fetching config:", err));
    return () => { active = false; };
  }, []);

  const handleKeyPress = (num: string) => {
    if (loading || success) return;
    setError(false);
    if (pin.length < 4) {
      const nextPin = pin + num;
      setPin(nextPin);
      
      // Auto-submit if 4 digits
      if (nextPin.length === 4) {
        verifyPin(nextPin);
      }
    }
  };

  const handleBackspace = () => {
    if (loading || success) return;
    setError(false);
    setPin(prev => prev.slice(0, -1));
  };

  const handleClear = () => {
    if (loading || success) return;
    setError(false);
    setPin('');
  };

  // Listen to physical keyboard press
  useEffect(() => {
    const handlePhysicalKey = (e: KeyboardEvent) => {
      if (loading || success) return;
      if (e.key >= '0' && e.key <= '9') {
        handleKeyPress(e.key);
      } else if (e.key === 'Backspace') {
        handleBackspace();
      } else if (e.key === 'Escape') {
        onCancel();
      }
    };
    window.addEventListener('keydown', handlePhysicalKey);
    return () => window.removeEventListener('keydown', handlePhysicalKey);
  }, [pin, loading, success, adminPin]);

  const verifyPin = async (enteredPin: string) => {
    setLoading(true);
    // Simulate high-security verification delay
    await new Promise(resolve => setTimeout(resolve, 600));

    if (enteredPin === adminPin) {
      setSuccess(true);
      setLoading(false);
      // Brief success animation
      setTimeout(() => {
        // Save session
        sessionStorage.setItem('olabissi_authenticated', 'true');
        onLoginSuccess();
      }, 500);
    } else {
      setLoading(false);
      setError(true);
      setShaking(true);
      setPin('');
      setTimeout(() => setShaking(false), 500);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center bg-radial from-neutral-900 to-black px-4 sm:px-6 py-12 relative overflow-hidden select-none animate-fade-in">
      
      {/* Background brand accents */}
      <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-gold-900/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40rem] h-[40rem] bg-gold-900/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Floating brand header */}
      <div className="absolute top-8 left-8 sm:left-12 z-20">
        <button
          onClick={onCancel}
          className="flex items-center gap-2 text-warm-300 hover:text-white text-xs font-sans font-bold tracking-widest uppercase py-2 transition-colors cursor-pointer"
        >
          <ArrowLeft size={14} className="text-gold-500" />
          <span>Retour au Site</span>
        </button>
      </div>

      {/* Center login card */}
      <div className="w-full max-w-md bg-neutral-900/80 backdrop-blur-md border border-warm-800 rounded-3xl p-8 sm:p-10 shadow-[0_0_50px_rgba(184,134,11,0.15)] flex flex-col items-center relative z-10 space-y-8">
        
        {/* Security Shield / Icon Header */}
        <div className="flex flex-col items-center text-center space-y-2.5">
          <div className={`p-4 rounded-2xl border ${
            success 
              ? 'bg-emerald-950/50 border-emerald-500 text-emerald-400' 
              : error 
              ? 'bg-red-950/50 border-red-500 text-red-400' 
              : 'bg-gold-950/40 border-gold-800 text-gold-500'
          } transition-colors duration-300 shadow-inner`}>
            {success ? (
              <CheckCircle size={32} className="animate-scale-up" />
            ) : (
              <Shield size={32} className={loading ? 'animate-pulse' : ''} />
            )}
          </div>
          
          <div className="space-y-1">
            <span className="font-sans font-bold text-[9px] sm:text-[10px] text-gold-500 tracking-[0.3em] uppercase block">
              CONSOLE D'ADMINISTRATION
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl text-white font-light tracking-tight">
              Escale du Pont <span className="font-serif italic text-gold-500">Restaurant</span>
            </h1>
          </div>
        </div>

        {/* PIN Entry Area */}
        <div className="w-full text-center space-y-4">
          <p className="text-xs text-warm-300 font-sans tracking-wide">
            Saisissez le code d'accès administrateur à 4 chiffres
          </p>

          {/* Dots Indicator */}
          <div className={`flex items-center justify-center gap-4 py-2.5 ${shaking ? 'animate-shake' : ''}`}>
            {[0, 1, 2, 3].map((index) => {
              const hasDigit = pin.length > index;
              return (
                <div
                  key={index}
                  className={`w-4 h-4 rounded-full border-2 transition-all duration-150 ${
                    hasDigit
                      ? 'bg-gold-500 border-gold-500 scale-110 shadow-[0_0_12px_rgba(212,175,55,0.6)]'
                      : error
                      ? 'border-red-500 bg-red-950/20'
                      : 'border-warm-700 bg-transparent'
                  }`}
                />
              );
            })}
          </div>

          {/* Feedback Label */}
          <div className="h-6">
            {error && (
              <span className="text-xs font-sans text-red-400 font-bold animate-fade-in">
                Code incorrect. Veuillez réessayer.
              </span>
            )}
            {success && (
              <span className="text-xs font-sans text-emerald-400 font-bold flex items-center justify-center gap-1.5 animate-fade-in">
                <Sparkles size={12} />
                Accès autorisé. Chargement de la console...
              </span>
            )}
            {loading && !success && (
              <span className="text-xs font-sans text-gold-500 flex items-center justify-center gap-2">
                <Loader2 size={12} className="animate-spin" />
                Vérification du code...
              </span>
            )}
          </div>
        </div>

        {/* Visual Keypad */}
        <div className="grid grid-cols-3 gap-x-4 gap-y-3.5 w-full max-w-[280px]">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
            <button
              key={num}
              onClick={() => handleKeyPress(num)}
              disabled={loading || success}
              className="h-14 rounded-full bg-neutral-800/40 hover:bg-neutral-800 border border-warm-800/50 hover:border-gold-500/50 text-white font-serif font-extrabold text-lg transition-all flex items-center justify-center focus:outline-none hover:scale-105 active:scale-95 cursor-pointer select-none"
            >
              {num}
            </button>
          ))}
          
          {/* Back/Clear button */}
          <button
            onClick={handleClear}
            disabled={loading || success}
            className="h-14 rounded-full bg-transparent hover:bg-neutral-800/20 text-warm-300 font-sans font-bold text-[10px] tracking-wider uppercase transition-colors flex items-center justify-center focus:outline-none cursor-pointer"
          >
            EFFACER
          </button>

          {/* 0 Key */}
          <button
            onClick={() => handleKeyPress('0')}
            disabled={loading || success}
            className="h-14 rounded-full bg-neutral-800/40 hover:bg-neutral-800 border border-warm-800/50 hover:border-gold-500/50 text-white font-serif font-extrabold text-lg transition-all flex items-center justify-center focus:outline-none hover:scale-105 active:scale-95 cursor-pointer select-none"
          >
            0
          </button>

          {/* Backspace Button */}
          <button
            onClick={handleBackspace}
            disabled={loading || success}
            className="h-14 rounded-full bg-transparent hover:bg-neutral-800/20 text-warm-300 font-sans font-bold text-[10px] tracking-wider uppercase transition-colors flex items-center justify-center focus:outline-none cursor-pointer"
          >
            RETOUR
          </button>
        </div>

        {/* Console footer */}
        <div className="text-center font-mono text-[9px] text-warm-500 tracking-wider">
          IP: LOCALHOST | SECURE ENGINE v2.1
        </div>

      </div>
    </div>
  );
}
