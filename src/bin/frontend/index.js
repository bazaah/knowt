import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

import style from "./index.css";

import Content from "./components/Content";
import Navbar from "./components/Navbar";
import Menubar from "./components/Menubar";
import NewFileModal from "./components/NewFileModal";
import store from "./redux/store";

class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <div className={style.wrapper}>
          <NewFileModal />
          <div className={style.header}>
            <Menubar />
          </div>
          <div className={style.navbar}>
            <Navbar />
          </div>
          <div className={style.content}>
            <div className={style.flex_content}>
              <Content />
            </div>
          </div>
          <div className={style.footer}>This is the footer</div>
        </div>
      </Provider>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
