import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import * as yup from "yup";
import { useFormik } from "formik";
import { UpdateProfile } from "../../services/user.service";
import { signinUser } from "../../redux/slices/auth.slice";
import { useRequestError } from "../Hooks/useRequestError";
import { Button } from "../Buttons";
import { Input } from "../Inputs/TextInput";
import { Logout } from "../../services/auth.service";
// import { Upload } from "../Inputs/UploadInput";

type FormProps = {
  email: string;
  first_name: string;
  last_name: string;
  username: string;
};

const schema = yup.object().shape({
  email: yup
    .string()
    .required("Email is required")
    .email("Please enter a valid email address"),
  first_name: yup.string().required("First Name is required "),
  username: yup.string().required("Username is required "),
  last_name: yup.string().required("Last Name is required"),
});

function PersonalProfile() {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const { handleRequestError } = useRequestError({ useToast: true });
  const [loading, setLoading] = useState(false);
  const {
    values,
    handleChange,
    handleBlur,
    isSubmitting,
    touched,
    errors,
    handleSubmit,
    setValues,
  } = useFormik({
    initialValues: {
      email: "",
      first_name: "",
      last_name: "",
      username: "",
    },
    validationSchema: schema,
    onSubmit: (values: FormProps) => submit(values),
  });

  useEffect(() => {
    setValues({
      ...values,
      email: user?.email,
      first_name: user?.first_name,
      last_name: user?.last_name,
      username: user?.username,
    });
  }, [user]);

  const [editedForm, setEditedForm] = useState(false);

  useEffect(() => {
    const isEdited =
      values.first_name !== user?.first_name ||
      values.last_name !== user?.last_name ||
      values.username !== user?.username ||
      values.email !== user?.email;

    setEditedForm(isEdited);
  }, [values, user]);

  const submit = async (values: FormProps) => {
    try {
      const updatedUser = await UpdateProfile(values);
      dispatch(signinUser(updatedUser.data));
    } catch (error) {
      handleRequestError(error);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await Logout();
    } catch (error) {
      handleRequestError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="md:w-[70%]">
        <div className="flex-[.5] items-end flex mt-5">
          <img
            src={user?.profile_url}
            className=" object-contain w-24 h-24 rounded-full"
          />
          <div className="flex ml-3  justify-end"></div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className=" mt-10">
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
          <div className=" my-3">
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
          <div className=" my-3">
            <Input
              value={values.username}
              onChange={handleChange}
              touched={touched.username}
              className="placeholder:text-xs"
              name="username"
              handleBlur={handleBlur}
              error={errors.last_name}
              placeholder="Enter your username"
              type="text"
              label="Username"
            />
          </div>
          <div className="w-full my-3">
            <Input
              value={values.email}
              onChange={handleChange}
              className="placeholder:text-xs"
              name="email"
              touched={touched.email}
              handleBlur={handleBlur}
              error={errors.email}
              disabled
              placeholder="Enter your email"
              type="email"
              label="Email"
            />
          </div>
          <div className="flex items-center">
            <div className="mt-10 w-[150px]  ">
              <Button
                type="submit"
                loading={isSubmitting}
                disabled={!editedForm || isSubmitting}
              >
                Update
              </Button>
            </div>
            <div className="mt-10 w-[150px]  pl-10">
              <Button
                loading={loading}
                disabled={loading}
                onClick={logout}
                variant="destructive"
              >
                Logout
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PersonalProfile;
