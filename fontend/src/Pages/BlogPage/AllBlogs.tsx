import { getAllBlogs } from "@/utils/ApiFunction";
import { useQuery } from "@tanstack/react-query";
import sampleimage from "../../assets/gemini-image.png";
import { useNavigate } from "react-router-dom";

const AllBlogs = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["blogs"],
    queryFn: getAllBlogs,
  });
  const navigate = useNavigate();
  console.log(data);
  type BlogData = {
    _id: string;
    title: string;
    tags: string[];
    content: string;
    likes: number;
    likedBy: string[];
    author: {
      _id: string;
      name: string;
      email: string;
    };
  };
  if (isLoading) return <div>loading...</div>;
  if (error) return <div>error </div>;

  return (
    <div className=" w-full grid  sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4  gap-5 p-4">
      {data.map((bloagdata: BlogData) => (
        <div
          key={bloagdata._id}
          onClick={() => navigate(`/blogs/${bloagdata._id}`)}
          className="w-full h-fit p-2 rounded-2xl shadow-md shadow-green-950"
        >
          <div className="relative rounded-xl ">
            <img src={sampleimage} alt="" className="rounded-2xl" />
            <div className="bg-white/55 backdrop-blur-[5px] absolute bottom-0 rounded-xl py-2 px-2 w-full h-[35%] overflow-hidden">
              {" "}
              <h1 className="text-xl uppercase font-bold">{bloagdata.title}</h1>
              <div className="flex gap-2 text-lg font-semibold flex-wrap mb-8 ">
                {bloagdata.tags.map((tag) => (
                  <h2 className="bg-green-200 px-1 rounded-md">{tag}</h2>
                ))}
              </div>
              <p className="line-clamp-2">{bloagdata.content}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AllBlogs;
