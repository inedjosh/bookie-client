import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Reader } from "../../components/BookCard";
import { BookDetails } from "../../components/Modal/BookDetailsModal";

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
  authors: Author[];
  books: BookDetails[];
  bookPagination: {
    currenPage: number;
    totalPages: number;
  };
  authorsPagination: {
    currenPage: number;
    totalPages: number;
  };
};

const initialState: AuthorState = {
  authors: [
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
  ],
  books: [
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
  ],
  authorsPagination: {
    currenPage: 1,
    totalPages: 1,
  },
  bookPagination: {
    currenPage: 1,
    totalPages: 1,
  },
};

const librarySlice = createSlice({
  name: "Library",
  initialState,
  reducers: {
    setAuthors: (state, { payload }: PayloadAction<Author[]>) => {
      state.authors = payload;
    },
    setBooks: (state, { payload }: PayloadAction<BookDetails[]>) => {
      state.books = payload;
    },
    setAuthorsPagination: (
      state,
      {
        payload,
      }: PayloadAction<{
        currenPage: number;
        totalPages: number;
      }>
    ) => {
      state.authorsPagination = payload;
    },
    setBooksPagination: (
      state,
      {
        payload,
      }: PayloadAction<{
        currenPage: number;
        totalPages: number;
      }>
    ) => {
      state.bookPagination = payload;
    },
  },
});

const { actions, reducer: LibraryReducer } = librarySlice;

export const {
  setAuthors,
  setBooks,
  setAuthorsPagination,
  setBooksPagination,
} = actions;
export default LibraryReducer;
