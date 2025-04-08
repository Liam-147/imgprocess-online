'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

// 功能列表 - 与首页相同
const features = [
  {
    id: 'format-conversion',
    title: '图片格式转换',
    description: '支持JPG、PNG、WEBP等格式互转，可调整质量参数',
    icon: '🔄',
    path: '/tools/format-conversion',
    available: true,
  },
  {
    id: 'image-split',
    title: '图片分割',
    description: '将一张图片分割成多个部分，支持自定义网格分割',
    icon: '✂️',
    path: '/tools/image-split',
    available: true,
  },
  {
    id: 'image-merge',
    title: '图片拼接',
    description: '多张图片智能拼接，支持水平和垂直拼接模式',
    icon: '🔗',
    path: '/tools/image-merge',
    available: false,
  },
  {
    id: 'watermark-removal',
    title: 'AI去水印',
    description: '智能识别并去除图片中的水印，保持原图质量',
    icon: '💧',
    path: '/tools/watermark-removal',
    available: false,
  },
  {
    id: 'background-change',
    title: '一键更换背景',
    description: '智能分离前景，轻松替换图片背景',
    icon: '🖼️',
    path: '/tools/background-change',
    available: false,
  },
  {
    id: 'text-to-image',
    title: 'AI文生图',
    description: '通过文字描述生成图像，支持多种风格',
    icon: '✨',
    path: '/tools/text-to-image',
    available: false,
  },
  {
    id: 'image-repair',
    title: '图片修复',
    description: '智能修复图片瑕疵，优化老照片，去除不需要的元素',
    icon: '🔧',
    path: '/tools/image-repair',
    available: false,
  }
];

export default function Tools() {
  const router = useRouter();

  // 目前只有格式转换功能可用，其他功能将来添加
  // 如果直接访问tools页面，我们可以自动跳转到格式转换工具
  useEffect(() => {
    const availableTools = features.filter(f => f.available);
    if (availableTools.length === 1) {
      router.push(availableTools[0].path);
    }
  }, [router]);

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="mb-4">
        <Link href="/" className="text-blue-400 hover:text-blue-300 flex items-center">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          返回首页
        </Link>
      </div>
      
      <h1 className="text-3xl font-bold mb-8 text-center">图片处理工具</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature) => (
          <div 
            key={feature.id}
            className={`feature-card h-full relative ${!feature.available ? 'opacity-50' : ''}`}
          >
            <div className="text-4xl mb-4">{feature.icon}</div>
            <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
            <p className="text-gray-300">{feature.description}</p>
            
            {feature.available ? (
              <Link 
                href={feature.path}
                className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 bg-deep-blue/80 transition-opacity"
              >
                <span className="bg-blue-600 px-4 py-2 rounded-md">开始使用</span>
              </Link>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-dark-bg/80">
                <span className="bg-gray-700 px-4 py-2 rounded-md">即将推出</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 