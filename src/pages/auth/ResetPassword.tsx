import { useFormik } from "formik";
import * as yup from "yup";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useRequestError } from "../../components/Hooks/useRequestError";
import { Button } from "../../components/Buttons";
import { ResetPasswordRequest } from "../../services/auth.service";
import { RootState } from "../../redux/store";
import { PasswordInput } from "../../components/Inputs/PasswordInput";
import { useEffect, useState } from "react";
import { CgCheckO } from "react-icons/cg";

type ResetPasswordFormProps = {
  password: string;
};

const schema = yup.object().shape({
  password: yup
    .string()
    .required("Password is required")
    .test(
      "password",
      "Password must be at least 6 digits, contain at least, one uppercase letter, one lowercase letter and one digit",
      (value) => {
        if (!value) return false;
        return /^(?=.*[A-Z])(?=.*\d).{6,}$/.test(value);
      }
    ),
});

function ResetPassword() {
  const navigate = useNavigate();
  const { handleRequestError } = useRequestError();
  const { otpData } = useSelector((state: RootState) => state.auth);
  const [passwordCheck, setPasswordCheck] = useState({
    passwordLength: false,
    withNumber: false,
    withUppercase: false,
  });

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
      password: "",
    },
    validationSchema: schema,
    onSubmit: (values: ResetPasswordFormProps) => submit(values),
  });

  useEffect(() => {
    const uppercaseRegex = /[A-Z]/;
    const containsNumberRegex = /\d/;

    setPasswordCheck({
      withUppercase: uppercaseRegex.test(values.password),
      withNumber: containsNumberRegex.test(values.password),
      passwordLength: values.password.length >= 8,
    });
  }, [values.password]);

  const submit = async (values: ResetPasswordFormProps) => {
    try {
      await ResetPasswordRequest({
        email: otpData.email,
        new_password: values.password,
      });

      navigate("/login");
    } catch (err) {
      handleRequestError(err);
    }
  };

  return (
    <>
      <div className="flex justify-center w-full">
        <form
          onSubmit={handleSubmit}
          className="w-full flex flex-col justify-center items-center"
        >
          <div className="flex flex-col justify-center items-center w-[95%] mb-5">
            <h3 className="text-primary-blue text-2xl font-medium text-center">
              Set New Password
            </h3>
            <p className="text-center font-medium text-sm">
              Create a strong password to secure your account.
            </p>
          </div>

          <div className="w-full">
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
          </div>

          {values.password.length > 0 && (
            <div
              className={`w-full border p-2 mt-3 ${
                passwordCheck.passwordLength &&
                passwordCheck.withNumber &&
                passwordCheck.withUppercase
                  ? "border-accent"
                  : "border-destructive"
              }`}
            >
              <PasswordChecklist
                isValid={passwordCheck.passwordLength}
                text="Minimum of 8 characters"
              />
              <PasswordChecklist
                isValid={passwordCheck.withUppercase}
                text="At least 1 uppercase letter"
              />
              <PasswordChecklist
                isValid={passwordCheck.withNumber}
                text="At least 1 number"
              />
            </div>
          )}

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
        </form>
      </div>
    </>
  );
}

const PasswordChecklist = ({
  isValid,
  text,
}: {
  isValid: boolean;
  text: string;
}) => (
  <div className="flex items-center">
    <CgCheckO className={`${isValid ? "text-primary-green" : "text-[#ccc]"}`} />
    <p className="text-xs py-1 ml-1 text-left">{text}</p>
  </div>
);

export default ResetPassword;
