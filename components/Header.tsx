
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
          wild<span className="text-indigo-500">.</span> Brand Content Generator
        </h1>
        <p className="text-slate-500 mt-1">AI-powered copy for your creative projects</p>
      </div>
    </header>
  );
};
