import {
  CONTENT_HAS_ERROR,
  CONTENT_IS_LOADING,
  CONTENT_FETCH_SUCCESS,
  FILEDIR_HAS_ERROR,
  FILEDIR_IS_LOADING,
  FILEDIR_FETCH_SUCCESS,
  UPDATE_ERROR,
  UPDATE_LOADING,
  UPDATE_SUCCESS,
  NEW_FILE_ERROR,
  NEW_FILE_LOADING,
  NEW_FILE_SUCCESS,
  ELEMENT_HAS_ERROR,
  ELEMENT_IS_LOADING,
  ELEMENT_FETCH_SUCCESS,
  WORKING_FILE_PATH,
  WORKING_FILE_ELEMENT
} from "./types";

// Async thunk meta action for file tree population
// Returns an array of objects
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

// Async thunk meta action for fetching the content
// of an individual file
// Returns a json object
export function fetchContent(url) {
  return dispatch => {
    dispatch(contentLoading(true));
    fetch(url)
      .then(res => {
        // this doesn't work, investigate correct method
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

// Async thunk meta action for requesting an update
// for a given file, with given data
// Returns a json object
export function updateContent(path, pointer, updateData) {
  const endpoint = "api/v1/update?";
  let params = { file_path: path, pointer_path: pointer };
  const query = new URLSearchParams(params);
  let url = endpoint.concat(query);

  return dispatch => {
    dispatch(updateLoading(true));
    fetch(url, {
      method: "PUT",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify(updateData)
    })
      .then(res => {
        if (res.status !== 200) {
          throw Error(res.result);
        }
        dispatch(updateLoading(false));
        return res.json();
      })
      .then(data => dispatch(updateSuccess(data)))
      .catch(() => dispatch(updateError(true)));
  };
}

// Async thunk meta action for creating a file,
// with the given path and data
// Returns a status code
export function newContent(url, newFile) {
  return dispatch => {
    dispatch(newFileLoading(true));
    fetch(url, {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify(newFile)
    })
      .then(res => {
        if (res.status !== 200) {
          throw Error(res.status);
        }
        dispatch(newFileLoading(false));
        return res.json();
      })
      .then(code => dispatch(newFileSuccess(code)))
      .catch(() => dispatch(updateError(true)));
  };
}

export function fetchElement(path, pointer) {
  const endpoint = "api/v1/element?";
  let params = { file_path: path, pointer_path: pointer };
  const query = new URLSearchParams(params);
  let url = endpoint.concat(query);

  return dispatch => {
    dispatch(elementFetchLoading(true));
    fetch(url, {
      method: "GET"
    })
      .then(res => {
        if (res.status !== 200) {
          throw Error(res.status);
        }
        dispatch(elementFetchLoading(false));
        return res.json();
      })
      .then(element => dispatch(elementFetchSuccess(element)))
      .catch(() => dispatch(elementFetchError(true)));
  };
}

// Actions for setting the current working file and element
export function workingFilePath(path) {
  return {
    type: WORKING_FILE_PATH,
    path: path
  };
}

export function workingFileElement(pointer) {
  return {
    type: WORKING_FILE_ELEMENT,
    pointer: pointer
  };
}

// Action creators used in the meta actions
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

export function updateError(bool) {
  return {
    type: UPDATE_ERROR,
    error: bool
  };
}

export function updateLoading(bool) {
  return {
    type: UPDATE_LOADING,
    loading: bool
  };
}

export function updateSuccess(update) {
  return {
    type: UPDATE_SUCCESS,
    payload: update
  };
}

export function newFileError(bool) {
  return {
    type: NEW_FILE_ERROR,
    error: bool
  };
}

export function newFileLoading(bool) {
  return {
    type: NEW_FILE_LOADING,
    loading: bool
  };
}

export function newFileSuccess(code) {
  return {
    type: NEW_FILE_SUCCESS,
    status: code
  };
}

export function elementFetchError(bool) {
  return {
    type: ELEMENT_HAS_ERROR,
    error: bool
  };
}

export function elementFetchLoading(bool) {
  return {
    type: ELEMENT_IS_LOADING,
    loading: bool
  };
}

export function elementFetchSuccess(element) {
  return {
    type: ELEMENT_FETCH_SUCCESS,
    payload: element
  };
}
