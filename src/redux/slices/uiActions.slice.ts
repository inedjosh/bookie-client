import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type UiActionState = {
  reload: boolean;
};

const initialState: UiActionState = {
  reload: false,
};

const uiActionSlice = createSlice({
  name: "uiActions",
  initialState,
  reducers: {
    setReload: (state, { payload }: PayloadAction<boolean>) => {
      state.reload = payload;
    },
  },
});

const { actions, reducer: UiActionReducer } = uiActionSlice;

export const { setReload } = actions;
export default UiActionReducer;
