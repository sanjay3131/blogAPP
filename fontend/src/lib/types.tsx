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
  tags: string[];
};

export type UserData = {
  _id: string;
  name: string;
  profilePic: string;
  email: string;
};
