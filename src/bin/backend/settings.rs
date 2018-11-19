use clap::{App, Arg, SubCommand};
use config::{Config as FileConfig, File};
use rocket::config::{Config, LoggingLevel};
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
                    Arg::with_name("Base")
                        .display_order(1)
                        .short("B")
                        .long("base")
                        .value_name("defaults")
                        .takes_value(true)
                        .required(true)
                        .possible_values(&["dev", "stage", "prod"])
                        .help("Set your basic configuration environment"),
                )
                .arg(
                    Arg::with_name("address")
                        .requires("Base")
                        .short("a")
                        .long("address")
                        .value_name("IP / host")
                        .takes_value(true)
                        .help("Set host address"),
                )
                .arg(
                    Arg::with_name("port")
                        .requires("Base")
                        .short("p")
                        .long("port")
                        .value_name("port")
                        .takes_value(true)
                        .help("Set server port")
                        .validator(|input| -> Result<(), String> {
                            let convert = input.parse::<u16>();
                            if convert.is_ok() {
                                return Ok(());
                            } else {
                                return Err(String::from("The value is not valid u16"));
                            }
                        }),
                )
                .arg(
                    Arg::with_name("log_level")
                        .requires("Base")
                        .short("l")
                        .long("log")
                        .value_name("level")
                        .takes_value(true)
                        .possible_values(&["critical", "normal", "debug"])
                        .help("Set logging level"),
                )
                .arg(
                    Arg::with_name("workers")
                        .requires("Base")
                        .short("w")
                        .long("workers")
                        .value_name("threads")
                        .takes_value(true)
                        .help(
                            "Only manually set this if you know what you're doing. Default: [# of CPUs * 2]",
                        )
                        .validator(|input| -> Result<(), String> {
                            let convert = input.parse::<u16>();
                            if convert.is_ok() {
                                return Ok(());
                            } else {
                                return Err(String::from("The value is not valid u16"));
                            }
                        }),
                ),
        )
        .get_matches();

    let mut settings: Option<Config> = None;
    if let Some(rocket) = matches.subcommand_matches("rocket") {
        if rocket.is_present("Base") {
            match rocket.value_of("Base") {
                Some("dev") => settings = Some(Config::development().expect("Bad CWD")),
                Some("stage") => settings = Some(Config::staging().expect("Bad CWD")),
                Some("prod") => settings = Some(Config::production().expect("Bad CWD")),
                None => (),
                _ => (),
            }

            match rocket.value_of("address") {
                Some(host) => match settings.as_mut() {
                    Some(settings) => settings.set_address(host).unwrap(),
                    None => (),
                },
                None => (),
            }

            match rocket.value_of("port") {
                Some(port) => match settings.as_mut() {
                    Some(settings) => {
                        settings.set_port(std::str::FromStr::from_str(&port).unwrap())
                    }
                    None => (),
                },
                None => (),
            }

            match rocket.value_of("log_level") {
                Some("critical") => match settings.as_mut() {
                    Some(settings) => settings.set_log_level(LoggingLevel::Critical),
                    None => (),
                },
                Some("normal") => match settings.as_mut() {
                    Some(settings) => settings.set_log_level(LoggingLevel::Normal),
                    None => (),
                },
                Some("debug") => match settings.as_mut() {
                    Some(settings) => settings.set_log_level(LoggingLevel::Debug),
                    None => (),
                },
                None => (),
                _ => (),
            }

            match rocket.value_of("workers") {
                Some(workers) => match settings.as_mut() {
                    Some(settings) => {
                        settings.set_port(std::str::FromStr::from_str(&workers).unwrap())
                    }
                    None => (),
                },
                None => (),
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

    return settings;
}
