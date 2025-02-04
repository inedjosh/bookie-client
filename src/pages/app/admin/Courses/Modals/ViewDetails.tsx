import Modal from "../../../../../components/Modal/Modal";
import { CourseType } from "../../../../../types";
import { Typography } from "../../../../../components/Typography";
import { useModal } from "../../../../../components/Modal/ModalProvider";
import { useEffect, useState } from "react";
import { fetchData } from "../../../../../Utils/fetch";
import CourseDetailsSkeleton from "../Components/CourseDetailsSkeleton";

interface ModalComponentProps {
  modalId: string;
}

function ViewCourseDetailsModal({ modalId }: ModalComponentProps) {
  const { modalStates } = useModal();
  const courseId = modalStates[modalId]?.props?.courseId;
  const [course, setCourse] = useState<CourseType | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getCourse = async () => {
      try {
        setLoading(true);
        const response = await fetchData<CourseType>(`/course/${courseId}`);

        setCourse(response.data);
      } finally {
        setLoading(false);
      }
    };

    if (modalStates[modalId]?.isOpen) getCourse();
  }, [courseId, modalStates[modalId]?.isOpen]);

  return (
    <Modal modalId={modalId}>
      <div className="w-full h-[500px] overflow-visible md:w-[500px]">
        {loading ? (
          <CourseDetailsSkeleton />
        ) : course ? (
          <div>
            <Typography variant="subheading" as="h2">
              {course.title}
            </Typography>
            <div className="mt-10">
              <img src={course?.thumbnail} className="w-full object-cover" />
              <div className="mt-10">
                <div
                  dangerouslySetInnerHTML={{
                    __html: course?.description, // This will render the HTML tags correctly
                  }}
                />

                <hr className="mt-5 border border-1" />

                <div className="flex justify-between pb-10 flex-wrap">
                  <div className="">
                    <Typography className="pt-3" color="muted-alt">
                      Fee: &nbsp;
                      <span className="text-black ">
                        ₦{course?.price.toLocaleString()}
                      </span>
                    </Typography>
                  </div>
                  <div className="">
                    <Typography className="pt-3" color="muted-alt">
                      Category: &nbsp;
                      <span className="text-black ">{course?.category}</span>
                    </Typography>
                  </div>
                  <div className="">
                    <Typography className="pt-3" color="muted-alt">
                      Language: &nbsp;
                      <span className="text-black ">{course?.language}</span>
                    </Typography>
                  </div>
                  <div className="">
                    <Typography className="pt-3" color="muted-alt">
                      Duration: &nbsp;
                      <span className="text-black ">
                        {course?.durationInMonths} Months
                      </span>
                    </Typography>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </Modal>
  );
}

export default ViewCourseDetailsModal;
