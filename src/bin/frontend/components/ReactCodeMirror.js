import React from "react";
import { connect } from "react-redux";
import { updateContent } from "../redux/actions/contentActions";

import "!style-loader!css-loader!./codemirror.css";
import "codemirror/mode/gfm/gfm.js";
import { Controlled as CodeMirror } from "react-codemirror2";

class ReactCodeMirror extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
    this.handleBlur = this.handleBlur.bind(this);
  }

  componentDidMount() {
    this.setState({ value: this.props.markdown });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.markdown !== this.props.markdown) {
      this.setState({ value: this.props.markdown });
    }
  }

  handleBlur(data) {
    const path = "api/content/".concat(this.props.workingFile);
    this.props.updateContent(path, data);
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
        onBlur={() => this.handleBlur(this.state.value)}
      />
    );
  }
}

const mapStateToProps = state => ({
  markdown: state.content.contentData.result.content,
  workingFile: state.content.workingFile
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
