import { combineReducers } from "redux";
import contentReducer from "./contentReducer";
import bansaReducer from "./bansaReducer";

export default combineReducers({
  content: contentReducer,
  bansa: bansaReducer
});
