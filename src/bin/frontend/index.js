import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

import style from "./index.css";
import Navbar from "./components/Navbar";
import Menubar from "./components/Menubar";
import Content from "./components/Content";
import store from "./redux/store";

const INPUT = {
  metadata: "stuff'n'things",
  content:
    "# This is some markdown content in YAML that will be output as an <h1>.\n\nThis will be output as a paragraph tag.\n\nSo will this!\n\n## This is a secondary header\n\n* These\n* Are\n* List\n* Items\n\n### Code\n\n```js\nvar React = require('react');\n```\n\n### Tables\n\n| Oh | Look |\n| ------ | ------- |\n| a | table |\n"
};

/* const FILES = [
  { name: "test1", parent: "example/" },
  { name: "test2", parent: "example/" },
  { name: "test3", parent: "example/" },
  { name: "test4", parent: "example2/" },
  { name: "test5", parent: "example2/" },
  { name: "test6", parent: "example2/" }
]; */

class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <div className={style.wrapper}>
          <div className={style.header}>
            <Menubar />
          </div>
          <div className={style.navbar}>
            <Navbar />
          </div>
          <div className={style.content}>
            <div className={style.flex_content}>
              <Content content={this.props.input.content} />
            </div>
          </div>
          <div className={style.footer}>This is the footer</div>
        </div>
      </Provider>
    );
  }
}

ReactDOM.render(<App input={INPUT} />, document.getElementById("root"));
