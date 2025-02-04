import Modal from "../../../../../components/Modal/Modal";
import { useModal } from "../../../../../components/Modal/ModalProvider";
import { useEffect, useState } from "react";
import { fetchData } from "../../../../../Utils/fetch";
import { QuizType } from "../../../../../types";
import ModalHeader from "../../../../../components/Modal/ModalHeader";
import { Typography } from "../../../../../components/Typography";
import Skeleton from "../../../../../components/Skeleton";

interface ModalComponentProps {
  modalId: string;
}

function QuizDetailsModal({ modalId }: ModalComponentProps) {
  const { modalStates } = useModal();
  const quizId = modalStates[modalId]?.props?.quizId;
  const [loading, setLoading] = useState(true);
  const [quizData, setQuizData] = useState<QuizType | null>(null);

  useEffect(() => {
    const fetchQuizDetails = async () => {
      try {
        const response = await fetchData<QuizType>(`/quiz/${quizId}`);
        if (response.data) {
          setQuizData(response.data);
        }
      } finally {
        setLoading(false);
      }
    };

    if (modalStates[modalId]?.isOpen) fetchQuizDetails();
  }, [modalStates[modalId]?.isOpen, quizId]);

  return (
    <Modal modalId={modalId}>
      <ModalHeader modalId={modalId}>
        <Typography variant="subheading" className="text-lg font-bold">
          Quiz Details
        </Typography>
      </ModalHeader>
      <div className="w-full h-[600px] overflow-y-auto px-6 md:px-10 mt-6">
        {loading ? (
          <Skeleton />
        ) : quizData ? (
          <div className="space-y-6 pb-20 w-full md:w-[800px] ">
            {/* Quiz Topic */}
            <div>
              <Typography variant="heading2" className="text-xl font-semibold">
                {quizData.topic}
              </Typography>
              <Typography
                className="text-gray-600 mt-1"
                dangerouslySetInnerHTML={{ __html: quizData.description }}
              />
            </div>

            {/* Associated Course */}
            <div>
              <Typography
                variant="subheading"
                className="text-lg font-semibold"
              >
                Course
              </Typography>
              <Typography className="text-gray-800">
                {quizData.course.name}
              </Typography>
            </div>

            {/* Questions */}
            <div>
              <Typography
                variant="subheading"
                className="text-lg font-semibold"
              >
                Questions
              </Typography>
              <div className="space-y-4 mt-4">
                {quizData.quiz.map((question, index) => (
                  <div
                    key={index}
                    className="p-4 bg-gray-50 rounded-lg shadow-md space-y-2"
                  >
                    <Typography className="font-medium text-gray-800">
                      {index + 1}. {question.question}
                    </Typography>
                    <div className="space-y-1">
                      {question.options.map((option, optIndex) => (
                        <div
                          key={optIndex}
                          className={`p-2 rounded-md ${
                            option === question.correctAnswer
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100"
                          }`}
                        >
                          {String.fromCharCode(65 + optIndex)}. {option}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <Typography className="text-red-500">Quiz data not found</Typography>
        )}
      </div>
    </Modal>
  );
}

export default QuizDetailsModal;
