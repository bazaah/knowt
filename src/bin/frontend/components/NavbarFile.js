import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { fetchContent } from "../redux/actions/contentActions";
import { bindActionCreators } from "redux";

class NavbarFile extends React.Component {
  constructor(props) {
    super(props);

    this.onPress = this.onPress.bind(this);
  }

  onPress(fileName) {
    const path = "api/".concat(this.props.path.slice(1).join("/")).concat("/"); // This is why I hate js array manipulation TODO: improve backend data so I can avoid this
    this.props.fetchContent(path.concat(fileName));
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

function mapDispatchToProps(dispatch) {
  return {
    fetchContent: url => dispatch(fetchContent(url))
  };
}

export default connect(
  null,
  mapDispatchToProps
)(NavbarFile);
