import axiosInstance from "../Utils/Https";

const auhtorEndpoint = "authors";

export const BecomenAnAuthor = async (payload: {
  pen_name: string;
  bio: string;
  genres: string[];
}) => {
  const url = `${auhtorEndpoint}`;
  const res = await axiosInstance.post(url, payload);

  return res.data;
};

export const GetAuthor = async (userId: string) => {
  const url = `${auhtorEndpoint}/${userId}`;
  const res = await axiosInstance.get(url);

  return res.data;
};

export const GetAllAuthors = async (page: number) => {
  const url = `${auhtorEndpoint}?page=${page}`;
  const res = await axiosInstance.get(url);

  return res.data;
};

export const UpdateAuthorProfile = async (
  payload: {
    pen_name?: string;
    bio?: string;
    genres?: string[];
  },
  authorId: string
) => {
  const url = `${auhtorEndpoint}/${authorId}`;
  const res = await axiosInstance.put(url, payload);

  return res.data;
};

export const SearchAuthors = async ({
  query,
  genre,
}: {
  query?: string;
  genre?: string;
  bookId?: string;
}) => {
  const url = `${auhtorEndpoint}/search?query=${query}&genres[]=${genre}`;

  const res = await axiosInstance.get(url);

  return res.data;
};
