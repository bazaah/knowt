import React from "react";
import { setBansaFilter } from "../redux/actions/bansaActions";
import { connect } from "react-redux";

class Menubar extends React.Component {
  constructor(props) {
    super(props);

    this.onPress = this.onPress.bind(this);
  }

  onPress(filter) {
    this.props.setBansaFilter(filter);
  }
  render() {
    return (
      <div>
        <button onClick={() => this.onPress("MARKDOWN_VIEW")}>Markdown</button>
        <button onClick={() => this.onPress("EDITOR_VIEW")}>Editor</button>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    setBansaFilter: filter => dispatch(setBansaFilter(filter))
  };
}

export default connect(
  null,
  mapDispatchToProps
)(Menubar);
