import React from "react";
import { connect } from "react-redux";
const ReactMarkdown = require("react-markdown");

class Content extends React.Component {
  render() {
    return <ReactMarkdown source={this.props.markdown} />;
  }
}

const mapStateToProps = state => ({
  markdown: state.content.contentData.result.content
});

export default connect(
  mapStateToProps,
  null
)(Content);
