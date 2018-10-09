import React from "react";
import { connect } from "react-redux";
import ReactModal from "react-modal";
import { showNewFileModal } from "../redux/actions/bansaActions";

ReactModal.setAppElement("#root");

class NewFileModal extends React.Component {
  constructor(props) {
    super(props);

    this.handleCloseModal = this.handleCloseModal.bind(this);
  }

  handleCloseModal(bool) {
    this.props.showNewFileModal(bool);
  }

  render() {
    return (
      <ReactModal isOpen={this.props.modalVisible}>
        <form>
          <label>
            Path <br />
            <input type="text" placeholder="path/to/file" />
          </label>
          <br />
          <label>
            Name <br />
            <input type="text" placeholder="Coolnewfile" />
          </label>
          <br />
          <button onClick={() => this.handleCloseModal(false)}>Submit</button>
        </form>
      </ReactModal>
    );
  }
}

const mapStateToProps = state => ({
  modalVisible: state.bansa.modalVisible
});

function mapDispatchToProps(dispatch) {
  return {
    showNewFileModal: bool => dispatch(showNewFileModal(bool))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NewFileModal);
