import React from "react";
import ReactDOM from "react-dom";
import style from "./index.css";

import Navbar from "./components/Navbar";
import Menubar from "./components/Menubar";
import Content from "./components/Content";

const INPUT = {
    metadata: "stuff'n'things",
    content:
        "# This is some markdown content in YAML that will be output as an <h1>.\n\nThis will be output as a paragraph tag.\n\nSo will this!\n\n## This is a secondary header\n\n* These\n* Are\n* List\n* Items\n\n### Code\n\n```js\nvar React = require('react');\n```\n\n### Tables\n\n| Oh | Look |\n| ------ | ------- |\n| a | table |\n"
};

const FILES = [
    { name: "test1", path: "example/" },
    { name: "test2", path: "example/" },
    { name: "test3", path: "example/" },
    { name: "test4", path: "example2/" },
    { name: "test5", path: "example2/" },
    { name: "test6", path: "example2/" }
];

class App extends React.Component {
    componentWillMount() {
        fetch("http://172.17.17.223:8001/api/dir") // <--- This is the line
            .then(res => res.json())
            .then(data => console.log(data));
    }

    render() {
        return (
            <div className={style.wrapper}>
                <div className={style.header}>
                    <Menubar />
                </div>
                <div className={style.navbar}>
                    <Navbar files={this.props.files} />
                </div>
                <div className={style.content}>
                    <div className={style.flex_content}>
                        <Content content={this.props.input.content} />
                    </div>
                </div>
                <div className={style.footer}>This is the footer</div>
            </div>
        );
    }
}

ReactDOM.render(
    <App input={INPUT} files={FILES} />,
    document.getElementById("root")
);
