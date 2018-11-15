import React from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import { fetchFileDir } from "../redux/actions/contentActions"

// Subcomponent
import NavbarFile from "./NavbarFile"

// Small subcomponent for displaying file parents
class NavbarFolder extends React.Component {
  render() {
    const folder = this.props.folder
    return (
      <tr>
        <th>{folder}</th>
      </tr>
    )
  }
}

// Handles ordering and presentation of the
// file tree
class Navbar extends React.Component {
  componentDidMount() {
    // Fetches file tree before first render
    this.props.fetchFileDir("/api/dir")
  }

  render() {
    if (this.props.fileDirLoading) {
      return <p>Loading...</p>
    }

    const rows = []
    let lastFolder = null

    // Maps the array of files:
    // If array exists, map the array and check if the current parent
    // is the same as the last parent. If it is not push a header (NavbarFolder),
    // update lastFolder and run another map, pushing any files with the same parent
    if (this.props.fileList) {
      this.props.fileList.map(folder => {
        if (folder.parent !== lastFolder) {
          rows.push(<NavbarFolder folder={folder.parent} />)
          lastFolder = folder.parent

          this.props.fileList.map(file => {
            if (file.parent == lastFolder) {
              rows.push(<NavbarFile file={file.name} path={file.path} />)
            }
          })
        }
      })
    }

    return (
      <table>
        <thead>
          <tr>
            <th>NavBar</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    )
  }
}

Navbar.propTypes = {
  fileList: PropTypes.array.isRequired,
  fetchFileDir: PropTypes.func.isRequired,
  fileDirLoading: PropTypes.bool
}

NavbarFolder.propTypes = {
  folder: PropTypes.string
}

// Subscribes to the store
const mapStateToProps = state => {
  return {
    fileList: state.content.fileDirList.result,
    fileDirLoading: state.content.fileDirIsLoading
  }
}

//binds action creators to the indicated prop object
function mapDispatchToProps(dispatch) {
  return {
    fetchFileDir: url => dispatch(fetchFileDir(url))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Navbar)
