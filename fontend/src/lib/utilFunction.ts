import { toogleLike } from "@/utils/ApiFunction";

interface UserData {
  id: string;
  name: string;
  email: string;
  // Add other user properties as needed
}

export const handelLike = async (
  blogId: string,
  userData: UserData | null,
  queryClient: {
    invalidateQueries: (options: { queryKey: unknown[] }) => Promise<unknown>;
  }
): Promise<void> => {
  try {
    if (!userData) return alert("Login to like");
    await toogleLike(blogId);
    await queryClient.invalidateQueries({ queryKey: ["blogs"] });
    await queryClient.invalidateQueries({ queryKey: ["blogCategory"] });
  } catch (error) {
    console.error("Error liking the blog:", error);
  }
};
