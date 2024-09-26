import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className=" bg-[#030142] overflow-x-hidden w-screen h-screen relative">
      <div className="flex h-full justify-center items-center">
        <div className="absolute inset-0 ">
          <h1 className="text-white text-3xl text-center py-5">Bookie</h1>
        </div>
        <div className="w-[95%] md:w-[45%] lg:w-[35%] 2xl:w-[30%] flex justify-center items-center flex-col z-10  ">
          <div className=" w-full h-full py-5">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
