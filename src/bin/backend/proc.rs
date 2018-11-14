use std::error::Error;
use std::io::prelude::*;
use std::path::PathBuf;
use std::process::{Command, Stdio};

pub fn yaml_deposit(file: String, path: &PathBuf) {
    let proc_deposit = match Command::new("proc/deposit")
        .stdin(Stdio::piped())
        .stdout(Stdio::piped())
        .arg(path)
        .spawn()
    {
        Ok(proc_deposit) => proc_deposit,
        Err(why) => panic!("deposit failed: {}", why.description()),
    };

    match proc_deposit.stdin.unwrap().write_all(file.as_bytes()) {
        Ok(_) => (()),
        Err(why) => panic!("deposit write failed: {}", why.description()),
    };
}
