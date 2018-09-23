import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { fetchContent } from "../redux/actions/contentActions";

class NavbarFolder extends React.Component {
  render() {
    const path = this.props.folder;
    return (
      <tr>
        <th>{path}</th>
      </tr>
    );
  }
}

class NavbarFile extends React.Component {
  render() {
    const name = this.props.file;
    return (
      <tr>
        <td onClick={() => alert("poke")}>{name}</td>
      </tr>
    );
  }
}

class Navbar extends React.Component {
  componentWillMount() {
    this.props.onFetchContent();
  }
  // console.log(this.props.fileList.result);
  // console.log(this.props.files);

  render() {
    const rows = [];
    let lastFolder = null;

    if (this.props.fileList) {
      this.props.fileList.map(file => {
        if (file.parent !== lastFolder) {
          rows.push(<NavbarFolder folder={file.parent} key={file.parent} />);
        }
        rows.push(<NavbarFile file={file.name} key={file.name} />);
        lastFolder = file.parent; /* what does this do? */
      });
    }

    return (
      <table>
        <thead>
          <tr>
            <th>NavBar</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    );
  }
}

Navbar.propTypes = {
  onFetchContent: PropTypes.func.isRequired,
  fileList: PropTypes.array.isRequired
};

const mapDispatchToProps = dispatch => {
  return {
    onFetchContent: () => dispatch(fetchContent())
  };
};

const mapStateToProps = state => ({
  fileList: state.content.fileList.result
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Navbar);
