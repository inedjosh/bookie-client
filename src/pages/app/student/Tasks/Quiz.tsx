import { RiHomeSmile2Fill } from "react-icons/ri";
import { Typography } from "../../../../components/Typography";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { IoChevronForward } from "react-icons/io5";
import { ColorStar, StopWatchImg } from "../../../../assets";
import { useEffect, useState } from "react";
import { fetchData, postData } from "../../../../Utils/fetch";
import { QuizType, TaskType } from "../../../../types";
import { IoIosArrowRoundBack, IoIosArrowRoundForward } from "react-icons/io";
import { Button } from "../../../../components/Buttons";
import { RootState } from "../../../../redux/store";

function Quiz() {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);

  const { id } = useParams();
  const [task, setTask] = useState<TaskType | null>(null);
  const [quiz, setQuiz] = useState<
    {
      _id: string;
      question: string;
      options: string[];
      correctAnswer: string;
      createdAt: string;
      number: number;
      answered: boolean;
      selectedOption: string;
      isCorrect: boolean;
    }[]
  >([]);
  const [timeRemaining, setTimeRemaining] = useState(600); // 10 minutes in seconds
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(1);
  const [correctAnswer, setCorrectAnswer] = useState(0);
  const [seeScores, setSeeScore] = useState(false);
  const PASS_MARK = 3;

  // Load saved selectedQuiz from localStorage
  useEffect(() => {
    const savedSelectedQuiz = localStorage.getItem("selected_quiz");
    if (savedSelectedQuiz) {
      setSelectedQuiz(parseInt(savedSelectedQuiz, 10));
    }
  }, []);

  useEffect(() => {
    const savedCorrectScore = localStorage.getItem("correct_score");
    console.log({ savedCorrectScore });
    if (savedCorrectScore) {
      setCorrectAnswer(parseInt(savedCorrectScore, 10));
    }
  }, []);

  useEffect(() => {
    // Check if 'see_score' is saved in localStorage when component mounts
    const savedSeeScore = localStorage.getItem("see_score");
    if (savedSeeScore) {
      setSeeScore(JSON.parse(savedSeeScore));
    }
  }, []);

  useEffect(() => {
    // Check if 'see_score' is saved in localStorage when component mounts
    const savedQuizSubmitted = localStorage.getItem("quiz_submitted");
    if (savedQuizSubmitted) {
      setQuizSubmitted(JSON.parse(savedQuizSubmitted));
    }
  }, []);

  useEffect(() => {
    // Check if 'quiz_data' is saved in localStorage when component mounts
    const savedQuizData = localStorage.getItem("quiz_data");
    if (savedQuizData) {
      setQuiz(JSON.parse(savedQuizData));
    }
  }, []);

  const handleSeeScoreChange = (value: boolean) => {
    // Update both localStorage and the state
    localStorage.setItem("see_score", JSON.stringify(value));
    setSeeScore(value);
  };

  const handleQuizSubmittedChange = (value: boolean) => {
    // Update both localStorage and the state
    localStorage.setItem("quiz_submitted", JSON.stringify(value));
    setQuizSubmitted(value);
  };

  const handleSaveCorrectAnswerChange = (value: number) => {
    // Update both localStorage and the state
    localStorage.setItem("correct_score", JSON.stringify(value));
    setCorrectAnswer(value);
  };

  // Save selectedQuiz to localStorage whenever it changes
  const setSelectQuizCall = (quizNumber: number) => {
    if (quizSubmitted && seeScores) {
      setSelectedQuiz(quizNumber);
      localStorage.setItem("selected_quiz", quizNumber.toString());
      setSeeScore(false);
    } else {
      setSelectedQuiz(quizNumber);
      localStorage.setItem("selected_quiz", quizNumber.toString());
    }
  };

  useEffect(() => {
    const getTaskDetails = async () => {
      try {
        // setLoading(true);
        const response = await Promise.all([
          fetchData<TaskType>(`/task/${id}`),
        ]);

        setTask(response[0].data || null);
      } finally {
        // setLoading(false);
      }
    };

    if (id) getTaskDetails();
  }, [id]);

  useEffect(() => {
    if (task?.task && "quiz" in (task.task as QuizType)) {
      const storedQuiz = localStorage.getItem("quiz_data");
      let savedAnswers = storedQuiz ? JSON.parse(storedQuiz) : [];

      const quizArray = (task.task as QuizType).quiz.map((q, index) => {
        const savedAnswer = savedAnswers.find(
          (s: { _id: string; selectedOption: string; isCorrect: boolean }) =>
            s._id === q._id
        );
        return {
          _id: q._id,
          question: q.question,
          options: q.options,
          correctAnswer: q.correctAnswer,
          createdAt: q.createdAt,
          number: index + 1,
          answered: savedAnswer ? savedAnswer.answered : false,
          selectedOption: savedAnswer ? savedAnswer.selectedOption : "",
          isCorrect: savedAnswer ? savedAnswer.isCorrect : false,
        };
      });

      setQuiz(quizArray);
    }
  }, [task]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (timeRemaining > 0 && !quizSubmitted) {
      timer = setInterval(() => {
        setTimeRemaining((prevTime) => {
          const newTime = prevTime - 1;
          localStorage.setItem("quiz_timer", newTime.toString()); // Save time to localStorage
          return newTime;
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [timeRemaining, quizSubmitted]);

  useEffect(() => {
    const savedQuiz = localStorage.getItem("quiz_data");
    const savedTime = localStorage.getItem("quiz_timer");

    if (savedQuiz) {
      setQuiz(JSON.parse(savedQuiz));
    }

    if (savedTime) {
      setTimeRemaining(parseInt(savedTime, 10));
    }
  }, []);

  const handleOptionSelect = (
    questionIndex: number,
    selectedOption: string
  ) => {
    setQuiz((prevQuiz) => {
      const updatedQuiz = prevQuiz.map((q, index) =>
        index + 1 === questionIndex
          ? {
              ...q,
              answered: true,
              selectedOption,
              isCorrect: selectedOption === q.correctAnswer, // Set the isCorrect flag based on selected option
            }
          : q
      );

      localStorage.setItem("quiz_data", JSON.stringify(updatedQuiz)); // Save updated quiz data to localStorage
      return updatedQuiz;
    });
  };

  const handleQuizSubmit = async () => {
    // localStorage.removeItem("quiz_data");
    //   localStorage.removeItem("quiz_timer");

    const correctAnswers = quiz.filter((q) => q.isCorrect).length;
    handleSaveCorrectAnswerChange(correctAnswers);
    // if (correctAnswers > PASS_MARK) {
    //Submit to backend

    await postData(`task/submit/${id}`, {
      student: user._id,
      weekNumber: task?.weekNumber,
      dayNumber: task?.dayNumber,
      score: correctAnswers,
    });

    handleSeeScoreChange(true);
    handleQuizSubmittedChange(true);
  };
  // else {
  //   handleSeeScoreChange(true);
  //   handleQuizSubmittedChange(true);
  // }
  // };

  // const retakeQuiz = () => {
  //   localStorage.removeItem("quiz_data");
  //   localStorage.removeItem("quiz_timer");
  //   setQuiz((prevQuiz) =>
  //     prevQuiz.map((q) => ({
  //       ...q,
  //       answered: false,
  //       selectedOption: "",
  //       isCorrect: false,
  //     }))
  //   );
  //   handleQuizSubmittedChange(false);
  //   handleSeeScoreChange(false);
  //   setTimeRemaining(600);
  //   setSelectQuizCall(1);
  //   handleSaveCorrectAnswerChange(0);
  // };

  const resetQuiz = () => {
    localStorage.removeItem("quiz_data");
    localStorage.removeItem("quiz_timer");
    handleQuizSubmittedChange(false);
    handleSeeScoreChange(false);
    setTimeRemaining(600);
    setSelectQuizCall(1);
    handleSaveCorrectAnswerChange(0);
    navigate("/student/overview");
  };

  return (
    <div>
      <header className="flex py-5 px-5 md:px-10 justify-between items-center">
        <div className="flex items-center">
          <div onClick={() => navigate(-1)}>
            <RiHomeSmile2Fill className="text-[#25326A] text-2xl " />
          </div>

          <Typography
            variant="subheading"
            as="h3"
            className="pl-3 flex items-center text-[#ACB4D5]"
          >
            <IoChevronForward className="mx-2" />
            <span className="text-primary">DAILY TASK</span>
            <IoChevronForward className="mx-2" />
            QUIZ
          </Typography>
        </div>
        <div className="flex items-center">
          <img src={StopWatchImg} className="w-7 mr-3" />
          <Typography color="accent" as="h2" variant="heading2">
            {Math.floor(timeRemaining / 60)}: {timeRemaining % 60}
          </Typography>
        </div>
      </header>
      <div className="bg-[#EBEDF5] px-5 py-2 flex justify-between">
        {!quizSubmitted && !seeScores ? (
          <div
            onClick={() =>
              selectedQuiz > 1 && setSelectQuizCall(selectedQuiz - 1)
            }
            className="w-8 h-8 flex justify-center items-center rounded-full bg-white"
          >
            <IoIosArrowRoundBack className="text-blackText text-3xl" />
          </div>
        ) : null}
        <div
          onClick={() =>
            selectedQuiz > 1 && setSelectQuizCall(selectedQuiz - 1)
          }
          className="w-8 h-8 flex justify-center items-center rounded-full bg-white"
        >
          <IoIosArrowRoundBack className="text-blackText text-3xl" />
        </div>
        <div className="flex items-center">
          {quiz.map((quiz) =>
            quizSubmitted ? (
              <>
                {/* {seeScores && correctAnswer > PASS_MARK ? (
                  <div className="mx-2 border-r-2 pr-4  ">
                    <div
                      onClick={() => setSelectQuizCall(quiz.number)}
                      className={`w-[30px] cursor-pointer h-[30px] flex justify-center items-center border-[#DDE0EE] ${
                        selectedQuiz === quiz.number
                          ? "bg-primary rounded-[5px] "
                          : ""
                      } `}
                      key={quiz._id}
                    >
                      <Typography
                        className={`${
                          quiz.isCorrect ? "text-accent" : "text-destructive"
                        } `}
                      >
                        {quiz.number}
                      </Typography>
                    </div>
                  </div>
                ) : ( */}
                <>
                  <div className="mx-2 border-r-2 pr-4  ">
                    <div
                      onClick={() => setSelectQuizCall(quiz.number)}
                      className={`w-[30px] cursor-pointer h-[30px] flex justify-center items-center border-[#DDE0EE] ${
                        selectedQuiz === quiz.number
                          ? "bg-primary rounded-[5px] "
                          : ""
                      } `}
                      key={quiz._id}
                    >
                      <Typography
                        className={`${
                          quiz.isCorrect ? "text-accent" : "text-destructive"
                        } `}
                      >
                        {quiz.number}
                      </Typography>
                    </div>
                  </div>
                  {/* )} */}
                </>
                {/* )} */}
              </>
            ) : (
              <div className="mx-2 border-r-2 pr-4  ">
                <div
                  onClick={() => setSelectQuizCall(quiz.number)}
                  className={`w-[30px] h-[30px]  cursor-pointer flex justify-center items-center border-[#DDE0EE] ${
                    selectedQuiz === quiz.number
                      ? "bg-primary rounded-[5px] "
                      : ""
                  } `}
                  key={quiz._id}
                >
                  <Typography
                    className={`${
                      quiz.answered ? "text-[#121212]" : "text-[#8A95C3]"
                    } `}
                  >
                    {quiz.number}
                  </Typography>
                </div>
              </div>
            )
          )}
        </div>
        {!quizSubmitted && !seeScores ? (
          <div
            onClick={() =>
              selectedQuiz < quiz.length && setSelectQuizCall(selectedQuiz + 1)
            }
            className="w-8 h-8 flex justify-center items-center rounded-full bg-white"
          >
            <IoIosArrowRoundForward className="text-blackText text-3xl" />
          </div>
        ) : null}
        <div
          onClick={() =>
            selectedQuiz < quiz.length && setSelectQuizCall(selectedQuiz + 1)
          }
          className="w-8 h-8 flex justify-center items-center rounded-full bg-white"
        >
          <IoIosArrowRoundForward className="text-blackText text-3xl" />
        </div>
      </div>
      {!quizSubmitted ? (
        <div className="h-screen pt-10 bg-[#F0F0F0] px-5 md:px-20">
          <Typography as="h3" className="" variant="heading2" color="muted-alt">
            Question {quiz[selectedQuiz - 1]?.number}
          </Typography>
          <Typography className="mt-10" variant="body" color="blackText">
            {quiz[selectedQuiz - 1]?.question}
          </Typography>
          <div className="mt-5">
            {quiz[selectedQuiz - 1]?.options.map((option, index) => (
              <div
                onClick={() => handleOptionSelect(selectedQuiz, option)}
                className={`rounded-full w-full py-3  flex items-center my-3 ${
                  option === quiz[selectedQuiz - 1]?.selectedOption
                    ? "bg-[#EBEDF5] border-[#354898] border"
                    : "bg-white"
                }`}
              >
                <Typography
                  className={`pl-3  text-[#6A6A6A] ${
                    option === quiz[selectedQuiz - 1]?.selectedOption
                      ? "text-[#354898] border-#ACB4D5"
                      : ""
                  }}`}
                  variant="body"
                >
                  <strong>{String.fromCharCode(65 + index)}.</strong>{" "}
                  <span className="pl-3"> {option}</span>
                </Typography>
              </div>
            ))}
          </div>
          <div className="justify-end  items-center flex mt-20">
            <div className="w-[150px]">
              <Typography
                className="ml-5 text-primary"
                variant="link"
                onClick={() =>
                  selectedQuiz > 1 && setSelectQuizCall(selectedQuiz - 1)
                }
              >
                Back
              </Typography>
            </div>
            <div className="w-[200px]">
              {selectedQuiz === quiz.length ? (
                <Button
                  size="lg"
                  onClick={() => handleQuizSubmit()} // You can trigger the submit action here
                >
                  Submit
                </Button>
              ) : (
                <Button
                  size="lg"
                  onClick={() =>
                    selectedQuiz < quiz.length &&
                    setSelectedQuiz(selectedQuiz + 1)
                  }
                >
                  Next
                </Button>
              )}
            </div>
          </div>
        </div>
      ) : null}
      {quizSubmitted && !seeScores ? (
        <div className="h-screen pt-10 bg-[#F0F0F0] px-5 md:px-20">
          <Typography as="h3" className="" variant="heading2" color="muted-alt">
            Question {quiz[selectedQuiz - 1]?.number}
          </Typography>
          <Typography className="mt-10" variant="body" color="blackText">
            {quiz[selectedQuiz - 1]?.question}
          </Typography>
          <div className="mt-5">
            {quiz[selectedQuiz - 1]?.options.map((option, index) => (
              <div
                className={`rounded-full w-full py-3 border flex items-center my-3 ${
                  option === quiz[selectedQuiz - 1]?.correctAnswer
                    ? "bg-[#EBEDF5] border-accent" // Correct answer with accent border
                    : option === quiz[selectedQuiz - 1]?.selectedOption &&
                      option !== quiz[selectedQuiz - 1]?.correctAnswer
                    ? "bg-[#FCE4E4] border-destructive" // Wrong answer with destructive border
                    : "bg-white border-neutral-200" // Plain background for others
                }`}
              >
                <Typography
                  className={`pl-3 text-[#6A6A6A] ${
                    option === quiz[selectedQuiz - 1]?.selectedOption
                      ? "text-[#354898] border-#ACB4D5" // Highlight selected option
                      : ""
                  }`}
                  variant="body"
                >
                  <strong>{String.fromCharCode(65 + index)}.</strong>{" "}
                  <span className="pl-3"> {option}</span>
                </Typography>
              </div>
            ))}
          </div>
          <div className="justify-end  items-center flex mt-20">
            <div className="w-[150px]">
              <Typography
                className="ml-5 text-primary"
                variant="link"
                onClick={() =>
                  selectedQuiz > 1 && setSelectQuizCall(selectedQuiz - 1)
                }
              >
                Back
              </Typography>
            </div>
            <div className="w-[200px]">
              {selectedQuiz === quiz.length ? (
                <Button
                  size="lg"
                  onClick={() => handleSeeScoreChange(true)} // You can trigger the submit action here
                >
                  See Scores
                </Button>
              ) : (
                <Button
                  size="lg"
                  onClick={() =>
                    selectedQuiz < quiz.length &&
                    setSelectedQuiz(selectedQuiz + 1)
                  }
                >
                  Next
                </Button>
              )}
            </div>
          </div>
        </div>
      ) : null}
      {quizSubmitted && seeScores ? (
        <div
          className={`h-screen pt-10 ${
            correctAnswer > PASS_MARK ? "bg-[#F2FBE5]" : "bg-[#F9ECEC]"
          } px-5 md:px-20 flex w-full  h-full flex-col items-center`}
        >
          <Typography
            as="h3"
            className={`${
              correctAnswer > PASS_MARK ? "text-[#016F09]" : "text-[#A12121]"
            } mt-32`}
            variant="heading2"
            color="muted-alt"
          >
            {correctAnswer > PASS_MARK
              ? "Congratulations! You Passed!"
              : "Oops! You Can do better!"}
          </Typography>
          <div className="flex w-full flex-col justify-center mt-5 items-center">
            <div className="flex items-center">
              <img src={ColorStar} className="w-14" />
              {correctAnswer > PASS_MARK ? (
                <div>
                  <Typography
                    className="text-[#B8C8A2]"
                    variant="heading2"
                    color="muted-alt"
                  >
                    <span className="font-[BebasNeue] text-blackText  text-9xl">
                      {correctAnswer}
                    </span>
                    /{quiz.length}
                  </Typography>
                  <Typography
                    className="text-[#B8C8A2]"
                    variant="heading2"
                    color="muted-alt"
                  >
                    Points received
                  </Typography>
                </div>
              ) : (
                <div>
                  <Typography
                    className="text-[#C9A8A6]"
                    variant="heading2"
                    color="muted-alt"
                  >
                    <span className="font-[BebasNeue] text-blackText  text-9xl">
                      {correctAnswer}
                    </span>
                    /{quiz.length}
                  </Typography>{" "}
                  <Typography
                    className="text-[#C9A8A6]"
                    variant="heading2"
                    color="muted-alt"
                  >
                    Points received
                  </Typography>
                </div>
              )}
            </div>
            <div>
              {correctAnswer > PASS_MARK ? (
                <Button
                  onClick={() => resetQuiz()}
                  size="lg"
                  className=" mt-5 text-[#B8C8A2]"
                >
                  Back to Dashboard
                </Button>
              ) : (
                <Button
                  onClick={() => resetQuiz()}
                  size="lg"
                  className=" mt-5 text-[#C9A8A6]"
                >
                  Back to Dashboard
                </Button>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default Quiz;
