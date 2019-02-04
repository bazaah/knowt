use super::*;
use helper::{generate, temp_io, Kind};
use serde_json::Value as JsonValue;
use std::{fs::File, io::prelude::*};
use tempfile::tempdir;

#[test]
fn models_show() {
    let data = generate(Kind::Yaml);
    let (_directory, path) = temp_io("show_test_file");
    let mut file = File::create(&path).expect("Failed to create temporary file...");
    file.write(data.as_slice())
        .expect("Failed to write to temporary file...");

    let before: JsonValue =
        serde_yaml::from_slice(data.as_slice()).expect("Failed to parse file: serde_yaml");
    let after = match show(path) {
        Ok(json) => json,
        Err(e) => {
            let err: JsonValue = json!({ "error in show": formated_error(&e) });
            err
        }
    };
    let unchanged_before = before.pointer("/classes/nfs::server/exports").unwrap();
    let unchanged_after = after.pointer("/classes/nfs::server/exports").unwrap();
    let changed_after = after.pointer("/content").unwrap();

    assert_eq!(unchanged_before, unchanged_after);
    assert_eq!(changed_after, "/content");
}

#[test]
fn models_show_pointer() {
    let data = generate(Kind::Yaml);
    let (_directory, path) = temp_io("show_pointer_test_file");
    let mut file = File::create(&path).expect("Failed to create temporary file...");
    file.write(data.as_slice())
        .expect("Failed to write to temporary file...");
    let pointer = "/classes/nfs::server/exports/0";

    let raw = "/srv/share1";

    let json: JsonValue =
        serde_yaml::from_slice(data.as_slice()).expect("Failed to parse file: serde_yaml");
    let before = json.pointer(&pointer).unwrap();

    let after = match show_pointer(path, pointer.to_string()) {
        Ok(pointer) => pointer,
        Err(e) => {
            let err: JsonValue = json!({ "error in show_pointer": formated_error(&e) });
            err
        }
    };

    assert_eq!(raw, before);
    assert_eq!(raw, &after);
    assert_eq!(before, &after);
}

#[test]
fn models_create() {
    let data = generate(Kind::Json);
    let json: JsonValue = serde_json::from_slice(data.as_slice()).unwrap();
    let (_directory, path) = temp_io("create_test_file");

    match create(&json, &path) {
        Ok(()) => (),
        Err(e) => eprintln!("error in create: {}", e),
    }
}

#[test]
fn models_update_data() {
    let data = generate(Kind::Json);
    let j = json!("notahex");
    let json: JsonValue = serde_json::from_value(j).expect("1");
    let (_directory, path) = temp_io("update_test_file");
    let mut file = File::create(&path).expect("Failed to create temporary file...");
    file.write(data.as_slice()).expect("4");
    let key = "aliceblue";

    let update = update_data(&json, key.to_string(), &path).expect("2");
    let result = update.pointer("/aliceblue").expect("3");

    assert_eq!(result, &json);
}

#[test]
fn models_dir_tree() {
    let root = match tempdir() {
        Ok(dir) => dir,
        Err(e) => panic!("Failed to create a temp directory: {}", e),
    };
    let directories = vec![
        "apricot/jam",
        "banana/pancakes/ugh",
        "apple/crumble/desert",
        "carrots/lettuce/pickles/vegetables",
        "super/long/named/directory/path",
    ];
    for path in &directories {
        let full_path = root.path().join(path);
        fs::create_dir_all(full_path.parent().expect("Parent doesn't exist"))
            .expect("Failed to create a directory");
        File::create(full_path).expect("Failed to create a file");
    }

    let test = root.path().clone().to_path_buf();
    let result = dir_tree(&test).unwrap();

    for entry in result {
        let mut found = false;
        for path in &directories {
            if &entry == path {
                found = true;
            }
        }
        assert!(found, "Error: {} not found", entry);
    }
}

mod helper {
    use serde_json::Value as JsonValue;
    use std::path::PathBuf;
    use tempfile::{tempdir, TempDir};

    pub enum Kind {
        Yaml,
        Json,
    }

    pub fn temp_io(path_name: &str) -> (TempDir, PathBuf) {
        let directory = match tempdir() {
            Ok(dir) => dir,
            Err(e) => panic!("Failed to create a temp directory: {}", e),
        };
        let path = directory.path().join(path_name);

        (directory, path)
    }

    pub fn generate(kind: Kind) -> Vec<u8> {
        match kind {
            Kind::Yaml => Vec::from(
                "---
classes:
  nfs::server:
    exports:
      - /srv/share1
      - /srv/share3
content: |
  # 123 ZZ This is a test This is some markdown content in YAML that will be output as an <h1>.
  
  This will be output as a paragraph tag.
  
  So will this!
  
  ## This is a secondary header
  
  * These
  * Are
  * List
  * Items
  
  ### Code
  
  ```js
  var React = require'react';
  ```
  
  ### Tables
  
  | Oh | Look |
  | --- | ----|
  | a | table |
  
environment: |
  production
  
...
",
            ),
            Kind::Json => {
                let json: JsonValue = json!({
                "aliceblue": "#f0f8ff",
                "antiquewhite": "#faebd7",
                "aqua": "#00ffff",
                "aquamarine": "#7fffd4",
                "azure": "#f0ffff",
                "beige": "#f5f5dc",
                "bisque": "#ffe4c4",
                "black": "#000000",
                "blanchedalmond": "#ffebcd",
                "blue": "#0000ff",
                "blueviolet": "#8a2be2",
                "brown": "#a52a2a",
                "body": [
                    "+44 1234567",
                    "+44 2345678"
                  ]
                        });
                serde_json::to_vec(&json).unwrap()
            }
        }
    }
}
