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
    this.props.fetchContent("api/config/".concat(fileName));
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
