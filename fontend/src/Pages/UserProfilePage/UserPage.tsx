import { useQuery, useQueryClient } from "@tanstack/react-query";
import { checkUser, getAllUserBlog } from "@/utils/ApiFunction";

import addFriend from "../../assets/add-friend.png";
import check from "../../assets/check.png";
import blogIcon from "../../assets/computer.png";

import UserComponent from "@/components/UserComponent";
import { BlogData } from "@/lib/types";
import LoadingPage from "../LoadingPage";
import ErrorPage from "../ErrorPage";

const UserPage = () => {
  const {
    data: userBlogs,
    isLoading,
    error,
  } = useQuery<BlogData[]>({
    queryKey: ["blogs"],
    queryFn: getAllUserBlog,
  });
  const { data: userData } = useQuery({
    queryKey: ["user"],
    queryFn: checkUser,
  });
  const queryClient = useQueryClient();

  if (isLoading) return <LoadingPage />;
  if (error) return <ErrorPage />;
  // const []=useState([])
  const sidebardata = [
    { name: "Followers", icon: addFriend, toogle: 2 },
    { name: "Following", icon: check, toogle: 3 },
    { name: "Blogs", icon: blogIcon, toogle: 1 },
  ];
  const { author } = userData;

  return (
    <div className="bg-Primary-background-color w-full min-h-screen  flex flex-col md:flex-row p-8 gap-4 dark:bg-Primary-text-color ">
      {/* uesr profile */}
      <UserComponent
        author={author}
        userBlogs={userBlogs ?? []}
        queryClient={queryClient}
        sidebardata={sidebardata}
      />
    </div>
  );
};

export default UserPage;
