import { UserData } from "@/lib/types";
import noProfile from "../assets/noProfile.png";
import { Button } from "./ui/button";

interface OtherUserFollowersProps {
  followers: UserData[];
}

const OtherUserFollowers = ({ followers }: OtherUserFollowersProps) => {
  console.log(">>", followers);

  return (
    <div>
      {followers.map((user, idx) => (
        <div key={idx} className="flex justify-center items-center gap-2">
          <img
            src={user.profilePic ? user.profilePic : noProfile}
            alt="profile pic"
            className="size-24"
          />
          <div className="flex  flex-col">
            <h1>{user.name}</h1>
            <h1>{user.email}</h1>
          </div>
          <Button>follow</Button>
        </div>
      ))}
    </div>
  );
};

export default OtherUserFollowers;
