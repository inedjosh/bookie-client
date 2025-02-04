import Modal from "../../../../../components/Modal/Modal";
import { Typography } from "../../../../../components/Typography";
import { useModal } from "../../../../../components/Modal/ModalProvider";
import { useEffect, useState } from "react";
import { fetchData, updateData } from "../../../../../Utils/fetch";
import { Button } from "../../../../../components/Buttons";
import { setReload } from "../../../../../redux/slices/uiActions.slice";
import { useDispatch } from "react-redux";
import { SelectInput } from "../../../../../components/Inputs/SelectInput";
import { useFormik } from "formik";
import { assignTeacherSchema } from "../../../../../schema";
import { UserType } from "../../../../../types";
import { AssignTeacherSkeleton } from "../Components/Skeleton";
import ModalHeader from "../../../../../components/Modal/ModalHeader";

interface ModalComponentProps {
  modalId: string;
}

function AssignTeacherToCohortModal({ modalId }: ModalComponentProps) {
  const { modalStates, hideModal } = useModal();
  const cohortId = modalStates[modalId]?.props?.cohortId;
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [teachers, setTeachers] = useState<{ value: string; key: string }[]>();

  useEffect(() => {
    const getTeachers = async () => {
      try {
        setLoading(true);

        const response = await fetchData<UserType[]>(`admin/users/teacher`);

        const teacherArr: { value: string; key: string }[] = [];

        if (response.data) {
          response.data.map((teacher: UserType) =>
            teacherArr.push({
              value: teacher._id,
              key: `${teacher.firstName} ${teacher.lastName}`,
            })
          );
          setTeachers(teacherArr);
        }
      } finally {
        setLoading(false);
      }
    };

    if (modalStates[modalId]?.isOpen) getTeachers();
  }, [modalStates[modalId]?.isOpen]);

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
      teacher: "",
    },
    validationSchema: assignTeacherSchema,
    onSubmit: () => submit(),
  });

  const submit = async () => {
    try {
      await updateData(`cohort/${cohortId}/assign-teacher`, values);
    } finally {
      resetForm();
      dispatch(setReload(true));
      hideModal(modalId);
    }
  };

  return (
    <Modal modalId={modalId}>
      <ModalHeader modalId={modalId}>
        <Typography variant="subheading" as="h2">
          Assign Teacher
        </Typography>
      </ModalHeader>
      <div className="w-full h-[250px] px-5 md:px-10 overflow-visible md:w-[500px]">
        {loading ? (
          <AssignTeacherSkeleton />
        ) : (
          <form onSubmit={handleSubmit}>
            <Typography variant="subheading" as="h2" className="my-5">
              Assign a teacher to this cohort
            </Typography>
            <SelectInput
              value={values.teacher}
              name="teacher"
              handleBlur={handleBlur}
              error={errors.teacher}
              onChange={handleChange}
              label="Select Teacher"
              touched={touched.teacher}
              options={teachers}
            />
            <div className="flex mt-10 justify-between">
              <Button
                variant="destructive"
                loading={isSubmitting}
                disabled={isSubmitting}
                type="submit"
              >
                Assign
              </Button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
}

export default AssignTeacherToCohortModal;
