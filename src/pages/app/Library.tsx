import { useEffect, useState } from "react";
import { Typography } from "../../components/Typography";
import { AuthorImage, BookImage } from "../../assets";
import BookCard from "../../components/BookCard";
import AuthorCard from "../../components/AuthorCard";
import { IoFilterSharp } from "react-icons/io5";
import { useModal } from "../../components/Modal/ModalProvider";
import { MODAL_ID } from "../../Layouts/ModalLayouts";
import { GetAllAuthors } from "../../services/author.service";
import { GetAllBooks } from "../../services/book.service";
import { useRequestError } from "../../components/Hooks/useRequestError";
import { ClipLoader } from "react-spinners";
import Pagination from "../../components/Paginations";
import { useDispatch, useSelector } from "react-redux";
import {
  setAuthors,
  setAuthorsPagination,
  setBooks,
  setBooksPagination,
} from "../../redux/slices/library.slice";
import { RootState } from "../../redux/store";

function Library() {
  const [active, setActive] = useState(0);
  const { showModal } = useModal();
  const dispatch = useDispatch();
  const { handleRequestError } = useRequestError({ useToast: true });
  const [loading, setLoading] = useState(false);

  const { authors, books, bookPagination, authorsPagination } = useSelector(
    (state: RootState) => state.library
  );

  console.log(bookPagination, authorsPagination);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await Promise.all([
          GetAllAuthors(authorsPagination.currenPage),
          GetAllBooks(bookPagination.currenPage),
        ]);

        dispatch(setAuthors(data[0].data.authors));
        dispatch(
          setBooksPagination({
            currenPage: data[1].data.currentPage,
            totalPages: data[1].data.totalPages,
          })
        );
        dispatch(
          setAuthorsPagination({
            currenPage: data[0].data.currentPage,
            totalPages: data[0].data.totalPages,
          })
        );
        dispatch(setBooks(data[1].data.books));
      } catch (error) {
        handleRequestError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [authorsPagination.currenPage, bookPagination.currenPage]);

  console.log(books, authors);

  if (loading)
    return (
      <div className="w-full h-[500px] flex justify-center items-center">
        <ClipLoader color="#5b32e5" size="20px" />
      </div>
    );

  return (
    <div className="h-screen ">
      <div className="flex flex-col justify-between  h-[90%]">
        <div className="">
          <div className="flex justify-between mt-14 lg:mt-5">
            <div className="flex justify-start px-0 mt-5 ">
              <Typography
                variant="body"
                color={`${active === 0 ? "primary" : "muted-alt"}`}
                onClick={() => setActive(0)}
                className={`${active === 0 ? "underline" : ""} cursor-pointer`}
              >
                Books
              </Typography>
              <Typography
                variant="body"
                color={`${active === 1 ? "primary" : "muted-alt"}`}
                onClick={() => setActive(1)}
                className={`${
                  active === 1 ? "underline" : ""
                } pl-10  cursor-pointer`}
              >
                Authors
              </Typography>
            </div>
            <div
              className="border-input border p-2 bg-white "
              onClick={() =>
                showModal(MODAL_ID.FILTER, {
                  state: active === 0 ? "books" : "authors",
                })
              }
            >
              <IoFilterSharp size="30px" />
            </div>{" "}
          </div>

          <div className="mt-10">
            {active === 0 ? (
              <div className="flex flex-col md:flex-row flex-wrap mt-10">
                {books.map((book) => (
                  <BookCard
                    key={book._id}
                    id={book._id}
                    book_image_url={BookImage}
                    title={book.title}
                    description={book.description}
                    rating={book.rating}
                    book_url={book.book_url}
                    genre={book.genre}
                    readers={book.readers}
                  />
                ))}{" "}
              </div>
            ) : (
              <>
                <div className="flex flex-col md:flex-row flex-wrap">
                  {authors.map((author) => (
                    <AuthorCard
                      key={author._id}
                      id={author._id}
                      img={AuthorImage}
                      name={`${author.user.first_name} ${author.user.last_name}}`}
                      genres={author.genres}
                      rating={author.rating}
                      bio={author.bio}
                      author={author}
                    />
                  ))}{" "}
                </div>
              </>
            )}
          </div>
        </div>
        {active === 0 ? (
          <Pagination
            currentPage={bookPagination.currenPage}
            totalPages={bookPagination.totalPages}
            page="book"
          />
        ) : (
          <Pagination
            currentPage={authorsPagination.currenPage}
            totalPages={authorsPagination.totalPages}
            page="author"
          />
        )}
      </div>
    </div>
  );
}

export default Library;
