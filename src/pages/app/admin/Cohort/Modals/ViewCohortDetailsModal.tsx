import Modal from "../../../../../components/Modal/Modal";
import { CohortType } from "../../../../../types";
import { Typography } from "../../../../../components/Typography";
import { useModal } from "../../../../../components/Modal/ModalProvider";
import { useEffect, useState } from "react";
import { fetchData } from "../../../../../Utils/fetch";
import { CohortDetailsSkeleton } from "../Components/Skeleton";
import ModalHeader from "../../../../../components/Modal/ModalHeader";

interface ModalComponentProps {
  modalId: string;
}

function ViewCohortDetailsModal({ modalId }: ModalComponentProps) {
  const { modalStates } = useModal();
  const cohortId = modalStates[modalId]?.props?.cohortId;
  const [cohort, setCohort] = useState<CohortType | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getCourse = async () => {
      try {
        setLoading(true);
        const response = await fetchData<CohortType>(`/cohort/${cohortId}`);

        setCohort(response.data);
      } finally {
        setLoading(false);
      }
    };

    if (modalStates[modalId]?.isOpen) getCourse();
  }, [cohortId, modalStates[modalId]?.isOpen]);

  return (
    <Modal modalId={modalId}>
      <div className="w-full h-[800px]  overflow-visible md:w-[800px]">
        {loading ? (
          <CohortDetailsSkeleton />
        ) : cohort ? (
          <div>
            <ModalHeader modalId={modalId}>
              <Typography variant="subheading" as="h2">
                {cohort.cohortName}
              </Typography>
            </ModalHeader>

            <div className="mt-10 px-5 md:px-10">
              <img
                src={cohort?.course?.thumbnail}
                className="w-full object-cover"
              />
              <div className="mt-10">
                <div
                  dangerouslySetInnerHTML={{
                    __html: cohort?.description, // This will render the HTML tags correctly
                  }}
                />

                <hr className="mt-5 border border-1" />

                <div className="flex justify-between pb-10 flex-wrap">
                  <div className="">
                    <Typography className="pt-3" color="muted-alt">
                      Fee: &nbsp;
                      <span className="text-black ">
                        ₦{cohort.course?.price.toLocaleString()}
                      </span>
                    </Typography>
                  </div>
                  <div className="">
                    <Typography className="pt-3" color="muted-alt">
                      Category: &nbsp;
                      <span className="text-black ">
                        {cohort.course?.category}
                      </span>
                    </Typography>
                  </div>
                  <div className="">
                    <Typography className="pt-3" color="muted-alt">
                      Language: &nbsp;
                      <span className="text-black ">
                        {cohort.course?.language}
                      </span>
                    </Typography>
                  </div>
                  <div className="">
                    <Typography className="pt-3" color="muted-alt">
                      Duration: &nbsp;
                      <span className="text-black ">
                        {cohort.course?.durationInMonths} Months
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

export default ViewCohortDetailsModal;
