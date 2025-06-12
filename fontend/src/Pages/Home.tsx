import { Button } from "@/components/ui/button";
import { checkUser, getAllBlogs, toogleLike } from "@/utils/ApiFunction";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { FaRegHeart } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Home = () => {
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
  };
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
        <motion.section className="flex flex-col  gap-4 bg-Primary-text-color p-4 text-white rounded-2xl ">
          <motion.button className="bg-red-500 rounded-[5px] font-semibold uppercase  w-[100px] py-2">
            Hot Now
          </motion.button>

          <motion.h1 className="text-3xl font-bold">
            Bulvinar Neque Laoreet Suspendisse Interdum
          </motion.h1>

          <p className="text-gray-100/50 ">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
            consectetur, nisi at commodo facilisis, enim erat aliquet quam, nec
            tincidunt enim nisi euismod est. Sed at ligula in quam facilisis
            commodo.
          </p>
        </motion.section>
        {/* create a blog */}

        <div className="relative">
          <motion.div className="w-full  flex items-center justify-center">
            <Button onClick={() => navigate("/createblog")}>
              Write a Blog
            </Button>
          </motion.div>
        </div>
        {/* trending blogs  */}
        <motion.section className="flex flex-col gap-4  p-4 rounded-2xl justify-center items-center">
          <h2 className="text-2xl font-bold  ">Trending Blogs</h2>

          <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 justify-center items-center ">
            {data.slice(0, 6).map((blogData: BlogData) => (
              <motion.div
                key={blogData._id}
                className=" bg-Primary-text-color/10 h-[210px] p-4 rounded-2xl flex flex-col justify-between gap-2 
                  transition-shadow duration-300 border-8 border-Primary-button-color shadow-md shadow-Primary-text-color/50"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-xl font-bold text-Primary-text-color uppercase">
                  {blogData.title}
                </h3>
                <p className="text-gray-700 line-clamp-[10px] ">
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
      </motion.div>
    </motion.div>
  );
};

export default Home;
