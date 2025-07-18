import { GoogleGenerativeAI } from "@google/generative-ai";

const ai = new GoogleGenerativeAI(process.env.AI_KEY);

export const AIcontent = async (req, res) => {
  const { prompt } = req.body;

  try {
    const model = ai.getGenerativeModel({ model: "gemini-2.5-flash" });

    const fullPrompt = `You are a creative and informative blog writer.

Write a complete blog article based on the following prompt provided by the user.

The output must be written directly in raw HTML (not Markdown or escaped text). Do NOT use backslashes (\\n, \\") or Markdown (##, **).

Structure the blog using HTML elements such as:
- Headings (<h1>, <h2>, <h3>)
- Paragraphs (<p>)
- Lists (<ul>, <ol>, <li>)
- Emphasis (<strong>, <em>)
- Line breaks where needed

Do NOT include <html>, <head>, or <body> tags — return only the blog content section.

Make the tone friendly, engaging, and human. Do not include any disclaimers like "as an AI model."

User Prompt: ${prompt} `;

    const result = await model.generateContent(fullPrompt);
    const content = result.response.text();

    res.status(200).json({ content });
  } catch (error) {
    console.error("Gemini error:", error);
    res.status(500).json({ error: "Failed to generate blog content" });
  }
};
