import Navbar from "@/components/Navbar";
import { Outlet } from "react-router-dom";

const MainLayouts = () => {
  return (
    <div className="w-full min-h-screen flex flex-col justify-between  bg-Primary-background-color overflow-x-hidden min-w-[256px] relative">
      <div className="w-full z-10">
        <Navbar />
      </div>
      <div className="flex-1 pt-9 min-w-[256px] h-full ">
        <Outlet />
      </div>
      <div className="absolute bottom-0 w-full bg-yellow-300">Footer</div>
    </div>
  );
};

export default MainLayouts;
