use super::models::*;
use crate::settings::ExtraConfig;
use rocket::{response::NamedFile, State};
use rocket_contrib::json::Json;
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

#[post("/api/v1/router", format = "application/json", data = "<request>")]
pub fn api_router(config: State<ExtraConfig>, request: Json<ApiRequest>) -> Json<ApiResponse> {
    let request: ApiRequest = request.into_inner();
    let response = respond(request, &config.get_root());
    Json(response)
}

#[get("/api/v1/help")]
pub fn documentation() -> Json<ApiResponse> {
    let response = respond_help(None);

    Json(response)
}

#[get("/api/v1/help?<command>")]
pub fn documentation_command(command: String) -> Json<ApiResponse> {
    let kind = CommandKind::which(command.as_str());
    let response = respond_help(kind);

    Json(response)
}

// -- Being phased out kept around for reference for now
// #[get("/api/<path..>")]
// pub fn view(config: State<ExtraConfig>, path: PathBuf) -> Json<JsonValue> {
//     let mut full_path = PathBuf::from(&config.get_root());
//     full_path.push(path);

//     match show(&full_path) {
//         Ok(res) => Json(json!({"status": 200, "result": res})),
//         Err(e) => Json(json!({"status": 500, "result": formated_error(&e)}
//         )),
//     }
// }

// #[get("/api/v1/element?<request..>")]
// pub fn view_element(config: State<ExtraConfig>, request: Form<PointerRequest>) -> Json<JsonValue> {
//     let request: PointerRequest = request.into_inner();
//     let (path, pointer) = request.take();
//     let mut full_path = PathBuf::from(&config.get_root());
//     full_path.push(path);

//     match show_pointer(&full_path, &pointer) {
//         Ok(res) => Json(json!({"status": 200, "result": res})),
//         Err(e) => Json(json!({"status": 500, "result": formated_error(&e)})),
//     }
// }

// #[post("/api/<path..>", format = "application/json", data = "<file>")]
// pub fn new(config: State<ExtraConfig>, file: Json<JsonValue>, path: PathBuf) -> Json<JsonValue> {
//     let mut full_path = PathBuf::from(&config.get_root());
//     full_path.push(path);

//     match create(&file.into_inner(), &full_path) {
//         Ok(()) => Json(json!({"status": 200})),
//         Err(e) => Json(json!({"status": 500, "result": formated_error(&e)}
//         )),
//     }
// }

// #[put(
//     "/api/v1/update?<request..>",
//     format = "application/json",
//     data = "<update>"
// )]
// pub fn update(
//     config: State<ExtraConfig>,
//     request: Form<PointerRequest>,
//     update: Json<JsonValue>,
// ) -> Json<JsonValue> {
//     let request: PointerRequest = request.into_inner();
//     let (path, pointer) = request.take();
//     let mut full_path = PathBuf::from(&config.get_root());
//     full_path.push(path);

//     match update_data(&update.into_inner(), &pointer, &full_path) {
//         Ok(res) => Json(json!({"status": 200, "result": res})),
//         Err(e) => Json(json!({"status": 500, "result": formated_error(&e)}
//         )),
//     }
// }

// #[get("/api/dir")]
// pub fn file_tree(config: State<ExtraConfig>) -> Json<JsonValue> {
//     let path = PathBuf::from(&config.get_root());

//     match dir_tree(&path) {
//         Some(res) => Json(json!({"status": 200, "result": res})),
//         None => Json(json!({"status": 500, "result": "file directory not found"})),
//     }
// }
