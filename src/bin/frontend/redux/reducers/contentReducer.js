import {
  FETCH_YAML,
  CONTENT_HAS_ERROR,
  CONTENT_IS_LOADING,
  CONTENT_FETCH_SUCCESS,
  FILEDIR_HAS_ERROR,
  FILEDIR_IS_LOADING,
  FILEDIR_FETCH_SUCCESS
} from "../actions/types";

const initialState = {
  fileDirList: { result: [{}] },
  content: {},
  yamlForMarkdown: {
    metadata: "stuff'n'things",
    result: {
      content:
        "# This is some markdown content in YAML that will be output as an <h1>.\n\nThis will be output as a paragraph tag.\n\nSo will this!\n\n## This is a secondary header\n\n* These\n* Are\n* List\n* Items\n\n### Code\n\n```js\nvar React = require('react');\n```\n\n### Tables\n\n| Oh | Look |\n| ------ | ------- |\n| a | table |\n"
    }
  }
};

export default function(state = initialState, action) {
  switch (action.type) {
    case FETCH_YAML:
      console.log("reducing yaml");
      return {
        ...state,
        yamlForMarkdown: action.payload
      };
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
    default:
      return state;
  }
}
