import { useEffect, useState } from "react";
import { Typography } from "../../components/Typography";
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
import {
  LIBRARY_STATE,
  setLibraryState,
  setSearchActive,
} from "../../redux/slices/uiActions.slice";

function Library() {
  const [active, setActive] = useState(LIBRARY_STATE.BOOKS);
  const { showModal } = useModal();
  const dispatch = useDispatch();
  const { handleRequestError } = useRequestError({ useToast: true });
  const [loading, setLoading] = useState(false);

  const { authors, books, bookPagination, authorsPagination } = useSelector(
    (state: RootState) => state.library
  );

  const [clearFilter, setClearFilter] = useState(false);

  const { searchActive } = useSelector((state: RootState) => state.uiActions);
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
        dispatch(setSearchActive(false));
      } catch (error) {
        handleRequestError(error);
      } finally {
        setLoading(false);
        setClearFilter(false);
      }
    };

    fetchData();
  }, [authorsPagination.currenPage, bookPagination.currenPage, clearFilter]);

  if (loading)
    return (
      <div className="w-full h-[500px] flex justify-center items-center">
        <ClipLoader color="#5b32e5" size="20px" />
      </div>
    );

  return (
    <div className="h-screen ">
      <div className="flex flex-col justify-between  h-[90%]">
        <div className="pb-40">
          <div className="flex justify-between mt-14 items-center lg:mt-5">
            <div className="flex justify-start px-0 mt-5 ">
              <Typography
                variant="body"
                color={`${
                  active === LIBRARY_STATE.BOOKS ? "primary" : "muted-alt"
                }`}
                onClick={() => {
                  setActive(LIBRARY_STATE.BOOKS);
                  dispatch(setLibraryState(LIBRARY_STATE.BOOKS));
                }}
                className={`${
                  active === LIBRARY_STATE.BOOKS ? "underline" : ""
                } cursor-pointer`}
              >
                Books
              </Typography>
              <Typography
                variant="body"
                color={`${
                  active === LIBRARY_STATE.AUTHORS ? "primary" : "muted-alt"
                }`}
                onClick={() => {
                  setActive(LIBRARY_STATE.AUTHORS);
                  dispatch(setLibraryState(LIBRARY_STATE.AUTHORS));
                }}
                className={`${
                  active === LIBRARY_STATE.AUTHORS ? "underline" : ""
                } pl-10  cursor-pointer`}
              >
                Authors
              </Typography>
            </div>
            {searchActive ? (
              <div
                className="border-input border p-2 bg-white "
                onClick={() => setClearFilter(true)}
              >
                <Typography>Clear filter</Typography>
              </div>
            ) : (
              <div
                className="border-input border p-2 bg-white "
                onClick={() =>
                  showModal(MODAL_ID.FILTER, {
                    state:
                      active === LIBRARY_STATE.BOOKS
                        ? LIBRARY_STATE.BOOKS
                        : LIBRARY_STATE.AUTHORS,
                  })
                }
              >
                <IoFilterSharp size="30px" />
              </div>
            )}
          </div>

          <div className="mt-10">
            {active === LIBRARY_STATE.BOOKS ? (
              <div className="flex flex-col md:flex-row flex-wrap mt-10">
                {books.map((book) => (
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
                ))}{" "}
              </div>
            ) : (
              <>
                <div className="flex flex-col md:flex-row flex-wrap">
                  {authors.map((author) => (
                    <AuthorCard
                      key={author._id}
                      id={author._id}
                      img={author.user.profile_url}
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
        {active === LIBRARY_STATE.BOOKS ? (
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
