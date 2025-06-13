import { Button } from "@/components/ui/button";
import { useState } from "react";

const CreateBlogPage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [blogTags, setBlogTags] = useState<string[]>([]);
  const [selectedTag, setSelectedTag] = useState("");

  const handelForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Title:", title);
    console.log("Content:", content);
    console.log("Tags:", blogTags);

    // Reset
    setTitle("");
    setContent("");
    setBlogTags([]);
    setSelectedTag("");
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
            className="border-2 border-gray-400 rounded-2xl p-2 outline-none w-1/2 focus:shadow-gray-400"
          >
            <option value="">Select a tag</option>
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

        <Button type="submit">Publish</Button>
      </form>
    </div>
  );
};

export default CreateBlogPage;
