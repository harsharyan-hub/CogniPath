import { GoogleGenAI, Type } from "@google/genai";
import { PYQAnalysis, RoutineItem } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const analyzePYQ = async (subject: string, text: string, attachment?: { mimeType: string, data: string }): Promise<PYQAnalysis> => {
  const model = "gemini-2.5-flash";
  
  const parts: any[] = [];
  
  if (attachment) {
    parts.push({
      inlineData: {
        mimeType: attachment.mimeType,
        data: attachment.data
      }
    });
  }
  
  parts.push({
    text: `
    Analyze the following past year questions (provided as text or image) for the subject: ${subject}.
    Identify recurring themes and high-yield topics.
    Predict the most important questions for the upcoming exam based on patterns.
    Provide the answer and a detailed explanation for each predicted question.
    
    Past Questions Text/Context:
    ${text}
    `
  });

  const response = await ai.models.generateContent({
    model,
    contents: { parts },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          topics: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                topic: { type: Type.STRING },
                importance: { type: Type.STRING, enum: ["High", "Medium", "Low"] },
                description: { type: Type.STRING }
              }
            }
          },
          predictedQuestions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING },
                answer: { type: Type.STRING },
                explanation: { type: Type.STRING },
                probabilityScore: { type: Type.NUMBER, description: "A number between 0 and 100" }
              }
            }
          }
        }
      }
    }
  });

  if (!response.text) throw new Error("No response from AI");
  
  const result = JSON.parse(response.text);
  
  return {
    id: crypto.randomUUID(),
    subject,
    topics: result.topics,
    predictedQuestions: result.predictedQuestions,
    timestamp: Date.now()
  };
};

export const generateRoutine = async (preferences: string): Promise<RoutineItem[]> => {
  const model = "gemini-2.5-flash";
  
  const prompt = `
    Create a daily routine based on the following user preferences and goals: "${preferences}".
    The routine should balance academic study, personal time, and health.
    Return a list of specific time slots and activities.
  `;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            time: { type: Type.STRING, description: "e.g., 08:00 AM - 09:00 AM" },
            activity: { type: Type.STRING },
            category: { type: Type.STRING, enum: ["academic", "personal", "health"] },
            completed: { type: Type.BOOLEAN }
          }
        }
      }
    }
  });

  if (!response.text) throw new Error("No response from AI");
  return JSON.parse(response.text) as RoutineItem[];
};

export const getTutorResponse = async (history: {role: string, parts: {text?: string, inlineData?: any}[]}[], message: string, attachment?: { mimeType: string, data: string }) => {
  const chat = ai.chats.create({
    model: "gemini-2.5-flash",
    history: history as any,
    config: {
      systemInstruction: "You are an expert AI Tutor. Your goal is to explain complex topics simply, starting from the basics. Be patient, encouraging, and use examples. If a user asks something unrelated to learning, gently steer them back to academics. You can analyze images or documents if provided.",
    }
  });

  // Construct message content
  const content: any = { parts: [] };
  if (attachment) {
    content.parts.push({
      inlineData: {
        mimeType: attachment.mimeType,
        data: attachment.data
      }
    });
  }
  content.parts.push({ text: message });

  const result = await chat.sendMessage(content);
  return result.text;
};

export const getCounsellorResponse = async (history: {role: string, parts: {text?: string}[]}[], message: string) => {
  const chat = ai.chats.create({
    model: "gemini-2.5-flash", // Using flash for quicker conversational responses
    history: history as any,
    config: {
      systemInstruction: "You are a warm, empathetic, and caring AI Counsellor. Your name is 'Mira'. Listen actively to the user's personal or academic struggles. Validate their feelings. Offer gentle, non-judgmental advice. Prioritize their mental well-being. Speak in a human-like, conversational tone.",
    }
  });

  const result = await chat.sendMessage({ message });
  return result.text;
};