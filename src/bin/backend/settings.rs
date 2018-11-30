use clap::{App, Arg, SubCommand};
use rocket::config::{Config, LoggingLevel, Value};
use std::collections::HashMap;
use std::fs;
use std::path::Path;
use toml::Value as TomlValue;

// Struct for extra variables knowt requires, beyond rockets'
pub struct ExtraConfig {
    content_root: String,
    static_content: String,
}

impl ExtraConfig {
    pub fn new(sc: String, cr: String) -> ExtraConfig {
        ExtraConfig {
            static_content: sc,
            content_root: cr,
        }
    }

    pub fn get_static_content(&self) -> String {
        self.static_content.clone()
    }

    pub fn get_root(&self) -> String {
        self.content_root.clone()
    }
}

// Config initialization via CLI or ENV
pub fn initialization() -> Option<Config> {
    let matches = App::new("Knowt")
        .about("Knowt Alpha")
        .author(crate_authors!("\n"))
        .version(crate_version!())
        .subcommand(
            SubCommand::with_name("rocket")
                .about("Controls Rocket configuration")
                .arg(
                    Arg::with_name("Base")
                        .display_order(1)
                        .short("B")
                        .long("base")
                        .env("KNOWT_BASE")
                        .value_name("defaults")
                        .takes_value(true)
                        .required(true)
                        .possible_values(&["dev", "stage", "prod"])
                        .help("Set your basic configuration environment"),
                )
                .arg(
                    Arg::with_name("config")
                        .requires("Base")
                        .short("c")
                        .long("config")
                        .env("KNOWT_CONFIG")
                        .value_name("FILE")
                        .help("Set your custom config file")
                        .takes_value(true),
                )
                .arg(
                    Arg::with_name("address")
                        .requires("Base")
                        .short("a")
                        .long("address")
                        .env("KNOWT_ADDRESS")
                        .value_name("IP / host")
                        .takes_value(true)
                        .help("Set host address"),
                )
                .arg(
                    Arg::with_name("port")
                        .requires("Base")
                        .short("p")
                        .long("port")
                        .env("KNOWT_PORT")
                        .value_name("port")
                        .takes_value(true)
                        .help("Set server port")
                        .validator(|input| -> Result<(), String> {
                            let convert = input.parse::<u16>();
                            if convert.is_ok() {
                                Ok(())
                            } else {
                                Err(String::from("The input is not valid u16"))
                            }
                        }),
                )
                .arg(
                    Arg::with_name("log_level")
                        .requires("Base")
                        .short("l")
                        .long("log")
                        .env("KNOWT_LOG")
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
                        .env("KNOWT_WORKERS")
                        .value_name("threads")
                        .takes_value(true)
                        .help(
                            "Only manually set this if you know what you're doing. Default: [# of CPUs * 2]",
                        )
                        .validator(|input| -> Result<(), String> {
                            let convert = input.parse::<u16>();
                            if convert.is_ok() {
                                Ok(())
                            } else {
                                Err(String::from("The input is not valid u16"))
                            }
                        }),
                )
                .arg(
                    Arg::with_name("content_root")
                        .requires("Base")
                        .long("root")
                        .env("KNOWT_ROOT")
                        .value_name("PATH")
                        .takes_value(true)
                        .help("Set path to content root directory")
                )
                .arg(
                    Arg::with_name("static_content")
                        .requires("Base")
                        .long("static")
                        .env("KNOWT_STATIC")
                        .value_name("PATH")
                        .takes_value(true)
                        .help("Set path to static content directory")
                ),
        )
        .get_matches();

    // Empty Option, conditionally filled based user input
    let mut settings: Option<Config> = None;

    // Handles user input from the follow sources: ENV values, CLI options, foreign Rocket TOML file
    // Input is valued in this order: CLI > ENV > FILE
    if let Some(rocket) = matches.subcommand_matches("rocket") {
        // A Base config struct is required for any other configuration
        if rocket.is_present("Base") {
            match rocket.value_of("Base") {
                Some("dev") => settings = Some(Config::development().expect("Bad CWD")),
                Some("stage") => settings = Some(Config::staging().expect("Bad CWD")),
                Some("prod") => settings = Some(Config::production().expect("Bad CWD")),
                None => (),
                _ => (),
            }

            // File
            if rocket.is_present("config") {
                let path = Path::new(rocket.value_of("config").expect("Bad path"));
                let config: TomlValue =
                    toml::from_str(fs::read_to_string(path).expect("Bad File").as_str()).unwrap();

                let environment = match rocket.value_of("Base") {
                    Some("dev") => "development",
                    Some("stage") => "staging",
                    Some("prod") => "production",
                    None => "",
                    _ => "",
                };
                match config.get(environment) {
                    Some(env) => {
                        if let Some(address) = env.get("address") {
                            if address.is_str() {
                                if let Some(settings) = settings.as_mut() {
                                    settings.set_address(address.as_str().unwrap()).unwrap()
                                }
                            }
                        }

                        if let Some(port) = env.get("port") {
                            if port.is_integer() {
                                if let Some(settings) = settings.as_mut() {
                                    settings.set_port(port.as_integer().unwrap() as u16)
                                }
                            }
                        }

                        if let Some(log_level) = env.get("log") {
                            if log_level.is_str() {
                                match log_level.as_str() {
                                    Some("critical") => {
                                        if let Some(settings) = settings.as_mut() {
                                            settings.set_log_level(LoggingLevel::Critical)
                                        }
                                    }
                                    Some("normal") => {
                                        if let Some(settings) = settings.as_mut() {
                                            settings.set_log_level(LoggingLevel::Normal)
                                        }
                                    }
                                    Some("debug") => {
                                        if let Some(settings) = settings.as_mut() {
                                            settings.set_log_level(LoggingLevel::Debug)
                                        }
                                    }
                                    None => (),
                                    _ => (),
                                }
                            }
                        }

                        let mut extras: HashMap<String, Value> = HashMap::new();
                        if let Some(content_root) = env.get("path") {
                            if content_root.is_str() {
                                extras.insert(
                                    "path".to_string(),
                                    content_root.as_str().unwrap().into(),
                                );
                            }
                        }

                        if let Some(static_content) = env.get("static_content") {
                            if static_content.is_str() {
                                extras.insert(
                                    "static_content".to_string(),
                                    static_content.as_str().unwrap().into(),
                                );
                            }
                        }
                        if let Some(settings) = settings.as_mut() {
                            settings.set_extras(extras)
                        }
                    }
                    None => (),
                }
            }

            // CLI / ENV
            match rocket.value_of("address") {
                Some(host) => {
                    if let Some(settings) = settings.as_mut() {
                        settings.set_address(host).unwrap()
                    }
                }
                None => (),
            }

            match rocket.value_of("port") {
                Some(port) => {
                    if let Some(settings) = settings.as_mut() {
                        settings.set_port(std::str::FromStr::from_str(&port).unwrap())
                    }
                }
                None => (),
            }

            match rocket.value_of("log_level") {
                Some("critical") => {
                    if let Some(settings) = settings.as_mut() {
                        settings.set_log_level(LoggingLevel::Critical)
                    }
                }
                Some("normal") => {
                    if let Some(settings) = settings.as_mut() {
                        settings.set_log_level(LoggingLevel::Normal)
                    }
                }
                Some("debug") => {
                    if let Some(settings) = settings.as_mut() {
                        settings.set_log_level(LoggingLevel::Debug)
                    }
                }
                None => (),
                _ => (),
            }

            match rocket.value_of("workers") {
                Some(workers) => {
                    if let Some(settings) = settings.as_mut() {
                        settings.set_port(std::str::FromStr::from_str(&workers).unwrap())
                    }
                }
                None => (),
            }

            if rocket.is_present("content_root") || rocket.is_present("static_content") {
                let mut extras: HashMap<String, Value> = HashMap::new();

                extras.insert(
                    "path".to_string(),
                    rocket.value_of("content_root").unwrap_or("example/").into(),
                );
                extras.insert(
                    "static_content".to_string(),
                    rocket.value_of("static_content").unwrap_or("dist/").into(),
                );

                if let Some(settings) = settings.as_mut() {
                    settings.set_extras(extras)
                }
            }
        }
    }

    settings
}
