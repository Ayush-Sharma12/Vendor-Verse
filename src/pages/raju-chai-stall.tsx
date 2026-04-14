import { useLang } from '@/context/LanguageContext';
import { MapPin, Clock, ShoppingBasket, Share2, MessageCircle } from 'lucide-react';
import { isOpenNow } from '@/lib/isOpenNow';

function StarRating({ rating, count }: { rating: number; count: number }) {
  const { t } = useLang();
  return (
    <div className="flex items-center gap-2">
      <span className="text-yellow-400 text-xl">{'★'.repeat(Math.floor(rating))}{'☆'.repeat(5 - Math.floor(rating))}</span>
      <span className="font-bold text-lg">{rating}</span>
      <span className="text-gray-500">· {count} {t('reviews', 'logon ne review kiya')}</span>
    </div>
  );
}

export default function RajuPage() {
  const { lang, t } = useLang();
  const openNow = isOpenNow('6 AM to 10 PM, Monday to Saturday');

  const reviews = lang === 'HI' ? [
    { text: 'Best chai in Greater Noida. Roz subah aati hoon college se pehle.', author: 'Ananya S.', stars: 5 },
    { text: 'Samosa ekdum mast. Raju bhaiya hamesha muskurate hain.', author: 'Rahul M.', stars: 4 },
    { text: 'Teen saal se 9 baje ki class se pehle yahan aati hoon.', author: 'Priya K.', stars: 5 },
  ] : [
    { text: 'Best chai in Greater Noida. Come here every morning before college.', author: 'Ananya S.', stars: 5 },
    { text: 'Amazing samosa. Raju bhaiya is always smiling and kind.', author: 'Rahul M.', stars: 4 },
    { text: 'Three years coming here before 9 AM lectures. Best value.', author: 'Priya K.', stars: 5 },
  ];

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: "Raju's Chai Stall", url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert(t('Link copied!', 'Link copy ho gaya!'));
    }
  };

  return (
    <div className="text-[#1C1C1C] max-w-2xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex items-start gap-5 mb-6">
        <div className="w-20 h-20 rounded-full bg-[#F97316] flex items-center justify-center text-white font-bold text-2xl flex-shrink-0">RC</div>
        <div>
          <h1 className="text-3xl md:text-4xl font-bold">Raju's Chai Stall</h1>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <span className="bg-orange-100 text-[#F97316] text-sm font-semibold px-3 py-1 rounded-full">Chai & Snacks</span>
            <span className={`text-sm font-bold px-3 py-1 rounded-full ${openNow ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
              {openNow ? t('Open Now', 'Abhi Khula Hai') : t('Closed Now', 'Abhi Band Hai')}
            </span>
          </div>
          <div className="mt-2">
            <StarRating rating={4.8} count={92} />
          </div>
          <div className="text-sm text-gray-500 mt-1">
            {t('Since 2014 · 11 years of experience', '2014 se yahan hain · 11 saal ka tajurba')}
          </div>
        </div>
      </div>

      {/* Info rows */}
      <div className="bg-[#FFF7ED] rounded-2xl p-6 mb-6 space-y-4">
        <div className="flex items-start gap-3">
          <Clock size={20} className="text-[#F97316] mt-0.5 flex-shrink-0" />
          <span>{t('6 AM to 10 PM · Monday to Saturday', 'Subah 6 baje se raat 10 baje tak · Monday to Saturday')}</span>
        </div>
        <div className="flex items-start gap-3">
          <MapPin size={20} className="text-[#F97316] mt-0.5 flex-shrink-0" />
          <span>{t('Opposite Alpha 1 Metro Gate 2, Greater Noida', 'Alpha 1 Metro Gate 2 ke samne, Greater Noida')}</span>
        </div>
        <div className="flex items-start gap-3">
          <ShoppingBasket size={20} className="text-[#F97316] mt-0.5 flex-shrink-0" />
          <span>{t('Chai, Samosa, Bun Maska, Cold Drink', 'Chai, Samosa, Bun Maska, Cold Drink')}</span>
        </div>
      </div>

      {/* Menu */}
      <h2 className="text-2xl font-bold mb-4">{t('What do they sell?', 'Kya milta hai yahan?')}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {[
          { name: 'Cutting Chai', price: '₹10' },
          { name: t('Samosa (2 pcs)', 'Samosa (2 pcs)'), price: '₹20' },
          { name: 'Bun Maska', price: '₹15' },
          { name: 'Cold Drink', price: '₹20' },
        ].map(item => (
          <div key={item.name} className="flex items-center justify-between bg-white border border-gray-100 rounded-xl px-5 py-4 shadow-sm">
            <span className="font-semibold text-base">{item.name}</span>
            <span className="font-bold text-[#F97316] text-lg">{item.price}</span>
          </div>
        ))}
      </div>

      {/* Payment */}
      <div className="bg-[#F97316] rounded-2xl p-8 mb-8 text-white text-center">
        <h2 className="text-2xl font-bold mb-3">{t('Pay directly', 'Seedha payment karo')}</h2>
        <div className="text-3xl font-bold mb-2">raju.chai@paytm</div>
        <p className="opacity-90 mb-5">
          {t('Works on Google Pay, PhonePe, and Paytm.', 'Google Pay, PhonePe, aur Paytm — sab pe kaam karta hai.')}
        </p>
        <a
          href="https://wa.me/9800000001"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-white text-[#F97316] px-6 py-3 rounded-xl font-bold hover:bg-orange-50 transition-colors"
        >
          <MessageCircle size={20} />
          {t('Chat with Raju on WhatsApp', 'WhatsApp pe baat karo Raju se')}
        </a>
      </div>

      {/* Reviews */}
      <h2 className="text-2xl font-bold mb-5">{t('What people say', 'Log kya kehte hain?')}</h2>
      <div className="space-y-4 mb-8">
        {reviews.map((r, i) => (
          <div key={i} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <div className="text-yellow-400 mb-2">{'★'.repeat(r.stars)}{'☆'.repeat(5 - r.stars)}</div>
            <p className="text-gray-700 mb-2">"{r.text}"</p>
            <div className="font-bold text-sm text-gray-500">— {r.author}</div>
          </div>
        ))}
      </div>

      {/* Share */}
      <div className="bg-[#FFF7ED] rounded-2xl p-8 text-center">
        <p className="text-lg font-semibold mb-4">
          {t("Does Raju need more customers? Copy link and send on WhatsApp.", "Raju bhaiya ko aur customers chahiye? Link copy karo, WhatsApp pe bhejo.")}
        </p>
        <button
          onClick={handleShare}
          className="inline-flex items-center gap-2 bg-[#F97316] text-white px-8 py-3 rounded-xl font-bold hover:bg-orange-600 transition-colors"
        >
          <Share2 size={20} />
          {t('Share This Page', 'Yeh Page Share Karo')}
        </button>
      </div>
    </div>
  );
}
