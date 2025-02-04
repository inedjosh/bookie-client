import { useFormik } from "formik";
import Modal from "../../../../../components/Modal/Modal";
import { useModal } from "../../../../../components/Modal/ModalProvider";
import { Input } from "../../../../../components/Inputs/TextInput";
import { SelectInput } from "../../../../../components/Inputs/SelectInput";
import { Button } from "../../../../../components/Buttons";
import { Editor } from "../../../../../components/Inputs/Editor";
import { useDispatch, useSelector } from "react-redux";
import { setReload } from "../../../../../redux/slices/uiActions.slice";
import { createAssignmentSchema } from "../../../../../schema";
import { postData } from "../../../../../Utils/fetch";
import ModalHeader from "../../../../../components/Modal/ModalHeader";
import { Typography } from "../../../../../components/Typography";
import { RootState } from "../../../../../redux/store";

interface ModalComponentProps {
  modalId: string;
}

function CreateNewAssignmentModal({ modalId }: ModalComponentProps) {
  const { hideModal } = useModal();
  const { cohort } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  const {
    handleSubmit,
    isSubmitting,
    touched,
    values,
    resetForm,
    handleBlur,
    handleChange,

    errors,
  } = useFormik({
    initialValues: {
      topic: "",
      description: "",
      submissionType: "",
    },
    validationSchema: createAssignmentSchema,
    onSubmit: () => submit(),
  });

  const submit = async () => {
    try {
      await postData(`assignment/`, { ...values, course: cohort?.course._id });
    } finally {
      resetForm();
      dispatch(setReload(true));
      hideModal(modalId);
    }
  };

  return (
    <Modal modalId={modalId}>
      <ModalHeader modalId={modalId}>
        <Typography variant="subheading">Create Assignment </Typography>
      </ModalHeader>
      <div className="w-full h-[550px] px-5 md:px-10 mt-10 overflow-visible md:w-[800px]">
        <form onSubmit={handleSubmit}>
          <div className="py-2">
            <Input
              value={values.topic}
              name="topic"
              handleBlur={handleBlur}
              error={errors.topic}
              onChange={handleChange}
              label="Topic"
              touched={touched.topic}
              placeholder="Enter topic"
              type="text"
            />
          </div>

          <div className="py-2">
            <Editor
              value={values.description}
              name="description"
              error={errors.description}
              onChange={handleChange}
              label="Question"
              touched={touched.description}
              placeholder="Enter Question"
              onBlur={handleBlur}
            />
          </div>

          <div className="py-2">
            <SelectInput
              value={values.submissionType}
              name="submissionType"
              handleBlur={handleBlur}
              error={errors.submissionType}
              onChange={handleChange}
              label="Select Submission Type"
              touched={touched.submissionType}
              options={[
                { value: "pdf", key: "PDF" },
                { value: "csv", key: "CSV" },
                { value: "zip", key: "ZIPs" },
              ]}
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

export default CreateNewAssignmentModal;
