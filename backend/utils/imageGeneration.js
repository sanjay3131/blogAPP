import { GoogleGenAI, Modality } from "@google/genai";
import * as fs from "node:fs";
import cloudinary from "./cloudinaryConfig.js";
import path from "path";
import { fileURLToPath } from "url";

// ES Module __dirname fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
        const filename = `gemini-image-${Date.now()}.png`;

        // Ensure 'generated' folder exists
        const folderPath = path.join(__dirname, "../generated");
        if (!fs.existsSync(folderPath)) {
          fs.mkdirSync(folderPath);
        }

        const localPath = path.join(folderPath, filename);

        // Save image locally
        fs.writeFileSync(localPath, buffer);

        // Upload to Cloudinary
        const uploadResult = await cloudinary.uploader.upload(localPath, {
          folder: "ai-generated-images",
        });

        console.log(uploadResult);

        // Clean up local file
        fs.unlinkSync(localPath);

        // Save Cloudinary URL to result
        result.image = uploadResult.secure_url;
      }
    }
    const user = req.user;
    user.aiImageGenerated.push(result.image);
    await user.save();

    res.json(result);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Image generation failed", error: error.message });
  }
};
