import { Link } from 'react-router-dom';
import { useLang } from '@/context/LanguageContext';

export default function Footer() {
  const { t } = useLang();
  return (
    <footer className="bg-[#1C1C1C] text-white py-10 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="text-xl font-bold text-[#F97316] mb-1">VendorVerse</div>
            <div className="text-sm text-gray-400">
              {t('Every vendor\'s own address online', 'Har vendor ka apna address')}
            </div>
            <div className="text-xs text-gray-500 mt-2">
              GL Bajaj Institute of Technology &amp; Management, Greater Noida
            </div>
          </div>
          <div className="flex flex-wrap gap-4 text-sm font-semibold">
            <Link to="/" className="text-gray-300 hover:text-[#F97316] transition-colors">{t('Home', 'Home')}</Link>
            <Link to="/browse" className="text-gray-300 hover:text-[#F97316] transition-colors">{t('Find Vendors', 'Vendor Dhundho')}</Link>
            <Link to="/register" className="text-gray-300 hover:text-[#F97316] transition-colors">{t('Add a Vendor', 'Vendor Add Karo')}</Link>
            <Link to="/all-vendors" className="text-gray-300 hover:text-[#F97316] transition-colors">{t('Live Database', 'Live Database')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
