import { checkUser, toogleLike } from "@/utils/ApiFunction";
import { useQuery } from "@tanstack/react-query";

export const handelLike = async (
  blogId: string,
  userData,
  selectedTag,
  queryClient
) => {
  try {
    if (!userData) return alert("Login to like");
    await toogleLike(blogId);
    await queryClient.invalidateQueries({ queryKey: ["blogs"] });
    if (selectedTag.length > 0) {
      await queryClient.invalidateQueries({
        queryKey: ["blogCategory", selectedTag],
      });
    }
  } catch (error) {
    console.error("Error liking the blog:", error);
  }
};
