import React from "react";
import {
  setBansaFilter,
  showNewFileModal
} from "../redux/actions/bansaActions";
import { connect } from "react-redux";

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
