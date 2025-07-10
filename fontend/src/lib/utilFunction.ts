import { toogleFollowAndUnfollow, toogleLike } from "@/utils/ApiFunction";

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
    await queryClient.invalidateQueries({ queryKey: ["otherUserData"] });
  } catch (error) {
    console.error("Error liking the blog:", error);
  }
};

export const handleFollowUser = async (
  id: string,
  queryClient: {
    invalidateQueries: (options: { queryKey: unknown[] }) => Promise<unknown>;
  }
) => {
  try {
    await toogleFollowAndUnfollow(id);
    await queryClient.invalidateQueries({
      queryKey: ["followers"],
    });
    await queryClient.invalidateQueries({
      queryKey: ["following"],
    });
    await queryClient.invalidateQueries({
      queryKey: ["user"],
    });
    await queryClient.invalidateQueries({
      queryKey: ["otherUserData"],
    });
  } catch (error) {
    console.error("Error toggling follow/unfollow:", error);
  }
};
export const tags: string[] = [
  "programing",
  "Environment",
  "Science",
  "Entertainment",
  "Politics",
  "Finance",
  "Economics",
  "Others",
];
