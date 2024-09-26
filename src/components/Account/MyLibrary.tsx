import { useEffect, useState } from "react";
import { GetMyLibrary } from "../../services/book.service";
import { useRequestError } from "../Hooks/useRequestError";
import BookCard, { Reader } from "../BookCard";
import { Typography } from "../Typography";
import { Button } from "../Buttons";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";

function MyLibrary() {
  const { handleRequestError } = useRequestError({ useToast: true });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [library, setLibrary] = useState<
    {
      _id: string;
      title: string;
      author: string;
      user: string;
      description: string;
      published_date: Date;
      book_url: string;
      book_image_url: string;
      genre: string;
      review: any[];
      rating: number;
      readers: Reader[];
    }[]
  >([
    {
      _id: "",
      title: "",
      author: "",
      user: "",
      description: "",
      published_date: new Date(),
      book_url: "",
      book_image_url: "",
      genre: "",
      rating: 0,
      review: [],
      readers: [],
    },
  ]);
  useEffect(() => {
    const getMyLibrary = async () => {
      try {
        setLoading(true);

        const data = await GetMyLibrary();
        setLibrary(data.data);
      } catch (error) {
        handleRequestError(error);
      } finally {
        setLoading(false);
      }
    };

    getMyLibrary();
  }, []);

  if (loading)
    return (
      <div className="w-full h-[500px] flex justify-center items-center">
        <ClipLoader color="#5b32e5" size="20px" />
      </div>
    );

  return (
    <div>
      <div className="flex flex-col md:flex-row flex-wrap mt-10">
        {library.length ? (
          library.map((book) => (
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
              myLibrary
            />
          ))
        ) : (
          <div className="flex justify-center h-[300px] w-full items-center flex-col">
            <Typography
              as="p"
              variant="body"
              color="muted-alt"
              className=" mt-10 text-center"
            >
              No Books yet
            </Typography>
            <div className="w-[150px] mt-5">
              {" "}
              <Button onClick={() => navigate("/app/library")} type="submit">
                Add Book
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyLibrary;
