import type {Metadata} from 'next';
import { Plus_Jakarta_Sans, Cinzel } from 'next/font/google';
import './globals.css';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-sans',
  display: 'swap',
});

const cinzel = Cinzel({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
  variable: '--font-display',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'AURA Dental Clinique — Swiss Luxury Medical Experience',
  description: 'An award-winning Swiss luxury dental clinic with scroll-driven 3D tooth canvas scrubbing, interactive doctor showcase, before/after smile comparison slider, real-time booking with email alerts, and encrypted patient records.',
  openGraph: {
    title: 'AURA Dental Clinique — Swiss Luxury Medical Experience',
    description: 'An award-winning Swiss luxury dental clinic with scroll-driven 3D tooth canvas scrubbing, interactive doctor showcase, before/after smile comparison slider, real-time booking with email alerts, and encrypted patient records.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AURA Dental Clinique — Swiss Luxury Medical Experience',
    description: 'An award-winning Swiss luxury dental clinic with scroll-driven 3D tooth canvas scrubbing, interactive doctor showcase, before/after smile comparison slider, real-time booking with email alerts, and encrypted patient records.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`dark scroll-smooth ${plusJakartaSans.variable} ${cinzel.variable}`}>
      <body className="bg-black text-slate-100 antialiased selection:bg-cyan-500/20 selection:text-cyan-200" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}


