'use client';

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  zh: {
    translation: {
      'format-conversion': '图片格式转换',
      'image-split': '图片分割',
      'image-merge': '图片拼接',
      'watermark-removal': 'AI去水印',
      'background-change': '一键更换背景',
      'text-to-image': 'AI文生图',
      'image-repair': '图片修复',
      'start-using': '开始使用',
      'learn-more': '了解更多',
      'our-features': '我们的功能',
      'why-choose-us': '为什么选择我们',
      'fast-processing': '快速处理',
      'security': '安全保障',
      'ai-powered': 'AI赋能',
      'convert': '开始转换',
      'converting': '转换中...',
      'batch-download': '批量下载',
      'zip-download': '打包下载',
      'batch-delete': '批量删除',
      'preview': '预览',
      'filename': '文件名',
      'size': '大小',
      'format': '转换格式',
      'actions': '操作',
      'download': '下载',
      'delete': '删除',
      'drag-drop': '拖放图片到这里，或点击选择文件',
      'supported-formats': '支持JPG、PNG、WEBP、GIF等格式',
      'output-format': '输出格式',
      'image-list': '图片列表',
      'back-to-home': '返回首页'
    }
  },
  en: {
    translation: {
      'format-conversion': 'Format Conversion',
      'image-split': 'Image Split',
      'image-merge': 'Image Merge',
      'watermark-removal': 'AI Watermark Removal',
      'background-change': 'Background Change',
      'text-to-image': 'Text to Image',
      'image-repair': 'Image Repair',
      'start-using': 'Start Using',
      'learn-more': 'Learn More',
      'our-features': 'Our Features',
      'why-choose-us': 'Why Choose Us',
      'fast-processing': 'Fast Processing',
      'security': 'Security',
      'ai-powered': 'AI Powered',
      'convert': 'Convert',
      'converting': 'Converting...',
      'batch-download': 'Batch Download',
      'zip-download': 'Download as ZIP',
      'batch-delete': 'Batch Delete',
      'preview': 'Preview',
      'filename': 'Filename',
      'size': 'Size',
      'format': 'Format',
      'actions': 'Actions',
      'download': 'Download',
      'delete': 'Delete',
      'drag-drop': 'Drag and drop images here, or click to select files',
      'supported-formats': 'Supports JPG, PNG, WEBP, GIF, etc.',
      'output-format': 'Output Format',
      'image-list': 'Image List',
      'back-to-home': 'Back to Home'
    }
  },
  ja: {
    translation: {
      'format-conversion': 'フォーマット変換',
      'image-split': '画像分割',
      'image-merge': '画像結合',
      'watermark-removal': 'AI透かし除去',
      'background-change': '背景変更',
      'text-to-image': 'テキストから画像生成',
      'image-repair': '画像修復',
      'start-using': '使い始める',
      'learn-more': 'もっと詳しく',
      'our-features': '機能一覧',
      'why-choose-us': '選ばれる理由',
      'fast-processing': '高速処理',
      'security': 'セキュリティ',
      'ai-powered': 'AI搭載',
      'convert': '変換開始',
      'converting': '変換中...',
      'batch-download': '一括ダウンロード',
      'zip-download': 'ZIPでダウンロード',
      'batch-delete': '一括削除',
      'preview': 'プレビュー',
      'filename': 'ファイル名',
      'size': 'サイズ',
      'format': 'フォーマット',
      'actions': '操作',
      'download': 'ダウンロード',
      'delete': '削除',
      'drag-drop': '画像をドラッグ＆ドロップするか、クリックしてファイルを選択',
      'supported-formats': 'JPG、PNG、WEBP、GIF等に対応',
      'output-format': '出力フォーマット',
      'image-list': '画像一覧',
      'back-to-home': 'ホームに戻る'
    }
  },
  ko: {
    translation: {
      'format-conversion': '포맷 변환',
      'image-split': '이미지 분할',
      'image-merge': '이미지 병합',
      'watermark-removal': 'AI 워터마크 제거',
      'background-change': '배경 변경',
      'text-to-image': '텍스트에서 이미지 생성',
      'image-repair': '이미지 복구',
      'start-using': '시작하기',
      'learn-more': '자세히 알아보기',
      'our-features': '기능',
      'why-choose-us': '선택하는 이유',
      'fast-processing': '빠른 처리',
      'security': '보안',
      'ai-powered': 'AI 지원',
      'convert': '변환',
      'converting': '변환 중...',
      'batch-download': '일괄 다운로드',
      'zip-download': 'ZIP으로 다운로드',
      'batch-delete': '일괄 삭제',
      'preview': '미리보기',
      'filename': '파일명',
      'size': '크기',
      'format': '포맷',
      'actions': '작업',
      'download': '다운로드',
      'delete': '삭제',
      'drag-drop': '이미지를 드래그 앤 드롭하거나 클릭하여 파일 선택',
      'supported-formats': 'JPG, PNG, WEBP, GIF 등 지원',
      'output-format': '출력 포맷',
      'image-list': '이미지 목록',
      'back-to-home': '홈으로 돌아가기'
    }
  }
};

if (!i18n.isInitialized) {
  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources,
      fallbackLng: 'zh',
      interpolation: {
        escapeValue: false
      }
    });
}

export default i18n; 