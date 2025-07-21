//blog data types
export type BlogData = {
  _id: string;
  title: string;
  content: string;
  likes: number;
  likedBy: string[];
  author: {
    _id: string;
    name: string;
    email: string;
  };
  image: string;
  aiImage: string;
  tags: string[];
};

export type UserData = {
  _id: string;
  name: string;
  profilePic: string;
  email: string;
};

export type CommentData = {
  _id: string;
  content: string;
  user: UserData;
  text: string;
  profilePic: string;
  likes: number;
  likedBy: string[];
  createdAt: string;
  updatedAt: string;
};
