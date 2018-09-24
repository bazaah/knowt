import { FETCH_CONTENT, FETCH_YAML } from "../actions/types";

const initialState = {
  fileList: { result: [{}] },
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
    case FETCH_CONTENT:
      console.log("reducing filelist");
      return {
        ...state,
        fileList: action.payload
      };
    case FETCH_YAML:
      console.log("reducing filelist");
      return {
        ...state,
        yamlForMarkdown: action.payload
      };
    default:
      return state;
  }
}
