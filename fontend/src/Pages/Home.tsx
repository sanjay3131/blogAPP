import { Button } from "@/components/ui/button";
import { checkUser, getAllBlogs } from "@/utils/ApiFunction";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { FaRegArrowAltCircleRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { BlogData } from "../lib/types.tsx";
import Card from "@/components/Card.tsx";
import BlogByCategories from "@/components/BlogByCategories.tsx";

const Home = () => {
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

  // const { data: blogsByTags, isLoading: tagLoading } = useQuery({
  //   queryKey: ["blogCategory", selectedTag],
  //   queryFn: () => getBlogsByTags(selectedTag),
  //   enabled: selectedTag.length > 0,
  // });
  // console.log(blogsByTags);

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
          <motion.button
            className="bg-Green-color text-Primary-text-color rounded-[5px] font-semibold uppercase w-[180px] py-2 flex items-center 
          justify-between px-4 hover:scale-105  transition-all duration-200 ease-in-out group"
          >
            Start Reading
            <span className="group-hover:text-white transition-all duration-200 ease-in-out">
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
          <motion.div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 container mx-auto  gap-4 justify-center items-center w-full p-8">
            {data.slice(0, 6).map((blogData: BlogData, index: number) => (
              <Card
                key={blogData._id}
                blogData={blogData}
                index={index}
                queryClient={queryClient}
              />
            ))}
          </motion.div>
          <Button onClick={() => navigate("/blogs")} className="w-24">
            More Blogs
          </Button>
        </motion.section>

        {/* Blogs by Categories */}
        <BlogByCategories />
      </motion.div>
    </motion.div>
  );
};

export default Home;
