import { Button } from "@/components/ui/button";
import {
  checkUser,
  getAllBlogs,
  getBlogsByTags,
  toogleLike,
} from "@/utils/ApiFunction";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { FaRegHeart } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { FaRegArrowAltCircleRight } from "react-icons/fa";
import { useState } from "react";

const Home = () => {
  const [selectedTag, setSelectedTag] = useState([""]);

  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["blogs"],
    queryFn: getAllBlogs,
  });

  const { data: userData } = useQuery({
    queryKey: ["user"],
    queryFn: checkUser,
    retry: false,
  });
  const { data: blogsByTags } = useQuery({
    queryKey: ["blogCategory"],
    queryFn: getBlogsByTags(selectedTag),
  });
  const navigate = useNavigate();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

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
  const handelLike = async (blogId: string) => {
    try {
      if (!userData) alert("Login to like");
      await toogleLike(blogId);
      await queryClient.invalidateQueries({ queryKey: ["blogs"] });

      // Optionally, you can refetch the data or update the state to reflect the like change
    } catch (error) {
      console.error("Error liking the blog:", error);
    }
  };
  const handelNavigation = () => {
    if (userData?.status == 200) {
      navigate("/createblog");
    } else {
      toast.success("login to create a blog ");
      navigate("/login");
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="p-4 w-full min-h-[calc(100vh-100px)]  pb-24"
    >
      <motion.div
        className="w-full  flex flex-col gap-4 relative "
        initial={{ opacity: 0, x: -1000 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 100 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
      >
        {/* first section */}
        <motion.section className="flex flex-col   gap-4 bg-Primary-text-color p-4 text-white rounded-2xl ">
          <motion.h1 className="text-3xl font-bold">
            Uncover fresh perspectives, ideas, and knowledge through the power
            of blogs.
          </motion.h1>

          <p className="text-gray-100/50 ">
            Blog is an open platform where readers find dynamic thinking, and
            where expert and undiscovered voices can share their writing on any
            topic.
          </p>
          <motion.button className="bg-Green-color text-Primary-text-color  rounded-[5px] font-semibold uppercase  w-[180px] py-2 flex items-center justify-between px-4">
            Start Reading
            <span>
              <FaRegArrowAltCircleRight />
            </span>
          </motion.button>
        </motion.section>
        {/* create a blog */}

        <div className="relative">
          <motion.div className="w-full  flex items-center justify-center">
            <Button onClick={() => handelNavigation()}>Write a Blog</Button>
          </motion.div>
        </div>
        {/* trending blogs  */}
        <motion.section className="flex flex-col gap-4  p-4 rounded-2xl justify-center items-center ">
          <h2 className="text-2xl font-bold  ">New Blogs</h2>

          <motion.div className="grid  grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 justify-center items-center  w-full p-8 ">
            {data.slice(0, 6).map((blogData: BlogData, index: number) => (
              <motion.div
                key={blogData._id}
                className=" bg-Primary-text-color/10 h-fit w-full  p-4 rounded-2xl flex flex-col justify-between gap-2 
                  not-last-of-type: border-2 border-Primary-button-color shadow-md shadow-Primary-text-color/50 group min-h-full min-w-[200px] "
                initial={{ opacity: 0, x: index % 2 == 0 ? -100 : 100 }}
                animate={{ opacity: 1, y: 0 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                exit={{ opacity: 0, x: index % 2 == 0 ? -100 : 100 }}
                transition={{ duration: 0.3, type: "spring" }}
              >
                <div className=" w-fit overflow-hidden rounded-2xl">
                  <img
                    src={blogData.image}
                    alt=""
                    className="rounded-2xl group-hover:scale-110  transition-all duration-300 ease-in-out"
                  />
                </div>
                <h3 className="text-xl font-bold text-Primary-text-color uppercase">
                  {blogData.title}
                </h3>
                <p className="text-gray-700 line-clamp-2 ">
                  {blogData.content}
                </p>
                {/*  like*/}
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
          <Button onClick={() => navigate("/blogs")} className="w-24 ">
            More Blogs
          </Button>
        </motion.section>
        {/* Blogs by categories */}
        <motion.div className="flex flex-col items-center gap-5">
          <h1 className="text-2xl font-bold">Blogs by categories</h1>
          <motion.div className="flex gap-4 flex-wrap justify-center items-center">
            {tags.map((cat) => (
              <div
                className={`" px-4 py-2 rounded-2xl  font-semibold uppercase hover:bg-Green-color ${
                  selectedTag.includes(cat)
                    ? "bg-Green-color"
                    : "bg-Geen-color/25"
                }`}
                onClick={() => {
                  setSelectedTag((pre) => [...pre, cat]);
                }}
              >
                {cat}
              </div>
            ))}
          </motion.div>
        </motion.div>

        <div className="flex justify-center">
          {selectedTag.map((t) => (
            <div>{t}</div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Home;
