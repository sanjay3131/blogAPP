import { Button } from "@/components/ui/button";
import { postBlog } from "@/utils/ApiFunction";
import { useRef, useState } from "react";
import { toast } from "sonner";

const CreateBlogPage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [blogTags, setBlogTags] = useState<string[]>([]);
  const [selectedTag, setSelectedTag] = useState("");
  const [blogImage, setBlogImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [disable, setDisable] = useState(false);
  const handelForm = async (e: React.FormEvent<HTMLFormElement>) => {
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
    if (blogImage) formData.append("image", blogImage); // Add only if file exists

    const result = await postBlog(formData);
    console.log(result);
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
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handelImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setBlogImage(e.target.files[0]); // Store the File object, not URL
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

  return (
    <div className="container mx-auto p-8 md:px-24">
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

        {/* Content */}
        <div className="w-full">
          <label
            htmlFor="content"
            className="text-xl md:text-2xl font-semibold px-2 cursor-pointer w-fit hover:scale-105 transition-all"
          >
            Content
          </label>
          <textarea
            id="content"
            required
            className="border-2 border-gray-400 rounded-2xl focus:shadow-md focus:shadow-gray-400 p-4 outline-none w-full min-h-[300px] transition-all"
            placeholder="Write your content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          ></textarea>
        </div>

        {/* Image Upload */}
        <div className="flex flex-col justify-center items-center">
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
          {blogImage && (
            <img
              src={URL.createObjectURL(blogImage)}
              alt=""
              className="size-[10rem]"
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
  );
};

export default CreateBlogPage;
