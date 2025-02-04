import { useFormik } from "formik";
import Modal from "../../../../../components/Modal/Modal";
import { useModal } from "../../../../../components/Modal/ModalProvider";
import { Input } from "../../../../../components/Inputs/TextInput";
import { Button } from "../../../../../components/Buttons";
import { Editor } from "../../../../../components/Inputs/Editor";
import { useDispatch, useSelector } from "react-redux";
import { setReload } from "../../../../../redux/slices/uiActions.slice";
import { createArticleSchema } from "../../../../../schema";
import { postData } from "../../../../../Utils/fetch";
import ModalHeader from "../../../../../components/Modal/ModalHeader";
import { Typography } from "../../../../../components/Typography";
import { RootState } from "../../../../../redux/store";

interface ModalComponentProps {
  modalId: string;
}

function CreateNewArticleModal({ modalId }: ModalComponentProps) {
  const { hideModal } = useModal();
  const dispatch = useDispatch();

  const { cohort } = useSelector((state: RootState) => state.auth);

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
    },
    validationSchema: createArticleSchema,
    onSubmit: () => submit(),
  });

  const submit = async () => {
    try {
      await postData(`article/`, { ...values, course: cohort?.course._id });
    } finally {
      resetForm();

      dispatch(setReload(true));
      hideModal(modalId);
    }
  };

  return (
    <Modal modalId={modalId}>
      <ModalHeader modalId={modalId}>
        <Typography variant="subheading">Create Article </Typography>
      </ModalHeader>
      <div className="w-full h-[500px] px-5 md:px-10 mt-10 overflow-visible md:w-[800px]">
        <form onSubmit={handleSubmit}>
          <div className="py-2">
            <Input
              value={values.topic}
              name="topic"
              handleBlur={handleBlur}
              error={errors.topic}
              onChange={handleChange}
              label="Video topic"
              touched={touched.topic}
              placeholder="Enter video topic"
              type="text"
            />
          </div>

          <div className="py-2">
            <Editor
              value={values.description}
              name="description"
              error={errors.description}
              onChange={handleChange}
              label="Course description"
              touched={touched.description}
              placeholder="Enter content description"
              onBlur={handleBlur}
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

export default CreateNewArticleModal;
