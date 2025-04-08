'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';

// 功能列表
const features = [
  {
    id: 'format-conversion',
    icon: '🔄',
    path: '/tools/format-conversion',
    available: true,
  },
  {
    id: 'image-split',
    icon: '✂️',
    path: '/tools/image-split',
    available: false,
  },
  {
    id: 'image-merge',
    icon: '🔗',
    path: '/tools/image-merge',
    available: false,
  },
  {
    id: 'watermark-removal',
    icon: '💧',
    path: '/tools/watermark-removal',
    available: false,
  },
  {
    id: 'background-change',
    icon: '🖼️',
    path: '/tools/background-change',
    available: false,
  },
  {
    id: 'text-to-image',
    icon: '✨',
    path: '/tools/text-to-image',
    available: false,
  },
  {
    id: 'image-repair',
    icon: '🔧',
    path: '/tools/image-repair',
    available: false,
  }
];

export default function Home() {
  const { t } = useTranslation();
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-6 md:p-12">
      <div className="w-full max-w-6xl">
        <section className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">{t('app-title')}</h1>
          <p className="text-lg md:text-xl mb-8">{t('app-subtitle')}</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/tools" className="btn-primary py-2 px-6 rounded-md text-center">
              {t('start-using')}
            </Link>
            <Link href="/about" className="border border-white py-2 px-6 rounded-md text-center hover:bg-white hover:text-dark-bg transition-colors">
              {t('learn-more')}
            </Link>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">{t('our-features')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div key={feature.id} className="feature-card h-full flex flex-col items-center text-center">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2">{t(feature.id)}</h3>
                <p className="text-gray-300 mb-4">{t(`${feature.id}-description`)}</p>
                {feature.available ? (
                  <Link href={feature.path} className="btn-primary py-2 px-6 rounded-md">
                    {t('start-using')}
                  </Link>
                ) : (
                  <button className="bg-gray-700 text-gray-300 py-2 px-6 rounded-md cursor-not-allowed">
                    {t('coming-soon')}
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">{t('why-choose-us')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-deep-blue rounded-lg">
              <div className="text-3xl mb-3">🚀</div>
              <h3 className="text-xl font-bold mb-2">{t('fast-processing')}</h3>
              <p>{t('fast-processing-desc')}</p>
            </div>
            <div className="p-6 bg-deep-blue rounded-lg">
              <div className="text-3xl mb-3">🔒</div>
              <h3 className="text-xl font-bold mb-2">{t('security')}</h3>
              <p>{t('security-desc')}</p>
            </div>
            <div className="p-6 bg-deep-blue rounded-lg">
              <div className="text-3xl mb-3">💡</div>
              <h3 className="text-xl font-bold mb-2">{t('ai-powered')}</h3>
              <p>{t('ai-powered-desc')}</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
} 