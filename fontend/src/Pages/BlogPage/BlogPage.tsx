import {
  checkUser,
  getSingleblog,
  postComment,
  editComment as editcommentapi,
  deleteComment,
} from "@/utils/ApiFunction";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import ErrorInBlogPage from "../ErrorInBlogPage";
import LoadingPage from "../LoadingPage";
import { CommentData } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { scrollToSection } from "@/lib/utilFunction";
import { FaEdit, FaTrash } from "react-icons/fa";
import noProfile from "../../assets/noProfile.png";

const BlogPage = () => {
  const params = useParams();
  const blogId = params.id as string;

  const { data, isLoading, error } = useQuery({
    queryKey: ["blogs", blogId],
    queryFn: () => getSingleblog(blogId),
  });
  const { data: userData } = useQuery({
    queryKey: ["user"],
    queryFn: checkUser,
    retry: false,
  });

  const navgation = useNavigate();

  const queryClient = useQueryClient();
  const [comment, setComment] = useState("");
  const [editComment, setEditComment] = useState("");
  const [commentId, setCommentId] = useState("");
  const [edit, setEdit] = useState(false);
  const commentRef = useRef<HTMLTextAreaElement>(null);

  // post a comment
  const handelCommentSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!comment.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }
    try {
      await postComment(blogId, comment);
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      setComment("");
      toast.success("Comment posted successfully");
      scrollToSection("comments");
    } catch (error) {
      console.error("Error posting comment:", error);
      toast.error("Failed to post comment. Please try again later.");
    }
  };
  const handleDeleteComment = async (commentId: string) => {
    await deleteComment(data._id, commentId);
    queryClient.invalidateQueries({ queryKey: ["blogs"] });
    toast.success("Comment deleted successfully");
  };

  const handelEditComment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editComment.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }
    try {
      await editcommentapi(data._id, commentId, editComment);
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      setEditComment("");
      setEdit(false);
      setCommentId("");
      toast.success("Comment edited successfully");
    } catch (err) {
      console.error("Error editing comment:", err);
      toast.error("Failed to edit comment. Please try again later.");
    }
  };

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
        className=" text-4xl md:text-6xl capitalize font-extrabold mb-4"
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
      {/* author profile */}
      <div
        className="flex flex-col items-start mt-4 w-full gap-1"
        onClick={() => navgation(`/userPage/${data.author?._id}`)}
      >
        <div className="flex items-center gap-4 mt-4">
          <img
            src={data.author?.profilePic ? data.author.profilePic : noProfile}
            referrerPolicy="no-referrer"
            alt=""
            className="w-10 h-10 rounded-full"
          />
          <h2 className="text-sm font-semibold capitalize">
            {data.author?.name}
          </h2>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {new Date(data.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
        <p className="text-xs text-gray-500">
          {new Date(data.createdAt).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>

      {/* comments */}
      {/* post / edit a comment */}
      {edit ? (
        <div
          className="w-full  mt-8 p-4 bg-Primary-text-color/10 rounded-lg shadow-md"
          id="edit-comment-form"
        >
          <h2 className="text-lg font-semibold capitalize">edit a comment</h2>
          <form
            className="flex flex-col gap-4 mt-4"
            onSubmit={handelEditComment}
          >
            <textarea
              ref={commentRef}
              id="comments"
              className="p-2 border w-full border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-Primary-text-color"
              placeholder="Write your comment here..."
              rows={4}
              value={editComment}
              onChange={(e) => setEditComment(e.target.value)}
            ></textarea>
            <Button type="submit" className="w-fit">
              edit Comment
            </Button>
            <Button
              onClick={() => {
                setEdit(false);
                setCommentId("");
                setEditComment("");
                scrollToSection("comments");
              }}
              className="text-red-500 w-fit"
            >
              Cancel
            </Button>
          </form>
        </div>
      ) : (
        <div className="w-full  mt-8 p-4 bg-Primary-text-color/10 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold capitalize">post a comment</h2>
          <form
            className="flex flex-col gap-4 mt-4"
            onSubmit={handelCommentSubmit}
          >
            <textarea
              className="p-2 border w-full border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-Primary-text-color"
              placeholder="Write your comment here..."
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            ></textarea>
            <Button type="submit" className="w-fit">
              Submit Comment
            </Button>
          </form>
        </div>
      )}

      {/* read comments */}
      <div className="w-full flex flex-col gap-4 mt-8" id="comments">
        {data.comments.map((comment: CommentData) => (
          <div
            key={comment._id}
            className="p-4 bg-Primary-text-color/5 rounded-lg shadow-md"
          >
            {/* comment date */}
            <div className="flex items-center gap-2 mb-2 w-full justify-end">
              <span className="text-xs text-gray-500">
                {new Date(comment.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
              <span className="text-xs text-gray-500">
                {new Date(comment.createdAt).toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>

            <div
              className="flex items-center gap-2 mb-4"
              onClick={() => navgation(`/userPage/${comment.user?._id}`)}
            >
              <img
                src={comment.user?.profilePic}
                alt=""
                className="w-10 h-10 rounded-full"
              />
              <h2 className="text-sm font-semibold capitalize">
                {comment.user?.name}
              </h2>
            </div>
            {/* comment text */}

            <p className="text-sm ">{comment.text}</p>
            {/* edit and delete */}
            {userData?.author?._id === comment.user?._id && (
              <div className="flex items-center gap-2 mt-2">
                <Button
                  onClick={() => {
                    setEdit(true);
                    setCommentId(comment._id);
                    setEditComment(comment.text);
                    scrollToSection("edit-comment-form");
                    if (commentRef.current) {
                      commentRef.current.focus();
                    }
                  }}
                  className="text-blue-500 size-fit bg-transparent shadow-md hover:bg-blue-100"
                >
                  <FaEdit className="size-3 " />
                </Button>
                <Button
                  onClick={() => handleDeleteComment(comment._id)}
                  className="text-red-500  size-fit bg-transparent shadow-md hover:bg-red-100"
                >
                  <FaTrash className="size-3" />
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default BlogPage;
