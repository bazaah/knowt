// Bansa is Korean for "reflection"
import {
  SET_BANSA_FILTER,
  BansaFilter,
  SHOW_NEW_FILE_MODAL
} from "../actions/types";

const initialState = {
  bansaFilter: BansaFilter.TREE_VIEW,
  modalVisible: false
};

// Reducer for bansa state
// Excluding default, every case must return
// the previous state ('...state') and an optional alteration
// Never mutate state, only copy
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
      };
    default:
      return state;
  }
}
