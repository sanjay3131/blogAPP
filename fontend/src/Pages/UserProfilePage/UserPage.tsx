import { useQuery, useQueryClient } from "@tanstack/react-query";
import { checkUser, getAllUserBlog } from "@/utils/ApiFunction";

import addFriend from "../../assets/add-friend.png";
import bell from "../../assets/bell.png";
import check from "../../assets/check.png";
import social from "../../assets/social.png";
import blogIcon from "../../assets/computer.png";

import UserComponent from "@/components/UserComponent";
import { BlogData } from "@/lib/types";

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

  console.log("userData", userData, userBlogs);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {(error as Error).message}</div>;
  // const []=useState([])
  const sidebardata = [
    { name: "Notification", icon: bell },
    {
      name: "Update_Profile",
      icon: social,
    },
    { name: "Followers", icon: addFriend, toogle: 2 },
    { name: "Following", icon: check, toogle: 3 },
    { name: "Blogs", icon: blogIcon, toogle: 1 },
  ];
  const { author } = userData;

  return (
    <div className="bg-Primary-background-color w-full min-h-screen  flex flex-col md:flex-row p-8 gap-4 ">
      {/* uesr profile */}
      <UserComponent
        author={author}
        userBlogs={userBlogs ?? []}
        queryClient={queryClient}
        sidebardata={sidebardata}
        mainUser={true}
      />
    </div>
  );
};

export default UserPage;
