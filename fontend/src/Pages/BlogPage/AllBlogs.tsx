import { getAllBlogs, getSearchBlog } from "@/utils/ApiFunction";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { IoSearch } from "react-icons/io5";

import { BlogData } from "@/lib/types";
import Card from "@/components/Card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
const AllBlogs = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["blogs"],
    queryFn: getAllBlogs,
  });
  const queryClient = useQueryClient();
  console.log(data);

  const [searchQuery, setSearchQuery] = useState("");
  const [debounceQuery, setDebounceQuery] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebounceQuery(searchQuery);
    }, 1000);
    return () => clearTimeout(handler);
  }, [searchQuery]);
  const { data: searchBlogs = [], isLoading: searchingisLoading } = useQuery({
    queryKey: ["searchedBlogs", debounceQuery],
    queryFn: () => getSearchBlog(debounceQuery),
    enabled: debounceQuery.length >= 2,
  });
  console.log(searchBlogs, !searchQuery, debounceQuery);

  if (isLoading) return <div>loading...</div>;
  if (error) return <div>error </div>;

  return (
    <div className="w-full ">
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
      <div
        className=" w-full grid  sm:grid-cols-2 md:grid-cols-3 container mx-auto gap-8 p-4 
    justify-center items-center pb-20 "
      >
        {/* searched blogs */}
        {searchingisLoading ? (
          <h1>searching blogs</h1>
        ) : searchQuery ? (
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
            <h1>No blogs found for "{searchQuery}"</h1>
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
  );
};

export default AllBlogs;
