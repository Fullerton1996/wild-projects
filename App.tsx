import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { InputForm } from './components/InputForm';
import { OutputDisplay } from './components/OutputDisplay';
import { generateContent } from './services/geminiService';
import { SparklesIcon } from './components/icons/SparklesIcon';
import type { FormData } from './types';

const App: React.FC = () => {
  const [output, setOutput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async (formData: FormData) => {
    setIsLoading(true);
    setError(null);
    setOutput('');
    try {
      const result = await generateContent(formData);
      setOutput(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An unknown error occurred.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-12">
          <InputForm onGenerate={handleGenerate} isLoading={isLoading} />
          
          <div className="mt-8 lg:mt-0">
            <h2 className="text-xl font-semibold text-slate-700 mb-4 flex items-center">
              <SparklesIcon className="w-6 h-6 mr-2 text-indigo-500" />
              Generated Content
            </h2>
            <OutputDisplay output={output} isLoading={isLoading} error={error} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
