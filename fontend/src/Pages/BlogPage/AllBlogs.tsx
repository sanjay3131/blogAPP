import { getAllBlogs } from "@/utils/ApiFunction";
import { useQuery } from "@tanstack/react-query";
import sampleimage from "../../assets/gemini-image.png";
import { useNavigate } from "react-router-dom";
import { motion, spring } from "framer-motion";
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
    image: string;
    imagePublicId: string;
    author: {
      _id: string;
      name: string;
      email: string;
    };
  };

  if (isLoading) return <div>loading...</div>;
  if (error) return <div>error </div>;

  return (
    <div className=" w-full grid  sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4  gap-8 p-4 justify-center items-center pb-20 ">
      {data.map((bloagdata: BlogData, index: number) => (
        <motion.div
          initial={{ opacity: 0, x: index % 2 == 0 ? -100 : 100 }}
          animate={{ opacity: 0.5 }}
          exit={{ opacity: 0, x: 100 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, type: spring }}
          key={bloagdata._id}
          onClick={() => navigate(`/blogs/${bloagdata._id}`)}
          className="w-[20rem] sm:w-[19rem] md:w-[16rem] h-full p-2 rounded-2xl shadow-md shadow-green-950/50 relative cursor-pointer overflow-hidden group"
        >
          <div className="rounded-xl h-full  flex flex-col justify-between items-center ">
            <div className="w-fit overflow-hidden rounded-2xl">
              <motion.img
                src={bloagdata.image ? bloagdata.image : sampleimage}
                alt=""
                className="rounded-2xl transition-transform duration-300 group-hover:scale-105 w-full"
              />
            </div>
            <div className="bg-Primary-button-color/55 group-hover:bg-Primary-text-color/10 transition-all duration-300 ease-in-out backdrop-blur-[5px] mt-2  rounded-xl py-2 px-2 w-full h-fit overflow-hidden">
              <h1 className="text-xl uppercase font-bold">{bloagdata.title}</h1>
              <div className="flex gap-2 text-lg font-semibold flex-wrap mb-8 ">
                {bloagdata.tags.map((tag) => (
                  <h2
                    key={tag}
                    className="bg-green-400/50 py-1 px-2 rounded-md"
                  >
                    {tag}
                  </h2>
                ))}
              </div>
              <p className="line-clamp-2">{bloagdata.content}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default AllBlogs;
