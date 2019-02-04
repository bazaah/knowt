#![feature(proc_macro_hygiene, decl_macro)]

#[macro_use]
extern crate rocket;
#[macro_use]
extern crate serde_json;
#[macro_use]
extern crate clap;

// Imports routes for rocket and the function to initialize the config
use crate::routes::*;
use crate::settings::ExtraConfig;
use crate::settings::*;
use rocket::fairing::AdHoc;

// Ties modules to main.rs
mod models;
mod parse;
mod proc;
mod routes;
mod settings;

fn main() {
    // Initialize rocket with clap
    let init = initialization();

    // If any custom config options exist use those,
    // otherwise use rocket defaults (Rocket.toml => ENV: development)
    let rocket = match init {
        Some(config) => rocket::custom(config),
        None => rocket::ignite(),
    };
    rocket
        .mount(
            "/",
            routes![new, view, view_element, update, file_tree, index, files],
        )
        .attach(AdHoc::on_attach("Extra-Config", |rocket| {
            let root = rocket
                .config()
                .get_str("path")
                .unwrap_or("example/")
                .to_string();
            let static_content = rocket
                .config()
                .get_str("static_content")
                .unwrap_or("dist/")
                .to_string();
            let settings: ExtraConfig = settings::ExtraConfig::new(static_content, root);

            Ok(rocket.manage(settings))
        }))
        .launch();
}
