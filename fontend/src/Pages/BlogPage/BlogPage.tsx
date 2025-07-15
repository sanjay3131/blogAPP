import { getSingleblog } from "@/utils/ApiFunction";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import Markdown from "react-markdown";

const BlogPage = () => {
  const params = useParams();
  const blogId = params.id as string;

  const { data, isLoading, error } = useQuery({
    queryKey: ["blogs", blogId],
    queryFn: () => getSingleblog(blogId),
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="p-4"
    >
      <h1
        className="text-2xl font-bold mb-4"
        dangerouslySetInnerHTML={{ __html: data.title }}
      />
      <div
        className="reset-tw"
        dangerouslySetInnerHTML={{ __html: data.content }}
      ></div>
    </motion.div>
  );
};

export default BlogPage;
