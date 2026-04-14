import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLang } from '@/context/LanguageContext';
import { useVendors } from '@/context/VendorContext';
import { Menu, X, Zap } from 'lucide-react';

export default function Navbar() {
  const { lang, setLang, t } = useLang();
  const { vendors, newlyAddedId } = useVendors();
  const [open, setOpen] = useState(false);
  const [showLive, setShowLive] = useState(false);
  const prevCount = useRef<number>(vendors.length);
  const liveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const location = useLocation();

  // Show "LIVE" badge for 8 seconds whenever a new vendor is added
  useEffect(() => {
    if (newlyAddedId) {
      setShowLive(true);
      if (liveTimer.current) clearTimeout(liveTimer.current);
      liveTimer.current = setTimeout(() => setShowLive(false), 8000);
    }
  }, [newlyAddedId]);

  // Also catch vendor count increases from polling (other users registering)
  useEffect(() => {
    if (vendors.length > prevCount.current) {
      setShowLive(true);
      if (liveTimer.current) clearTimeout(liveTimer.current);
      liveTimer.current = setTimeout(() => setShowLive(false), 8000);
    }
    prevCount.current = vendors.length;
  }, [vendors.length]);

  const navLinks = [
    { en: 'Home', hi: 'Home', href: '/' },
    { en: 'Find Vendors', hi: 'Vendor Dhundho', href: '/browse' },
    { en: 'Add a Vendor', hi: 'Vendor Add Karo', href: '/register' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-orange-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex flex-col leading-tight">
            <span className="text-xl font-bold text-[#F97316]" style={{ fontFamily: 'Nunito, sans-serif' }}>VendorVerse</span>
            <span className="text-xs text-gray-500 hidden sm:block">Har vendor ka apna address.</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map(link => (
              <Link
                key={link.href}
                to={link.href}
                className={`text-sm font-semibold transition-colors relative ${location.pathname === link.href ? 'text-[#F97316]' : 'text-[#1C1C1C] hover:text-[#F97316]'}`}
              >
                {t(link.en, link.hi)}
                {/* Live badge on "Find Vendors" link */}
                {link.href === '/browse' && showLive && (
                  <span className="absolute -top-2.5 -right-10 flex items-center gap-0.5 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full animate-pulse shadow-sm">
                    <Zap size={8} className="fill-white" />
                    LIVE
                  </span>
                )}
              </Link>
            ))}

            {/* Live badge standalone pill (also shows next to CTA) */}
            {showLive && (
              <span className="flex items-center gap-1.5 bg-red-50 border border-red-200 text-red-600 text-xs font-bold px-3 py-1.5 rounded-full animate-pulse">
                <span className="w-2 h-2 bg-red-500 rounded-full inline-block animate-ping" />
                {t('New vendor just added!', 'Naya vendor add hua!')}
              </span>
            )}

            <Link
              to="/register"
              className="bg-[#F97316] text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-orange-600 transition-colors"
            >
              {t('Add Vendor — Free', 'Vendor Add Karo — Free')}
            </Link>

            {/* Language toggle */}
            <div className="flex items-center border-2 border-[#F97316] rounded-full overflow-hidden text-sm font-bold">
              <button
                onClick={() => setLang('EN')}
                className={`px-3 py-1 transition-colors ${lang === 'EN' ? 'bg-[#F97316] text-white' : 'text-[#F97316] bg-white'}`}
              >EN</button>
              <button
                onClick={() => setLang('HI')}
                className={`px-3 py-1 transition-colors ${lang === 'HI' ? 'bg-[#F97316] text-white' : 'text-[#F97316] bg-white'}`}
              >HI</button>
            </div>
          </div>

          {/* Mobile: live dot + lang toggle + hamburger */}
          <div className="flex md:hidden items-center gap-3">
            {showLive && (
              <span className="flex items-center gap-1 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full animate-pulse">
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping inline-block" />
                LIVE
              </span>
            )}
            <div className="flex items-center border-2 border-[#F97316] rounded-full overflow-hidden text-xs font-bold">
              <button onClick={() => setLang('EN')} className={`px-2 py-1 ${lang === 'EN' ? 'bg-[#F97316] text-white' : 'text-[#F97316]'}`}>EN</button>
              <button onClick={() => setLang('HI')} className={`px-2 py-1 ${lang === 'HI' ? 'bg-[#F97316] text-white' : 'text-[#F97316]'}`}>HI</button>
            </div>
            <button onClick={() => setOpen(!open)} className="text-[#1C1C1C]">
              {open ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-orange-100 px-4 py-4 flex flex-col gap-4">
          {showLive && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm font-bold px-4 py-2 rounded-xl animate-pulse">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-ping inline-block" />
              {t('New vendor just added!', 'Naya vendor add hua!')}
            </div>
          )}
          {navLinks.map(link => (
            <Link
              key={link.href}
              to={link.href}
              onClick={() => setOpen(false)}
              className={`text-base font-semibold ${location.pathname === link.href ? 'text-[#F97316]' : 'text-[#1C1C1C]'}`}
            >
              {t(link.en, link.hi)}
            </Link>
          ))}
          <Link
            to="/register"
            onClick={() => setOpen(false)}
            className="bg-[#F97316] text-white px-4 py-3 rounded-xl text-base font-bold text-center"
          >
            {t('Add Vendor — Free', 'Vendor Add Karo — Free')}
          </Link>
        </div>
      )}
    </nav>
  );
}
