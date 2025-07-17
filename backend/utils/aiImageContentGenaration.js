import { GoogleGenerativeAI } from "@google/generative-ai";

const ai = new GoogleGenerativeAI(process.env.AI_KEY);

export const AIImagePromtGeneration = async (req, res) => {
  const { prompt } = req.body;

  try {
    const model = ai.getGenerativeModel({ model: "gemini-2.5-flash" });

    const fullPrompt = `
    Read the blog content below and generate a short, vivid scene description suitable for an AI image generation model. 
    The description should visually represent the main idea, theme, or emotion of the blog.
    blog content: ${prompt} `;

    const result = await model.generateContent(fullPrompt);
    const content = result.response.text();

    res.status(200).json({ content });
  } catch (error) {
    console.error("Gemini error:", error);
    res.status(500).json({ error: "Failed to generate blog content" });
  }
};
