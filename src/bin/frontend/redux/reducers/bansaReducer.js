// Bansa is Korean for "reflection"
import { SET_BANSA_FILTER, BansaFilter, SHOW_NEW_FILE_MODAL } from "../actions/types";

const initialState = {
  bansaFilter: BansaFilter.MARKDOWN_VIEW,
  modalVisible: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_BANSA_FILTER:
      return {
        ...state,
        bansaFilter: action.filter
      };
    case SHOW_NEW_FILE_MODAL:
      return {
        ...state,
        modalVisible: action.visible
      }
    default:
      return state;
  }
}
