import { RiHomeSmile2Fill } from "react-icons/ri";
import { Typography } from "../../../../components/Typography";
import { IoChevronForward } from "react-icons/io5";
import { IoIosClose } from "react-icons/io";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchData, updateData } from "../../../../Utils/fetch";
import { ContentType } from "../../../../types";
import { EditCourseSkeleton } from "../../admin/Cohort/Components/Skeleton";
import { StopWatchImg } from "../../../../assets";
import { Button } from "../../../../components/Buttons";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";

function ArticlePage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState<ContentType | null>(null);
  const { user } = useSelector((state: RootState) => state.auth);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  useEffect(() => {
    const getContent = async () => {
      try {
        setLoading(true);
        const response = await fetchData<ContentType>(`course-content/${id}`);
        console.log(response.data);
        setContent(response.data);
      } finally {
        setLoading(false);
      }
    };

    if (id) getContent();
  }, [id]);

  const submitParticipation = async () => {
    try {
      setLoadingSubmit(true);
      const response = await updateData<ContentType>(
        `course-content/${user?._id}/student/${id}/attendance?contentType=Article&contentDuration=0`,
        {}
      );
      setContent(response.data);
    } finally {
      setLoadingSubmit(false);
    }
  };
  console.log(content?.participation);
  if (loading) {
    return <EditCourseSkeleton />;
  }

  return (
    <div>
      <div className="flex py-6 px-5 md:px-20 justify-between items-center">
        <div className="flex items-center">
          <div onClick={() => navigate(-1)}>
            <RiHomeSmile2Fill className="text-[#25326A] text-2xl " />
          </div>
          <IoChevronForward className="mx-1 md:mx-4 text-[#ACB4D5]" />

          <Typography variant="subheading" className=" text-primary">
            CONTENT
          </Typography>
          <IoChevronForward className="mx-1 md:mx-4 text-[#ACB4D5]" />

          <Typography
            variant="subheading"
            className=" text-[#ACB4D5] uppercase"
          >
            {content?.title}{" "}
          </Typography>
        </div>
        <div onClick={() => navigate(-1)}>
          <IoIosClose size="30px" />
        </div>
      </div>
      <div className="bg-[#F0F0F0] pb-20 h-full min-h-screen">
        <div className="flex justify-center items-center">
          {!content?.participation.filter(
            (participation) => participation.studentId == user._id
          ).length ? (
            <div className="w-fit mt-8 flex flex-col justify-center items-center">
              <Typography className="caption text-[#4D4D4D]">
                Read time
              </Typography>
              <div className="border px-8 py-2 flex justify-center items-center mt-3 border-[#ACB4D5] rounded-[100px] bg-[#EBEDF5]">
                <Typography
                  variant="heading"
                  className="text-[#354898]"
                  as="h1"
                >
                  3 MIN{" "}
                </Typography>
              </div>
            </div>
          ) : null}
        </div>
        <div className="px-5 md:px-[10%] mt-10">
          {content?.content.description ? (
            <div
              dangerouslySetInnerHTML={{
                __html: content?.content?.description,
              }}
            />
          ) : null}
        </div>
        {!content?.participation.filter(
          (participation) => participation.studentId == user._id
        ).length ? (
          <div className="flex px-5  justify-center mt-10 items-center">
            <div className="flex flex-col md:flex-row bg-white rounded-[32px] p-5 w-[900px] justify-between items-center">
              <img src={StopWatchImg} className="w-16" />
              <div className="ml-4 my-4 md:my-0">
                <Typography variant="body" fontWeight="bold">
                  <strong>Average read time</strong>
                </Typography>
                <Typography className="mt-3" variant="body" fontWeight="normal">
                  Read time is used to determine your point when you’ve read an
                  article. To end reading, click on finished.
                </Typography>
              </div>

              <div className="w-full md:w-[160px] ml-5">
                <Button
                  loading={loadingSubmit}
                  disabled={loadingSubmit}
                  onClick={submitParticipation}
                  size="lg"
                >
                  Finished
                </Button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default ArticlePage;
