import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle, Copy, Download } from 'lucide-react';
import { copyToClipboard, downloadFile } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

interface CodeBlockProps {
  content: string;
  title?: string;
  language?: string;
  showCopy?: boolean;
  showDownload?: boolean;
  fileName?: string;
  contentType?: string;
  readOnly?: boolean;
  onChange?: (content: string) => void;
  className?: string;
  rows?: number;
  isLoading?: boolean;
}

const CodeBlock = ({
  content,
  title,
  language = 'text',
  showCopy = true,
  showDownload = true,
  fileName = 'download.txt',
  contentType = 'text/plain',
  readOnly = true,
  onChange,
  className,
  rows = 6,
  isLoading = false
}: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = async () => {
    const success = await copyToClipboard(content);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };
  
  const handleDownload = () => {
    downloadFile(content, fileName, contentType);
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };
  
  return (
    <div className={cn("relative", className)}>
      {title && (
        <div className="flex items-center justify-between mb-2">
          {isLoading ? (
            <Skeleton className="h-5 w-32" />
          ) : (
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {title}
            </span>
          )}
          <div className="flex space-x-2">
            {showCopy && (
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={handleCopy}
                disabled={!content}
                className="h-8 px-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              >
                {copied ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                    <span className="text-xs">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-1" />
                    <span className="text-xs">Copy</span>
                  </>
                )}
              </Button>
            )}
            
            {showDownload && content && (
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={handleDownload}
                className="h-8 px-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              >
                <Download className="h-4 w-4 mr-1" />
                <span className="text-xs">Download</span>
              </Button>
            )}
          </div>
        </div>
      )}
      
      {isLoading ? (
        <div className="p-4 space-y-4 bg-slate-50 dark:bg-slate-800 min-h-[150px] rounded border border-slate-200 dark:border-slate-700">
          <div className="flex items-center space-x-2 mb-2">
            <div className="h-3 w-3 rounded-full bg-primary animate-pulse"></div>
            <p className="text-xs text-slate-500">Loading data...</p>
          </div>
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-11/12" />
          <Skeleton className="h-5 w-4/5" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-3/4" />
        </div>
      ) : (
        <Textarea
          value={content}
          onChange={handleChange}
          rows={rows}
          readOnly={readOnly}
          className={cn(
            "font-mono text-sm block w-full rounded-md border",
            readOnly 
              ? "bg-slate-50 dark:bg-slate-800" 
              : "bg-white dark:bg-slate-700",
            "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          )}
          placeholder={readOnly ? "Output will appear here" : "Enter text..."}
        />
      )}
    </div>
  );
};

export default CodeBlock;
