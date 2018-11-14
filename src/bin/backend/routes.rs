use super::models::*;
use rocket_contrib::Json;
use serde_json::Value as JsonValue;
use settings::SETTINGS;
use std::io;
use std::path::PathBuf;

use rocket::response::NamedFile;

#[get("/")]
fn index() -> io::Result<NamedFile> {
    let source = PathBuf::from(SETTINGS.read().unwrap().get_static_content());
    let mut path = source.clone();
    path.push("index.html");
    NamedFile::open(path)
}

#[get("/main.js")]
fn files() -> io::Result<NamedFile> {
    let source = PathBuf::from(SETTINGS.read().unwrap().get_static_content());
    let mut path = source.clone();
    path.push("main.js");
    NamedFile::open(path)
}

#[get("/api/<path..>")]
fn view(path: PathBuf) -> Json<JsonValue> {
    let file = match show(path) {
        Ok(res) => Json(json!({"status": 200, "result": res})),
        Err(e) => Json(json!({"status": 500, "result": formated_error(&e)}
        )),
    };
    file
}

#[post(
    "/api/<path..>",
    format = "application/json",
    data = "<file>"
)]
pub fn new(file: Json<JsonValue>, path: PathBuf) -> Json<JsonValue> {
    let status = match create(file.into_inner(), path) {
        Ok(()) => Json(json!({"status": 200})),
        Err(e) => Json(json!({"status": 500, "result": formated_error(&e)}
        )),
    };
    status
}

#[put(
    "/api/<key>/<path..>",
    format = "application/json",
    data = "<data>"
)]
pub fn update(data: Json<JsonValue>, key: String, path: PathBuf) -> Json<JsonValue> {
    let updated_data = match update_data(data.into_inner(), key, path) {
        Ok(res) => Json(json!({"status": 200, "result": res})),
        Err(e) => Json(json!({"status": 500, "result": formated_error(&e)}
        )),
    };
    updated_data
}

#[get("/api/dir")]
pub fn file_tree() -> Json<JsonValue> {
    let status = match dir_tree() {
        Some(res) => Json(json!({"status": 200, "result": res})),
        None => Json(json!({"status": 500, "result": "file directory not found"})),
    };
    status
}
