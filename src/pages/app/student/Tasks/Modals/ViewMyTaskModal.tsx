import Modal from "../../../../../components/Modal/Modal";
import { SubmissionType, TaskType } from "../../../../../types";
import { Typography } from "../../../../../components/Typography";
import { useModal } from "../../../../../components/Modal/ModalProvider";
import { useEffect, useState } from "react";
import { fetchData, postData } from "../../../../../Utils/fetch";
import ContentDetailsSkeleton from "../Components/TaskDetailsSkeleton";
import { getFileType, readableDate } from "../../../../../Utils/Helpers";
import ModalHeader from "../../../../../components/Modal/ModalHeader";
import { useFormik } from "formik";
import submitTaskSchema from "../../../../../schema";
import { Button } from "../../../../../components/Buttons";
import UploadFile from "../../../../../components/Inputs/UploadInput";
import { uploadFileToFirebase } from "../../../../../firebase";
import { setReload } from "../../../../../redux/slices/uiActions.slice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store";
import { toast } from "react-toastify";

interface ModalComponentProps {
  modalId: string;
}

function ViewMyTaskModal({ modalId }: ModalComponentProps) {
  const { modalStates, hideModal } = useModal();
  const taskId = modalStates[modalId]?.props?.taskId;
  const [task, setTask] = useState<TaskType | null>(null);
  const [submission, setSubmission] = useState<SubmissionType | null>(null);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(0);
  const [loadingDocument, setLoadingDocument] = useState<boolean>(false);
  const [documentUrl, setDocumentUrl] = useState<string>("");
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const [taskHasBeenSubmitted, setTaskHasBeenSubmitted] = useState(false);
  const [editSubmission, setEditSubmission] = useState(false);

  useEffect(() => {
    const getTask = async () => {
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
      getTask();
    }
  }, [taskId, modalStates[modalId]?.isOpen]);

  const { isSubmitting, setValues, values, resetForm } = useFormik({
    initialValues: {
      url: "",
      fileName: "",
    },
    validationSchema: submitTaskSchema,
    onSubmit: () => {},
  });

  useEffect(() => {
    console.log(
      task?.taskCompletion.map((task) => task.studentId === user._id)
    );
    if (
      task?.taskCompletion.map((task) => task.studentId === user._id).length
    ) {
      setTaskHasBeenSubmitted(true);
    } else {
      setTaskHasBeenSubmitted(false);
    }
  }, [task]);

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
      setValues({ ...values, url: url, fileName: `task/${file.name}` });
      setDocumentUrl("");
    } finally {
      setLoadingDocument(false);
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await postData(`/task/submit/${taskId}`, {
        ...values,
        student: user._id,
        weekNumber: task?.weekNumber,
        dayNumber: task?.dayNumber,
        fileType: task?.submissionType,
        // taskQuestion: task?.description,
      });
      hideModal(modalId);
      dispatch(setReload(true));
    } finally {
      resetForm();
      setValues({ ...values, url: "", fileName: "" });
    }
  };

  return (
    <Modal modalId={modalId}>
      <div className="w-full md:w-[800px] h-full md:h-[700px] overflow-visible ">
        {loading ? (
          <ContentDetailsSkeleton />
        ) : task ? (
          <div className="overflow-scroll">
            <ModalHeader modalId={modalId}>
              <div className="">
                <Typography variant="subheading">
                  {task.cohort.cohortName} - {task.title}
                </Typography>
              </div>
              <div className="flex items-center">
                <Typography variant="caption" color="muted-alt">
                  Due Date:&nbsp;
                  {readableDate(new Date(task.dueDate))}
                </Typography>
                <Typography
                  variant="caption"
                  color="muted-alt"
                  className="pl-3"
                >
                  Points:&nbsp;10
                </Typography>
                <Typography
                  variant="caption"
                  color="muted-alt"
                  className="pl-3"
                >
                  Task Submission File Type:&nbsp;{" "}
                  <strong>{task.submissionType}</strong>
                </Typography>
              </div>
            </ModalHeader>
            <div className="px-5  md:px-10">
              <div className="border-b  cursor-pointer border border-t-0 border-l-0 border-r-0 flex w-fit">
                <div
                  className={`${
                    selected === 0 ? "border-b-2 border-black pb-1" : "pb-1"
                  }`}
                  onClick={() => setSelected(0)}
                >
                  {" "}
                  <Typography
                    variant="body"
                    color={selected === 0 ? "black" : "muted-alt"}
                    className="mt-10 px-2"
                  >
                    Details
                  </Typography>
                </div>
                <div
                  className={`${
                    selected === 1 ? "border-b-2 border-black pb-1" : "pb-1"
                  }`}
                  onClick={() => setSelected(1)}
                >
                  <Typography
                    variant="body"
                    color={selected === 1 ? "black" : "muted-alt"}
                    className="mt-10 px-2"
                  >
                    Submission
                  </Typography>
                </div>
              </div>
              {selected === 0 ? (
                <div className="pb-20">
                  <Typography variant="body" className="mt-10 font-bold ">
                    Question:
                  </Typography>
                  {/* {task.description && (
                    <div className="">
                      <Typography variant="caption" className="py-3">
                        <div
                          dangerouslySetInnerHTML={{
                            __html: task?.description, // This will render the HTML tags correctly
                          }}
                        />
                      </Typography>
                    </div>
                  )} */}
                </div>
              ) : (
                <div>
                  {taskHasBeenSubmitted ? (
                    <div>
                      <div className="flex items-center justify-end">
                        {submission?.taskCompletion?.remark === "" ? (
                          <Typography
                            variant="body"
                            onClick={() => {
                              setTaskHasBeenSubmitted(false);
                              setValues({
                                ...values,
                                url: submission.url,
                                fileName: submission.fileName,
                              });
                              setEditSubmission(true);
                            }}
                            color="primary"
                            className="py-3 underline cursor-pointer"
                          >
                            Edit Submission
                          </Typography>
                        ) : null}
                      </div>
                      <div>
                        {submission?.taskCompletion?.remark === "" ? (
                          <div>
                            <Typography variant="subheading2" className="py-3">
                              <strong>
                                Your task evaluation is currently pending
                                review.
                              </strong>
                            </Typography>
                            <Typography variant="body" className="py-3">
                              We have received your submission, but it has not
                              been evaluated by the instructor yet. Rest
                              assured, the review process is underway, and
                              you'll receive feedback as soon as it's available.
                              Please ensure that all required details are
                              correctly submitted to avoid any delays. If you
                              have any questions or concerns, feel free to reach
                              out to us for further clarification.{" "}
                            </Typography>
                          </div>
                        ) : (
                          <div>
                            <Typography variant="subheading2" className="py-3">
                              <strong>Task Evaluation </strong>
                            </Typography>
                            <Typography variant="body" className="py-3">
                              {submission?.taskCompletion?.remark}
                            </Typography>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={submit}>
                      <div className="py-2 mt-5">
                        <div className="flex items-center justify-between">
                          <label className="mb-2 block text-sm font-medium text-[#1f1f1f]">
                            {editSubmission
                              ? " Change file (zip, csv or pdf)"
                              : "        Upload file (zip, csv or pdf)"}{" "}
                          </label>
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

                      <div className="pb-20 mt-10 w-full">
                        <Button
                          type="submit"
                          loading={isSubmitting}
                          disabled={isSubmitting}
                        >
                          {editSubmission ? "Edit" : "Upload"}
                        </Button>
                      </div>
                    </form>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </Modal>
  );
}

export default ViewMyTaskModal;
