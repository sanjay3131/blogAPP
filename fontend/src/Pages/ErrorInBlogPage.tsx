import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const ErrorInBlogPage = () => {
  const navigate = useNavigate();
  return (
    <div className=" flex justify-center items-center w-full h-full ">
      <div className=" flex justify-center items-center flex-col gap-8">
        <h1 className="text-6xl md:text-7xl capitalize font-bold">
          no blog found
        </h1>
        <Button
          className="text-xl
         p-5 capitalize"
          onClick={() => navigate("/blogs")}
        >
          back to blogs page
        </Button>
      </div>
    </div>
  );
};

export default ErrorInBlogPage;
