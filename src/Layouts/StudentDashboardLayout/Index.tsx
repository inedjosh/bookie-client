import { Link, Outlet, useNavigate } from "react-router-dom";
import { Typography } from "../../components/Typography";
import useCurrentPath from "../../components/Hooks/useCurrentPath";
import { RootState } from "../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { TbBrandZoom, TbLogout2, TbSmartHome } from "react-icons/tb";
import { GoTasklist } from "react-icons/go";
import { HiOutlineBell, HiOutlineClipboardDocumentList } from "react-icons/hi2";
import { logoutUser } from "../../redux/slices/auth.slice";
import { Logout } from "../../services/auth.service";
import { RiArrowDownSLine, RiArrowUpSLine } from "react-icons/ri";
import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { FaRegUser } from "react-icons/fa";
import { Icon, Logo } from "../../assets";
import { MODAL_ID } from "../ModalLayouts";
import { useModal } from "../../components/Modal/ModalProvider";

const StudentDashboardLayout = () => {
  const currentRoute = useCurrentPath();
  const [profileOpen, setProfileOpen] = useState(false);
  const { showModal } = useModal();
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
      link: "/student/overview",
      route: "overview",
    },
    {
      id: 2,
      icon: TbBrandZoom,
      text: "Class",
      link: "/student/class",
      route: "class",
    },
    {
      id: 3,
      icon: TbBrandZoom,
      text: "Mini-Class",
      link: "/student/mini-class",
      route: "mini-class",
    },
    {
      id: 4,
      icon: GoTasklist,
      text: "Daily Tasks",
      link: "/student/tasks",
      route: "tasks",
    },
    {
      id: 5,
      icon: HiOutlineClipboardDocumentList,
      text: "Resources",
      link: "/student/content",
      route: "content",
    },
  ];

  const logout = async () => {
    try {
      await Logout();
    } finally {
      dispatch(logoutUser());
    }
  };

  const optionalHeaderList = [
    "student/tasks/quiz",
    "student/profile",
    "student/content/video",
    "student/content/article",
    "/student/tasks/peer-grade/",
  ];

  const isInOptionalHeader = optionalHeaderList.some((path) =>
    window.location.pathname.includes(path)
  );

  return (
    <>
      {isInOptionalHeader ? (
        <Outlet />
      ) : (
        <div className=" bg-white w-screen min-h-screen relative">
          <header className="bg-primary items-center h-[150px]  px-10 md:px-20  fixed justify-between pb-0 flex w-full z-0 top-0 ">
            <div>
              <Link to="/admin/overview">
                <img src={Logo} className="w-32 hidden md:block" />

                <img src={Icon} className="w-[40px] md:hidden object-contain" />
              </Link>
            </div>
            <div className="flex items-center">
              <div className="flex bg-secondary-alt items-center  h-[90px] px-10 py-5 rounded-[100px]">
                {footerLinks.map(({ id, text, link, route }) => (
                  <Link key={id} to={link}>
                    <div
                      className={`${
                        currentRoute.isStudentRoute &&
                        currentRoute.currentPath === route
                          ? "bg-white  h-[40px]  items-center justify-center rounded-[32px] "
                          : ""
                      } px-5 pb-1 hidden md:flex  cursor-pointer`}
                    >
                      <Typography
                        className={`${
                          currentRoute.isStudentRoute &&
                          currentRoute.currentPath === route
                            ? "text-primaryText font-extrabold"
                            : "text-white"
                        }  hidden md:block`}
                        variant="body"
                      >
                        {text}
                      </Typography>
                    </div>
                  </Link>
                ))}
                <div
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center ml-12 relative"
                >
                  <div className="w-[40px]  h-[40px] border  overflow-hidden rounded-full">
                    <div className="w-full border-muted-alt border h-full flex justify-center items-center rounded-full">
                      <img src={user.profileUrl} />
                    </div>
                  </div>
                  <div className="ml-1">
                    {!profileOpen && <RiArrowDownSLine className="text-lg" />}
                    {profileOpen && <RiArrowUpSLine className="text-lg" />}{" "}
                  </div>
                  <Dialog
                    open={profileOpen}
                    onClose={() => setProfileOpen(false)}
                  >
                    <div className="absolute bg-white border shadow-sm h-[150px] right-20 z-10 top-20 w-[300px] rounded-[5px] py-3  px-5">
                      <Dialog.Panel>
                        <div className="">
                          <div
                            onClick={() => navigate("/student/profile")}
                            className="py-5 cursor-pointer flex items-center"
                          >
                            <FaRegUser className="w-6 h-6 text-muted-alt hover:text-primary" />

                            <Typography
                              variant="body"
                              className="pl-2 hover:text-primary"
                            >
                              Profile
                            </Typography>
                          </div>
                          <hr />
                          <div
                            onClick={logout}
                            className="py-5 cursor-pointer flex items-center"
                          >
                            <TbLogout2 className="w-6 h-6 text-muted-alt hover:text-primary" />
                            <Typography
                              variant="body"
                              className="pl-2 hover:text-primary"
                            >
                              Logout
                            </Typography>
                          </div>
                        </div>
                      </Dialog.Panel>
                    </div>
                  </Dialog>
                </div>
              </div>
              <div
                onClick={() => showModal(MODAL_ID.NOTIFICATION)}
                className="ml-5 relative"
              >
                <HiOutlineBell className="text-white text-2xl" />
                {user.unreadNotifications > 0 ? (
                  <div className="bg-secondary w-7  absolute top-[-70%] right-[-55%] flex justify-center items-center h-7 rounded-full">
                    <Typography variant="xSmall" color="white">
                      {user.unreadNotifications}
                    </Typography>
                  </div>
                ) : null}
              </div>{" "}
            </div>
          </header>
          <div className="flex ">
            <div className="w-full fixed inset-0 top-36  bg-[#FAFAFA]  pb-40 h-full overflow-scroll lg:mb-20 ">
              <Outlet />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default StudentDashboardLayout;
