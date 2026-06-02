// ─── constants.ts (extract to a separate file) ───────────────────────────────

export type SortKey = 'newest' | 'rating' | 'az';

export const SORT_OPTIONS = [
  { key: 'newest' as SortKey, en: 'Newest First', hi: 'Naye Pehle' },
  { key: 'rating' as SortKey, en: 'Highest Rated', hi: 'Best Rated' },
  { key: 'az'     as SortKey, en: 'A to Z',        hi: 'A se Z'     },
] as const;

export const CATEGORIES = ['All', 'Chai & Snacks', 'Sabzi & Fruits', 'Street Food', 'Paan & More'] as const;

export const STATUS_STYLES: Record<string, string> = {
  new:      'bg-green-100 text-green-700',
  active:   'bg-blue-100 text-blue-700',
  featured: 'bg-orange-100 text-[#F97316]',
};

export const formatTime = (ts: string) =>
  new Date(ts).toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });


// ─── useFilteredVendors.ts (extract to a separate file) ──────────────────────

import { useMemo } from 'react';
import type { Vendor } from '@/types'; // adjust to your actual type path

export function useFilteredVendors(
  vendors: Vendor[],
  sort: SortKey,
  filterCat: string,
) {
  return useMemo(() => {
    let result = filterCat === 'All'
      ? [...vendors]
      : vendors.filter(v => v.category === filterCat);

    if (sort === 'newest') {
      result.sort((a, b) =>
        new Date(b.submission_timestamp).getTime() -
        new Date(a.submission_timestamp).getTime()
      );
    } else if (sort === 'rating') {
      result.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    } else {
      result.sort((a, b) => a.vendor_name.localeCompare(b.vendor_name));
    }

    return result;
  }, [vendors, sort, filterCat]);
}


// ─── AnimatedCounter.tsx ──────────────────────────────────────────────────────

import { useState, useEffect } from 'react';

export function AnimatedCounter({ target }: { target: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const start = performance.now();
    const duration = 1000;

    const animate = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      setCount(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) requestAnimationFrame(animate);
    };

    const id = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(id);
  }, [target]);

  return <span>{count}</span>;
}


// ─── OpenPill.tsx ─────────────────────────────────────────────────────────────

import { isOpenNow } from '@/lib/isOpenNow';

type TFn = (en: string, hi: string) => string;

export function OpenPill({ hours, t }: { hours: string; t: TFn }) {
  const open = isOpenNow(hours);
  return (
    <span
      className={`text-xs font-bold px-2 py-1 rounded-full ${
        open ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
      }`}
    >
      {open ? t('Open', 'Khula') : t('Closed', 'Band')}
    </span>
  );
}


// ─── FilterControls.tsx ───────────────────────────────────────────────────────

import { memo, useCallback } from 'react';
import { CATEGORIES, SORT_OPTIONS, type SortKey } from './constants';

interface FilterControlsProps {
  sort: SortKey;
  filterCat: string;
  onSortChange: (key: SortKey) => void;
  onCatChange: (cat: string) => void;
  t: TFn;
}

export const FilterControls = memo(function FilterControls({
  sort, filterCat, onSortChange, onCatChange, t,
}: FilterControlsProps) {
  return (
    <div className="flex flex-wrap gap-4 mb-6 items-center justify-between">
      <div className="flex gap-2 flex-wrap">
        {SORT_OPTIONS.map(s => (
          <button
            key={s.key}
            onClick={() => onSortChange(s.key)}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${
              sort === s.key
                ? 'bg-[#F97316] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-orange-50'
            }`}
          >
            {t(s.en, s.hi)}
          </button>
        ))}
      </div>

      <div className="flex gap-2 flex-wrap">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => onCatChange(cat)}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${
              filterCat === cat
                ? 'bg-[#1C1C1C] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
});


// ─── VendorRow.tsx (desktop table row) ───────────────────────────────────────

import { memo } from 'react';
import { Link } from 'react-router-dom';
import { OpenPill } from './OpenPill';
import { STATUS_STYLES, formatTime } from './constants';
import type { Vendor } from '@/types';

interface VendorRowProps {
  vendor: Vendor;
  index: number;
  isFlashing: boolean;
  t: TFn;
}

export const VendorRow = memo(function VendorRow({
  vendor: v, index: i, isFlashing, t,
}: VendorRowProps) {
  return (
    <tr
      className={`border-t border-gray-100 transition-colors duration-700 ${
        isFlashing ? 'bg-green-50' : i % 2 === 0 ? 'bg-white' : 'bg-gray-50'
      }`}
    >
      <td className="px-4 py-4 font-bold text-gray-400">{i + 1}</td>
      <td className="px-4 py-4 font-bold">
        {isFlashing && (
          <span className="text-green-600 text-xs mr-1 animate-pulse">● NEW</span>
        )}
        {v.vendor_name}
      </td>
      <td className="px-4 py-4">
        <span className="bg-orange-100 text-[#F97316] text-xs font-semibold px-2 py-1 rounded-full">
          {v.category}
        </span>
      </td>
      <td className="px-4 py-4 text-gray-600 max-w-[180px] truncate">{v.location}</td>
      <td className="px-4 py-4 text-gray-600">{v.registered_by}</td>
      <td className="px-4 py-4 text-gray-500 text-xs">{formatTime(v.submission_timestamp)}</td>
      <td className="px-4 py-4">
        <span
          className={`text-xs font-bold px-2 py-1 rounded-full capitalize ${
            STATUS_STYLES[v.status] ?? 'bg-gray-100 text-gray-600'
          }`}
        >
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
  );
});


// ─── VendorCard.tsx (mobile card) ────────────────────────────────────────────

import { memo } from 'react';
import { Link } from 'react-router-dom';
import { OpenPill } from './OpenPill';
import { STATUS_STYLES, formatTime } from './constants';
import type { Vendor } from '@/types';

interface VendorCardProps {
  vendor: Vendor;
  isFlashing: boolean;
  t: TFn;
}

export const VendorCard = memo(function VendorCard({ vendor: v, isFlashing, t }: VendorCardProps) {
  return (
    <div
      className={`rounded-2xl border p-5 transition-colors duration-700 ${
        isFlashing ? 'border-green-400 bg-green-50' : 'border-gray-100 bg-white'
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <div>
          <div className="font-bold text-base">
            {isFlashing && (
              <span className="text-green-600 text-xs mr-1 animate-pulse">● NEW</span>
            )}
            {v.vendor_name}
          </div>
          <span className="bg-orange-100 text-[#F97316] text-xs font-semibold px-2 py-0.5 rounded-full">
            {v.category}
          </span>
        </div>
        <span
          className={`text-xs font-bold px-2 py-1 rounded-full capitalize ${
            STATUS_STYLES[v.status] ?? 'bg-gray-100 text-gray-600'
          }`}
        >
          {v.status}
        </span>
      </div>

      <div className="flex items-center gap-2 flex-wrap mb-1">
        <span className="text-sm text-gray-600">{v.location}</span>
        <OpenPill hours={v.hours} t={t} />
      </div>

      <div className="text-xs text-gray-400 mb-2">
        {t('By', 'By')} {v.registered_by} · {formatTime(v.submission_timestamp)}
      </div>

      {v.profile_url ? (
        <Link to={v.profile_url} className="text-[#F97316] font-bold text-sm hover:underline">
          {t('View Profile →', 'Profile Dekho →')}
        </Link>
      ) : (
        <span className="text-gray-400 text-sm">{t('Profile Coming Soon', 'Profile Jald Aayega')}</span>
      )}
    </div>
  );
});


// ─── VendorHero.tsx ───────────────────────────────────────────────────────────

import { memo } from 'react';
import { Database } from 'lucide-react';
import { AnimatedCounter } from './AnimatedCounter';

interface VendorHeroProps {
  total: number;
  t: TFn;
}

export const VendorHero = memo(function VendorHero({ total, t }: VendorHeroProps) {
  return (
    <div className="bg-[#FFF7ED] py-12 px-4 text-center">
      <div className="flex justify-center mb-4">
        <Database size={48} className="text-[#F97316]" />
      </div>
      <h1 className="text-3xl md:text-4xl font-bold mb-3">
        {t('All Registered Vendors — Live Database', 'Sabhi Registered Vendors — Live Database')}
      </h1>
      <p className="text-gray-600 text-lg max-w-2xl mx-auto">
        {t(
          'Every vendor registered on VendorVerse. Updates in real time.',
          'VendorVerse pe register har vendor. Real time mein update hota hai.',
        )}
      </p>
      <div className="mt-6 inline-block bg-[#F97316] text-white px-10 py-5 rounded-2xl">
        <div className="text-5xl font-bold">
          <AnimatedCounter target={total} />
        </div>
        <div className="text-sm font-semibold opacity-90 mt-1">
          {t('Total vendors registered', 'Total vendors registered')}
        </div>
      </div>
    </div>
  );
});


// ─── AllVendorsPage.tsx (lean orchestrator) ───────────────────────────────────

import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '@/context/LanguageContext';
import { useVendors } from '@/context/VendorContext';
import { VendorHero } from './VendorHero';
import { FilterControls } from './FilterControls';
import { VendorRow } from './VendorRow';
import { VendorCard } from './VendorCard';
import { useFilteredVendors } from './useFilteredVendors';
import type { SortKey } from './constants';

export default function AllVendorsPage() {
  const { t } = useLang();
  const { vendors, newlyAddedId } = useVendors();
  const [sort, setSort] = useState<SortKey>('newest');
  const [filterCat, setFilterCat] = useState('All');
  const [flashId, setFlashId] = useState<string | null>(null);
  const prevNewRef = useRef<string | null>(null);

  // Flash newly added vendor for 2.5 s
  useEffect(() => {
    if (newlyAddedId && newlyAddedId !== prevNewRef.current) {
      prevNewRef.current = newlyAddedId;
      setFlashId(newlyAddedId);
      const id = setTimeout(() => setFlashId(null), 2500);
      return () => clearTimeout(id);
    }
  }, [newlyAddedId]);

  const displayed = useFilteredVendors(vendors, sort, filterCat);

  // Stable callbacks so FilterControls doesn't re-render on every keystroke
  const handleSortChange = useCallback((key: SortKey) => setSort(key), []);
  const handleCatChange = useCallback((cat: string) => setFilterCat(cat), []);

  return (
    <div className="text-[#1C1C1C]">
      <VendorHero total={vendors.length} t={t} />

      <div className="max-w-6xl mx-auto px-4 py-10">
        <FilterControls
          sort={sort}
          filterCat={filterCat}
          onSortChange={handleSortChange}
          onCatChange={handleCatChange}
          t={t}
        />

        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto rounded-2xl border border-gray-100 shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-[#FFF7ED] text-[#1C1C1C] font-bold">
              <tr>
                {['#', 'Vendor Name|Vendor Naam', 'Category|Category', 'Location|Jagah',
                  'Registered By|Register Kiya', 'Time|Time', 'Status|Status',
                  'Open|Khula', 'Profile|Profile'].map(col => {
                  const [en, hi] = col.split('|');
                  return (
                    <th key={en} className="px-4 py-4 text-left">
                      {hi ? t(en, hi) : en}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {displayed.map((v, i) => (
                <VendorRow
                  key={v.id}
                  vendor={v}
                  index={i}
                  isFlashing={flashId === v.id}
                  t={t}
                />
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden flex flex-col gap-4">
          {displayed.map(v => (
            <VendorCard
              key={v.id}
              vendor={v}
              isFlashing={flashId === v.id}
              t={t}
            />
          ))}
        </div>

        {/* Proof note */}
        <div className="mt-10 bg-[#1C1C1C] text-white rounded-2xl p-8 text-center">
          <p className="text-base leading-relaxed">
            {t(
              'This page demonstrates that VendorVerse is a fully functional platform — not just a design. Every form submission is stored, displayed, and retrievable in real time.',
              'Yeh page prove karta hai ki VendorVerse sirf design nahi — ek fully functional platform hai. Har form submission store, display, aur real time mein retrieve hoti hai.',
            )}
          </p>
          <div className="mt-4 flex flex-wrap gap-3 justify-center">
            <Link
              to="/register"
              className="bg-[#F97316] text-white px-6 py-3 rounded-xl font-bold hover:bg-orange-600 transition-colors"
            >
              {t('Register a Vendor', 'Vendor Register Karo')}
            </Link>
            <Link
              to="/browse"
              className="border border-white text-white px-6 py-3 rounded-xl font-bold hover:bg-white hover:text-[#1C1C1C] transition-colors"
            >
              {t('Browse Vendors', 'Vendors Dekho')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
