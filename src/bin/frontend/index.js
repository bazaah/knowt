// React + Redux for glueing together React and HTML
// (ReactDOM), React and Redux (Provider) and
// Redux with the local store (store)
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import store from "./redux/store";

// Main css file containing the basic coloring
// and grid layout
import style from "./index.css";

// Component blocks
import Content from "./components/Content";
import Navbar from "./components/Navbar";
import Menubar from "./components/Menubar";
import NewFileModal from "./components/NewFileModal";

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
// Ties App to an element in index.html with the id of "root"
ReactDOM.render(<App />, document.getElementById("root"));
