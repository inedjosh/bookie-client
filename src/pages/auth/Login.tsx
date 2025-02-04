import { useFormik } from "formik";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useRequestError } from "../../components/Hooks/useRequestError";
import { Input } from "../../components/Inputs/TextInput";
import { PasswordInput } from "../../components/Inputs/PasswordInput";
import { Button } from "../../components/Buttons";
import { Typography } from "../../components/Typography";
import { LoginRequest } from "../../services/auth.service";
import {
  setCohort,
  setTokens,
  signinUser,
} from "../../redux/slices/auth.slice";
import { ACCOUNT_TYPES } from "../../constants";
import { CustomCheckbox } from "../../components/Inputs/CheckboxInput/CheckboxInput";

type loginFormProps = {
  email: string;
  password: string;
};

const schema = yup.object().shape({
  email: yup
    .string()
    .required("Email is required")
    .email("Please enter a valid email address"),
  password: yup.string().required("Password is required"),
});

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { handleRequestError } = useRequestError({ useToast: true });

  const {
    values,
    handleChange,
    handleBlur,
    touched,
    isSubmitting,
    errors,
    handleSubmit,
  } = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: schema,
    onSubmit: (values: loginFormProps) => submit(values),
  });

  const submit = async (values: loginFormProps) => {
    try {
      const user = await LoginRequest(values);
      console.log(user);
      console.log(user.data);
      dispatch(
        setTokens({
          accessToken: user.data.accessToken,
          refreshToken: user.data.refreshToken,
        })
      );
      dispatch(signinUser(user.data.user));
      if (
        user.data.user.role === ACCOUNT_TYPES.STUDENT ||
        user.data.user.role === ACCOUNT_TYPES.TEACHER
      ) {
        dispatch(setCohort(user.data.cohort));
      }
      Cookies.set("atk", user.data.accessToken);
      Cookies.set("rtk", user.data.refreshToken);

      if (user.data.user.role === ACCOUNT_TYPES.ADMIN) {
        navigate("/admin/overview");
      } else if (user.data.user.role === ACCOUNT_TYPES.TEACHER) {
        navigate("/teacher/overview");
      } else if (user.data.user.role === ACCOUNT_TYPES.STUDENT) {
        navigate("/student/overview");
      }
    } catch (err) {
      handleRequestError(err);
    }
  };

  return (
    <>
      <div className="md:px-14 px-5 flex justify-center w-full">
        <form
          onSubmit={handleSubmit}
          className="w-full flex flex-col justify-center "
        >
          <div className="flex-col justify-center w-[95%]  items-center">
            <Typography variant="heading" className=" md:text-center">
              Unlock a World of Learning,
            </Typography>
            <Typography variant="heading" className="md:text-center">
              One Toggle at a Time.{" "}
            </Typography>
          </div>

          <div className="w-full my-5">
            <Input
              value={values.email}
              touched={touched.email}
              onChange={handleChange}
              name="email"
              handleBlur={handleBlur}
              error={errors.email}
              placeholder="Enter your email"
              type="email"
              label="Email"
            />
          </div>
          <div className="w-full my-1">
            <PasswordInput
              touched={touched.password}
              value={values.password}
              name="password"
              onChange={handleChange}
              handleBlur={handleBlur}
              error={errors.password}
              placeholder="Enter your password"
              label="Password"
            />
          </div>
          <div className="my-5 flex items-center ">
            <CustomCheckbox
              onChange={function (): void {
                throw new Error("Function not implemented.");
              }}
              value={undefined}
              label={undefined}
            />
            <div className="flex flex-col justify-start items-start">
              <Typography className=" pl-3">Keep me logged in</Typography>

              <Typography className=" pl-3" color="muted-alt" variant="caption">
                Stay logged in for quicker access to your learning hub.{" "}
              </Typography>
            </div>
          </div>

          <div className="w-full mt-8">
            <Button
              disabled={isSubmitting}
              loading={isSubmitting}
              type="submit"
              className=" h-[55px]"
            >
              Toggle In 🚀
            </Button>
            <Typography className="text-center mt-5">
              Together we can turn on the tech switch,
              <strong> One Toggle at a Time</strong>
            </Typography>
          </div>
          <div className="flex items-center justify-center mt-5">
            <Typography variant="caption">Forgot password? &nbsp; </Typography>{" "}
            <Typography variant="underlined" color="primary">
              <Link to="/forgot-password"> Reset Password </Link>
            </Typography>
          </div>
        </form>
      </div>
      <div></div>
    </>
  );
}

export default Login;
