import { getSingleblog } from "@/utils/ApiFunction";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import ErrorInBlogPage from "../ErrorInBlogPage";
import LoadingPage from "../LoadingPage";

const BlogPage = () => {
  const params = useParams();
  const blogId = params.id as string;

  const { data, isLoading, error } = useQuery({
    queryKey: ["blogs", blogId],
    queryFn: () => getSingleblog(blogId),
  });
  console.log(data);

  if (isLoading) return <LoadingPage />;
  if (error)
    return (
      <div className=" w-full  flex ">
        <ErrorInBlogPage />
      </div>
    );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="p-4 flex flex-col justify-center items-center"
    >
      <h1
        className="text-6xl capitalize font-bold mb-4"
        dangerouslySetInnerHTML={{ __html: data.title }}
      />
      <img
        src={data?.image ? data?.image : data.aiImage}
        className="w-[24rem] object-cover rounded-2xl"
        alt=""
      />
      <div
        className="reset-tw"
        dangerouslySetInnerHTML={{ __html: data.content }}
      ></div>
    </motion.div>
  );
};

export default BlogPage;
