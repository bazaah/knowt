import React from "react";
import { connect } from "react-redux";
import { updateContent } from "../redux/actions/contentActions";

import "!style-loader!css-loader!./codemirror.css";
import "codemirror/mode/gfm/gfm.js";
import { Controlled as CodeMirror } from "react-codemirror2";

class ReactCodeMirror extends React.Component {
  constructor(props) {
    super(props);

    this.state = { value: this.props.markdown };
    this.handleBlur = this.handleBlur.bind(this);
  }
  handleBlur(data) {
    const path = "api/content/config/sample.yaml";
    this.props.updateContent(path, data);
  }

  render() {
    const testvaluename = this.state.value;
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
        onBlur={() => this.handleBlur(testvaluename)}
      />
    );
  }
}

const mapStateToProps = state => ({
  markdown: state.content.contentData.result.content
});

function mapDispatchToProps(dispatch) {
  return {
    updateContent: (url, updateData) => dispatch(updateContent(url, updateData))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ReactCodeMirror);
