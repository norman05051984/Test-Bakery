import { GoogleGenAI, Type } from "@google/genai";
import { Unit } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

interface AIGeneratedIngredient {
  name: string;
  estimatedQuantity: number;
  unit: string;
}

export const generateRecipeIngredients = async (recipeName: string): Promise<AIGeneratedIngredient[]> => {
  if (!apiKey) {
    console.warn("No API Key provided for Gemini.");
    return [];
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Generate a list of standard ingredients and quantities for a professional bakery recipe: "${recipeName}". 
      Assume a standard batch size (e.g., 12-24 items). 
      Return only common ingredients. 
      Use metric units (g, ml, kg, l) or 'unit' where appropriate.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING, description: "Name of the ingredient (e.g. Flour)" },
              estimatedQuantity: { type: Type.NUMBER, description: "Amount needed" },
              unit: { type: Type.STRING, description: "Unit of measurement (g, ml, unit)" }
            },
            required: ["name", "estimatedQuantity", "unit"]
          }
        }
      }
    });

    if (response.text) {
      const data = JSON.parse(response.text) as AIGeneratedIngredient[];
      return data;
    }
    return [];
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};