import React, { useState } from "react";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import { Typography } from "../../../../../components/Typography";
import { ContentType } from "../../../../../types";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store";
import { IoChevronForward } from "react-icons/io5";
import { Video, WhiteStar } from "../../../../../assets";
import { ContentTypeList } from "../../../../../constants";
import { useNavigate } from "react-router-dom";

interface Section {
  title: string;
  contents: ContentType[];
}

interface SectionRowProps {
  section: Section;
  weekNumber: number;
  dayNumber: number;
}

export const ContentListTable: React.FC<SectionRowProps> = ({
  section,
  // dayNumber,
  // weekNumber,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { user } = useSelector((state: RootState) => state.auth);
  // const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  // const viewContent = async (_id: string, contentUrl: string) => {
  //   try {
  //     setLoading(true);

  //     // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //     const response = await updateData<any>(
  //       `course-content/${user?._id}/student/${_id}/attendance`,
  //       {}
  //     );

  //     window.open(contentUrl, "_blank");
  //     if (response?.data?.pointsAwarded > 0) {
  //       showModal(MODAL_ID.POINT_MODAL, {
  //         point: response?.data?.pointsAwarded,
  //         activity: "Content",
  //       });
  //     }
  //   } finally {
  //     setLoading(false);
  //     dispatch(setReload(true));
  //   }
  // };

  return (
    <div className="mb-4">
      <div
        className="bg-[#F7F7F7] flex justify-between items-center px-4 py-4 rounded-[8px] cursor-pointer"
        onClick={() => setIsExpanded((prev) => !prev)}
      >
        <div className="flex items-center">
          <Typography color="muted-alt">{section.title}</Typography>
        </div>
        <div className="flex items-center">
          <Typography color="muted-alt" className="">
            {section.contents.length} Content
            {section.contents.length !== 1 ? "s" : ""}
          </Typography>
          <div className="ml-2">
            {isExpanded ? <FaAngleUp /> : <FaAngleDown />}
          </div>
        </div>
      </div>
      {/* Chapters (Expanded View) */}
      {isExpanded && (
        <div className="mt-2  pl-6">
          {section.contents.map((content) => {
            // const isValidDate =
            //   content.weekNumber < weekNumber ||
            //   (content.weekNumber === weekNumber &&
            //     content.dayNumber <= dayNumber);

            // // Check if user is among the participants
            // const isParticipant = content.participation.some(
            //   (participation) => participation.studentId === user._id
            // );

            return (
              <div
                onClick={() =>
                  navigate(
                    content.contentType === ContentTypeList.ARTICLE
                      ? `/student/content/article/${content._id}`
                      : `/student/content/video/${content._id}`
                  )
                }
                key={content._id}
                className="flex cursor-pointer items-center border-b py-2 "
              >
                <div className="flex w-full flex-col">
                  <div>
                    <Typography
                      className="font-bold mb-2 underline"
                      variant="body"
                      color="secondary2"
                    >
                      {content.title}
                    </Typography>
                  </div>
                  <div className="flex justify-between w-full items-center">
                    <div className="flex items-center">
                      <img src={Video} className="w-6" />
                      <Typography
                        variant="caption"
                        className="mr-2 ml-1  capitalize text-[#4D4D4D]"
                      >
                        {content.contentType}
                      </Typography>

                      <img src={WhiteStar} className="w-5" />

                      <Typography
                        variant="caption"
                        className="mr-2 ml-1  capitalize text-[#4D4D4D]"
                      >
                        {content.participation.length
                          ? (
                              content.participation.find(
                                (participation) =>
                                  participation.studentId === user._id
                              ) || {}
                            ).point || 0
                          : 0}
                        &nbsp;points
                      </Typography>
                    </div>
                    {/* {isValidDate && (
                      <div>
                        <Typography
                          variant="caption"
                          className="mr-4 capitalize"
                          color={!isParticipant ? "destructive" : "accent"}
                        >
                          {content.participation.filter(
                            (participation) =>
                              participation.studentId == user._id
                          ).length
                            ? "Continue"
                            : "View"}
                        </Typography>
                      </div>
                    )} */}
                    <div className="pr-5">
                      <IoChevronForward className="text-[#999999]" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
