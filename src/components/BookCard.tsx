import { FaRegEdit, FaStar } from "react-icons/fa";
import { Typography } from "./Typography";
import { Button } from "./Buttons";
import { useModal } from "./Modal/ModalProvider";
import { MODAL_ID } from "../Layouts/ModalLayouts";
import { truncateText } from "../Utils/Helpers";
import { DeleteBook, ReadBook } from "../services/book.service";
import { useRequestError } from "./Hooks/useRequestError";
import { useState } from "react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { MdOutlineDelete } from "react-icons/md";
import { GetAuthor } from "../services/author.service";
import { setAuthor } from "../redux/slices/author.slice";

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
  const [deleting, setDeleting] = useState(false);
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
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

  const deleteBook = async () => {
    try {
      setDeleting(true);
      await DeleteBook(id);
      const { data } = await GetAuthor(user?.id);
      dispatch(
        setAuthor({
          _id: data._id,
          user: {
            _id: data?.user?._id,
            email: data?.user?.email,
            first_name: data?.user?.first_name,
            last_name: data?.user?.last_name,
            username: data?.user?.username,
            profile_url: data?.user?.profile_url,
            role: data?.user?.role,
          },
          bio: data?.bio,
          pen_name: data?.pen_name,
          genres: data?.genres,
          rating: data?.rating,
          books: data?.books,
        })
      );
      toast.success("Book deleted successfully");
    } catch (error) {
      handleRequestError(error);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div key={id} className="flex mt-5 md:w-[310px] mr-5 my-8">
      <div className="flex-[.5]">
        <img src={book_image_url} className="w-full h-[210px] object-cover" />
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
            {isAuthor ? (
              <div className="flex">
                <div className="w-[80px]">
                  <Button
                    loading={loading}
                    disabled={loading}
                    variant="outline"
                    onClick={() =>
                      showModal(MODAL_ID.EDIT_BOOK, {
                        id,
                        book_image_url,
                        title,
                        book_url,
                        genre,
                        description,
                      })
                    }
                    size="sm"
                  >
                    <FaRegEdit size="30px" />
                  </Button>{" "}
                </div>
                <div className="w-[80px] ml-2">
                  <Button
                    loading={deleting}
                    disabled={deleting}
                    variant="destructive"
                    onClick={deleteBook}
                    size="sm"
                  >
                    <MdOutlineDelete size="30px" />
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                loading={loading}
                disabled={loading}
                onClick={() => readBook()}
                size="sm"
              >
                Read Now
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default BookCard;
