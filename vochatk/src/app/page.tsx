'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BsChatDots, BsLightning, BsShare, BsChatQuote, BsPalette } from 'react-icons/bs';

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
          icon: '⚡',
        },
        {
          title: 'File Sharing',
          description: 'Share images, documents, and more securely',
          icon: '📎',
        },
        {
          title: 'Message Threading',
          description: 'Organize conversations with reply threads',
          icon: '💬',
        },
        {
          title: 'Rich Media Support',
          description: 'Send emojis, GIFs, and reactions',
          icon: '🎨',
        },
      ],
    },
    footer: {
      company: 'Company',
      support: 'Support',
      legal: 'Legal',
      copyright: '© 2024 18K Chat. All rights reserved.',
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
          icon: '⚡',
        },
        {
          title: 'ဖိုင်မျှဝေခြင်း',
          description: 'ပုံများ၊ စာရွက်စာတမ်းများနှင့် အခြားအရာများကို လုံခြုံစွာ မျှဝေနါ',
          icon: '📎',
        },
        {
          title: 'စာပို့ချက်အစု်လိုက်',
          description: 'ပြန်စာများဖြင့် စကားဝိုင်းများကို စီစဉ်ပါ',
          icon: '💬',
        },
        {
          title: 'မီဒီယာပံ့ို���မှု',
          description: 'အီမိုဂျီများ၊ GIF များနှင့် တုံ့ပြန်မှုများ ပို့ပါ',
          icon: '🎨',
        },
      ],
    },
    footer: {
      company: 'ကုမ္ပဏီ',
      support: 'ပံ့ပိုးမှု',
      legal: 'ဥပဒေရေးရာ',
      copyright: '© 2024 18K Chat။ မူပိုင်ခွင့်အားလုံး ရယူထားသည်။',
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
          icon: '⚡',
        },
        {
          title: 'แชร์ไฟล์',
          description: 'แชร์รูปภาพ เอกสาร และอื่นๆ ได้อย่างปลอดภัย',
          icon: '📎',
        },
        {
          title: 'การจัดเรียง้อควม',
          description: 'จัดระเบียบการสนทนาด้วยเธรดการตอบกลับ',
          icon: '💬',
        },
        {
          title: 'รองรับสื่อหลากหลาย',
          description: 'ส่งอิโมจิ GIF และการตอบสนอง',
          icon: '🎨',
        },
      ],
    },
    footer: {
      company: 'บริษัท',
      support: 'การสนับสนุน',
      legal: 'กฎหมาย',
      copyright: '© 2024 18K Chat สงวนลิขสิทธิ์',
    },
  },
};

export default function Page() {
  const [language, setLanguage] = useState('en');
  const t = translations[language as keyof typeof translations];
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-pulse">
          <div className="h-32 w-32 bg-gray-700 rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-[10px] opacity-30">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-gray-700 rounded-full mix-blend-overlay filter blur-xl animate-blob"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-gray-600 rounded-full mix-blend-overlay filter blur-xl animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-gray-800 rounded-full mix-blend-overlay filter blur-xl animate-blob animation-delay-4000"></div>
        </div>
      </div>

      {/* Language Selector */}
      <div className="absolute top-4 right-4 flex gap-2 z-10">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={`px-3 py-1 rounded-full transition-all ${
              language === lang.code
                ? 'bg-indigo-600/20 text-white hover:bg-indigo-500/20'
                : 'bg-gray-800/80 text-gray-300 hover:bg-gray-700/80'
            }`}
          >
            {lang.name}
          </button>
        ))}
      </div>

      {/* Hero Section */}
      <div className="relative container mx-auto px-4 pt-20 pb-12 text-center">
        <div className="animate-pulse-zoom relative">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 blur-3xl transform scale-110"></div>
          <h1 className="text-8xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-gray-100 via-indigo-300 to-gray-100 font-mono tracking-tight relative">
            18K
          </h1>
          <h2 className="text-4xl font-bold mb-6 text-indigo-300 font-mono tracking-wider relative">
            CHAT
          </h2>
        </div>
        <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto transform hover:scale-105 transition-transform duration-300">
          {t.hero.subtitle}
        </p>
        <button
          onClick={() => router.push('/login')}
          className="neon-button animated"
        >
          <span className="neon-button-content">
            <span>{t.hero.cta}</span>
            <BsChatDots className="w-5 h-5 icon-bounce" />
          </span>
        </button>
      </div>

      {/* Features Section */}
      <div className="relative bg-gray-800/80 backdrop-blur-sm py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-gray-100 via-indigo-300 to-gray-400 transform hover:scale-105 transition-transform duration-300">
            {t.features.title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: <BsLightning className="icon-shake text-yellow-400" />, title: t.features.items[0].title, description: t.features.items[0].description },
              { icon: <BsShare className="icon-spin text-blue-400" />, title: t.features.items[1].title, description: t.features.items[1].description },
              { icon: <BsChatQuote className="icon-bounce text-green-400" />, title: t.features.items[2].title, description: t.features.items[2].description },
              { icon: <BsPalette className="icon-float-rotate text-purple-400" />, title: t.features.items[3].title, description: t.features.items[3].description },
            ].map((feature, index) => (
              <div
                key={index}
                className="card group"
                style={{ 
                  animationDelay: `${index * 200}ms`,
                  transform: `perspective(1000px) rotateY(${index % 2 === 0 ? '5deg' : '-5deg'})` 
                }}
              >
                <div className="icon-wrapper group-hover:text-indigo-400">
                  {feature.icon}
                </div>
                <h3 className="title group-hover:text-indigo-300">
                  {feature.title}
                </h3>
                <p className="description">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative bg-gray-950 text-gray-300 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="font-semibold mb-4 text-gray-100">{t.footer.company}</h4>
              <ul className="space-y-2 text-gray-500">
                <li className="hover:text-gray-300 transition-colors">About</li>
                <li className="hover:text-gray-300 transition-colors">Careers</li>
                <li className="hover:text-gray-300 transition-colors">Blog</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-gray-100">{t.footer.support}</h4>
              <ul className="space-y-2 text-gray-500">
                <li className="hover:text-gray-300 transition-colors">Help Center</li>
                <li className="hover:text-gray-300 transition-colors">Contact Us</li>
                <li className="hover:text-gray-300 transition-colors">Status</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-gray-100">{t.footer.legal}</h4>
              <ul className="space-y-2 text-gray-500">
                <li className="hover:text-gray-300 transition-colors">Privacy</li>
                <li className="hover:text-gray-300 transition-colors">Terms</li>
                <li className="hover:text-gray-300 transition-colors">Security</li>
              </ul>
            </div>
          </div>
          <div className="text-center text-gray-500 text-sm">
            {t.footer.copyright}
          </div>
        </div>
      </footer>
    </div>
  );
}
