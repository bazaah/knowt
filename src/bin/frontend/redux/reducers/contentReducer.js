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
  WORKING_FILE
} from "../actions/types";

const initialState = {
  fileDirList: { result: [{}] },
  contentData: {
    metadata: "stuff'n'things",
    result: {
      content: "# Please click a file"
    }
  }
};

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
    case WORKING_FILE:
      return {
        ...state,
        workingFile: action.file
      };
    default:
      return state;
  }
}
