import Navbar from "@/components/Navbar";
import { Outlet } from "react-router-dom";

const MainLayouts = () => {
  return (
    <div className="w-full min-h-screen flex flex-col relative bg-Primary-background-color overflow-x-hidden min-w-[256px]">
      <div className="w-full z-10">
        <Navbar />
      </div>
      <div className="flex-1 pt-20 min-w-[256px]">
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayouts;
