import {
  aiImageGenaration,
  aiImagePromtGenerate,
  toogleFollowAndUnfollow,
  toogleLike,
} from "@/utils/ApiFunction";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

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

// mutation functions

// generete ai image prompt
export const useGenerateAiImagePrompt = () => {
  return useMutation({
    mutationFn: (prompt: string) => aiImagePromtGenerate(prompt),
    onSuccess: () => {
      toast.success("AI promt generated");
    },
    onError: () => {
      toast.error("Failed to generate promt");
    },
  });
};

// generate ai image
export const useGenerateAiImage = () => {
  return useMutation({
    mutationFn: (prompt: string) => aiImageGenaration(prompt),
    onSuccess: () => {
      toast.success("AI Image generated");
    },
  });
};

// scroll to id
interface ScrollToSectionFn {
  (id: string): void;
}
export const scrollToSection: ScrollToSectionFn = (id) => {
  const element: HTMLElement | null = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: "smooth" });
  }
};
