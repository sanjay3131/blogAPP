import { UserData } from "@/lib/types";
import {
  checkUser,
  getUserFollowing,
  toogleFollowAndUnfollow,
} from "@/utils/ApiFunction";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import noProfile from "../assets/noProfile.png";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

const Following = ({ userId }: { userId: string }) => {
  const { data } = useQuery({
    queryKey: ["following"],
    queryFn: () => getUserFollowing(userId),
  });
  console.log(data);
  const { data: userdata } = useQuery({
    queryKey: ["user"],
    queryFn: checkUser,
  });
  const queryClient = useQueryClient();

  const handelUnfollow = async (id: string) => {
    const respose = await toogleFollowAndUnfollow(id);
    console.log(respose);
    await queryClient.invalidateQueries({ queryKey: ["following"] });
  };
  const navigate = useNavigate();
  return (
    <div className="flex flex-col gap-2">
      {data?.message ? (
        <h1>you are not following any user</h1>
      ) : (
        data?.following?.map((f: UserData) => (
          <div
            key={f._id}
            className="flex bg-Primary-text-color/15 px-2 py-2 rounded-full min-w-[300px] w-full  gap-1 justify-between items-center  "
          >
            {/* profile Pic */}
            <img
              src={f.profilePic ? f.profilePic : noProfile}
              alt="Profile pic"
              referrerPolicy="no-referrer"
              className="size-10 rounded-full cursor-pointer"
              onClick={() => navigate(`/userPage/${f._id}`)}
            />

            {/* name and email  */}
            <div
              className="flex flex-col cursor-pointer  "
              onClick={() => navigate(`/userPage/${f._id}`)}
            >
              <h1 className="font-semibold block  capitalize">{f.name}</h1>
              {/* <h1 className="text-gray-500 text-sm">{f.email}</h1> */}
            </div>

            {/* follow and unfollowing */}
            {}
            <Button
              onClick={() => handelUnfollow(f._id)}
              className="text-sm rounded-full"
            >
              {userdata?.author?.following?.includes(f._id)
                ? "Unfollow"
                : "Follow"}
            </Button>
          </div>
        ))
      )}
    </div>
  );
};

export default Following;
