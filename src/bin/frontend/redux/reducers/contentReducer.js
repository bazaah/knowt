import { FETCH_CONTENT, NEW_CONTENT } from "../actions/types";

const initialState = {
  fileList: {},
  content: {}
};

export default function(state = initialState, action) {
  switch (action.type) {
    case FETCH_CONTENT:
      console.log("reducing");
      return {
        ...state,
        fileList: action.payload
      };
    default:
      return state;
  }
}
