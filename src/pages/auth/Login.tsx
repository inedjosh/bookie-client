import { useFormik } from "formik";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useRequestError } from "../../components/Hooks/useRequestError";
import { Input } from "../../components/Inputs/TextInput";
import { PasswordInput } from "../../components/Inputs/PasswordInput";
import { Button } from "../../components/Buttons";
import Card from "../../components/Card";
import { Typography } from "../../components/Typography";
import { LoginRequest } from "../../services/auth.service";
import { setTokens, signinUser } from "../../redux/slices/auth.slice";

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
          <div className="flex-col justify-center w-[95%]  items-center">
            <h3 className="text-primary-blue text-2xl font-medium text-center">
              Welcome Back
            </h3>
            <p className="text-center font-medium text-sm md:text-sm">
              Login to your account to continue reading!
            </p>
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
          <div className="w-full mt-10">
            <Button
              color="primary-blue"
              disabled={isSubmitting}
              loading={isSubmitting}
              type="submit"
            >
              Login
            </Button>
          </div>
          <div className="flex justify-center  w-full  mt-5 ">
            <div className="flex items-start">
              <Typography variant="caption">New User? &nbsp; </Typography>{" "}
              <Typography variant="underlined" color="primary">
                <Link to="/register"> Sign up </Link>
              </Typography>
            </div>
          </div>
        </form>
      </div>
      <div></div>
    </Card>
  );
}

export default Login;
