import {
  CONTENT_HAS_ERROR,
  CONTENT_IS_LOADING,
  CONTENT_FETCH_SUCCESS,
  FILEDIR_HAS_ERROR,
  FILEDIR_IS_LOADING,
  FILEDIR_FETCH_SUCCESS
} from "./types";

export function fetchFileDir(url) {
  return dispatch => {
    dispatch(fileDirLoading(true));

    fetch(url)
      .then(res => {
        dispatch(fileDirLoading(false));
        return res.json();
      })
      .then(data => dispatch(fileDirFetchSuccess(data)));
  };
}

export function fetchContent(url) {
  return dispatch => {
    dispatch(contentLoading(true));

    fetch(url)
      .then(res => {
        if (res.status !== 200) {
          throw Error(res.result);
        }
        dispatch(contentLoading(false));
        return res.json();
      })
      .then(data => dispatch(contentFetchSuccess(data)))
      .catch(() => dispatch(contentError(true)));
  };
}

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
