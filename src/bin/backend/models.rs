use crate::parse::JsonPacket;
use crate::proc::yaml_deposit;
use failure::{format_err, Error as fError};
use serde_json::Value as JsonValue;
use std::{fs, fs::File, path::PathBuf, result};
use walkdir::{DirEntry, WalkDir};

//Alias for handling Results<Ok, Err> where Ok can be any type,
//and Err is set to failure::Error, except when explicitly defined otherwise
type Result<T> = result::Result<T, fError>;

// Main function for converting a yaml file into a json string
// It returns a Result of JsonValue which is a serde provided struct that is easy to convert to/from json; or an error
pub fn show(path: PathBuf) -> Result<JsonValue> {
    let file = File::open(path)?;
    let data: JsonValue = ::serde_yaml::from_reader(file)?;
    let mut packet = JsonPacket::new(data);
    packet.adjust();
    let result = packet.take();
    Ok(result)
}

pub fn show_pointer(path: PathBuf, pointer: String) -> Result<JsonValue> {
    let file = File::open(path)?;
    let data: JsonValue = serde_yaml::from_reader(file)?;
    let result = data.pointer(&pointer);
    result.cloned().ok_or(format_err!("Null"))
}

// Main function for creating new yaml files
// It returns nothing; or an error
pub fn create(file: &JsonValue, path: &PathBuf) -> Result<()> {
    fs::create_dir_all(path.parent().unwrap())?;
    let new_file = ::serde_yaml::to_string(&file)?;
    yaml_deposit(new_file, &path);
    Ok(())
}

// Main function for updating data in existing yaml files
// It returns nothing; or an error
pub fn update_data(content_update: &JsonValue, key: String, path: &PathBuf) -> Result<JsonValue> {
    let file = File::open(&path)?;
    let k = key.as_str(); // Takes a &str slice of key
    let update = json!({ k: content_update });
    let mut yaml_file: JsonValue = ::serde_yaml::from_reader(&file)?;
    // Ensures that the key exists in both the update data and the file being updated
    if yaml_file.get(k).is_some() && update.get(k).is_some() {
        *yaml_file.get_mut(k).unwrap() = update.get(k).unwrap().to_owned(); // Unwrap(s) cannot fail due to the above check
        let yaml_str = ::serde_yaml::to_string(&yaml_file)?;
        yaml_deposit(yaml_str, &path);
    }
    Ok(yaml_file)
}

// Main function for directory tree discovery
// It skips hidden folders/files and any path that does not end in a .yaml extension
pub fn dir_tree(path: &PathBuf) -> Option<Vec<JsonValue>> {
    // Helper function for skipping hidden paths
    fn is_hidden(entry: &DirEntry) -> bool {
        entry
            .file_name()
            .to_str()
            .map(|s| s.starts_with('.'))
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

    let walker = WalkDir::new(path.as_path()).into_iter();
    let mut vec = Vec::new();

    // Filters out hidden
    for entry in walker.filter_entry(|e| !is_hidden(e)) {
        // Unsure if this can fail, needs more testing
        let entry = entry.unwrap();
        // Further filtering to ensure only paths that terminate in a yaml file are processed
        if entry.path().is_file() && is_yaml(&entry) {
            let file_name = entry.path().file_name()?.to_str()?;
            let mut split_path: Vec<&str> = entry.path().parent()?.to_str()?.split('/').collect();
            vec.push(json!({"path": split_path, "name": file_name, "parent": split_path.pop()?})); // Data for populating initial frontend state
        };
    }
    Some(vec)
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

#[derive(FromForm)]
pub struct PointerRequest {
    file_path: String,
    pointer_path: String,
}

impl PointerRequest {
    pub fn take(self) -> (String, String) {
        (self.file_path, self.pointer_path)
    }
}

#[cfg(test)]
mod tests;
