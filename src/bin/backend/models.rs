use crate::parse::JsonPacket;
use crate::proc::yaml_deposit;
use failure::{format_err, Error as fError};
use serde::{Deserialize, Serialize};
use serde_json::Value as JsonValue;
use std::{fs, fs::File, path::PathBuf, result};
use walkdir::{DirEntry, WalkDir};

//Alias for handling Results<Ok, Err> where Ok can be any type,
//and Err is set to failure::Error, except when explicitly defined otherwise
type Result<T> = result::Result<T, fError>;

// Main function for converting a yaml file into a json string
// It returns a Result of JsonValue which is a serde provided struct that is easy to convert to/from json; or an error
pub fn show(path: &PathBuf) -> Result<JsonValue> {
    let file = File::open(path)?;
    let data: JsonValue = ::serde_yaml::from_reader(file)?;
    let mut packet = JsonPacket::new(data);
    packet.adjust();
    let result = packet.take();
    Ok(result)
}

pub fn show_pointer(path: &PathBuf, pointer: &str) -> Result<JsonValue> {
    let file = File::open(path)?;
    let data: JsonValue = serde_yaml::from_reader(file)?;
    let result = data.pointer(pointer);
    result.map(|r| r.to_owned()).ok_or(format_err!("Null"))
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
pub fn update_data(content_update: &JsonValue, pointer: &str, path: &PathBuf) -> Result<JsonValue> {
    let file = File::open(&path)?;
    let mut yaml_file: JsonValue = ::serde_yaml::from_reader(&file)?;

    // Ensures that the key exists in both the update data and the file being updated
    if yaml_file.pointer(pointer).is_some() {
        *yaml_file.pointer_mut(pointer).unwrap() = content_update.to_owned(); // Unwrap(s) cannot fail due to the above check
        let yaml_str = ::serde_yaml::to_string(&yaml_file)?;
        yaml_deposit(yaml_str, &path);
    }
    let mut packet = JsonPacket::new(yaml_file);
    packet.adjust();
    let result = packet.take();
    Ok(result)
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

pub fn respond(request: ApiRequest, root_path: &str) -> ApiResponse {
    let ident = request.get_identifiers();
    let (id, rstring) = (ident.0.cloned(), ident.1.cloned());
    match request.which() {
        Some(CommandKind::Create) => {
            let mut full_path = PathBuf::from(root_path);
            let (path, content) = match request.get_data() {
                Some(d) => {
                    let path = match &d.path {
                        Some(path) => path,
                        None => {
                            return ApiResponse::new(
                                1,
                                Some("Error: command 'create' requires data.path"),
                                None,
                                1,
                                id,
                                rstring,
                            );
                        }
                    };
                    let content = match &d.content {
                        Some(content) => content,
                        None => {
                            return ApiResponse::new(
                                1,
                                Some("Error: command 'create' requires data.content"),
                                None,
                                1,
                                id,
                                rstring,
                            );
                        }
                    };
                    (path, content)
                }
                None => {
                    return ApiResponse::new(
                        1,
                        Some("Error: command 'create' requires data"),
                        None,
                        1,
                        id,
                        rstring,
                    );
                }
            };
            full_path.push(path);
            match create(content, &full_path) {
                Ok(()) => ApiResponse::new(0, None, None, 1, id, rstring),
                Err(e) => ApiResponse::new(1, Some(&formated_error(&e)), None, 1, id, rstring),
            }
        }
        Some(CommandKind::View) => {
            let mut full_path = PathBuf::from(root_path);
            let path = match request.get_data() {
                Some(d) => {
                    let path = match &d.path {
                        Some(path) => path,
                        None => {
                            return ApiResponse::new(
                                1,
                                Some("Error: command 'view' requires data.path"),
                                None,
                                1,
                                id,
                                rstring,
                            );
                        }
                    };
                    path
                }
                None => {
                    return ApiResponse::new(
                        1,
                        Some("Error: command 'view' requires data"),
                        None,
                        1,
                        id,
                        rstring,
                    );
                }
            };
            full_path.push(path);
            match show(&full_path) {
                Ok(file) => ApiResponse::new(0, None, Some(file), 1, id, rstring),
                Err(e) => ApiResponse::new(1, Some(&formated_error(&e)), None, 1, id, rstring),
            }
        }
        Some(CommandKind::Element) => {
            let mut full_path = PathBuf::from(root_path);
            let (path, pointer) = match request.get_data() {
                Some(d) => {
                    let path = match &d.path {
                        Some(path) => path,
                        None => {
                            return ApiResponse::new(
                                1,
                                Some("Error: command 'element' requires data.path"),
                                None,
                                1,
                                id,
                                rstring,
                            );
                        }
                    };
                    let pointer = match &d.pointer {
                        Some(pointer) => pointer,
                        None => {
                            return ApiResponse::new(
                                1,
                                Some("Error: command 'element' requires data.pointer"),
                                None,
                                1,
                                id,
                                rstring,
                            );
                        }
                    };
                    (path, pointer)
                }
                None => {
                    return ApiResponse::new(
                        1,
                        Some("Error: command 'element' requires data"),
                        None,
                        1,
                        id,
                        rstring,
                    );
                }
            };
            full_path.push(path);
            match show_pointer(&full_path, pointer) {
                Ok(element) => ApiResponse::new(0, None, Some(element), 1, id, rstring),
                Err(e) => ApiResponse::new(1, Some(&formated_error(&e)), None, 1, id, rstring),
            }
        }
        Some(CommandKind::Update) => {
            let mut full_path = PathBuf::from(root_path);
            let (update, path, pointer) = match request.get_data() {
                Some(d) => {
                    let path = match &d.path {
                        Some(path) => path,
                        None => {
                            return ApiResponse::new(
                                1,
                                Some("Error: command 'update' requires data.path"),
                                None,
                                1,
                                id,
                                rstring,
                            );
                        }
                    };
                    let pointer = match &d.pointer {
                        Some(pointer) => pointer,
                        None => {
                            return ApiResponse::new(
                                1,
                                Some("Error: command 'update' requires data.pointer"),
                                None,
                                1,
                                id,
                                rstring,
                            );
                        }
                    };
                    let update = match &d.content {
                        Some(update) => update,
                        None => {
                            return ApiResponse::new(
                                1,
                                Some("Error: command 'update' requires data.content"),
                                None,
                                1,
                                id,
                                rstring,
                            );
                        }
                    };
                    (update, path, pointer)
                }
                None => {
                    return ApiResponse::new(
                        1,
                        Some("Error: command 'update' requires data"),
                        None,
                        1,
                        id,
                        rstring,
                    );
                }
            };
            full_path.push(path);
            match update_data(update, pointer, &full_path) {
                Ok(update) => ApiResponse::new(0, None, Some(update), 1, id, rstring),
                Err(e) => ApiResponse::new(1, Some(&formated_error(&e)), None, 1, id, rstring),
            }
        }
        Some(CommandKind::Directory) => {
            let path = PathBuf::from(root_path);
            match dir_tree(&path) {
                Some(directory) => {
                    ApiResponse::new(0, None, Some(JsonValue::Array(directory)), 1, id, rstring)
                }
                None => ApiResponse::new(
                    1,
                    Some("Error: file tree at given path not found"),
                    None,
                    1,
                    id,
                    rstring,
                ),
            }
        }
        None => ApiResponse::new(
            1,
            Some("Error: 'command' field required"),
            None,
            1,
            id,
            rstring,
        ),
    }
}

#[derive(Serialize, Deserialize)]
pub struct ApiRequest {
    command: Option<CommandKind>,
    data: Option<RequestData>,
    version: Option<usize>,
    id: Option<usize>,
    ref_string: Option<String>,
}

#[derive(Serialize, Deserialize)]
pub struct RequestData {
    pub path: Option<String>,
    pub pointer: Option<String>,
    pub content: Option<JsonValue>,
}

#[derive(Serialize, Deserialize)]
pub enum CommandKind {
    Create,
    View,
    Element,
    Update,
    Directory,
}

impl ApiRequest {
    pub fn which(&self) -> Option<&CommandKind> {
        self.command.as_ref()
    }

    pub fn get_data(&self) -> Option<&RequestData> {
        self.data.as_ref()
    }

    pub fn get_identifiers(&self) -> (Option<&usize>, Option<&String>) {
        (self.id.as_ref(), self.ref_string.as_ref())
    }
}

#[derive(Serialize, Deserialize)]
pub struct ApiResponse {
    status: ResponseStatus,
    result: Option<JsonValue>,
    version: usize,
    id: Option<usize>,
    ref_string: Option<String>,
}

impl ApiResponse {
    pub fn new(
        code: usize,
        message: Option<&str>,
        result: Option<JsonValue>,
        version: usize,
        id: Option<usize>,
        ref_string: Option<String>,
    ) -> Self {
        let status = ResponseStatus::new(code, message.map(|s| JsonValue::String(s.to_string())));
        ApiResponse {
            status,
            result,
            version,
            id,
            ref_string,
        }
    }
}

#[derive(Serialize, Deserialize)]
pub struct ResponseStatus {
    code: usize,
    message: Option<JsonValue>,
}

impl ResponseStatus {
    pub fn new(code: usize, message: Option<JsonValue>) -> Self {
        ResponseStatus { code, message }
    }
}

#[cfg(test)]
mod tests;
