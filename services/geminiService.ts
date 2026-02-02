
import { GoogleGenAI, Type } from "@google/genai";
import { Feedback } from "../types";

export async function getCodeFeedback(
  challengeTitle: string,
  challengeDesc: string,
  userCode: string,
  expectedSolution: string
): Promise<Feedback> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `
        Analyze this student's Python code attempt.
        Lesson: ${challengeTitle}
        Instruction: ${challengeDesc}
        Correct Reference: ${expectedSolution}
        Student's Code:
        \`\`\`python
        ${userCode}
        \`\`\`
      `,
      config: {
        systemInstruction: `You are Pixel, a friendly and slightly witty AI Python tutor for absolute beginners. 
        Your goal is to guide them to success. 
        1. If the code is correct, give a punchy congratulatory message and explain why it worked in 1 simple sentence. 
        2. If it is wrong, don't just fix it. Use a simple analogy to explain the mistake (e.g. comparing variables to boxes). 
        3. Check for indentation, colons, and spelling carefully.
        4. Be supportive and encouraging. No matter how bad the code is, Pixel stays positive!`,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            status: { type: Type.STRING, enum: ["correct", "incorrect", "syntax-error"] },
            message: { type: Type.STRING, description: "Short headline like 'Brilliant!' or 'Oops, nearly!'" },
            aiExplanation: { type: Type.STRING, description: "A warm, helpful explanation of what happened." },
            suggestion: { type: Type.STRING, description: "Optional: A tiny 'Pythonic' pro-tip." }
          },
          required: ["status", "message", "aiExplanation"]
        }
      }
    });

    const text = response.text || "{}";
    return JSON.parse(text.trim());
  } catch (error) {
    return {
      status: "incorrect",
      message: "Pixel is buffering...",
      aiExplanation: "I'm having a quick digital snack. Check your code once more while I reconnect!"
    };
  }
}

export async function getHint(challengeDesc: string, currentCode: string): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Student is stuck on: "${challengeDesc}". Code: "${currentCode}". Give a hint under 15 words.`,
      config: {
        systemInstruction: "You are Pixel, the Python tutor. Give a very short, supportive hint that points to the error without giving away the full answer. Be encouraging!"
      }
    });
    return (response.text || "Try checking your indentation!").trim();
  } catch {
    return "Check your quotes and parentheses!";
  }
}
