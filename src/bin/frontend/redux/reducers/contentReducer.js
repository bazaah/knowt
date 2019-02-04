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
} from "../actions/types";

const initialState = {
  fileDirList: { result: [{}] },
  contentData: {
    metadata: "stuff'n'things"
    /*result: {
      content: "# Please click a file"
    },*/
  },
  elementData: { result: "# Please click a file" }
};

// Reducer for content state
// Excluding default, every case must return
// the previous state ('...state') and an optional alteration
// Never mutate state, only copy
export default function(state = initialState, action) {
  switch (action.type) {
    case FILEDIR_FETCH_SUCCESS:
      return {
        ...state,
        fileDirList: action.payload
      };
    case FILEDIR_HAS_ERROR:
      return {
        ...state,
        fileDirError: action.error
      };
    case FILEDIR_IS_LOADING:
      return {
        ...state,
        fileDirIsLoading: action.loading
      };
    case CONTENT_FETCH_SUCCESS:
      return {
        ...state,
        contentData: action.payload
      };
    case CONTENT_HAS_ERROR:
      return {
        ...state,
        contentError: action.error
      };
    case CONTENT_IS_LOADING:
      return {
        ...state,
        contentLoading: action.loading
      };
    case UPDATE_SUCCESS:
      return {
        ...state,
        contentData: action.payload
      };
    case UPDATE_ERROR:
      return {
        ...state,
        updateError: action.error
      };
    case UPDATE_LOADING:
      return {
        ...state,
        updateLoading: action.loading
      };
    case NEW_FILE_SUCCESS:
      return {
        ...state,
        newFileCreated: action.status
      };
    case NEW_FILE_ERROR:
      return {
        ...state,
        newFileError: action.error
      };
    case NEW_FILE_LOADING:
      return {
        ...state,
        newFileLoading: action.loading
      };
    case ELEMENT_FETCH_SUCCESS:
      return {
        ...state,
        elementData: action.payload
      };
    case ELEMENT_IS_LOADING:
      return {
        ...state,
        elementLoading: action.loading
      };
    case ELEMENT_HAS_ERROR:
      return {
        ...state,
        elementError: action.error
      };
    case WORKING_FILE_PATH:
      return {
        ...state,
        workingFile: {
          ...state.workingFile,
          path: action.path
        }
      };
    case WORKING_FILE_ELEMENT:
      return {
        ...state,
        workingFile: {
          ...state.workingFile,
          pointer: action.pointer
        }
      };
    default:
      return state;
  }
}
