import { useLang } from '@/context/LanguageContext';
import { MapPin, Clock, ShoppingBasket, Share2, MessageCircle } from 'lucide-react';
import { isOpenNow } from '@/lib/isOpenNow';

export default function PriyaPage() {
  const { lang, t } = useLang();
  const openNow = isOpenNow('6 AM to 1 PM · Daily');

  const reviews = lang === 'HI' ? [
    { text: 'Sabse taza sabzi milti hai yahan. Roz subah 7 baje aati hoon.', author: 'Sunita R.', stars: 5 },
    { text: 'Priya didi bahut honest hain. Kabhi ganda maal nahi diya.', author: 'Meena D.', stars: 4 },
    { text: '5 saal se inhi se khareedti hoon. Bilkul bharosa layak.', author: 'Kavita S.', stars: 5 },
  ] : [
    { text: 'Freshest vegetables in the area. I come every morning at 7 AM.', author: 'Sunita R.', stars: 5 },
    { text: 'Priya didi is very honest. Never given bad quality.', author: 'Meena D.', stars: 4 },
    { text: 'Buying from her for 5 years. Completely trustworthy.', author: 'Kavita S.', stars: 5 },
  ];

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: 'Priya Devi Sabziwali', url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert(t('Link copied!', 'Link copy ho gaya!'));
    }
  };

  return (
    <div className="text-[#1C1C1C] max-w-2xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex items-start gap-5 mb-6">
        <div className="w-20 h-20 rounded-full bg-[#16A34A] flex items-center justify-center text-white font-bold text-2xl flex-shrink-0">PD</div>
        <div>
          <h1 className="text-3xl md:text-4xl font-bold">Priya Devi Sabziwali</h1>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <span className="bg-green-100 text-green-700 text-sm font-semibold px-3 py-1 rounded-full">Sabzi & Fruits</span>
            <span className={`text-sm font-bold px-3 py-1 rounded-full ${openNow ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
              {openNow ? t('Open Now', 'Abhi Khula Hai') : t('Closed Now', 'Abhi Band Hai')}
            </span>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-yellow-400 text-xl">★★★★☆</span>
            <span className="font-bold text-lg">4.6</span>
            <span className="text-gray-500">· 38 {t('reviews', 'logon ne review kiya')}</span>
          </div>
          <div className="text-sm text-gray-500 mt-1">
            {t('Since 2009 · 15 years of experience', '2009 se · 15 saal ka tajurba')}
          </div>
        </div>
      </div>

      {/* Info rows */}
      <div className="bg-[#F0FDF4] rounded-2xl p-6 mb-6 space-y-4">
        <div className="flex items-start gap-3">
          <Clock size={20} className="text-green-600 mt-0.5 flex-shrink-0" />
          <span>{t('6 AM to 1 PM · Daily', 'Subah 6 se dopahar 1 baje · Roz')}</span>
        </div>
        <div className="flex items-start gap-3">
          <MapPin size={20} className="text-green-600 mt-0.5 flex-shrink-0" />
          <span>{t('Knowledge Park III, Near Bus Stand', 'Knowledge Park III, Bus Stand ke paas')}</span>
        </div>
        <div className="flex items-start gap-3">
          <ShoppingBasket size={20} className="text-green-600 mt-0.5 flex-shrink-0" />
          <span>{t('Fresh vegetables, seasonal fruits', 'Taza sabzi, seasonal fruits')}</span>
        </div>
      </div>

      {/* Menu */}
      <h2 className="text-2xl font-bold mb-4">{t('What do they sell?', 'Kya milta hai yahan?')}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {[
          { name: 'Aloo', price: '₹40/kg' },
          { name: 'Tamatar', price: '₹60/kg' },
          { name: 'Palak', price: '₹20/guchha' },
          { name: t('Seasonal fruits — ask at stall', 'Seasonal fruits — stall pe poochho'), price: '' },
        ].map(item => (
          <div key={item.name} className="flex items-center justify-between bg-white border border-gray-100 rounded-xl px-5 py-4 shadow-sm">
            <span className="font-semibold text-base">{item.name}</span>
            {item.price && <span className="font-bold text-green-600 text-lg">{item.price}</span>}
          </div>
        ))}
      </div>

      {/* Payment */}
      <div className="bg-[#16A34A] rounded-2xl p-8 mb-8 text-white text-center">
        <h2 className="text-2xl font-bold mb-3">{t('Pay directly', 'Seedha payment karo')}</h2>
        <div className="text-3xl font-bold mb-2">priya.sabzi@upi</div>
        <p className="opacity-90 mb-5">
          {t('Works on Google Pay, PhonePe, and Paytm.', 'Google Pay, PhonePe, aur Paytm — sab pe kaam karta hai.')}
        </p>
        <a
          href="https://wa.me/9800000002"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-white text-green-700 px-6 py-3 rounded-xl font-bold hover:bg-green-50 transition-colors"
        >
          <MessageCircle size={20} />
          {t('Chat with Priya on WhatsApp', 'WhatsApp pe baat karo Priya se')}
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
      <div className="bg-[#F0FDF4] rounded-2xl p-8 text-center">
        <p className="text-lg font-semibold mb-4">
          {t("Does Priya need more customers? Copy link and send on WhatsApp.", "Priya didi ko aur customers chahiye? Link copy karo, WhatsApp pe bhejo.")}
        </p>
        <button
          onClick={handleShare}
          className="inline-flex items-center gap-2 bg-[#16A34A] text-white px-8 py-3 rounded-xl font-bold hover:bg-green-700 transition-colors"
        >
          <Share2 size={20} />
          {t('Share This Page', 'Yeh Page Share Karo')}
        </button>
      </div>
    </div>
  );
}
