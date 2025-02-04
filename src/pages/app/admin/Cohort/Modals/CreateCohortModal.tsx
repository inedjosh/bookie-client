import { useFormik } from "formik";
import Modal from "../../../../../components/Modal/Modal";
import { useModal } from "../../../../../components/Modal/ModalProvider";
import { useEffect, useState } from "react";
import { createCohortSchema } from "../../../../../schema";
import { Input } from "../../../../../components/Inputs/TextInput";
import { SelectInput } from "../../../../../components/Inputs/SelectInput";
import { Button } from "../../../../../components/Buttons";
import { fetchData, postData } from "../../../../../Utils/fetch";
import { Editor } from "../../../../../components/Inputs/Editor";
import { useDispatch } from "react-redux";
import { setReload } from "../../../../../redux/slices/uiActions.slice";
import { CourseType } from "../../../../../types";
import ModalHeader from "../../../../../components/Modal/ModalHeader";
import { Typography } from "../../../../../components/Typography";

interface ModalComponentProps {
  modalId: string;
}

function CreateCohortModal({ modalId }: ModalComponentProps) {
  const { modalStates, hideModal } = useModal();

  const dispatch = useDispatch();
  const [courses, setCourses] = useState<{ value: string; key: string }[]>();

  useEffect(() => {
    const getCourses = async () => {
      const response = await fetchData<CourseType[]>(`course`);

      const courseArr: { value: string; key: string }[] = [];

      if (response.data) {
        response.data.map((course: CourseType) =>
          courseArr.push({
            value: course._id,
            key: `${course.title}`,
          })
        );
        setCourses(courseArr);
      }
    };

    if (modalStates[modalId]?.isOpen) getCourses();
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
      cohortName: "",
      course: "",
      description: "",
      startDate: "",
    },
    validationSchema: createCohortSchema,
    onSubmit: () => submit(),
  });

  const submit = async () => {
    try {
      await postData("cohort", values);
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
          Create Cohort
        </Typography>
      </ModalHeader>
      <div className="w-full h-[700px] px-5 md:px-10 overflow-visible md:w-[600px]">
        <form onSubmit={handleSubmit} className="mt-10">
          <div className="py-2">
            <Input
              value={values.cohortName}
              name="cohortName"
              handleBlur={handleBlur}
              error={errors.cohortName}
              onChange={handleChange}
              label="cohort Name"
              touched={touched.cohortName}
              placeholder="Enter cohort Name"
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
              placeholder="Enter course description"
              onBlur={handleBlur}
            />
          </div>
          <div className="py-2">
            <Input
              value={values.startDate}
              name="startDate"
              error={errors.startDate}
              onChange={handleChange}
              label="startDate"
              touched={touched.startDate}
              onBlur={handleBlur}
              type="date"
            />
          </div>
          <div className="py-2">
            <SelectInput
              value={values.course}
              name="course"
              handleBlur={handleBlur}
              error={errors.course}
              onChange={handleChange}
              label="Choose Course"
              touched={touched.course}
              options={courses}
            />
          </div>

          <div className="pb-20 mt-10 w-full">
            <Button
              type="submit"
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              Create{" "}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}

export default CreateCohortModal;
