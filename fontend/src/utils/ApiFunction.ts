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

export {
  getAllBlogs,
  checkUser,
  loginUser,
  googleLogin,
  toogleLike,
  getSingleblog,
  Logout,
  postBlog,
};
