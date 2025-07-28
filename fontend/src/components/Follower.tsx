import { checkUser, getUserFollowers } from "@/utils/ApiFunction";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "./ui/button";
import noProfile from "../assets/noProfile.png";
import { UserData } from "@/lib/types";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { handleFollowUser } from "@/lib/utilFunction";

const Follower = ({ userId }: { userId: string }) => {
  const queryClient = useQueryClient();
  const [loadingUserId, setLoadingUserId] = useState<string | null>(null);

  const {
    data,
    isLoading: isFollowersLoading,
    isError: isFollowersError,
  } = useQuery({
    queryKey: ["followers", userId],
    queryFn: () => getUserFollowers(userId),
  });

  // const {
  //   data: following,
  //   isLoading: isFollowingLoading,
  //   isError: isFollowingError,
  // } = useQuery({
  //   queryKey: ["following"],
  //   queryFn: () => getUserFollowing(userId),
  // });
  const { data: userdata } = useQuery({
    queryKey: ["user"],
    queryFn: checkUser,
  });
  const navigate = useNavigate();

  const handleFollow = async (id: string) => {
    try {
      setLoadingUserId(id);
      handleFollowUser(id, queryClient);
    } catch (error) {
      console.error("Error toggling follow/unfollow:", error);
    } finally {
      setLoadingUserId(null);
    }
  };
  const handelNavigation = (id: string) => {
    if (userdata.author._id === id) navigate("/user");
    else navigate(`/userPage/${id}`);
  };

  if (isFollowersLoading) {
    return <p>Loading...</p>;
  }

  if (isFollowersError) {
    return <p>Error loading data</p>;
  }
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold text-center">Followers </h1>
      {data?.message ? (
        <h1>{data.message}</h1>
      ) : (
        Array.isArray(data?.followers) &&
        data.followers.map((f: UserData) => (
          <div
            key={f._id}
            className="flex bg-Primary-text-color/15 px-2 py-2 rounded-full min-w-[300px] w-full gap-1 justify-between items-center"
          >
            {/* profile Pic */}
            <img
              src={f.profilePic || noProfile}
              alt="Profile pic"
              referrerPolicy="no-referrer"
              className="size-10 rounded-full cursor-pointer"
              onClick={() => handelNavigation(f._id)}
            />

            {/* name and email  */}
            <div
              className="flex flex-col cursor-pointer"
              onClick={() => handelNavigation(f._id)}
            >
              <h1 className="font-semibold capitalize">{f.name}</h1>
            </div>

            {/* follow/unfollow button */}
            <Button
              onClick={() => handleFollow(f._id)}
              className="text-sm rounded-full"
              disabled={userdata.author._id === f._id}
            >
              {loadingUserId === f._id
                ? "Loading..."
                : userdata?.author?.following?.includes(f._id)
                ? "Unfollow"
                : "Follow"}
            </Button>
          </div>
        ))
      )}
    </div>
  );
};

export default Follower;
