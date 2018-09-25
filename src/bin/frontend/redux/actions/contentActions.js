import {
  FETCH_FILEDIR,
  FETCH_YAML,
  CONTENT_HAS_ERROR,
  CONTENT_IS_LOADING,
  CONTENT_FETCH_SUCCESS,
  FILEDIR_HAS_ERROR,
  FILEDIR_IS_LOADING,
  FILEDIR_FETCH_SUCCESS
} from "./types";

export function fileDirError(bool) {
  return {
    type: FILEDIR_HAS_ERROR,
    error: bool
  };
}

export function fileDirLoading(bool) {
  return {
    type: FILEDIR_IS_LOADING,
    loading: bool
  };
}

export function fileDirFetchSuccess(fileDir) {
  return {
    type: FILEDIR_FETCH_SUCCESS,
    payload: fileDir
  };
}

export function contentError(bool) {
  return {
    type: CONTENT_HAS_ERROR,
    error: bool
  };
}

export function contentLoading(bool) {
  return {
    type: CONTENT_IS_LOADING,
    loading: bool
  };
}

export function contentFetchSuccess(content) {
  return {
    type: CONTENT_FETCH_SUCCESS,
    payload: content
  };
}

export function fetchFileDir(url) {
  return dispatch => {
    console.log("fetching filedir");
    dispatch(fileDirLoading(true));

    fetch(url)
      .then(res => {
        dispatch(fileDirLoading(false));
        return res.json();
      })
      .then(data => dispatch(fileDirFetchSuccess(data)));
  };
}

// TODO: Convert to this over fetchYaml
export function fetchContent(url) {
  return dispatch => {
    console.log("fetching content");
    dispatch(contentLoading(true));

    fetch(url)
      .then(res => {
        dispatch(contentLoading(false));
        return res.json();
      })
      .then(data => dispatch(contentFetchSuccess(data)));
  };
}

export function fetchYaml(url) {
  return dispatch => {
    console.log("fetching yaml");
    fetch(url)
      .then(res => res.json())
      .then(yaml =>
        dispatch({
          type: FETCH_YAML,
          payload: yaml
        })
      );
  };
}

/*
export function fetchFileTree() {
  return function(dispatch) {
    console.log("fetching");
    fetch("/api/dir")
      .then(res => res.json())
      .then(filelist =>
        dispatch({
          type: FETCH_FILEDIR,
          payload: filelist
        })
      );
  };
}
*/
