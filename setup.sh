#!/bin/bash

wpa_supplicant [SSID] [PASSWORD] >> /etc/wpa_supplicant/wpa_supplicant.conf
cp setup/interfaces /etc/network/interfaces

ifdown wlan0
ifup wlan0

apt-get update -y
apt-get upgrade -y
apt-get install vim aircrack-ng lirc pigpio python3-pigpio git \
  ruby nodejs nmap -y

curl https://sh.rustup.rs -sSf | sh
source $HOME/.cargo/env
rustup default nightly
rustup target add arm-unknown-linux-gnueabi

cp setup/lirc_options.conf /etc/lirc/lirc_options.conf
cp setup/config.txt /boot/config.txt
cp setup/lircd.conf /etc/lirc/lircd.conf

chmod +x setup/ifrestart.sh
cp setup/ifrestart.sh /usr/local/bin/ifrestart.sh
cp setup/cron /var/spool/cron/crontabs/pi
/etc/init.d/cron start

