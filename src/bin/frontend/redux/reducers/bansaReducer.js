// Bansa is Korean for "reflection"
import { SET_BANSA_FILTER, BansaFilter } from "../actions/types";

const initialState = {
  bansaFilter: BansaFilter.MARKDOWN_VIEW
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_BANSA_FILTER:
      return {
        ...state,
        bansaFilter: action.filter
      };
    default:
      return state;
  }
}
