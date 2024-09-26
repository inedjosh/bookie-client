import axiosInstance from "../Utils/Https";

const bookEndpoint = "books";

export const GetMyLibrary = async () => {
  const url = `${bookEndpoint}/library`;
  const res = await axiosInstance.get(url);

  return res.data;
};

export const UploadBook = async (payload: {
  title: string;
  description: string;
  book_url: string;
  book_image_url: string;
  genre: string;
}) => {
  const url = `${bookEndpoint}`;
  const res = await axiosInstance.post(url, payload);

  return res.data;
};

export const EditBook = async (
  payload: {
    title?: string;
    description?: string;
    book_url?: string;
    book_image_url?: string;
    genre?: string;
  },
  bookId: string
) => {
  const url = `${bookEndpoint}/${bookId}`;
  const res = await axiosInstance.put(url, payload);

  return res.data;
};

export const GetABook = async (bookId: string) => {
  const url = `${bookEndpoint}/${bookId}`;
  const res = await axiosInstance.get(url);

  return res.data;
};

export const GetAllBooks = async (page: number) => {
  const url = `${bookEndpoint}?page=${page}`;
  const res = await axiosInstance.get(url);

  return res.data;
};

export const ReadBook = async (payload: { bookId: string }) => {
  const url = `${bookEndpoint}/read`;
  const res = await axiosInstance.post(url, payload);

  return res.data;
};

export const RateBook = async (payload: {
  rating: number;
  comment: string;
  bookId: string;
}) => {
  const url = `${bookEndpoint}/review`;
  const res = await axiosInstance.post(url, payload);

  return res.data;
};

export const SearchBooks = async ({
  query,
  genre,
  rating,
}: {
  query?: string;
  genre?: string;
  rating?: number;
}) => {
  const url = `${bookEndpoint}/search?query=${query}&genre=${genre}&rating=${rating}`;

  const res = await axiosInstance.get(url);

  return res.data;
};
