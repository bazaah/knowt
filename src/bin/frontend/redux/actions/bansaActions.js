// Bansa is Korean for "reflection"
import { SET_BANSA_FILTER } from "./types";

export function setBansaFilter(filter) {
  return {
    type: SET_BANSA_FILTER,
    filter: filter
  };
}
