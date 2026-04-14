import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { useLang } from '@/context/LanguageContext';
import { useVendors } from '@/context/VendorContext';
import SmartImage from '@/components/SmartImage';
import {
  ClipboardList, MapPin, Share2, ChevronDown, BookOpen, ArrowRight,
  CheckCircle2, XCircle, Users, Zap, Star, Camera, Shield,
} from 'lucide-react';

/* ── animation variants ─────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };
const scaleIn = {
  hidden: { opacity: 0, scale: 0.88 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.45, ease: 'backOut' as const } },
};
const slideLeft = {
  hidden: { opacity: 0, x: 40 },
  show: { opacity: 1, x: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
};

/* ── Comparison Section ─────────────────────────────────────── */
const features = [
  { en: 'Community onboarding (register on behalf)', hi: 'Community onboarding (kisi ke liye register)' },
  { en: 'No app required — web only', hi: 'Koi app nahi chahiye — sirf web' },
  { en: 'Shareable vendor profile link', hi: 'Shareable vendor profile link' },
  { en: 'UPI + WhatsApp + Menu in one page', hi: 'UPI + WhatsApp + Menu ek page pe' },
  { en: 'Hindi / Hinglish interface', hi: 'Hindi / Hinglish interface' },
  { en: 'Street vendor specific (not shops)', hi: 'Street vendors ke liye (shops nahi)' },
  { en: 'No KYC / license required', hi: 'Koi KYC / license nahi chahiye' },
  { en: 'Hyperlocal vendor discovery', hi: 'Hyperlocal vendor discovery' },
  { en: 'Free — zero commission', hi: 'Free — zero commission' },
];
const competitors = [
  { name: 'Google Maps', scores: [false, true, false, false, false, false, false, true, true], why: { en: 'Vendors must self-register with a Google account. Most street vendors have never done this — and never will.', hi: 'Vendors ko khud Google account se register karna hota hai. Zyaadatar street vendors ne kabhi nahi kiya.' } },
  { name: 'Mera Thela', scores: [false, false, false, false, true, true, false, false, true], why: { en: "Hyper-niche, limited reach, no shareable profile, and requires vendor self-onboarding. Didn't scale beyond pilot cities.", hi: 'Bahut limited reach, koi shareable profile nahi, aur vendor ko khud register karna padta hai. Pilot cities se aage nahi gaya.' } },
  { name: 'MeriPheri', scores: [false, true, false, false, false, false, false, false, true], why: { en: 'Classifieds-style listing — not a vendor profile. No UPI, no menu, no Open Now detection. Not built for street vendors.', hi: 'Classifieds-style listing hai — vendor profile nahi. Koi UPI, menu, ya Open Now nahi. Street vendors ke liye nahi bana.' } },
  { name: 'Dukaan', scores: [false, true, true, false, false, false, true, false, false], why: { en: 'Built for shop owners with inventory. Requires vendor to set up their own store. Too complex for a chai wala.', hi: 'Shop owners ke liye bana hai. Vendor ko khud store setup karna padta hai. Chai wale ke liye bahut complex hai.' } },
  { name: 'Zomato/Swiggy', scores: [false, false, true, false, false, false, false, false, false], why: { en: 'Requires FSSAI license, kitchen inspection, and commission per order. A street vendor can never qualify.', hi: 'FSSAI license, kitchen inspection, aur har order pe commission chahiye. Street vendor kabhi qualify nahi kar sakta.' } },
  { name: 'JustDial', scores: [false, true, false, false, false, false, false, true, false], why: { en: 'Designed for registered businesses. Paid listings for visibility. No UPI, no WhatsApp, no street vendor focus.', hi: 'Registered businesses ke liye bana hai. Visibility ke liye paid listings. Koi UPI, WhatsApp, ya street vendor focus nahi.' } },
];

function ComparisonSection({ lang, t }: { lang: string; t: (en: string, hi: string) => string }) {
  const [activeWhy, setActiveWhy] = useState<string | null>(null);
  return (
    <section className="py-20 px-4 bg-gray-950 text-white">
      <div className="max-w-6xl mx-auto">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }} variants={stagger} className="text-center mb-4">
          <motion.span variants={fadeUp} className="inline-flex items-center gap-2 bg-green-900/60 border border-green-700 text-green-400 text-xs font-bold px-4 py-2 rounded-full mb-5">
            <Zap size={12} className="fill-green-400" />
            {t('The Missing Solution', 'Jo Solution Missing Tha')}
          </motion.span>
          <motion.h2 variants={fadeUp} className="text-3xl md:text-5xl font-bold leading-tight mb-4">
            {t('Built for the 4.9 Million Vendors', '4.9 Million Vendors ke liye Bana')}
            <br />
            <span className="text-green-400">{t('Others Ignore', 'Jo Baaki Ignore Karte Hain')}</span>
          </motion.h2>
          <motion.p variants={fadeUp} className="text-gray-400 text-lg max-w-2xl mx-auto">
            {t('Others solve parts of the problem. VendorVerse solves it completely.', 'Baaki platforms problem ka ek hissa solve karte hain. VendorVerse poora solve karta hai.')}
          </motion.p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
          className="my-10 bg-gradient-to-r from-green-900/40 to-emerald-900/30 border border-green-700/50 rounded-3xl p-7 max-w-3xl mx-auto text-center">
          <div className="flex justify-center mb-3">
            <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center">
              <Users size={24} className="text-white" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-green-300 mb-2">{t('The One Insight Others Missed', 'Woh Ek Insight Jo Baaki Miss Kar Gaye')}</h3>
          <p className="text-gray-300 text-base leading-relaxed">
            <span className="text-white font-bold">{t('Community onboarding instead of self-registration.', 'Self-registration ki jagah community onboarding.')}</span>
            {' '}{t("Street vendors don't come online themselves. Someone brings them online.", 'Street vendors khud online nahi aate. Koi aur unhe online laata hai.')}
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="overflow-x-auto rounded-3xl border border-gray-800">
          <table className="w-full min-w-[700px] text-sm">
            <thead>
              <tr className="bg-gray-900 border-b border-gray-800">
                <th className="text-left px-5 py-4 text-gray-400 font-semibold w-56">{t('Feature', 'Feature')}</th>
                <th className="px-4 py-4 text-center">
                  <span className="inline-flex items-center gap-1.5 bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                    <Zap size={11} className="fill-white" /> VendorVerse
                  </span>
                </th>
                {competitors.map(c => (
                  <th key={c.name} className="px-3 py-4 text-center text-gray-400 font-semibold text-xs whitespace-nowrap">{c.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {features.map((feat, fi) => (
                <tr key={fi} className={`border-b border-gray-800/60 ${fi % 2 === 0 ? 'bg-gray-900/40' : 'bg-gray-950'}`}>
                  <td className="px-5 py-3.5 text-gray-300 font-medium text-xs leading-snug">{t(feat.en, feat.hi)}</td>
                  <td className="px-4 py-3.5 text-center"><CheckCircle2 size={20} className="text-green-400 mx-auto" /></td>
                  {competitors.map(c => (
                    <td key={c.name} className="px-3 py-3.5 text-center">
                      {c.scores[fi] ? <CheckCircle2 size={18} className="text-green-500/70 mx-auto" /> : <XCircle size={18} className="text-red-500/60 mx-auto" />}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        <div className="mt-8 flex flex-wrap gap-3 justify-center">
          {competitors.map(c => (
            <motion.button key={c.name} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => setActiveWhy(activeWhy === c.name ? null : c.name)}
              className={`text-xs font-bold px-4 py-2 rounded-full border transition-all ${activeWhy === c.name ? 'bg-red-500/20 border-red-500 text-red-300' : 'border-gray-700 text-gray-400 hover:border-gray-500 hover:text-gray-200'}`}>
              {activeWhy === c.name ? '✕ ' : ''}{t(`See why ${c.name} falls short →`, `${c.name} kyun fail hota hai →`)}
            </motion.button>
          ))}
        </div>

        <AnimatePresence>
          {activeWhy && (() => {
            const comp = competitors.find(c => c.name === activeWhy);
            if (!comp) return null;
            return (
              <motion.div initial={{ opacity: 0, y: -12, height: 0 }} animate={{ opacity: 1, y: 0, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                className="mt-4 max-w-2xl mx-auto bg-gray-900 border border-red-800/50 rounded-2xl px-6 py-5 text-sm text-gray-300 leading-relaxed overflow-hidden">
                <span className="font-bold text-red-400">{comp.name}: </span>
                {lang === 'HI' ? comp.why.hi : comp.why.en}
              </motion.div>
            );
          })()}
        </AnimatePresence>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-14 text-center">
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
            <Link to="/register" className="inline-flex items-center gap-3 bg-green-500 hover:bg-green-400 text-white px-10 py-5 rounded-2xl font-bold text-lg transition-colors shadow-lg shadow-green-900/40">
              <Zap size={20} className="fill-white" />
              {t('Start Bringing Vendors Online in 30 Seconds →', 'Vendors Ko 30 Seconds Mein Online Laao →')}
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* ── Typewriter Hook ─────────────────────────────────────────── */
function useTypewriter(words: string[], lang: string) {
  const [displayed, setDisplayed] = useState('');
  const [cursor, setCursor] = useState(true);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wordsRef = useRef(words);
  wordsRef.current = words;

  useEffect(() => {
    const id = setInterval(() => setCursor(c => !c), 500);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setDisplayed('');
    let wordIdx = 0, charIdx = 0, deleting = false;
    const tick = () => {
      const word = wordsRef.current[wordIdx % wordsRef.current.length];
      if (!deleting) {
        charIdx++;
        setDisplayed(word.slice(0, charIdx));
        if (charIdx < word.length) { timerRef.current = setTimeout(tick, 60); }
        else { timerRef.current = setTimeout(() => { deleting = true; tick(); }, 1800); }
      } else {
        charIdx--;
        setDisplayed(word.slice(0, charIdx));
        if (charIdx > 0) { timerRef.current = setTimeout(tick, 35); }
        else { deleting = false; wordIdx++; timerRef.current = setTimeout(tick, 300); }
      }
    };
    timerRef.current = setTimeout(tick, 0);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [lang]);

  return { displayed, cursor };
}

/* ── Animated Counter ───────────────────────────────────────── */
function AnimatedCounter({ target, highlight }: { target: number; highlight: boolean }) {
  const [count, setCount] = useState(0);
  const prevTarget = useRef(target);
  useEffect(() => {
    const start = prevTarget.current === target ? 0 : count;
    prevTarget.current = target;
    const duration = 1500;
    const startTime = performance.now();
    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(start + (target - start) * eased));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [target]);
  return (
    <span className={`transition-colors duration-500 ${highlight ? 'text-white bg-[#F97316] px-2 rounded' : ''}`}>
      {count}
    </span>
  );
}

/* ── FAQ Item ────────────────────────────────────────────────── */
function FAQItem({ q, a, i }: { q: string; a: string; i: number }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: i * 0.07 }}
      className="border border-orange-100 rounded-2xl overflow-hidden"
    >
      <motion.button
        onClick={() => setOpen(!open)}
        whileHover={{ backgroundColor: 'rgba(249,115,22,0.05)' }}
        className="w-full flex items-center justify-between px-6 py-5 text-left font-bold text-[#1C1C1C] text-base transition-colors"
      >
        <span>{q}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25 }}>
          <ChevronDown size={20} className="text-[#F97316]" />
        </motion.div>
      </motion.button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-5 text-gray-600 text-base leading-relaxed">{a}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ── Vendor Gallery Strip ────────────────────────────────────── */
const IMAGES = {
  hero: 'https://upload.wikimedia.org/wikipedia/commons/b/b0/Street_tea-stall_in_Varanasi.jpg',
  chai: 'https://upload.wikimedia.org/wikipedia/commons/b/b0/Street_tea-stall_in_Varanasi.jpg',
  fruit: 'https://upload.wikimedia.org/wikipedia/commons/5/50/Street_vendor_selling_fruits_in_market.jpg',
  sabzi: 'https://upload.wikimedia.org/wikipedia/commons/7/70/Street_vegetable_vendor_in_India.jpg',
  streetFood: 'https://upload.wikimedia.org/wikipedia/commons/1/1b/Indian_Streetfood.JPG',
} as const;

const galleryImages = [
  { slot: IMAGES.chai, label: 'Chai Wala', sub: 'Morning ritual of millions' },
  { slot: IMAGES.fruit, label: 'Fruit Vendor', sub: 'Fresh from the farm daily' },
  { slot: IMAGES.streetFood, label: 'Street Food', sub: 'Flavours of India' },
  { slot: IMAGES.streetFood, label: 'Snack Stall', sub: 'Crispy, hot, affordable' },
  { slot: IMAGES.sabzi, label: 'Sabzi Wali', sub: 'Fresh vegetables every day' },
  { slot: IMAGES.sabzi, label: 'Street Cart', sub: 'The heart of every lane' },
];

function VendorGallery({ t }: { t: (en: string, hi: string) => string }) {
  return (
    <section className="py-16 px-4 bg-white overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }} variants={stagger} className="text-center mb-10">
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 bg-orange-50 border border-orange-200 text-orange-700 text-xs font-bold px-4 py-2 rounded-full mb-4">
            <Camera size={13} />
            {t('Real Vendors, Real Stories', 'Asli Vendors, Asli Kahaniyaan')}
          </motion.div>
          <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-bold mb-3">
            {t('The faces behind the stalls', 'Stalls ke peeche ke chehre')}
          </motion.h2>
          <motion.p variants={fadeUp} className="text-gray-500 text-lg max-w-xl mx-auto">
            {t('4.9 million vendors. Each one a story. Each one deserving to be found.', '4.9 million vendors. Har ek ki ek kahani. Har ek ko dhundha jaana chahiye.')}
          </motion.p>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-40px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {galleryImages.map((img, i) => (
            <motion.div
              key={i}
              variants={scaleIn}
              whileHover={{ scale: 1.03, zIndex: 10 }}
              transition={{ type: 'spring', stiffness: 250 }}
              className="relative rounded-2xl overflow-hidden aspect-[4/3] group cursor-pointer shadow-md"
            >
              <SmartImage src={img.slot} alt={img.label} fit="contain" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <motion.div
                initial={{ y: 8, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="absolute bottom-0 left-0 right-0 p-4"
              >
                <div className="text-white font-bold text-sm">{img.label}</div>
                <div className="text-white/70 text-xs">{img.sub}</div>
              </motion.div>
              {/* Hover overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                className="absolute inset-0 bg-[#F97316]/20 flex items-center justify-center"
              >
                <div className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                  <Star size={18} className="text-[#F97316] fill-[#F97316]" />
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mt-10">
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
            <Link to="/browse" className="inline-flex items-center gap-2 bg-[#F97316] text-white px-8 py-4 rounded-xl font-bold text-base hover:bg-orange-600 transition-colors shadow-lg shadow-orange-100">
              {t('Find Vendors Near You', 'Apne Paas Ke Vendors Dhundho')}
              <ArrowRight size={18} />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* ── Main Page ───────────────────────────────────────────────── */
export default function HomePage() {
  const { lang, t } = useLang();
  const { totalCount } = useVendors();
  const [highlightCount, setHighlightCount] = useState(false);
  const prevCount = useRef(totalCount);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  useEffect(() => {
    if (totalCount > prevCount.current) {
      setHighlightCount(true);
      setTimeout(() => setHighlightCount(false), 1500);
    }
    prevCount.current = totalCount;
  }, [totalCount]);

  const enWords = ['chai stall?', 'samosa wala?', 'momo corner?', 'sabzi vendor?', 'paan shop?', 'fruit seller?', 'street food stall?'];
  const hiWords = ['chai wala dhundh sakte ho?', 'samose wala dhundh sakte ho?', 'momo corner dhundh sakte ho?', 'sabzi wali dhundh sakte ho?', 'paan wala dhundh sakte ho?', 'fruit wala dhundh sakte ho?', 'street food stall dhundh sakte ho?'];
  const words = lang === 'HI' ? hiWords : enWords;
  const { displayed, cursor } = useTypewriter(words, lang);

  const faqsEN = [
    { q: 'Does the vendor need a smartphone?', a: "Not at all. Anyone can register on their behalf. The vendor doesn't need to do anything." },
    { q: 'Is it really free?', a: 'Yes, 100% free. No charges. Ever. VendorVerse is a community platform.' },
    { q: 'Where is the vendor data stored?', a: 'Safely in our platform database. Every submission is recorded with name, location, category, UPI, and timestamp.' },
    { q: 'What does the vendor get?', a: 'A shareable link — like vendorverse.in/raju-chai-stall — an online visiting card anyone can find and share.' },
  ];
  const faqsHI = [
    { q: 'Vendor ko smartphone chahiye?', a: 'Bilkul nahi. Koi bhi unki taraf se register kar sakta hai. Vendor ko kuch karna nahi.' },
    { q: 'Kya yeh free hai?', a: 'Haan, 100% free. Koi charge nahi. Kabhi nahi. VendorVerse ek community platform hai.' },
    { q: 'Vendor ka data kahan jaata hai?', a: 'Hamare platform database mein safely save hota hai. Har submission ka record rehta hai — naam, jagah, category, UPI, aur timestamp.' },
    { q: 'Vendor ko kya milega?', a: 'Ek shareable link — jaise vendorverse.in/raju-chai-stall — online visiting card jo koi bhi dhundh aur share kar sakta hai.' },
  ];
  const faqs = lang === 'HI' ? faqsHI : faqsEN;

  return (
    <div className="text-[#1C1C1C]">
      <title>VendorVerse — Find Street Vendors Near You</title>
      <meta name="description" content="Put any street vendor online in 2 minutes. Free. No app needed. Find chai, samosa, sabzi vendors near you." />

      {/* ── Hero with real image background ── */}
      <section ref={heroRef} className="relative min-h-[92vh] flex items-center overflow-hidden">
        {/* Parallax background image */}
        <motion.div style={{ y: heroY }} className="absolute inset-0 z-0">
          <SmartImage src={IMAGES.hero} alt="Indian street vendor" fit="cover" priority />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </motion.div>

        {/* Floating particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-[#F97316]/40"
            style={{ left: `${15 + i * 14}%`, top: `${20 + (i % 3) * 20}%` }}
            animate={{ y: [0, -20, 0], opacity: [0.4, 0.8, 0.4] }}
            transition={{ repeat: Infinity, duration: 3 + i * 0.5, delay: i * 0.4, ease: 'easeInOut' as const }}
          />
        ))}

        <motion.div style={{ opacity: heroOpacity }} className="relative z-10 max-w-5xl mx-auto px-6 py-20 w-full text-left md:text-center">
          <motion.div initial="hidden" animate="show" variants={stagger}>

            {/* Badge */}
            <motion.div variants={fadeUp} className="mb-6">
              <span className="inline-flex items-center gap-2 bg-[#F97316]/20 border border-[#F97316]/40 text-orange-300 text-xs font-bold px-4 py-2 rounded-full backdrop-blur-sm">
                <span className="w-2 h-2 bg-[#F97316] rounded-full animate-pulse" />
                {t('Live — Vendors being added right now', 'Live — Abhi vendors add ho rahe hain')}
              </span>
            </motion.div>

            {/* Headline */}
            <motion.div variants={fadeUp} className="text-[34px] md:text-[58px] font-bold leading-tight text-white mb-2">
              {t('Can you find your favourite', 'Kya aap apna favourite')}
            </motion.div>
            <motion.div variants={fadeUp} className="text-[34px] md:text-[58px] font-bold leading-tight min-h-[1.3em] mb-6">
              <span className="text-[#F97316]">{displayed}</span>
              <span className="inline-block w-[2px] bg-[#F97316] ml-1 align-middle" style={{ height: '1em', opacity: cursor ? 1 : 0 }} />
            </motion.div>

            <motion.p variants={fadeUp} className="text-lg text-white/80 max-w-2xl leading-relaxed mb-8">
              {t(
                'VendorVerse puts your neighbourhood vendors on the internet. Anyone can find them, pay them, and share their page on WhatsApp — in 2 minutes.',
                'VendorVerse aapke mohalle ke vendors ko internet pe laata hai. Koi bhi unhe dhundh sakta hai, pay kar sakta hai, aur WhatsApp pe share kar sakta hai — sirf 2 minute mein.'
              )}
            </motion.p>

            {/* CTAs */}
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 sm:justify-center">
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                <Link to="/browse" className="bg-[#F97316] text-white px-8 py-4 rounded-xl text-lg font-bold hover:bg-orange-500 transition-colors text-center block shadow-xl shadow-orange-900/30">
                  {t('Find Vendors Near Me', 'Apne Area Ke Vendor Dhundho')}
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                <Link to="/register" className="border-2 border-white/60 text-white px-8 py-4 rounded-xl text-lg font-bold hover:bg-white/10 transition-colors text-center block backdrop-blur-sm">
                  {t('Add a Vendor — Free', 'Vendor Ko Online Karo — Free')}
                </Link>
              </motion.div>
            </motion.div>

            {/* Guide banner */}
            <motion.div variants={fadeUp} className="mt-6">
              <Link to="/guide" className="group inline-flex items-center gap-3 bg-white/10 border border-white/20 hover:bg-white/20 transition-all px-5 py-3 rounded-2xl backdrop-blur-sm">
                <div className="w-8 h-8 bg-[#F97316] rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <BookOpen size={16} className="text-white" />
                </div>
                <div className="text-left">
                  <div className="text-sm font-bold text-white">{t('New here? Not sure how to use this?', 'Pehli baar? Samajh nahi aaya kaise use karein?')}</div>
                  <div className="text-xs text-white/60">{t('Read our beginner-friendly guide →', 'Hamare beginner guide ko padho →')}</div>
                </div>
                <ArrowRight size={16} className="text-white/60 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-white/50"
        >
          <ChevronDown size={28} />
        </motion.div>
      </section>

      {/* ── Live Stats Strip ── */}
      <section className="bg-[#F97316] text-white py-10 relative overflow-hidden">
        <motion.div
          animate={{ x: [0, -20, 0] }}
          transition={{ repeat: Infinity, duration: 12, ease: 'easeInOut' as const }}
          className="absolute inset-0 bg-gradient-to-r from-orange-600/0 via-orange-500/20 to-orange-600/0"
        />
        <motion.div
          initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}
          className="max-w-5xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center relative"
        >
          {[
            { val: <AnimatedCounter target={totalCount} highlight={highlightCount} />, label: t('Vendors on VendorVerse and growing', 'Vendors VendorVerse pe — aur badh rahe hain') },
            { val: '₹0', label: t('Cost to register — completely free', 'Register karne ki cost — bilkul free') },
            { val: '2 min', label: t('Time to put any vendor online', 'Kisi bhi vendor ko online karne ka time') },
          ].map((s, i) => (
            <motion.div key={i} variants={scaleIn} whileHover={{ scale: 1.05 }} className="cursor-default">
              <div className="text-5xl font-bold">{s.val}</div>
              <div className="mt-2 text-sm font-semibold opacity-90">{s.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── Real Vendor Photo Gallery ── */}
      <VendorGallery t={t} />

      {/* ── How it works ── */}
      <section className="bg-[#FFF7ED] py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-center mb-12">
            {t('How does VendorVerse work?', 'Yeh kaam kaise karta hai?')}
          </motion.h2>
          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-40px' }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                img: IMAGES.streetFood,
                icon: <ClipboardList size={32} className="text-[#F97316]" />,
                step: '1',
                en: "Fill simple details — Vendor name, location, UPI ID. That's it.",
                hi: 'Sirf details bharo — Naam, jagah, UPI ID. Bas.',
              },
              {
                img: IMAGES.hero,
                icon: <span className="text-3xl">⚡</span>,
                step: '2',
                en: 'Data is saved instantly — Profile appears on the platform immediately.',
                hi: 'Data usi waqt save hota hai — Profile turant platform pe aa jaata hai.',
              },
              {
                img: IMAGES.sabzi,
                icon: <Share2 size={32} className="text-[#F97316]" />,
                step: '3',
                en: 'Everyone can find them — Search, discover, share on WhatsApp.',
                hi: 'Sab log dhundh sakte hain — Search karo, dhundho, WhatsApp pe share karo.',
              },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                variants={fadeUp}
                whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(249,115,22,0.12)' }}
                className="bg-white rounded-2xl overflow-hidden shadow-sm transition-shadow"
              >
                <div className="relative h-40 overflow-hidden">
                  <SmartImage src={item.img} alt={`Step ${item.step}`} fit="contain" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.15, type: 'spring', stiffness: 200 }}
                    className="absolute top-3 left-3 w-9 h-9 bg-[#F97316] text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg"
                  >
                    {item.step}
                  </motion.div>
                </div>
                <div className="p-6 text-center">
                  <div className="flex justify-center mb-3">{item.icon}</div>
                  <p className="text-base text-gray-700 leading-relaxed">{t(item.en, item.hi)}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Impact Numbers ── */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-center mb-12">
            {t('Why does this matter?', 'Kyon zaroori hai yeh?')}
          </motion.h2>
          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            {[
              { val: '4,90,00,000', label: t('Vendors in India with no website', 'India mein vendors jinka koi website nahi') },
              { val: '₹0', label: t('Cost to create a vendor profile', 'Vendor profile banane ki cost') },
              { val: '2 min', label: t('Time to put any vendor online', 'Kisi bhi vendor ko online karne ka time') },
            ].map((s, i) => (
              <motion.div key={i} variants={scaleIn} whileHover={{ scale: 1.05 }} className="cursor-default">
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12, type: 'spring', stiffness: 150 }}
                  className="text-4xl md:text-5xl font-bold text-[#F97316]"
                >
                  {s.val}
                </motion.div>
                <div className="mt-3 text-gray-600">{s.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Raju Example ── */}
      <section className="bg-[#FFF7ED] py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }}
            variants={stagger}
            className="flex flex-col md:flex-row items-center gap-12"
          >
            {/* Text side */}
            <motion.div variants={slideLeft} className="flex-1 text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {t("For example — Raju's chai stall", "For example — Raju bhaiya ki chai")}
              </h2>
              <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                {t(
                  "Raju has been making chai near Alpha 1 Metro for 11 years. No one outside the lane could find him online. VendorVerse changed that in 2 minutes.",
                  "Raju bhaiya 11 saalon se Alpha 1 Metro ke paas chai bana rahe hain. Bahar ka koi unhe online nahi dhundh sakta tha. VendorVerse ne yeh 2 minute mein badal diya."
                )}
              </p>
              <div className="flex flex-col gap-3">
                {[
                  t('Profile visible to anyone in Greater Noida', 'Greater Noida mein koi bhi profile dekh sakta hai'),
                  t('UPI ID on the profile — direct payments', 'Profile pe UPI ID — seedha payment'),
                  t('WhatsApp button for instant contact', 'WhatsApp button se turant contact'),
                ].map((point, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-3 text-gray-700"
                  >
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 size={14} className="text-green-600" />
                    </div>
                    <span className="text-sm font-medium">{point}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Phone card */}
            <motion.div
              variants={scaleIn}
              whileHover={{ rotate: 1, scale: 1.02 }}
              className="flex-shrink-0"
            >
              <div className="bg-white rounded-3xl shadow-2xl border-4 border-gray-200 p-6 max-w-sm w-full text-left">
                <div className="flex items-center gap-3 mb-4">
                  <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ repeat: Infinity, duration: 3 }}
                    className="w-14 h-14 rounded-full bg-[#F97316] flex items-center justify-center text-white font-bold text-xl shadow-lg"
                  >
                    RC
                  </motion.div>
                  <div>
                    <div className="font-bold text-lg text-[#1C1C1C]">Raju's Chai Stall</div>
                    <span className="bg-orange-100 text-[#F97316] text-xs font-semibold px-2 py-0.5 rounded-full">Chai & Snacks</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 mb-1">
                  <span className="text-yellow-400">★★★★★</span>
                  <span className="font-bold text-sm">4.8</span>
                  <span className="text-gray-500 text-sm">· 92 reviews</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-600 mb-3">
                  <MapPin size={14} className="text-[#F97316]" />
                  Near Alpha 1 Metro Gate 2
                </div>
                <div className="text-sm text-gray-700 mb-3 space-y-1">
                  <div>🍵 Chai — <span className="font-bold text-[#F97316]">₹10</span></div>
                  <div>🥟 Samosa — <span className="font-bold text-[#F97316]">₹20</span></div>
                </div>
                <div className="text-xs text-gray-500 mb-3">UPI: raju.chai@paytm</div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    Open Now
                  </span>
                </div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                  <Link to="/raju-chai-stall" className="block w-full bg-[#F97316] text-white text-center py-3 rounded-xl font-bold text-sm hover:bg-orange-600 transition-colors shadow-md shadow-orange-100">
                    {t('View Full Profile', 'Poori Profile Dekho')}
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Anti-Fake Trust Banner ── */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="py-10 px-4 bg-gray-950 text-white"
      >
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ repeat: Infinity, duration: 4 }}
            className="w-16 h-16 bg-green-500/20 border border-green-500/30 rounded-2xl flex items-center justify-center flex-shrink-0"
          >
            <Shield size={32} className="text-green-400" />
          </motion.div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white mb-1">{t('Anti-Fake Protection Built In', 'Anti-Fake Protection Built In')}</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              {t(
                'Every registration is scanned by our Anti-Fake Shield — detecting spam names, gibberish, bot submissions, and duplicate entries before they go live.',
                'Har registration hamare Anti-Fake Shield se scan hoti hai — spam names, gibberish, bot submissions, aur duplicate entries live hone se pehle detect hote hain.'
              )}
            </p>
          </div>
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
            <Link to="/register" className="flex-shrink-0 bg-green-500 hover:bg-green-400 text-white px-6 py-3 rounded-xl font-bold text-sm transition-colors whitespace-nowrap">
              {t('Register a Vendor', 'Vendor Register Karo')}
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* ── Comparison Section ── */}
      <ComparisonSection lang={lang} t={t} />

      {/* ── FAQ ── */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-center mb-10">
            {t('Your questions — our answers', 'Aapke sawaal — hamare jawab')}
          </motion.h2>
          <div className="flex flex-col gap-4">
            {faqs.map((faq, i) => <FAQItem key={i} q={faq.q} a={faq.a} i={i} />)}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="relative py-20 px-4 text-center text-white overflow-hidden">
        <div className="absolute inset-0">
          <SmartImage src={IMAGES.hero} alt="" fit="cover" />
          <div className="absolute inset-0 bg-[#F97316]/90" />
        </div>
        <motion.div
          initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}
          className="max-w-3xl mx-auto relative"
        >
          <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-bold mb-4">
            {t('Put your neighbourhood vendor online today.', 'Aaj hi apne mohalle ke vendor ko online karo.')}
          </motion.h2>
          <motion.p variants={fadeUp} className="text-lg opacity-90 mb-8">
            {t('Free. 2 minutes. No app needed.', 'Free. 2 minute. Koi app nahi chahiye.')}
          </motion.p>
          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/register" className="bg-white text-[#F97316] px-10 py-4 rounded-xl text-lg font-bold hover:bg-orange-50 transition-colors inline-block shadow-xl">
                {t('Add a Vendor Now', 'Abhi Vendor Add Karo')}
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/browse" className="border-2 border-white/60 text-white px-10 py-4 rounded-xl text-lg font-bold hover:bg-white/10 transition-colors inline-block">
                {t('Browse Vendors', 'Vendors Dekho')}
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}
