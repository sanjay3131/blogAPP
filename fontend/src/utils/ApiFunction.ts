import { axiosInstance } from "@/axios/axiosInstance";

// authenticate function
// check if the user is authenticated
const checkUser = async () => {
  const response = await axiosInstance.get("/auth/checkUser");
  return response.data;
};
//Login function
const loginUser = async (email: string, password: string) => {
  const response = await axiosInstance.post("/auth/login", {
    email,
    password,
  });
  return response.data;
};
//Logout
const Logout = async () => {
  const response = await axiosInstance.get("auth/logout");
  return response;
};
//google login function

const googleLogin = async (credential: string) => {
  const response = await axiosInstance.post("/auth/google", {
    credential,
  });
  return response.data;
};
// get all blogs
const getAllBlogs = async () => {
  const response = await axiosInstance.get("/blogs");
  return response.data;
};
//post a blog

const postBlog = async (formdata: FormData) => {
  const response = await axiosInstance.post("/blogs/create", formdata, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  console.log(response);

  return response.data;
};

//like and unlike a blog
const toogleLike = async (blogId: string) => {
  const response = await axiosInstance.post(`/blogs/like/${blogId}`);
  return response.data;
};
//get single blog by id
const getSingleblog = async (blogId: string) => {
  const response = await axiosInstance.get(`blogs/${blogId}`);
  return response.data;
};
//  get all usersblog
const getAllUserBlog = async () => {
  const response = await axiosInstance.get("blogs/user/blogs");
  return response.data;
};
// delete all user blogs
const deleteBlogsOfUser = async () => {
  const response = await axiosInstance.delete("/blogs/delete");
  return response.data;
};
//get blogs by tags
const getBlogsByTags = async (tags: string[]) => {
  const response = await axiosInstance.post("/blogs/selectedTags", { tags });

  return response.data;
};
//get user followers
const getUserFollowers = async () => {
  const response = await axiosInstance.get("/blogs/user/followers");
  return response.data;
};

//get user following
const getUserFollowing = async () => {
  const response = await axiosInstance.get("/blogs/user/following");
  return response.data;
};

//toogle follow and unfollow a user
const toogleFollowAndUnfollow = async (id: string) => {
  const response = await axiosInstance.post(`/blogs/follow/${id}`);
  return response.data;
};
export {
  getAllBlogs,
  checkUser,
  loginUser,
  googleLogin,
  toogleLike,
  getSingleblog,
  Logout,
  postBlog,
  getAllUserBlog,
  getBlogsByTags,
  deleteBlogsOfUser,
  getUserFollowing,
  getUserFollowers,
  toogleFollowAndUnfollow,
};
