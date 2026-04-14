import { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useLang } from '@/context/LanguageContext';
import { useVendors } from '@/context/VendorContext';
import {
  CheckCircle, Shield, Clock, Smartphone, Plus, Trash2, Star,
  MessageSquare, Camera, Upload, X, AlertTriangle, ShieldCheck,
  ShieldAlert, ShieldX, Zap, MapPin, User,
  CreditCard, Phone, ChevronRight, Sparkles, Lock,
} from 'lucide-react';
import { detectFakeVendor, recordSubmission, type VendorFormSnapshot } from '@/lib/antiFakeDetection';

/* ── animation variants ─────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };
const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.35, ease: 'backOut' as const } },
};

/* ── types ──────────────────────────────────────────────────── */
interface MenuItem { name: string; price: string; }
interface CustomerReview { reviewer: string; rating: number; comment: string; }
interface FormData {
  vendor_name: string; what_they_sell: string; location: string;
  hours: string; category: string; upi_id: string;
  whatsapp_number: string; registered_by: string;
}
interface FormErrors {
  vendor_name?: string; what_they_sell?: string; location?: string;
  hours?: string; category?: string; registered_by?: string;
}
interface SuccessData {
  id: string; vendor_name: string; category: string;
  location: string; registered_by: string; submission_timestamp: string;
}

/* ── Shield badge component ─────────────────────────────────── */
function ShieldBadge({ score, flags, passed, show }: {
  score: number; flags: string[]; passed: string[]; show: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const level = score >= 60 ? 'blocked' : score >= 30 ? 'warning' : 'safe';

  const config = {
    safe: { icon: <ShieldCheck size={18} />, label: 'Looks Genuine', bg: 'bg-green-50 border-green-200', text: 'text-green-700', bar: 'bg-green-500' },
    warning: { icon: <ShieldAlert size={18} />, label: 'Needs Review', bg: 'bg-yellow-50 border-yellow-200', text: 'text-yellow-700', bar: 'bg-yellow-400' },
    blocked: { icon: <ShieldX size={18} />, label: 'Suspicious Entry', bg: 'bg-red-50 border-red-300', text: 'text-red-700', bar: 'bg-red-500' },
  }[level];

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -12, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.35, ease: 'easeOut' as const }}
          className={`rounded-2xl border-2 p-4 mb-6 ${config.bg}`}
        >
          <div className="flex items-center justify-between cursor-pointer" onClick={() => setExpanded(e => !e)}>
            <div className="flex items-center gap-2">
              <span className={config.text}>{config.icon}</span>
              <span className={`font-bold text-sm ${config.text}`}>
                Anti-Fake Shield: {config.label}
              </span>
              <span className={`text-xs font-mono px-2 py-0.5 rounded-full ${config.text} bg-white/60`}>
                Risk {score}/100
              </span>
            </div>
            <motion.div animate={{ rotate: expanded ? 90 : 0 }} className={config.text}>
              <ChevronRight size={16} />
            </motion.div>
          </div>

          {/* Score bar */}
          <div className="mt-3 h-1.5 bg-white/60 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${score}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' as const }}
              className={`h-full rounded-full ${config.bar}`}
            />
          </div>

          {/* Expanded details */}
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="mt-4 space-y-2">
                  {flags.map((f, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-red-700">
                      <AlertTriangle size={12} className="mt-0.5 flex-shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                  {passed.map((p, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-green-700">
                      <CheckCircle size={12} className="mt-0.5 flex-shrink-0" />
                      <span>{p}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ── Photo Upload component ─────────────────────────────────── */
function PhotoUpload({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);

  const processFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return;
    setLoading(true);
    const reader = new FileReader();
    reader.onload = e => {
      onChange(e.target?.result as string);
      setLoading(false);
    };
    reader.readAsDataURL(file);
  }, [onChange]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  return (
    <div className="mb-6">
      <label className="block font-bold mb-2 text-base flex items-center gap-2">
        <Camera size={18} className="text-[#F97316]" />
        Vendor Photo <span className="text-gray-400 font-normal text-sm">(Optional — adds credibility)</span>
      </label>

      {value ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative rounded-2xl overflow-hidden border-2 border-green-300 shadow-lg"
        >
          <img src={value} alt="Vendor" className="w-full h-48 object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <div className="absolute bottom-3 left-3 flex items-center gap-2 text-white text-sm font-bold">
            <ShieldCheck size={16} className="text-green-400" />
            Photo uploaded — credibility boosted!
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            type="button"
            onClick={() => onChange('')}
            className="absolute top-3 right-3 w-8 h-8 bg-black/50 hover:bg-red-500 text-white rounded-full flex items-center justify-center transition-colors"
          >
            <X size={14} />
          </motion.button>
        </motion.div>
      ) : (
        <motion.div
          whileHover={{ scale: 1.01 }}
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileRef.current?.click()}
          className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
            dragging ? 'border-[#F97316] bg-orange-50 scale-[1.01]' : 'border-gray-200 hover:border-orange-300 hover:bg-orange-50/50'
          }`}
        >
          {loading ? (
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' as const }}>
              <Upload size={32} className="text-[#F97316] mx-auto" />
            </motion.div>
          ) : (
            <>
              <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' as const }}
              >
                <Camera size={36} className="text-gray-300 mx-auto mb-3" />
              </motion.div>
              <p className="font-semibold text-gray-600 text-sm">Click or drag a photo here</p>
              <p className="text-xs text-gray-400 mt-1">JPG, PNG — photo of the vendor or their stall</p>
              <div className="flex items-center justify-center gap-1.5 mt-3 text-xs text-green-600 font-semibold">
                <ShieldCheck size={12} />
                Reduces fake-detection risk score
              </div>
            </>
          )}
        </motion.div>
      )}
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) processFile(f); }} />
    </div>
  );
}

/* ── Main component ─────────────────────────────────────────── */
export default function RegisterPage() {
  const { t } = useLang();
  const { addVendor } = useVendors();
  const formStartTime = useRef(Date.now());

  const [form, setForm] = useState<FormData>({
    vendor_name: '', what_they_sell: '', location: '', hours: '',
    category: '', upi_id: '', whatsapp_number: '', registered_by: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<SuccessData | null>(null);
  const [photoUrl, setPhotoUrl] = useState('');
  const [menuItems, setMenuItems] = useState<MenuItem[]>([{ name: '', price: '' }]);
  const [reviews, setReviews] = useState<CustomerReview[]>([{ reviewer: '', rating: 5, comment: '' }]);

  // Anti-fake live analysis
  const [fakeResult, setFakeResult] = useState<ReturnType<typeof detectFakeVendor> | null>(null);
  const [showShield, setShowShield] = useState(false);
  const [blockedAttempt, setBlockedAttempt] = useState(false);

  // Run detection whenever key fields change
  useEffect(() => {
    if (!form.vendor_name && !form.location) return;
    const snapshot: VendorFormSnapshot = {
      vendor_name: form.vendor_name,
      what_they_sell: form.what_they_sell,
      location: form.location,
      hours: form.hours,
      registered_by: form.registered_by,
      upi_id: form.upi_id,
      whatsapp_number: form.whatsapp_number,
      photo_url: photoUrl || undefined,
    };
    const result = detectFakeVendor(snapshot);
    setFakeResult(result);
    setShowShield(form.vendor_name.length > 2 || form.location.length > 2);
  }, [form.vendor_name, form.location, form.what_they_sell, form.registered_by, form.upi_id, form.whatsapp_number, photoUrl]);

  const errMsg = t('Please fill this field', 'Yeh field zaroor bharo');

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!form.vendor_name.trim()) e.vendor_name = errMsg;
    if (!form.what_they_sell.trim()) e.what_they_sell = errMsg;
    if (!form.location.trim()) e.location = errMsg;
    if (!form.hours.trim()) e.hours = errMsg;
    if (!form.category) e.category = errMsg;
    if (!form.registered_by.trim()) e.registered_by = errMsg;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // Anti-fake: block if score too high
    const timeToFill = Math.floor((Date.now() - formStartTime.current) / 1000);
    const snapshot: VendorFormSnapshot = {
      vendor_name: form.vendor_name,
      what_they_sell: form.what_they_sell,
      location: form.location,
      hours: form.hours,
      registered_by: form.registered_by,
      upi_id: form.upi_id,
      whatsapp_number: form.whatsapp_number,
      photo_url: photoUrl || undefined,
      timeToFillSeconds: timeToFill,
    };
    const result = detectFakeVendor(snapshot);
    setFakeResult(result);
    setShowShield(true);

    if (result.level === 'blocked') {
      setBlockedAttempt(true);
      setTimeout(() => setBlockedAttempt(false), 5000);
      return;
    }

    setSubmitting(true);
    try {
      const filledMenu = menuItems.filter(m => m.name.trim());
      const menuString = filledMenu.length > 0
        ? filledMenu.map(m => m.price.trim() ? `${m.name} (₹${m.price})` : m.name).join(', ')
        : form.what_they_sell;

      const vendor = await addVendor({
        vendor_name: form.vendor_name,
        what_they_sell: menuString || form.what_they_sell,
        location: form.location,
        hours: form.hours,
        category: form.category,
        upi_id: form.upi_id || undefined,
        whatsapp_number: form.whatsapp_number || undefined,
        registered_by: form.registered_by,
        ...(photoUrl ? { photo_url: photoUrl } : {}),
      } as Parameters<typeof addVendor>[0]);

      recordSubmission();
      setSuccess({
        id: vendor.id, vendor_name: vendor.vendor_name,
        category: vendor.category, location: vendor.location,
        registered_by: vendor.registered_by, submission_timestamp: vendor.submission_timestamp,
      });
    } catch {
      alert('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setForm({ vendor_name: '', what_they_sell: '', location: '', hours: '', category: '', upi_id: '', whatsapp_number: '', registered_by: '' });
    setErrors({}); setSuccess(null); setPhotoUrl('');
    setMenuItems([{ name: '', price: '' }]);
    setReviews([{ reviewer: '', rating: 5, comment: '' }]);
    setFakeResult(null); setShowShield(false);
    formStartTime.current = Date.now();
  };

  const inputClass = (field: keyof FormErrors) =>
    `w-full border-2 rounded-xl px-4 py-3 text-base focus:outline-none focus:border-[#F97316] transition-all duration-200 ${errors[field] ? 'border-red-400 bg-red-50' : 'border-gray-200 hover:border-gray-300'}`;

  const categories = [
    { en: 'Chai & Snacks', hi: 'Chai & Snacks' },
    { en: 'Street Food', hi: 'Street Food' },
    { en: 'Sabzi & Fruits', hi: 'Sabzi & Fruits' },
    { en: 'Paan & More', hi: 'Paan & More' },
    { en: 'Other', hi: 'Other' },
  ];

  const addMenuItem = () => setMenuItems(prev => [...prev, { name: '', price: '' }]);
  const removeMenuItem = (i: number) => setMenuItems(prev => prev.filter((_, idx) => idx !== i));
  const updateMenuItem = (i: number, field: keyof MenuItem, val: string) =>
    setMenuItems(prev => prev.map((m, idx) => idx === i ? { ...m, [field]: val } : m));

  const addReview = () => setReviews(prev => [...prev, { reviewer: '', rating: 5, comment: '' }]);
  const removeReview = (i: number) => setReviews(prev => prev.filter((_, idx) => idx !== i));
  const updateReview = (i: number, field: keyof CustomerReview, val: string | number) =>
    setReviews(prev => prev.map((r, idx) => idx === i ? { ...r, [field]: val } : r));

  /* ── Success screen ── */
  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-white py-16 px-4"
      >
        <div className="max-w-xl mx-auto text-center">
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="flex justify-center mb-6"
          >
            <div className="w-28 h-28 bg-green-100 rounded-full flex items-center justify-center shadow-xl shadow-green-100">
              <CheckCircle size={64} className="text-green-500" />
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <h1 className="text-3xl md:text-4xl font-bold text-[#1C1C1C] mb-3">
              {t('Done! Vendor registered successfully.', 'Ho gaya! Vendor successfully register ho gaya.')}
            </h1>
            <p className="text-gray-600 text-lg mb-8">
              {t(
                'This vendor now has their own profile page on VendorVerse. Share it with everyone!',
                'Is vendor ka ab apna profile page hai VendorVerse pe. Sabko share karo!'
              )}
            </p>
          </motion.div>

          {photoUrl && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="mb-6 rounded-2xl overflow-hidden shadow-xl"
            >
              <img src={photoUrl} alt={success.vendor_name} className="w-full h-40 object-cover" />
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="bg-[#FFF7ED] border-2 border-[#F97316] rounded-2xl p-6 text-left mb-8"
          >
            <div className="text-sm text-gray-500 mb-3 font-semibold uppercase tracking-wide">
              {t('Vendor Summary', 'Vendor Summary')}
            </div>
            <div className="space-y-2">
              <div><span className="font-bold">{t('Name:', 'Naam:')}</span> {success.vendor_name}</div>
              <div><span className="font-bold">{t('Category:', 'Category:')}</span> {success.category}</div>
              <div><span className="font-bold">{t('Location:', 'Jagah:')}</span> {success.location}</div>
              <div><span className="font-bold">{t('Registered by:', 'Register kiya:')}</span> {success.registered_by}</div>
              <div><span className="font-bold">{t('Time:', 'Time:')}</span> <span className="text-[#F97316] font-bold">{t('Just now', 'Abhi abhi')}</span></div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="flex flex-col gap-4"
          >
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
              <Link
                to={`/vendor/${success.id}`}
                className="w-full bg-[#F97316] text-white py-4 rounded-xl font-bold text-lg hover:bg-orange-600 transition-colors text-center flex items-center justify-center gap-2 shadow-lg shadow-orange-200"
              >
                🎉 {t('View Their Profile Page →', 'Unka Profile Page Dekho →')}
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.97 }}>
              <Link to="/browse" className="w-full border-2 border-[#F97316] text-[#F97316] py-4 rounded-xl font-bold text-lg hover:bg-orange-50 transition-colors text-center block">
                {t('Browse All Vendors', 'Sabhi Vendors Dekho')}
              </Link>
            </motion.div>
            <button onClick={resetForm} className="w-full border-2 border-gray-200 text-gray-600 py-4 rounded-xl font-bold text-lg hover:bg-gray-50 transition-colors">
              {t('Register Another Vendor', 'Ek Aur Vendor Register Karo')}
            </button>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="text-[#1C1C1C]">
      <title>Register a Vendor — VendorVerse</title>
      <meta name="description" content="Put any street vendor online in 2 minutes. Free, no app needed." />

      {/* ── Blocked attempt toast ── */}
      <AnimatePresence>
        {blockedAttempt && (
          <motion.div
            initial={{ opacity: 0, y: -60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -60 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-red-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 max-w-sm w-full mx-4"
          >
            <ShieldX size={22} className="flex-shrink-0" />
            <div>
              <div className="font-bold text-sm">Submission Blocked</div>
              <div className="text-xs opacity-90">This entry looks suspicious. Please fill in real details.</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Hero header ── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#FFF7ED] via-orange-50 to-amber-50 py-14 px-4 text-center">
        {/* Floating orbs */}
        <motion.div animate={{ y: [0, -12, 0], x: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 7, ease: 'easeInOut' as const }}
          className="absolute top-8 left-12 w-20 h-20 rounded-full bg-orange-200/40 blur-xl" />
        <motion.div animate={{ y: [0, 10, 0], x: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 9, ease: 'easeInOut' as const, delay: 2 }}
          className="absolute bottom-4 right-16 w-28 h-28 rounded-full bg-amber-200/50 blur-xl" />

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="inline-flex items-center gap-2 bg-white/80 border border-orange-200 text-orange-700 text-xs font-bold px-4 py-2 rounded-full mb-4 shadow-sm">
            <Sparkles size={13} />
            Free · 2 Minutes · No App Needed
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-3">
            {t('Put your vendor online', 'Apne vendor ko online karo')}
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            {t(
              "Free. Takes 2 minutes. The vendor doesn't need to do anything — you can do it on their behalf.",
              "Free hai. 2 minute lagenge. Vendor ko kuch karna nahi — aap unki taraf se kar sakte ho."
            )}
          </p>
        </motion.div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-12">

        {/* ── Reassurance boxes ── */}
        <motion.div
          variants={stagger} initial="hidden" animate="show"
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10"
        >
          {[
            { icon: <Shield size={24} className="text-[#F97316]" />, en: 'Completely Free', hi: 'Bilkul Free', sub_en: 'No charge, ever.', sub_hi: 'Koi charge nahi.' },
            { icon: <Clock size={24} className="text-[#F97316]" />, en: 'Only 2 Minutes', hi: 'Sirf 2 Minute', sub_en: 'Just 6 fields.', sub_hi: 'Bas 6 fields.' },
            { icon: <Smartphone size={24} className="text-[#F97316]" />, en: 'No Smartphone Needed', hi: 'Phone Nahi Chahiye', sub_en: 'Do it on their behalf.', sub_hi: 'Unki taraf se karo.' },
          ].map((box, i) => (
            <motion.div
              key={i} variants={scaleIn}
              whileHover={{ y: -4, scale: 1.03 }}
              className="bg-[#FFF7ED] rounded-2xl p-5 text-center border border-orange-100 cursor-default"
            >
              <div className="flex justify-center mb-2">{box.icon}</div>
              <div className="font-bold text-sm">{t(box.en, box.hi)}</div>
              <div className="text-xs text-gray-500 mt-1">{t(box.sub_en, box.sub_hi)}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* ── Anti-fake shield live indicator ── */}
        {fakeResult && (
          <ShieldBadge
            score={fakeResult.score}
            flags={fakeResult.flags}
            passed={fakeResult.passed}
            show={showShield}
          />
        )}

        {/* ── Form ── */}
        <motion.form
          variants={stagger} initial="hidden" animate="show"
          onSubmit={handleSubmit}
          className="flex flex-col gap-6"
          noValidate
        >

          {/* Photo Upload */}
          <motion.div variants={fadeUp}>
            <PhotoUpload value={photoUrl} onChange={setPhotoUrl} />
          </motion.div>

          {/* F1 Vendor Name */}
          <motion.div variants={fadeUp}>
            <label className="block font-bold mb-2 text-base flex items-center gap-2">
              <User size={16} className="text-[#F97316]" />
              {t("Vendor's name", "Vendor ka naam")} <span className="text-red-500">*</span>
            </label>
            <input
              className={inputClass('vendor_name')}
              placeholder={t("Example: Raju's Chai Stall", "Jaise: Raju's Chai Stall")}
              value={form.vendor_name}
              onChange={e => { setForm(f => ({ ...f, vendor_name: e.target.value })); setErrors(er => ({ ...er, vendor_name: undefined })); }}
            />
            <AnimatePresence>
              {errors.vendor_name && (
                <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertTriangle size={12} /> {errors.vendor_name}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>

          {/* F2 What they sell */}
          <motion.div variants={fadeUp}>
            <label className="block font-bold mb-2 text-base flex items-center gap-2">
              <Zap size={16} className="text-[#F97316]" />
              {t('What do they sell?', 'Woh kya bechte hain?')} <span className="text-red-500">*</span>
            </label>
            <input
              className={inputClass('what_they_sell')}
              placeholder={t('Example: Chai, samosa, bun maska', 'Jaise: Chai, samosa, bun maska')}
              value={form.what_they_sell}
              onChange={e => { setForm(f => ({ ...f, what_they_sell: e.target.value })); setErrors(er => ({ ...er, what_they_sell: undefined })); }}
            />
            <AnimatePresence>
              {errors.what_they_sell && (
                <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertTriangle size={12} /> {errors.what_they_sell}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>

          {/* ── Menu Items with Prices ── */}
          <motion.div variants={fadeUp} className="bg-orange-50 border-2 border-orange-100 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-[#F97316] rounded-xl flex items-center justify-center">
                <Star size={16} className="text-white fill-white" />
              </div>
              <div>
                <div className="font-bold text-base">{t('Menu Items & Prices', 'Menu Items aur Daam')} <span className="text-gray-400 font-normal text-sm">({t('Optional', 'Optional')})</span></div>
                <div className="text-xs text-gray-500">{t('Add items with prices — this becomes their menu on the profile page.', 'Items aur daam add karo — yeh profile page pe menu ban jaata hai.')}</div>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <AnimatePresence>
                {menuItems.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 16, height: 0 }}
                    transition={{ duration: 0.25 }}
                    className="flex items-center gap-2"
                  >
                    <input
                      className="flex-1 border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#F97316] transition-colors bg-white"
                      placeholder={t('Item name (e.g. Chai)', 'Item ka naam (jaise Chai)')}
                      value={item.name}
                      onChange={e => updateMenuItem(i, 'name', e.target.value)}
                    />
                    <div className="relative w-28 flex-shrink-0">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">₹</span>
                      <input
                        className="w-full border-2 border-gray-200 rounded-xl pl-7 pr-3 py-2.5 text-sm focus:outline-none focus:border-[#F97316] transition-colors bg-white"
                        placeholder={t('Price', 'Daam')}
                        value={item.price}
                        onChange={e => updateMenuItem(i, 'price', e.target.value.replace(/[^0-9]/g, ''))}
                      />
                    </div>
                    {menuItems.length > 1 && (
                      <motion.button whileTap={{ scale: 0.85 }} type="button" onClick={() => removeMenuItem(i)} className="text-red-400 hover:text-red-600 transition-colors p-1 flex-shrink-0">
                        <Trash2 size={16} />
                      </motion.button>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            <motion.button whileHover={{ x: 4 }} type="button" onClick={addMenuItem}
              className="mt-3 flex items-center gap-2 text-[#F97316] font-bold text-sm hover:text-orange-600 transition-colors">
              <Plus size={16} />
              {t('Add another item', 'Ek aur item add karo')}
            </motion.button>
          </motion.div>

          {/* F3 Location */}
          <motion.div variants={fadeUp}>
            <label className="block font-bold mb-2 text-base flex items-center gap-2">
              <MapPin size={16} className="text-[#F97316]" />
              {t('Where are they? Write any landmark.', 'Kahan milte hain? Koi bhi landmark.')} <span className="text-red-500">*</span>
            </label>
            <input
              className={inputClass('location')}
              placeholder={t('Example: Opposite Alpha 1 Metro Gate 2, Greater Noida', 'Jaise: Alpha 1 Metro Gate 2 ke samne')}
              value={form.location}
              onChange={e => { setForm(f => ({ ...f, location: e.target.value })); setErrors(er => ({ ...er, location: undefined })); }}
            />
            <AnimatePresence>
              {errors.location && (
                <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertTriangle size={12} /> {errors.location}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>

          {/* F4 Hours */}
          <motion.div variants={fadeUp}>
            <label className="block font-bold mb-2 text-base flex items-center gap-2">
              <Clock size={16} className="text-[#F97316]" />
              {t('Opening hours', 'Kab se kab tak khulte hain?')} <span className="text-red-500">*</span>
            </label>
            <input
              className={inputClass('hours')}
              placeholder={t('Example: 6 AM to 10 PM daily', 'Jaise: Subah 6 baje se raat 10 baje tak')}
              value={form.hours}
              onChange={e => { setForm(f => ({ ...f, hours: e.target.value })); setErrors(er => ({ ...er, hours: undefined })); }}
            />
            <AnimatePresence>
              {errors.hours && (
                <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertTriangle size={12} /> {errors.hours}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>

          {/* F5 Category */}
          <motion.div variants={fadeUp}>
            <label className="block font-bold mb-2 text-base flex items-center gap-2">
              <Sparkles size={16} className="text-[#F97316]" />
              {t('Category', 'Category')} <span className="text-red-500">*</span>
            </label>
            <select
              className={`${inputClass('category')} bg-white`}
              value={form.category}
              onChange={e => { setForm(f => ({ ...f, category: e.target.value })); setErrors(er => ({ ...er, category: undefined })); }}
            >
              <option value="">{t('Select a category', 'Category chuniye')}</option>
              {categories.map(c => (
                <option key={c.en} value={c.en}>{t(c.en, c.hi)}</option>
              ))}
            </select>
            <AnimatePresence>
              {errors.category && (
                <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertTriangle size={12} /> {errors.category}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>

          {/* F6 UPI */}
          <motion.div variants={fadeUp}>
            <label className="block font-bold mb-2 text-base flex items-center gap-2">
              <CreditCard size={16} className="text-[#F97316]" />
              {t('UPI ID — if you know it (Optional)', 'UPI ID — agar pata ho')}
            </label>
            <input
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-base focus:outline-none focus:border-[#F97316] transition-all hover:border-gray-300"
              placeholder={t('Example: raju.chai@paytm', 'Jaise: raju.chai@paytm')}
              value={form.upi_id}
              onChange={e => setForm(f => ({ ...f, upi_id: e.target.value }))}
            />
          </motion.div>

          {/* F7 WhatsApp */}
          <motion.div variants={fadeUp}>
            <label className="block font-bold mb-2 text-base flex items-center gap-2">
              <Phone size={16} className="text-[#F97316]" />
              {t('WhatsApp number — if you know it (Optional)', 'WhatsApp number — agar pata ho')}
            </label>
            <input
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-base focus:outline-none focus:border-[#F97316] transition-all hover:border-gray-300"
              placeholder={t('Example: 98XXXXXXXX', 'Jaise: 98XXXXXXXX')}
              value={form.whatsapp_number}
              onChange={e => setForm(f => ({ ...f, whatsapp_number: e.target.value }))}
            />
          </motion.div>

          {/* ── Customer Reviews ── */}
          <motion.div variants={fadeUp} className="bg-blue-50 border-2 border-blue-100 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-blue-500 rounded-xl flex items-center justify-center">
                <MessageSquare size={16} className="text-white" />
              </div>
              <div>
                <div className="font-bold text-base">{t('Customer Reviews', 'Customer Reviews')} <span className="text-gray-400 font-normal text-sm">({t('Optional', 'Optional')})</span></div>
                <div className="text-xs text-gray-500">{t("Add real feedback from customers — shown on the vendor's profile.", 'Customers ke real feedback add karo — vendor ke profile pe dikhega.')}</div>
              </div>
            </div>
            <div className="flex flex-col gap-5">
              <AnimatePresence>
                {reviews.map((rev, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-white rounded-2xl border border-blue-100 p-4 relative"
                  >
                    {reviews.length > 1 && (
                      <motion.button whileTap={{ scale: 0.85 }} type="button" onClick={() => removeReview(i)}
                        className="absolute top-3 right-3 text-red-400 hover:text-red-600 transition-colors">
                        <Trash2 size={15} />
                      </motion.button>
                    )}
                    <input
                      className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400 transition-colors mb-3"
                      placeholder={t('Reviewer name (e.g. Priya, GL Bajaj student)', 'Reviewer ka naam (jaise Priya, GL Bajaj student)')}
                      value={rev.reviewer}
                      onChange={e => updateReview(i, 'reviewer', e.target.value)}
                    />
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-sm text-gray-500 font-medium">{t('Rating:', 'Rating:')}</span>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map(star => (
                          <motion.button key={star} type="button" whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}
                            onClick={() => updateReview(i, 'rating', star)}>
                            <Star size={22} className={star <= rev.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} />
                          </motion.button>
                        ))}
                      </div>
                      <span className="text-sm font-bold text-gray-600">{rev.rating}/5</span>
                    </div>
                    <textarea
                      className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400 transition-colors resize-none"
                      rows={2}
                      placeholder={t('Their feedback (e.g. "Best chai in Greater Noida! Always fresh.")', 'Unka feedback (jaise "Sabse acchi chai! Hamesha fresh.")')}
                      value={rev.comment}
                      onChange={e => updateReview(i, 'comment', e.target.value)}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            <motion.button whileHover={{ x: 4 }} type="button" onClick={addReview}
              className="mt-3 flex items-center gap-2 text-blue-500 font-bold text-sm hover:text-blue-700 transition-colors">
              <Plus size={16} />
              {t('Add another review', 'Ek aur review add karo')}
            </motion.button>
          </motion.div>

          {/* F8 Registered by */}
          <motion.div variants={fadeUp}>
            <label className="block font-bold mb-2 text-base flex items-center gap-2">
              <User size={16} className="text-[#F97316]" />
              {t('Your name — who is registering this vendor?', 'Aapka naam — aap kaun register kar rahe ho?')} <span className="text-red-500">*</span>
            </label>
            <input
              className={inputClass('registered_by')}
              placeholder={t('Example: Rohit, GL Bajaj student', 'Jaise: Rohit, GL Bajaj student')}
              value={form.registered_by}
              onChange={e => { setForm(f => ({ ...f, registered_by: e.target.value })); setErrors(er => ({ ...er, registered_by: undefined })); }}
            />
            <AnimatePresence>
              {errors.registered_by && (
                <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertTriangle size={12} /> {errors.registered_by}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Anti-fake notice */}
          <motion.div variants={fadeUp} className="flex items-start gap-3 bg-gray-50 border border-gray-200 rounded-xl p-4">
            <Lock size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-gray-500 leading-relaxed">
              <span className="font-bold text-gray-600">Anti-Fake Protection Active.</span>{' '}
              VendorVerse uses automated checks to prevent fake or spam registrations. Suspicious entries are blocked before submission.
              {fakeResult && fakeResult.level !== 'safe' && (
                <span className="text-yellow-600 font-semibold"> Your entry has {fakeResult.flags.length} flag(s) — please review above.</span>
              )}
            </p>
          </motion.div>

          {/* Submit button */}
          <motion.div variants={fadeUp}>
            <motion.button
              type="submit"
              disabled={submitting || (fakeResult?.level === 'blocked')}
              whileHover={submitting || fakeResult?.level === 'blocked' ? {} : { scale: 1.02 }}
              whileTap={submitting || fakeResult?.level === 'blocked' ? {} : { scale: 0.97 }}
              className={`w-full py-5 rounded-xl font-bold text-xl transition-all mt-2 shadow-lg ${
                fakeResult?.level === 'blocked'
                  ? 'bg-red-400 text-white cursor-not-allowed shadow-red-100'
                  : fakeResult?.level === 'warning'
                  ? 'bg-yellow-500 text-white hover:bg-yellow-600 shadow-yellow-100'
                  : 'bg-[#F97316] text-white hover:bg-orange-600 shadow-orange-200'
              } disabled:opacity-60 disabled:cursor-not-allowed`}
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' as const }}>
                    <Zap size={20} />
                  </motion.div>
                  {t('Registering...', 'Register ho raha hai...')}
                </span>
              ) : fakeResult?.level === 'blocked' ? (
                <span className="flex items-center justify-center gap-2">
                  <ShieldX size={20} />
                  Blocked — Entry Looks Suspicious
                </span>
              ) : fakeResult?.level === 'warning' ? (
                <span className="flex items-center justify-center gap-2">
                  <ShieldAlert size={20} />
                  {t('Submit Anyway (Flagged)', 'Submit Karo (Flagged)')}
                </span>
              ) : (
                t('Register This Vendor — Free', 'Is Vendor Ko Register Karo — Free')
              )}
            </motion.button>
          </motion.div>
        </motion.form>

        {/* Warm closing message */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-10 bg-[#FFF7ED] rounded-2xl p-6 text-center text-gray-600 text-base leading-relaxed"
        >
          {t(
            'You can fill this form for any vendor — the chai seller, sabzi aunty, momo corner bhaiya. Your one small action can make a big difference in their life.',
            'Yeh form kisi bhi vendor ke liye fill karo. Aapka ek chhota sa kaam unki zindagi mein bada farq la sakta hai.'
          )}
        </motion.div>
      </div>
    </div>
  );
}
