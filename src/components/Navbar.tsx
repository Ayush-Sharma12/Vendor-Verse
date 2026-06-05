import { useState, useEffect, useRef } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useLang } from "@/context/LanguageContext";
import { useVendors } from "@/context/VendorContext";
import { Menu, X, Zap } from "lucide-react";

const NAV_LINKS = [
  { en: "Home", hi: "Home", href: "/" },
  { en: "Find Vendors", hi: "Vendor Dhundho", href: "/browse" },
  { en: "Add a Vendor", hi: "Vendor Add Karo", href: "/register" },
];

export default function Navbar() {
  const { lang, setLang, t } = useLang();
  const { vendors, newlyAddedId } = useVendors();

  const [open, setOpen] = useState(false);
  const [showLive, setShowLive] = useState(false);

  const location = useLocation();
  const prevCount = useRef(vendors.length);
  const liveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const triggerLiveBadge = () => {
    setShowLive(true);

    if (liveTimer.current) {
      clearTimeout(liveTimer.current);
    }

    liveTimer.current = setTimeout(() => {
      setShowLive(false);
    }, 8000);
  };

  // New vendor added from current session
  useEffect(() => {
    if (newlyAddedId) {
      triggerLiveBadge();
    }
  }, [newlyAddedId]);

  // Vendor count increased (polling / another user)
  useEffect(() => {
    if (vendors.length > prevCount.current) {
      triggerLiveBadge();
    }

    prevCount.current = vendors.length;
  }, [vendors.length]);

  // Cleanup timer
  useEffect(() => {
    return () => {
      if (liveTimer.current) {
        clearTimeout(liveTimer.current);
      }
    };
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-orange-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex flex-col leading-tight">
            <span className="text-xl font-bold text-[#F97316]">
              VendorVerse
            </span>
            <span className="hidden text-xs text-gray-500 sm:block">
              Har vendor ka apna address.
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.href}
                to={link.href}
                className={({ isActive }) =>
                  `relative text-sm font-semibold transition-colors ${
                    isActive
                      ? "text-[#F97316]"
                      : "text-[#1C1C1C] hover:text-[#F97316]"
                  }`
                }
              >
                {t(link.en, link.hi)}

                {link.href === "/browse" && showLive && (
                  <span className="absolute -top-2.5 -right-10 flex items-center gap-0.5 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full animate-pulse shadow-sm">
                    <Zap size={8} className="fill-white" />
                    LIVE
                  </span>
                )}
              </NavLink>
            ))}

            {/* Desktop Live Notification */}
            {showLive && (
              <div className="flex items-center gap-1.5 bg-red-50 border border-red-200 text-red-600 text-xs font-bold px-3 py-1.5 rounded-full animate-pulse">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
                {t("New vendor just added!", "Naya vendor add hua!")}
              </div>
            )}

            {/* CTA */}
            <Link
              to="/register"
              className="bg-[#F97316] text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-orange-600 transition-colors"
            >
              {t("Add Vendor — Free", "Vendor Add Karo — Free")}
            </Link>

            {/* Language Toggle */}
            <div className="flex items-center border-2 border-[#F97316] rounded-full overflow-hidden text-sm font-bold">
              <button
                onClick={() => setLang("EN")}
                className={`px-3 py-1 transition-colors ${
                  lang === "EN"
                    ? "bg-[#F97316] text-white"
                    : "bg-white text-[#F97316]"
                }`}
              >
                EN
              </button>

              <button
                onClick={() => setLang("HI")}
                className={`px-3 py-1 transition-colors ${
                  lang === "HI"
                    ? "bg-[#F97316] text-white"
                    : "bg-white text-[#F97316]"
                }`}
              >
                HI
              </button>
            </div>
          </div>

          {/* Mobile Actions */}
          <div className="flex md:hidden items-center gap-3">
            {showLive && (
              <span className="flex items-center gap-1 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full animate-pulse">
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
                LIVE
              </span>
            )}

            {/* Mobile Language Toggle */}
            <div className="flex items-center border-2 border-[#F97316] rounded-full overflow-hidden text-xs font-bold">
              <button
                onClick={() => setLang("EN")}
                className={`px-2 py-1 ${
                  lang === "EN"
                    ? "bg-[#F97316] text-white"
                    : "text-[#F97316]"
                }`}
              >
                EN
              </button>

              <button
                onClick={() => setLang("HI")}
                className={`px-2 py-1 ${
                  lang === "HI"
                    ? "bg-[#F97316] text-white"
                    : "text-[#F97316]"
                }`}
              >
                HI
              </button>
            </div>

            <button
              onClick={() => setOpen((prev) => !prev)}
              className="text-[#1C1C1C]"
              aria-label="Toggle Menu"
            >
              {open ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-orange-100 px-4 py-4 flex flex-col gap-4">
          {showLive && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm font-bold px-4 py-2 rounded-xl animate-pulse">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
              {t("New vendor just added!", "Naya vendor add hua!")}
            </div>
          )}

          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.href}
              to={link.href}
              className={({ isActive }) =>
                `text-base font-semibold ${
                  isActive ? "text-[#F97316]" : "text-[#1C1C1C]"
                }`
              }
            >
              {t(link.en, link.hi)}
            </NavLink>
          ))}

          <Link
            to="/register"
            className="bg-[#F97316] text-white px-4 py-3 rounded-xl text-base font-bold text-center"
          >
            {t("Add Vendor — Free", "Vendor Add Karo — Free")}
          </Link>
        </div>
      )}
    </nav>
  );
}
