import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import rootReducer from "./reducers/root";

// Unless using server-side rendering
// createStore()'s initial state should be an
// empty object
const initialState = {};

// Add middleware as items to this array
const middleware = [thunk];

const store = createStore(
  rootReducer,
  initialState,
  compose(
    applyMiddleware(...middleware),
    // This line allows the redux dev tools to interact with the store
    // Any browser that doesn't have this extension will not load this site
    // Remove before public release
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  )
);

export default store;
