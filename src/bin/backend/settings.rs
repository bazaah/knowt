use clap::{App, Arg};
use config::{Config, File};
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

pub fn init_clap() {
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
        .get_matches();

    let config_path = matches
        .value_of("config")
        .unwrap_or("example/config/settings");
    let mut config = Config::new();
    config.merge(File::with_name(config_path)).unwrap();

    let srv_root = PathBuf::from(config.get_str("path").unwrap());
    let stc_cnt = PathBuf::from(config.get_str("static_content").unwrap());

    SETTINGS.write().unwrap().set_server_root(srv_root);
    SETTINGS.write().unwrap().set_static_content(stc_cnt);
}
