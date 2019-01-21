import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import JsonViewer from "react-json-view";

class JsonTree extends React.Component {
  render() {
    return (
      <JsonViewer
        src={this.props.file}
        collapseStringsAfterLength={12}
        name={false}
        indentWidth={2}
        displayDataTypes={false}
        displayObjectSize={false}
      />
    );
  }
}

JsonTree.propTypes = {
  file: PropTypes.object
};

const mapStateToProps = state => ({
  file: state.content.contentData.result
});

export default connect(
  mapStateToProps,
  null
)(JsonTree);
