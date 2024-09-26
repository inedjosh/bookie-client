// SlideInModal.tsx
import { FC, useEffect, useState } from "react";
import { useModal } from "./ModalProvider";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { Typography } from "../Typography";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { MODAL_ID } from "../../Layouts/ModalLayouts";
import { FaBookReader, FaStar } from "react-icons/fa";
import { Button } from "../Buttons";
import { Textarea } from "../Inputs/TextAreaInput";
import { GetABook, RateBook, ReadBook } from "../../services/book.service";
import { useRequestError } from "../Hooks/useRequestError";
import { ClipLoader } from "react-spinners";
import { formatDate } from "../../Utils/Helpers";
import { RootState } from "../../redux/store";
import { useSelector } from "react-redux";
import * as yup from "yup";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { Reader } from "../BookCard";

type FormProps = {
  comment: string;
};

const schema = yup.object().shape({
  comment: yup.string().required("Comment is required "),
});

interface ModalComponentProps {
  modalId: string;
}

export type Review = {
  rating: number;
  comment: string;
  _id: string;
  profile_url: string;
  name: string;
  user: string;
};

export type User = {
  _id: string;
  email: string;
  first_name: string;
  last_name: string;
  username: string;
  profile_url: string;
  role: string;
};

export type Author = {
  _id: string;
  bio: string;
  pen_name: string;
  genres: string[];
  rating: number;
  name: string;
  profile_url: string;
};

export type BookDetails = {
  _id: string;
  title: string;
  user: User;
  readers: User[];
  author: Author;
  reviews: Review[];
  description: string;
  genre: string;
  book_image_url: string;
  book_url: string;
  rating: number;
  published_date: Date;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

const BooDetailsModal: FC<ModalComponentProps> = ({ modalId }) => {
  const { author } = useSelector((state: RootState) => state.author);
  const { user } = useSelector((state: RootState) => state.auth);

  const { handleRequestError } = useRequestError({ useToast: true });
  const { modalStates, hideModal, showModal } = useModal();
  const isOpen = modalStates[modalId]?.isOpen;
  const [loading, setLoading] = useState(false);
  const [bookDetails, setBookDetails] = useState<BookDetails>({
    _id: "",
    title: "",
    user: {
      _id: "",
      email: "",
      first_name: "",
      last_name: "",
      username: "",
      profile_url: "",
      role: "",
    },
    readers: [],
    author: {
      _id: "",
      bio: "",
      pen_name: "",
      genres: [],
      rating: 0,
      name: "",
      profile_url: "",
    },
    reviews: [],
    description: "",
    genre: "",
    book_image_url: "",
    book_url: "",
    rating: 0,
    published_date: new Date(),
    createdAt: "",
    updatedAt: "",
    __v: 0,
  });

  useEffect(() => {
    const getABook = async () => {
      try {
        setLoading(true);
        console.log(modalStates?.book_modal?.props?.id);
        const book = await GetABook(modalStates?.book_modal?.props?.id);
        console.log(book);
        setBookDetails(book.data);
      } catch (error) {
        handleRequestError(error);
      } finally {
        setLoading(false);
      }
    };

    if (modalStates?.book_modal?.props?.id) getABook();
  }, [modalStates?.book_modal?.props?.id]);

  const [rating, setRating] = useState(0);

  const handleClick = (index: number) => {
    setRating(index + 1);
  };

  const {
    values,
    handleChange,
    handleBlur,
    isSubmitting,
    touched,
    errors,
    handleSubmit,
  } = useFormik({
    initialValues: {
      comment: "",
    },
    validationSchema: schema,
    onSubmit: (values: FormProps) => submit(values),
  });

  const submit = async (values: FormProps) => {
    try {
      let payload;
      if (rating > 0) {
        payload = {
          ...values,
          rating,
          bookId: bookDetails._id,
        };

        await RateBook(payload);

        toast.success("Rating added successfully");
      }
    } catch (error) {
      handleRequestError(error);
    }
  };

  function isReaderInBook(readers: Reader[], userId: string): boolean {
    return readers.some((reader) => reader._id === userId);
  }

  function hasUserCommented(reviews: Review[], userId: string): boolean {
    return reviews.some((review) => review.user === userId);
  }

  function downloadFile(fileUrl: string) {
    window.open(fileUrl);
  }

  const readBook = async () => {
    try {
      setLoading(true);
      await ReadBook({ bookId: bookDetails._id });
      toast.success("Books added to your library");
    } catch (error) {
      handleRequestError(error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  if (loading)
    return (
      <div className="w-full h-[500px] flex justify-center items-center">
        <ClipLoader color="#5b32e5" size="20px" />
      </div>
    );

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
                Book Details{" "}
              </Typography>
              <div
                className="cursor-pointer"
                onClick={() => hideModal(MODAL_ID.BOOK_MODAL)}
              >
                <IoIosCloseCircleOutline size="30px" />
              </div>{" "}
            </div>
            <div className="p-5 ">
              <div className="flex flex-col md:flex-row">
                <img
                  src={bookDetails.book_image_url}
                  className="w-full h-[320px] md:w-[200px] md:h-[240px]"
                />
                <div className="md:pl-5 mt-10 md:mt-0">
                  <Typography as="h5" variant="subheading">
                    {bookDetails.title}{" "}
                  </Typography>
                  <Typography
                    as="p"
                    variant="body"
                    color="muted-alt"
                    className="my-3"
                  >
                    {" "}
                    By{" "}
                    <span
                      className={` ${
                        author._id !== bookDetails.author._id && "underline"
                      } cursor-pointer`}
                      onClick={() => {
                        author._id !== bookDetails.author._id &&
                          hideModal(MODAL_ID.BOOK_MODAL);
                        author._id !== bookDetails.author._id &&
                          showModal(MODAL_ID.AUTHOR_MODAL);
                      }}
                    >
                      {bookDetails.author.name}
                    </span>
                    , {formatDate(bookDetails.published_date)}
                  </Typography>

                  <div className="flex items-center my-3">
                    {[...Array(bookDetails.rating)].map((_, index) => {
                      const starNumber = index + 1;
                      return (
                        <span key={starNumber} className="flex">
                          <FaStar className="text-secondary" />
                        </span>
                      );
                    })}
                    <Typography as="p" variant="body" className="pl-3">
                      {bookDetails.rating} Rating
                    </Typography>
                  </div>
                  <div className="flex items-center my-4">
                    {" "}
                    <FaBookReader />
                    <Typography as="p" variant="body" className=" pl-3">
                      {bookDetails.readers.length} Reading{" "}
                    </Typography>
                  </div>
                  {author._id !== bookDetails.author._id && (
                    <div className="mt-5">
                      {isReaderInBook(bookDetails.readers, user.id) ? (
                        <Typography
                          onClick={() => downloadFile(bookDetails.book_url)}
                          variant="underlined"
                          color="primary"
                          className="cursor-pointer"
                        >
                          Download Book
                        </Typography>
                      ) : (
                        <div className="">
                          <Button onClick={readBook}>Read Now</Button>
                        </div>
                      )}{" "}
                    </div>
                  )}
                </div>
              </div>

              <hr className="my-10" />

              <div>
                <Typography as="h4" variant="subheading" className=" my-10 ">
                  What readers are saying{" "}
                </Typography>

                {bookDetails.reviews.length ? (
                  bookDetails.reviews.map((comment) => (
                    <div key={comment._id} className="my-3">
                      <div className="flex items-center ">
                        <img
                          src={comment.profile_url}
                          className="w-[30px] h-[30px] rounded-full"
                        />
                        <Typography as="h6" variant="body" className="px-3">
                          {comment.name}
                        </Typography>

                        <div className="pl-3 flex border-l-2 border-input">
                          {[...Array(comment.rating)].map((_, index) => {
                            const starNumber = index + 1;
                            return (
                              <span key={starNumber} className="flex">
                                <FaStar className="text-secondary text-xs" />
                              </span>
                            );
                          })}
                        </div>
                      </div>
                      <Typography as="p" color="muted-alt" className="mt-2">
                        {comment.comment}
                      </Typography>
                    </div>
                  ))
                ) : (
                  <div className="w-full h-20 flex justify-center items-center">
                    <Typography variant="body" color="muted-alt">
                      No Review
                    </Typography>
                  </div>
                )}
              </div>
              {author._id !== bookDetails.author._id &&
                !hasUserCommented(bookDetails.reviews, user.id) && (
                  <form onSubmit={handleSubmit}>
                    <hr className="my-10" />
                    <Typography as="h4" variant="subheading" className=" mt-10">
                      Say Something
                    </Typography>
                    <div className="mt-3">
                      <Typography
                        as="p"
                        variant="body"
                        color="muted-alt"
                        className=" mt-3"
                      >
                        Give some stars{" "}
                        <div className="flex my-3">
                          {[...Array(5)].map((_, index) => {
                            const starNumber = index + 1;
                            return (
                              <span
                                key={starNumber}
                                onClick={() => handleClick(index)}
                                className="cursor-pointer"
                              >
                                <FaStar
                                  className={`text-input ${
                                    starNumber <= rating
                                      ? "text-secondary"
                                      : "text-input"
                                  } text-lg mx-2`}
                                />
                              </span>
                            );
                          })}
                        </div>
                      </Typography>

                      <Textarea
                        placeholder="Drop your comments..."
                        className="mt-4"
                        value={values.comment}
                        name="comment"
                        error={errors.comment}
                        handleBlur={handleBlur}
                        onChange={handleChange}
                        touched={touched.comment}
                      />
                    </div>
                    <div className="mt-5">
                      <Button
                        type="submit"
                        loading={isSubmitting}
                        disabled={isSubmitting}
                      >
                        Submit
                      </Button>
                    </div>
                  </form>
                )}
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default BooDetailsModal;
