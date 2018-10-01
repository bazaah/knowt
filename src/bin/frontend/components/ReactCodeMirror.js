import React from "react";
import { connect } from "react-redux";

import "!style-loader!css-loader!./codemirror.css";
import "codemirror/mode/gfm/gfm.js";
import { Controlled as CodeMirror } from "react-codemirror2";

class ReactCodeMirror extends React.Component {
  constructor(props) {
    super(props);

    this.state = { value: this.props.markdown };
  }
  render() {
    const options = {
      mode: "gfm",
      theme: "railscasts",
      lineNumbers: true
    };
    return (
      <CodeMirror
        value={this.state.value}
        options={options}
        onBeforeChange={(editor, data, value) => {
          this.setState({ value });
        }}
        onChange={(editor, value) => {
          console.log("control", { value });
        }}
      />
    );
  }
}

export default ReactCodeMirror;
