#![feature(plugin)]
#![plugin(rocket_codegen)]

extern crate config;
extern crate rocket;
extern crate rocket_contrib;
#[macro_use]
extern crate lazy_static;
extern crate serde_yaml;
#[macro_use]
extern crate serde_json;
//#[macro_use]
extern crate failure;
extern crate walkdir;

// Imports routes for rocket and the function to initialize the config
use routes::*;
use settings::*;

// Ties modules to main.rs
mod models;
mod routes;
mod settings;

fn main() {
    ini_config().unwrap();
    rocket::ignite()
        .mount("/", routes![new, view, update, file_tree, index, files])
        .launch();
}
