import { motion } from "framer-motion";
import { BlogData } from "../lib/types.tsx";
import { useQuery } from "@tanstack/react-query";
import { checkUser } from "@/utils/ApiFunction.ts";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button.tsx";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { handelLike } from "@/lib/utilFunction.ts";
import sampleImage from "../../src/assets/gemini-image.png";

interface CardProps {
  blogData: BlogData;
  index: number;
  queryClient: {
    invalidateQueries: (options: { queryKey: unknown[] }) => Promise<unknown>;
  };
}

const Card = ({ blogData, index, queryClient }: CardProps) => {
  const { data: userData } = useQuery({
    queryKey: ["user"],
    queryFn: checkUser,
    retry: false,
  });
  const navigate = useNavigate();

  return (
    <motion.div
      className="bg-Primary-text-color/10 h-fit w-full p-4 rounded-2xl flex flex-col justify-between gap-2 border-2 border-Primary-button-color shadow-md shadow-Primary-text-color/50 group min-h-full min-w-[200px]"
      initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      exit={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
      transition={{ duration: 0.3, type: "spring" }}
    >
      {/* blog image  */}
      <div className="w-fit overflow-hidden rounded-2xl">
        <img
          src={blogData.image ? blogData.image : sampleImage}
          alt={blogData.title}
          className="rounded-2xl group-hover:scale-110 transition-all duration-300 ease-in-out"
        />
      </div>
      {/* blog title */}
      <h3 className="text-xl font-bold text-Primary-text-color uppercase">
        {blogData.title}
      </h3>
      {/* blog content */}
      <p className="text-gray-700 line-clamp-2">{blogData.content}</p>
      {/* tags  */}
      <div className=" flex gap-2 flex-wrap">
        {blogData?.tags.map((tag) => (
          <h2
            key={tag}
            className=" bg-Green-color/50 px-4 py-1 rounded-xl capitalize font-semibold"
          >
            {tag}
          </h2>
        ))}
      </div>
      {/* like and read more section */}
      <section className="flex justify-between items-center">
        <span className="flex justify-center items-center gap-1 cursor-pointer transition-all duration-300 ease-in-out">
          {blogData?.likedBy.includes(userData?.author._id) ? (
            <FaHeart
              className="text-red-500"
              onClick={() => handelLike(blogData._id, userData, queryClient)}
            />
          ) : (
            <FaRegHeart
              onClick={() => handelLike(blogData._id, userData, queryClient)}
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
  );
};

export default Card;
