import { useFormik } from "formik";
import Modal from "../../../../../components/Modal/Modal";
import { useModal } from "../../../../../components/Modal/ModalProvider";
import { useEffect, useState } from "react";
import { updateTaskSchema } from "../../../../../schema";
import { Button } from "../../../../../components/Buttons";
import { fetchData, updateData } from "../../../../../Utils/fetch";
import { AssignmentType, QuizType, TaskType } from "../../../../../types";
import EditCourseSkeleton from "../Components/EditTaskSkeleton";
import { useDispatch, useSelector } from "react-redux";
import { setReload } from "../../../../../redux/slices/uiActions.slice";
import ModalHeader from "../../../../../components/Modal/ModalHeader";
import { Typography } from "../../../../../components/Typography";
import { SelectInput } from "../../../../../components/Inputs/SelectInput";
import { RootState } from "../../../../../redux/store";
import { TASK_TYPE } from "../../../../../constants";

interface ModalComponentProps {
  modalId: string;
}

function EditTaskModal({ modalId }: ModalComponentProps) {
  const { hideModal } = useModal();
  const dispatch = useDispatch();
  const { modalStates } = useModal();
  const taskId = modalStates[modalId]?.props?.taskId;
  const [loading, setLoading] = useState(false);
  const { cohort } = useSelector((state: RootState) => state.auth);

  const [quizList, setQuizList] = useState<{ key: string; value: string }[]>(
    []
  );
  const [assignmentList, setAssignmentList] = useState<
    { key: string; value: string }[]
  >([]);
  const [peerList, setPeerList] = useState<{ key: string; value: string }[]>(
    []
  );

  useEffect(() => {
    const getCourse = async () => {
      if (!cohort?.course._id || !taskId) return;

      try {
        setLoading(true);

        const [taskResponse, quizResponse, assignmentResponse, peerResponse] =
          await Promise.all([
            fetchData<TaskType>(`/task/${taskId}`),
            fetchData<QuizType[]>(`/quiz/${cohort.course._id}/course`),
            fetchData<AssignmentType[]>(
              `/assignment/${cohort.course._id}/course`
            ),
            fetchData<AssignmentType[]>(`/peer/${cohort.course._id}/course`),
          ]);

        const { data: taskData } = taskResponse;
        const { data: quizData } = quizResponse;
        const { data: assignmentData } = assignmentResponse;
        const { data: peerData } = peerResponse;

        setValues((prevValues) => ({
          ...prevValues,
          task: taskData?.task?._id || "",
          taskType: taskData?.taskType || "",
          submissionType: taskData?.submissionType || "",
        }));

        const quizArr =
          quizData?.map(({ topic, _id }) => ({
            key: topic,
            value: _id,
          })) || [];

        const assignmentArr =
          assignmentData?.map(({ topic, _id }) => ({
            key: topic,
            value: _id,
          })) || [];

        const peerArr =
          peerData?.map(({ topic, _id }) => ({
            key: topic,
            value: _id,
          })) || [];

        setQuizList(quizArr);
        setAssignmentList(assignmentArr);
        setPeerList(peerArr);
      } catch (error) {
        console.error("Error fetching course data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (modalStates[modalId]?.isOpen) {
      getCourse();
    }
  }, [cohort?.course?._id, taskId, modalStates[modalId]?.isOpen]);

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
      taskType: "",
      task: "",
      submissionType: "",
    },
    validationSchema: updateTaskSchema,
    onSubmit: () => submit(),
  });

  const submit = async () => {
    try {
      console.log(values, quizList, assignmentList);
      await updateData(`/task/${taskId}`, values);
    } finally {
      resetForm();
      dispatch(setReload(true));
      hideModal(modalId);
    }
  };

  return (
    <Modal modalId={modalId}>
      <div className="w-full h-[600px] overflow-visible md:w-[700px]">
        {loading ? (
          <EditCourseSkeleton />
        ) : (
          <div>
            <ModalHeader modalId={modalId}>
              <Typography variant="subheading">Update Task</Typography>
            </ModalHeader>
            <form onSubmit={handleSubmit} className="px-5 md:px-10 mt-10">
              <div className="py-2">
                <SelectInput
                  value={values.taskType}
                  name="taskType"
                  handleBlur={handleBlur}
                  error={errors.taskType}
                  onChange={handleChange}
                  label="Task Type"
                  touched={touched.taskType}
                  options={[
                    { key: "Quiz", value: "Quiz" },
                    { key: "Assignment", value: "Assignment" },
                    { key: "Peer", value: "Peer" },
                  ]}
                />
              </div>

              <div className="py-2">
                {values.taskType && values.taskType === TASK_TYPE.QUIZ ? (
                  <SelectInput
                    value={values.task}
                    name="task"
                    handleBlur={handleBlur}
                    error={errors.task}
                    onChange={handleChange}
                    label="Select Task"
                    touched={touched.task}
                    options={quizList}
                  />
                ) : null}
                {values.taskType && values.taskType === TASK_TYPE.ASSIGNMENT ? (
                  <SelectInput
                    value={values.task}
                    name="task"
                    handleBlur={handleBlur}
                    error={errors.task}
                    onChange={handleChange}
                    label="Select Task"
                    touched={touched.task}
                    options={assignmentList}
                  />
                ) : null}
                {values.taskType && values.taskType === TASK_TYPE.PEER ? (
                  <SelectInput
                    value={values.task}
                    name="task"
                    handleBlur={handleBlur}
                    error={errors.task}
                    onChange={handleChange}
                    label="Select Task"
                    touched={touched.task}
                    options={peerList}
                  />
                ) : null}
              </div>
              <div className="py-2">
                <SelectInput
                  value={values.submissionType}
                  name="submissionType"
                  handleBlur={handleBlur}
                  error={errors.submissionType}
                  onChange={handleChange}
                  label="Task submission type"
                  touched={touched.submissionType}
                  options={[
                    { value: "pdf", key: "PDF" },
                    { value: "csv", key: "CSV" },
                    { value: "zip", key: "ZIP" },
                    { value: "quiz", key: "QUIZ" },
                  ]}
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
          </div>
        )}
      </div>
    </Modal>
  );
}

export default EditTaskModal;
