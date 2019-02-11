import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import JsonViewer from "react-json-view";
import {
  workingFileElement,
  fetchElement,
  updateContent
} from "../redux/actions/contentActions";
import { setBansaFilter } from "../redux/actions/bansaActions";

class JsonTree extends React.Component {
  constructor(props) {
    super(props);

    this.handleSelect.bind(this);
    this.handleEdit.bind(this);
  }

  handleEdit(callback) {
    let pointer_array = [...callback.namespace, callback.name];
    let pointer = "/".concat(pointer_array.join("/"));
    this.props.updateContent(
      this.props.workingFile.path,
      pointer,
      callback.new_value
    );
  }

  handleSelect(callback) {
    const regex = /\{\{((\/[a-zA-Z0-9-_]+)+)\}\}/g;
    if (regex.test(callback.value)) {
      let jpointer = callback.value.replace(regex, "$2");
      this.props.workingFileElement(jpointer);
      this.props.fetchElement(this.props.workingFile.path, jpointer);
      this.props.setBansaFilter("MARKDOWN_VIEW");
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
        onEdit={edit => this.handleEdit(edit)}
        onSelect={select => this.handleSelect(select)}
      />
    );
  }
}

JsonTree.propTypes = {
  file: PropTypes.object,
  workingFile: PropTypes.object.isRequired,
  workingFileElement: PropTypes.func.isRequired,
  fetchElement: PropTypes.func.isRequired,
  updateContent: PropTypes.func.isRequired,
  setBansaFilter: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  file: state.content.contentData.result,
  workingFile: state.content.workingFile
});

function mapDispatchToProps(dispatch) {
  return {
    workingFileElement: pointer => dispatch(workingFileElement(pointer)),
    fetchElement: (path, pointer) => dispatch(fetchElement(path, pointer)),
    updateContent: (path, pointer, updateData) =>
      dispatch(updateContent(path, pointer, updateData)),
    setBansaFilter: view => dispatch(setBansaFilter(view))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(JsonTree);
