import { Button } from "@/components/ui/button";
import {
  checkUser,
  getAllBlogs,
  getBlogsByTags,
  toogleLike,
} from "@/utils/ApiFunction";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { FaRegHeart, FaHeart, FaRegArrowAltCircleRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useState } from "react";

const Home = () => {
  const [selectedTag, setSelectedTag] = useState<string[]>([]);

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data, isLoading, error } = useQuery({
    queryKey: ["blogs"],
    queryFn: getAllBlogs,
  });

  const { data: userData } = useQuery({
    queryKey: ["user"],
    queryFn: checkUser,
    retry: false,
  });

  const { data: blogsByTags, isLoading: tagLoading } = useQuery({
    queryKey: ["blogCategory", selectedTag],
    queryFn: () => getBlogsByTags(selectedTag),
    enabled: selectedTag.length > 0,
  });
  console.log(blogsByTags);

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

  type BlogData = {
    _id: string;
    title: string;
    content: string;
    likes: number;
    likedBy: string[];
    author: {
      _id: string;
      name: string;
      email: string;
    };
    image: string;
  };

  const handelLike = async (blogId: string) => {
    try {
      if (!userData) return alert("Login to like");
      await toogleLike(blogId);
      await queryClient.invalidateQueries({ queryKey: ["blogs"] });
      if (selectedTag.length > 0) {
        await queryClient.invalidateQueries({
          queryKey: ["blogCategory", selectedTag],
        });
      }
    } catch (error) {
      console.error("Error liking the blog:", error);
    }
  };

  const handelNavigation = () => {
    if (userData?.status == 200) {
      navigate("/createblog");
    } else {
      toast.success("Login to create a blog");
      navigate("/login");
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="p-4 w-full min-h-[calc(100vh-100px)] pb-24"
    >
      <motion.div
        className="w-full flex flex-col gap-4 relative"
        initial={{ opacity: 0, x: -1000 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 100 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
      >
        {/* First Section */}
        <motion.section className="flex flex-col gap-4 bg-Primary-text-color p-4 text-white rounded-2xl">
          <motion.h1 className="text-3xl font-bold">
            Uncover fresh perspectives, ideas, and knowledge through the power
            of blogs.
          </motion.h1>
          <p className="text-gray-100/50">
            Blog is an open platform where readers find dynamic thinking, and
            where expert and undiscovered voices can share their writing on any
            topic.
          </p>
          <motion.button className="bg-Green-color text-Primary-text-color rounded-[5px] font-semibold uppercase w-[180px] py-2 flex items-center justify-between px-4">
            Start Reading
            <span>
              <FaRegArrowAltCircleRight />
            </span>
          </motion.button>
        </motion.section>

        {/* Create Blog */}
        <div className="relative">
          <motion.div className="w-full flex items-center justify-center">
            <Button onClick={handelNavigation}>Write a Blog</Button>
          </motion.div>
        </div>

        {/* Trending Blogs */}
        <motion.section className="flex flex-col gap-4 p-4 rounded-2xl justify-center items-center">
          <h2 className="text-2xl font-bold">New Blogs</h2>
          <motion.div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 justify-center items-center w-full p-8">
            {data.slice(0, 6).map((blogData: BlogData, index: number) => (
              <motion.div
                key={blogData._id}
                className="bg-Primary-text-color/10 h-fit w-full p-4 rounded-2xl flex flex-col justify-between gap-2 border-2 border-Primary-button-color shadow-md shadow-Primary-text-color/50 group min-h-full min-w-[200px]"
                initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
                animate={{ opacity: 1, y: 0 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                exit={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
                transition={{ duration: 0.3, type: "spring" }}
              >
                <div className="w-fit overflow-hidden rounded-2xl">
                  <img
                    src={blogData.image}
                    alt=""
                    className="rounded-2xl group-hover:scale-110 transition-all duration-300 ease-in-out"
                  />
                </div>
                <h3 className="text-xl font-bold text-Primary-text-color uppercase">
                  {blogData.title}
                </h3>
                <p className="text-gray-700 line-clamp-2">{blogData.content}</p>
                <section className="flex justify-between items-center">
                  <span className="flex justify-center items-center gap-1 cursor-pointer transition-all duration-300 ease-in-out">
                    {blogData.likedBy.includes(userData?.author._id) ? (
                      <FaHeart
                        className="text-red-500"
                        onClick={() => handelLike(blogData._id)}
                      />
                    ) : (
                      <FaRegHeart
                        className=""
                        onClick={() => handelLike(blogData._id)}
                      />
                    )}
                    {blogData.likes !== 0 ? blogData.likes : ""}
                  </span>
                  <Button
                    onClick={() => navigate(`/blogs/${blogData._id}`)}
                    className="mt-2 cursor-pointer hover:scale-105"
                  >
                    Read More
                  </Button>
                </section>
              </motion.div>
            ))}
          </motion.div>
          <Button onClick={() => navigate("/blogs")} className="w-24">
            More Blogs
          </Button>
        </motion.section>

        {/* Blogs by Categories */}
        <motion.div className="flex flex-col items-center gap-5">
          <h1 className="text-2xl font-bold">Blogs by Categories</h1>
          <motion.div className="flex gap-4 flex-wrap justify-center items-center">
            {tags.map((cat, index) => (
              <div
                key={index}
                className={`px-4 py-2 rounded-2xl font-semibold uppercase cursor-pointer transition-all duration-300 ${
                  selectedTag.includes(cat)
                    ? "bg-Green-color text-white"
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

          <Button onClick={() => setSelectedTag([])} className="mt-4">
            Clear Selected Tags
          </Button>
        </motion.div>

        {/* Display Blogs by Tags */}
        {tagLoading && selectedTag.length > 0 && (
          <div>Loading blogs for selected tags...</div>
        )}

        {blogsByTags &&
          blogsByTags.selectedBlogs &&
          blogsByTags.selectedBlogs.length > 0 && (
            <motion.section className="flex flex-col gap-4 p-4 rounded-2xl justify-center items-center">
              <h2 className="text-2xl font-bold">
                Blogs in {selectedTag.join(", ")}
              </h2>
              <motion.div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full">
                {blogsByTags.selectedBlogs.map((blogData: BlogData) => (
                  <motion.div
                    key={blogData._id}
                    className="bg-Primary-text-color/10 p-4 rounded-2xl shadow-md group"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="overflow-hidden rounded-2xl">
                      <img
                        src={blogData.image}
                        alt=""
                        className="rounded-2xl group-hover:scale-110 transition-all duration-300"
                      />
                    </div>
                    <h3 className="text-xl font-bold text-Primary-text-color uppercase mt-2">
                      {blogData.title}
                    </h3>
                    <p className="text-gray-700 line-clamp-2">
                      {blogData.content}
                    </p>
                    <Button
                      onClick={() => navigate(`/blogs/${blogData._id}`)}
                      className="mt-2 cursor-pointer hover:scale-105"
                    >
                      Read More
                    </Button>
                  </motion.div>
                ))}
              </motion.div>
            </motion.section>
          )}
      </motion.div>
    </motion.div>
  );
};

export default Home;
