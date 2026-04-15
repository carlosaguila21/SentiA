import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface AnalysisResult {
  sentiment: string;
  urgency: "Baja" | "Media" | "Alta" | "Crítica";
  distortions: string[];
  summary: string;
  redFlag: boolean;
  suggestedPrompt: string;
}

export async function analyzeJournalEntry(text: string): Promise<AnalysisResult> {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not set");
  }

  const prompt = `
    Analiza la siguiente entrada de diario de un estudiante universitario desde una perspectiva biopsicosocial.
    
    Texto: "${text}"
    
    Responde estrictamente en formato JSON con la siguiente estructura:
    {
      "sentiment": "string (Positivo, Neutro, Negativo)",
      "urgency": "string (Baja, Media, Alta, Crítica)",
      "distortions": ["lista de distorsiones cognitivas detectadas"],
      "summary": "resumen clínico breve (máx 2 frases)",
      "redFlag": boolean (true si hay riesgo de autolesión o daño a terceros),
      "suggestedPrompt": "una pregunta empática para el siguiente paso del diario"
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
      },
    });

    const result = JSON.parse(response.text || "{}");
    return result as AnalysisResult;
  } catch (error) {
    console.error("Error analyzing journal entry:", error);
    throw error;
  }
}
