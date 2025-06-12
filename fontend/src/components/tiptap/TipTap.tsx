import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Heading from "@tiptap/extension-heading";
import axios from "axios";

const TiptapEditor = () => {
  const editor = useEditor({
    extensions: [StarterKit, Heading.configure({ levels: [1, 2, 3] }), Image],
    content: "<p>Start writing...</p>",
  });

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "blog app"); // replace with your Cloudinary preset

    try {
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/dlogkhr0r/image/upload",
        formData
      );
      const imageUrl = res.data.secure_url;

      editor?.chain().focus().setImage({ src: imageUrl }).run();
    } catch (error) {
      console.error("Image upload failed", error);
    }
  };

  if (!editor) return null;

  return (
    <div className="p-4 max-w-full overflow-x-hidden flex  gap-3 ">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 mb-4 relative top-0 flex-col w-[10%]">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className="px-2 py-1 border rounded"
        >
          Bold
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className="px-2 py-1 border rounded"
        >
          Italic
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className="px-2 py-1 border rounded"
        >
          H1
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className="px-2 py-1 border rounded"
        >
          H2
        </button>
        <label className="px-2 py-1 border rounded cursor-pointer">
          Upload Image
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </label>
      </div>

      {/* Editor */}
      <div className="border rounded p-2 min-h-[300px] scroll-my-0">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default TiptapEditor;
