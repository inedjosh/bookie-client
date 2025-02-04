import Modal from "../../../../../components/Modal/Modal";
import { SubmissionType, TaskType } from "../../../../../types";
import { Typography } from "../../../../../components/Typography";
import { useModal } from "../../../../../components/Modal/ModalProvider";
import { useEffect, useState } from "react";
import { fetchData, postData } from "../../../../../Utils/fetch";
import ContentDetailsSkeleton from "../Components/TaskDetailsSkeleton";
import { Button } from "../../../../../components/Buttons";
import ModalHeader from "../../../../../components/Modal/ModalHeader";
import { useNavigate } from "react-router-dom";
import submitTaskSchema from "../../../../../schema";
import { getFileType } from "../../../../../Utils/Helpers";
import { toast } from "react-toastify";
import { uploadFileToFirebase } from "../../../../../firebase";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store";
import { TASK_TYPE } from "../../../../../constants";
import { useFormik } from "formik";
import UploadFile from "../../../../../components/Inputs/UploadInput";
import { AiOutlineDelete } from "react-icons/ai";

enum TASK_SECTION {
  TASK = "task",
  SUBMISSION = "submission",
  GRADE = "grade",
}

const taskSectionArray = [
  TASK_SECTION.TASK,
  TASK_SECTION.SUBMISSION,
  TASK_SECTION.GRADE,
];

interface ModalComponentProps {
  modalId: string;
}

function PeerModal({ modalId }: ModalComponentProps) {
  const { modalStates, hideModal } = useModal();
  const taskId = modalStates[modalId]?.props?.taskId;
  const [task, setTask] = useState<TaskType | null>(null);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<TASK_SECTION>(TASK_SECTION.TASK);
  const navigate = useNavigate();
  const [documentUrl, setDocumentUrl] = useState<string>("");
  const [submission, setSubmission] = useState<SubmissionType | null>(null);
  const [loadingDocument, setLoadingDocument] = useState<boolean>(false);
  const { user } = useSelector((state: RootState) => state.auth);
  const [taskHasBeenSubmitted, setTaskHasBeenSubmitted] = useState(false);
  const [editSubmission, setEditSubmission] = useState(false);
  const [documentFile, setDocumentFile] = useState({ type: "", size: 0 });
  console.log(submission, taskHasBeenSubmitted);
  useEffect(() => {
    const getAssignment = async () => {
      try {
        setLoading(true);
        const response = await Promise.all([
          fetchData<TaskType>(`/task/${taskId}`),
          fetchData<SubmissionType>(
            `/task/submission/${taskId}/student/${user._id}`
          ),
        ]);

        setTask(response[0].data || null);
        setSubmission(response[1].data || null);
      } finally {
        setLoading(false);
      }
    };

    if (modalStates[modalId]?.isOpen) {
      getAssignment();
    }
  }, [taskId, modalStates[modalId]?.isOpen]);

  const handleStartQuiz = () => {
    hideModal(modalId);
    navigate(`student/tasks/peer-details/${taskId}`);
  };

  const handleDOcumentUpload = async (file: File) => {
    const fileType = getFileType(file);
    if (fileType !== task?.submissionType) {
      toast.error(
        `You can only submit ${task?.submissionType?.toUpperCase()} files for this task`
      );
      return;
    }

    setLoadingDocument(true);

    try {
      const url = await uploadFileToFirebase(file, "task");
      console.log(url);
      setDocumentUrl(url);
      setDocumentFile({
        type: fileType,
        size: file.size,
      });
      setValues({ ...values, url: url, fileName: `task/${file.name}` });
    } finally {
      setLoadingDocument(false);
    }
  };

  const { isSubmitting, setValues, values, resetForm } = useFormik({
    initialValues: {
      url: "",
      fileName: "",
    },
    validationSchema: submitTaskSchema,
    onSubmit: () => {},
  });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await postData(`/task/submit/${taskId}`, {
        ...values,
        student: user._id,
        weekNumber: task?.weekNumber,
        dayNumber: task?.dayNumber,
        fileType: task?.submissionType,
        taskQuestion:
          task?.taskType === TASK_TYPE.ASSIGNMENT ? task.task.description : "",
      });
      hideModal(modalId);
      //  dispatch(setReload(true));
    } finally {
      resetForm();
      setValues({ ...values, url: "", fileName: "" });
    }
  };

  return (
    <Modal modalId={modalId}>
      <div className="w-full h-[760px] overflow-visible md:w-[800px]">
        {loading ? (
          <ContentDetailsSkeleton />
        ) : task ? (
          <>
            <ModalHeader modalId={modalId}>
              <div className="flex items-center">
                <Typography variant="subheading" as="h3">
                  {task.cohort.cohortName}
                </Typography>
                <Typography variant="caption" className="ml-3" color="accent">
                  Peer graded assignment
                </Typography>
              </div>
            </ModalHeader>
            <div className="flex mt-10 flex-col">
              <div className="flex px-5 md:px-10 items-center">
                {taskSectionArray.map((section, index) => (
                  <div
                    className={`mr-3 p-3 ${
                      section === selected
                        ? "bg-[#EBEDF5] rounded-[32px] px-4"
                        : ""
                    } cursor-pointer`}
                    onClick={() => setSelected(section)}
                  >
                    <Typography
                      key={index}
                      variant="body"
                      color={section === selected ? "primary" : "muted-alt"}
                      className="font-extrabold"
                    >
                      {section}
                    </Typography>
                  </div>
                ))}
              </div>
              <div>
                {selected === TASK_SECTION.TASK ? (
                  <div className=" px-5 md:px-10">
                    <Typography
                      variant="caption"
                      className="mt-5 pb-2 text-[#6A6A6A]"
                    >
                      <strong> Task Details</strong>{" "}
                    </Typography>
                    <Typography
                      variant="heading2"
                      as="h3"
                      className=" text-[#6A6A6A]"
                    >
                      {task.task.topic}
                    </Typography>
                    <div
                      className=" text-md text-[#6A6A6A]"
                      dangerouslySetInnerHTML={{
                        __html: task.task.description,
                      }}
                    />
                    <Typography
                      variant="caption"
                      className="font-bold pt-3"
                      color="primary"
                    >
                      <strong> Due Date: 20th February</strong>
                    </Typography>
                    <hr className="my-5" />
                    <div className="bg-[#FDF1D8] rounded-[32px] px-10 py-5">
                      <Typography
                        as="h3"
                        variant="heading2"
                        className="py-3 text-[#BC830B]"
                      >
                        INSTRUCTIONS
                      </Typography>

                      <Typography as="p" className="py-3 text-[#212121]">
                        <strong className="text-black">
                          &#x2022; Submission:
                        </strong>
                        <br />
                        <br />
                        After creating your sample user persona in Figma. Export
                        both Personas as single PDfs and upload on the
                        submission panel.
                      </Typography>
                      <Typography as="p" className="py-3 text-[#212121]">
                        <strong className="text-black">&#x2022; Score:</strong>
                        <br /> <br />
                        Your work is graded by your peers, based on a pre
                        determined rubric. This is then used by us to assign
                        final points gotten for the task. Please ensure your
                        work ticks all points on the Grading criteria
                      </Typography>
                    </div>
                    <div className="justify-end pb-10 items-center flex mt-10">
                      <div className="w-[150px]">
                        <Typography
                          className="ml-5 bg-transparent"
                          variant="link"
                          onClick={() => hideModal(modalId)}
                        >
                          Close Task
                        </Typography>
                      </div>
                      <div className="w-[200px]">
                        <Button size="lg" onClick={handleStartQuiz}>
                          Open Task
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : null}
                {selected === TASK_SECTION.SUBMISSION ? (
                  <>
                    <form onSubmit={submit}>
                      <div className="py-2  px-5 md:px-10 mt-5">
                        <div className="flex items-center justify-between">
                          {editSubmission && (
                            <Typography
                              variant="body"
                              onClick={() => {
                                setTaskHasBeenSubmitted(true);
                                setEditSubmission(false);
                              }}
                              color="primary"
                              className="py-3 underline cursor-pointer"
                            >
                              Close Edit
                            </Typography>
                          )}
                        </div>
                        <UploadFile
                          loadingDocument={loadingDocument}
                          type="document"
                          onUpload={handleDOcumentUpload}
                          currentFile={documentUrl}
                          documentName={values.fileName}
                        />
                      </div>

                      <div className="flex  px-5 md:px-10 justify-end">
                        <div className="pb-10  mt-10 w-[150px]">
                          <Button
                            size="lg"
                            type="submit"
                            loading={isSubmitting}
                            disabled={isSubmitting}
                          >
                            {editSubmission ? "Edit" : "Upload"}
                          </Button>
                        </div>
                      </div>
                      <div className="bg-[#F5F5F5] p-5">
                        <Typography as="h2" variant="subheading2">
                          Uploaded
                        </Typography>
                        {values.fileName ? (
                          <div className="w-full mt-2 flex h-full justify-between items-center rounded-[16px] bg-white p-5">
                            <div className="flex items-center">
                              <div className="bg-[#F7F7F7] rounded-[8px] p-2">
                                <Typography
                                  as="h2"
                                  variant="heading2"
                                  className="uppercase"
                                >
                                  {documentFile.type}
                                </Typography>
                              </div>
                              <div className="ml-3">
                                <Typography variant="body">
                                  {values.fileName}
                                </Typography>
                                <Typography variant="xSmall" color="muted-alt">
                                  {documentFile.size}
                                </Typography>
                              </div>
                            </div>
                            <div className="w-[30px] h-[30px] rounded-full bg-[#F7F7F7] flex justify-center items-center">
                              <AiOutlineDelete className="text-md " />
                            </div>
                          </div>
                        ) : null}
                      </div>
                    </form>
                  </>
                ) : null}

                {selected === TASK_SECTION.GRADE ? (
                  <div className=" px-5 md:px-10">
                    <Typography
                      variant="xSmall"
                      className="mt-5 pb-2 text-[#6A6A6A]"
                    >
                      To Pass
                    </Typography>
                    <Typography variant="heading2" as="h3" color="blackText">
                      Score 3 points or above
                    </Typography>

                    <Typography
                      variant="caption"
                      className="font-bold pt-3"
                      color="blackText"
                    >
                      &#x2022;Your work is graded by your peers, based on a pre
                      determined rubric. This is then used by us to assign final
                      points gotten for the task. Please ensure your work ticks
                      all points on the Grading criteria
                    </Typography>
                    <hr className="my-10" />
                    <div className="bg-[#F7F7F7] rounded-[32px] w-full h-[200px] flex justify-center items-center px-10 py-5">
                      <Typography
                        variant="body"
                        className="py-3 text-[#ACB4D5]"
                      >
                        No grade yet
                      </Typography>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </>
        ) : null}
      </div>
    </Modal>
  );
}

export default PeerModal;
