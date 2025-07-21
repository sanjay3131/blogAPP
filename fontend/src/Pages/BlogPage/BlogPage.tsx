import { getSingleblog } from "@/utils/ApiFunction";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import ErrorInBlogPage from "../ErrorInBlogPage";
import LoadingPage from "../LoadingPage";
import { CommentData } from "@/lib/types";

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
      {/* title */}
      <h1
        className="text-6xl capitalize font-bold mb-4"
        dangerouslySetInnerHTML={{ __html: data.title }}
      />
      {/* blog image */}
      <img
        src={data?.image ? data?.image : data.aiImage}
        className="w-[24rem] object-cover rounded-2xl"
        alt=""
      />
      {/* blog content */}
      <div
        className="reset-tw"
        dangerouslySetInnerHTML={{ __html: data.content }}
      ></div>
      {/* comments */}
      <div className="w-full flex flex-col gap-4 mt-8">
        {data.comments.map((comment: CommentData) => (
          <div key={comment._id} className="p-4 bg-white rounded-lg shadow-md">
            <div className="flex items-center gap-2 mb-4">
              <img
                src={comment.user?.profilePic}
                alt=""
                className="w-10 h-10 rounded-full"
              />
              <h2 className="text-sm font-semibold capitalize">
                {comment.user?.name}
              </h2>
            </div>
            <p className="text-sm ">{comment.text}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs text-gray-500">
                {new Date(comment.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
        <div></div>
      </div>
    </motion.div>
  );
};

export default BlogPage;
