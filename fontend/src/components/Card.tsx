import { motion } from "framer-motion";
import { BlogData } from "../lib/types.tsx";
import { useQuery } from "@tanstack/react-query";
import { checkUser, deleteSingleBlog } from "@/utils/ApiFunction.ts";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button.tsx";
import { FaRegHeart, FaHeart, FaEdit } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";

import { handelLike } from "@/lib/utilFunction.ts";
import sampleImage from "../../src/assets/gemini-image.png";
import { useState } from "react";
import { toast } from "sonner";

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
  const [isDeleteBlog, setIsDeteBlog] = useState("");
  // const [deleteBlog, setDeleteBlog] = useState(false);
  const navigate = useNavigate();
  const handelDeleteBlog = async (id: string) => {
    try {
      const response = await deleteSingleBlog(id);
      await queryClient.invalidateQueries({
        queryKey: ["blogs"],
      });
      setIsDeteBlog("");
      toast.success(response.message);
      console.log(response);
    } catch (error) {
      toast.error("blog not deleted");
      console.log(error);
    }
  };
  return (
    <motion.div
      className="bg-Primary-text-color/5 max-w-[380px] w-full rounded-2xl border border-Primary-button-color p-5 shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col gap-4 group relative"
      initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      exit={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
      transition={{ duration: 0.3, type: "spring" }}
    >
      {/* Blog Image */}
      <div className="overflow-hidden rounded-xl">
        <img
          src={blogData.image || sampleImage}
          alt={blogData.title}
          className="w-full h-[220px] object-cover rounded-xl transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Title */}
      <h3 className="text-xl font-bold text-Primary-text-color capitalize">
        {blogData.title}
      </h3>

      {/* Content */}
      <p
        className="text-sm text-gray-600 line-clamp-2"
        dangerouslySetInnerHTML={{ __html: blogData.content }}
      ></p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        {blogData?.tags.map((tag) => (
          <span
            key={tag}
            className="bg-Green-color/50 text-[0.75rem] font-semibold px-3 py-1 rounded-full capitalize text-gray-800"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Like and Read More */}
      <div className="flex justify-between items-center mt-2">
        <button
          onClick={() => handelLike(blogData._id, userData, queryClient)}
          className="flex items-center gap-1 text-Primary-text-color hover:scale-105 transition-transform"
        >
          {blogData?.likedBy.includes(userData?.author._id) ? (
            <FaHeart className="text-red-500" />
          ) : (
            <FaRegHeart />
          )}
          {blogData.likes > 0 && (
            <span className="text-sm">{blogData.likes}</span>
          )}
        </button>

        <Button
          onClick={() => navigate(`/blogs/${blogData._id}`)}
          className="bg-Primary-text-color text-white hover:opacity-90 text-sm px-4 py-2 rounded-xl transition-all"
        >
          Read More
        </Button>
      </div>

      {/* Edit & Delete (only if user is author) */}
      {blogData.author._id === userData?.author?._id && (
        <div className="flex gap-2 justify-center mt-3">
          <Button className="bg-yellow-400/15 hover:bg-yellow-500/15 text-black text-xs px-3 py-1 rounded-xl flex items-center gap-2">
            <FaEdit /> Edit
          </Button>
          <Button
            onClick={() => setIsDeteBlog(blogData._id)}
            className="bg-red-500/15 hover:bg-red-600/15 text-black text-xs px-3 py-1 rounded-xl flex items-center gap-2"
          >
            <MdDeleteOutline /> Delete
          </Button>
        </div>
      )}
      {/* delete model */}
      {isDeleteBlog === blogData._id && (
        <div className="absolute bg-Primary-text-color/50 bottom-0 backdrop-blur-sm w-full h-full rounded-2xl flex justify-center items-center  ">
          {/* inner model */}
          <div className="flex flex-col gap-4">
            <h1 className="text-xl text-wrap px-2 font-semibold text-Primary-button-color ">
              {" "}
              Are you sure to delete{" "}
              <span className="font-bold text-red-500">{blogData.title}</span>
            </h1>
            <div className="flex justify-around">
              <Button onClick={() => setIsDeteBlog("")}>cancel</Button>
              <Button onClick={() => handelDeleteBlog(isDeleteBlog)}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Card;
