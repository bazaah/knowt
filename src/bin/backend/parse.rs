use serde_json::{
    Value as JsonValue,
    Value::{Array as jArray, Object as jObject, String as jString},
};
use std::collections::VecDeque;

pub struct JsonPacket {
    object: JsonValue,
    plist: Vec<String>,
}

impl JsonPacket {
    pub fn new(object: JsonValue) -> Self {
        let plist = JsonPacket::parse_json(&object);
        JsonPacket { object, plist }
    }

    pub fn adjust(&mut self) {
        for jpointer in &self.plist {
            if let Some(value) = self.object.pointer_mut(&jpointer) {
                match value.as_str() {
                    Some(s) if s.len() > jpointer.len() => {
                        let result = "{{".to_owned() + &jpointer.clone() + "}}";
                        *value = result.into();
                    }
                    _ => {}
                }
            }
        }
    }

    pub fn take(self) -> JsonValue {
        self.object
    }

    fn parse_json(json_value: &JsonValue) -> Vec<String> {
        let mut list: Vec<String> = Vec::new();
        let mut jqueue: VecDeque<(&JsonValue, String)> = VecDeque::new();
        jqueue.push_back((json_value, String::default()));

        loop {
            let value = jqueue.pop_front();
            match value {
                Some((jObject(map), ref s)) => {
                    for (k, v) in map.iter() {
                        let new_path = s.clone() + "/" + k;
                        jqueue.push_back((v, new_path));
                    }
                }
                Some((jArray(a), ref s)) => {
                    for (i, v) in a.iter().enumerate() {
                        let new_path = s.clone() + "/" + &i.to_string();

                        jqueue.push_back((v, new_path));
                    }
                }
                Some((jString(_), s)) => list.push(s),
                None => break,
                _ => {}
            }
        }

        list
    }
}
