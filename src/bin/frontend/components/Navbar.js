import React from "react";

class NavbarFolder extends React.Component {
  render() {
    const path = this.props.folder;
    return (
      <tr>
        <th>{path}</th>
      </tr>
    );
  }
}

class NavbarFile extends React.Component {
  render() {
    const name = this.props.file;
    return (
      <tr>
        <td onClick={() => alert("poke")}>{name}</td>
      </tr>
    );
  }
}

class Navbar extends React.Component {
  render() {
    const rows = [];
    let lastFolder = null;

    this.props.files.forEach(file => {
      if (file.path !== lastFolder) {
        rows.push(<NavbarFolder folder={file.path} key={file.path} />);
      }
      rows.push(<NavbarFile file={file.name} key={file.name} />);
      lastFolder = file.path; /* what does this do? */
    });

    return (
      <table>
        <thead>
          <tr>
            <th>NavBar</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    );
  }
}

export default Navbar;
