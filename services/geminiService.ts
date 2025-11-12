import { GoogleGenAI } from "@google/genai";
import { SYSTEM_INSTRUCTION, TEMPLATE_OPTIONS } from '../constants';
import { TemplateType, type FormData } from '../types';

const getPromptForTemplate = (formData: FormData): string => {
  const { userInput, clientName, projectURL, selectedTemplate, brandTones, brandVoices, caseStudyExample } = formData;
  const template = TEMPLATE_OPTIONS.find(t => t.id === selectedTemplate);

  if (!template) {
    throw new Error('Invalid template selected');
  }

  let prompt = `Generate a "${template.label}" based on the following project details:\n---\n${userInput}\n---\n\n`;
  prompt += `Client Name: ${clientName || 'Not provided'}\n`;
  
  if (brandVoices.length > 0) {
    prompt += `\nIn addition to the core brand voice, please emphasize these specific voice characteristics:\n- ${brandVoices.join('\n- ')}\n`;
  }
  
  if (brandTones.length > 0) {
    prompt += `\nIn addition to the core brand tones, please emphasize these specific tones:\n- ${brandTones.join('\n- ')}\n`;
  }

  if (caseStudyExample.trim()) {
    prompt += `\nFor style guidance, refer to this example of a previous case study. Emulate its style, tone, and structure while adhering to all other brand guidelines provided. This is a style guide, not content to be rewritten.\n---\n${caseStudyExample}\n---\n`;
  }

  switch (selectedTemplate) {
    case TemplateType.CaseStudy:
      prompt += `
Follow these specific instructions for the Case Study:
- Word count: Approximately ${template.wordCount} words.
- Structure: Choose ONE of the following structures that best fits the project details.
  - Structure A: 1. It started with, 2. Before, 3. Challenge, 4. Solution, 5. Result
  - Structure B: 1. Clear and concise introduction, 2. Context and goals, 3. What we did / how we did, 4. Impact
- Entry Point: Start the case study with a compelling entry point. Consider one of these styles: Tiny moment, Tension first, Mid-action, Client quote/insight, or an Unexpected analogy.
- Style: The writing style can be Punchy, a Reflection, Technical, or Personal & Authentic. Choose what fits best.
- Credits: Include a section for "Credits and contributors" at the end, mentioning roles like Project Management, Design, and Development, and crediting partners. List names directly without brackets (e.g., "Project Management: John Smith" not "Project Management: [Name]").`;
      break;

    case TemplateType.InstagramPost:
      prompt += `
Follow these specific instructions for the Instagram Post:
- Word count: Approximately ${template.wordCount} words.
- Structure: Create a bolded [title] and tag the client, followed by 2-3 short sentences.
- Client Tag: Make sure to tag the client: "${clientName}".`;
      break;

    case TemplateType.InstagramStory:
      prompt += `
Follow these specific instructions for the Instagram Story:
- Word count: Approximately ${template.wordCount} words.
- Structure: Create a bolded [title] and tag the client.
- Client Tag: Make sure to tag the client: "${clientName}".`;
      break;
      
    case TemplateType.LinkedInPost:
      prompt += `
Follow these specific instructions for the LinkedIn Post:
- Word count: Approximately ${template.wordCount} words.
- Structure: Create a bolded [title] and tag the client, followed by 2-3 short sentences, and then the web URL.
- Client Tag: Make sure to tag the client: "${clientName}".
- Web URL: Include this URL at the end: ${projectURL || 'Not provided'}`;
      break;

    case TemplateType.GoogleSlides:
      prompt += `
Follow these specific instructions for the Google Slides Snippet:
- Word count: Approximately ${template.wordCount} words.
- Goal: Create a short, punchy description for a presentation slide about this project.`;
      break;
      
    default:
      // Should not be reached
      break;
  }

  return prompt;
};


export const generateContent = async (formData: FormData): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set.");
  }
  
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = getPromptForTemplate(formData);

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    return response.text;
  } catch (error) {
    console.error("Error generating content from Gemini:", error);
    throw new Error("Failed to generate content. Please check the console for details.");
  }
};
