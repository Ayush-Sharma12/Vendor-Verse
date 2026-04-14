import { useParams, Link, useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useVendors } from '@/context/VendorContext';
import { useLang } from '@/context/LanguageContext';
import { isOpenNow } from '@/lib/isOpenNow';
import {
  MapPin, Clock, ShoppingBasket, Share2, MessageCircle,
  CreditCard, ArrowLeft, CheckCircle2, Sparkles,
  User, TrendingUp, Heart, Eye, Copy, Check,
  Star, Zap, BadgeCheck, ExternalLink, QrCode
} from 'lucide-react';

/* ─── animation variants ──────────────────────────────────────── */

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' as const } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.88 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: 'backOut' as const } },
};

const slideRight = {
  hidden: { opacity: 0, x: -24 },
  show: { opacity: 1, x: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
};

/* ─── helpers ─────────────────────────────────────────────────── */

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
  if (mins < 60) return `${mins} min ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return 'Yesterday';
  return `${days} days ago`;
}

const PRICE_MAP: Record<string, string> = {
  chai: '₹10', tea: '₹10', coffee: '₹15', 'cutting chai': '₹10',
  samosa: '₹20', momos: '₹60', chowmein: '₹50', noodles: '₹50',
  soup: '₹40', paan: '₹15', cigarette: '₹15', cigarettes: '₹15',
  chips: '₹20', 'cold drink': '₹30', 'cold drinks': '₹30',
  'bun maska': '₹15', bread: '₹15',
  vegetables: '₹30/kg', fruits: '₹40/kg', sabzi: '₹30/kg',
  juice: '₹30', lassi: '₹40', 'nimbu pani': '₹20',
  paratha: '₹30', 'aloo paratha': '₹40', poha: '₹25',
  bhelpuri: '₹30', 'pav bhaji': '₹60', vada: '₹15',
  maggi: '₹40', sandwich: '₹50', burger: '₹60',
};

function parseMenuItems(whatTheySell: string): { name: string; price: string; emoji: string }[] {
  const EMOJI_MAP: Record<string, string> = {
    chai: '☕', tea: '☕', coffee: '☕', 'cutting chai': '☕',
    samosa: '🥟', momos: '🥟', chowmein: '🍜', noodles: '🍜',
    soup: '🍲', paan: '🌿', cigarette: '🚬', cigarettes: '🚬',
    chips: '🍟', 'cold drink': '🥤', 'cold drinks': '🥤',
    'bun maska': '🍞', bread: '🍞',
    vegetables: '🥦', fruits: '🍎', sabzi: '🥦',
    juice: '🧃', lassi: '🥛', 'nimbu pani': '🍋',
    paratha: '🫓', poha: '🍚', bhelpuri: '🥗',
    'pav bhaji': '🍛', vada: '🫓', maggi: '🍜',
    sandwich: '🥪', burger: '🍔',
  };
  const items = whatTheySell.split(',').map(s => s.trim()).filter(Boolean);
  return items.map(name => {
    const lower = name.toLowerCase();
    const priceKey = Object.keys(PRICE_MAP).find(k => lower.includes(k));
    const emojiKey = Object.keys(EMOJI_MAP).find(k => lower.includes(k));
    // extract inline price like (₹40) from name
    const inlinePrice = name.match(/₹[\d]+(?:\/\w+)?/)?.[0];
    return {
      name,
      price: inlinePrice ?? (priceKey ? PRICE_MAP[priceKey] : '₹20–₹50'),
      emoji: emojiKey ? EMOJI_MAP[emojiKey] : '🛒',
    };
  });
}

function useFakeViewers() {
  const [viewers, setViewers] = useState(() => Math.floor(Math.random() * 8) + 3);
  useEffect(() => {
    const id = setInterval(() => {
      setViewers(v => Math.max(1, Math.min(18, v + (Math.random() > 0.5 ? 1 : -1))));
    }, 4500);
    return () => clearInterval(id);
  }, []);
  return viewers;
}

function getAutoReviews(category: string, vendorName: string, lang: string) {
  const reviewSets: Record<string, { en: string[]; hi: string[]; authors: string[]; avatars: string[] }> = {
    'Chai & Snacks': {
      en: [
        `Best chai in the area! ${vendorName} never disappoints.`,
        'Samosa was crispy and hot. Will definitely come back!',
        'Affordable and delicious. My daily morning stop.',
      ],
      hi: [
        `Is area ki sabse acchi chai! ${vendorName} kabhi disappoint nahi karte.`,
        'Samosa ekdum crispy aur garam tha. Zaroor wapas aaunga!',
        'Sasta aur tasty. Meri roz subah ki jagah.',
      ],
      authors: ['Rahul M.', 'Priya K.', 'Ananya S.'],
      avatars: ['RM', 'PK', 'AS'],
    },
    'Street Food': {
      en: [
        `Momos are absolutely amazing at ${vendorName}!`,
        'Best street food near the campus. Always fresh.',
        'Chowmein is spicy and filling. Great value for money.',
      ],
      hi: [
        `${vendorName} ke momos ekdum mast hain!`,
        'Campus ke paas sabse accha street food. Hamesha fresh.',
        'Chowmein spicy aur filling hai. Paisa vasool.',
      ],
      authors: ['Vikram T.', 'Sneha R.', 'Arjun P.'],
      avatars: ['VT', 'SR', 'AP'],
    },
    'Sabzi & Fruits': {
      en: [
        'Always fresh vegetables. Best prices in the area!',
        `${vendorName} is so kind and honest. Never cheats on weight.`,
        'Daily customer here. Quality is always top notch.',
      ],
      hi: [
        'Hamesha taazi sabzi. Is area mein sabse saste daam!',
        `${vendorName} bahut acche insaan hain. Wazan mein kabhi dhoka nahi.`,
        'Roz yahan aata hoon. Quality hamesha best rehti hai.',
      ],
      authors: ['Sunita D.', 'Ramesh K.', 'Meena J.'],
      avatars: ['SD', 'RK', 'MJ'],
    },
    'Paan & More': {
      en: [
        'Best paan in Greater Noida. Always fresh ingredients.',
        'Quick service and good variety. My go-to spot.',
        'Reasonable prices and always smiling. Love this place!',
      ],
      hi: [
        'Greater Noida ka sabse accha paan. Hamesha fresh ingredients.',
        'Quick service aur achha variety. Meri favourite jagah.',
        'Sahi daam aur hamesha muskurate hain. Bahut acchi jagah!',
      ],
      authors: ['Deepak S.', 'Kavita M.', 'Sunil B.'],
      avatars: ['DS', 'KM', 'SB'],
    },
  };
  const set = reviewSets[category] || reviewSets['Street Food'];
  const texts = lang === 'HI' ? set.hi : set.en;
  return texts.map((text, i) => ({
    text,
    author: set.authors[i],
    avatar: set.avatars[i],
    stars: i === 0 ? 5 : i === 1 ? 4 : 5,
  }));
}

/* ─── Share Toast ─────────────────────────────────────────────── */
function ShareToast({ visible }: { visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.3, ease: 'backOut' as const }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-gray-950 text-white px-6 py-3.5 rounded-2xl shadow-2xl border border-green-500/30"
        >
          <div className="w-7 h-7 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
            <Check size={14} />
          </div>
          <span className="font-bold text-sm">Link copied to clipboard!</span>
          <span className="text-green-400 text-xs font-mono truncate max-w-[160px]">{window.location.href}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─── component ───────────────────────────────────────────────── */

export default function VendorProfilePage() {
  const { id } = useParams<{ id: string }>();
  const { vendors } = useVendors();
  const { lang, t } = useLang();
  const navigate = useNavigate();
  const viewers = useFakeViewers();
  const linkRef = useRef<HTMLInputElement>(null);

  const [liked, setLiked] = useState(false);
  const [likeCount] = useState(() => Math.floor(Math.random() * 40) + 8);
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [activeMenuItem, setActiveMenuItem] = useState<number | null>(null);

  const vendor = vendors.find(v => v.id === id);

  useEffect(() => {
    if (vendors.length > 0 && !vendor) {
      // No id param (e.g. /vendor-profile) → redirect to first vendor
      if (!id) {
        navigate(`/vendor/${vendors[0].id}`, { replace: true });
      } else {
        navigate('/browse', { replace: true });
      }
    }
  }, [vendor, vendors, navigate, id]);

  if (!vendor) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-3"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="text-5xl"
          >🔍</motion.div>
          <p className="text-gray-500 font-semibold">{t('Loading vendor profile...', 'Vendor profile load ho raha hai...')}</p>
        </motion.div>
      </div>
    );
  }

  const menuItems = parseMenuItems(vendor.what_they_sell);
  const reviews = getAutoReviews(vendor.category, vendor.vendor_name, lang);
  const isNew = vendor.status === 'new';
  const registeredDate = new Date(vendor.submission_timestamp).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
  const profileUrl = window.location.href;

  const handleCopyUpi = () => {
    if (vendor.upi_id) {
      navigator.clipboard.writeText(vendor.upi_id);
      setCopiedUpi(true);
      setTimeout(() => setCopiedUpi(false), 2500);
    }
  };

  // Always copy — never use navigator.share (broken in iframes/preview)
  const handleCopyLink = () => {
    navigator.clipboard.writeText(profileUrl).then(() => {
      setCopiedLink(true);
      setShowToast(true);
      setTimeout(() => setCopiedLink(false), 3000);
      setTimeout(() => setShowToast(false), 3000);
    }).catch(() => {
      // fallback: select the input
      if (linkRef.current) {
        linkRef.current.select();
        document.execCommand('copy');
        setCopiedLink(true);
        setShowToast(true);
        setTimeout(() => setCopiedLink(false), 3000);
        setTimeout(() => setShowToast(false), 3000);
      }
    });
  };

  const displayRating = vendor.rating ?? (3.8 + Math.random() * 0.9);
  const displayReviews = vendor.reviews ?? Math.floor(Math.random() * 20) + 3;
  const [, setNowTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setNowTick((n) => n + 1), 60_000);
    return () => clearInterval(id);
  }, []);
  const openNow = isOpenNow(vendor.hours);

  // Record a real backend view count (best-effort)
  useEffect(() => {
    fetch(`/api/vendors?viewId=${encodeURIComponent(vendor.id)}`).catch(() => {});
  }, [vendor.id]);

  return (
    <div className="text-[#1C1C1C] max-w-2xl mx-auto px-4 py-8">

      {/* ── Toast ── */}
      <ShareToast visible={showToast} />

      {/* ── Back ── */}
      <motion.button
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.35 }}
        whileHover={{ x: -4 }}
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-400 hover:text-[#F97316] transition-colors mb-6 font-semibold text-sm"
      >
        <ArrowLeft size={16} />
        {t('Back to Browse', 'Wapas Browse Karo')}
      </motion.button>

      {/* ── Status pills ── */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="flex flex-wrap items-center gap-2 mb-5"
        >
          <motion.span variants={fadeUp} className="inline-flex items-center gap-1.5 bg-orange-50 border border-orange-200 text-orange-700 text-xs font-bold px-3 py-1.5 rounded-full">
            <Eye size={12} className="animate-pulse" />
            {viewers} {t('people viewing now', 'log abhi dekh rahe hain')}
          </motion.span>
          {typeof vendor.views === 'number' && (
            <motion.span variants={fadeUp} className="inline-flex items-center gap-1.5 bg-gray-100 border border-gray-200 text-gray-700 text-xs font-bold px-3 py-1.5 rounded-full">
              <Eye size={12} />
              {vendor.views} {t('total views', 'total views')}
            </motion.span>
          )}
        {isNew && (
          <motion.span variants={scaleIn} className="inline-flex items-center gap-1 bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-full animate-pulse">
            <Sparkles size={12} />
            {t('Newly Registered!', 'Naya Vendor!')}
          </motion.span>
        )}
        <motion.span
          variants={scaleIn}
          className={`inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full ${
            openNow ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
          }`}
        >
          <span className={`w-2 h-2 rounded-full inline-block ${openNow ? 'bg-green-500 animate-pulse' : 'bg-red-400'}`} />
          {openNow ? t('Open Now', 'Abhi Khula Hai') : t('Closed Now', 'Abhi Band Hai')}
        </motion.span>
      </motion.div>

      {/* ── Hero card ── */}
      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' as const }}
        className="rounded-3xl p-6 mb-6 text-white relative overflow-hidden shadow-2xl"
        style={{ background: `linear-gradient(135deg, ${vendor.color || '#F97316'} 0%, ${vendor.color ? vendor.color + 'bb' : '#fb923c'} 100%)` }}
      >
        {/* animated decorative blobs */}
        <motion.div
          animate={{ scale: [1, 1.15, 1], rotate: [0, 15, 0] }}
          transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut' as const }}
          className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 10, ease: 'easeInOut' as const, delay: 1 }}
          className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-white/10"
        />
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' as const, delay: 2 }}
          className="absolute top-1/2 right-16 w-16 h-16 rounded-full bg-white/5"
        />

        <div className="relative flex items-start gap-5">
          {/* Avatar with ring animation */}
          <motion.div
            whileHover={{ scale: 1.08, rotate: 3 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="w-20 h-20 rounded-2xl bg-white/25 flex items-center justify-center font-bold text-2xl flex-shrink-0 shadow-lg backdrop-blur-sm border-2 border-white/40 cursor-default select-none"
          >
            {vendor.initials || vendor.vendor_name.slice(0, 2).toUpperCase()}
          </motion.div>

          <div className="flex-1 min-w-0">
            <h1 className="text-2xl md:text-3xl font-bold leading-tight">{vendor.vendor_name}</h1>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <span className="bg-white/25 text-white text-xs font-bold px-3 py-1 rounded-full border border-white/30">
                {vendor.category}
              </span>
              <span className="bg-white/25 text-white text-xs font-bold px-3 py-1 rounded-full border border-white/30 flex items-center gap-1">
                <BadgeCheck size={12} />
                {t('Verified', 'Verified')}
              </span>
            </div>
            {/* Stars */}
            <div className="flex items-center gap-2 mt-3">
              <span className="text-yellow-300 text-lg">
                {'★'.repeat(Math.floor(displayRating))}{'☆'.repeat(5 - Math.floor(displayRating))}
              </span>
              <span className="font-bold text-lg">{displayRating.toFixed(1)}</span>
              <span className="text-white/75 text-sm">· {displayReviews} {t('reviews', 'reviews')}</span>
            </div>
          </div>
        </div>

        {/* Like + Share */}
        <div className="relative flex items-center gap-3 mt-5 pt-4 border-t border-white/20">
          <motion.button
            whileTap={{ scale: 0.88 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => setLiked(l => !l)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all border ${liked ? 'bg-white text-red-500 border-white shadow-lg' : 'bg-white/20 text-white border-white/30 hover:bg-white/30'}`}
          >
            <motion.div animate={liked ? { scale: [1, 1.4, 1] } : {}} transition={{ duration: 0.3 }}>
              <Heart size={15} className={liked ? 'fill-red-500' : ''} />
            </motion.div>
            {likeCount + (liked ? 1 : 0)}
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.88 }}
            whileHover={{ scale: 1.05 }}
            onClick={handleCopyLink}
            className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm bg-white/20 text-white border border-white/30 hover:bg-white/30 transition-all"
          >
            {copiedLink ? <Check size={15} /> : <Share2 size={15} />}
            {copiedLink ? t('Copied! ✓', 'Copy! ✓') : t('Share', 'Share')}
          </motion.button>

          <span className="ml-auto text-white/60 text-xs">
            {t('Joined', 'Aaye')} {timeAgo(vendor.submission_timestamp, lang)}
          </span>
        </div>
      </motion.div>

      {/* ── Info panel ── */}
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-40px' }}
        className="bg-[#FFF7ED] rounded-2xl p-6 mb-6 space-y-5 border border-orange-100"
      >
        {[
          { icon: <Clock size={18} className="text-[#F97316]" />, label: t('Opening Hours', 'Samay'), value: vendor.hours },
          { icon: <MapPin size={18} className="text-[#F97316]" />, label: t('Location', 'Jagah'), value: vendor.location },
          { icon: <ShoppingBasket size={18} className="text-[#F97316]" />, label: t('What They Sell', 'Kya Milta Hai'), value: vendor.what_they_sell },
          { icon: <User size={18} className="text-[#F97316]" />, label: t('Added By', 'Kisne Add Kiya'), value: `${vendor.registered_by} · ${registeredDate}` },
        ].map((row, i) => (
          <motion.div key={i} variants={slideRight} className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center flex-shrink-0">
              {row.icon}
            </div>
            <div>
              <div className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-0.5">{row.label}</div>
              <div className="font-semibold text-base">{row.value}</div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* ── Stats row ── */}
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-40px' }}
        className="grid grid-cols-3 gap-3 mb-8"
      >
        {[
          { bg: 'bg-orange-50 border-orange-100', val: `${displayRating.toFixed(1)}★`, label: t('Rating', 'Rating'), color: 'text-[#F97316]' },
          { bg: 'bg-blue-50 border-blue-100', val: String(viewers), label: t('Viewing Now', 'Abhi Dekh Rahe'), color: 'text-blue-600' },
          { bg: 'bg-red-50 border-red-100', val: String(likeCount + (liked ? 1 : 0)), label: t('Likes', 'Pasand'), color: 'text-red-500' },
        ].map((s, i) => (
          <motion.div
            key={i}
            variants={scaleIn}
            whileHover={{ y: -4, scale: 1.04 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className={`${s.bg} rounded-2xl p-4 text-center border cursor-default`}
          >
            <div className={`text-2xl font-bold ${s.color}`}>{s.val}</div>
            <div className="text-xs text-gray-500 mt-1 font-semibold">{s.label}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* ── Menu ── */}
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-40px' }}
        variants={stagger}
        className="mb-8"
      >
        <motion.div variants={fadeUp} className="flex items-center gap-2 mb-4">
          <Zap size={22} className="text-[#F97316]" />
          <h2 className="text-2xl font-bold">{t('Menu & Prices', 'Menu aur Daam')}</h2>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {menuItems.map((item, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onHoverStart={() => setActiveMenuItem(i)}
              onHoverEnd={() => setActiveMenuItem(null)}
              className={`flex items-center justify-between bg-white border-2 rounded-2xl px-5 py-4 shadow-sm transition-colors cursor-default ${
                activeMenuItem === i ? 'border-orange-300 shadow-orange-100 shadow-md' : 'border-gray-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <motion.span
                  animate={activeMenuItem === i ? { rotate: [0, -10, 10, 0], scale: [1, 1.2, 1] } : {}}
                  transition={{ duration: 0.4 }}
                  className="text-2xl"
                >
                  {item.emoji}
                </motion.span>
                <span className={`font-semibold text-base transition-colors ${activeMenuItem === i ? 'text-[#F97316]' : ''}`}>
                  {item.name}
                </span>
              </div>
              <motion.span
                animate={activeMenuItem === i ? { scale: 1.1 } : { scale: 1 }}
                className="font-bold text-[#F97316] text-lg"
              >
                {item.price}
              </motion.span>
            </motion.div>
          ))}
        </div>
        <motion.p variants={fadeUp} className="text-xs text-gray-400 mt-3 text-center">
          {t('* Prices are approximate. Confirm with vendor.', '* Daam approximate hain. Vendor se confirm karo.')}
        </motion.p>
      </motion.div>

      {/* ── Payment & Contact ── */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.45 }}
        className="rounded-2xl p-6 mb-6 text-white shadow-xl"
        style={{ background: `linear-gradient(135deg, ${vendor.color || '#F97316'}, ${vendor.color ? vendor.color + 'bb' : '#fb923c'})` }}
      >
        <h2 className="text-xl font-bold mb-5 flex items-center gap-2">
          <CreditCard size={22} />
          {t('Pay & Contact', 'Payment aur Contact')}
        </h2>
        <div className="space-y-3">
          {vendor.upi_id && (
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-3 flex items-center gap-3 border border-white/30"
            >
              <div className="flex-1 min-w-0">
                <div className="text-xs opacity-70 font-bold uppercase tracking-widest mb-0.5">UPI ID</div>
                <div className="font-bold text-lg font-mono truncate">{vendor.upi_id}</div>
              </div>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleCopyUpi}
                className={`flex-shrink-0 flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-lg transition-all ${
                  copiedUpi ? 'bg-green-500 text-white' : 'bg-white/30 hover:bg-white/50 text-white'
                }`}
              >
                <AnimatePresence mode="wait">
                  {copiedUpi ? (
                    <motion.span key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="flex items-center gap-1">
                      <Check size={14} /> {t('Copied!', 'Copy!')}
                    </motion.span>
                  ) : (
                    <motion.span key="copy" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="flex items-center gap-1">
                      <Copy size={14} /> {t('Copy', 'Copy')}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </motion.div>
          )}
          {vendor.whatsapp_number && (
            <motion.a
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              href={`https://wa.me/91${vendor.whatsapp_number}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-green-500 hover:bg-green-600 text-white px-5 py-3.5 rounded-xl font-bold transition-colors w-full"
            >
              <MessageCircle size={20} />
              <span className="flex-1">{t('Chat on WhatsApp', 'WhatsApp pe Baat Karo')}</span>
              <span className="text-sm opacity-90 font-mono">+91 {vendor.whatsapp_number}</span>
            </motion.a>
          )}
          {!vendor.upi_id && !vendor.whatsapp_number && (
            <div className="bg-white/20 rounded-xl p-4 text-center">
              <p className="opacity-80 text-sm">{t('Contact details not added yet. Visit them directly!', 'Contact details abhi nahi hain. Seedha mil lo!')}</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* ── "Be the first" banner for new vendors ── */}
      <AnimatePresence>
        {isNew && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6 mb-6 text-center"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="text-4xl mb-3"
            >🌟</motion.div>
            <h3 className="text-xl font-bold text-green-800 mb-2">{t('Be the first to visit!', 'Pehle aap jaiye!')}</h3>
            <p className="text-green-700 text-sm leading-relaxed">
              {t(
                `${vendor.vendor_name} just joined VendorVerse. Be among the very first customers!`,
                `${vendor.vendor_name} abhi VendorVerse pe aaye hain. Pehle customers mein se ek bano!`
              )}
            </p>
            <div className="flex items-center justify-center gap-2 mt-4">
              <CheckCircle2 size={16} className="text-green-600" />
              <span className="text-xs text-green-700 font-bold">{t('Verified & Live on VendorVerse', 'Verified aur VendorVerse pe Live')}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Reviews ── */}
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-40px' }}
        variants={stagger}
        className="mb-8"
      >
        <motion.div variants={fadeUp} className="flex items-center gap-2 mb-5">
          <Star size={22} className="text-yellow-500 fill-yellow-400" />
          <h2 className="text-2xl font-bold">{t('What people say', 'Log kya kehte hain?')}</h2>
        </motion.div>
        <div className="space-y-4">
          {reviews.map((r, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              whileHover={{ x: 4, boxShadow: '0 8px 30px rgba(0,0,0,0.08)' }}
              className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm transition-shadow"
            >
              <div className="flex items-center gap-3 mb-3">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-md"
                  style={{ backgroundColor: vendor.color || '#F97316' }}
                >
                  {r.avatar}
                </motion.div>
                <div>
                  <div className="font-bold text-sm">{r.author}</div>
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, si) => (
                      <motion.span
                        key={si}
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: si * 0.06 + i * 0.1 }}
                        className={`text-sm ${si < r.stars ? 'text-yellow-400' : 'text-gray-200'}`}
                      >★</motion.span>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">"{r.text}"</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ── Shareable Link Card ── */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.45 }}
        className="rounded-2xl mb-6 overflow-hidden border border-gray-800 shadow-2xl"
        style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}
      >
        {/* Top bar */}
        <div className="flex items-center gap-3 px-6 pt-5 pb-4 border-b border-white/10">
          <div className="w-9 h-9 rounded-xl bg-green-500/20 flex items-center justify-center">
            <QrCode size={18} className="text-green-400" />
          </div>
          <div>
            <h3 className="text-white font-bold text-base">{t("Share This Vendor's Profile", 'Is Vendor Ka Profile Share Karo')}</h3>
            <p className="text-gray-400 text-xs">{t('Anyone with this link can find this vendor', 'Is link se koi bhi vendor dhundh sakta hai')}</p>
          </div>
        </div>

        <div className="px-6 py-5 space-y-4">
          {/* URL box — clickable input for easy selection */}
          <div className="relative group">
            <div className="flex items-center gap-2 bg-gray-900 rounded-xl border border-gray-700 group-hover:border-green-500/50 transition-colors overflow-hidden">
              <ExternalLink size={14} className="text-gray-500 ml-4 flex-shrink-0" />
              <input
                ref={linkRef}
                readOnly
                value={profileUrl}
                onClick={e => (e.target as HTMLInputElement).select()}
                className="flex-1 bg-transparent text-green-400 text-xs font-mono py-3 pr-2 outline-none cursor-text truncate"
              />
              <motion.button
                whileTap={{ scale: 0.92 }}
                onClick={handleCopyLink}
                className={`flex-shrink-0 flex items-center gap-1.5 text-xs font-bold px-4 py-3 transition-all ${
                  copiedLink
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                }`}
              >
                <AnimatePresence mode="wait">
                  {copiedLink ? (
                    <motion.span key="c" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0 }} className="flex items-center gap-1.5">
                      <Check size={13} /> Copied!
                    </motion.span>
                  ) : (
                    <motion.span key="u" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0 }} className="flex items-center gap-1.5">
                      <Copy size={13} /> Copy
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>

          {/* Share buttons */}
          <div className="flex flex-wrap gap-2">
            <motion.a
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.95 }}
              href={`https://wa.me/?text=${encodeURIComponent(`Check out ${vendor.vendor_name} on VendorVerse!\n${profileUrl}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors"
            >
              <MessageCircle size={14} />
              {t('Share on WhatsApp', 'WhatsApp pe Share Karo')}
            </motion.a>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCopyLink}
              className={`flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-xl transition-all ${
                copiedLink ? 'bg-green-500 text-white' : 'bg-gray-700 hover:bg-gray-600 text-gray-200'
              }`}
            >
              {copiedLink ? <Check size={14} /> : <Copy size={14} />}
              {copiedLink ? t('Link Copied!', 'Link Copy!') : t('Copy Link', 'Link Copy Karo')}
            </motion.button>
          </div>

          <p className="text-gray-500 text-xs">
            {t('No app needed — works on any phone or browser.', 'Koi app nahi chahiye — kisi bhi phone ya browser pe kaam karta hai.')}
          </p>
        </div>
      </motion.div>

      {/* ── Share CTA ── */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.45 }}
        className="bg-[#FFF7ED] rounded-2xl p-6 text-center mb-6 border border-orange-100"
      >
        <motion.div
          animate={{ y: [0, -4, 0] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' as const }}
        >
          <TrendingUp size={28} className="text-[#F97316] mx-auto mb-3" />
        </motion.div>
        <h3 className="text-xl font-bold mb-1">
          {t(`Help ${vendor.vendor_name} grow!`, `${vendor.vendor_name} ko aur customers dilao!`)}
        </h3>
        <p className="text-gray-500 text-sm mb-5">
          {t('Share this page on WhatsApp — takes 5 seconds, makes a real difference.', 'WhatsApp pe share karo — 5 second mein, zindagi badal do.')}
        </p>
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleCopyLink}
          className="inline-flex items-center gap-2 bg-[#F97316] text-white px-8 py-3.5 rounded-xl font-bold hover:bg-orange-600 transition-colors text-base shadow-lg shadow-orange-200"
        >
          {copiedLink ? <Check size={20} /> : <Share2 size={20} />}
          {copiedLink ? t('Link Copied! ✓', 'Link Copy Ho Gaya! ✓') : t('Share This Profile', 'Yeh Profile Share Karo')}
        </motion.button>
      </motion.div>

      {/* ── Register another ── */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-center pb-4"
      >
        <p className="text-gray-400 text-sm mb-3">{t('Know another vendor?', 'Koi aur vendor jaante ho?')}</p>
        <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 border-2 border-[#F97316] text-[#F97316] px-6 py-3 rounded-xl font-bold hover:bg-orange-50 transition-colors"
          >
            + {t('Add a Vendor — Free', 'Vendor Add Karo — Free')}
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
