import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useLang } from '@/context/LanguageContext';
import { useVendors } from '@/context/VendorContext';
import { isOpenNow } from '@/lib/isOpenNow';
import { Star, MapPin, Sparkles, Search, X as XIcon } from 'lucide-react';

function timeAgo(ts: string, lang: string): string {
  const diff = Date.now() - new Date(ts).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (lang === 'HI') {
    if (mins < 2) return 'Abhi abhi aaya';
    if (mins < 60) return `${mins} minute pehle`;
    if (hours < 24) return `${hours} ghante pehle`;
    if (days === 1) return 'Kal add kiya';
    return `${days} din pehle`;
  }
  if (mins < 2) return 'Just now';
  if (mins < 60) return `${mins} minutes ago`;
  if (hours < 24) return `${hours} hours ago`;
  if (days === 1) return 'Yesterday';
  return `${days} days ago`;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="text-yellow-400">
      {'★'.repeat(Math.floor(rating))}{'☆'.repeat(5 - Math.floor(rating))}
    </span>
  );
}

function OpenPill({ hours, t }: { hours: string; t: (en: string, hi: string) => string }) {
  const openNow = isOpenNow(hours);
  return (
    <span
      className={`text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 ${
        openNow ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full inline-block ${openNow ? 'bg-green-500 animate-pulse' : 'bg-red-400'}`} />
      {openNow ? t('Open Now', 'Abhi Khula Hai') : t('Closed', 'Band Hai')}
    </span>
  );
}

const CATEGORIES_EN = ['All', 'Chai & Snacks', 'Sabzi & Fruits', 'Street Food', 'Paan & More'];
const CATEGORIES_HI = ['Sabhi', 'Chai & Snacks', 'Sabzi & Fruits', 'Street Food', 'Paan & More'];
const CATEGORY_MAP: Record<string, string> = {
  'Sabhi': 'All',
  'Chai & Snacks': 'Chai & Snacks',
  'Sabzi & Fruits': 'Sabzi & Fruits',
  'Street Food': 'Street Food',
  'Paan & More': 'Paan & More',
};

const RANK_BADGES = [
  { bg: 'bg-yellow-400', text: 'text-yellow-900', label: '🥇' },
  { bg: 'bg-gray-300', text: 'text-gray-800', label: '🥈' },
  { bg: 'bg-orange-300', text: 'text-orange-900', label: '🥉' },
];

export default function BrowsePage() {
  const { lang, t } = useLang();
  const { vendors, newlyAddedId } = useVendors();
  const [selectedCat, setSelectedCat] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [flashId, setFlashId] = useState<string | null>(null);
  const prevNewlyAdded = useRef<string | null>(null);

  // The most recently registered vendor (by timestamp)
  const latestVendor = vendors.length > 0
    ? [...vendors].sort((a, b) => new Date(b.submission_timestamp).getTime() - new Date(a.submission_timestamp).getTime())[0]
    : null;

  useEffect(() => {
    if (newlyAddedId && newlyAddedId !== prevNewlyAdded.current) {
      prevNewlyAdded.current = newlyAddedId;
      setFlashId(newlyAddedId);
      setTimeout(() => setFlashId(null), 2500);
    }
  }, [newlyAddedId]);

  const topRated = [...vendors].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 3);
  const newlyAdded = [...vendors].sort((a, b) => new Date(b.submission_timestamp).getTime() - new Date(a.submission_timestamp).getTime()).slice(0, 3);

  const categories = lang === 'HI' ? CATEGORIES_HI : CATEGORIES_EN;
  const normalizedCat = CATEGORY_MAP[selectedCat] || selectedCat;

  const filteredVendors = vendors
    .filter(v => normalizedCat === 'All' || v.category === normalizedCat || v.category === selectedCat)
    .filter(v => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        v.vendor_name.toLowerCase().includes(q) ||
        v.what_they_sell.toLowerCase().includes(q) ||
        v.location.toLowerCase().includes(q) ||
        v.category.toLowerCase().includes(q)
      );
    });

  return (
    <div className="text-[#1C1C1C]">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-[#FFF7ED] py-12 px-4 text-center"
      >
        <h1 className="text-3xl md:text-5xl font-bold mb-3">
          {t('Find vendors near you', 'Apne aas-paas ke vendors dhundho')}
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-8">
          {t(
            'Discover local vendors in Greater Noida — rated, reviewed, and ready to find.',
            'Greater Noida ke local vendors dhundho — rated, reviewed, aur milne ke liye ready.'
          )}
        </p>
        {/* ── Search bar ── */}
        <motion.div whileFocus={{ scale: 1.01 }} className="max-w-xl mx-auto relative">
          <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={t('Search by name, item, or location…', 'Naam, item, ya jagah se dhundho…')}
            className="w-full pl-12 pr-12 py-4 rounded-2xl border-2 border-orange-200 focus:border-[#F97316] focus:outline-none text-base shadow-sm bg-white transition-colors"
          />
          <AnimatePresence>
            {searchQuery && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Clear search"
              >
                <XIcon size={18} />
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>
        {/* Live search result count */}
        <AnimatePresence>
          {searchQuery.trim() && (
            <motion.p
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-3 text-sm text-gray-500"
            >
              {filteredVendors.length === 0
                ? t('No vendors found. Try a different search.', 'Koi vendor nahi mila. Kuch aur try karo.')
                : t(`${filteredVendors.length} vendor${filteredVendors.length !== 1 ? 's' : ''} found`, `${filteredVendors.length} vendor mila`)}
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ── Highest Rated ── */}
      {!searchQuery.trim() && <section className="bg-[#FFFBEB] py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="flex items-center gap-3 mb-2">
            <Star size={32} className="text-yellow-500 fill-yellow-400" />
            <h2 className="text-2xl md:text-3xl font-bold">{t('Highest Rated Vendors', 'Sabse Zyada Rated Vendors')}</h2>
          </motion.div>
          <p className="text-gray-500 mb-8">
            {t('Top vendors loved most by customers — sorted by star rating.', 'Woh vendors jinhe customers sabse zyada pasand karte hain.')}
          </p>
          <div className="flex gap-5 overflow-x-auto pb-4 snap-x">
            {topRated.map((v, i) => (
              <motion.div
                key={v.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -6, boxShadow: '0 16px 40px rgba(249,115,22,0.15)' }}
                className="min-w-[280px] snap-start bg-white rounded-2xl shadow-md p-6 flex flex-col gap-3 border border-yellow-100"
              >
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{RANK_BADGES[i]?.label}</span>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${i === 0 ? 'bg-yellow-100 text-yellow-700' : i === 1 ? 'bg-gray-100 text-gray-600' : 'bg-orange-100 text-orange-700'}`}>
                    {t('Top Rated', 'Sabse Accha')}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <motion.div whileHover={{ scale: 1.1 }} className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0" style={{ backgroundColor: v.color || '#F97316' }}>
                    {v.initials || v.vendor_name.slice(0, 2).toUpperCase()}
                  </motion.div>
                  <div className="font-bold text-lg leading-tight">{v.vendor_name}</div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="bg-orange-100 text-[#F97316] text-xs font-semibold px-2 py-0.5 rounded-full w-fit">{v.category}</span>
                  <OpenPill hours={v.hours} t={t} />
                </div>
                <div className="flex items-center gap-2">
                  <StarRating rating={v.rating || 0} />
                  <span className="font-bold">{v.rating}</span>
                  <span className="text-gray-500 text-sm">· {v.reviews} {t('reviews', 'reviews')}</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <MapPin size={14} className="text-[#F97316]" />
                  {v.location.split(',')[0]}
                </div>
                <div className="bg-[#FFF7ED] rounded-xl px-3 py-2 text-xs text-gray-600 space-y-1">
                  {v.what_they_sell && <div className="truncate">🛒 {v.what_they_sell}</div>}
                  {v.hours && <div>🕐 {v.hours}</div>}
                </div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                  <Link to={v.profile_url || `/vendor/${v.id}`} className="mt-auto bg-[#F97316] text-white text-center py-2.5 rounded-xl font-bold text-sm hover:bg-orange-600 transition-colors block">
                    {t('See Full Profile →', 'Poori Detail Dekho →')}
                  </Link>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>}

      {/* ── Newly Added ── */}
      {!searchQuery.trim() && <section className="bg-[#F0FDF4] py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="flex items-center gap-3 mb-2">
            <Sparkles size={32} className="text-green-500" />
            <h2 className="text-2xl md:text-3xl font-bold">{t('Newly Added Vendors', 'Naye Vendors — Abhi Abhi Aaye')}</h2>
          </motion.div>
          <p className="text-gray-500 mb-8">
            {t('Fresh listings — just registered on VendorVerse. Be the first to visit them.', 'Naye listings — abhi abhi register hue hain. Pehle aap jaiye.')}
          </p>
          <div className="flex gap-5 overflow-x-auto pb-4 snap-x">
            {newlyAdded.map((v, i) => (
              <motion.div
                key={v.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -6 }}
                className={`min-w-[280px] snap-start bg-white rounded-2xl shadow-md p-6 flex flex-col gap-3 border transition-all duration-700 ${flashId === v.id ? 'border-green-400 bg-green-50 shadow-green-200 shadow-lg' : 'border-green-100'}`}
              >
                <div className="flex items-center gap-2">
                  <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">{t('New', 'Naya')}</span>
                  <AnimatePresence>
                    {flashId === v.id && (
                      <motion.span initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="text-green-600 text-xs font-bold animate-pulse">✓ Just added!</motion.span>
                    )}
                  </AnimatePresence>
                  {latestVendor?.id === v.id && flashId !== v.id && (
                    <span className="text-green-600 text-xs font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse inline-block" />
                      {t('Latest', 'Sabse Naya')}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <motion.div whileHover={{ scale: 1.1 }} className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0" style={{ backgroundColor: v.color || '#F97316' }}>
                    {v.initials || v.vendor_name.slice(0, 2).toUpperCase()}
                  </motion.div>
                  <div className="font-bold text-lg leading-tight">{v.vendor_name}</div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="bg-orange-100 text-[#F97316] text-xs font-semibold px-2 py-0.5 rounded-full w-fit">{v.category}</span>
                  <OpenPill hours={v.hours} t={t} />
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <MapPin size={14} className="text-[#F97316]" />
                  {v.location.split(',')[0]}
                </div>
                <div className="text-xs text-gray-400">{t('Added', 'Abhi aaya')} {timeAgo(v.submission_timestamp, lang)}</div>
                {v.status === 'new' && !v.profile_url && (
                  <div className="text-xs font-semibold text-green-700">
                    {t('Just Added — Profile coming soon', 'Abhi Add Hua — Profile jald aayega')}
                  </div>
                )}
                <div className="bg-green-50 rounded-xl px-3 py-2 text-xs text-gray-600 space-y-1 border border-green-100">
                  {v.what_they_sell && <div className="truncate">🛒 {v.what_they_sell}</div>}
                  {v.hours && <div>🕐 {v.hours}</div>}
                </div>
                {v.rating && (
                  <div className="flex items-center gap-1">
                    <StarRating rating={v.rating} />
                    <span className="text-sm font-bold">{v.rating}</span>
                  </div>
                )}
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                  <Link to={v.profile_url || `/vendor/${v.id}`} className="mt-auto bg-[#F97316] text-white text-center py-2.5 rounded-xl font-bold text-sm hover:bg-orange-600 transition-colors block">
                    {t('See Full Profile →', 'Poori Detail Dekho →')}
                  </Link>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>}

      {/* ── Category Filter + All Vendors ── */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.h2 initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-2xl md:text-3xl font-bold mb-6">
            {t('All Vendors', 'Sabhi Vendors')}
          </motion.h2>
          {/* Category tiles */}
          <div className="flex flex-wrap gap-3 mb-8">
            {categories.map((cat, i) => {
              const norm = CATEGORY_MAP[cat] || cat;
              const isActive = norm === normalizedCat || cat === selectedCat;
              return (
                <motion.button
                  key={cat}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCat(cat)}
                  className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-colors ${isActive ? 'bg-[#F97316] text-white shadow-md shadow-orange-100' : 'bg-gray-100 text-gray-700 hover:bg-orange-50'}`}
                >
                  {cat}
                </motion.button>
              );
            })}
          </div>

          {/* Vendor grid */}
          {filteredVendors.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
              <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 3 }} className="text-6xl mb-4">🔍</motion.div>
              <h3 className="text-xl font-bold text-gray-700 mb-2">{t('No vendors found', 'Koi vendor nahi mila')}</h3>
              <p className="text-gray-500 mb-6">
                {searchQuery.trim()
                  ? t(`No results for "${searchQuery}". Try searching by name, item, or location.`, `"${searchQuery}" ke liye koi result nahi. Naam, item ya jagah se try karo.`)
                  : t('No vendors in this category yet.', 'Is category mein abhi koi vendor nahi hai.')}
              </p>
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                <Link to="/register" className="inline-flex items-center gap-2 bg-[#F97316] text-white px-6 py-3 rounded-xl font-bold hover:bg-orange-600 transition-colors">
                  + {t('Add this vendor — Free', 'Is vendor ko add karo — Free')}
                </Link>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              initial="hidden"
              animate="show"
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {filteredVendors.map(v => (
                <motion.div
                  key={v.id}
                  variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } } }}
                  whileHover={{ y: -4, boxShadow: '0 12px 32px rgba(249,115,22,0.1)' }}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-4 transition-colors hover:border-orange-200"
                >
                  <div className="flex items-start gap-4">
                    {v.photo_url ? (
                      <motion.img
                        whileHover={{ scale: 1.08 }}
                        src={v.photo_url}
                        alt={v.vendor_name}
                        className="w-14 h-14 rounded-2xl object-cover flex-shrink-0 shadow-sm border-2 border-orange-100"
                      />
                    ) : (
                      <motion.div
                        whileHover={{ scale: 1.08, rotate: 3 }}
                        className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-sm"
                        style={{ backgroundColor: v.color || '#F97316' }}
                      >
                        {v.initials || v.vendor_name.slice(0, 2).toUpperCase()}
                      </motion.div>
                    )}
                    <div className="flex-1">
                      <div className="font-bold text-lg">{v.vendor_name}</div>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className="bg-orange-100 text-[#F97316] text-xs font-semibold px-2 py-0.5 rounded-full">{v.category}</span>
                        {isOpenNow(v.hours) ? (
                          <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block animate-pulse" />
                            {t('Open Now', 'Abhi Khula Hai')}
                          </span>
                        ) : (
                          <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-red-400 rounded-full inline-block" />
                            {t('Closed', 'Band Hai')}
                          </span>
                        )}
                        {v.status === 'new' && (
                          <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full">{t('New', 'Naya')}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <MapPin size={14} className="text-[#F97316]" />
                    {v.location}
                  </div>
                  <div className="bg-[#FFF7ED] rounded-xl px-4 py-3 text-sm text-gray-600 space-y-1.5">
                    {v.what_they_sell && <div className="truncate">🛒 <span className="font-medium">{v.what_they_sell}</span></div>}
                    {v.hours && <div>🕐 {v.hours}</div>}
                    {v.whatsapp_number && <div>📱 {t('WhatsApp available', 'WhatsApp available')}</div>}
                    {v.upi_id && <div>💳 {t('UPI payment accepted', 'UPI payment milta hai')}</div>}
                  </div>
                  {v.rating && (
                    <div className="flex items-center gap-2">
                      <StarRating rating={v.rating} />
                      <span className="font-bold text-sm">{v.rating}</span>
                      <span className="text-gray-500 text-sm">· {v.reviews} {t('reviews', 'logon ne review kiya')}</span>
                    </div>
                  )}
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                    <Link
                      to={v.profile_url || `/vendor/${v.id}`}
                      className="w-full bg-[#F97316] text-white text-center py-3 rounded-xl font-bold hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
                    >
                      {latestVendor?.id === v.id && <span className="w-2 h-2 bg-white rounded-full animate-pulse" />}
                      {t('See Full Profile →', 'Poori Detail Dekho →')}
                    </Link>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* ── Missing vendor banner ── */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="bg-[#F97316] py-10 px-4 text-center text-white"
      >
        <div className="max-w-3xl mx-auto">
          <p className="text-xl font-bold mb-4">
            {t("Is your favourite vendor missing? Add them — free, 2 minutes.", "Kya aapka favourite vendor yahan nahi hai? Unhe add karo — free, 2 minute.")}
          </p>
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
            <Link to="/register" className="bg-white text-[#F97316] px-8 py-3 rounded-xl font-bold hover:bg-orange-50 transition-colors inline-block">
              {t('Add a Vendor — Free', 'Vendor Add Karo — Free')}
            </Link>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}
