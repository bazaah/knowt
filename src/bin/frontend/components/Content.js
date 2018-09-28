import "!style-loader!css-loader!./codemirror.css";
import "codemirror/mode/gfm/gfm.js";
import { Controlled as ReactCodeMirror } from "react-codemirror2";

import React from "react";
import { connect } from "react-redux";
import { BansaFilter } from "../redux/actions/types";
const ReactMarkdown = require("react-markdown");

class Content extends React.Component {
  render() {
    const options = {
      theme: "material",
      mode: "javascript"
    };
    if (this.props.bansaFilter == BansaFilter.MARKDOWN_VIEW) {
      return <ReactMarkdown source={this.props.markdown} />;
    } else if (this.props.bansaFilter == BansaFilter.EDITOR_VIEW) {
      return (
        <ReactCodeMirror
          value={this.props.markdown}
          options={{
            mode: "gfm",
            theme: "railscasts",
            lineNumbers: true
          }}
        />
      );
    }
  }
}

const mapStateToProps = state => ({
  markdown: state.content.contentData.result.content,
  bansaFilter: state.bansa.bansaFilter
});

export default connect(
  mapStateToProps,
  null
)(Content);
