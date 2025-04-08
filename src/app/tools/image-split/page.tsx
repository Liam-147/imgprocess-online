'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import JSZip from 'jszip';

interface ImageFile {
  id: string;
  file: File;
  preview: string;
}

interface SplitImage {
  data: string;
  row: number;
  col: number;
  selected: boolean;
}

interface GridLine {
  type: string;
  position: number;
  color: string;
  width: number;
  style: string;
}

export default function ImageSplit() {
  const { t } = useTranslation();
  const [files, setFiles] = useState<ImageFile[]>([]);
  const [gridSize, setGridSize] = useState({ rows: 3, cols: 3 });
  const [showGrid, setShowGrid] = useState(true);
  const [gridColor, setGridColor] = useState('#ffffff');
  const [gridWidth, setGridWidth] = useState(1);
  const [gridStyle, setGridStyle] = useState<'solid' | 'dashed'>('solid');
  const [splitImages, setSplitImages] = useState<SplitImage[]>([]);
  const [showGridPreview, setShowGridPreview] = useState(false);
  const [splitMode, setSplitMode] = useState<'grid' | 'custom'>('grid');
  const [customLines, setCustomLines] = useState<GridLine[]>([]);
  const [selectedLine, setSelectedLine] = useState<number | null>(null);
  const [lineType, setLineType] = useState<'horizontal' | 'vertical'>('horizontal');
  const [isConfirmed, setIsConfirmed] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });
  const [currentPoint, setCurrentPoint] = useState({ x: 0, y: 0 });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      preview: URL.createObjectURL(file)
    }));
    setFiles(prev => [...prev, ...newFiles]);
    setSplitImages([]);
    setShowGridPreview(true);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': []
    },
    multiple: false
  });

  const drawGrid = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    if (!showGrid || (splitMode === 'grid' && !isConfirmed)) return;

    const cellWidth = canvas.width / gridSize.cols;
    const cellHeight = canvas.height / gridSize.rows;

    ctx.strokeStyle = gridColor;
    ctx.lineWidth = gridWidth;

    if (splitMode === 'grid') {
      // 网格分割模式下只支持实线和虚线
      if (gridStyle === 'dashed') {
        ctx.setLineDash([5, 5]);
      } else {
        ctx.setLineDash([]);
      }

      // 绘制垂直线
      for (let i = 1; i < gridSize.cols; i++) {
        const x = i * cellWidth;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      // 绘制水平线
      for (let i = 1; i < gridSize.rows; i++) {
        const y = i * cellHeight;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
    } else {
      // 自定义分割模式下支持实线和虚线
      if (gridStyle === 'dashed') {
        ctx.setLineDash([5, 5]);
      } else {
        ctx.setLineDash([]);
      }

      // 绘制自定义线条
      customLines.forEach((line, index) => {
        ctx.strokeStyle = line.color;
        ctx.lineWidth = line.width;
        
        if (line.style === 'dashed') {
          ctx.setLineDash([5, 5]);
        } else {
          ctx.setLineDash([]);
        }

        ctx.beginPath();
        if (line.type === 'horizontal') {
          const y = (line.position / 100) * canvas.height;
          ctx.moveTo(0, y);
          ctx.lineTo(canvas.width, y);
        } else {
          const x = (line.position / 100) * canvas.width;
          ctx.moveTo(x, 0);
          ctx.lineTo(x, canvas.height);
        }
        ctx.stroke();
      });
    }

    // 重置线条样式
    ctx.setLineDash([]);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (splitMode !== 'custom') return;
    
    const canvas = previewCanvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    // 立即添加线条
    const position = lineType === 'horizontal' 
      ? (y / canvas.height) * 100 
      : (x / canvas.width) * 100;

    const newLine: GridLine = {
      type: lineType,
      position,
      color: gridColor,
      width: gridWidth,
      style: gridStyle
    };

    setCustomLines(prev => [...prev, newLine]);
    setShowGridPreview(true);
    updateGridPreview();
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = previewCanvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    setCurrentPoint({ x, y });
    updateGridPreview();
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const handleContextMenu = (e: React.MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    
    const canvas = previewCanvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // 找到最近的线条
    const nearestLine = customLines.reduce((nearest, line, index) => {
      const position = line.type === 'horizontal' 
        ? (y / canvas.height) * 100 
        : (x / canvas.width) * 100;
      const distance = Math.abs(position - line.position);
      return distance < 5 ? { index, distance } : nearest;
    }, { index: -1, distance: Infinity });

    if (nearestLine.index !== -1) {
      setCustomLines(prev => prev.filter((_, i) => i !== nearestLine.index));
      updateGridPreview();
    }
  };

  const updateGridPreview = () => {
    if (!previewCanvasRef.current || !canvasRef.current || files.length === 0) return;

    const previewCanvas = previewCanvasRef.current;
    const previewCtx = previewCanvas.getContext('2d');
    if (!previewCtx) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 设置预览画布大小
    previewCanvas.width = canvas.width;
    previewCanvas.height = canvas.height;

    // 绘制原始图片
    previewCtx.drawImage(canvas, 0, 0);

    // 绘制网格
    drawGrid(previewCtx, previewCanvas);
  };

  // 监听网格设置变化和图片变化
  useEffect(() => {
    if (files.length > 0) {
      const image = new Image();
      image.src = files[0].preview;
      image.onload = () => {
        if (canvasRef.current) {
          canvasRef.current.width = image.width;
          canvasRef.current.height = image.height;
          const ctx = canvasRef.current.getContext('2d');
          if (ctx) {
            ctx.drawImage(image, 0, 0);
            setShowGridPreview(true);
            updateGridPreview();
          }
        }
      };
    }
  }, [files]);

  useEffect(() => {
    if (splitMode === 'custom') {
      updateGridPreview();
    }
  }, [splitMode, gridColor, gridWidth, showGrid, gridStyle, customLines]);

  const splitImageGrid = async () => {
    if (files.length === 0 || !canvasRef.current) return;

    const image = new Image();
    image.src = files[0].preview;

    await new Promise((resolve) => {
      image.onload = resolve;
    });

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 设置画布大小与图片相同
    canvas.width = image.width;
    canvas.height = image.height;

    // 绘制原始图片
    ctx.drawImage(image, 0, 0);

    // 计算每个网格的大小
    const cellWidth = canvas.width / gridSize.cols;
    const cellHeight = canvas.height / gridSize.rows;

    // 存储分割后的图片
    const newSplitImages: SplitImage[] = [];

    // 分割图片
    for (let row = 0; row < gridSize.rows; row++) {
      for (let col = 0; col < gridSize.cols; col++) {
        // 创建临时画布
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = cellWidth;
        tempCanvas.height = cellHeight;
        const tempCtx = tempCanvas.getContext('2d');
        if (!tempCtx) continue;

        // 复制当前网格的图片部分
        tempCtx.drawImage(
          canvas,
          col * cellWidth,
          row * cellHeight,
          cellWidth,
          cellHeight,
          0,
          0,
          cellWidth,
          cellHeight
        );

        // 转换为 base64
        newSplitImages.push({
          data: tempCanvas.toDataURL('image/png'),
          row,
          col,
          selected: true
        });
      }
    }

    setSplitImages(newSplitImages);
    setShowGridPreview(true);
  };

  const splitImageCustom = async () => {
    if (files.length === 0 || !canvasRef.current) return;

    const image = new Image();
    image.src = files[0].preview;

    await new Promise((resolve) => {
      image.onload = resolve;
    });

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 设置画布大小与图片相同
    canvas.width = image.width;
    canvas.height = image.height;

    // 绘制原始图片
    ctx.drawImage(image, 0, 0);

    // 存储分割后的图片
    const newSplitImages: SplitImage[] = [];

    // 根据自定义线条分割图片
    const lines = [...customLines].sort((a, b) => a.position - b.position);
    const horizontalLines = lines.filter(line => line.type === 'horizontal');
    const verticalLines = lines.filter(line => line.type === 'vertical');

    // 添加边界线
    horizontalLines.unshift({ type: 'horizontal', position: 0, color: '', width: 0, style: 'solid' });
    horizontalLines.push({ type: 'horizontal', position: 100, color: '', width: 0, style: 'solid' });
    verticalLines.unshift({ type: 'vertical', position: 0, color: '', width: 0, style: 'solid' });
    verticalLines.push({ type: 'vertical', position: 100, color: '', width: 0, style: 'solid' });

    // 分割图片
    for (let i = 0; i < horizontalLines.length - 1; i++) {
      for (let j = 0; j < verticalLines.length - 1; j++) {
        const startX = (verticalLines[j].position / 100) * canvas.width;
        const startY = (horizontalLines[i].position / 100) * canvas.height;
        const width = ((verticalLines[j + 1].position - verticalLines[j].position) / 100) * canvas.width;
        const height = ((horizontalLines[i + 1].position - horizontalLines[i].position) / 100) * canvas.height;

        // 创建临时画布
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = width;
        tempCanvas.height = height;
        const tempCtx = tempCanvas.getContext('2d');
        if (!tempCtx) continue;

        // 复制当前区域的图片部分
        tempCtx.drawImage(
          canvas,
          startX,
          startY,
          width,
          height,
          0,
          0,
          width,
          height
        );

        // 转换为 base64
        newSplitImages.push({
          data: tempCanvas.toDataURL('image/png'),
          row: i,
          col: j,
          selected: true
        });
      }
    }

    setSplitImages(newSplitImages);
    setShowGridPreview(true);
  };

  const splitImage = async () => {
    if (splitMode === 'grid') {
      await splitImageGrid();
    } else {
      await splitImageCustom();
    }
  };

  const handleSplit = async () => {
    if (files.length === 0) return;
    
    try {
      await splitImage();
    } catch (err) {
      console.error('分割失败:', err);
    }
  };

  const handleUndo = () => {
    if (customLines.length > 0) {
      setCustomLines(prev => prev.slice(0, -1));
    } else {
      setSplitImages([]);
      setShowGridPreview(false);
    }
  };

  const handleNewSplit = () => {
    setFiles([]);
    setSplitImages([]);
    setShowGridPreview(false);
    setGridSize({ rows: 3, cols: 3 });
    setCustomLines([]);
  };

  const handleConfirm = () => {
    setIsConfirmed(true);
    setShowGridPreview(true);
    updateGridPreview();
  };

  const handleModeChange = (mode: 'grid' | 'custom') => {
    setSplitMode(mode);
    setCustomLines([]);
    setIsConfirmed(false);
    updateGridPreview();
  };

  const handleDownloadWithGrid = () => {
    if (!previewCanvasRef.current) return;

    const canvas = previewCanvasRef.current;
    const a = document.createElement('a');
    a.href = canvas.toDataURL('image/png');
    a.download = 'image_with_grid.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleBatchDownload = () => {
    const selectedImages = splitImages.filter(img => img.selected);
    selectedImages.forEach((image, index) => {
      const a = document.createElement('a');
      a.href = image.data;
      a.download = `split_${image.row + 1}_${image.col + 1}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  };

  const handleZipDownload = () => {
    const selectedImages = splitImages.filter(img => img.selected);
    const zip = new JSZip();
    
    selectedImages.forEach((image) => {
      const fileName = `split_${image.row + 1}_${image.col + 1}.png`;
      const base64Data = image.data.split(',')[1];
      zip.file(fileName, base64Data, { base64: true });
    });

    zip.generateAsync({ type: 'blob' })
      .then((content) => {
        const url = URL.createObjectURL(content);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'split_images.zip';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      });
  };

  const handleSelectImage = (index: number) => {
    setSplitImages(prev => prev.map((img, i) => 
      i === index ? { ...img, selected: !img.selected } : img
    ));
  };

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="mb-4">
        <Link href="/" className="text-blue-400 hover:text-blue-300 flex items-center">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          {t('back-to-home')}
        </Link>
      </div>

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">{t('image-split')}</h1>
        <p className="text-xl mb-2">{t('image-split-description')}</p>
        <p className="text-gray-300">{t('split-settings')}</p>
      </div>

      <div className="max-w-6xl mx-auto mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 左侧预览区域 */}
          <div className="bg-deep-blue p-4 rounded-md">
            <h2 className="text-xl font-bold mb-4 text-center">{t('preview')}</h2>
            <div 
              {...getRootProps()} 
              className={`upload-area mb-4 cursor-pointer ${isDragActive ? 'border-blue-500' : ''}`}
            >
              <input {...getInputProps()} />
              {isDragActive ? (
                <p className="text-xl">{t('drop-files')}</p>
              ) : (
                <div className="text-center">
                  <p className="text-xl mb-2">{t('drag-drop')}</p>
                  <p className="text-sm text-gray-300">{t('supported-formats')}</p>
                </div>
              )}
            </div>

            {files.length > 0 && (
              <div className="flex flex-col items-center">
                <div className="relative max-w-full max-h-[500px] overflow-auto">
                  <img
                    src={files[0].preview}
                    alt="预览"
                    className="max-w-full h-auto"
                    style={{ maxHeight: '500px' }}
                  />
                  {showGridPreview && (
                    <canvas
                      ref={previewCanvasRef}
                      className="absolute top-0 left-0 w-full h-full"
                      style={{ pointerEvents: splitMode === 'custom' ? 'auto' : 'none' }}
                      onMouseDown={handleMouseDown}
                      onMouseMove={handleMouseMove}
                      onMouseUp={handleMouseUp}
                      onMouseLeave={handleMouseUp}
                      onContextMenu={handleContextMenu}
                    />
                  )}
                </div>
                <canvas
                  ref={canvasRef}
                  className="hidden"
                />
              </div>
            )}
          </div>

          {/* 右侧设置区域 */}
          <div className="bg-deep-blue p-4 rounded-md">
            <h2 className="text-xl font-bold mb-4 text-center">{t('split-settings')}</h2>
            <div className="space-y-6">
              <div>
                <label className="block mb-2">{t('split-mode')}:</label>
                <select
                  value={splitMode}
                  onChange={(e) => handleModeChange(e.target.value as 'grid' | 'custom')}
                  className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
                  title={t('split-mode')}
                >
                  <option value="grid">{t('grid-mode')}</option>
                  <option value="custom">{t('custom-mode')}</option>
                </select>
              </div>

              {splitMode === 'grid' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2">{t('rows')}:</label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={gridSize.rows}
                      onChange={(e) => setGridSize(prev => ({ ...prev, rows: parseInt(e.target.value) }))}
                      className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
                      title={t('rows')}
                      placeholder={t('rows')}
                    />
                  </div>
                  <div>
                    <label className="block mb-2">{t('cols')}:</label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={gridSize.cols}
                      onChange={(e) => setGridSize(prev => ({ ...prev, cols: parseInt(e.target.value) }))}
                      className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
                      title={t('cols')}
                      placeholder={t('cols')}
                    />
                  </div>
                </div>
              )}

              {splitMode === 'custom' && (
                <div>
                  <label className="block mb-2">{t('line-type')}:</label>
                  <select
                    value={lineType}
                    onChange={(e) => setLineType(e.target.value as 'horizontal' | 'vertical')}
                    className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
                    title={t('line-type')}
                  >
                    <option value="horizontal">{t('horizontal')}</option>
                    <option value="vertical">{t('vertical')}</option>
                  </select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2">{t('line-color')}:</label>
                  <input
                    type="color"
                    value={gridColor}
                    onChange={(e) => setGridColor(e.target.value)}
                    className="w-full p-1 bg-gray-800 border border-gray-700 rounded"
                    title={t('line-color')}
                  />
                </div>
                <div>
                  <label className="block mb-2">{t('line-width')}:</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={gridWidth}
                    onChange={(e) => setGridWidth(parseInt(e.target.value))}
                    className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
                    title={t('line-width')}
                    placeholder={t('line-width')}
                  />
                </div>
              </div>

              <div>
                <label className="block mb-2">{t('line-style')}:</label>
                <select
                  value={gridStyle}
                  onChange={(e) => setGridStyle(e.target.value as 'solid' | 'dashed')}
                  className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
                  title={t('line-style')}
                >
                  <option value="solid">{t('solid')}</option>
                  <option value="dashed">{t('dashed')}</option>
                </select>
              </div>

              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={showGrid}
                    onChange={(e) => setShowGrid(e.target.checked)}
                    className="mr-2"
                  />
                  {t('show-grid')}
                  <span className="text-sm text-gray-400 ml-2">{t('confirm')}</span>
                </label>
              </div>

              <div className="flex justify-center space-x-4">
                {splitMode === 'grid' && (
                  <button
                    onClick={handleConfirm}
                    className="btn-primary"
                  >
                    {t('confirm')}
                  </button>
                )}
                <button
                  onClick={handleSplit}
                  className="btn-primary"
                >
                  {t('start-split')}
                </button>
                <button
                  onClick={handleUndo}
                  className="btn-primary"
                >
                  {t('undo')}
                </button>
                <button
                  onClick={handleNewSplit}
                  className="btn-primary"
                >
                  {t('new-split')}
                </button>
              </div>

              {splitImages.length > 0 && (
                <>
                  <div className="flex justify-center space-x-4 mb-4">
                    <button
                      onClick={handleDownloadWithGrid}
                      className="btn-primary"
                    >
                      {t('download-with-grid')}
                    </button>
                    <button
                      onClick={handleBatchDownload}
                      className="btn-primary"
                    >
                      {t('batch-download')}
                    </button>
                    <button
                      onClick={handleZipDownload}
                      className="btn-primary"
                    >
                      {t('zip-download')}
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {splitImages.map((image, index) => (
                      <div
                        key={index}
                        className={`relative cursor-pointer ${image.selected ? 'ring-2 ring-blue-500' : ''}`}
                        onClick={() => handleSelectImage(index)}
                      >
                        <img
                          src={image.data}
                          alt={`${t('preview')} ${index + 1}`}
                          className="w-full h-auto"
                        />
                        <div className="absolute top-0 right-0 p-1 bg-blue-500 text-white text-xs">
                          {image.row + 1}-{image.col + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 