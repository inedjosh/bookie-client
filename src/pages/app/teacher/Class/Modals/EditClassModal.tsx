import { useFormik } from "formik";
import Modal from "../../../../../components/Modal/Modal";
import { useModal } from "../../../../../components/Modal/ModalProvider";
import { useEffect, useState } from "react";
import { scheduleValidationSchema } from "../../../../../schema";
import { Input } from "../../../../../components/Inputs/TextInput";
import { Button } from "../../../../../components/Buttons";
import { fetchData, updateData } from "../../../../../Utils/fetch";
import { ClassType } from "../../../../../types";
import EditCourseSkeleton from "../Components/EditTaskSkeleton";
import { useDispatch } from "react-redux";
import { setReload } from "../../../../../redux/slices/uiActions.slice";
import { ClassTypeList } from "../../../../../constants";
import ModalHeader from "../../../../../components/Modal/ModalHeader";
import { Typography } from "../../../../../components/Typography";

interface ModalComponentProps {
  modalId: string;
}

function EditClassModal({ modalId }: ModalComponentProps) {
  const { hideModal } = useModal();
  const dispatch = useDispatch();
  const { modalStates } = useModal();
  const statesData = modalStates[modalId]?.props;
  const [loading, setLoading] = useState(false);
  const [schedule, setSchedule] = useState<ClassType | null>(null);

  useEffect(() => {
    const getCourse = async () => {
      try {
        setLoading(true);
        const response = await fetchData<ClassType>(
          `/class/${statesData?.classId}`
        );

        setSchedule(response.data);
      } finally {
        setLoading(false);
      }
    };

    if (modalStates[modalId]?.isOpen && statesData?.classId) {
      getCourse();
    }
  }, [statesData?.classId, modalStates[modalId]?.isOpen]);

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
      topic: "",
      recordedUrl: "",
    },
    validationSchema: scheduleValidationSchema,
    onSubmit: () => submit(),
  });

  useEffect(() => {
    if (schedule) {
      setValues({
        topic: schedule.topic || "",
        recordedUrl: schedule.recordedUrl || "",
      });
    }
  }, [schedule]);

  const submit = async () => {
    try {
      await updateData(`/class/${statesData?.classId}`, values);
    } finally {
      resetForm();
      dispatch(setReload(true));
      hideModal(modalId);
    }
  };

  return (
    <Modal modalId={modalId}>
      <div className="w-full h-[550px] overflow-visible md:w-[800px]">
        {loading ? (
          <EditCourseSkeleton />
        ) : (
          <div>
            {" "}
            <ModalHeader modalId={modalId}>
              <Typography variant="subheading">Update Class </Typography>
            </ModalHeader>
            <form onSubmit={handleSubmit} className="mt-5 px-5 md:px-10">
              <div className="py-2 mt-10">
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

              {schedule?.status === ClassTypeList.COMPLETED ? (
                <div className="py-2">
                  <Input
                    value={values.recordedUrl}
                    name="recordedUrl"
                    error={errors.recordedUrl}
                    onChange={handleChange}
                    label="Recording URL"
                    touched={touched.recordedUrl}
                    placeholder="Enter recording URL"
                    onBlur={handleBlur}
                  />
                </div>
              ) : null}

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
          </div>
        )}
      </div>
    </Modal>
  );
}

export default EditClassModal;
