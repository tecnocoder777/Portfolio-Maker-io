import { GoogleGenAI } from "@google/genai";

// Initialize Gemini AI
// NOTE: We rely on process.env.API_KEY as per instructions.
// If not present, the service will throw or handle logically in the UI.
const apiKey = process.env.API_KEY || '';
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const generateBio = async (name: string, title: string, currentBio: string): Promise<string> => {
  if (!ai) throw new Error("API Key missing");

  const model = "gemini-3-flash-preview";
  const prompt = `
    Write a professional yet engaging portfolio biography (max 80 words) for a person named ${name} who is a ${title}.
    Current draft context (if any): "${currentBio}".
    Make it sound confident and approachable. Do not use markdown, just plain text.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });
    return response.text || "";
  } catch (error) {
    console.error("Gemini Bio Error:", error);
    throw error;
  }
};

export const enhanceProjectDescription = async (title: string, description: string): Promise<string> => {
  if (!ai) throw new Error("API Key missing");
  
  const model = "gemini-3-flash-preview";
  const prompt = `
    Refine this project description to be more impactful and result-oriented (max 40 words).
    Project Title: ${title}
    Draft Description: "${description}"
    Return only the refined text.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });
    return response.text || "";
  } catch (error) {
    console.error("Gemini Project Error:", error);
    throw error;
  }
};