import { NavLink, useNavigate } from "react-router-dom";
import { IoMdHome, IoMdClose } from "react-icons/io";
import { FaBlogger } from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";
import { useState } from "react";
import { checkUser, Logout } from "@/utils/ApiFunction";
import { Button } from "./ui/button";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import "../App.css";
import { toast } from "sonner";
import noProfile from "../assets/noProfile.png";

const Navbar = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const { data: userData } = useQuery({
    queryKey: ["user"],
    queryFn: checkUser,
    refetchOnWindowFocus: false, // Optimization
  });
  console.log(userData);

  const navdata = [
    { name: "Home", href: "/", icon: <IoMdHome /> },
    { name: "Blogs", href: "/blogs", icon: <FaBlogger /> },
    // { name: "User", href: "/user", icon: <FaUser /> },
  ];

  const handleLogout = async () => {
    try {
      const res = await Logout();
      if (res.status === 200) {
        queryClient.removeQueries({ queryKey: ["user"] }); // Fully clear user cache
        navigate("/");
        toast.success("User logged out");
        console.log("User logged out successfully.");
      }
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const handelSignUp = () => {
    navigate("/register");
  };

  return (
    <nav className="">
      {/* mobile navbar */}
      <div className="md:hidden w-full bg-Green-color text-Primary-text-color z-50 relative h-full">
        <div className="flex justify-between items-center px-4 py-2">
          <h1
            className="text-2xl font-bold  cursor-pointer"
            onClick={() => navigate("/")}
          >
            BlogVerse
          </h1>

          <button onClick={() => setOpen(!open)} className="text-3xl">
            {open ? <IoMdClose /> : <GiHamburgerMenu />}
          </button>
        </div>

        <div
          className={`absolute right-0 top-full w-56 bg-Green-color z-40 shadow-lg rounded-bl-xl transform transition-transform duration-300  ${
            open ? "translate-x-0" : "translate-x-[150%]"
          }`}
        >
          <div className="flex flex-col items-center justify-center gap-4 py-4 px-4 navbarleft">
            {navdata.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-2 text-lg font-semibold ${
                    isActive ? "text-white" : ""
                  }`
                }
              >
                {item.icon}
                {item.name}
              </NavLink>
            ))}
            {userData && (
              <NavLink
                to="/user"
                className={({ isActive }) =>
                  `flex items-center gap-2 text-lg font-semibold ${
                    isActive ? "text-white" : ""
                  }`
                }
              >
                <img
                  className="size-7 rounded-full"
                  src={
                    userData?.author.profilePic
                      ? userData.author.profilePic
                      : noProfile
                  }
                  alt=""
                />
                <h1>{userData?.author.name}</h1>
              </NavLink>
            )}
            {userData ? (
              <Button
                className="bg-Green-color shadow-Primary-text-color/50 shadow-sm text-Primary-text-color font-semibold text-lg  hover:text-Primary-background-color "
                onClick={handleLogout}
              >
                Logout
              </Button>
            ) : (
              <div className=" flex flex-col">
                <Button
                  className="bg-Green-color shadow-Primary-text-color/50 shadow-sm text-Primary-text-color font-semibold text-lg hover:text-Primary-background-color "
                  onClick={handleLogin}
                >
                  Login
                </Button>
                <Button
                  className="bg-Green-color mt-2 shadow-Primary-text-color/50 shadow-sm text-Primary-text-color font-semibold text-lg hover:text-Primary-background-color "
                  onClick={handelSignUp}
                >
                  SignUp
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* desktop navbar */}
      <div className="bg-Green-color w-full hidden md:block text-Primary-text-color ">
        <div className="p-2 flex justify-between w-full items-center">
          {/* logo */}
          <h1
            onClick={() => navigate("/")}
            className="text-2xl font-bold cursor-pointer"
          >
            BlogVerse
          </h1>
          <div className="flex justify-between items-center gap-8">
            {navdata.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-2 text-lg font-semibold  ${
                    isActive ? "text-white" : ""
                  }`
                }
              >
                {item.icon}
                {item.name}
              </NavLink>
            ))}
            {userData && (
              <NavLink
                to="/user"
                className={({ isActive }) =>
                  `flex items-center gap-2 text-lg font-semibold ${
                    isActive ? "text-white" : ""
                  }`
                }
              >
                <img
                  className="size-7 rounded-full"
                  src={userData?.author.profilePic}
                  alt=""
                />
                <h1>{userData?.author.name}</h1>
              </NavLink>
            )}
            {userData ? (
              <Button
                className="bg-Green-color shadow-Primary-text-color/50 shadow-sm  font-semibold text-lg text-Primary-text-color  hover:text-Primary-background-color "
                onClick={handleLogout}
              >
                Logout
              </Button>
            ) : (
              <div>
                <Button
                  className="bg-Green-color shadow-Primary-text-color/50 shadow-sm text-Primary-text-color font-semibold text-lg hover:text-Primary-background-color "
                  onClick={handleLogin}
                >
                  Login
                </Button>
                <Button
                  className="bg-Green-color ml-2 shadow-Primary-text-color/50 shadow-sm text-Primary-text-color font-semibold text-lg hover:text-Primary-background-color "
                  onClick={handelSignUp}
                >
                  SignUp
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
