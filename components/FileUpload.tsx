
import React, { useRef, useState, useCallback } from 'react';
import { UploadIcon, SpinnerIcon, FileIcon } from './IconComponents';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  processing: boolean;
  selectedFile: File | null;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, processing, selectedFile }) => {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  }, [onFileSelect]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files[0]);
    }
  };

  const handleZoneClick = () => {
    inputRef.current?.click();
  };

  const borderColor = isDragging ? 'border-indigo-500' : 'border-slate-300';

  return (
    <div
      className={`relative w-full p-8 text-center bg-white border-2 ${borderColor} border-dashed rounded-xl cursor-pointer transition-all duration-300 hover:border-indigo-400 group`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={handleZoneClick}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".pdf"
        className="hidden"
        onChange={handleFileChange}
        disabled={processing}
      />
      {processing ? (
        <div className="flex flex-col items-center justify-center space-y-4">
          <SpinnerIcon className="w-12 h-12 text-indigo-500 animate-spin" />
          <p className="text-lg font-medium text-slate-600">Dosya İşleniyor...</p>
          <p className="text-sm text-slate-500">Bu işlem birkaç saniye sürebilir.</p>
        </div>
      ) : selectedFile ? (
        <div className="flex flex-col items-center justify-center space-y-3">
          <FileIcon className="w-12 h-12 text-green-500" />
          <p className="text-lg font-medium text-slate-700">Dosya Seçildi</p>
          <p className="text-sm text-slate-500 px-4 py-1 bg-slate-100 rounded-md truncate max-w-full">{selectedFile.name}</p>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center space-y-4">
          <UploadIcon className="w-12 h-12 text-slate-400 transition-colors group-hover:text-indigo-500" />
          <p className="text-lg font-medium text-slate-600">
            PDF dosyasını buraya sürükleyin veya <span className="text-indigo-600">tıklayın</span>
          </p>
          <p className="text-sm text-slate-500">Sadece .pdf uzantılı dosyalar kabul edilir</p>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
