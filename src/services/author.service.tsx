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

export const DeleteAuthor = async (authorId: string) => {
  const url = `${auhtorEndpoint}/${authorId}`;
  const res = await axiosInstance.delete(url);

  return res.data;
};

export const UpdateAuthorProfile = async (payload: {
  pen_name?: string;
  bio?: string;
  genres?: string[];
}) => {
  const url = `${auhtorEndpoint}`;
  const res = await axiosInstance.put(url, payload);

  return res.data;
};

export const SearchAuthors = async ({
  query,
  genre,
}: {
  query?: string;
  genre?: string;
}) => {
  const params = new URLSearchParams();

  if (query) {
    params.append("query", query);
  }

  if (genre) {
    params.append("genres[]", genre);
  }

  const url = `${auhtorEndpoint}/search/authors?${params.toString()}`;

  const res = await axiosInstance.get(url);

  return res.data;
};
