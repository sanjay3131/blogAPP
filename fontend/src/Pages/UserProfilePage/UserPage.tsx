import { useQuery, useQueryClient } from "@tanstack/react-query";
import { checkUser, getAllUserBlog } from "@/utils/ApiFunction";
import { motion } from "framer-motion";

import addFriend from "../../assets/add-friend.png";
import bell from "../../assets/bell.png";
import check from "../../assets/check.png";
import social from "../../assets/social.png";
import blogIcon from "../../assets/computer.png";
import Card from "@/components/Card";
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
    { name: "Followers", icon: addFriend },
    { name: "Following", icon: check },
    { name: "Blogs", icon: blogIcon },
  ];
  const { author } = userData;
  console.log(author);

  return (
    <div className="bg-Primary-background-color w-full min-h-screen  flex flex-col md:flex-row p-8 gap-4 ">
      {/* uesr profile */}
      <motion.div className="w-full flex flex-col  justify-baseline  items-center gap-5 relative">
        <div className=" w-full h-fit flex flex-col gap-4 justify-center items-center p-4">
          <img
            src={author.profilePic}
            alt="user profile pic"
            referrerPolicy="no-referrer"
            className=" size-24 rounded-full "
          />
          <h1 className="text-2xl font-bold uppercase">{author.name}</h1>
          {/* social links */}
          <div className="">
            <a href="">{author.socialLinks.facebook}</a>
            <a href="">{author.socialLinks.instagram}</a>
            <a href="">{author.socialLinks.twitter}</a>
          </div>
        </div>
        {/* side bar */}
        <div
          className="flex flex-row gap-2 justify-between items-center w-[90%] rounded-full
        md:gap-3 border-2 shadow-xl backdrop-blur-2xl bg-Primary-text-color/15 
      px-5 py-3 stic top-0 z-40  "
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
             md:text-md md:bottom-5 md:left-15 backdrop-blur-2xl"
              >
                <h3> {item.name}</h3>
              </motion.div>
            </motion.div>
          ))}
        </div>
        {/* user blogs */}
        <div className="w-full ">
          {userBlogs && userBlogs.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 container mx-auto  content-center">
              {userBlogs?.map((blogData: BlogData, index) => (
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
      </motion.div>
    </div>
  );
};

export default UserPage;
