'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// SVG Icons
const ChatDotsIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 16 16" fill="currentColor">
    <path d="M5 8a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm4 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm4 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"/>
    <path d="m2.165 15.803.02-.004c1.83-.363 2.948-.842 3.468-1.105A9.06 9.06 0 0 0 8 15c4.418 0 8-3.134 8-7s-3.582-7-8-7-8 3.134-8 7c0 1.76.743 3.37 1.97 4.6a10.437 10.437 0 0 1-.524 2.318l-.003.011a10.722 10.722 0 0 1-.244.637c-.079.186.074.394.273.362a21.673 21.673 0 0 0 .693-.125zm.8-3.108a1 1 0 0 0-.287-.801C1.618 10.83 1 9.468 1 8c0-3.192 3.004-6 7-6s7 2.808 7 6c0 3.193-3.004 6-7 6a8.06 8.06 0 0 1-2.088-.272 1 1 0 0 0-.711.074c-.387.196-1.24.57-2.634.893a10.97 10.97 0 0 0 .398-2z"/>
  </svg>
);

const LightningIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 16 16" fill="currentColor">
    <path d="M5.52.359A.5.5 0 0 1 6 0h4a.5.5 0 0 1 .474.658L8.694 6H12.5a.5.5 0 0 1 .395.807l-7 9a.5.5 0 0 1-.873-.454L6.823 9.5H3.5a.5.5 0 0 1-.48-.641l2.5-8.5z"/>
  </svg>
);

const ShareIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 16 16" fill="currentColor">
    <path d="M11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.499 2.499 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5z"/>
  </svg>
);

const ChatQuoteIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 16 16" fill="currentColor">
    <path d="M2.678 11.894a1 1 0 0 1 .287.801 10.97 10.97 0 0 1-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 0 1 .71-.074A8.06 8.06 0 0 0 8 14c3.996 0 7-2.807 7-6 0-3.192-3.004-6-7-6S1 4.808 1 8c0 1.468.617 2.83 1.678 3.894zm-.493 3.905a21.682 21.682 0 0 1-.713.129c-.2.032-.352-.176-.273-.362a9.68 9.68 0 0 0 .244-.637l.003-.01c.248-.72.45-1.548.524-2.319C.743 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7-3.582 7-8 7a9.06 9.06 0 0 1-2.347-.306c-.52.263-1.639.742-3.468 1.105z"/>
    <path d="M7.066 6.76A1.665 1.665 0 0 0 4 7.668a1.667 1.667 0 0 0 2.561 1.406c-.131.389-.375.804-.777 1.22a.417.417 0 0 0 .6.58c1.486-1.54 1.293-3.214.682-4.112zm4 0A1.665 1.665 0 0 0 8 7.668a1.667 1.667 0 0 0 2.561 1.406c-.131.389-.375.804-.777 1.22a.417.417 0 0 0 .6.58c1.486-1.54 1.293-3.214.682-4.112z"/>
  </svg>
);

const PaletteIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 16 16" fill="currentColor">
    <path d="M8 5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm4 3a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM5.5 7a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm.5 6a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"/>
    <path d="M16 8c0 3.15-1.866 2.585-3.567 2.07C11.42 9.763 10.465 9.473 10 10c-.603.683-.475 1.819-.351 2.92C9.826 14.495 9.996 16 8 16a8 8 0 1 1 8-8zm-8 7c.611 0 .654-.171.655-.176.078-.146.124-.464.07-1.119-.014-.168-.037-.37-.061-.591-.052-.464-.112-1.005-.118-1.462-.01-.707.083-1.61.704-2.314.369-.417.845-.578 1.272-.618.404-.038.812.026 1.16.104.343.077.702.186 1.025.284l.028.008c.346.105.658.199.953.266.653.148.904.083.991.024C14.717 9.38 15 9.161 15 8a7 7 0 1 0-7 7z"/>
  </svg>
);

const languages = [
  { code: 'en', name: 'English' },
  { code: 'my', name: 'Myanmar' },
  { code: 'th', name: 'Thai' },
];

const translations = {
  en: {
    hero: {
      title: '18K Chat',
      subtitle: 'Connect, Share, and Communicate Seamlessly',
      cta: 'Start Chatting',
    },
    features: {
      title: 'Why Choose 18K Chat?',
      items: [
        {
          title: 'Real-time Messaging',
          description: 'Instant message delivery with typing indicators',
          icon: <LightningIcon />,
        },
        {
          title: 'File Sharing',
          description: 'Share images, documents, and more securely',
          icon: <ShareIcon />,
        },
        {
          title: 'Message Threading',
          description: 'Organize conversations with reply threads',
          icon: <ChatQuoteIcon />,
        },
        {
          title: 'Rich Media Support',
          description: 'Send emojis, GIFs, and reactions',
          icon: <PaletteIcon />,
        },
      ],
    },
    footer: {
      company: 'Company',
      support: 'Support',
      legal: 'Legal',
      copyright: ' 2024 18K Chat. All rights reserved.',
    },
  },
  my: {
    hero: {
      title: '18K Chat',
      subtitle: 'ျိတ်ဆက်ပြီး မျှေပြီး အဆင်ပြေစွာ ဆက်သွယ်ပါ',
      cta: 'စကားပြောစတင်ပါ',
    },
    features: {
      title: '18K Chat ကို ဘာကြောင့်ရွေးချယ်သင့်သလဲ။',
      items: [
        {
          title: 'အချိန်နှင့်တပြေးညီ စာပို့ခြင်း',
          description: 'စာရိုက်နေကြောင်း ပြသချက်နျားဖြင့် ချက်ချင်းစာပို့ခြင်း',
          icon: <LightningIcon />,
        },
        {
          title: 'ဖိုင်မျှဝေခြင်း',
          description: 'ပုံများ၊ စာရွက်စာတမ်းများနှင့် အခြားအရာများကို လုံခြုံစွာ မျှဝေနါ',
          icon: <ShareIcon />,
        },
        {
          title: 'စာပို့ချက်အစု်လိုက်',
          description: 'ပြန်စာများဖြင့် စကားဝိုင်းများကို စီစဉ်ပါ',
          icon: <ChatQuoteIcon />,
        },
        {
          title: 'မီဒီယာပံ့ပိုးမှု',
          description: 'အီမိုဂျီများ၊ GIF များနှင့် တုံ့ပြန်မှုများ ပို့ပါ',
          icon: <PaletteIcon />,
        },
      ],
    },
    footer: {
      company: 'ကုမ္ပဏီ',
      support: 'ပံ့ပိုးမှု',
      legal: 'ဥပဒေရေးရာ',
      copyright: ' 2024 18K Chat။ မူပိုင်ခွင့်အားလုံး ရယူထားသည်။',
    },
  },
  th: {
    hero: {
      title: '18K Chat',
      subtitle: 'เชื่อมต่อ แชร์ และสื่อสารได้อย่างราบรื่น',
      cta: 'เริ่มแชท',
    },
    features: {
      title: 'ทำไมต้องเลือก 18K Chat?',
      items: [
        {
          title: 'ข้อความแบบเรียลไทม์',
          description: 'ส่งข้อความทันทีพร้อมตัวบ่งชี้การพิมพ์',
          icon: <LightningIcon />,
        },
        {
          title: 'การแชร์ไฟล์',
          description: 'แชร์รูปภาพ เอกสาร และอื่นๆ อย่างปลอดภัย',
          icon: <ShareIcon />,
        },
        {
          title: 'การจัดการเธรด',
          description: 'จัดระเบียบการสนทนาด้วยเธรดการตอบกลับ',
          icon: <ChatQuoteIcon />,
        },
        {
          title: 'รองรับสื่อที่หลากหลาย',
          description: 'ส่งอิโมจิ GIF และการตอบสนอง',
          icon: <PaletteIcon />,
        },
      ],
    },
    footer: {
      company: 'บริษัท',
      support: 'การสนับสนุน',
      legal: 'กฎหมาย',
      copyright: ' 2024 18K Chat สงวนลิขสิทธิ์',
    },
  },
};

export default function Page() {
  const [language, setLanguage] = useState('en');
  const router = useRouter();

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'en';
    setLanguage(savedLanguage);
  }, []);

  const t = translations[language as keyof typeof translations];

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navigation */}
      <nav className="bg-gray-800/50 backdrop-blur-sm fixed w-full z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <ChatDotsIcon />
                <span className="text-xl font-bold">{t.hero.title}</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <select
                  value={language}
                  onChange={(e) => handleLanguageChange(e.target.value)}
                  className="bg-gray-700 text-white rounded-lg px-3 py-1 appearance-none pr-8 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {languages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.name}
                    </option>
                  ))}
                </select>
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <Link
                href="/login"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                {t.hero.cta}
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto pt-32 pb-16 px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-transparent bg-clip-text">
            {t.hero.title}
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            {t.hero.subtitle}
          </p>
          <Link
            href="/login"
            className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 md:text-lg transition-colors duration-200"
          >
            {t.hero.cta}
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">{t.features.title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {t.features.items.map((feature, index) => (
              <div
                key={index}
                className="p-6 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors duration-200"
              >
                <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800/50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">{t.footer.company}</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-white">About</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Careers</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Blog</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">{t.footer.support}</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-white">Help Center</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Contact Us</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Status</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">{t.footer.legal}</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-white">Privacy</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Terms</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Cookie Policy</a></li>
              </ul>
            </div>
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <ChatDotsIcon />
                <span className="text-xl font-bold">{t.hero.title}</span>
              </div>
              <p className="text-gray-300">{t.footer.copyright}</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
