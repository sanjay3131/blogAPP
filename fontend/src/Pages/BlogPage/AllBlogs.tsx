import { getAllBlogs } from "@/utils/ApiFunction";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { BlogData } from "@/lib/types";
import Card from "@/components/Card";
const AllBlogs = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["blogs"],
    queryFn: getAllBlogs,
  });
  const queryClient = useQueryClient();
  console.log(data);

  if (isLoading) return <div>loading...</div>;
  if (error) return <div>error </div>;

  return (
    <div
      className=" w-full grid  sm:grid-cols-2 md:grid-cols-3 container mx-auto gap-8 p-4 
    justify-center items-center pb-20 "
    >
      {data.map((bloagdata: BlogData, index: number) => (
        <Card
          key={bloagdata._id}
          blogData={bloagdata}
          index={index}
          queryClient={queryClient}
        />
      ))}
    </div>
  );
};

export default AllBlogs;
