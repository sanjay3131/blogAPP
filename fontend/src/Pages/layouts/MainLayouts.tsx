import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Outlet } from "react-router-dom";

const MainLayouts = () => {
  return (
    <div className="flex flex-col min-h-screen w-full bg-Primary-background-color overflow-x-hidden">
      {/* Navbar */}
      <header className="w-full z-10">
        <Navbar />
      </header>

      {/* Main Content (grows and pushes footer down) */}
      <main className="flex-grow w-full pt-9 px-4">
        <Outlet />
      </main>

      {/* Footer always visible at the bottom */}
      <footer className="w-full">
        <Footer />
      </footer>
    </div>
  );
};

export default MainLayouts;
