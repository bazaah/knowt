import React from "react";
import PropTypes from "prop-types";
import NavbarFile from "./NavbarFile";
import { connect } from "react-redux";
import { fetchFileDir } from "../redux/actions/contentActions";

class NavbarFolder extends React.Component {
  render() {
    const folder = this.props.folder;
    return (
      <tr>
        <th>{folder}</th>
      </tr>
    );
  }
}

class Navbar extends React.Component {
  componentDidMount() {
    this.props.fetchFileDir("/api/dir");
  }

  render() {
    if (this.props.fileDirLoading) {
      return <p>Loading...</p>;
    }

    const rows = [];
    let lastFolder = null;

    if (this.props.fileList) {
      this.props.fileList.map(file => {
        if (file.parent !== lastFolder) {
          rows.push(<NavbarFolder folder={file.parent} key={file.id} />);
        }
        rows.push(
          <NavbarFile file={file.name} path={file.path} key={file.id} />
        );
        lastFolder = file.parent;
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
  fileList: PropTypes.array.isRequired,
  fileDirLoading: PropTypes.bool
};

function mapDispatchToProps(dispatch) {
  return {
    fetchFileDir: url => dispatch(fetchFileDir(url))
  };
}

const mapStateToProps = state => {
  return {
    fileList: state.content.fileDirList.result,
    fileDirLoading: state.content.fileDirIsLoading
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Navbar);
