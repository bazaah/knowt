import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { fetchYaml } from "../redux/actions/contentActions";
import { bindActionCreators } from "redux";

class NavbarFile extends React.Component {
  render() {
    const name = this.props.file;
    const press = this.props.actions.fetchYaml;
    return (
      <tr>
        <td onClick={press}>{name}</td>
      </tr>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ fetchYaml }, dispatch)
  };
}

export default connect(
  null,
  mapDispatchToProps
)(NavbarFile);
