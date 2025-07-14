import { editBlogById, getSingleblog } from "@/utils/ApiFunction";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "./ui/button";

import { Editor } from "@tinymce/tinymce-react";
import type { Editor as TinyMCEEditor } from "tinymce";
import { useRef, useState, useEffect } from "react";
import { toast } from "sonner";

const UpdateBlog = () => {
  const navigate = useNavigate();
  const params = useParams();
  const blogId = params.id as string;

  const { data, isLoading, error } = useQuery({
    queryKey: ["blogs", blogId],
    queryFn: () => getSingleblog(blogId),
  });
  console.log(data);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [blogTags, setBlogTags] = useState<string[]>([]);
  const [selectedTag, setSelectedTag] = useState("");
  const [blogImage, setBlogImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState("");
  const [isFormReady, setIsFormReady] = useState(false);
  const [disable, setDisable] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<TinyMCEEditor | null>(null);

  // Set state once data is fetched
  useEffect(() => {
    if (data) {
      setTitle(data.title);
      setContent(data.content);
      setBlogTags(data.tags || []);
      setPreviewImage(data.image || "");
      setIsFormReady(true);
    }
  }, [data]);

  const handleForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setDisable(true);

    if (blogTags.length <= 0) {
      toast.error("Please select some tags");
      setDisable(false);
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    blogTags.forEach((tag) => formData.append("tags", tag));
    if (blogImage) formData.append("image", blogImage);

    const result = await editBlogById(blogId, formData);

    if (result.message) {
      toast.success(result.message);
      setDisable(false);
      navigate("/blogs");
    } else {
      toast.error("Blog update failed");
      setDisable(false);
    }

    // Optionally clear form (or redirect)
  };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setBlogImage(e.target.files[0]);
      setPreviewImage(URL.createObjectURL(e.target.files[0]));
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
    setSelectedTag("");
  };

  const removeTag = (tag: string) => {
    setBlogTags(blogTags.filter((t) => t !== tag));
  };

  if (isLoading || !isFormReady)
    return (
      <div>
        <h1>Loading ...</h1>
      </div>
    );

  if (error)
    return (
      <div>
        <h1>Error loading blog data</h1>
      </div>
    );

  return (
    <div className="container mx-auto p-8 md:px-24">
      <h1 className="text-xl md:text-3xl uppercase font-semibold text-gray-500">
        Update your <span className="text-black font-extrabold">Blog</span>
      </h1>
      <form
        onSubmit={handleForm}
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
            <option value="">Select a tag</option>
            {tags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>

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

        {/* Editor */}
        <div>
          <Editor
            apiKey="u3w7dg5t76wp9ow90eif6e9ebdr5xg9gli56wn63aehtrbn7"
            onInit={(_evt, editor) => {
              editorRef.current = editor;
              // Manually set content after init to avoid cursor jump
              editor.setContent(content);
            }}
            onEditorChange={(newContent) => setContent(newContent)}
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
                "help",
                "wordcount",
              ],
              toolbar:
                "undo redo | blocks | bold italic forecolor | alignleft aligncenter " +
                "alignright alignjustify | bullist numlist outdent indent | removeformat | help",
              content_style:
                "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
            }}
          />
        </div>

        {/* Image Upload */}
        <div className="flex flex-col justify-center items-center">
          <div className="flex gap-3 justify-center items-center">
            <input
              type="file"
              accept="image/*"
              onChange={handleImage}
              ref={fileInputRef}
              className="bg-Primary-button-color hover:bg-gray-500/50 p-4 rounded-2xl text-center"
            />
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
          {previewImage && (
            <img src={previewImage} alt="preview" className="size-[10rem]" />
          )}
        </div>

        <Button
          type="submit"
          disabled={disable}
          className={`${
            disable ? "cursor-not-allowed opacity-50" : "cursor-pointer"
          }`}
        >
          Submit
        </Button>
      </form>
    </div>
  );
};

export default UpdateBlog;
