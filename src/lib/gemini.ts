import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const geminiModel = "gemini-3-flash-preview";
export const geminiProModel = "gemini-3.1-pro-preview";

export async function generateChatResponse(prompt: string, history: any[] = []) {
  try {
    const response = await ai.models.generateContent({
      model: geminiModel,
      contents: [
        ...history,
        { role: "user", parts: [{ text: prompt }] }
      ],
      config: {
        systemInstruction: "You are the AI 3D Nexus Assistant. You are helpful, futuristic, and concise. You assist users with the 16 modules of the platform.",
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "I encountered an error while processing your request.";
  }
}

export async function generateThinkingResponse(prompt: string) {
  try {
    const response = await ai.models.generateContent({
      model: geminiProModel,
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        thinkingConfig: { includeThoughts: true }
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Thinking Error:", error);
    return "Error generating thinking response.";
  }
}
