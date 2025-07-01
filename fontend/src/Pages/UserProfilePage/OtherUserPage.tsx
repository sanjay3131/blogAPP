import { getSingleUserDetails } from "@/utils/ApiFunction";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import addFriend from "../../assets/add-friend.png";
import check from "../../assets/check.png";
import blogIcon from "../../assets/computer.png";
import UserComponent from "@/components/UserComponent";

const OtherUserPage = () => {
  const params = useParams();
  const userId = params.id as string;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["userData", userId],
    queryFn: () => getSingleUserDetails(userId),
  });

  console.log(data);
  const sidebardata = [
    { name: "Followers", icon: addFriend, toogle: 2 },
    { name: "Following", icon: check, toogle: 3 },
    { name: "Blogs", icon: blogIcon, toogle: 1 },
  ];

  const queryClient = useQueryClient();

  if (isLoading)
    return (
      <div>
        <h1>Loading...</h1>
      </div>
    );
  if (isError)
    return (
      <div>
        <h1>Error...</h1>
      </div>
    );
  return (
    <div>
      <UserComponent
        author={data}
        userBlogs={data.blogPosts ?? []}
        queryClient={queryClient}
        sidebardata={sidebardata}
        mainUser={false}
      />
    </div>
  );
};

export default OtherUserPage;
