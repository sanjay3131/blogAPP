import {
  checkUser,
  getUserFollowers,
  getUserFollowing,
  toogleFollowAndUnfollow,
} from "@/utils/ApiFunction";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "./ui/button";
import noProfile from "../assets/noProfile.png";
import { UserData } from "@/lib/types";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

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

  const {
    data: following,
    isLoading: isFollowingLoading,
    isError: isFollowingError,
  } = useQuery({
    queryKey: ["following"],
    queryFn: () => getUserFollowing(userId),
  });
  const { data: userdata } = useQuery({
    queryKey: ["user"],
    queryFn: checkUser,
  });
  console.log("user following ", following, userdata.author.following);
  const navigate = useNavigate();

  const handleFollow = async (id: string) => {
    try {
      setLoadingUserId(id);
      await toogleFollowAndUnfollow(id);
      await queryClient.invalidateQueries({
        queryKey: ["followers"],
        exact: true,
      });
      await queryClient.invalidateQueries({
        queryKey: ["following"],
        exact: true,
      });
      await queryClient.invalidateQueries({
        queryKey: ["user"],
        exact: true,
      });
    } catch (error) {
      console.error("Error toggling follow/unfollow:", error);
    } finally {
      setLoadingUserId(null);
    }
  };

  if (isFollowersLoading || isFollowingLoading) {
    return <p>Loading...</p>;
  }

  if (isFollowersError || isFollowingError) {
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
              onClick={() => navigate(`/userPage/${f._id}`)}
            />

            {/* name and email  */}
            <div
              className="flex flex-col cursor-pointer"
              onClick={() => navigate(`/userPage/${f._id}`)}
            >
              <h1 className="font-semibold capitalize">{f.name}</h1>
            </div>

            {/* follow/unfollow button */}
            <Button
              onClick={() => handleFollow(f._id)}
              className="text-sm rounded-full"
              disabled={loadingUserId === f._id}
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
