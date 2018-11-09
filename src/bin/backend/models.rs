use proc::yaml_deposit;
use serde_json::Value as JsonValue; // simple alias for serde_json::Value\
use settings::SETTINGS;
use std::fs;
use std::fs::File;
use std::path::PathBuf;
use std::result;
use walkdir::{DirEntry, WalkDir};

//Alias for handling Results<Ok, Err> where Ok can be any type,
//and Err is set to failure::Error, except when explicitly defined otherwise
type Result<T> = result::Result<T, ::failure::Error>;

// Main function for converting a yaml file into a json string
// Takes one variable which is the path to the file, relative to the root directory
// which is set in SETTINGS as 'path'
// It returns a Result of JsonValue which is a serde provided struct that is easy to convert to/from json; or an error
pub fn show(path: PathBuf) -> Result<JsonValue> {
    let mut pathbuf = PathBuf::from(
        SETTINGS
            .read()
            .expect("config file lock violation")
            .get_str("path")?,
    ); // Finding the file directory root
    pathbuf.push(path); // Adding the relative path passed to the function, to the root path
    let file = File::open(pathbuf)?;
    let data: JsonValue = ::serde_yaml::from_reader(file)?;
    Ok(data)
}

// Main function for creating new yaml files
// Takes two variables: file and path, file is a JsonValue that contains valid json,
// path is the relative path from the SETTINGS defined root
// It returns nothing; or an error
pub fn create(file: JsonValue, path: PathBuf) -> Result<()> {
    let mut path_buf = PathBuf::from(
        SETTINGS
            .read()
            .expect("config file lock violation")
            .get_str("path")?,
    ); //Finding the file directory root
    path_buf.push(path);
    fs::create_dir_all(path_buf.parent().unwrap())?; // Unwrap cannot fail, either the directory exists/is created or create_dir_all will return an error
    let new_file = ::serde_yaml::to_string(&file)?;
    yaml_deposit(new_file, path_buf);
    Ok(())
}

// Main function for updating data in existing yaml files
// Takes three variables: update, key, path; update is a JsonValue that contains valid json
// path is the relative path from the SETTINGS defined root
// key being the key to the value that is being updated
// It returns nothing; or an error
pub fn update_data(content_update: JsonValue, key: String, path: PathBuf) -> Result<JsonValue> {
    let mut path_buf = PathBuf::from(
        SETTINGS
            .read()
            .expect("config file lock violation")
            .get_str("path")?,
    ); //Finding the file directory root
    path_buf.push(path);
    let file = File::open(&path_buf)?;
    let k = key.as_str(); // Takes a &str slice of key
    let update = json!({ k: content_update });
    let mut yaml_file: JsonValue = ::serde_yaml::from_reader(&file)?;
    // Ensures that the key exists in both the update data and the file being updated
    if yaml_file.get(k).is_some() && update.get(k).is_some() {
        *yaml_file.get_mut(k).unwrap() = update.get(k).unwrap().to_owned(); // Unwrap(s) cannot fail due to the above check
        let yaml_str = ::serde_yaml::to_string(&yaml_file)?;
        yaml_deposit(yaml_str, path_buf);
    }
    Ok(yaml_file)
}

// Generic error handling for errors that users can fix
// Simply creates a string of error(s) and associated cause(s)
// In a human readable manner that is easy to convert to json
// Takes one variable: err, which is a generic handle for any system / crate / module error
pub fn formated_error(err: &::failure::Error) -> String {
    let mut format = err.to_string();
    let mut prev = err.as_fail();
    while let Some(next) = prev.cause() {
        format.push_str(": ");
        format.push_str(&next.to_string());
        prev = next;
    }
    format
}

// Main function for directory tree discovery
// Takes no variables, returns an Option of a vector filled with JsonValues
// It skips hidden folders/files and any path that does not end in a .yaml extension
pub fn dir_tree() -> Option<Vec<JsonValue>> {
    // Helper function for skipping hidden paths
    fn is_hidden(entry: &DirEntry) -> bool {
        entry
            .file_name()
            .to_str()
            .map(|s| s.starts_with("."))
            .unwrap_or(false)
    }
    //Helper function for skipping non .yaml paths
    fn is_yaml(entry: &DirEntry) -> bool {
        entry
            .file_name()
            .to_str()
            .map(|s| s.ends_with("yaml"))
            .unwrap_or(false)
    }

    let path_buf = PathBuf::from(
        SETTINGS
            .read()
            .expect("config file lock violation")
            .get_str("path")
            .unwrap(),
    ); //Finding the file directory root
    let walker = WalkDir::new(path_buf.as_path()).into_iter();
    let mut vec = Vec::new();
    // Filters out hidden
    for entry in walker.filter_entry(|e| !is_hidden(e)) {
        // Unsure if this can fail, needs more testing
        let entry = entry.unwrap();
        // Further filtering to ensure only paths that terminate in a yaml file are processed
        if entry.path().is_file() && is_yaml(&entry) {
            let file_name = entry.path().file_name()?.to_str()?;
            let mut split_path: Vec<&str> = entry.path().parent()?.to_str()?.split("/").collect();
            vec.push(json!({"path": split_path, "name": file_name, "parent": split_path.pop()?})); // Data for populating initial frontend state
        };
    }
    Some(vec)
}
