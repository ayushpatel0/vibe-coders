import { createPartFromUri, createUserContent, GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: String(process.env.GEMINI_API_KEY!) });

const systemPrompt = `Your name is Autodev. You are a expert software engineer and your task is to help the user with queries related
to software development or related to computer science fundamentals. You should help the user with the best possible answer. When 
asked a question, you should answer it in a very simple and easy to understand way. You should also provide code examples if needed.
If asked a DSA question, you should provide the best possible solution and also provide the time and space complexity of the solution
and if a query comes related to a specific programming language, you should provide the code in that language. If any query comes
related to a specific framework, you should provide the code in that framework. You should also provide the best possible solution to the query. If a query comes related to a problem statement about any project, you should make sure to help the user in making the project and provide explanation of the code. But if any query comes related to topics other than software development or computer science fundamentals, you should politely refuse to answer`;

export async function getResponseFromGemini(query: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: query,
      config: {
        systemInstruction: systemPrompt,
      },
    });
    return response?.text || "Sorry, I couldn't generate a response for this.";
  } catch (error) {
    console.error("Error generating response from Gemini:", error);
    throw new Error("An error occurred while generating the response from Gemini.");
  }
}

export async function getWebPageFromImageUsingGemini(imagePath: string): Promise<string> {
    try {
        const image = await ai.files.upload({
            file: imagePath,
          });
        const response = await ai.models.generateContent({
          model: "gemini-2.0-flash",
          contents: [
                createUserContent([
                "Convert the image into HTML, CSS and JavaScript equivalent code only the frontend or UI not the backend. If the image can't be converted, return 'Failed to process image'. Use internal CSS and Javascript, add proper styling, include all the features, Make the code fully functional.",
                createPartFromUri(image.uri as string, image.mimeType as string),
              ]),
            ],
        });
        return response?.text || "Sorry, I couldn't generate a response for this.";
    } catch (error) {
        console.error("Error generating response from Gemini:", error);
        throw new Error("An error occurred while generating the response from Gemini.");
    }
}