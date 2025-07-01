import { UserData } from "@/lib/types";

interface OtherUserFollowersProps {
  followers: UserData[];
}

const OtherUserFollowers = ({ followers }: OtherUserFollowersProps) => {
  console.log(">>", followers);

  return (
    <div>
      {followers.map((user, idx) => (
        <h1 key={idx}>{user.name}</h1>
      ))}
    </div>
  );
};

export default OtherUserFollowers;
