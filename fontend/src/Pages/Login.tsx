import { Button } from "@/components/ui/button";
import { loginUser } from "@/utils/ApiFunction";
import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const redirect = useNavigate();
  const handelLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await loginUser(email, password);

      toast.success("Login successful!");
      redirect("/user");
    } catch (error) {
      console.log(error);

      toast.error("Login failed. Please check your credentials.");
    }
    setEmail("");
    setPassword("");
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col justify-center items-center overflow-hidden p-3 px-2.5  h-screen w-full gap-2 min-w-[256px] 
       "
    >
      <motion.h1
        initial={{ opacity: 0, x: -500 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ type: "spring", stiffness: 100, duration: 0.5 }}
        className="text-5xl font-semibold "
      >
        Login
      </motion.h1>
      {/* login form */}
      <motion.section
        initial={{ opacity: 1, x: 500 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ type: "spring", stiffness: 100, duration: 0.5 }}
        className="bg-Primary-background-color/15 backdrop-blur-2xl border-[1px] border-Primary-text-color/20  w-full 
        min-w[256px]  
         rounded-2xl md:w-1/2 md:h-fit flex flex-col items-center justify-center py-8
         shadow-lg shadow-Primary-text-color/40  max-w-[600px] 
          "
      >
        <form
          onSubmit={handelLogin}
          className="flex flex-col items-center justify-center w-full   min-w-[256px]  "
        >
          <div className="flex flex-col gap-4 p-4 w-4/5 min-w-[256px]">
            <label htmlFor="email" className="text-lg font-semibold">
              Email:
            </label>
            <input
              type="email"
              id="email"
              className="p-2 border border-gray-300 rounded w-full"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
            <label htmlFor="password" className="text-lg font-semibold">
              Password:
            </label>
            <input
              type="password"
              id="password"
              className="p-2 border border-gray-300 rounded"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />

            <Button type="submit">Login</Button>
          </div>
        </form>
        <a
          href="https://ai-blogapp.onrender.com/auth/google"
          className="w-full flex justify-center items-center px-4"
        >
          <Button className="w-4/5">Login with Google</Button>
        </a>
        <div>
          <Button className="mt-5 " onClick={() => redirect("/")}>
            Home Page
          </Button>
          <Button className="mt-5  ml-3" onClick={() => redirect("/register")}>
            SignUp Page
          </Button>
        </div>
      </motion.section>
    </motion.div>
  );
};

export default Login;
