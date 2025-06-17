import { useQuery } from "@tanstack/react-query";
import { checkUser, getAllUserBlog } from "@/utils/ApiFunction";

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

  return (
    <div className="bg-Primary-background-color w-full h-screen">
      {data?.map((item) => (
        <div key={item._id}>
          <h1>{item.title}</h1>
          <p>{item.content}</p>
          <h1>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</h1>
          hello
        </div>
      ))}
    </div>
  );
};

export default UserPage;
