// Bansa is Korean for "reflection"
import { SET_BANSA_FILTER, SHOW_NEW_FILE_MODAL } from "./types";

export function setBansaFilter(filter) {
  return {
    type: SET_BANSA_FILTER,
    filter: filter
  };
}

export function showNewFileModal(bool) {
  return {
    type: SHOW_NEW_FILE_MODAL,
    visible: bool
  };
}
