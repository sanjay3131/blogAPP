import { motion } from "framer-motion";
// import addFriend from "../assets/add-friend.png";
// import bell from "../assets/bell.png";
// import check from "../assets/check.png";
// import social from "../assets/social.png";
// import blogIcon from "../assets/computer.png";
import Card from "@/components/Card";
import {
  FaFacebookSquare,
  FaInstagramSquare,
  FaUserEdit,
} from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import { BlogData, UserData } from "@/lib/types";
import { useState } from "react";
import Follower from "./Follower";
import Following from "./Following";
import noProfile from "../assets/noProfile.png";
import { useQuery } from "@tanstack/react-query";
import { checkUser } from "@/utils/ApiFunction";
import { Button } from "./ui/button";
interface UserComponentProps {
  author: {
    profilePic: string;
    name: string;
    socialLinks?: {
      facebook?: string;
      instagram?: string;
      twitter?: string;
    };
    bio: string;
    website: string;
    followers: UserData[];
    _id: string;
  };
  userBlogs: BlogData[];
  queryClient: {
    invalidateQueries: (options: { queryKey: unknown[] }) => Promise<unknown>;
  };
  sidebardata: {
    name: string;
    icon: string;
    toogle?: number;
  }[];
}

const UserComponent = ({
  author,
  userBlogs,
  queryClient,
  sidebardata,
}: UserComponentProps) => {
  const [toogleBlock, setToogleBlock] = useState(1);

  const { data: userData } = useQuery({
    queryKey: ["user"],
    queryFn: checkUser,
    retry: false,
  });

  return (
    <motion.div className="w-full flex flex-col  justify-baseline  items-center gap-5 relative">
      <div className=" w-full h-fit flex flex-col gap-4 justify-center items-center p-4  relative">
        <img
          src={author.profilePic ? author.profilePic : noProfile}
          alt="user profile pic"
          referrerPolicy="no-referrer"
          className=" size-24 rounded-full "
        />
        {/* name */}
        <h1 className="text-2xl font-bold uppercase">{author.name}</h1>

        {/* bio */}
        {author.bio && <p>{author?.bio}</p>}

        {/* website */}
        {author.website && <a>{author.website}</a>}
        {/* social links */}
        <div className=" flex  w-fit justify-center items-center gap-3 px-9 text-2xl ">
          <a href={author.socialLinks?.facebook}>
            <FaFacebookSquare />
          </a>
          <a href={author.socialLinks?.instagram}>
            <FaInstagramSquare />{" "}
          </a>
          <a href={author.socialLinks?.twitter}>
            <FaSquareXTwitter />
          </a>
        </div>
        {userData.author._id === author._id && (
          <div className="absolute top-[50%] right-[20%]">
            <Button>
              Edit Profile <FaUserEdit />
            </Button>
          </div>
        )}
      </div>
      {/* tool bar */}

      <motion.div
        initial={{ opacity: 1, x: 100 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.32, type: "spring" }}
        className="flex flex-row gap-2 justify-between items-center  rounded-full
        md:gap-3 border-2 shadow-xl backdrop-blur-2xl bg-Primary-text-color/15 
      px-5 py-3 sticky top-0 z-40  mb-5 min-w-[300px] w-full "
      >
        {sidebardata?.map((item) => (
          <motion.div
            key={item.name}
            className="relative group w-full h-full  flex justify-center items-center"
            whileHover={{ scale: 1.5 }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3, type: "spring" }}
            onClick={() => {
              if (item.toogle) setToogleBlock(item.toogle);
            }}
          >
            <img
              src={item.icon}
              alt={item.name}
              className="size-8 cursor-pointer  p-1  "
            />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5, type: "spring" }}
              className="absolute  -bottom-8 z-10 hidden group-hover:block 
             bg-black/15 font-semibold text-xs rounded px-2 py-1 
             w-fit
             md:text-md  md:left-15 backdrop-blur-2xl"
            >
              <h3> {item.name}</h3>
            </motion.div>
          </motion.div>
        ))}
      </motion.div>
      {/* wrapper */}
      <motion.div>
        {/* user blogs */}
        {toogleBlock == 1 ? (
          <div className="w-full ">
            {userBlogs && userBlogs.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:container md:mx-auto justify-items-center sm:justify-items-normal ">
                {userBlogs?.map((blogData: BlogData, index: number) => (
                  <Card
                    key={blogData._id}
                    blogData={blogData}
                    index={index}
                    queryClient={queryClient}
                  />
                ))}
              </div>
            ) : (
              <h1>No Blogs Posted</h1>
            )}
          </div>
        ) : (
          ""
        )}
        {/* Follower */}
        {toogleBlock == 2 && (
          <motion.div
            initial={{ x: 500 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.5, type: "spring" }}
            exit={{ x: -1000, opacity: 0 }}
          >
            {/* {mainUser ? (
              <Follower userId={author._id} />
            ) : (
              <OtherUserFollowers followers={author.followers} />
            )} */}
            <Follower userId={author._id} />
          </motion.div>
        )}

        {/* Following */}
        {toogleBlock == 3 && (
          <motion.div
            initial={{ x: 500 }}
            animate={{ x: 0 }}
            exit={{ x: -1000, opacity: 0 }}
            transition={{ duration: 0.5, type: "spring" }}
          >
            <Following userId={author._id} />
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default UserComponent;
