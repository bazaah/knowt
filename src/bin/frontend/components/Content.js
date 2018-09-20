import React from "react";
const ReactMarkdown = require("react-markdown");

class Content extends React.Component {
  render() {
    return <ReactMarkdown source={this.props.content} />;
  }
}

export default Content;
