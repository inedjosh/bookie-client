import { useFormik } from "formik";
import * as yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { CgCheckO } from "react-icons/cg";
import { toast } from "react-toastify";
import { useRequestError } from "../../components/Hooks/useRequestError";
import { Input } from "../../components/Inputs/TextInput";
import { PasswordInput } from "../../components/Inputs/PasswordInput";
import { Button } from "../../components/Buttons";
import { Typography } from "../../components/Typography";
import Card from "../../components/Card";
import { RegisterRequest } from "../../services/auth.service";
import { useDispatch } from "react-redux";
import { setTokens, signinUser } from "../../redux/slices/auth.slice";
import Cookies from "js-cookie";

type singupFormProps = {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
};

const schema = yup.object().shape({
  email: yup
    .string()
    .required("Email is required")
    .email("Please enter a valid email address"),
  password: yup
    .string()
    .required("Password is required")
    .test(
      "password",
      "Password must be at least 8 characters, contain 1 number, and 1 uppercase letter",
      (value) => {
        if (!value) return false;
        return /^(?=.*[A-Z])(?=.*\d).{8,}$/.test(value);
      }
    ),
  first_name: yup.string().required("First Name is required "),
  last_name: yup.string().required("Last Name is required"),
});

function Signup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { handleRequestError } = useRequestError({ useToast: true });
  const [passwordCheck, setPasswordCheck] = useState({
    passwordLenght: false,
    withNumber: false,
    withUppercase: false,
  });

  const {
    values,
    handleChange,
    handleBlur,
    isSubmitting,
    touched,
    errors,
    handleSubmit,
  } = useFormik({
    initialValues: {
      email: "",
      password: "",
      first_name: "",
      last_name: "",
    },
    validationSchema: schema,
    onSubmit: (values: singupFormProps) => submit(values),
  });

  useEffect(() => {
    const uppercaseRegex = /[A-Z]/;
    const containsNumberRegex = /\d/;

    setPasswordCheck({
      withUppercase: uppercaseRegex.test(values.password),
      withNumber: containsNumberRegex.test(values.password),
      passwordLenght: values.password.length >= 8,
    });
  }, [values.password]);

  const submit = async (values: singupFormProps) => {
    try {
      const user = await RegisterRequest(values);
      dispatch(
        setTokens({
          accessToken: user.data.accessToken,
          refreshToken: user.data.refreshToken,
        })
      );
      dispatch(signinUser(user.data.user));
      Cookies.set("atk", user.data.accessToken);
      Cookies.set("rtk", user.data.refreshToken);
      navigate("/app/overview");
      toast.success("Account created successfully");
    } catch (err) {
      handleRequestError(err);
    }
  };

  return (
    <Card>
      <div className=" flex justify-center w-full">
        <form
          onSubmit={handleSubmit}
          className="w-full flex flex-col justify-center items-center"
        >
          <div className="flex-col justify-center w-full items-center">
            <h3 className="text-primary-blue text-2xl py-1 font-medium text-center">
              Create your Bookie Library
            </h3>
            <p className="text-center font-medium text-sm md:text-sm py-1">
              To start an amazing reading experience, please fill in your
              correct details
            </p>
          </div>
          <div className="flex justify-between w-full items-center">
            <div className="w-[49%] my-2">
              <Input
                value={values.first_name}
                touched={touched.first_name}
                onChange={handleChange}
                name="first_name"
                handleBlur={handleBlur}
                error={errors.first_name}
                className="placeholder:text-xs"
                placeholder="Enter your first name"
                type="text"
                label="First Name"
              />
            </div>
            <div className="w-[49%] my-1">
              <Input
                value={values.last_name}
                onChange={handleChange}
                touched={touched.last_name}
                className="placeholder:text-xs"
                name="last_name"
                handleBlur={handleBlur}
                error={errors.last_name}
                placeholder="Enter your last name"
                type="text"
                label="Last Name"
              />
            </div>
          </div>
          <div className="w-full my-1">
            <Input
              value={values.email}
              onChange={handleChange}
              className="placeholder:text-xs"
              name="email"
              touched={touched.email}
              handleBlur={handleBlur}
              error={errors.email}
              placeholder="Enter your email"
              type="email"
              label="Email"
            />
          </div>
          <div className="w-full my-0">
            <PasswordInput
              value={values.password}
              className="placeholder:text-xs"
              name="password"
              onChange={handleChange}
              touched={touched.password}
              handleBlur={handleBlur}
              error={errors.password}
              placeholder="Enter your password"
              label="Password"
            />
            {values.password.length ? (
              <div
                className={`${
                  passwordCheck.passwordLenght &&
                  passwordCheck.withNumber &&
                  passwordCheck.withUppercase
                    ? "border-accent"
                    : "border-destructive"
                } border p-2  mt-3`}
              >
                <div className="flex items-center">
                  <CgCheckO
                    className={`${
                      passwordCheck.passwordLenght
                        ? "text-primary-green"
                        : "text-[#ccc]"
                    }`}
                  />
                  <p className="text-[9px] text-xs py-1 ml-1 text-left">
                    Minimum of 8 characters
                  </p>
                </div>
                <div className="flex items-center">
                  <CgCheckO
                    className={`${
                      passwordCheck.withUppercase
                        ? "text-primary-green"
                        : "text-[#ccc]"
                    }`}
                  />
                  <p className="text-[9px] text-xs py-1 ml-1 text-left">
                    at least 1 uppercase letter
                  </p>
                </div>
                <div className="flex items-center">
                  <CgCheckO
                    className={`${
                      passwordCheck.withNumber
                        ? "text-primary-green"
                        : "text-[#ccc]"
                    }`}
                  />
                  <p className="text-[9px] text-xs py-1 ml-1 text-left">
                    at least 1 number
                  </p>
                </div>
              </div>
            ) : (
              <div />
            )}
          </div>

          <div className="w-full  mt-10">
            <Button
              className="bg-primary-green"
              disabled={isSubmitting}
              type="submit"
              loading={isSubmitting}
            >
              Register
            </Button>
          </div>
          <div className="flex justify-center w-full mt-5 ">
            <Typography variant="caption">
              Already signed up? &nbsp;{" "}
            </Typography>
            <Link to="/login">
              <Typography variant="underlined" color="primary">
                Login
              </Typography>
            </Link>
          </div>
        </form>
      </div>
    </Card>
  );
}

export default Signup;
