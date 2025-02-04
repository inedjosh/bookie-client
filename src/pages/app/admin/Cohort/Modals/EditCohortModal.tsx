import { useFormik } from "formik";
import Modal from "../../../../../components/Modal/Modal";
import { useModal } from "../../../../../components/Modal/ModalProvider";
import { useEffect, useState } from "react";
import { createCohortSchema } from "../../../../../schema";
import { Input } from "../../../../../components/Inputs/TextInput";
import { SelectInput } from "../../../../../components/Inputs/SelectInput";
import { Button } from "../../../../../components/Buttons";
import { fetchData, updateData } from "../../../../../Utils/fetch";
import { Editor } from "../../../../../components/Inputs/Editor";
import { useDispatch } from "react-redux";
import { setReload } from "../../../../../redux/slices/uiActions.slice";
import { CohortType, CourseType } from "../../../../../types";
import { DaysOfTheWeek } from "../../../../../constants";
import { formatDateForInput } from "../../../../../Utils/Helpers";
import ModalHeader from "../../../../../components/Modal/ModalHeader";
import { Typography } from "../../../../../components/Typography";

interface ModalComponentProps {
  modalId: string;
}

function EditCohortModal({ modalId }: ModalComponentProps) {
  const { modalStates, hideModal } = useModal();
  const cohortId = modalStates[modalId]?.props?.cohortId;
  const dispatch = useDispatch();
  const [courses, setCourses] = useState<{ value: string; key: string }[]>();
  const [lectureDate, setLectureDate] = useState<
    { day: string; time: string }[]
  >([
    { day: "", time: "" },
    { day: "", time: "" },
  ]);

  useEffect(() => {
    setValues({
      ...values,
      lectures: [
        { day: lectureDate[0].day, time: lectureDate[0].time },
        { day: lectureDate[1].day, time: lectureDate[1].time },
      ],
    });
  }, [
    lectureDate[0].day,
    lectureDate[0].time,
    lectureDate[1].day,
    lectureDate[1].time,
  ]);

  useEffect(() => {
    const getCourses = async () => {
      const response = await Promise.all([
        fetchData<CourseType[]>(`course`),
        fetchData<CohortType>(`cohort/${cohortId}`),
      ]);
      const courseArr: { value: string; key: string }[] = [];

      if (response[0].data) {
        response[0].data.map((course: CourseType) =>
          courseArr.push({
            value: course._id,
            key: `${course.title}`,
          })
        );
        setCourses(courseArr);
      }
      if (response[1].data) {
        const cohort = response[1].data;

        setValues({
          ...values,
          cohortName: cohort.cohortName,
          course: cohort.course._id,
          description: cohort.description,
          startDate: formatDateForInput(cohort.startDate as string),
          lectures: [
            { day: cohort.lectures[0].day, time: cohort.lectures[0].time },
            { day: cohort.lectures[1].day, time: cohort.lectures[1].time },
          ],
        });
        setLectureDate([
          { day: cohort.lectures[0].day, time: cohort.lectures[0].time },
          { day: cohort.lectures[1].day, time: cohort.lectures[1].time },
        ]);
      }
    };

    if (modalStates[modalId]?.isOpen) getCourses();
  }, [modalStates[modalId]?.isOpen]);

  const {
    handleSubmit,
    isSubmitting,
    setValues,
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
      lectures: [{ day: "", time: "" }],
    },
    validationSchema: createCohortSchema,
    onSubmit: () => submit(),
  });

  const submit = async () => {
    try {
      await updateData(`cohort/${cohortId}`, values);
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
          Edit Cohort
        </Typography>
      </ModalHeader>
      <div className="w-full h-[800px] px-5 md:px-10 overflow-visible md:w-[800px]">
        <form onSubmit={handleSubmit}>
          <div className="py-2 mt-10">
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
          <div className="py-2">
            {lectureDate.map((lecture, index) => (
              <div key={index} className="flex py-2 justify-between">
                <div className="w-[60%]">
                  <SelectInput
                    value={lecture.day}
                    name={`lectureDay-${index}`} // Unique name per lecture
                    onChange={(e) =>
                      setLectureDate((prev) =>
                        prev.map((item, i) =>
                          i === index ? { ...item, day: e.target.value } : item
                        )
                      )
                    }
                    label="Choose lecture Day"
                    options={DaysOfTheWeek}
                  />
                </div>
                <div className="w-[38%]">
                  <Input
                    value={lecture.time}
                    name={`lectureTime-${index}`} // Unique name per lecture
                    onChange={(e) =>
                      setLectureDate((prev) =>
                        prev.map((item, i) =>
                          i === index ? { ...item, time: e.target.value } : item
                        )
                      )
                    }
                    label="Choose lecture time"
                    type="time"
                  />
                </div>
              </div>
            ))}
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
      </div>
    </Modal>
  );
}

export default EditCohortModal;
