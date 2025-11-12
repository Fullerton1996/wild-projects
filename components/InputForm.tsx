import React, { useState, useEffect } from 'react';
import { INITIAL_BRAND_TONES, TEMPLATE_OPTIONS } from '../constants';
import { TemplateType, type FormData } from '../types';
import { LoaderIcon } from './icons/LoaderIcon';
import { XMarkIcon } from './icons/XMarkIcon';

interface InputFormProps {
  onGenerate: (formData: FormData) => void;
  isLoading: boolean;
}

export const InputForm: React.FC<InputFormProps> = ({ onGenerate, isLoading }) => {
  const [userInput, setUserInput] = useState<string>('');
  const [clientName, setClientName] = useState<string>('');
  const [projectURL, setProjectURL] = useState<string>('');
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>(TemplateType.CaseStudy);
  const [brandTones, setBrandTones] = useState<string[]>(INITIAL_BRAND_TONES);
  const [newTone, setNewTone] = useState<string>('');
  const [caseStudyExample, setCaseStudyExample] = useState<string>('');


  useEffect(() => {
    if (selectedTemplate !== TemplateType.LinkedInPost) {
      setProjectURL('');
    }
  }, [selectedTemplate]);

  const handleAddTone = () => {
    if (newTone.trim() && !brandTones.includes(newTone.trim())) {
      setBrandTones([...brandTones, newTone.trim()]);
      setNewTone('');
    }
  };

  const handleRemoveTone = (indexToRemove: number) => {
    setBrandTones(brandTones.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userInput.trim()) {
      onGenerate({ userInput, clientName, projectURL, selectedTemplate, brandTones, caseStudyExample });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-sm border border-slate-200">
      <div>
        <label htmlFor="project-details" className="block text-sm font-medium text-slate-700">
          Project Details
        </label>
        <textarea
          id="project-details"
          rows={8}
          className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm placeholder:text-slate-400 px-3 py-2"
          placeholder="Enter key points about the project, client quotes, challenges, and solutions..."
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          required
        />
      </div>

      <div>
        <label htmlFor="client-name" className="block text-sm font-medium text-slate-700">
          Client Name
        </label>
        <input
          type="text"
          id="client-name"
          className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm placeholder:text-slate-400 px-3 py-2"
          placeholder="e.g., Nike"
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
        />
      </div>

      {selectedTemplate === TemplateType.LinkedInPost && (
        <div>
          <label htmlFor="project-url" className="block text-sm font-medium text-slate-700">
            Project URL
          </label>
          <input
            type="url"
            id="project-url"
            className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm placeholder:text-slate-400 px-3 py-2"
            placeholder="https://example.com/project"
            value={projectURL}
            onChange={(e) => setProjectURL(e.target.value)}
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-slate-700">Brand Tone Tags</label>
        <div className="flex flex-wrap gap-2 mt-2">
          {brandTones.map((tone, index) => (
            <div key={index} className="flex items-center bg-indigo-100 text-indigo-800 text-xs font-medium pl-2.5 pr-1 py-1 rounded-full">
              {tone}
              <button type="button" onClick={() => handleRemoveTone(index)} className="ml-1.5 flex-shrink-0 bg-indigo-200 hover:bg-indigo-300 rounded-full p-0.5" aria-label={`Remove ${tone}`}>
                <XMarkIcon className="h-3 w-3 text-indigo-800" />
              </button>
            </div>
          ))}
        </div>
        <div className="mt-2 flex">
          <input
            type="text"
            value={newTone}
            onChange={(e) => setNewTone(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTone(); } }}
            placeholder="Add a custom tone..."
            className="flex-grow block w-full rounded-l-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm placeholder:text-slate-400 px-3 py-2"
          />
          <button type="button" onClick={handleAddTone} className="-ml-px relative inline-flex items-center space-x-2 px-4 py-2 border border-slate-300 text-sm font-medium rounded-r-md text-slate-700 bg-slate-50 hover:bg-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500">
            Add
          </button>
        </div>
      </div>

      <div>
        <label htmlFor="case-study-example" className="block text-sm font-medium text-slate-700">
          Previous Case Study (Optional)
        </label>
        <p className="text-xs text-slate-500 mb-1">Paste a previous case study to help match the writing style.</p>
        <textarea
          id="case-study-example"
          rows={6}
          className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm placeholder:text-slate-400 px-3 py-2"
          placeholder="Paste content here to guide the AI's writing style..."
          value={caseStudyExample}
          onChange={(e) => setCaseStudyExample(e.target.value)}
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Select Template
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {TEMPLATE_OPTIONS.map((option) => (
            <label
              key={option.id}
              className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                selectedTemplate === option.id
                  ? 'bg-indigo-50 border-indigo-500 ring-2 ring-indigo-500'
                  : 'bg-white border-slate-300 hover:bg-slate-50'
              }`}
            >
              <input
                type="radio"
                name="template"
                value={option.id}
                checked={selectedTemplate === option.id}
                onChange={() => setSelectedTemplate(option.id)}
                className="h-4 w-4 text-indigo-600 border-slate-300 focus:ring-indigo-500"
              />
              <span className="ml-3 text-sm font-medium text-slate-800">{option.label}</span>
              <span className="ml-auto text-xs text-slate-500">{option.wordCount} words</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={isLoading || !userInput.trim()}
          className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <>
              <LoaderIcon className="w-5 h-5 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            'Generate Content'
          )}
        </button>
      </div>
    </form>
  );
};
