import React from "react";
import { connect } from "react-redux";

class Menubar extends React.Component {
  render() {
    return (
      <div>
        <button onClick={() => console.log("display button")}>Display</button>
        <button onClick={() => console.log("editor button")}>Editor</button>
      </div>
    );
  }
}

export default Menubar;
