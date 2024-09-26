import { useEffect, useState } from "react";
import { Typography } from "../Typography";
import BookCard from "../BookCard";
import { Input } from "../Inputs/TextInput";
import { Textarea } from "../Inputs/TextAreaInput";
import { FaBookReader, FaStar } from "react-icons/fa";
import { GENRES, USER_ROLE } from "../../contants";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useRequestError } from "../Hooks/useRequestError";
import { useFormik } from "formik";
import * as yup from "yup";
import { GetAuthor, UpdateAuthorProfile } from "../../services/author.service";
import { Button } from "../Buttons";
import { ClipLoader } from "react-spinners";
import { useModal } from "../Modal/ModalProvider";
import { MODAL_ID } from "../../Layouts/ModalLayouts";
import { toast } from "react-toastify";
import { setAuthor } from "../../redux/slices/author.slice";

type FormProps = {
  pen_name: string;
  bio: string;
};

const schema = yup.object().shape({
  pen_name: yup.string().required("Pen Name is required "),
  bio: yup.string().required("Bio is required "),
});

function AuthorProfile() {
  const { user } = useSelector((state: RootState) => state.auth);
  const { author } = useSelector((state: RootState) => state.author);
  const { handleRequestError } = useRequestError({ useToast: true });
  const [loading, setLoading] = useState(false);
  const { showModal } = useModal();
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [addNewGenres, setAddNewGenres] = useState(false);
  const dispatch = useDispatch();

  const selectGenres = (genre: string) => {
    setSelectedGenres((prev) => {
      if (prev.includes(genre)) {
        return prev.filter((g) => g !== genre);
      } else {
        return [...prev, genre];
      }
    });
  };

  useEffect(() => {
    const getAuthor = async () => {
      try {
        setLoading(true);
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
      } catch (error) {
        handleRequestError(error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === USER_ROLE.AUTHOR && user?.id) getAuthor();
  }, [user]);

  const {
    values,
    handleChange,
    handleBlur,
    isSubmitting,
    touched,
    errors,
    handleSubmit,
    setValues,
  } = useFormik({
    initialValues: {
      pen_name: "",
      bio: "",
    },
    validationSchema: schema,
    onSubmit: (values: FormProps) => submit(values),
  });

  useEffect(() => {
    setValues({
      ...values,
      pen_name: author.pen_name,
      bio: author.bio,
    });
  }, [author]);

  const [editedForm, setEditedForm] = useState(false);

  useEffect(() => {
    const isEdited =
      values.pen_name !== author?.pen_name ||
      values.bio !== author?.bio ||
      addNewGenres;

    setEditedForm(isEdited);
  }, [values, user, addNewGenres]);

  const submit = async (values: FormProps) => {
    try {
      let payload;
      if (addNewGenres && selectGenres.length) {
        payload = {
          ...values,
          genres: selectedGenres,
        };
      } else {
        payload = {
          ...values,
        };
      }
      const updatedAuthor = await UpdateAuthorProfile(payload, author._id);
      console.log(updatedAuthor);
      toast.success("Authors profile updated successfully");
    } catch (error) {
      handleRequestError(error);
    }
  };

  if (loading)
    return (
      <div className="w-full h- flex justify-center items-center">
        <ClipLoader color="#5b32e5" size="20px" />
      </div>
    );

  return (
    <div>
      <div className="flex flex-col  md:flex-row flex-wrap ">
        <div className=" lg:w-[70%]">
          <div className="flex flex-col w-full  md:flex-row">
            <div className="md:pl-5 mt-10  w-full">
              <div className="flex items-center">
                <Typography
                  as="h4"
                  variant="subheading"
                  className="border-r-2 border-input pr-3"
                >
                  {author?.user.first_name} {author?.user?.last_name}{" "}
                </Typography>
                <Typography
                  as="p"
                  variant="body"
                  color="muted-alt"
                  className="pl-3"
                >
                  {author?.pen_name}{" "}
                </Typography>
              </div>
              <div className="flex items-center my-3">
                {author.rating > 0 &&
                  [...Array(author.rating)].map((_, index) => {
                    const starNumber = index + 1;
                    return (
                      <span key={starNumber} className="flex">
                        <FaStar className="text-secondary" />
                      </span>
                    );
                  })}
                <Typography as="p" variant="body" className="pl-3">
                  {author.rating} Rating
                </Typography>
              </div>
              <div className="flex items-center my-4">
                {" "}
                <FaBookReader />
                <Typography as="p" variant="body" className=" pl-3">
                  {author.books.length} Books{" "}
                </Typography>
              </div>
              <hr className="my-10" />
              <form onSubmit={handleSubmit} className="mt-10">
                <Typography as="h3" variant="subheading" className="">
                  Details{" "}
                </Typography>
                <div className=" my-3">
                  <Input
                    value={values.pen_name}
                    onChange={handleChange}
                    touched={touched.pen_name}
                    className="placeholder:text-xs"
                    name="pen_name"
                    handleBlur={handleBlur}
                    error={errors.pen_name}
                    placeholder="Enter your pen name"
                    type="text"
                    label="Pen Name"
                  />
                </div>
                {addNewGenres ? (
                  <div className="my-4 ">
                    <div className="flex justify-between w-full mt-4">
                      <Typography
                        variant="caption"
                        as="label"
                        className="font-medium text-sm"
                      >
                        Select genres
                      </Typography>
                      <Typography
                        variant="caption"
                        as="label"
                        className="font-medium text-sm cursor-pointer"
                        color="primary"
                        onClick={() => {
                          setAddNewGenres(false);
                          setSelectedGenres([]);
                        }}
                      >
                        Close
                      </Typography>
                    </div>

                    <div className="flex flex-wrap">
                      {GENRES.map((genre) => (
                        <div
                          key={genre.key}
                          className={`border-input border p-2 w-fit bg-inputBg m-1 rounded-full cursor-pointer ${
                            selectedGenres.includes(genre.value)
                              ? "bg-primary text-white"
                              : ""
                          }`}
                          onClick={() => selectGenres(genre.value)}
                        >
                          <Typography variant="caption">
                            {genre.value}
                          </Typography>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex justify-between w-full mt-4">
                      <Typography
                        variant="caption"
                        as="label"
                        className="font-medium text-sm"
                      >
                        Genres
                      </Typography>
                      <Typography
                        variant="caption"
                        as="label"
                        className="font-medium text-sm cursor-pointer"
                        color="primary"
                        onClick={() => {
                          setAddNewGenres(true);
                          setSelectedGenres(author.genres);
                        }}
                      >
                        Add New
                      </Typography>
                    </div>
                    <div className="flex flex-wrap">
                      {author.genres.map((genre, index) => (
                        <div
                          key={index}
                          className={`border-input border p-2 w-fit m-1 rounded-full cursor-pointer bg-inputBg`}
                        >
                          <Typography variant="caption">{genre}</Typography>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div className=" my-3">
                  <Textarea
                    value={values.bio}
                    onChange={handleChange}
                    touched={touched.bio}
                    className="placeholder:text-xs"
                    name="bio"
                    handleBlur={handleBlur}
                    error={errors.bio}
                    placeholder="Enter your bio"
                    label="Bio"
                  />
                </div>
                <Button
                  type="submit"
                  loading={isSubmitting}
                  disabled={!editedForm || isSubmitting}
                >
                  Update
                </Button>
              </form>
            </div>
          </div>{" "}
          <hr className="my-10" />
          <div className=" w-full ">
            <Typography as="h4" variant="subheading" className=" mt-10">
              My Books
            </Typography>
            <div className="flex flex-col w-full md:flex-row flex-wrap mt-10">
              {author.books.length < 1 ? (
                <div className="flex justify-center w-full items-center flex-col">
                  <Typography
                    as="p"
                    variant="body"
                    color="muted-alt"
                    className=" mt-10 text-center"
                  >
                    No Books yet{" "}
                  </Typography>
                  <div className="w-[150px] mt-5">
                    {" "}
                    <Button
                      onClick={() => showModal(MODAL_ID.ADD_BOOK)}
                      type="submit"
                    >
                      Add Book
                    </Button>
                  </div>
                </div>
              ) : (
                author.books.map((book) => (
                  <BookCard
                    key={book._id}
                    isAuthor={user.role === USER_ROLE.AUTHOR}
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
              )}{" "}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthorProfile;
