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
import { fetchData, updateData } from "../../../../../Utils/fetch";
import { useEffect, useState } from "react";
import { AssignmentType } from "../../../../../types";
import ModalHeader from "../../../../../components/Modal/ModalHeader";
import { Typography } from "../../../../../components/Typography";
import EditContentSkeleton from "../../Content/Components/EditContentSkeleton";
import { RootState } from "../../../../../redux/store";

interface ModalComponentProps {
  modalId: string;
}

function EditAssignmentModal({ modalId }: ModalComponentProps) {
  const { hideModal, modalStates } = useModal();
  const assignmentId = modalStates[modalId]?.props?.assignmentId;
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const { cohort } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const getCourse = async () => {
      try {
        setLoading(true);
        const response = await fetchData<AssignmentType>(
          `/assignment/${assignmentId}`
        );

        setValues({
          ...values,
          topic: response.data?.topic || "",
          description: response.data?.description || "",
          submissionType: response.data?.submissionType || "",
        });
      } finally {
        setLoading(false);
      }
    };

    if (modalStates[modalId]?.isOpen) getCourse();
  }, [assignmentId, modalStates[modalId]?.isOpen]);

  const {
    handleSubmit,
    isSubmitting,
    touched,
    values,
    resetForm,
    handleBlur,
    handleChange,
    setValues,
    errors,
  } = useFormik({
    initialValues: {
      topic: "",
      description: "",
      course: "",
      submissionType: "",
    },
    validationSchema: createAssignmentSchema,
    onSubmit: () => submit(),
  });

  const submit = async () => {
    try {
      await updateData(`assignment/${assignmentId}`, {
        ...values,
        course: cohort?.course._id,
      });
    } finally {
      resetForm();
      dispatch(setReload(true));
      hideModal(modalId);
    }
  };

  return (
    <Modal modalId={modalId}>
      <ModalHeader modalId={modalId}>
        <Typography variant="subheading">Update Assignment </Typography>
      </ModalHeader>
      <div className="w-full h-[600px] px-5 md:px-10 mt-10 overflow-visible md:w-[800px]">
        {loading ? (
          <EditContentSkeleton />
        ) : (
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
                Update
              </Button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
}

export default EditAssignmentModal;
