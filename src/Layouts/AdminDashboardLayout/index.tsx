import { Link, Outlet } from "react-router-dom";
import { Typography } from "../../components/Typography";
import useCurrentPath from "../../components/Hooks/useCurrentPath";
import {
  HiOutlineClipboardDocumentList,
  HiOutlineUserGroup,
  HiOutlineUsers,
} from "react-icons/hi2";
import { TbBrandZoom, TbLogout2, TbSchool, TbSmartHome } from "react-icons/tb";
import { GoTasklist } from "react-icons/go";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { logoutUser } from "../../redux/slices/auth.slice";
import { Logout } from "../../services/auth.service";
import { Logo } from "../../assets";

const AdminDashboardLayout = () => {
  const currentRoute = useCurrentPath();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
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
      link: "/admin/overview",
      route: "overview",
    },
    {
      id: 2,
      icon: HiOutlineUsers,
      text: "Users",
      link: "/admin/users",
      route: "users",
    },
    {
      id: 3,
      icon: TbSchool,
      text: "Courses",
      link: "/admin/courses",
      route: "courses",
    },
    {
      id: 4,
      icon: HiOutlineUserGroup,
      text: "Cohort",
      link: "/admin/cohort",
      route: "cohort",
    },
    {
      id: 5,
      icon: HiOutlineClipboardDocumentList,
      text: "Content",
      link: "/admin/content",
      route: "content",
    },
    {
      id: 6,
      icon: TbBrandZoom,
      text: "Class",
      link: "/admin/class",
      route: "class",
    },
    {
      id: 7,
      icon: GoTasklist,
      text: "Tasks",
      link: "/admin/tasks",
      route: "tasks",
    },
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
        <header className="bg-white pl-[26%] md:pl-[23%]  px-4  h-[80px] fixed items-center  flex border-b border border-r-0 border-t-0  w-full z-0 top-0 ">
          <div className="w-full flex justify-between items-center   h-full">
            <Typography className="capitalize" as="h3" variant="subheading">
              {currentRoute.currentPath}
            </Typography>
            <Typography as="h4" variant="subheading2" className="capitalize">
              Welcome{" "}
              <strong className="capitalize">
                {user?.firstName} {user?.lastName}
              </strong>
            </Typography>
          </div>
        </header>
      </div>
      <div className="flex ">
        <div className=" bg-white top-0 fixed bottom-0 left-0 border-t-0 border-b-0 border-r border z-10 h-screen   w-[20%] ">
          <div className="flex justify-start items-center px-5 md:px-10  py-8">
            <Link to="/admin/overview">
              <img src={Logo} className="" />
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
                  currentRoute.isAdminRoute &&
                  currentRoute.currentPath === route
                    ? "border-r-2 bg-border border-r-primary "
                    : "bg-white"
                }`}
              >
                {IconComponent && (
                  <IconComponent
                    className={`w-6 h-6 ${
                      currentRoute.isAdminRoute &&
                      currentRoute.currentPath === route
                        ? "text-black"
                        : "text-input"
                    }`}
                  />
                )}
                <Typography
                  className={`${
                    currentRoute.isAdminRoute &&
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
            className={`flex py-5 mt-10 px-5 md:px-10 cursor-pointer items-center hover:border-r-2 hover:bg-border hover:border-r-primary "}`}
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
        <div className="w-[80%] fixed inset-0 top-20 left-[20%]  bg-background pt-5 pb-20 h-full overflow-scroll lg:mb-20 ">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardLayout;
