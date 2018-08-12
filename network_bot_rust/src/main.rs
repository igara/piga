extern crate regex;

extern crate serde;
extern crate serde_json;
#[macro_use]
extern crate serde_derive;
extern crate reqwest;

use serde_json::Error;
use regex::Regex;
use std::process::{Command};
use std::fs::{read_dir, remove_file, File};
use std::io::{BufWriter};
use std::env;
use std::path::Path;
use std::io::Read;

#[derive(Serialize, Deserialize)]
struct Machines {
  name: String,
  mac_address: String
}

#[derive(Serialize, Deserialize)]
struct Env {
  discord_webhook: String,
  avatar_url: String,
  machines: Vec<Machines>,
}

fn fetch_discord(data: String, file_names: Vec<String>, exec_arp_result: String) -> Result<(), Error> {
  let json: Env = serde_json::from_str(&data).unwrap();
  let machines: Vec<Machines> = json.machines;
  let dir = &env::current_dir().unwrap();
  for machine in machines {
    let mac_address = &machine.mac_address;
    let re = Regex::new(r":").unwrap();
    let mac_address_file_name = re.replace_all(mac_address, "_");
    let item = file_names.iter().find(|item| {
      item.to_string() == mac_address_file_name.to_string()
    });

    let arp_re = Regex::new(&mac_address).unwrap();
    if item == None && arp_re.is_match(&exec_arp_result) {
      BufWriter::new(File::create(format!("{}/src/machines/{}", dir.display(), mac_address_file_name)).unwrap());
      let client = reqwest::Client::new();
      let res = client.post(&json.discord_webhook)
      .form(&[
        ("username", "piga"),
        ("avatar_url", &json.avatar_url),
        ("content", &format!("{}\rを起動しました。", &machine.name))
      ])
      .send().unwrap();
    }
    if item != None && !arp_re.is_match(&exec_arp_result) {
      remove_file(format!("{}/src/machines/{}", dir.display(), mac_address_file_name));
    }
  }
  Ok(())
}

fn main() {
  println!("run network_bot");
  loop {
    let exec_remove_arp_cache = Command::new("ip")
      .arg("-s")
      .arg("neigh flush all")
      .output()
      .expect("failed to execute process");
    let exec_nmap = Command::new("nmap")
      .arg("192.168.88.0-254")
      .output()
      .expect("failed to execute process");
    let exec_arp = Command::new("arp")
      .arg("-a")
      .output()
      .expect("failed to execute process");
    let exec_arp_result = String::from_utf8_lossy(&exec_arp.stdout).to_string();
    let dir = &env::current_dir().unwrap();
    let machines_dir = format!("{}/src/machines", dir.display());
    let paths = read_dir(&Path::new(&machines_dir)).unwrap();

    let file_names = paths.map(|entry| {
      let entry = entry.unwrap();
      let entry_path = entry.path();
      let file_name = entry_path.file_name().unwrap();
      let file_name_as_str = file_name.to_str().unwrap();
      String::from(file_name_as_str)
    })
    .collect::<Vec<String>>().into_iter()
    .filter(|file_name| {
      let replace_re = Regex::new(r"_").unwrap();
      let mac_address = replace_re.replace_all(file_name, ":");
      let re = Regex::new(&mac_address).unwrap();
      re.is_match(&exec_arp_result)
    })
    .collect::<Vec<String>>();

    let mut file = File::open("env.json").unwrap();
    let mut data = String::new();
    file.read_to_string(&mut data).unwrap();
    fetch_discord(data, file_names, exec_arp_result);
  }
}
