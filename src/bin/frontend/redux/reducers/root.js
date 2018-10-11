import { combineReducers } from "redux";
import contentReducer from "./contentReducer";
import bansaReducer from "./bansaReducer";

// Combines any reducers into a "rootReducer"
// that redux understands. Using export default
// with no other exports from this file allows for a
// slightly better naming scheme in 'store'
export default combineReducers({
  content: contentReducer,
  bansa: bansaReducer
});
