import { useState } from "react";
import { Typography } from "../../components/Typography";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { USER_ROLE } from "../../contants";
import PersonalProfile from "../../components/Account/PersonalProfile";
import AuthorProfile from "../../components/Account/AuthorProfile";
import MyLibrary from "../../components/Account/MyLibrary";

function Account() {
  const [active, setActive] = useState(0);
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <div className="w-full">
      <div className="flex justify-start mt-5 lg:mt-10 ">
        <Typography
          variant="body"
          color={`${active === 0 ? "primary" : "muted-alt"}`}
          onClick={() => setActive(0)}
          className={`${active === 0 ? "underline" : ""} cursor-pointer`}
        >
          Account
        </Typography>
        <Typography
          variant="body"
          color={`${active === 1 ? "primary" : "muted-alt"}`}
          onClick={() => setActive(1)}
          className={`${active === 1 ? "underline" : ""} pl-10  cursor-pointer`}
        >
          My Library
        </Typography>
        {user?.role === USER_ROLE.AUTHOR && (
          <Typography
            variant="body"
            color={`${active === 2 ? "primary" : "muted-alt"}`}
            onClick={() => setActive(2)}
            className={`${
              active === 2 ? "underline" : ""
            } pl-10  cursor-pointer`}
          >
            Author Profile
          </Typography>
        )}
      </div>

      <div className="w-full">
        {active === 0 && <PersonalProfile />}
        {active === 1 && <MyLibrary />}
        {active === 2 && <AuthorProfile />}
      </div>
    </div>
  );
}

export default Account;
