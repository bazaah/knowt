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

    match show(&full_path) {
        Ok(res) => Json(json!({"status": 200, "result": res})),
        Err(e) => Json(json!({"status": 500, "result": formated_error(&e)}
        )),
    }
}

#[get("/api/v1/element?<request..>")]
pub fn view_element(config: State<ExtraConfig>, request: Form<PointerRequest>) -> Json<JsonValue> {
    let request: PointerRequest = request.into_inner();
    let (path, pointer) = request.take();
    let mut full_path = PathBuf::from(&config.get_root());
    full_path.push(path);

    match show_pointer(&full_path, &pointer) {
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

#[put(
    "/api/v1/update?<request..>",
    format = "application/json",
    data = "<update>"
)]
pub fn update(
    config: State<ExtraConfig>,
    request: Form<PointerRequest>,
    update: Json<JsonValue>,
) -> Json<JsonValue> {
    let request: PointerRequest = request.into_inner();
    let (path, pointer) = request.take();
    let mut full_path = PathBuf::from(&config.get_root());
    full_path.push(path);

    match update_data(&update.into_inner(), &pointer, &full_path) {
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

#[post("/api/v1/testing", format = "application/json", data = "<request>")]
pub fn api_router(config: State<ExtraConfig>, request: Json<ApiRequest>) -> Json<ApiResponse> {
    let request: ApiRequest = request.into_inner();
    let ident = request.get_identifiers();
    let (id, rstring) = (ident.0.cloned(), ident.1.cloned());
    match request.which() {
        Some(CommandKind::Create) => {
            let mut full_path = PathBuf::from(&config.get_root());
            let (path, content) = match request.get_data() {
                Some(d) => {
                    let path = match &d.path {
                        Some(path) => path,
                        None => {
                            return Json(ApiResponse::new(
                                1,
                                Some("Error: command 'create' requires data.path"),
                                None,
                                1,
                                id,
                                rstring,
                            ));
                        }
                    };
                    let content = match &d.content {
                        Some(content) => content,
                        None => {
                            return Json(ApiResponse::new(
                                1,
                                Some("Error: command 'create' requires data.content"),
                                None,
                                1,
                                id,
                                rstring,
                            ));
                        }
                    };
                    (path, content)
                }
                None => {
                    return Json(ApiResponse::new(
                        1,
                        Some("Error: command 'create' requires data"),
                        None,
                        1,
                        id,
                        rstring,
                    ));
                }
            };
            full_path.push(path);
            match create(content, &full_path) {
                Ok(()) => Json(ApiResponse::new(0, None, None, 1, id, rstring)),
                Err(e) => Json(ApiResponse::new(
                    1,
                    Some(&formated_error(&e)),
                    None,
                    1,
                    id,
                    rstring,
                )),
            }
        }
        Some(CommandKind::View) => {
            let mut full_path = PathBuf::from(&config.get_root());
            let path = match request.get_data() {
                Some(d) => {
                    let path = match &d.path {
                        Some(path) => path,
                        None => {
                            return Json(ApiResponse::new(
                                1,
                                Some("Error: command 'view' requires data.path"),
                                None,
                                1,
                                id,
                                rstring,
                            ));
                        }
                    };
                    path
                }
                None => {
                    return Json(ApiResponse::new(
                        1,
                        Some("Error: command 'view' requires data"),
                        None,
                        1,
                        id,
                        rstring,
                    ));
                }
            };
            full_path.push(path);
            match show(&full_path) {
                Ok(file) => Json(ApiResponse::new(0, None, Some(file), 1, id, rstring)),
                Err(e) => Json(ApiResponse::new(
                    1,
                    Some(&formated_error(&e)),
                    None,
                    1,
                    id,
                    rstring,
                )),
            }
        }
        Some(CommandKind::Element) => {
            let mut full_path = PathBuf::from(&config.get_root());
            let (path, pointer) = match request.get_data() {
                Some(d) => {
                    let path = match &d.path {
                        Some(path) => path,
                        None => {
                            return Json(ApiResponse::new(
                                1,
                                Some("Error: command 'element' requires data.path"),
                                None,
                                1,
                                id,
                                rstring,
                            ));
                        }
                    };
                    let pointer = match &d.pointer {
                        Some(pointer) => pointer,
                        None => {
                            return Json(ApiResponse::new(
                                1,
                                Some("Error: command 'element' requires data.pointer"),
                                None,
                                1,
                                id,
                                rstring,
                            ));
                        }
                    };
                    (path, pointer)
                }
                None => {
                    return Json(ApiResponse::new(
                        1,
                        Some("Error: command 'element' requires data"),
                        None,
                        1,
                        id,
                        rstring,
                    ));
                }
            };
            full_path.push(path);
            match show_pointer(&full_path, pointer) {
                Ok(element) => Json(ApiResponse::new(0, None, Some(element), 1, id, rstring)),
                Err(e) => Json(ApiResponse::new(
                    1,
                    Some(&formated_error(&e)),
                    None,
                    1,
                    id,
                    rstring,
                )),
            }
        }
        Some(CommandKind::Update) => {
            let mut full_path = PathBuf::from(&config.get_root());
            let (update, path, pointer) = match request.get_data() {
                Some(d) => {
                    let path = match &d.path {
                        Some(path) => path,
                        None => {
                            return Json(ApiResponse::new(
                                1,
                                Some("Error: command 'update' requires data.path"),
                                None,
                                1,
                                id,
                                rstring,
                            ));
                        }
                    };
                    let pointer = match &d.pointer {
                        Some(pointer) => pointer,
                        None => {
                            return Json(ApiResponse::new(
                                1,
                                Some("Error: command 'update' requires data.pointer"),
                                None,
                                1,
                                id,
                                rstring,
                            ));
                        }
                    };
                    let update = match &d.content {
                        Some(update) => update,
                        None => {
                            return Json(ApiResponse::new(
                                1,
                                Some("Error: command 'update' requires data.content"),
                                None,
                                1,
                                id,
                                rstring,
                            ));
                        }
                    };
                    (update, path, pointer)
                }
                None => {
                    return Json(ApiResponse::new(
                        1,
                        Some("Error: command 'update' requires data"),
                        None,
                        1,
                        id,
                        rstring,
                    ));
                }
            };
            full_path.push(path);
            match update_data(update, pointer, &full_path) {
                Ok(update) => Json(ApiResponse::new(0, None, Some(update), 1, id, rstring)),
                Err(e) => Json(ApiResponse::new(
                    1,
                    Some(&formated_error(&e)),
                    None,
                    1,
                    id,
                    rstring,
                )),
            }
        }
        Some(CommandKind::Directory) => {
            let path = PathBuf::from(&config.get_root());
            match dir_tree(&path) {
                Some(directory) => Json(ApiResponse::new(
                    0,
                    None,
                    Some(JsonValue::Array(directory)),
                    1,
                    id,
                    rstring,
                )),
                None => Json(ApiResponse::new(
                    1,
                    Some("Error: file tree at given path not found"),
                    None,
                    1,
                    id,
                    rstring,
                )),
            }
        }
        None => Json(ApiResponse::new(
            1,
            Some("Error: 'command' field required"),
            None,
            1,
            id,
            rstring,
        )),
    }
}
