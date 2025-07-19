import {
  checkUser,
  getAllBlogs,
  getAllUsers,
  getSearchBlog,
  getSingleUserDetails,
  getUserByName,
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
import { FaAngleDoubleDown, FaAngleDoubleUp, FaSearch } from "react-icons/fa";
import LoadingPage from "../LoadingPage";
import ErrorPage from "../ErrorPage";

const AllBlogs = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [debounceQuery, setDebounceQuery] = useState("");
  const [sidebar, setSideBar] = useState(false);
  const [loadingUserId, setLoadingUserId] = useState<string | null>(null);
  const [AuthorBlog, setAuthorBlog] = useState("");
  const [searchUser, setSearchUser] = useState("");

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
    retry: false,
  });
  const { data: authorBlog } = useQuery({
    queryKey: ["otherUserData", AuthorBlog],
    queryFn: () => getSingleUserDetails(AuthorBlog),
  });

  const queryClient = useQueryClient();
  console.log(">>>>", authorBlog);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebounceQuery(searchQuery.trim());
    }, 1000);
    return () => clearTimeout(handler);
  }, [searchQuery]);
  const { data: searchBlogs = [], isLoading: searchingisLoading } = useQuery({
    queryKey: ["searchedBlogs", debounceQuery],
    queryFn: () => getSearchBlog(debounceQuery),
    enabled: debounceQuery.length > 0,
  });
  // search user query
  const { data: seachedUserResult } = useQuery({
    queryKey: ["searchedUser", searchUser],
    queryFn: () => getUserByName(searchUser),
  });
  console.log(seachedUserResult);

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
  const getAuthorBlogs = (id: string) => {
    setAuthorBlog(id);
    setSideBar(!sidebar);
  };

  if (isLoading) return <LoadingPage />;
  if (error) return <ErrorPage />;

  return (
    <div className="w-full flex flex-col gap-5">
      {/* blogs by categories */}
      <div className="w-full mt-4">
        <BlogByCategories showAll />
      </div>

      {/* toogle side bar  */}
      <div className="mt-2 relative flex flex-col gap-4 justify-center items-center">
        <Button
          className=" text-xl py-8 rounded-2xl bg-Green-color/85 hover:bg-Green-color text-black "
          onClick={() => setSideBar(!sidebar)}
        >
          Blog by Authors{" "}
          {!sidebar ? <FaAngleDoubleDown /> : <FaAngleDoubleUp />}
        </Button>

        {/* author and tags filter sidebar */}
        <motion.div
          className={` w-full   px-2 py-5 z-40 absolute  top-[120%] ${
            sidebar ? "translate-x-0" : "translate-x-[150%]"
          }  bg-Primary-text-color/15 backdrop-blur-[3px] transition-all duration-300 ease-in-out rounded-2xl 
          flex flex-col  gap-4 justify-around items-center`}
        >
          <div className="flex  justify-center items-center w-full gap-3">
            <input
              type="text"
              placeholder="search users "
              className="bg-white/85 w-fit py-2 rounded-2xl px-4 text-xl outline-none"
              value={searchUser}
              onChange={(e) => setSearchUser(e.target.value)}
            />
            <FaSearch />
          </div>
          <div>
            {!user ? (
              <h1 className="font-semibold text-xl">
                Login to view users <Button>Login</Button>
              </h1>
            ) : (
              ""
            )}
            {searchingisLoading && <h1>loading...</h1>}
            {Array.isArray(seachedUserResult?.data) || searchUser ? (
              seachedUserResult?.data?.length > 0 ? (
                <div>
                  {seachedUserResult?.data?.map(
                    (userData: UserData, index: number) => (
                      <motion.div
                        initial={{ opacity: 0, x: 100 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{
                          duration: index * 0.5,
                          type: "spring",
                        }}
                        key={index}
                        className="flex gap-4 mt-4 items-center justify-around  bg-white/85 px-1 py-2 rounded-full w-[300px] min-w-[300px] 
                "
                      >
                        <img
                          referrerPolicy="no-referrer"
                          className="size-12 rounded-full"
                          src={
                            userData.profilePic
                              ? userData.profilePic
                              : noAvathar
                          }
                          onClick={() => getAuthorBlogs(userData._id)}
                          alt=""
                        />
                        <h1
                          className="font-semibold capitalize"
                          onClick={() => getAuthorBlogs(userData._id)}
                        >
                          {userData.name}
                        </h1>
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
                                  : user?.author?.following?.includes(
                                      userData._id
                                    )
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
                    )
                  )}
                </div>
              ) : (
                <h1 className=" text-xl text-white font-semibold bg-black/5 p-2 rounded-2xl backdrop-blur-2xl">
                  {" "}
                  No user named{" "}
                  <span className="text-red-500 font-extrabold">
                    {searchUser}
                  </span>{" "}
                </h1>
              )
            ) : (
              <div className="flex flex-col gap-4 justify-start w-full items-center ">
                {AllUserData?.data.map((userData: UserData, index: number) => (
                  <motion.div
                    initial={{ opacity: 0, x: 100 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: index * 0.5,
                      type: "spring",
                    }}
                    key={index}
                    className="flex gap-4  items-center justify-around  bg-white/85 px-1 py-2 rounded-full w-[300px] min-w-[300px] 
                "
                  >
                    <img
                      referrerPolicy="no-referrer"
                      className="size-12 rounded-full"
                      src={
                        userData.profilePic ? userData.profilePic : noAvathar
                      }
                      alt=""
                      onClick={() => getAuthorBlogs(userData._id)}
                    />
                    <h1
                      className="font-semibold capitalize"
                      onClick={() => getAuthorBlogs(userData._id)}
                    >
                      {userData.name}
                    </h1>
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
            )}
          </div>
        </motion.div>
      </div>
      <div>
        {" "}
        {/* blog by author */}
        {authorBlog ? (
          <div>
            <h1 className="text-xl  mb-2">
              Blog of{" "}
              <span className="font-extrabold "> {authorBlog.name}</span>{" "}
            </h1>
            <div
              className=" w-full grid  sm:grid-cols-2 md:grid-cols-3  md:mx-auto gap-8 p-4 
    justify-center items-center pb-20 "
            >
              {authorBlog.blogPosts?.map(
                (bloagdata: BlogData, index: number) => (
                  <Card
                    key={bloagdata._id}
                    blogData={bloagdata}
                    index={index}
                    queryClient={queryClient}
                  />
                )
              )}
            </div>
          </div>
        ) : (
          ""
        )}
      </div>

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

      <div className="w-full  py-2  relative ">
        {/* blog card  */}
        <div>
          <h1 className="text-center text-2xl font-bold">All Blogs</h1>
          <div
            className=" w-full grid  sm:grid-cols-2 md:grid-cols-3  md:mx-auto gap-8 p-4 
    justify-center items-center pb-20 "
          >
            {/* searched blogs */}
            {searchingisLoading ? (
              <h1 className="text-center text-2xl font-bold">
                searching blogs
              </h1>
            ) : searchQuery && debounceQuery ? (
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
                !searchingisLoading && (
                  <h1 className="text-center text-2xl font-semibold w-full">
                    No blogs found for : {"   "}
                    <span className="font-extrabold text-red-600 ">
                      {searchQuery}
                    </span>
                  </h1>
                )
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
    </div>
  );
};

export default AllBlogs;
