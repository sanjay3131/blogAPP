import { GoogleGenAI, Modality } from "@google/genai";
import * as fs from "node:fs";

export const imageGeneration = async (req, res) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.AI_KEY });
    const contents = req.body.contents;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-preview-image-generation",
      contents: contents,
      config: {
        responseModalities: [Modality.TEXT, Modality.IMAGE],
      },
    });
    if (!response || !response.candidates || response.candidates.length === 0) {
      return res.status(500).json({ message: "No response from AI" });
    }

    let result = {};
    for (const part of response.candidates[0].content.parts) {
      if (part.text) {
        result.text = part.text;
      } else if (part.inlineData) {
        const imageData = part.inlineData.data;

        const buffer = Buffer.from(imageData, "base64");
        const filename = `gemini-image.png`;
        fs.writeFileSync(filename, buffer);
        result.image = `/generated/${filename}`; // frontend can access
      }
    }

    res.json(result);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Image generation failed", error: error.message });
  }
};
