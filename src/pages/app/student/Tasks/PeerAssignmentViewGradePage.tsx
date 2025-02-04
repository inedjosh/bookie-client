import { RiHomeSmile2Fill } from "react-icons/ri";
import { Typography } from "../../../../components/Typography";
import { IoChevronForward } from "react-icons/io5";
import { IoIosClose } from "react-icons/io";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { TaskType } from "../../../../types";
import { fetchData } from "../../../../Utils/fetch";
import { TASK_TYPE } from "../../../../constants";

function PeerAssignmentViewGradePage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [task, setTask] = useState<TaskType | null>(null);
  const [loading, setLoading] = useState(false);
  console.log(loading);
  useEffect(() => {
    const getAssignment = async () => {
      try {
        setLoading(true);
        const response = await fetchData<TaskType>(`/task/${id}`);

        setTask(response.data || null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      getAssignment();
    }
  }, [id]);

  return (
    <div>
      <div className="flex py-6 px-5 md:px-20 justify-between items-center">
        <div className="flex items-center">
          <div onClick={() => navigate(-1)}>
            <RiHomeSmile2Fill className="text-[#25326A] text-2xl " />
          </div>
          <IoChevronForward className="mx-1 md:mx-4 text-[#ACB4D5]" />

          <Typography variant="subheading" className=" text-primary uppercase">
            Daily tasks
          </Typography>
          <IoChevronForward className="mx-1 md:mx-4 text-[#ACB4D5]" />

          <Typography variant="subheading" className="text-[#ACB4D5] uppercase">
            Peer graded task
          </Typography>
        </div>
        <div onClick={() => navigate(-1)}>
          <IoIosClose size="30px" />
        </div>
      </div>
      <div className="bg-[#F0F0F0] px-5 md:px-20 py-5 md:py-10 h-full pb-10 min-h-screen">
        <Typography as="h2" variant="heading2">
          Peer graded assignment: {task?.title}
        </Typography>

        <div className="flex justify-between mt-10">
          <div className="flex-[.5] ">
            <Typography as="h2" color="muted-alt" variant="heading2">
              PROMPT
            </Typography>
            <div
              className="mt-5"
              dangerouslySetInnerHTML={{ __html: task?.task.description || "" }}
            />
            <Typography
              as="h2"
              className="mt-10 text-[#25326A]"
              variant="heading2"
            >
              SUBMISSION
            </Typography>
            <div>
              <Typography className="mt-10 text-muted-alt" variant="body">
                You have not submitted your task
              </Typography>
            </div>
          </div>
          <div className="flex-[.42] bg-white rounded-[32px] p-5 md:p-10">
            {task?.taskType === TASK_TYPE.PEER &&
              "gradingCriteria" in task.task &&
              task.task.gradingCriteria.map((criteria, index) => (
                <div key={index} className="my-4">
                  <Typography className="py-2 pl-5" variant="body">
                    {criteria.criteria}{" "}
                    <strong className="text-primary">
                      {" "}
                      ({criteria.maxPoint} Points){" "}
                    </strong>
                  </Typography>

                  <Typography
                    className="py-1 pl-5"
                    color="muted-alt"
                    variant="caption"
                  >
                    {criteria.description}
                  </Typography>

                  {criteria.gradingFields.map((field, fieldIndex) => (
                    <div
                      key={fieldIndex}
                      className="ml-10 py-3 flex items-center"
                    >
                      <div className="bg-[#E8F1FB] w-6 h-6 rounded-full flex justify-center items-center">
                        <div className="bg-[#EBEDF5] w-4 h-4 rounded-full" />
                      </div>{" "}
                      <div className="ml-3">
                        <Typography className="" variant="caption">
                          <strong>{field.grade} Pts</strong>
                        </Typography>
                        <Typography
                          className="text-[#4D4D4D]"
                          variant="caption"
                        >
                          {field.fieldName}
                        </Typography>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PeerAssignmentViewGradePage;
