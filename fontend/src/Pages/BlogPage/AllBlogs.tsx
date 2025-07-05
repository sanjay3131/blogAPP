import {
  checkUser,
  getAllBlogs,
  getAllUsers,
  getSearchBlog,
} from "@/utils/ApiFunction";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { IoSearch } from "react-icons/io5";
import { motion } from "framer-motion";
import noAvathar from "../../assets/noProfile.png";

import { BlogData, UserData } from "@/lib/types";
import Card from "@/components/Card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { handleFollowUser } from "@/lib/utilFunction";
import BlogByCategories from "@/components/BlogByCategories";
const AllBlogs = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["blogs"],
    queryFn: getAllBlogs,
  });

  const { data: AllUserData } = useQuery({
    queryKey: ["allUserData"],
    queryFn: getAllUsers,
  });
  console.log("=>>>>>", AllUserData);
  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: checkUser,
  });

  const queryClient = useQueryClient();
  console.log(data);

  const [searchQuery, setSearchQuery] = useState("");
  const [debounceQuery, setDebounceQuery] = useState("");
  const [sidebar, setSideBar] = useState(false);
  const [loadingUserId, setLoadingUserId] = useState<string | null>(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebounceQuery(searchQuery);
    }, 1000);
    return () => clearTimeout(handler);
  }, [searchQuery]);
  const { data: searchBlogs = [], isLoading: searchingisLoading } = useQuery({
    queryKey: ["searchedBlogs", debounceQuery],
    queryFn: () => getSearchBlog(debounceQuery),
    enabled: debounceQuery.length >= 2,
  });
  console.log(searchBlogs, !searchQuery, debounceQuery, user);
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

  if (isLoading) return <div>loading...</div>;
  if (error) return <div>error </div>;

  return (
    <div className="w-full ">
      {/* search bar  */}
      <div className=" w-full md:px-24 flex justify-center items-center bg-Primary-button-color/15 ">
        <input
          type="text"
          id="searchBar"
          onChange={(e) => setSearchQuery(e.target.value)}
          value={searchQuery}
          placeholder="Search"
          className="bg-Primary-text-color/15 mr-4 rounded-2xl py-2 w-full  px-5 text-xl focus:shadow-md outline-0 focus:shadow-Primary-text-color/25"
        />
        <Button>
          <IoSearch />
        </Button>
      </div>
      {/* blogs by categories */}
      <BlogByCategories showAll />
      {/* toogle side bar  */}
      <button className="bg-red-400" onClick={() => setSideBar(!sidebar)}>
        sidebar
      </button>
      <div className="w-full flex gap-2 py-2  relative ">
        {/* author and tags filter sidebar */}

        <motion.div
          className={` w-full  px-2 py-5 z-40 absolute top-5 ${
            sidebar ? "translate-x-0" : "translate-x-[150%]"
          }  bg-Primary-text-color/15 backdrop-blur-[3px] transition-all duration-300 ease-in-out rounded-2xl`}
        >
          <div className="flex flex-col gap-4 items-center">
            {AllUserData?.data.map((userData: UserData, index: number) => (
              <motion.div
                initial={{ opacity: 0, x: 100 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: index * 0.5, type: "spring" }}
                key={index}
                className="flex gap-4  items-center justify-around  bg-white/85 px-1 py-2 rounded-full w-[300px] min-w-[300px] 
                "
              >
                <img
                  referrerPolicy="no-referrer"
                  className="size-12 rounded-full"
                  src={userData.profilePic ? userData.profilePic : noAvathar}
                  alt=""
                />
                <h1 className="font-semibold capitalize">{userData.name}</h1>
                {/* follow and unfollow button */}
                {user ? (
                  <div>
                    {user.author ? (
                      <Button
                        className=""
                        onClick={() => handleFollow(userData._id)}
                      >
                        {loadingUserId === userData._id
                          ? "Loading..."
                          : user?.author?.following?.includes(userData._id)
                          ? "Unfollow"
                          : "Follow"}
                      </Button>
                    ) : (
                      ""
                    )}
                  </div>
                ) : (
                  ""
                )}
                {}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* blog card  */}
        <div
          className=" w-full grid  sm:grid-cols-2 md:grid-cols-3 container mx-auto gap-8 p-4 
    justify-center items-center pb-20 "
        >
          {/* searched blogs */}
          {searchingisLoading ? (
            <h1 className="text-center text-2xl font-bold">searching blogs</h1>
          ) : searchQuery ? (
            searchBlogs.length > 0 ? (
              searchBlogs.map((bloagdata: BlogData, index: number) => (
                <Card
                  key={bloagdata._id}
                  blogData={bloagdata}
                  index={index}
                  queryClient={queryClient}
                />
              ))
            ) : (
              <h1 className="text-center text-2xl font-semibold w-full">
                No blogs found for{" "}
                <span className="font-extrabold text-red-600 ">
                  {searchQuery}
                </span>
              </h1>
            )
          ) : (
            data.map((bloagdata: BlogData, index: number) => (
              <Card
                key={bloagdata._id}
                blogData={bloagdata}
                index={index}
                queryClient={queryClient}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AllBlogs;
