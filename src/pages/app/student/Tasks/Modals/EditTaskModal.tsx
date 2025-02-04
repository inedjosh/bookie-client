import { useFormik } from "formik";
import Modal from "../../../../../components/Modal/Modal";
import { useModal } from "../../../../../components/Modal/ModalProvider";
import { useEffect, useState } from "react";
import { updateTaskSchema } from "../../../../../schema";
import { Input } from "../../../../../components/Inputs/TextInput";
import { Button } from "../../../../../components/Buttons";
import { fetchData, updateData } from "../../../../../Utils/fetch";
import { TaskType } from "../../../../../types";
import EditCourseSkeleton from "../Components/EditTaskSkeleton";
import { useDispatch } from "react-redux";
import { setReload } from "../../../../../redux/slices/uiActions.slice";

interface ModalComponentProps {
  modalId: string;
}

function EditTaskModal({ modalId }: ModalComponentProps) {
  const { hideModal } = useModal();
  const dispatch = useDispatch();
  const { modalStates } = useModal();
  const statesData = modalStates[modalId]?.props;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getCourse = async () => {
      try {
        setLoading(true);
        const response = await fetchData<TaskType>(
          `/task/${statesData?.taskId}`
        );

        setValues({
          title: response?.data?.title || "",
        });
      } finally {
        setLoading(false);
      }
    };

    if (modalStates[modalId]?.isOpen) getCourse();
  }, [statesData?.courseId, modalStates[modalId]?.isOpen]);

  const {
    handleSubmit,
    isSubmitting,
    setValues,
    touched,
    values,
    handleBlur,
    resetForm,
    handleChange,
    errors,
  } = useFormik({
    initialValues: {
      title: "",
    },
    validationSchema: updateTaskSchema,
    onSubmit: () => submit(),
  });

  const submit = async () => {
    try {
      await updateData(`/task/${statesData?.taskId}`, values);
    } finally {
      resetForm();
      dispatch(setReload(true));
      hideModal(modalId);
    }
  };

  return (
    <Modal modalId={modalId} title="Update Course">
      <div className="w-full h-[500px] overflow-visible md:w-[500px]">
        {loading ? (
          <EditCourseSkeleton />
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="py-2">
              <Input
                value={values.title}
                name="title"
                handleBlur={handleBlur}
                error={errors.title}
                onChange={handleChange}
                label="Course title"
                touched={touched.title}
                placeholder="Enter course title"
                type="text"
              />
            </div>

            <div className="pb-20 mt-10 w-full">
              <Button
                type="submit"
                loading={isSubmitting}
                disabled={isSubmitting}
              >
                Update{" "}
              </Button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
}

export default EditTaskModal;
