import { useNavigate } from "react-router-dom";

const ErrorPage = () => {
  const navigate = useNavigate();
  return (
    <div className="w-full h-screen bg-Primary-text-color">
      <div className="w-full h-full flex justify-center items-center relative  flex-col">
        <div className=" relative flex flex-col gap-5 items-center">
          <h1 className="text-8xl font-extrabold text-Primary-background-color/35 ">
            ERROR
          </h1>
          <h2 className="text-6xl font-bold  text-center text-Primary-background-color/55">
            4 0 4
          </h2>
          <div
            onClick={() => navigate("/")}
            className="w-fit bg-Green-color text-Primary-text-color text-2xl p-5  font-bold rounded-2xl  text-shadow-Primary-background-color"
          >
            HOME
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
