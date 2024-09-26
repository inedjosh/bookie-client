import { FC, useEffect, useState } from "react";
import { useModal } from "./ModalProvider";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { Typography } from "../Typography";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { MODAL_ID } from "../../Layouts/ModalLayouts";
import { FaBookReader } from "react-icons/fa";
import { AuthorImage } from "../../assets";
import BookCard from "../BookCard";
import { Author } from "../../redux/slices/author.slice";

interface ModalComponentProps {
  modalId: string;
}

const AuthorDetailsModal: FC<ModalComponentProps> = ({ modalId }) => {
  const { modalStates, hideModal } = useModal();

  const isOpen = modalStates[modalId]?.isOpen;

  if (!isOpen) return null;

  const [author, setAuthor] = useState<Author>({
    _id: "",
    user: {
      _id: "",
      email: "",
      first_name: "",
      last_name: "",
      username: "",
      profile_url: "",
      role: "",
    },
    bio: "",
    pen_name: "",
    genres: [],
    rating: 0,
    books: [],
  });

  useEffect(() => {
    console.log(modalStates.author_modal.props);
    if (modalStates.author_modal.props)
      setAuthor({
        _id: modalStates.author_modal.props._id,
        user: {
          _id: modalStates.author_modal.props?._id,
          email: modalStates.author_modal.props.email,
          first_name: modalStates.author_modal.props.user.first_name,
          last_name: modalStates.author_modal.props.user.last_name,
          username: modalStates.author_modal.props.user.username,
          profile_url: modalStates.author_modal.props.user.profile_url,
          role: modalStates.author_modal.props.user.role,
        },
        bio: modalStates.author_modal.props.bio,
        pen_name: modalStates.author_modal.props.pen_name,
        genres: modalStates.author_modal.props.genres,
        rating: modalStates.author_modal.props.rating,
        books: modalStates.author_modal.props.books,
      });
  }, [modalStates.author_modal.props]);

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
              <Typography as="h3" variant="heading2">
                Author Details{" "}
              </Typography>
              <div
                className="cursor-pointer"
                onClick={() => hideModal(MODAL_ID.AUTHOR_MODAL)}
              >
                <IoIosCloseCircleOutline size="30px" />
              </div>{" "}
            </div>
            <div className="p-5 ">
              <div className="flex  items-center flex-row">
                <img src={AuthorImage} className="w-[200px] h-[200px] " />
                <div className="md:pl-5 mt-10 md:mt-0">
                  <Typography as="h4" variant="subheading">
                    {`${author.user.first_name} ${author.user.last_name}`}
                  </Typography>
                  <Typography as="p" variant="body" color="muted-alt">
                    {author.pen_name}{" "}
                  </Typography>

                  <div className="flex items-center my-4">
                    {" "}
                    <FaBookReader />
                    <Typography as="p" variant="body" className=" pl-3">
                      {author.books.length} Books{" "}
                    </Typography>
                  </div>
                </div>
              </div>{" "}
              <hr className="my-10" />
              <div>
                <Typography as="h4" variant="subheading" className=" mt-10">
                  Books By
                  {`${author.user.first_name} ${author.user.last_name}`}
                </Typography>
                <div className="flex flex-col md:flex-row flex-wrap mt-10">
                  {author.books.length ? (
                    author.books.map((book) => (
                      <BookCard
                        key={book._id}
                        id={book._id}
                        book_image_url={book.book_image_url}
                        title={book.title}
                        description={book.description}
                        rating={book.rating}
                        book_url={book.book_url}
                        genre={book.genre}
                        readers={book.readers}
                      />
                    ))
                  ) : (
                    <div className="w-full h-20 flex justify-center items-center">
                      <Typography variant="body" color="muted-alt">
                        No Books
                      </Typography>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default AuthorDetailsModal;
