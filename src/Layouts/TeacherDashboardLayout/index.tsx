import { Link, Outlet, useNavigate } from "react-router-dom";
import { Typography } from "../../components/Typography";
import useCurrentPath from "../../components/Hooks/useCurrentPath";

import {
  HiOutlineClipboardDocumentList,
  HiOutlineUsers,
} from "react-icons/hi2";
import { TbBrandZoom, TbLogout2, TbSmartHome } from "react-icons/tb";
import { GoTasklist } from "react-icons/go";
import { logoutUser } from "../../redux/slices/auth.slice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { Logout } from "../../services/auth.service";
import { DefaultImage } from "../../assets";

const AdminDashboardLayout = () => {
  const currentRoute = useCurrentPath();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, cohort } = useSelector((state: RootState) => state.auth);
  const footerLinks: {
    id: number;
    route: string;
    link: string;
    text: string;
    icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  }[] = [
    {
      id: 1,
      icon: TbSmartHome,
      text: "Home",
      link: "/teacher/overview",
      route: "overview",
    },
    {
      id: 2,
      icon: HiOutlineUsers,
      text: "Students",
      link: "/teacher/students",
      route: "students",
    },

    {
      id: 5,
      icon: HiOutlineClipboardDocumentList,
      text: "Content",
      link: "/teacher/content",
      route: "content",
    },
    {
      id: 6,
      icon: TbBrandZoom,
      text: "Class",
      link: "/teacher/class",
      route: "class",
    },
    {
      id: 7,
      icon: GoTasklist,
      text: "Tasks",
      link: "/teacher/tasks",
      route: "tasks",
    },
    // {
    //   id: 8,
    //   icon: MdOutlineAssignmentTurnedIn,
    //   text: "Assignments",
    //   link: "/teacher/assignments",
    //   route: "assignments",
    // },
  ];

  const logout = async () => {
    try {
      await Logout();
    } finally {
      dispatch(logoutUser());
    }
  };

  return (
    <div className="font-latoRegular bg-white w-screen min-h-screen relative">
      <div>
        <header className="bg-white pl-[26%] md:pl-[23%] px-5 md:px-12  h-[80px] fixed items-center  flex border-b border border-r-0 border-t-0  w-full z-0 top-0 ">
          <div className="w-full flex justify-between items-center   h-full">
            <Typography className="capitalize" as="h3" variant="subheading">
              {currentRoute.currentPath}
            </Typography>
            <div
              onClick={() => navigate("/teacher/profile")}
              className="flex cursor-pointer items-center"
            >
              <div className="w-[40px] md:w-[50px] h-[40px] md:h-[50px] border  overflow-hidden rounded-full">
                <img
                  src={DefaultImage}
                  className="h-full w-full object-cover "
                />
              </div>
              <div className="hidden  md:block">
                <Typography as="h4" variant="body" className="capitalize pl-2">
                  <strong className="capitalize">
                    {user.firstName} {user.lastName}
                  </strong>
                </Typography>
                <Typography
                  variant="caption"
                  color="muted-alt"
                  className="capitalize pl-2"
                >
                  {cohort?.cohortName}
                </Typography>
              </div>
            </div>
          </div>
        </header>
      </div>
      <div className="flex ">
        <div className=" bg-white top-0 fixed bottom-0 left-0 border-t-0 border-b-0 border-r border z-10 h-screen   w-[20%] ">
          <div className="flex justify-start items-center px-5 md:px-10  py-8">
            <Link to="/admin/overview">
              <Typography
                as="h1"
                className="cursor-pointer hidden md:block"
                variant="logo"
                color="primary"
              >
                Toggle
              </Typography>
              <Typography
                as="h1"
                className="cursor-pointer block md:hidden"
                variant="logo"
              >
                T
              </Typography>
            </Link>
          </div>
          {footerLinks.map(({ icon: IconComponent, id, text, link, route }) => (
            <Link key={id} to={link}>
              <div
                className={`flex py-5 px-5 md:px-10 cursor-pointer items-center ${
                  currentRoute.isTeacherRoute &&
                  currentRoute.currentPath === route
                    ? "border-r-2 bg-border border-r-primary "
                    : "bg-white"
                }`}
              >
                {IconComponent && (
                  <IconComponent
                    className={`w-6 h-6 ${
                      currentRoute.isTeacherRoute &&
                      currentRoute.currentPath === route
                        ? "text-black"
                        : "text-input"
                    }`}
                  />
                )}
                <Typography
                  className={`  ${
                    currentRoute.isTeacherRoute &&
                    currentRoute.currentPath === route
                      ? "text-black"
                      : "text-input"
                  } pl-4 hidden md:block`}
                  variant="subheading2"
                >
                  {text}
                </Typography>
              </div>
            </Link>
          ))}

          <div
            onClick={logout}
            className={`flex py-5 mt-20 px-5 md:px-10 cursor-pointer items-center hover:border-r-2 hover:bg-border hover:border-r-primary "}`}
          >
            <TbLogout2 className="w-6 h-6 text-destructive" />
            <Typography
              as="p"
              className={`  ${"text-destructive"} pl-4 hidden md:block`}
              variant="subheading2"
            >
              Logout
            </Typography>
          </div>
        </div>
        <div className="w-[80%] fixed inset-0 top-20 left-[20%]  bg-background pb-20 h-full overflow-scroll lg:mb-20 ">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardLayout;
