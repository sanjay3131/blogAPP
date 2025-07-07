import { getBlogsByTags } from "@/utils/ApiFunction";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "./ui/button";
import { motion } from "framer-motion";
import { tags } from "@/lib/utilFunction";
import { BlogData } from "@/lib/types";
import Card from "./Card";

const BlogByCategories = ({ showAll = false }: { showAll?: boolean }) => {
  const [selectedTag, setSelectedTag] = useState<string[]>([]);

  const queryClient = useQueryClient();

  const { data: blogsByTags, isLoading: tagLoading } = useQuery({
    queryKey: ["blogCategory", selectedTag],
    queryFn: () => getBlogsByTags(selectedTag),
    enabled: selectedTag.length > 0,
  });
  console.log(blogsByTags);

  return (
    <div>
      {" "}
      <motion.div className="flex flex-col items-center gap-5">
        <h1 className="text-2xl font-bold">Blogs by Categories</h1>
        <motion.div className="flex gap-4 flex-wrap justify-center items-center">
          {tags.map((cat, index) => (
            <div
              key={index}
              className={`px-4 py-2 rounded-2xl font-semibold uppercase cursor-pointer transition-all duration-300 hover:bg-Green-color ${
                selectedTag.includes(cat)
                  ? "bg-Green-color  shadow-sm shadow-Primary-text-color scale-105"
                  : "bg-Green-color/25"
              }`}
              onClick={() => {
                setSelectedTag((prev) =>
                  prev.includes(cat)
                    ? prev.filter((t) => t !== cat)
                    : [...prev, cat]
                );
              }}
            >
              {cat}
            </div>
          ))}
        </motion.div>

        {selectedTag.length > 0 && (
          <Button onClick={() => setSelectedTag([])} className="mt-4">
            Clear Selected Tags
          </Button>
        )}
      </motion.div>
      {/* Display Blogs by Tags */}
      {tagLoading && selectedTag.length > 0 && (
        <div className=" text-center text-2xl font-semibold">
          Loading blogs for selected tags...
        </div>
      )}
      {selectedTag.length > 0 && blogsByTags?.message && (
        <div className="text-center text-2xl capitalize font-semibold underline decoration-red-500 ">
          no blogs found
        </div>
      )}
      {blogsByTags &&
        blogsByTags.selectedBlogs &&
        blogsByTags.selectedBlogs.length > 0 && (
          <motion.section className="flex flex-col gap-4 p-4 rounded-2xl justify-center items-center w-full">
            <h2 className="text-2xl font-bold capitalize">
              Blogs in {selectedTag.join(", ")}
            </h2>
            <motion.div
              className="w-full grid  sm:grid-cols-2 md:grid-cols-3  md:mx-auto gap-8 p-4 
     items-center pb-20"
            >
              {(blogsByTags.selectedBlogs
                ? showAll
                  ? blogsByTags.selectedBlogs
                  : blogsByTags.selectedBlogs.slice(0, 6)
                : []
              ).map((blogData: BlogData, index: number) => (
                <Card
                  key={blogData._id}
                  blogData={blogData}
                  index={index}
                  queryClient={queryClient}
                />
              ))}
            </motion.div>
          </motion.section>
        )}
    </div>
  );
};

export default BlogByCategories;
