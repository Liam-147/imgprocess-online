'use client';

import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import Link from 'next/link';

const supportedFormats = [
  { value: 'jpeg', label: 'JPEG' },
  { value: 'png', label: 'PNG' },
  { value: 'webp', label: 'WEBP' },
  { value: 'gif', label: 'GIF' },
  { value: 'bmp', label: 'BMP' },
];

interface ImageFile {
  id: string;
  file: File;
  preview: string;
  convertedUrl?: string;
  convertedFormat?: string;
}

export default function FormatConversion() {
  const [files, setFiles] = useState<ImageFile[]>([]);
  const [outputFormat, setOutputFormat] = useState('jpeg');
  const [isConverting, setIsConverting] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      preview: URL.createObjectURL(file)
    }));
    setFiles(prev => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': []
    },
    multiple: true
  });

  useEffect(() => {
    return () => {
      files.forEach(file => URL.revokeObjectURL(file.preview));
    };
  }, [files]);

  const convertImage = async (imageFile: File, format: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          
          if (!ctx) {
            reject(new Error('无法创建canvas上下文'));
            return;
          }
          
          ctx.drawImage(img, 0, 0);
          
          try {
            let mimeType = 'image/jpeg';
            switch (format) {
              case 'png': mimeType = 'image/png'; break;
              case 'webp': mimeType = 'image/webp'; break;
              case 'bmp': mimeType = 'image/bmp'; break;
              case 'gif': mimeType = 'image/gif'; break;
            }
            
            const dataUrl = canvas.toDataURL(mimeType);
            resolve(dataUrl);
          } catch (err) {
            reject(new Error('转换过程中出错'));
          }
        };
        
        img.onerror = () => {
          reject(new Error('无法加载图片'));
        };
        
        img.src = event.target?.result as string;
      };
      
      reader.onerror = () => {
        reject(new Error('无法读取文件'));
      };
      
      reader.readAsDataURL(imageFile);
    });
  };

  const handleConvert = async () => {
    setIsConverting(true);
    try {
      const newFiles = await Promise.all(files.map(async (file) => {
        if (!file.convertedUrl) {
          const convertedUrl = await convertImage(file.file, outputFormat);
          return {
            ...file,
            convertedUrl,
            convertedFormat: outputFormat
          };
        }
        return file;
      }));
      setFiles(newFiles);
    } catch (err) {
      console.error('转换失败:', err);
    } finally {
      setIsConverting(false);
    }
  };

  const handleDownload = (file: ImageFile) => {
    if (file.convertedUrl) {
      const a = document.createElement('a');
      a.href = file.convertedUrl;
      const originalFileName = file.file.name;
      const fileName = originalFileName.substring(0, originalFileName.lastIndexOf('.')) || originalFileName;
      a.download = `${fileName}.${file.convertedFormat}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const handleDelete = (id: string) => {
    setFiles(prev => prev.filter(file => file.id !== id));
  };

  const handleBatchDownload = () => {
    files.forEach(file => {
      if (file.convertedUrl) {
        handleDownload(file);
      }
    });
  };

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
    
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">图片格式转换</h1>
        <p className="text-xl mb-2">免费在线转换您的图像</p>
        <p className="text-gray-300">轻松将图像文件转换为所需的格式，而不会造成任何质量损失</p>
      </div>
      
      <div className="max-w-2xl mx-auto mb-8">
        <div 
          {...getRootProps()} 
          className={`upload-area mb-4 cursor-pointer ${isDragActive ? 'border-blue-500' : ''}`}
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <p className="text-xl">放开以上传图片...</p>
          ) : (
            <div className="text-center">
              <p className="text-xl mb-2">拖放图片到这里，或点击选择文件</p>
              <p className="text-sm text-gray-300">支持JPG、PNG、WEBP、GIF等格式</p>
            </div>
          )}
        </div>

        <div className="bg-deep-blue p-4 rounded-md mb-4">
          <h2 className="text-xl font-bold mb-4 text-center">转换设置</h2>
          <div className="mb-4">
            <label htmlFor="format-select" className="block mb-2 text-center">输出格式:</label>
            <select
              id="format-select"
              value={outputFormat}
              onChange={(e) => setOutputFormat(e.target.value)}
              className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
              title="选择输出格式"
            >
              {supportedFormats.map((format) => (
                <option key={format.value} value={format.value}>
                  {format.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 justify-center mb-8">
          <button
            onClick={handleConvert}
            disabled={files.length === 0 || isConverting}
            className={`py-2 px-6 rounded-md font-bold ${
              files.length === 0 || isConverting
                ? 'bg-gray-500 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isConverting ? '转换中...' : '开始转换'}
          </button>
          <button
            onClick={handleBatchDownload}
            disabled={files.length === 0 || !files.some(f => f.convertedUrl)}
            className={`py-2 px-6 rounded-md font-bold ${
              files.length === 0 || !files.some(f => f.convertedUrl)
                ? 'bg-gray-500 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            批量下载
          </button>
          <button
            onClick={() => setFiles([])}
            disabled={files.length === 0}
            className={`py-2 px-6 rounded-md font-bold ${
              files.length === 0
                ? 'bg-gray-500 cursor-not-allowed'
                : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            批量删除
          </button>
        </div>
      </div>

      {files.length > 0 && (
        <div className="bg-deep-blue p-4 rounded-md">
          <h2 className="text-xl font-bold mb-4 text-center">图片列表</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="p-2 text-left">预览</th>
                  <th className="p-2 text-left">文件名</th>
                  <th className="p-2 text-left">大小</th>
                  <th className="p-2 text-left">转换格式</th>
                  <th className="p-2 text-left">操作</th>
                </tr>
              </thead>
              <tbody>
                {files.map((file) => (
                  <tr key={file.id} className="border-b border-gray-700">
                    <td className="p-2">
                      <img 
                        src={file.preview} 
                        alt="预览"
                        className="w-16 h-16 object-cover rounded"
                      />
                    </td>
                    <td className="p-2">{file.file.name}</td>
                    <td className="p-2">{(file.file.size / 1024 / 1024).toFixed(2)} MB</td>
                    <td className="p-2">{file.convertedFormat || '-'}</td>
                    <td className="p-2">
                      <div className="flex gap-2">
                        {file.convertedUrl && (
                          <button
                            onClick={() => handleDownload(file)}
                            className="bg-green-600 hover:bg-green-700 py-1 px-3 rounded-md text-sm"
                          >
                            下载
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(file.id)}
                          className="bg-red-600 hover:bg-red-700 py-1 px-3 rounded-md text-sm"
                        >
                          删除
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
} 