const LoadingPage = () => {
  return (
    <div className="w-screen h-[60vh] bg-Primary-background-color flex gap-5 justify-center items-center">
      <h1 className="text-4xl font-bold font">Loading</h1>{" "}
      <div className=" size-12 md:size-24  rounded-full border-t-8 border-t-Green-color border-b-8 border-b-Primary-text-color animate-spin "></div>
    </div>
  );
};

export default LoadingPage;
