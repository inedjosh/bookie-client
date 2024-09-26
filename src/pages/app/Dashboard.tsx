import { Link, useNavigate } from "react-router-dom";
import { BookImage, HeroImage } from "../../assets";
import { Button } from "../../components/Buttons";
import { Typography } from "../../components/Typography";
import AuthorCard from "../../components/AuthorCard";
import BookCard from "../../components/BookCard";
import { useEffect, useState } from "react";
import { GetAllAuthors } from "../../services/author.service";
import { GetAllBooks } from "../../services/book.service";
import { useRequestError } from "../../components/Hooks/useRequestError";
import { Author } from "../../redux/slices/author.slice";
import { BookDetails } from "../../components/Modal/BookDetailsModal";
import { ClipLoader } from "react-spinners";

function Dashboard() {
  const navigate = useNavigate();
  const { handleRequestError } = useRequestError({ useToast: true });
  const [loading, setLoading] = useState(false);
  const [authors, setAuthors] = useState<Author[]>([
    {
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
    },
  ]);

  const [books, setBooks] = useState<BookDetails[]>([
    {
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
    },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await Promise.all([GetAllAuthors(1), GetAllBooks(1)]);

        setAuthors(data[0].data.authors);
        setBooks(data[1].data.books);
      } catch (error) {
        handleRequestError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <main className="">
      <section className="flex py-5 lg:py-14  flex-col items-center justify-between lg:flex-row ">
        <div className="flex-[.5]">
          <Typography
            as="h1"
            className="text-[44px] lg:text-[60px] leading-[64px] w-[300px]"
          >
            New Releases This Week
          </Typography>
          <div className="my-5">
            <Typography variant="body" className=" lg:w-[400px]">
              It's time to update your reading list with some of the latest and
              greatest releases in the literary world. From heart-pumping
              thrillers to captivating memoirs, this week's new releases offer
              something for everyone
            </Typography>
          </div>
          <div className="lg:w-[400px]">
            <Button onClick={() => navigate("/app/library")}>Explore</Button>
          </div>{" "}
        </div>
        <div className="mt-8 lg:mt-0 flex-[.6]">
          <img src={HeroImage} />
        </div>
      </section>
      <>
        {loading ? (
          <div className="w-full h-[100px] flex justify-center items-center">
            <ClipLoader color="#5b32e5" size="20px" />
          </div>
        ) : (
          <>
            <section>
              <Typography as="h3" variant="heading">
                Top Books
              </Typography>
              <div className="flex flex-col md:flex-row flex-wrap">
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
                ))}
              </div>
              <Link to="/app/library">
                {" "}
                <Typography
                  className="pl-5 "
                  variant="underlined"
                  color="primary"
                >
                  See All{" "}
                </Typography>
              </Link>
            </section>
            <section className="mt-20 ">
              <Typography as="h3" variant="heading">
                Top Authors
              </Typography>
              <div className="flex flex-col mt-10 md:flex-row flex-wrap">
                {authors.map((author) => (
                  <AuthorCard
                    key={author._id}
                    id={author._id}
                    img={author.user.profile_url}
                    name={`${author.user.first_name} ${author.user.last_name}`}
                    genres={author.genres}
                    rating={author.rating}
                    bio={author.bio}
                    author={author}
                  />
                ))}{" "}
              </div>
              <Link to="/app/library">
                {" "}
                <Typography
                  variant="underlined"
                  color="primary"
                  className="pl-5 mt-5"
                >
                  See All{" "}
                </Typography>
              </Link>
            </section>
          </>
        )}
      </>
    </main>
  );
}

export default Dashboard;
