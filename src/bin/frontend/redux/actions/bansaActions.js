// Bansa is Korean for "reflection"
import { SET_BANSA_FILTER, SHOW_NEW_FILE_MODAL } from "./types";

// Switches between BansaFilter (see types) elements
export function setBansaFilter(filter) {
  return {
    type: SET_BANSA_FILTER,
    filter: filter
  };
}

// Toggles state element that controls NewFileModal visiblity
export function showNewFileModal(bool) {
  return {
    type: SHOW_NEW_FILE_MODAL,
    visible: bool
  };
}
