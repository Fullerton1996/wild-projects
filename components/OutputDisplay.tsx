
import React, { useState, useEffect } from 'react';
import { ClipboardIcon } from './icons/ClipboardIcon';
import { CheckIcon } from './icons/CheckIcon';

interface OutputDisplayProps {
  output: string;
  isLoading: boolean;
  error: string | null;
}

export const OutputDisplay: React.FC<OutputDisplayProps> = ({ output, isLoading, error }) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  const handleCopy = () => {
    if (output) {
      navigator.clipboard.writeText(output);
      setCopied(true);
    }
  };

  const formattedOutput = output.split('\n').map((line, index) => {
    // Basic markdown for bolding text between asterisks
    const parts = line.split(/(\*.*?\*)/g);
    return (
      <span key={index}>
        {parts.map((part, i) =>
          part.startsWith('*') && part.endsWith('*') ? (
            <strong key={i}>{part.slice(1, -1)}</strong>
          ) : (
            part
          )
        )}
        <br />
      </span>
    );
  });
  
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-full">
          <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-500 rounded-full animate-spin"></div>
          <p className="mt-4 text-slate-500">Generating on-brand content...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <p className="text-red-500 font-medium">Error</p>
          <p className="text-slate-500 mt-2">{error}</p>
        </div>
      );
    }
    
    if (output) {
        return (
          <>
            <button
              onClick={handleCopy}
              className="absolute top-3 right-3 p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
              aria-label="Copy to clipboard"
            >
              {copied ? (
                <CheckIcon className="w-5 h-5 text-green-600" />
              ) : (
                <ClipboardIcon className="w-5 h-5" />
              )}
            </button>
            <div className="prose prose-sm max-w-none text-slate-800 whitespace-pre-wrap">
              {formattedOutput}
            </div>
          </>
        );
    }
    
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
        </div>
        <p className="mt-4 text-slate-500 font-medium">Your generated content will appear here.</p>
        <p className="text-sm text-slate-400">Fill in the form and click "Generate".</p>
      </div>
    );
  };
  
  return (
    <div className="relative bg-white p-6 rounded-lg shadow-sm border border-slate-200 min-h-[400px] flex">
      <div className="w-full">
        {renderContent()}
      </div>
    </div>
  );
};
