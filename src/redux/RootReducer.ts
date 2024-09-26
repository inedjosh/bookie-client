import { combineReducers } from "redux";
import AuthReducer from "./slices/auth.slice";

import UiActionReducer from "./slices/uiActions.slice";
import AuthorReducer from "./slices/author.slice";
import LibraryReducer from "./slices/library.slice";

const rootReducer = combineReducers({
  auth: AuthReducer,
  uiActions: UiActionReducer,
  author: AuthorReducer,
  library: LibraryReducer,
});

export default rootReducer;
