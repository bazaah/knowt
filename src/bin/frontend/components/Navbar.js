import React from "react";
import PropTypes from "prop-types";
import NavbarFile from "./NavbarFile";
import { connect } from "react-redux";
import { fetchContent } from "../redux/actions/contentActions";
import { bindActionCreators } from "redux";

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

class Navbar extends React.Component {
  componentWillMount() {
    this.props.actions.fetchContent();
  }

  render() {
    const rows = [];
    let lastFolder = null;

    if (this.props.fileList) {
      this.props.fileList.map(file => {
        if (file.parent !== lastFolder) {
          rows.push(<NavbarFolder folder={file.parent} key={file.id} />);
        }
        rows.push(
          <NavbarFile
            file={file.name}
            key={file.id}
            {...this.boundActionCreator}
          />
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
  fileList: PropTypes.array.isRequired
};

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ fetchContent }, dispatch)
  };
}

const mapStateToProps = state => ({
  fileList: state.content.fileList.result
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Navbar);
