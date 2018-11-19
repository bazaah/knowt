use clap::{App, Arg, SubCommand};
use rocket::config::{Config, LoggingLevel, Value};
use std::collections::HashMap;

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

pub fn initialization() -> Option<Config> {
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
                                return Err(String::from("The input is not valid u16"));
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
                                return Err(String::from("The input is not valid u16"));
                            }
                        }),
                )
                .arg(
                    Arg::with_name("content_root")
                        .requires("Base")
                        .short("cr")
                        .long("root")
                        .value_name("PATH")
                        .takes_value(true)
                        .help("Set path to content root directory")
                )
                .arg(
                    Arg::with_name("static_content")
                        .requires("Base")
                        .short("sc")
                        .long("static")
                        .value_name("PATH")
                        .takes_value(true)
                        .help("Set path to static content directory")
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

            let mut extras: HashMap<String, Value> = HashMap::new();
            extras.insert(
                "path".to_string(),
                rocket.value_of("content_root").unwrap_or("example/").into(),
            );
            extras.insert(
                "static_content".to_string(),
                rocket.value_of("static_content").unwrap_or("dist/").into(),
            );

            match settings.as_mut() {
                Some(settings) => settings.set_extras(extras),
                None => (),
            }
        }
    }

    return settings;
}
