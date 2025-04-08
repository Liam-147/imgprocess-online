import Link from 'next/link';

// 功能列表
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
    available: false,
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

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-6 md:p-12">
      <div className="w-full max-w-6xl">
        <section className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">专业图片处理平台</h1>
          <p className="text-lg md:text-xl mb-8">一站式解决您的图片处理需求</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/tools" className="btn-primary py-2 px-6 rounded-md text-center">
              开始使用
            </Link>
            <Link href="/about" className="border border-white py-2 px-6 rounded-md text-center hover:bg-white hover:text-dark-bg transition-colors">
              了解更多
            </Link>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">我们的功能</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div key={feature.id} className="feature-card h-full flex flex-col items-center text-center">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-300 mb-4">{feature.description}</p>
                {feature.available ? (
                  <Link href={feature.path} className="btn-primary py-2 px-6 rounded-md">
                    立即进入
                  </Link>
                ) : (
                  <button className="bg-gray-700 text-gray-300 py-2 px-6 rounded-md cursor-not-allowed">
                    敬请期待
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">为什么选择我们</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-deep-blue rounded-lg">
              <div className="text-3xl mb-3">🚀</div>
              <h3 className="text-xl font-bold mb-2">快速处理</h3>
              <p>通过高效算法，快速处理您的图片需求</p>
            </div>
            <div className="p-6 bg-deep-blue rounded-lg">
              <div className="text-3xl mb-3">🔒</div>
              <h3 className="text-xl font-bold mb-2">安全保障</h3>
              <p>您的图片不会被存储，保障隐私安全</p>
            </div>
            <div className="p-6 bg-deep-blue rounded-lg">
              <div className="text-3xl mb-3">💡</div>
              <h3 className="text-xl font-bold mb-2">AI赋能</h3>
              <p>先进的AI技术，提供智能图片处理体验</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
} 