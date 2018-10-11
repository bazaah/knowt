import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  setBansaFilter,
  showNewFileModal
} from "../redux/actions/bansaActions";


// Concourse for user manipulation of the bansa
class Menubar extends React.Component {
  constructor(props) {
    super(props);

    this.onPress = this.onPress.bind(this);
    this.handleOpenModal = this.handleOpenModal.bind(this);
  }

  onPress(filter) {
    this.props.setBansaFilter(filter);
  }

  handleOpenModal(bool) {
    this.props.showNewFileModal(bool);
  }

  render() {
    return (
      <div>
        <button onClick={() => this.onPress("MARKDOWN_VIEW")}>Markdown</button>
        <button onClick={() => this.onPress("EDITOR_VIEW")}>Editor</button>
        <button onClick={() => this.handleOpenModal(true)}>New File</button>
      </div>
    );
  }
}

Menubar.propTypes = {
  setBansaFilter: PropTypes.func.isRequired,
  showNewFileModal: PropTypes.func.isRequired
}

//binds action creators to the indicated prop object
function mapDispatchToProps(dispatch) {
  return {
    setBansaFilter: filter => dispatch(setBansaFilter(filter)),
    showNewFileModal: bool => dispatch(showNewFileModal(bool))
  };
}

export default connect(
  null,
  mapDispatchToProps
)(Menubar);
