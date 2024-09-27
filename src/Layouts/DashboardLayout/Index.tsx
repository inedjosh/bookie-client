import { Link, Outlet } from "react-router-dom";
import { RiAccountBoxLine, RiBook3Line, RiHome6Line } from "react-icons/ri";
import { Typography } from "../../components/Typography";
import useCurrentPath from "../../components/Hooks/useCurrentPath";
import { Button } from "../../components/Buttons";
import { useModal } from "../../components/Modal/ModalProvider";
import { MODAL_ID } from "../ModalLayouts";
import SearchInput from "../../components/Inputs/SearchInput";
import { RootState } from "../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { USER_ROLE } from "../../contants";
import { useState, FormEvent } from "react";
import { useRequestError } from "../../components/Hooks/useRequestError";
import {
  LIBRARY_STATE,
  setSearchActive,
} from "../../redux/slices/uiActions.slice";
import { SearchBooks } from "../../services/book.service";
import { SearchAuthors } from "../../services/author.service";
import {
  setAuthors,
  setAuthorsPagination,
  setBooks,
  setBooksPagination,
} from "../../redux/slices/library.slice";

const DashboardLayout = () => {
  const currentRoute = useCurrentPath();
  const { user } = useSelector((state: RootState) => state.auth);
  const { handleRequestError } = useRequestError({ useToast: true });
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const { showModal } = useModal();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const { libraryState } = useSelector((state: RootState) => state.uiActions);

  const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      let result;
      setLoading(true);
      if (libraryState === LIBRARY_STATE.BOOKS) {
        result = await SearchBooks({ query: searchQuery });
        dispatch(
          setBooksPagination({
            currenPage: result.data.currentPage,
            totalPages: result.data.totalPages,
          })
        );

        dispatch(setBooks(result.data.books));
      } else {
        result = await SearchAuthors({ query: searchQuery });

        dispatch(setAuthors(result.data.authors));
        dispatch(
          setAuthorsPagination({
            currenPage: result.data.currentPage,
            totalPages: result.data.totalPages,
          })
        );
      }
      dispatch(setSearchActive(true));
      setSearchQuery("");
    } catch (error) {
      handleRequestError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleIconClick = async () => {
    if (searchQuery.trim()) {
      const e = new Event("click");
      await handleSearch(e as any);
    }
  };

  const footerLinks: {
    id: number;
    route: string;
    link: string;
    text: string;
    icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  }[] = [
    {
      id: 1,
      icon: RiHome6Line,
      text: "Home",
      link: "/app/overview",
      route: "overview",
    },
    {
      id: 2,
      icon: RiBook3Line,
      text: "Library",
      link: "/app/library",
      route: "library",
    },
    {
      id: 3,
      icon: RiAccountBoxLine,
      text: "Account",
      link: "/app/account",
      route: "account",
    },
  ];

  return (
    <div className="font-latoRegular bg-white w-screen min-h-screen relative">
      <div>
        <header className="bg-white lg:px-20 px-4  py-4 fixed flex lg:items-center flex-col lg:justify-between lg:flex-row w-full z-10 top-0 ">
          <div className="flex-[.3] flex justify-between items-center ">
            <Link to="/app/overview">
              {" "}
              <Typography as="h1" className="cursor-pointer" variant="logo">
                Bookie
              </Typography>
            </Link>
            <div className="lg:hidden">
              {user?.role === USER_ROLE.READER ? (
                <Button
                  onClick={() => showModal(MODAL_ID.BECOME_AN_AUTHOR_MODAL)}
                  size="sm"
                >
                  <Typography as="h4" variant="body">
                    {" "}
                    Become an Author
                  </Typography>{" "}
                </Button>
              ) : (
                <Button onClick={() => showModal(MODAL_ID.ADD_BOOK)} size="sm">
                  <Typography as="h4" variant="body">
                    {" "}
                    Post a book
                  </Typography>{" "}
                </Button>
              )}{" "}
            </div>
          </div>
          <div className="flex-[.5]  lg:mt-0  mt-3">
            {currentRoute.isAppRoute &&
              currentRoute.currentPath === "library" && (
                <form onSubmit={handleSearch} className="w-full lg:w-[60%]">
                  <SearchInput
                    onIconClick={handleIconClick}
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder="Search..."
                    loading={loading}
                  />
                </form>
              )}
          </div>
          <div className="hidden lg:flex flex-[.5] ">
            <ul className="flex justify-between items-center w-full">
              <li>
                <Link to="/app/library">
                  <Typography as="p" variant="link">
                    Library
                  </Typography>
                </Link>
              </li>
              <li>
                <Link to="/app/account">
                  <Typography as="p" variant="link">
                    Account
                  </Typography>
                </Link>
              </li>
              <li>
                {user?.role === USER_ROLE.READER ? (
                  <Button
                    onClick={() => showModal(MODAL_ID.BECOME_AN_AUTHOR_MODAL)}
                  >
                    Become an Author
                  </Button>
                ) : (
                  <Button onClick={() => showModal(MODAL_ID.ADD_BOOK)}>
                    Post a book{" "}
                  </Button>
                )}
              </li>
            </ul>
          </div>
        </header>
      </div>
      <div className="flex  ">
        <div
          className={`w-[100%]  ${
            currentRoute.isAppRoute && currentRoute.currentPath === "books"
              ? "pt-[180px]"
              : "pt-[95px]"
          }  lg:pt-[80px] md:pt-[75px] `}
        >
          <div className="lg:px-20 px-4  md:py-2 mb-40 bg-white lg:mb-20 ">
            <Outlet />
          </div>
          <div className="lg:hidden  flex bg-white  p-5 justify-between fixed w-full bottom-0">
            {footerLinks.map(
              ({ icon: IconComponent, id, text, link, route }) => (
                <Link key={id} to={link}>
                  <div className="flex justify-center cursor-pointer flex-col items-center">
                    {IconComponent && (
                      <IconComponent
                        className={`w-7 h-7 ${
                          currentRoute.isAppRoute &&
                          currentRoute.currentPath === route
                            ? "text-primary"
                            : "text-input"
                        }`}
                      />
                    )}{" "}
                    <Typography
                      as="p"
                      className={`  ${
                        currentRoute.isAppRoute &&
                        currentRoute.currentPath === route
                          ? "text-primary"
                          : "text-input"
                      }`}
                      variant="body"
                    >
                      {text}
                    </Typography>
                  </div>
                </Link>
              )
            )}
          </div>{" "}
        </div>
      </div>
      {/* <footer className="mt-10 hidden lg:block absolute w-full bottom-0">
        <hr />
        <Typography as="p" variant="caption" className="text-center py-6 ">
          {" "}
          copyright &copy;{currentYear} Bookie
        </Typography>
      </footer> */}
    </div>
  );
};

export default DashboardLayout;
