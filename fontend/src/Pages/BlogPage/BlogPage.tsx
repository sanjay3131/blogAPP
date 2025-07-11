import { getSingleblog } from "@/utils/ApiFunction";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";

const BlogPage = () => {
  const params = useParams();
  const blogId = params.id as string;
  console.log(blogId);

  const { data, isLoading, error } = useQuery({
    queryKey: ["blogs", blogId],
    queryFn: () => getSingleblog(blogId),
  });

  console.log(data);

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
        dangerouslySetInnerHTML={{ __html: data.title }}
        className="text-2xl"
      ></h1>
      <p dangerouslySetInnerHTML={{ __html: data.content }}></p>
    </motion.div>
  );
};

export default BlogPage;
