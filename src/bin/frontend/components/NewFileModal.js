import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import ReactModal from "react-modal";
import { showNewFileModal } from "../redux/actions/bansaActions";
import {
  newContent,
  workingFile,
  fetchFileDir,
  fetchContent
} from "../redux/actions/contentActions";

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
    event.preventDefault();
    let path = this.state.pathValue.trim();
    let name = this.state.nameValue.trim();
    const rgYaml = /\.yaml$/;

    if (!path.endsWith("/")) {
      path = path + "/";
    }
    if (!rgYaml.test(name)) {
      name = name + ".yaml";
    }

    const formatted_path = path.concat(name).trim();
    const fullpath = "api/".concat(formatted_path);
    console.log(fullpath);
    this.props.newContent(fullpath, { content: "# New file created by Knowt" });
    this.props.workingFile(formatted_path);
    this.props.fetchFileDir("api/dir");
    this.props.fetchContent(fullpath);
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
  workingFile: PropTypes.func.isRequired,
  fetchContent: PropTypes.func.isRequired,
  fetchFileDir: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  modalVisible: state.bansa.modalVisible
});

function mapDispatchToProps(dispatch) {
  return {
    showNewFileModal: bool => dispatch(showNewFileModal(bool)),
    newContent: (url, data) => dispatch(newContent(url, data)),
    workingFile: filePath => dispatch(workingFile(filePath)),
    fetchFileDir: url => dispatch(fetchFileDir(url)),
    fetchContent: url => dispatch(fetchContent(url))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NewFileModal);
