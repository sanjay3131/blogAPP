import { getUserFollowing } from "@/utils/ApiFunction";
import { useQuery } from "@tanstack/react-query";

const Following = () => {
  const { data } = useQuery({
    queryKey: ["following"],
    queryFn: getUserFollowing,
  });
  console.log(data);

  return (
    <div>
      Following
      {data?.following?.map((f) => (
        <h1>{f.name}</h1>
      ))}
    </div>
  );
};

export default Following;
