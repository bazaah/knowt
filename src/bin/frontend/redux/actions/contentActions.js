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
export function fetchFileDir() {
  let url = "api/v1/router";
  return dispatch => {
    dispatch(fileDirLoading(true));
    fetch(url, {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        command: "Directory",
        version: 1
      })
    })
      .then(res => {
        dispatch(fileDirLoading(false));
        return res.json();
      })
      .then(response => {
        if (response.status.code !== 0) {
          throw Error(response.status.message);
        }
        dispatch(fileDirFetchSuccess(response));
      })
      .catch(err => dispatch(fileDirError(true)));
  };
}

// Async thunk meta action for fetching the content
// of an individual file
// Returns a json object
export function fetchContent(path) {
  let url = "api/v1/router";
  return dispatch => {
    dispatch(contentLoading(true));
    fetch(url, {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        command: "View",
        version: 1,
        data: { path: path }
      })
    })
      .then(res => {
        dispatch(contentLoading(false));
        return res.json();
      })
      .then(response => {
        if (response.status.code !== 0) {
          throw Error(response.status.message);
        }
        dispatch(contentFetchSuccess(response));
      })
      .catch(() => dispatch(contentError(true)));
  };
}

// Async thunk meta action for requesting an update
// for a given file, with given data
// Returns a json object
export function updateContent(path, pointer, updateData) {
  let url = "api/v1/router";

  return dispatch => {
    dispatch(updateLoading(true));
    fetch(url, {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        command: "Update",
        version: 1,
        data: { path: path, pointer: pointer, content: updateData }
      })
    })
      .then(res => {
        dispatch(updateLoading(false));
        return res.json();
      })
      .then(response => {
        if (response.status.code !== 0) {
          throw Error(response.status.message);
        }
        dispatch(updateSuccess(response));
      })
      .catch(() => dispatch(updateError(true)));
  };
}

// Async thunk meta action for creating a file,
// with the given path and data
// Returns a status code
export function newContent(path, newFile) {
  let url = "api/v1/router";
  return dispatch => {
    dispatch(newFileLoading(true));
    fetch(url, {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        command: "Create",
        version: 1,
        data: { content: newFile, path: path }
      })
    })
      .then(res => {
        dispatch(newFileLoading(false));
        return res.json();
      })
      .then(response => {
        if (response.status.code !== 0) {
          throw Error(response.status.message);
        }
        dispatch(newFileSuccess(response));
      })
      .catch(() => dispatch(updateError(true)));
  };
}

export function fetchElement(path, pointer) {
  let url = "api/v1/router";
  return dispatch => {
    dispatch(elementFetchLoading(true));
    fetch(url, {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        command: "Element",
        version: 1,
        data: { path: path, pointer: pointer }
      })
    })
      .then(res => {
        dispatch(elementFetchLoading(false));
        return res.json();
      })
      .then(response => {
        if (response.status.code !== 0) {
          throw Error(response.status.message);
        }
        dispatch(elementFetchSuccess(response));
      })
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
