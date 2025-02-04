import { RiHomeSmile2Fill } from "react-icons/ri";
import { Typography } from "../../../../components/Typography";
import { IoChevronForward } from "react-icons/io5";
import { IoIosClose } from "react-icons/io";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { ContentType, VideoType } from "../../../../types";
import { fetchData, updateData } from "../../../../Utils/fetch";
import Video from "./Components/Video";
import { StopWatchImg } from "../../../../assets";
import { Button } from "../../../../components/Buttons";
import { formatTimer } from "../../../../Utils/Helpers";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";

function VideoPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState<ContentType | null>(null);
  const [videoWatchTime, setVideoWatchTime] = useState(0);
  const { user } = useSelector((state: RootState) => state.auth);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [videoData, setVideoData] = useState<VideoType | null>(null);

  console.log(loading);

  useEffect(() => {
    const getContent = async () => {
      try {
        setLoading(true);
        const response = await fetchData<ContentType>(`course-content/${id}`);
        console.log({ response });
        setContent(response.data);
        setVideoData(response.data?.content as VideoType);
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
        `course-content/${user?._id}/student/${id}/attendance?contentType=Video&contentDuration=${videoWatchTime}`,
        {}
      );
      setContent(response.data);
    } finally {
      setLoadingSubmit(false);
    }
  };

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
      <div className="bg-[#F0F0F0]  h-full pb-20 min-h-screen">
        <div className="flex  justify-center items-center">
          {!content?.participation.filter(
            (participation) => participation.studentId == user._id
          ).length ? (
            <div className="w-fit mt-8 flex flex-col justify-center items-center">
              <Typography className="caption text-[#4D4D4D]">
                Watch time
              </Typography>
              <div className="border px-8 py-2 flex justify-center items-center mt-3 border-[#ACB4D5] rounded-[100px] bg-[#EBEDF5]">
                <Typography
                  variant="heading"
                  className="text-[#354898]"
                  as="h1"
                >
                  {formatTimer(videoWatchTime)}
                </Typography>
              </div>
            </div>
          ) : null}{" "}
        </div>
        <div className="md:px-[10%] h-[500px] mt-20">
          {videoData && (
            <Video
              url={videoData?.url}
              setVideoWatchTime={(value: number) => setVideoWatchTime(value)}
            />
          )}
        </div>
        {!content?.participation.filter(
          (participation) => participation.studentId == user._id
        ).length ? (
          <div className="flex px-5 justify-center mt-10 items-center">
            <div className="flex flex-col md:flex-row bg-white rounded-[32px] p-5 w-[900px] justify-between items-center">
              <img src={StopWatchImg} className="w-16" />
              <div className="ml-4 my-4 md:my-0">
                <Typography variant="body" fontWeight="bold">
                  <strong>Complete Watch Time</strong>
                </Typography>
                <Typography className="mt-3" variant="body" fontWeight="normal">
                  Watch time is used to determine your point when you’ve watched
                  a video content. To complete watch time, click on end video.{" "}
                </Typography>
              </div>
              <div className="w-full md:w-[180px] ml-5">
                <Button
                  loading={loadingSubmit}
                  disabled={loadingSubmit}
                  onClick={submitParticipation}
                  size="lg"
                >
                  End Video
                </Button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default VideoPage;
