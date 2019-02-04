import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { fetchContent, workingFilePath } from "../redux/actions/contentActions";

// Controls the rows representing files in Navbar
// Handles requesting the corresponding file from the server
class NavbarFile extends React.Component {
  constructor(props) {
    super(props);

    this.onPress = this.onPress.bind(this);
  }

  onPress(fileName) {
    const path = this.props.path
      .slice(1)
      .join("/")
      .concat("/"); // This is why I hate js array manipulation TODO: improve backend data so I can avoid this
    this.props.workingFilePath(path.concat(fileName));
    this.props.fetchContent("api/".concat(path.concat(fileName)));
  }
  render() {
    const name = this.props.file;
    return (
      <tr>
        <td onClick={() => this.onPress(name)}>{name}</td>
      </tr>
    );
  }
}

NavbarFile.propTypes = {
  path: PropTypes.array,
  workingFilePath: PropTypes.func.isRequired,
  fetchContent: PropTypes.func.isRequired,
  file: PropTypes.string
};

//binds action creators to the indicated prop object
function mapDispatchToProps(dispatch) {
  return {
    fetchContent: url => dispatch(fetchContent(url)),
    workingFilePath: filePath => dispatch(workingFilePath(filePath))
  };
}

export default connect(
  null,
  mapDispatchToProps
)(NavbarFile);
