import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '@/context/LanguageContext';
import { useVendors } from '@/context/VendorContext';
import { Database } from 'lucide-react';
import { isOpenNow } from '@/lib/isOpenNow';

function AnimatedCounter({ target }: { target: number }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const duration = 1000;
    const start = performance.now();
    const animate = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setCount(Math.round(target * eased));
      if (p < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [target]);
  return <span>{count}</span>;
}

function formatTime(ts: string): string {
  const d = new Date(ts);
  return d.toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

const STATUS_STYLES: Record<string, string> = {
  new: 'bg-green-100 text-green-700',
  active: 'bg-blue-100 text-blue-700',
  featured: 'bg-orange-100 text-[#F97316]',
};

function OpenPill({ hours, t }: { hours: string; t: (en: string, hi: string) => string }) {
  const openNow = isOpenNow(hours);
  return (
    <span className={`text-xs font-bold px-2 py-1 rounded-full ${openNow ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
      {openNow ? t('Open', 'Khula') : t('Closed', 'Band')}
    </span>
  );
}

const CATEGORIES_EN = ['All', 'Chai & Snacks', 'Sabzi & Fruits', 'Street Food', 'Paan & More'];

export default function AllVendorsPage() {
  const { t } = useLang();
  const { vendors, newlyAddedId } = useVendors();
  const [sort, setSort] = useState<'newest' | 'rating' | 'az'>('newest');
  const [filterCat, setFilterCat] = useState('All');
  const [flashId, setFlashId] = useState<string | null>(null);
  const prevNew = useRef<string | null>(null);

  useEffect(() => {
    if (newlyAddedId && newlyAddedId !== prevNew.current) {
      prevNew.current = newlyAddedId;
      setFlashId(newlyAddedId);
      setTimeout(() => setFlashId(null), 2500);
    }
  }, [newlyAddedId]);

  let displayed = [...vendors];
  if (filterCat !== 'All') displayed = displayed.filter(v => v.category === filterCat);
  if (sort === 'newest') displayed.sort((a, b) => new Date(b.submission_timestamp).getTime() - new Date(a.submission_timestamp).getTime());
  else if (sort === 'rating') displayed.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  else displayed.sort((a, b) => a.vendor_name.localeCompare(b.vendor_name));

  return (
    <div className="text-[#1C1C1C]">
      {/* Header */}
      <div className="bg-[#FFF7ED] py-12 px-4 text-center">
        <div className="flex justify-center mb-4">
          <Database size={48} className="text-[#F97316]" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-3">
          {t('All Registered Vendors — Live Database', 'Sabhi Registered Vendors — Live Database')}
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          {t('Every vendor registered on VendorVerse. Updates in real time.', 'VendorVerse pe register har vendor. Real time mein update hota hai.')}
        </p>
        {/* Live counter */}
        <div className="mt-6 inline-block bg-[#F97316] text-white px-10 py-5 rounded-2xl">
          <div className="text-5xl font-bold"><AnimatedCounter target={vendors.length} /></div>
          <div className="text-sm font-semibold opacity-90 mt-1">
            {t('Total vendors registered', 'Total vendors registered')}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Controls */}
        <div className="flex flex-wrap gap-4 mb-6 items-center justify-between">
          {/* Sort */}
          <div className="flex gap-2 flex-wrap">
            {[
              { key: 'newest', en: 'Newest First', hi: 'Naye Pehle' },
              { key: 'rating', en: 'Highest Rated', hi: 'Best Rated' },
              { key: 'az', en: 'A to Z', hi: 'A se Z' },
            ].map(s => (
              <button
                key={s.key}
                onClick={() => setSort(s.key as typeof sort)}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${sort === s.key ? 'bg-[#F97316] text-white' : 'bg-gray-100 text-gray-700 hover:bg-orange-50'}`}
              >
                {t(s.en, s.hi)}
              </button>
            ))}
          </div>
          {/* Category filter */}
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES_EN.map(cat => (
              <button
                key={cat}
                onClick={() => setFilterCat(cat)}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${filterCat === cat ? 'bg-[#1C1C1C] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Table — desktop */}
        <div className="hidden md:block overflow-x-auto rounded-2xl border border-gray-100 shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-[#FFF7ED] text-[#1C1C1C] font-bold">
              <tr>
                <th className="px-4 py-4 text-left">#</th>
                <th className="px-4 py-4 text-left">{t('Vendor Name', 'Vendor Naam')}</th>
                <th className="px-4 py-4 text-left">{t('Category', 'Category')}</th>
                <th className="px-4 py-4 text-left">{t('Location', 'Jagah')}</th>
                <th className="px-4 py-4 text-left">{t('Registered By', 'Register Kiya')}</th>
                <th className="px-4 py-4 text-left">{t('Time', 'Time')}</th>
                <th className="px-4 py-4 text-left">{t('Status', 'Status')}</th>
                <th className="px-4 py-4 text-left">{t('Open', 'Khula')}</th>
                <th className="px-4 py-4 text-left">{t('Profile', 'Profile')}</th>
              </tr>
            </thead>
            <tbody>
              {displayed.map((v, i) => (
                <tr
                  key={v.id}
                  className={`border-t border-gray-100 transition-colors duration-700 ${flashId === v.id ? 'bg-green-50' : i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                >
                  <td className="px-4 py-4 font-bold text-gray-400">{i + 1}</td>
                  <td className="px-4 py-4 font-bold">
                    {flashId === v.id && <span className="text-green-600 text-xs mr-1 animate-pulse">● NEW</span>}
                    {v.vendor_name}
                  </td>
                  <td className="px-4 py-4">
                    <span className="bg-orange-100 text-[#F97316] text-xs font-semibold px-2 py-1 rounded-full">{v.category}</span>
                  </td>
                  <td className="px-4 py-4 text-gray-600 max-w-[180px] truncate">{v.location}</td>
                  <td className="px-4 py-4 text-gray-600">{v.registered_by}</td>
                  <td className="px-4 py-4 text-gray-500 text-xs">{formatTime(v.submission_timestamp)}</td>
                  <td className="px-4 py-4">
                    <span className={`text-xs font-bold px-2 py-1 rounded-full capitalize ${STATUS_STYLES[v.status] || 'bg-gray-100 text-gray-600'}`}>
                      {v.status}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <OpenPill hours={v.hours} t={t} />
                  </td>
                  <td className="px-4 py-4">
                    {v.profile_url ? (
                      <Link to={v.profile_url} className="text-[#F97316] font-bold text-xs hover:underline">
                        {t('View Profile', 'Profile Dekho')} →
                      </Link>
                    ) : (
                      <span className="text-gray-400 text-xs">{t('Coming Soon', 'Jald Aayega')}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden flex flex-col gap-4">
          {displayed.map((v, i) => (
            <div
              key={v.id}
              className={`rounded-2xl border p-5 transition-colors duration-700 ${flashId === v.id ? 'border-green-400 bg-green-50' : 'border-gray-100 bg-white'}`}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="font-bold text-base">
                    {flashId === v.id && <span className="text-green-600 text-xs mr-1 animate-pulse">● NEW</span>}
                    {v.vendor_name}
                  </div>
                  <span className="bg-orange-100 text-[#F97316] text-xs font-semibold px-2 py-0.5 rounded-full">{v.category}</span>
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded-full capitalize ${STATUS_STYLES[v.status] || 'bg-gray-100 text-gray-600'}`}>
                  {v.status}
                </span>
              </div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <div className="text-sm text-gray-600">{v.location}</div>
                <OpenPill hours={v.hours} t={t} />
              </div>
              <div className="text-xs text-gray-400 mb-2">{t('By', 'By')} {v.registered_by} · {formatTime(v.submission_timestamp)}</div>
              {v.profile_url ? (
                <Link to={v.profile_url} className="text-[#F97316] font-bold text-sm hover:underline">
                  {t('View Profile →', 'Profile Dekho →')}
                </Link>
              ) : (
                <span className="text-gray-400 text-sm">{t('Profile Coming Soon', 'Profile Jald Aayega')}</span>
              )}
            </div>
          ))}
        </div>

        {/* Proof note */}
        <div className="mt-10 bg-[#1C1C1C] text-white rounded-2xl p-8 text-center">
          <p className="text-base leading-relaxed">
            {t(
              'This page demonstrates that VendorVerse is a fully functional platform — not just a design. Every form submission is stored, displayed, and retrievable in real time.',
              'Yeh page prove karta hai ki VendorVerse sirf design nahi — ek fully functional platform hai. Har form submission store, display, aur real time mein retrieve hoti hai.'
            )}
          </p>
          <div className="mt-4 flex flex-wrap gap-3 justify-center">
            <Link to="/register" className="bg-[#F97316] text-white px-6 py-3 rounded-xl font-bold hover:bg-orange-600 transition-colors">
              {t('Register a Vendor', 'Vendor Register Karo')}
            </Link>
            <Link to="/browse" className="border border-white text-white px-6 py-3 rounded-xl font-bold hover:bg-white hover:text-[#1C1C1C] transition-colors">
              {t('Browse Vendors', 'Vendors Dekho')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
