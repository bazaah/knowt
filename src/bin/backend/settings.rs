use config::{Config, File};
use std::error::Error;
use std::sync::RwLock;

// Adds a static RWLock around a config struct and binds it to const SETTINGS
lazy_static! {
	pub static ref SETTINGS: RwLock<Config> = RwLock::new(Config::default());
}

// Small function for initializing the config
pub fn ini_config() -> Result<(), Box<Error>> {
	SETTINGS
		.write()?
		.merge(File::with_name("example/config/settings"))?;

	Ok(())
}
