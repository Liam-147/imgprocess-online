import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import I18nProvider from '@/components/I18nProvider';
import GoogleAnalytics from '@/components/GoogleAnalytics';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ImgProcess.online - 免费在线图片处理工具',
  description: '免费在线图片处理工具，支持图片格式转换、分割、拼接、AI去水印、背景替换、AI文生图和图片修复等多种功能。无需安装，即用即走。',
  keywords: '图片处理,在线图片处理,图片格式转换,图片分割,图片拼接,AI去水印,背景替换,AI文生图,图片修复,免费图片工具',
  openGraph: {
    title: 'ImgProcess.online - 免费在线图片处理工具',
    description: '免费在线图片处理工具，支持图片格式转换、分割、拼接、AI去水印、背景替换、AI文生图和图片修复等多种功能。',
    url: 'https://imgprocess.online',
    siteName: 'ImgProcess.online',
    images: [
      {
        url: 'https://imgprocess.online/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'ImgProcess.online 图片处理工具',
      },
    ],
    locale: 'zh_CN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ImgProcess.online - 免费在线图片处理工具',
    description: '免费在线图片处理工具，支持多种图片处理功能。',
    images: ['https://imgprocess.online/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'Q2hNy80tBW3T1b7JhYGDPz2_CiUBkGiUmzEFS85Q14U',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh">
      <body className={inter.className}>
        <I18nProvider>
          <GoogleAnalytics />
          <div className="min-h-screen bg-dark-bg text-white">
            <header className="container mx-auto py-4 px-4 flex justify-between items-center">
              <h1 className="text-2xl font-bold">ImgProcess.online</h1>
              <LanguageSwitcher />
            </header>
            <main>{children}</main>
          </div>
        </I18nProvider>
      </body>
    </html>
  );
} 