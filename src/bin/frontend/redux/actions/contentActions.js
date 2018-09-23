import { FETCH_CONTENT, NEW_CONTENT } from "./types";

export function fetchContent() {
  return function(dispatch) {
    console.log("fetching");
    fetch("/api/dir")
      .then(res => res.json())
      .then(data =>
        dispatch({
          type: FETCH_CONTENT,
          payload: data
        })
      );
  };
}
