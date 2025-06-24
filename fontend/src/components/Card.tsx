import { motion } from "framer-motion";
import { BlogData } from "../lib/types.tsx";
import { useQuery } from "@tanstack/react-query";
import { checkUser } from "@/utils/ApiFunction.ts";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button.tsx";
import { FaRegHeart, FaHeart } from "react-icons/fa";

const Card = (BlogData: BlogData, index: number) => {
  const { data: userData } = useQuery({
    queryKey: ["user"],
    queryFn: checkUser,
    retry: false,
  });
  const navigate = useNavigate();

  return (
    <motion.div
      key={BlogData._id}
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
          src={BlogData.image}
          alt=""
          className="rounded-2xl group-hover:scale-110 transition-all duration-300 ease-in-out"
        />
      </div>
      <h3 className="text-xl font-bold text-Primary-text-color uppercase">
        {BlogData.title}
      </h3>
      <p className="text-gray-700 line-clamp-2">{BlogData.content}</p>
      <section className="flex justify-between items-center">
        <span className="flex justify-center items-center gap-1 cursor-pointer transition-all duration-300 ease-in-out">
          {BlogData.likedBy.includes(userData?.author._id) ? (
            <FaHeart
              className="text-red-500"
              onClick={() => handelLike(BlogData._id)}
            />
          ) : (
            <FaRegHeart className="" onClick={() => handelLike(BlogData._id)} />
          )}
          {BlogData.likes !== 0 ? BlogData.likes : ""}
        </span>
        <Button
          onClick={() => navigate(`/blogs/${BlogData._id}`)}
          className="mt-2 cursor-pointer hover:scale-105"
        >
          Read More
        </Button>
      </section>
    </motion.div>
  );
};

export default Card;
