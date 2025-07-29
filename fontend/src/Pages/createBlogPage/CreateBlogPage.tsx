import { Button } from "@/components/ui/button";
import { aiContent, postBlog } from "@/utils/ApiFunction";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Editor } from "@tinymce/tinymce-react";
import type { Editor as TinyMCEEditor } from "tinymce";
import {
  useGenerateAiImage,
  useGenerateAiImagePrompt,
} from "@/lib/utilFunction";

const CreateBlogPage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [blogTags, setBlogTags] = useState<string[]>([]);
  const [selectedTag, setSelectedTag] = useState("");
  const [blogImage, setBlogImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [disable, setDisable] = useState(false);
  const editorRef = useRef<TinyMCEEditor | null>(null);
  const [aiImagePromt, setAiImagePrompt] = useState("");
  const [aiImage, setAiImage] = useState("");
  const handelForm = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      setDisable(true);
      if (blogTags.length <= 0) {
        return alert("please selete some tags");
      }

      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      blogTags.forEach((tag) => {
        formData.append("tags", tag);
      });

      if (blogImage) {
        formData.append("image", blogImage);
      }
      if (aiImage) {
        formData.append("aiImage", aiImage);
      }

      const result = await postBlog(formData);
      if (result.message) {
        setDisable(false);
        toast.success(result.message);
      } else {
        toast.error("blog upload failed");
      }

      // Reset
      setTitle("");
      setContent("");
      setBlogTags([]);
      setSelectedTag("");
      setBlogImage(null);
      setAiImage("");
      setAiImagePrompt("");
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.log(error);
    } finally {
      setDisable(false);
    }
  };

  const handelImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setBlogImage(e.target.files[0]);
      setAiImage("");
    }
  };
  const [isAiGeneration, setAiGeneration] = useState(false);
  const generateContent = async () => {
    try {
      setAiGeneration(true);
      const AIresult = await aiContent(title);
      console.log(AIresult, title);
      setContent(AIresult?.content);
    } catch (error) {
      console.log(error);
    } finally {
      setAiGeneration(false);
    }
  };
  const tags: string[] = [
    "programing",
    "Environment",
    "Science",
    "Entertainment",
    "Politics",
    "Finance",
    "Economics",
    "Others",
  ];

  const handleTagSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value;
    if (selected && !blogTags.includes(selected)) {
      setBlogTags((prev) => [...prev, selected]);
    }
    setSelectedTag(""); // Reset select
  };

  const removeTag = (tag: string) => {
    setBlogTags(blogTags.filter((t) => t !== tag));
  };

  // ai image promt generate
  const { mutate: generateAIContent, isPending } = useGenerateAiImagePrompt();
  const generateImageContent = async () => {
    if (!content) return alert("write or generate some blog content");

    if (content)
      await generateAIContent(content, {
        onSuccess: (data) => {
          setAiImagePrompt(data.content); // you get `data` here correctly
        },
      });
  };
  // generate ai image
  const { mutate: generateImage, isPending: generatingImage } =
    useGenerateAiImage();

  const generateAiImage = async () => {
    if (!aiImagePromt) return alert("write or generate prompt to create image");
    await generateImage(aiImagePromt, {
      onSuccess: (data) => {
        setAiImage(data.image);
        setBlogImage(null);
      },
    });
  };
  return (
    <div className="flex gap-3 flex-col md:flex-row  justify-center items-cente md:justify-items-start relative">
      {/* left */}
      <div className=" p-8 md:px-24 md:w-1/2 sticky top-0">
        <h1 className="text-xl md:text-3xl uppercase font-semibold text-gray-500">
          Write your <span className="text-black font-extrabold">Blog</span>
        </h1>
        <form
          onSubmit={handelForm}
          className="w-full mt-3 flex flex-col gap-5 justify-center items-center"
        >
          {/* Title */}
          <div className="flex flex-col w-full">
            <label
              htmlFor="title"
              className="text-xl md:text-2xl font-semibold px-2 cursor-pointer w-fit hover:scale-105 transition-all"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What is the title?"
              className="border-2 border-gray-400 rounded-2xl focus:shadow-md focus:shadow-gray-400 p-4 outline-none transition-all w-full"
              maxLength={100}
            />
          </div>

          {/* Tags */}
          <div className="flex flex-col w-full">
            <label
              htmlFor="tags"
              className="text-xl md:text-2xl font-semibold px- cursor-pointer w-fit hover:scale-105 transition-all "
            >
              Select Tag
            </label>
            <select
              id="tags"
              value={selectedTag}
              onChange={handleTagSelect}
              className="border-2 border-gray-400 rounded-xl p-2 outline-none w-1/2 focus:shadow-gray-400"
            >
              <option value="" className="rounded-2xl">
                Select a tag
              </option>
              {tags.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>

            {/* Selected Tags */}
            {blogTags.length > 0 && (
              <div className="flex flex-wrap mt-2 gap-2">
                {blogTags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-gray-300 px-3 py-1 rounded-full text-sm cursor-pointer"
                    onClick={() => removeTag(tag)}
                  >
                    {tag} ✖️
                  </span>
                ))}
              </div>
            )}
          </div>

          <div>
            {" "}
            <Editor
              apiKey="u3w7dg5t76wp9ow90eif6e9ebdr5xg9gli56wn63aehtrbn7"
              onInit={(_evt: unknown, editor: TinyMCEEditor) =>
                (editorRef.current = editor)
              }
              onEditorChange={(newContent: string) => setContent(newContent)}
              value={content}
              init={{
                height: 500,
                menubar: false,
                plugins: [
                  "advlist",
                  "autolink",
                  "lists",
                  "link",
                  "image",
                  "charmap",
                  "preview",
                  "anchor",
                  "searchreplace",
                  "visualblocks",
                  "code",
                  "fullscreen",
                  "insertdatetime",
                  "media",
                  "table",
                  "code",
                  "help",
                  "wordcount",
                ],
                toolbar:
                  "undo redo | blocks | " +
                  "bold italic forecolor | alignleft aligncenter " +
                  "alignright alignjustify | bullist numlist outdent indent | " +
                  "removeformat | help",
                content_style: `body {
      font-family: 'Inter', sans-serif;
      font-size: 16px;
      color: #1f2937;
      line-height: 1.6;
      padding: 1rem;
    }
    h1 { font-size: 2rem; font-weight: bold; color: #111827; }
    h2 { font-size: 1.5rem; font-weight: bold; color: #1f2937; }
    p { margin-bottom: 0.75rem; }
    ul, ol { padding-left: 1.5rem; }
    blockquote {
      border-left: 4px solid #9ca3af;
      padding-left: 1rem;
      color: #6b7280;
      font-style: italic;
    }
    img { max-width: 100%; height: auto; border-radius: 0.5rem; }
    table {
      width: 100%;
      border-collapse: collapse;
    }
    table, th, td {
      border: 1px solid #d1d5db;
      padding: 0.5rem;
    }
  `,
              }}
            />
            {/* <button onClick={log}>Log editor content</button> */}
          </div>

          {/* Image Upload */}

          <div className="flex flex-col justify-center items-center gap-4 w-full">
            {/* ai image generation  */}
            <div className="w-full ">
              <textarea
                className="bg-Primary-text-color/10 w-full p-5 rounded-2xl"
                placeholder="content for image generation"
                onChange={(e) => setAiImagePrompt(e.target.value)}
                value={aiImagePromt}
              />
              <div className="flex  flex-col gap-2">
                <Button
                  onClick={generateImageContent}
                  disabled={isPending}
                  type="button"
                >
                  Generate Content By AI
                </Button>
                <Button
                  type="button"
                  disabled={generatingImage}
                  onClick={generateAiImage}
                >
                  Generate Image
                </Button>
              </div>
            </div>
            {/* choose from device */}
            <div className="flex gap-3 justify-center items-center">
              <input
                type="file"
                accept="image/*"
                onChange={handelImage}
                placeholder="upload"
                ref={fileInputRef}
                className="bg-Primary-button-color hover:bg-gray-500/50 p-4 rounded-2xl text-center"
              />

              {/* Delete Image */}
              {previewImage && (
                <Button
                  type="button"
                  onClick={() => {
                    setBlogImage(null);
                    setPreviewImage("");
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                >
                  Delete Image
                </Button>
              )}
            </div>
            {aiImage && (
              <img src={aiImage} alt="ai image" className="size-fit" />
            )}
            {blogImage && !aiImage && (
              <img
                src={URL.createObjectURL(blogImage)}
                alt="uploaded image"
                className="w-full max-h-96 object-contain"
              />
            )}
          </div>

          <Button
            disabled={disable}
            className={`${
              disable ? "cursor-not-allowed opacity-50" : "cursor-pointer"
            }`}
          >
            Submit
          </Button>
        </form>
      </div>

      {/* right ai content generation */}
      <div
        className="md:w-1/2 bg-Green-color/35 rounded-2xl py-7 px-4 h-fit flex flex-col gap-4 justify-start 
        sticky bottom-0 left-0
      "
      >
        <h1 className="text-xl md:text-3xl uppercase font-semibold text-gray-500">
          Create your AI <span className="text-black font-extrabold">Blog</span>
        </h1>
        {/* title */}
        <div className="flex flex-col w-full">
          <label
            htmlFor="title"
            className="text-xl md:text-2xl font-semibold px-2 cursor-pointer w-fit hover:scale-105 transition-all"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What is the title?"
            className="border-2 border-gray-400 rounded-2xl focus:shadow-md focus:shadow-gray-400 p-4 outline-none transition-all w-full"
            maxLength={100}
          />
        </div>
        {/* generate content */}
        <Button
          className="w-fit "
          disabled={isAiGeneration}
          onClick={generateContent}
        >
          Generate Content
        </Button>
        {isAiGeneration && <div> loading....</div>}

        <div className="reset-tw bg-yellow-300 prose prose-lg">
          <div dangerouslySetInnerHTML={{ __html: content }} />
        </div>
      </div>
    </div>
  );
};

export default CreateBlogPage;
