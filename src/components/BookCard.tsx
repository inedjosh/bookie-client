import { FaStar } from "react-icons/fa";
import { Typography } from "./Typography";
import { Button } from "./Buttons";
import { useModal } from "./Modal/ModalProvider";
import { MODAL_ID } from "../Layouts/ModalLayouts";
import { truncateText } from "../Utils/Helpers";
import { ReadBook } from "../services/book.service";
import { useRequestError } from "./Hooks/useRequestError";
import { useState } from "react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

export type Reader = {
  _id: string;
  email: string;
  first_name: string;
  last_name: string;
  username: string;
  profile_url: string;
};

type Props = {
  id: string;
  book_image_url: string;
  book_url: string;
  title: string;
  description: string;
  rating: number;
  isAuthor?: boolean;
  genre: string;
  readers: Reader[];
  myLibrary?: boolean;
};

function BookCard({
  id,
  book_image_url,
  title,
  book_url,
  genre,
  description,
  rating,
  isAuthor = false,
  readers,
  myLibrary = false,
}: Props) {
  const { showModal } = useModal();
  const { handleRequestError } = useRequestError({ useToast: true });
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((state: RootState) => state.auth);

  function isReaderInBook(readers: Reader[], userId: string): boolean {
    return readers.some((reader) => reader._id === userId);
  }
  function downloadFile(fileUrl: string) {
    window.open(fileUrl);
  }

  const readBook = async () => {
    try {
      setLoading(true);
      await ReadBook({ bookId: id });
      toast.success("Books added to your library");
    } catch (error) {
      handleRequestError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div key={id} className="flex mt-5 md:w-[310px] mr-5 my-8">
      <div className="flex-[.5]">
        <img src={book_image_url} className="w-full object-contain" />
      </div>
      <div className="pl-2  flex flex-col justify-end flex-[.5] ">
        <Typography
          as="h5"
          variant="subheading2"
          className="underline cursor-pointer"
          onClick={() => showModal(MODAL_ID.BOOK_MODAL, { id: id })}
        >
          {title}
        </Typography>
        <Typography as="p" color="muted-alt" className="my-2">
          {truncateText(description, 30)}
        </Typography>
        <div className="flex my-4">
          {[...Array(rating)].map((_, index) => {
            const starNumber = index + 1;
            return (
              <span key={starNumber} className="flex">
                <FaStar className="text-secondary" />
              </span>
            );
          })}
        </div>
        {isReaderInBook(readers, user.id) || myLibrary ? (
          <Typography
            onClick={() => downloadFile(book_url)}
            variant="underlined"
            color="primary"
            className="cursor-pointer"
          >
            Download Book
          </Typography>
        ) : (
          <div className="">
            <Button
              loading={loading}
              disabled={loading}
              onClick={() =>
                isAuthor
                  ? showModal(MODAL_ID.EDIT_BOOK, {
                      id,
                      book_image_url,
                      title,
                      book_url,
                      genre,
                      description,
                    })
                  : readBook()
              }
              size="sm"
            >
              {isAuthor ? "Edit" : "Read Now"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default BookCard;
