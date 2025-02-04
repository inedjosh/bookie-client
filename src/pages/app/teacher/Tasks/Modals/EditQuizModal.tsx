import { useFormik } from "formik";
import Modal from "../../../../../components/Modal/Modal";
import { useModal } from "../../../../../components/Modal/ModalProvider";
import { Input } from "../../../../../components/Inputs/TextInput";
import { Button } from "../../../../../components/Buttons";
import { useDispatch, useSelector } from "react-redux";
import { setReload } from "../../../../../redux/slices/uiActions.slice";
import { fetchData, updateData } from "../../../../../Utils/fetch";
import { useEffect, useState } from "react";
import { QuizType } from "../../../../../types";
import ModalHeader from "../../../../../components/Modal/ModalHeader";
import { Typography } from "../../../../../components/Typography";
import EditContentSkeleton from "../../Content/Components/EditContentSkeleton";
import { createQuizSchema } from "../../../../../schema";
import { Editor } from "../../../../../components/Inputs/Editor";
import { RootState } from "../../../../../redux/store";

interface ModalComponentProps {
  modalId: string;
}

function EditQuizModal({ modalId }: ModalComponentProps) {
  const { hideModal, modalStates } = useModal();
  const quizId = modalStates[modalId]?.props?.quizId;
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [initialLoading, setInitialLoading] = useState(true);
  const { cohort } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const fetchQuizAndCourses = async () => {
      try {
        setLoading(true);

        // Fetch quiz
        const quizResponse = await fetchData<QuizType>(`/quiz/${quizId}`);
        if (quizResponse.data) {
          const quizData = quizResponse.data;
          setFieldValue("description", quizData.description);
          setFieldValue("topic", quizData.topic);
          setFieldValue("course", quizData.course._id);
          setFieldValue("quiz", quizData.quiz || []);
        }
      } finally {
        setLoading(false);
        setInitialLoading(false);
      }
    };

    if (modalStates[modalId]?.isOpen) fetchQuizAndCourses();
  }, [modalStates[modalId]?.isOpen, quizId]);

  const {
    handleSubmit,
    isSubmitting,
    touched,
    values,
    resetForm,
    handleBlur,
    handleChange,
    setFieldValue,
    errors,
  } = useFormik({
    initialValues: {
      description: "",
      topic: "",
      course: "",
      quiz: [{ question: "", options: ["", "", "", ""], correctAnswer: "" }],
    },
    validationSchema: createQuizSchema,
    onSubmit: async () => {
      try {
        await updateData(`quiz/${quizId}`, {
          ...values,
          course: cohort?.course._id,
        });
      } finally {
        resetForm();
        dispatch(setReload(true));
        hideModal(modalId);
      }
    },
  });

  const addQuestion = () => {
    setFieldValue("quiz", [
      ...values.quiz,
      { question: "", options: ["", "", "", ""], correctAnswer: "" },
    ]);
  };

  const removeQuestion = (questionIndex: number) => {
    const updatedQuiz = values.quiz.filter(
      (_, index) => index !== questionIndex
    );
    setFieldValue("quiz", updatedQuiz);
  };

  const updateQuestion = (
    e: React.ChangeEvent<HTMLInputElement>,
    questionIndex: number,
    optionIndex?: number
  ) => {
    const { name, value } = e.target;
    const updatedQuiz = [...values.quiz];

    if (optionIndex !== undefined) {
      updatedQuiz[questionIndex].options[optionIndex] = value;
    } else {
      updatedQuiz[questionIndex] = {
        ...updatedQuiz[questionIndex],
        [name]: value,
      };
    }

    setFieldValue("quiz", updatedQuiz);
  };

  return (
    <Modal modalId={modalId}>
      <ModalHeader modalId={modalId}>
        <Typography variant="subheading">Edit Quiz</Typography>
      </ModalHeader>
      <div className="w-full h-[700px] overflow-scroll px-5 md:px-10 mt-10 md:w-[800px]">
        {loading || initialLoading ? (
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
                label="Quiz Topic"
                touched={touched.topic}
                placeholder="Enter quiz topic"
                type="text"
              />
            </div>
            <div className="py-2">
              <Editor
                value={values.description}
                name="description"
                error={errors.description}
                onChange={handleChange}
                label="Quiz Description"
                touched={touched.description}
                placeholder="Enter quiz description"
                onBlur={handleBlur}
              />
            </div>

            {values.quiz.map((q, i) => (
              <div key={i} className=" py-10 border-b">
                <div className="flex justify-between items-center">
                  <Typography variant="subheading">{`Question ${
                    i + 1
                  }`}</Typography>
                  <Typography
                    className="text-red-500"
                    onClick={() => removeQuestion(i)}
                  >
                    Remove
                  </Typography>
                </div>
                <Input
                  value={q.question}
                  name="question"
                  handleBlur={handleBlur}
                  onChange={(e) => updateQuestion(e, i)}
                  label=""
                  touched={touched.quiz?.[i]?.question}
                  placeholder={`Enter question ${i + 1}`}
                  type="text"
                />
                <div className="flex my-2 flex-wrap">
                  {q.options.map((option, j) => (
                    <Input
                      key={j}
                      value={option}
                      name={`option_${j}`}
                      handleBlur={handleBlur}
                      onChange={(e) => updateQuestion(e, i, j)}
                      label={`Option ${j + 1}`}
                      placeholder={`Enter option ${j + 1}`}
                      type="text"
                      className="w-[135px] mx-2"
                    />
                  ))}
                </div>
                <Input
                  value={q.correctAnswer}
                  name="correctAnswer"
                  handleBlur={handleBlur}
                  onChange={(e) => updateQuestion(e, i)}
                  label="Correct Answer"
                  placeholder="Enter the correct answer"
                  type="text"
                />
              </div>
            ))}

            <Button type="button" onClick={addQuestion} className="mt-4">
              Add Question
            </Button>

            <div className="pb-20 mt-10 w-full">
              <Button
                type="submit"
                loading={isSubmitting}
                disabled={isSubmitting}
              >
                Save Changes
              </Button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
}

export default EditQuizModal;
