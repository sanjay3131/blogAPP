import { UserData } from "@/lib/types";
import noProfile from "../assets/noProfile.png";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

interface OtherUserFollowersProps {
  followers: UserData[];
}

const OtherUserFollowers = ({ followers }: OtherUserFollowersProps) => {
  console.log(">>", followers);
  const navigate = useNavigate();

  return (
    <div>
      {followers.map((user, idx) => (
        <div key={idx} className="flex justify-center items-center gap-2">
          <img
            src={user.profilePic ? user.profilePic : noProfile}
            alt="profile pic"
            referrerPolicy="no-referrer"
            className="size-10 rounded-full cursor-pointer"
            onClick={() => navigate(`/userPage/${user._id}`)}
          />
          <div className="flex  flex-col">
            <h1>{user.name}</h1>
            <h1>{user.email}</h1>
          </div>
          <Button>follow </Button>
        </div>
      ))}
    </div>
  );
};

export default OtherUserFollowers;
