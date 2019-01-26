use super::models::*;
use crate::settings::ExtraConfig;
use rocket::{request::Form, response::NamedFile, State};
use rocket_contrib::json::Json;
use serde_json::Value as JsonValue;
use std::io;
use std::path::PathBuf;

#[get("/")]
pub fn index(config: State<ExtraConfig>) -> io::Result<NamedFile> {
    let mut path = PathBuf::from(&config.get_static_content());
    path.push("index.html");
    NamedFile::open(path)
}

#[get("/main.js")]
pub fn files(config: State<ExtraConfig>) -> io::Result<NamedFile> {
    let mut path = PathBuf::from(&config.get_static_content());
    path.push("main.js");
    NamedFile::open(path)
}

#[get("/api/<path..>")]
pub fn view(config: State<ExtraConfig>, path: PathBuf) -> Json<JsonValue> {
    let mut full_path = PathBuf::from(&config.get_root());
    full_path.push(path);

    match show(full_path) {
        Ok(res) => Json(json!({"status": 200, "result": res})),
        Err(e) => Json(json!({"status": 500, "result": formated_error(&e)}
        )),
    }
}

#[get("/api/vfield", data = "<request>")]
pub fn view_field(config: State<ExtraConfig>, request: Form<PointerRequest>) -> Json<JsonValue> {
    let request: PointerRequest = request.into_inner();
    let (path, pointer) = request.take();
    let mut full_path = PathBuf::from(&config.get_root());
    full_path.push(path);

    match show_pointer(full_path, pointer) {
        Ok(res) => Json(json!({"status": 200, "result": res})),
        Err(e) => Json(json!({"status": 500, "result": formated_error(&e)})),
    }
}

#[post("/api/<path..>", format = "application/json", data = "<file>")]
pub fn new(config: State<ExtraConfig>, file: Json<JsonValue>, path: PathBuf) -> Json<JsonValue> {
    let mut full_path = PathBuf::from(&config.get_root());
    full_path.push(path);

    match create(&file.into_inner(), &full_path) {
        Ok(()) => Json(json!({"status": 200})),
        Err(e) => Json(json!({"status": 500, "result": formated_error(&e)}
        )),
    }
}

#[put("/api/<key>/<path..>", format = "application/json", data = "<data>")]
pub fn update(
    config: State<ExtraConfig>,
    data: Json<JsonValue>,
    key: String,
    path: PathBuf,
) -> Json<JsonValue> {
    let mut full_path = PathBuf::from(&config.get_root());
    full_path.push(path);

    match update_data(&data.into_inner(), key, &full_path) {
        Ok(res) => Json(json!({"status": 200, "result": res})),
        Err(e) => Json(json!({"status": 500, "result": formated_error(&e)}
        )),
    }
}

#[get("/api/dir")]
pub fn file_tree(config: State<ExtraConfig>) -> Json<JsonValue> {
    let path = PathBuf::from(&config.get_root());

    match dir_tree(&path) {
        Some(res) => Json(json!({"status": 200, "result": res})),
        None => Json(json!({"status": 500, "result": "file directory not found"})),
    }
}
