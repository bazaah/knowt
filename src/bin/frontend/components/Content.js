import React from "react";
import { connect } from "react-redux";
const ReactMarkdown = require("react-markdown");

class Content extends React.Component {
  render() {
    return <ReactMarkdown source={this.props.yaml} />;
  }
}

const mapStateToProps = state => ({
  yaml: state.content.yamlForMarkdown.result.content
});

export default connect(
  mapStateToProps,
  null
)(Content);
