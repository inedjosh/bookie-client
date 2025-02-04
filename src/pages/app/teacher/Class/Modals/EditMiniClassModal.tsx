import { useFormik } from "formik";
import Modal from "../../../../../components/Modal/Modal";
import { useModal } from "../../../../../components/Modal/ModalProvider";
import { useEffect, useState } from "react";
import { scheduleValidationSchema } from "../../../../../schema";
import { Input } from "../../../../../components/Inputs/TextInput";
import { Button } from "../../../../../components/Buttons";
import { fetchData, updateData } from "../../../../../Utils/fetch";
import { MiniClassType, UserType } from "../../../../../types";
import EditCourseSkeleton from "../Components/EditTaskSkeleton";
import { useDispatch } from "react-redux";
import { setReload } from "../../../../../redux/slices/uiActions.slice";
import { ClassTypeList, MINI_CLASS_LIST } from "../../../../../constants";
import ModalHeader from "../../../../../components/Modal/ModalHeader";
import { Typography } from "../../../../../components/Typography";
import { SelectInput } from "../../../../../components/Inputs/SelectInput";

interface ModalComponentProps {
  modalId: string;
}

function EditMiniClassModal({ modalId }: ModalComponentProps) {
  const { hideModal } = useModal();
  const dispatch = useDispatch();
  const { modalStates } = useModal();
  const statesData = modalStates[modalId]?.props;
  const [loading, setLoading] = useState(false);
  const [schedule, setSchedule] = useState<MiniClassType | null>(null);
  const [instructors, setInstructors] =
    useState<{ value: string; key: string }[]>();

  useEffect(() => {
    const getTeachers = async () => {
      try {
        setLoading(true);

        const response = await fetchData<UserType[]>(`admin/users/mentor`);
        console.log({ response });
        const teacherArr: { value: string; key: string }[] = [];

        if (response.data) {
          response.data.map((teacher: UserType) =>
            teacherArr.push({
              value: teacher?._id,
              key: `${teacher.firstName} ${teacher.lastName}`,
            })
          );
          setInstructors(teacherArr);
        }
      } finally {
        setLoading(false);
      }
    };

    if (modalStates[modalId]?.isOpen) getTeachers();
  }, [modalStates[modalId]?.isOpen]);

  useEffect(() => {
    const getCourse = async () => {
      try {
        setLoading(true);
        const response = await fetchData<MiniClassType>(
          `/mini-class/${statesData?.classId}/class`
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
      classUrl: "",
      recordedUrl: "",
      activity: "",
      instructor: "",
    },
    validationSchema: scheduleValidationSchema,
    onSubmit: () => submit(),
  });

  useEffect(() => {
    if (schedule) {
      setValues({
        topic: schedule.topic || "",
        classUrl: schedule.classUrl || "",
        recordedUrl: schedule.recordedUrl || "",
        activity: schedule.activity || "",
        instructor: schedule.instructors[0]?._id || "",
      });
    }
  }, [schedule]);

  const submit = async () => {
    try {
      await updateData(`/mini-class/${statesData?.classId}`, values);
    } finally {
      resetForm();
      dispatch(setReload(true));
      hideModal(modalId);
    }
  };

  return (
    <Modal modalId={modalId}>
      <div className="w-full h-[750px] overflow-visible md:w-[800px]">
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

              <div className="py-2">
                <Input
                  value={values.classUrl}
                  name="classUrl"
                  error={errors.classUrl}
                  onChange={handleChange}
                  label="Class URL"
                  touched={touched.classUrl}
                  placeholder="Enter Class URL"
                  onBlur={handleBlur}
                />
              </div>
              <div className="py-2">
                <SelectInput
                  value={values.activity}
                  name="activity"
                  error={errors.activity}
                  onChange={handleChange}
                  label="Class Activity"
                  touched={touched.activity}
                  options={MINI_CLASS_LIST}
                  onBlur={handleBlur}
                />
              </div>
              <div className="py-2">
                <SelectInput
                  value={values.instructor}
                  name="instructor"
                  error={errors.instructor}
                  onChange={handleChange}
                  label="Select mentor"
                  touched={touched.instructor}
                  options={instructors}
                  onBlur={handleBlur}
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

export default EditMiniClassModal;
