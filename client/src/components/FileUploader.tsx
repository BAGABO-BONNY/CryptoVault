import React, { useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Upload, File, AlertCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FileUploaderProps {
  onFileSelect: (file: File, content: string) => void;
  className?: string;
  accept?: string;
  maxSize?: number; // in MB
  disabled?: boolean;
}

const FileUploader = ({
  onFileSelect,
  className,
  accept = '*',
  maxSize = 5, // Default 5MB
  disabled = false
}: FileUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        if (event.target?.result) {
          resolve(event.target.result as string);
        } else {
          reject(new Error('Failed to read file'));
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
      
      reader.readAsText(file);
    });
  };

  const processFile = async (file: File) => {
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size exceeds ${maxSize}MB limit`);
      return;
    }
    
    if (accept !== '*') {
      const acceptedTypes = accept.split(',').map(type => type.trim());
      const fileType = file.type || `application/${file.name.split('.').pop()}`;
      
      if (!acceptedTypes.some(type => 
        type === fileType || 
        (type.includes('*') && fileType.startsWith(type.replace('*', '')))
      )) {
        setError(`Invalid file type. Accepted: ${accept}`);
        return;
      }
    }
    
    setError(null);
    setSelectedFile(file);
    setIsLoading(true);
    
    try {
      const content = await readFileContent(file);
      onFileSelect(file, content);
    } catch (err) {
      setError('Failed to read file content');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (disabled) return;
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      processFile(file);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      processFile(file);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const clearFile = () => {
    setSelectedFile(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={cn(
      "relative",
      className
    )}>
      <input
        type="file"
        className="sr-only"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        accept={accept}
        disabled={disabled}
      />
      
      {!selectedFile ? (
        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors",
            isDragging 
              ? "border-primary-400 bg-primary-50 dark:border-primary-500 dark:bg-primary-900/20" 
              : "border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800/50",
            disabled && "opacity-50 cursor-not-allowed",
            error && "border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={disabled ? undefined : handleButtonClick}
        >
          {error ? (
            <div className="text-center">
              <AlertCircle className="mx-auto h-10 w-10 text-red-500 mb-2" />
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={(e) => {
                  e.stopPropagation();
                  setError(null);
                }}
                className="mt-2"
              >
                Try Again
              </Button>
            </div>
          ) : (
            <>
              <Upload className="h-10 w-10 text-slate-400 dark:text-slate-500 mb-2" />
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Drag and drop a file here, or click to select
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Max size: {maxSize}MB
              </p>
            </>
          )}
        </div>
      ) : (
        <div className="border rounded-lg p-4 bg-white dark:bg-slate-800">
          <div className="flex items-center">
            <File className="h-8 w-8 text-slate-400 mr-3" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                {selectedFile.name}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {(selectedFile.size / 1024).toFixed(1)} KB
              </p>
            </div>
            <button
              type="button"
              className="text-slate-400 hover:text-slate-500 dark:hover:text-slate-300"
              onClick={clearFile}
              disabled={disabled || isLoading}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          {isLoading && (
            <div className="mt-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5">
              <div className="bg-primary-600 h-1.5 rounded-full animate-pulse w-full"></div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FileUploader;
