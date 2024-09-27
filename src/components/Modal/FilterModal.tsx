// SlideInModal.tsx
import { FC, useState } from "react";
import { useModal } from "./ModalProvider";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { Typography } from "../Typography";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { MODAL_ID } from "../../Layouts/ModalLayouts";
import { CustomCheckbox } from "../Inputs/CheckboxInput/CheckboxInput";
import { Button } from "../Buttons";
import { GENRES } from "../../contants";
import { FaStar } from "react-icons/fa";
import { SearchAuthors } from "../../services/author.service";
import { SearchBooks } from "../../services/book.service";
import { useRequestError } from "../Hooks/useRequestError";
import { RootState } from "../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import {
  LIBRARY_STATE,
  setSearchActive,
} from "../../redux/slices/uiActions.slice";
import {
  setAuthors,
  setAuthorsPagination,
  setBooks,
  setBooksPagination,
} from "../../redux/slices/library.slice";

interface ModalComponentProps {
  modalId: string;
}

const FilterModal: FC<ModalComponentProps> = ({ modalId }) => {
  const { modalStates, hideModal } = useModal();
  const [loading, setLoading] = useState(false);
  const isOpen = modalStates[modalId]?.isOpen;
  const { handleRequestError } = useRequestError({ useToast: true });

  const [selectedGenre, setSelectedGenre] = useState<string>("");
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const handleGenreSelect = (value: string) => {
    setSelectedGenre(value);
  };

  const handleRatingSelect = (value: number) => {
    setSelectedRating(value);
  };

  const dispatch = useDispatch();
  const { libraryState } = useSelector((state: RootState) => state.uiActions);

  const filter = async () => {
    try {
      setLoading(true);
      let result;
      if (selectedGenre || selectedRating) {
        if (libraryState === LIBRARY_STATE.BOOKS) {
          result = await SearchBooks({
            genre: selectedGenre,
            rating: selectedRating,
          });
          dispatch(
            setBooksPagination({
              currenPage: result.data.currentPage,
              totalPages: result.data.totalPages,
            })
          );

          dispatch(setBooks(result.data.books));
        } else {
          result = await SearchAuthors({ genre: selectedGenre });

          dispatch(setAuthors(result.data.authors));
          dispatch(
            setAuthorsPagination({
              currenPage: result.data.currentPage,
              totalPages: result.data.totalPages,
            })
          );
        }
        dispatch(setSearchActive(true));
      }
      hideModal(MODAL_ID.FILTER);
    } catch (error) {
      handleRequestError(error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog
      open={isOpen}
      as="div"
      className="relative z-10 focus:outline-none"
      onClose={() => {
        hideModal(modalId);
      }}
    >
      <DialogBackdrop className="fixed inset-0 bg-black/70 w-full" />
      <div className="fixed inset-0  z-10 w-screen p-4">
        <div className="flex min-h-full items-center justify-center ">
          <DialogPanel
            transition
            className="w-full  md:px-16 py-12 max-w-4xl h-[90vh]  overflow-y-scroll bg-white  shadow-md backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
          >
            <div className="flex p-5 justify-between">
              <Typography as="h4" variant="heading2">
                Filter{" "}
              </Typography>
              <div
                className="cursor-pointer"
                onClick={() => hideModal(MODAL_ID.FILTER)}
              >
                <IoIosCloseCircleOutline size="30px" />
              </div>{" "}
            </div>
            <div className="p-5 flex flex-col justify-between h-[80%]">
              <div className="flex">
                <div>
                  <Typography as="h4" variant="body" className="my-4">
                    Genre
                  </Typography>
                  {GENRES.map((genre) => (
                    <CustomCheckbox
                      key={genre.key}
                      onChange={() => handleGenreSelect(genre.value)}
                      value={genre.value}
                      label={genre.value}
                      isChecked={selectedGenre === genre.value}
                    />
                  ))}
                </div>
                {modalStates.filter.props?.state !== "authors" && (
                  <div className="ml-5 md:ml-14">
                    <Typography as="h4" variant="body" className="my-4">
                      Rating
                    </Typography>
                    {[...Array(5)].map((_, index) => {
                      const starNumber = index + 1;
                      return (
                        <CustomCheckbox
                          key={starNumber}
                          onChange={() => handleRatingSelect(starNumber)}
                          value={starNumber}
                          label={
                            <div className="flex items-center cursor-pointer">
                              <span className="mr-2">
                                {starNumber} Star{starNumber > 1 ? "s" : ""}
                              </span>
                              {[...Array(starNumber)].map((_, i) => (
                                <FaStar
                                  key={i}
                                  className="text-secondary text-xs"
                                />
                              ))}
                            </div>
                          }
                          isChecked={selectedRating === starNumber}
                        />
                      );
                    })}
                  </div>
                )}{" "}
              </div>
              <div className="w-[100px] mt-5">
                {" "}
                <Button loading={loading} disabled={loading} onClick={filter}>
                  Apply
                </Button>
              </div>{" "}
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default FilterModal;
