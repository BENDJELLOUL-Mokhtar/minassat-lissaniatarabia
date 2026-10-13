import type { Metadata } from 'next';
import { Cairo, Outfit } from 'next/font/google';
import './globals.css';

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  variable: '--font-cairo',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'المنصة التعليمية للأستاذ الدكتور بن جلول مختار | جامعة ابن خلدون تيارت',
  description: 'المنصة الأكاديمية الرسمية للأستاذ الدكتور بن جلول مختار - جامعة ابن خلدون تيارت - كلية الآداب واللغات - قسم اللغة والأدب العربي - مخبر الدراسات النحوية واللغوية بين التراث والحداثة في الجزائر. مقاييس اللسانيات العربية، الصرف العربي، والنحو العربي.',
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} ${outfit.variable} dark`}>
      <body className="min-h-screen bg-[#080d1a] text-gray-100 antialiased selection:bg-amber-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
