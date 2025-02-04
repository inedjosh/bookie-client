import { Outlet } from "react-router-dom";
import { AuthImg } from "../../assets";

const AuthLayout = () => {
  return (
    <div className=" p-5 w-screen h-screen relative">
      <div className="flex h-full justify-between items-center">
        <div className="md:w-[40%] hidden md:block h-full inset-0 ">
          <img src={AuthImg} className="w-full h-full object-fit" />
        </div>
        <div className="w-full md:w-[50%] flex justify-center items-center flex-col  ">
          <div className=" w-full h-full py-5">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
