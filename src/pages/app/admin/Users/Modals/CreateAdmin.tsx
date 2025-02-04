import { useFormik } from "formik";
import { Input } from "../../../../../components/Inputs/TextInput";
import Modal from "../../../../../components/Modal/Modal";
import { createAdminSchema } from "../../../../../schema";
import { SelectInput } from "../../../../../components/Inputs/SelectInput";
import { postData } from "../../../../../Utils/fetch";
import { useDispatch } from "react-redux";
import { setReload } from "../../../../../redux/slices/uiActions.slice";
import { useModal } from "../../../../../components/Modal/ModalProvider";
import { Button } from "../../../../../components/Buttons";
import ModalHeader from "../../../../../components/Modal/ModalHeader";
import { Typography } from "../../../../../components/Typography";

interface ModalComponentProps {
  modalId: string;
}

function CreateAdminModal({ modalId }: ModalComponentProps) {
  const dispatch = useDispatch();
  const { hideModal } = useModal();

  const {
    values,
    handleChange,
    handleBlur,
    touched,
    isSubmitting,
    resetForm,
    errors,
    handleSubmit,
  } = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      country: "",
      phoneNumber: "",
      email: "",
    },
    validationSchema: createAdminSchema,
    onSubmit: () => submit(),
  });

  const submit = async () => {
    try {
      await postData("admin/create-admin", values);
    } finally {
      resetForm();
      dispatch(setReload(true));
      hideModal(modalId);
    }
  };

  return (
    <Modal modalId={modalId}>
      <ModalHeader modalId={modalId}>
        <Typography variant="subheading">Create Admin </Typography>
      </ModalHeader>
      <div className="w-full h-[500px] px-5 md:px-10 mt-10 overflow-visible md:w-[800px]">
        <form onSubmit={handleSubmit} className="py-5">
          <div className="py-3">
            <Input
              value={values.firstName}
              label="First Name"
              onChange={handleChange}
              name="firstName"
              touched={touched.firstName}
              handleBlur={handleBlur}
              error={errors.firstName}
              placeholder="Enter first name"
              type="text"
            />
          </div>
          <div className="py-3">
            <Input
              value={values.lastName}
              label="Last Name"
              onChange={handleChange}
              name="lastName"
              touched={touched.lastName}
              handleBlur={handleBlur}
              error={errors.lastName}
              placeholder="Enter last name"
              type="text"
            />
          </div>
          <div className="py-3">
            <Input
              value={values.email}
              label="Email"
              onChange={handleChange}
              name="email"
              touched={touched.email}
              handleBlur={handleBlur}
              error={errors.email}
              placeholder="Enter email"
              type="email"
            />
          </div>
          <div className="py-3">
            <Input
              value={values.phoneNumber}
              label="Phone Number"
              onChange={handleChange}
              name="phoneNumber"
              touched={touched.phoneNumber}
              handleBlur={handleBlur}
              error={errors.phoneNumber}
              placeholder="Enter phone number"
              type="text"
            />
          </div>
          <div className="py-3">
            <SelectInput
              label="Country"
              name="country"
              touched={touched.country}
              handleBlur={handleBlur}
              error={errors.country}
              options={[{ value: "nigeria", key: "nigeria" }]}
              value={values.country}
              onChange={handleChange}
            />
          </div>
          <div className="pb-20 mt-10 w-full">
            <Button
              type="submit"
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              Create
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}

export default CreateAdminModal;
