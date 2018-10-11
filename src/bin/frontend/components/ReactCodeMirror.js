import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { updateContent } from "../redux/actions/contentActions";

// Due to legacy css in codemirror, some webpack
// loaders need to be disabled
import "!style-loader!css-loader!./codemirror.css";
// Importing a mode ruleset for codemirror
import "codemirror/mode/gfm/gfm.js";
import { Controlled as CodeMirror } from "react-codemirror2";

// Component that controls the react wrapper around
// codemirror. It contains local state apart from
// redux store
class ReactCodeMirror extends React.Component {
  constructor(props) {
    super(props);

    this.state = {}; // Local state initialized
    this.handleBlur = this.handleBlur.bind(this);
  }

  componentDidMount() {
    // Set local state to a redux element before first render
    this.setState({ value: this.props.markdown });
  }

  componentDidUpdate(prevProps) {
    // Ensures component will rerender on redux element change
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
        onChange={(editor, value) => {}}
        onBlur={() => this.handleBlur(this.state.value)}
      />
    );
  }
}

ReactCodeMirror.propTypes = {
  markdown: PropTypes.string,
  workingFile: PropTypes.string,
  updateContent: PropTypes.func.isRequired
};

// Subscribes to the store
const mapStateToProps = state => ({
  markdown: state.content.contentData.result.content,
  workingFile: state.content.workingFile
});

// Binds action creators to the indicated prop object
function mapDispatchToProps(dispatch) {
  return {
    updateContent: (url, updateData) => dispatch(updateContent(url, updateData))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ReactCodeMirror);
