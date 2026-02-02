
import { GoogleGenAI, Type } from "@google/genai";
import { Feedback } from "../types";

// Always initialize GoogleGenAI inside the function where it is used to ensure the most up-to-date API key is used.
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
        Analyze this Python code for a student learning the basics.
        Mission: ${challengeTitle}
        Goal: ${challengeDesc}
        Reference Solution: ${expectedSolution}
        Student's Attempt:
        \`\`\`python
        ${userCode}
        \`\`\`
      `,
      config: {
        systemInstruction: "You are a patient and friendly Python teacher for absolute beginners. Check for correctness, but focus on explaining the 'why'. If there is an error, explain it using simple analogies. Keep feedback encouraging and avoid overly complex technical jargon. Ensure the code follows Python 3.12+ standards like f-strings.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            status: { type: Type.STRING, description: "correct, incorrect, or syntax-error" },
            message: { type: Type.STRING, description: "A warm, encouraging summary" },
            aiExplanation: { type: Type.STRING, description: "A simple, beginner-friendly explanation of the logic used" },
            suggestion: { type: Type.STRING, description: "A small hint or a 'Pythonic' tip for improvement" }
          },
          required: ["status", "message", "aiExplanation"]
        }
      }
    });

    // Directly access the .text property of the GenerateContentResponse object.
    const text = response.text || "{}";
    return JSON.parse(text.trim());
  } catch (error) {
    return {
      status: "incorrect",
      message: "The AI Mentor is taking a quick break!",
      aiExplanation: "Don't worry, even developers run into connection issues. Try checking your logic one more time or click the Hint button!"
    };
  }
}

// Always initialize GoogleGenAI inside the function where it is used.
export async function getHint(challengeDesc: string, currentCode: string): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `The student is stuck on: "${challengeDesc}". 
    Their code: \`\`\`python\n${currentCode}\n\`\`\`. 
    Give a gentle, helpful hint. Do not give the answer. Use a supportive tone.`,
    config: {
      systemInstruction: "You are a helpful Python tutor. Your goal is to guide the student to find the answer themselves. Keep hints very short (under 20 words)."
    }
  });
  // Directly access the .text property of the GenerateContentResponse object.
  return (response.text || "").trim();
}
