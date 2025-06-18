import { useQuery } from "@tanstack/react-query";
import { checkUser, getAllUserBlog } from "@/utils/ApiFunction";
import { motion } from "framer-motion";

import addFriend from "../../assets/add-friend.png";
import bell from "../../assets/bell.png";
import check from "../../assets/check.png";
import social from "../../assets/social.png";
import blogIcon from "../../assets/computer.png";

type Blog = {
  _id: string;
  title: string;
  content: string;
  image: string;
  userId: string;
};

const UserPage = () => {
  const { data, isLoading, error } = useQuery<Blog[]>({
    queryKey: ["blogs"],
    queryFn: getAllUserBlog,
  });
  const { data: userData } = useQuery({
    queryKey: ["user"],
    queryFn: checkUser,
  });
  console.log("userData", userData, data);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {(error as Error).message}</div>;
  const sidebardata = [
    { name: "Notification", icon: bell },
    {
      name: "Update_Profile",
      icon: social,
    },
    { name: "Followers", icon: addFriend },
    { name: "Following", icon: check },
    { name: "Blogs", icon: blogIcon },
  ];

  return (
    <div className="bg-Primary-background-color w-full min-h-screen  flex flex-col md:flex-row p-8 gap-4">
      {/* side bar */}
      <div
        className="flex flex-row gap-2 justify-between items-center w-full rounded-full
      md:flex-col md:w-fit  md:gap-3 md:h-[400px] border-2 backdrop-blur-2xl bg-Primary-text-color/15 
      px-5 py-3 "
      >
        {sidebardata.map((item) => (
          <motion.div
            key={item.name}
            className="relative group w-full h-full  flex justify-center items-center"
            whileHover={{ scale: 1.5 }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3, type: "spring" }}
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
              className="absolute  -bottom-10 z-10 hidden group-hover:block 
             bg-black/15 font-semibold text-xs rounded px-2 py-1 
             w-fit
             md:text-md"
            >
              <h3> {item.name}</h3>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default UserPage;
