import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export enum LIBRARY_STATE {
  BOOKS = "books",
  AUTHORS = "authors",
}

type UiActionState = {
  libraryState: LIBRARY_STATE;
  searchActive: boolean;
};

const initialState: UiActionState = {
  libraryState: LIBRARY_STATE.BOOKS,
  searchActive: false,
};

const uiActionSlice = createSlice({
  name: "uiActions",
  initialState,
  reducers: {
    setLibraryState: (state, { payload }: PayloadAction<LIBRARY_STATE>) => {
      state.libraryState = payload;
    },
    setSearchActive: (state, { payload }: PayloadAction<boolean>) => {
      state.searchActive = payload;
    },
  },
});

const { actions, reducer: UiActionReducer } = uiActionSlice;

export const { setLibraryState, setSearchActive } = actions;
export default UiActionReducer;
