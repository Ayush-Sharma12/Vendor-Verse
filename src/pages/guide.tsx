import { Link } from 'react-router-dom';
import { useLang } from '@/context/LanguageContext';
import {
  Search, PlusCircle, Share2, Star, MapPin,
  Smartphone, CreditCard, CheckCircle2, ChevronRight,
  MessageCircle, Eye, Zap, HelpCircle,
} from 'lucide-react';

/* ─── Step card ─────────────────────────────────────────────── */
function StepCard({
  number, icon, title, desc, tip,
}: {
  number: number;
  icon: React.ReactNode;
  title: string;
  desc: string;
  tip?: string;
}) {
  return (
    <div className="relative bg-white rounded-3xl border-2 border-orange-100 p-6 shadow-sm hover:shadow-md hover:border-orange-300 transition-all">
      {/* Step number bubble */}
      <div className="absolute -top-4 -left-3 w-9 h-9 bg-[#F97316] text-white rounded-full flex items-center justify-center font-bold text-base shadow-md">
        {number}
      </div>
      <div className="flex items-start gap-4 mt-2">
        <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center flex-shrink-0 text-[#F97316]">
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-lg text-[#1C1C1C] mb-1">{title}</h3>
          <p className="text-gray-600 text-sm leading-relaxed">{desc}</p>
          {tip && (
            <div className="mt-3 bg-orange-50 border border-orange-200 rounded-xl px-3 py-2 text-xs text-orange-700 font-semibold flex items-start gap-1.5">
              <Zap size={12} className="mt-0.5 flex-shrink-0" />
              {tip}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── FAQ item ───────────────────────────────────────────────── */
function FaqItem({ q, a }: { q: string; a: string }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <HelpCircle size={18} className="text-[#F97316] flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-bold text-[#1C1C1C] mb-1">{q}</p>
          <p className="text-gray-600 text-sm leading-relaxed">{a}</p>
        </div>
      </div>
    </div>
  );
}

/* ─── Main page ──────────────────────────────────────────────── */
export default function GuidePage() {
  const { lang, t } = useLang();

  const findSteps = lang === 'HI' ? [
    {
      icon: <Search size={22} />,
      title: 'Browse Page pe Jao',
      desc: '"Find Vendors" pe click karo. Yahan aapko saare registered vendors milenge.',
      tip: 'Tip: Search bar mein vendor ka naam, item ya jagah type karo — jaise "chai" ya "Pari Chowk".',
    },
    {
      icon: <MapPin size={22} />,
      title: 'Apne Paas Dhundho',
      desc: 'Category filter use karo — Chai & Snacks, Street Food, Sabzi & Fruits, Paan & More. Ya seedha search karo.',
      tip: 'Tip: Green "Abhi Khula Hai" badge dekhna — iska matlab vendor abhi available hai!',
    },
    {
      icon: <Eye size={22} />,
      title: 'Full Profile Dekho',
      desc: '"Poori Detail Dekho" button dabao. Wahan milega: menu, daam, UPI ID, WhatsApp number aur location.',
      tip: 'Tip: UPI ID copy karne ke liye "Copy" button dabao — seedha payment app mein paste karo.',
    },
    {
      icon: <MessageCircle size={22} />,
      title: 'Vendor se Baat Karo',
      desc: 'WhatsApp button se seedha vendor ko message karo — order confirm karo ya poochho ki woh aaj hain ya nahi.',
      tip: 'Tip: Profile share karo apne doston ke saath — vendor ko aur customers milenge!',
    },
  ] : [
    {
      icon: <Search size={22} />,
      title: 'Go to the Browse Page',
      desc: 'Click "Find Vendors" in the navbar. You\'ll see all registered vendors in your area.',
      tip: 'Tip: Use the search bar — type a vendor name, item, or location like "chai" or "Pari Chowk".',
    },
    {
      icon: <MapPin size={22} />,
      title: 'Filter by Category',
      desc: 'Use the category buttons — Chai & Snacks, Street Food, Sabzi & Fruits, Paan & More. Or just search directly.',
      tip: 'Tip: Look for the green "Open Now" badge — it means the vendor is available right now!',
    },
    {
      icon: <Eye size={22} />,
      title: 'View the Full Profile',
      desc: 'Click "See Full Profile". You\'ll find the menu, prices, UPI ID, WhatsApp number, and exact location.',
      tip: 'Tip: Hit the "Copy" button next to the UPI ID — paste it directly into any payment app.',
    },
    {
      icon: <MessageCircle size={22} />,
      title: 'Contact the Vendor',
      desc: 'Use the WhatsApp button to message the vendor directly — confirm your order or check if they\'re there today.',
      tip: 'Tip: Share the profile with friends — help the vendor get more customers!',
    },
  ];

  const registerSteps = lang === 'HI' ? [
    {
      icon: <PlusCircle size={22} />,
      title: '"Vendor Add Karo" pe Click Karo',
      desc: 'Navbar mein ya homepage pe "Vendor Add Karo — Free" button dabao. Koi account nahi chahiye.',
      tip: 'Tip: Bilkul free hai. Koi login nahi, koi password nahi.',
    },
    {
      icon: <Smartphone size={22} />,
      title: 'Form Bharo — 2 Minute Mein',
      desc: 'Vendor ka naam, category, kya bechte hain, location/landmark, opening hours, aur aapka naam bharo.',
      tip: 'Tip: Location mein koi famous landmark likhna — jaise "Alpha 1 Metro Gate ke saamne" — taaki log aasani se dhundh sakein.',
    },
    {
      icon: <CreditCard size={22} />,
      title: 'UPI aur WhatsApp Add Karo (Optional)',
      desc: 'Agar vendor UPI accept karta hai ya WhatsApp pe available hai, toh woh details bhi bharo. Customers seedha pay kar sakenge.',
      tip: 'Tip: UPI ID hone se customers cashless pay kar sakte hain — vendor ke liye bahut helpful hai!',
    },
    {
      icon: <CheckCircle2 size={22} />,
      title: 'Submit Karo — Profile Turant Ready!',
      desc: '"Register Vendor" dabao. Ek second mein vendor ka apna profile page ban jaata hai. Usse share karo!',
      tip: 'Tip: Success screen pe "Unka Profile Page Dekho" button dabao — seedha unke page pe pahuncho.',
    },
  ] : [
    {
      icon: <PlusCircle size={22} />,
      title: 'Click "Add Vendor — Free"',
      desc: 'Hit the "Add Vendor — Free" button in the navbar or homepage. No account needed.',
      tip: 'Tip: Completely free. No login, no password, no sign-up.',
    },
    {
      icon: <Smartphone size={22} />,
      title: 'Fill the Form — 2 Minutes',
      desc: 'Enter the vendor\'s name, category, what they sell, location/landmark, opening hours, and your name.',
      tip: 'Tip: For location, write a nearby landmark — like "Opposite Alpha 1 Metro Gate 2" — so people can find them easily.',
    },
    {
      icon: <CreditCard size={22} />,
      title: 'Add UPI & WhatsApp (Optional)',
      desc: 'If the vendor accepts UPI or is on WhatsApp, add those details too. Customers can pay and contact directly.',
      tip: 'Tip: Adding a UPI ID lets customers pay cashless — a huge help for the vendor!',
    },
    {
      icon: <CheckCircle2 size={22} />,
      title: 'Submit — Profile is Instant!',
      desc: 'Hit "Register Vendor". In one second, the vendor gets their own profile page on VendorVerse. Share it!',
      tip: 'Tip: On the success screen, click "View Their Profile Page" to go directly to their new page.',
    },
  ];

  const faqs = lang === 'HI' ? [
    { q: 'Kya vendor ko khud register karna hoga?', a: 'Nahi! Koi bhi — student, customer, ya neighbour — vendor ki taraf se register kar sakta hai. Vendor ko smartphone ki zaroorat nahi.' },
    { q: 'Kya yeh free hai?', a: 'Haan, bilkul free. Koi hidden charge nahi, koi subscription nahi.' },
    { q: 'Agar vendor ki details galat hain toh?', a: 'Abhi ke liye, sahi details ke saath dobara register kar sakte ho. Hum jald hi "Edit Profile" feature laane wale hain.' },
    { q: '"Open Now" badge kaise kaam karta hai?', a: 'Hum vendor ke opening hours ko automatically parse karte hain aur aapke current time se compare karte hain. Agar vendor ke hours ke andar hai, toh green badge dikhta hai.' },
    { q: 'Kya main apne campus ke bahar ke vendors add kar sakta hoon?', a: 'Haan! Koi bhi vendor — chahe woh GL Bajaj ke paas ho ya kisi bhi jagah — add kiya ja sakta hai.' },
  ] : [
    { q: 'Does the vendor need to register themselves?', a: 'No! Anyone — a student, customer, or neighbour — can register on behalf of the vendor. The vendor doesn\'t need a smartphone.' },
    { q: 'Is it really free?', a: 'Yes, completely free. No hidden charges, no subscription, no sign-up required.' },
    { q: 'What if the vendor\'s details are wrong?', a: 'For now, you can re-register with the correct details. We\'re adding an "Edit Profile" feature soon.' },
    { q: 'How does the "Open Now" badge work?', a: 'We automatically parse the vendor\'s opening hours and compare them to your current local time. If you\'re within their hours, the green badge shows.' },
    { q: 'Can I add vendors outside my campus?', a: 'Yes! Any vendor — near GL Bajaj or anywhere else — can be added to VendorVerse.' },
  ];

  return (
    <div className="text-[#1C1C1C]">
      <title>How to Use VendorVerse — Guide</title>
      <meta name="description" content="Step-by-step guide to finding vendors and registering new ones on VendorVerse." />

      {/* ── Hero ── */}
      <div className="bg-gradient-to-br from-[#FFF7ED] to-orange-100 py-16 px-4 text-center">
        <div className="inline-flex items-center gap-2 bg-orange-100 border border-orange-200 text-orange-700 text-sm font-bold px-4 py-2 rounded-full mb-6">
          <Zap size={14} className="fill-orange-500" />
          {t('Beginner Friendly Guide', 'Beginners ke liye Guide')}
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'Nunito, sans-serif' }}>
          {t('How to use VendorVerse', 'VendorVerse kaise use karein?')}
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-8">
          {t(
            'Everything you need to know — finding vendors near you, and helping local vendors get discovered.',
            'Sab kuch yahan hai — paas ke vendors dhundhna, aur local vendors ko online laana.'
          )}
        </p>
        {/* Quick jump buttons */}
        <div className="flex flex-wrap justify-center gap-3">
          <a href="#find" className="flex items-center gap-2 bg-white border-2 border-[#F97316] text-[#F97316] px-5 py-2.5 rounded-xl font-bold hover:bg-orange-50 transition-colors text-sm">
            <Search size={16} />
            {t('Find a Vendor', 'Vendor Dhundho')}
          </a>
          <a href="#register" className="flex items-center gap-2 bg-[#F97316] text-white px-5 py-2.5 rounded-xl font-bold hover:bg-orange-600 transition-colors text-sm">
            <PlusCircle size={16} />
            {t('Register a Vendor', 'Vendor Register Karo')}
          </a>
          <a href="#faq" className="flex items-center gap-2 bg-white border-2 border-gray-200 text-gray-600 px-5 py-2.5 rounded-xl font-bold hover:bg-gray-50 transition-colors text-sm">
            <HelpCircle size={16} />
            {t('FAQs', 'Sawaal Jawaab')}
          </a>
        </div>
      </div>

      {/* ── What is VendorVerse ── */}
      <div className="max-w-4xl mx-auto px-4 py-14">
        <div className="bg-[#FFF7ED] rounded-3xl p-8 border-2 border-orange-100">
          <h2 className="text-2xl font-bold mb-3 flex items-center gap-2">
            <Star size={22} className="text-[#F97316]" />
            {t('What is VendorVerse?', 'VendorVerse kya hai?')}
          </h2>
          <p className="text-gray-700 leading-relaxed text-base mb-4">
            {t(
              'VendorVerse is a free platform that gives India\'s street vendors their own digital storefront — a profile page with their menu, location, UPI ID, and WhatsApp number. Anyone can register a vendor in 2 minutes. No smartphone needed by the vendor.',
              'VendorVerse ek free platform hai jo India ke street vendors ko unka apna digital storefront deta hai — ek profile page jisme menu, location, UPI ID aur WhatsApp number hota hai. Koi bhi vendor ko 2 minute mein register kar sakta hai. Vendor ko smartphone ki zaroorat nahi.'
            )}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: '🆓', label: t('100% Free', '100% Free') },
              { icon: '⚡', label: t('2 min to register', '2 min mein register') },
              { icon: '📱', label: t('No app needed', 'Koi app nahi chahiye') },
            ].map(item => (
              <div key={item.label} className="bg-white rounded-2xl p-4 text-center border border-orange-100">
                <div className="text-3xl mb-2">{item.icon}</div>
                <div className="font-bold text-sm">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Find a Vendor ── */}
      <div id="find" className="bg-[#F0FDF4] py-14 px-4 scroll-mt-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-2 bg-green-100 text-green-700 text-sm font-bold px-4 py-2 rounded-full mb-4">
              <Search size={14} />
              {t('Part 1', 'Bhag 1')}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: 'Nunito, sans-serif' }}>
              {t('How to find a vendor', 'Vendor kaise dhundhen?')}
            </h2>
            <p className="text-gray-500 mt-2">
              {t('4 simple steps — takes less than a minute.', '4 aasaan steps — ek minute se bhi kam.')}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {findSteps.map((step, i) => (
              <StepCard key={i} number={i + 1} icon={step.icon} title={step.title} desc={step.desc} tip={step.tip} />
            ))}
          </div>
          {/* CTA */}
          <div className="text-center mt-10">
            <Link
              to="/browse"
              className="inline-flex items-center gap-2 bg-[#F97316] text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-orange-600 transition-colors shadow-md"
            >
              <Search size={20} />
              {t('Find Vendors Now →', 'Abhi Vendors Dhundho →')}
            </Link>
          </div>
        </div>
      </div>

      {/* ── Register a Vendor ── */}
      <div id="register" className="py-14 px-4 scroll-mt-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 text-sm font-bold px-4 py-2 rounded-full mb-4">
              <PlusCircle size={14} />
              {t('Part 2', 'Bhag 2')}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: 'Nunito, sans-serif' }}>
              {t('How to register a vendor', 'Vendor kaise register karein?')}
            </h2>
            <p className="text-gray-500 mt-2">
              {t('Give any local vendor their own page — free, in 2 minutes.', 'Kisi bhi local vendor ko unka apna page do — free, 2 minute mein.')}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {registerSteps.map((step, i) => (
              <StepCard key={i} number={i + 1} icon={step.icon} title={step.title} desc={step.desc} tip={step.tip} />
            ))}
          </div>

          {/* Form field explainer */}
          <div className="mt-12 bg-[#FFF7ED] rounded-3xl p-8 border-2 border-orange-100">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Smartphone size={20} className="text-[#F97316]" />
              {t('What each form field means', 'Form ke har field ka matlab')}
            </h3>
            <div className="space-y-4">
              {(lang === 'HI' ? [
                { field: 'Vendor ka Naam', example: 'Raju\'s Chai Stall', note: 'Woh naam jo log jaante hain — chahe nickname ho.' },
                { field: 'Category', example: 'Chai & Snacks', note: 'Jo sabse zyada milta-julta ho woh choose karo.' },
                { field: 'Kya Bechte Hain', example: 'Chai, Samosa, Bun Maska', note: 'Comma se alag karo. Yahi menu ban jaata hai!' },
                { field: 'Location / Landmark', example: 'Alpha 1 Metro Gate 2 ke saamne', note: 'Jitna specific utna accha — landmark se log aasani se dhundh sakte hain.' },
                { field: 'Opening Hours', example: '6 AM to 10 PM, Monday to Saturday', note: 'Yahi "Open Now" badge ke liye use hota hai.' },
                { field: 'UPI ID', example: 'raju.chai@paytm', note: 'Optional — agar vendor UPI accept karta hai.' },
                { field: 'WhatsApp Number', example: '9876543210', note: 'Optional — customers seedha message kar sakte hain.' },
                { field: 'Aapka Naam', example: 'Rahul (GL Bajaj Student)', note: 'Aapka naam — taaki pata chale kisne add kiya.' },
              ] : [
                { field: 'Vendor Name', example: 'Raju\'s Chai Stall', note: 'The name people know them by — a nickname is fine.' },
                { field: 'Category', example: 'Chai & Snacks', note: 'Pick the closest match to what they sell.' },
                { field: 'What They Sell', example: 'Chai, Samosa, Bun Maska', note: 'Separate with commas. This becomes their menu!' },
                { field: 'Location / Landmark', example: 'Opposite Alpha 1 Metro Gate 2', note: 'The more specific the better — a landmark helps people find them.' },
                { field: 'Opening Hours', example: '6 AM to 10 PM, Monday to Saturday', note: 'This powers the "Open Now" badge automatically.' },
                { field: 'UPI ID', example: 'raju.chai@paytm', note: 'Optional — only if the vendor accepts UPI payments.' },
                { field: 'WhatsApp Number', example: '9876543210', note: 'Optional — lets customers message the vendor directly.' },
                { field: 'Your Name', example: 'Rahul (GL Bajaj Student)', note: 'Your name — so people know who registered them.' },
              ]).map(item => (
                <div key={item.field} className="flex items-start gap-4 bg-white rounded-2xl p-4 border border-orange-100">
                  <ChevronRight size={16} className="text-[#F97316] mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-sm">{item.field}</span>
                      <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-mono">{item.example}</span>
                    </div>
                    <p className="text-gray-500 text-xs mt-1">{item.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-10">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 bg-[#F97316] text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-orange-600 transition-colors shadow-md"
            >
              <PlusCircle size={20} />
              {t('Register a Vendor Now →', 'Abhi Vendor Register Karo →')}
            </Link>
          </div>
        </div>
      </div>

      {/* ── Share tip ── */}
      <div className="bg-gradient-to-r from-[#F97316] to-orange-400 py-12 px-4 text-white text-center">
        <Share2 size={32} className="mx-auto mb-4 opacity-90" />
        <h2 className="text-2xl md:text-3xl font-bold mb-3">
          {t('Share a vendor\'s profile — it changes their life', 'Vendor ka profile share karo — unki zindagi badal do')}
        </h2>
        <p className="text-white/80 max-w-xl mx-auto mb-6 text-base">
          {t(
            'Every vendor profile has a Share button. Send it on WhatsApp to your friends — that\'s how a vendor gets their first 10 customers online.',
            'Har vendor profile mein Share button hai. WhatsApp pe doston ko bhejo — aise hi vendor ke pehle 10 online customers aate hain.'
          )}
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link to="/browse" className="bg-white text-[#F97316] px-6 py-3 rounded-xl font-bold hover:bg-orange-50 transition-colors">
            {t('Browse Vendors', 'Vendors Dekho')}
          </Link>
          <Link to="/register" className="bg-white/20 border-2 border-white text-white px-6 py-3 rounded-xl font-bold hover:bg-white/30 transition-colors">
            {t('Add a Vendor', 'Vendor Add Karo')}
          </Link>
        </div>
      </div>

      {/* ── FAQ ── */}
      <div id="faq" className="py-14 px-4 scroll-mt-20">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold" style={{ fontFamily: 'Nunito, sans-serif' }}>
              {t('Frequently Asked Questions', 'Aksar Pooche Jaane Wale Sawaal')}
            </h2>
            <p className="text-gray-500 mt-2">
              {t('Still confused? These answers cover the most common questions.', 'Abhi bhi confusion hai? Yeh answers sabse common sawaalon ke hain.')}
            </p>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <FaqItem key={i} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </div>

      {/* ── Final CTA ── */}
      <div className="bg-[#FFF7ED] py-14 px-4 text-center border-t border-orange-100">
        <div className="max-w-2xl mx-auto">
          <div className="text-5xl mb-4">🚀</div>
          <h2 className="text-3xl font-bold mb-3" style={{ fontFamily: 'Nunito, sans-serif' }}>
            {t('Ready to get started?', 'Shuru karne ke liye ready ho?')}
          </h2>
          <p className="text-gray-600 mb-8">
            {t(
              'Find a vendor near you, or give your favourite street vendor their first digital presence — free, right now.',
              'Paas ka vendor dhundho, ya apne favourite street vendor ko unka pehla digital presence do — free, abhi.'
            )}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/browse"
              className="flex items-center justify-center gap-2 bg-[#F97316] text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-orange-600 transition-colors"
            >
              <Search size={20} />
              {t('Find Vendors', 'Vendors Dhundho')}
            </Link>
            <Link
              to="/register"
              className="flex items-center justify-center gap-2 border-2 border-[#F97316] text-[#F97316] px-8 py-4 rounded-2xl font-bold text-lg hover:bg-orange-50 transition-colors"
            >
              <PlusCircle size={20} />
              {t('Register a Vendor', 'Vendor Register Karo')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
