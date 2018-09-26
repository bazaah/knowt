import React from "react";
import { connect } from "react-redux";
import { BansaFilter } from "../redux/actions/types";
const ReactMarkdown = require("react-markdown");

class Content extends React.Component {
  render() {
    if (this.props.bansaFilter == BansaFilter.MARKDOWN_VIEW) {
      return <ReactMarkdown source={this.props.markdown} />;
    } else if (this.props.bansaFilter == BansaFilter.EDITOR_VIEW) {
      return <textarea value={this.props.markdown} />;
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
