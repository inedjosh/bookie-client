import { useFormik } from "formik";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useRequestError } from "../../components/Hooks/useRequestError";
import { Input } from "../../components/Inputs/TextInput";
import { Button } from "../../components/Buttons";
import { Typography } from "../../components/Typography";
import { ForgotPasswordRequest } from "../../services/auth.service";
import { setOtpData } from "../../redux/slices/auth.slice";
import { OTP_TYPE } from "../../constants";

type ForgotPasswordFormProps = {
  email: string;
};

const schema = yup.object().shape({
  email: yup
    .string()
    .required("Email is required")
    .email("Please enter a valid email address"),
});

function ForgotPassword() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { handleRequestError } = useRequestError();

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
    },
    validationSchema: schema,
    onSubmit: (values: ForgotPasswordFormProps) => submit(values),
  });

  const submit = async (values: ForgotPasswordFormProps) => {
    try {
      await ForgotPasswordRequest(values);

      dispatch(
        setOtpData({ email: values.email, type: OTP_TYPE.FORGOT_PASSWORD })
      );

      navigate("/verify-email");
    } catch (err) {
      handleRequestError(err);
    }
  };

  return (
    <div className="md:px-14 px-5 flex justify-center w-full">
      <form
        onSubmit={handleSubmit}
        className="w-full flex flex-col justify-center items-center"
      >
        <div className="flex-col justify-center w-[95%]  items-center">
          <h3 className="text-primary-blue text-2xl font-medium text-center">
            Forgot Password
          </h3>
          <p className="text-center font-medium text-sm md:text-sm">
            Enter your email to reset your password
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

        <div className="w-full mt-10">
          <Button
            color="primary-blue"
            disabled={isSubmitting}
            loading={isSubmitting}
            type="submit"
          >
            Continue
          </Button>
        </div>
        <div className="flex justify-center  w-full  mt-5 ">
          <div className="flex items-start">
            <Typography variant="caption">
              Remembered Password? &nbsp;{" "}
            </Typography>{" "}
            <Typography variant="underlined" color="primary">
              <Link to="/login"> Login </Link>
            </Typography>
          </div>
        </div>
      </form>
    </div>
  );
}

export default ForgotPassword;
