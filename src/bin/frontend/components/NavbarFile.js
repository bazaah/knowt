import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { fetchYaml } from "../redux/actions/contentActions";
import { bindActionCreators } from "redux";

class NavbarFile extends React.Component {
  constructor(props) {
    super(props);

    this.onPress = this.onPress.bind(this);
  }

  onPress(fileName) {
    this.props.fetchYaml("api/config/".concat(fileName));
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
    fetchYaml: url => dispatch(fetchYaml(url))
  };
}

export default connect(
  null,
  mapDispatchToProps
)(NavbarFile);
