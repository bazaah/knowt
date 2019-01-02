import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { BansaFilter } from "../redux/actions/types";
import ReactCodeMirror from "./ReactCodeMirror";
import JsonTree from "./JsonTree";
const ReactMarkdown = require("react-markdown");

// Modulates the lense through which the current file
// is being displayed
class Content extends React.Component {
  render() {
    if (this.props.bansaFilter == BansaFilter.MARKDOWN_VIEW) {
      return <ReactMarkdown source={this.props.markdown} />;
    } else if (this.props.bansaFilter == BansaFilter.EDITOR_VIEW) {
      return <ReactCodeMirror />;
    } else if (this.props.bansaFilter == BansaFilter.TREE_VIEW) {
      return <JsonTree />;
    }
  }
}

// Subscribes to the store
const mapStateToProps = state => ({
  markdown: state.content.contentData.result.content,
  bansaFilter: state.bansa.bansaFilter
});

Content.propTypes = {
  bansaFilter: PropTypes.string.isRequired,
  markdown: PropTypes.string
};

export default connect(
  mapStateToProps,
  null
)(Content);
