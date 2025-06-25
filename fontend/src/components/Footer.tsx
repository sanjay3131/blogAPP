import { checkUser } from "@/utils/ApiFunction";
import { useQuery } from "@tanstack/react-query";
import { FaInstagram, FaTwitter, FaGithub } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  const { data: userData } = useQuery({
    queryKey: ["user"],
    queryFn: checkUser,
    retry: false,
  });

  return (
    <footer className="bg-Primary-text-color text-white py-8 px-4 mt-12">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        {/* Brand/Message */}
        <div className="text-center md:text-left">
          <h2 className="text-xl font-bold">BlogVerse</h2>
          <p className="text-sm text-gray-300 mt-1">
            Discover ideas. Share your voice. Inspire the world.
          </p>
        </div>

        {/* Navigation */}
        <div className="flex gap-6 text-sm">
          <Link to="/blogs" className="hover:underline">
            Explore
          </Link>
          <Link
            to={userData ? "/createblog" : "/login"}
            className="hover:underline"
          >
            Write
          </Link>
        </div>

        {/* Social Media */}
        <div className="flex gap-4 text-lg">
          <a
            href="https://github.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaGithub className="hover:text-Green-color" />
          </a>
          <a
            href="https://twitter.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaTwitter className="hover:text-Green-color" />
          </a>
          <a
            href="https://instagram.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaInstagram className="hover:text-Green-color" />
          </a>
        </div>
      </div>

      <div className="text-center text-xs text-gray-400 mt-6">
        © {new Date().getFullYear()} BlogVerse. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
