import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Reader } from "../../components/BookCard";

export type Author = {
  _id: string;
  user: {
    _id: string;
    email: string;
    first_name: string;
    last_name: string;
    username: string;
    profile_url: string;
    role: string;
  };
  bio: string;
  pen_name: string;
  genres: string[];
  rating: number;
  books: {
    _id: string;
    book_image_url: string;
    title: string;
    description: string;
    rating: number;
    genre: string;
    book_url: string;
    readers: Reader[];
  }[];
};

type AuthorState = {
  author: Author;
};

const initialState: AuthorState = {
  author: {
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
};

const authorSlice = createSlice({
  name: "Author",
  initialState,
  reducers: {
    setAuthor: (state, { payload }: PayloadAction<Author>) => {
      state.author = payload;
    },
  },
});

const { actions, reducer: AuthorReducer } = authorSlice;

export const { setAuthor } = actions;
export default AuthorReducer;
