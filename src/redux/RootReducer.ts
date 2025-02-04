import { combineReducers } from "redux";
import AuthReducer from "./slices/auth.slice";

import UiActionReducer from "./slices/uiActions.slice";

const rootReducer = combineReducers({
  auth: AuthReducer,
  uiActions: UiActionReducer,
});

export default rootReducer;
