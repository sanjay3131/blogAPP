import { axiosInstance } from "@/axios/axiosInstance";

// authenticate function
// check if the user is authenticated
const checkUser = async () => {
  const response = await axiosInstance.get("/auth/checkUser", {
    withCredentials: true,
  });
  
  
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

//SignUp function
const SignUp = async (email: string, password: string, name: string) => {
  const response = await axiosInstance.post("/auth/register", {
    name,
    email,
    password,
  });
  return response;
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
const getUserFollowers = async (userId: string) => {
  const response = await axiosInstance.post(`/blogs/user/followers`, {
    userId,
  });
  return response.data;
};

//get user following
const getUserFollowing = async (userId: string) => {
  const response = await axiosInstance.post("/blogs/user/following", {
    userId,
  });
  return response.data;
};

//toogle follow and unfollow a user
const toogleFollowAndUnfollow = async (id: string) => {
  const response = await axiosInstance.post(`/blogs/follow/${id}`);
  return response.data;
};

//get single user details
const getSingleUserDetails = async (id: string) => {
  const response = await axiosInstance.get(`/blogs/user/${id}`);
  return response.data;
};

//search blogs by title
const getSearchBlog = async (Query: string) => {
  const response = await axiosInstance.get(`/blogs/searchBlog?query=${Query}`);
  return response.data;
};
//get all users
const getAllUsers = async () => {
  const response = await axiosInstance.get("/blogs/getAllUsers");
  return response;
};

// get user by name
const getUserByName = async (query: string) => {
  const response = await axiosInstance.get(
    `/blogs/getUserByName?query=${query}`
  );
  return response;
};

//update user profile
const updateUserProfile = async (formData: FormData) => {
  const response = await axiosInstance.post(
    "/auth/updateUserDetails",
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
  return response.data;
};
// delete a blog by id
const deleteSingleBlog = async (id: string) => {
  const response = await axiosInstance.delete(`/blogs/delete/${id}`);
  return response.data;
};

//edit a blog by id
const editBlogById = async (id: string, formData: FormData) => {
  const response = await axiosInstance.put(`/blogs/update/${id}`, formData);
  return response.data;
};

const aiContent = async (prompt: string) => {
  console.log(prompt);

  const response = await axiosInstance.post("/blogs/aiContent", { prompt });
  return response.data;
};

// ai image prompt  generation
const aiImagePromtGenerate = async (prompt: string) => {
  const response = await axiosInstance.post("/blogs/aiImagePromot", { prompt });
  return response.data;
};

// ai image generation
const aiImageGenaration = async (contents: string) => {
  const response = await axiosInstance.post("/blogs/image/generation", {
    contents,
  });
  return response.data;
};

//post a comment
const postComment = async (blogId: string, comment: string) => {
  const response = await axiosInstance.post(`/blogs/postComment/${blogId}`, {
    comment,
  });
  return response.data;
};

//edit a comment
const editComment = async (
  blogId: string,
  commentId: string,
  newComment: string
) => {
  const response = await axiosInstance.put(`/blogs/editComment/${blogId}`, {
    newComment,
    commentId,
  });
  return response.data;
};

//delete a comment
const deleteComment = async (blogId: string, commentId: string) => {
  const response = await axiosInstance.delete(
    `/blogs/deleteComment/${blogId}`,
    {
      data: { commentId },
    }
  );
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
  getSingleUserDetails,
  getSearchBlog,
  getAllUsers,
  getUserByName,
  SignUp,
  updateUserProfile,
  deleteSingleBlog,
  editBlogById,
  aiContent,
  aiImagePromtGenerate,
  aiImageGenaration,
  postComment,
  editComment,
  deleteComment,
};
