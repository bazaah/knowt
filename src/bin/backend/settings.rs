use clap::{App, Arg, SubCommand};
use config::{Config as FileConfig, File};
use rocket::config::{Config, Environment};
use std::path::PathBuf;
use std::sync::RwLock;

lazy_static! {
    pub static ref SETTINGS: RwLock<Settings> = RwLock::new(Settings::new());
}

pub struct Settings {
    server_root: PathBuf,
    static_content: PathBuf,
}

impl Settings {
    fn new() -> Settings {
        Settings {
            server_root: PathBuf::new(),
            static_content: PathBuf::new(),
        }
    }

    fn set_server_root(&mut self, root: PathBuf) {
        self.server_root.push(root);
    }

    fn set_static_content(&mut self, content_path: PathBuf) {
        self.static_content.push(content_path);
    }

    pub fn get_root(&self) -> &PathBuf {
        &self.server_root
    }

    pub fn get_static_content(&self) -> &PathBuf {
        &self.static_content
    }
}

pub fn init_clap() -> Option<Config> {
    let matches = App::new("Knowt")
        .about("Knowt Alpha")
        .author(crate_authors!("\n"))
        .version(crate_version!())
        .arg(
            Arg::with_name("config")
                .short("C")
                .long("config")
                .help("Set your custom config file")
                .takes_value(true),
        )
        .subcommand(
            SubCommand::with_name("rocket")
                .about("Controls Rocket configuration")
                .arg(
                    Arg::with_name("env")
                        .short("E")
                        .long("env")
                        .takes_value(true)
                        .possible_values(&["dev", "stage", "prod"]),
                ),
        )
        .get_matches();

    let mut application: Option<Config> = None;
    if let Some(rocket) = matches.subcommand_matches("rocket") {
        if rocket.is_present("env") {
            match rocket.value_of("env") {
                Some("dev") => application = Some(Config::development().expect("Bad CWD")),
                Some("stage") => application = Some(Config::staging().expect("Bad CWD")),
                Some("prod") => application = Some(Config::production().expect("Bad CWD")),
                None => println!("Whoopsie"),
                _ => println!("The great void beckons"),
            }
        }
    }

    /* --- */
    let config_path = matches
        .value_of("config")
        .unwrap_or("example/config/settings");
    let mut config_file = FileConfig::new();
    config_file.merge(File::with_name(config_path)).unwrap();

    let srv_root = PathBuf::from(config_file.get_str("path").unwrap());
    let stc_cnt = PathBuf::from(config_file.get_str("static_content").unwrap());

    SETTINGS.write().unwrap().set_server_root(srv_root);
    SETTINGS.write().unwrap().set_static_content(stc_cnt);

    return application;
}
