import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import I18nProvider from '@/components/I18nProvider';
import GoogleAnalytics from '@/components/GoogleAnalytics';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ImgProcess.online - 在线图片处理工具',
  description: '免费在线图片处理工具，支持格式转换、图片分割、AI去水印等功能',
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