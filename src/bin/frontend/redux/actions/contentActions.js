import { FETCH_CONTENT, FETCH_YAML } from "./types";

export function fetchContent() {
  return function(dispatch) {
    console.log("fetching");
    fetch("/api/dir")
      .then(res => res.json())
      .then(filelist =>
        dispatch({
          type: FETCH_CONTENT,
          payload: filelist
        })
      );
  };
}

export function fetchYaml() {
  return function(dispatch) {
    console.log("fetching yaml");
    fetch("api/config/sample.yaml")
      .then(res => res.json())
      .then(yaml =>
        dispatch({
          type: FETCH_YAML,
          payload: yaml
        })
      );
  };
}
