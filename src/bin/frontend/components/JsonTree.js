import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import JsonViewer from "react-json-view";
import {
  workingFileElement,
  fetchElement
} from "../redux/actions/contentActions";

class JsonTree extends React.Component {
  constructor(props) {
    super(props);

    this.handleSelect.bind(this);
  }

  handleSelect(callback) {
    const regex = /\{\{((\/[a-zA-Z0-9-_]+)+)\}\}/g;
    if (regex.test(callback.value)) {
      let jpointer = callback.value.replace(regex, "$2");
      console.log(jpointer);
      this.props.workingFileElement(jpointer);
      console.log(this.props.workingFile.pointer);
      this.props.fetchElement(this.props.workingFile.path, jpointer);
    }
  }
  render() {
    return (
      <JsonViewer
        src={this.props.file}
        collapseStringsAfterLength={12}
        name={false}
        indentWidth={1}
        displayDataTypes={false}
        displayObjectSize={false}
        onEdit={object => {
          console.log(object);
        }}
        onSelect={select => this.handleSelect(select)}
      />
    );
  }
}

JsonTree.propTypes = {
  file: PropTypes.object,
  workingFileElement: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  file: state.content.contentData.result,
  workingFile: state.content.workingFile
});

function mapDispatchToProps(dispatch) {
  return {
    workingFileElement: pointer => dispatch(workingFileElement(pointer)),
    fetchElement: (path, pointer) => dispatch(fetchElement(path, pointer))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(JsonTree);
