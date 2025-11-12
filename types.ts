export enum TemplateType {
  CaseStudy = 'CaseStudy',
  InstagramPost = 'InstagramPost',
  InstagramStory = 'InstagramStory',
  LinkedInPost = 'LinkedInPost',
  GoogleSlides = 'GoogleSlides',
}

export interface TemplateOption {
  id: TemplateType;
  label: string;
  wordCount: string;
  description: string;
}

export interface FormData {
  userInput: string;
  clientName: string;
  projectURL: string;
  selectedTemplate: TemplateType;
  brandTones: string[];
  brandVoices: string[];
  caseStudyExample: string;
}
