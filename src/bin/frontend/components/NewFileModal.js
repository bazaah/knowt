import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import ReactModal from "react-modal";
import { showNewFileModal } from "../redux/actions/bansaActions";
import {
  newContent,
  workingFilePath,
  fetchFileDir,
  fetchContent
} from "../redux/actions/contentActions";

// Ensures the modal binds to the correct element
// Must be set before any instance of <ReactModal> is called
ReactModal.setAppElement("#root");

// This component handles the user input needed to
// create a new file. It wraps an instance of <ReactModal>
// which wraps a form of input fields
// It contains local state apart from the redux store
class NewFileModal extends React.Component {
  constructor(props) {
    super(props);
    // Local state initialized
    this.state = {
      pathValue: "",
      nameValue: ""
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
  }

  // Function for handling form input from both fields
  handleChange(event) {
    const target = event.target;
    const value = target.name === "pathValue" ? target.value : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  // Function for handling form submission
  // Formats user input and dispatches actions so that
  // the system properly reflects the new file
  handleSubmit(event) {
    event.preventDefault();
    let path = this.state.pathValue.trim();
    let fmtPath = path.replace(/[^-0-9A-Za-z_]/g, " ");
    fmtPath = fmtPath.replace(/\s+/g, "/");

    if (!fmtPath.endsWith("/")) {
      fmtPath = fmtPath + "/";
    }

    let name = this.state.nameValue.trim();
    let fmtName = name.replace(/[^-0-9A-Za-z_.]/g, " ");
    fmtName = fmtName.replace(/\s+/g, "-");
    fmtName = fmtName.replace(/(?:\.ya?ml)$/, ".yaml");

    if (!/\.yaml$/.test(fmtName)) {
      fmtName = fmtName + ".yaml";
    }

    const fmtFilePath = fmtPath.concat(fmtName).trim();
    const fullPath = "api/".concat(fmtFilePath);

    this.props.newContent(fullPath, { content: "# New file created by Knowt" });
    this.props.workingFilePath(fmtFilePath);
    this.props.fetchFileDir("api/dir");
    this.props.fetchContent(fullPath);
    this.handleCloseModal(false);
  }

  handleCloseModal(bool) {
    this.props.showNewFileModal(bool);
    this.setState({
      pathValue: "",
      nameValue: ""
    });
  }

  render() {
    const styleOverides = {
      overlay: {
        backgroundColor: "rgba(230, 230, 230, 0.75)"
      },
      content: {
        maxheight: "calc(100% - 100px)",
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)"
      }
    };

    return (
      <ReactModal
        isOpen={this.props.modalVisible}
        onRequestClose={() => this.handleCloseModal(false)}
        style={styleOverides}
      >
        <form onSubmit={this.handleSubmit}>
          <label>
            Path <br />
            <input
              type="text"
              name="pathValue"
              value={this.state.pathValue}
              placeholder="Path/to/file/"
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
              placeholder="File Name"
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

NewFileModal.propTypes = {
  modalVisible: PropTypes.bool.isRequired,
  showNewFileModal: PropTypes.func.isRequired,
  newContent: PropTypes.func.isRequired,
  workingFilePath: PropTypes.func.isRequired,
  fetchContent: PropTypes.func.isRequired,
  fetchFileDir: PropTypes.func.isRequired
};

// Subscribes to the store
const mapStateToProps = state => ({
  modalVisible: state.bansa.modalVisible
});

// Binds action creators to the indicated prop object
function mapDispatchToProps(dispatch) {
  return {
    showNewFileModal: bool => dispatch(showNewFileModal(bool)),
    newContent: (url, data) => dispatch(newContent(url, data)),
    workingFilePath: filePath => dispatch(workingFilePath(filePath)),
    fetchFileDir: url => dispatch(fetchFileDir(url)),
    fetchContent: url => dispatch(fetchContent(url))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NewFileModal);
