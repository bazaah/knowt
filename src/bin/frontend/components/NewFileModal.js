import React from "react";
import { connect } from "react-redux";
import ReactModal from "react-modal";
import { showNewFileModal } from "../redux/actions/bansaActions";

ReactModal.setAppElement("#root");

class NewFileModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pathValue: "",
      nameValue: ""
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
  }

  handleChange(event) {
    const target = event.target;
    const value = target.name === "pathValue" ? target.value : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  handleSubmit(event) {
    const fullpath = this.state.pathValue.concat(this.state.nameValue);
    console.log(fullpath);
    event.preventDefault();
    this.props.showNewFileModal(false);
  }

  handleCloseModal(bool) {
    this.props.showNewFileModal(bool);
  }

  render() {
    return (
      <ReactModal isOpen={this.props.modalVisible}>
        <form onSubmit={this.handleSubmit}>
          <label>
            Path <br />
            <input
              type="text"
              name="pathValue"
              value={this.state.pathValue}
              placeholder="path/to/file"
              onChange={this.handleChange}
            />
          </label>
          <br />
          <label>
            Name <br />
            <input
              type="text"
              name="nameValue"
              value={this.state.nameValue}
              placeholder="Coolnewfile"
              onChange={this.handleChange}
            />
          </label>
          <br />
          <input type="submit" value="Submit" />
          <button onClick={() => this.handleCloseModal(false)}>Cancel</button>
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
