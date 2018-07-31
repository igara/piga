#!/bin/bash

wpa_supplicant [SSID] [PASSWORD] >> /etc/wpa_supplicant/wpa_supplicant.conf
cp setup/interfaces /etc/network/interfaces

ifdown wlan0
ifup wlan0

apt-get update -y
apt-get upgrade -y
apt-get install vim aircrack-ng lirc pigpio python3-pigpio git \
  nodejs -y

chmod +x setup/ifrestart.sh
cp setup/ifrestart.sh /usr/local/bin/ifrestart.sh
cp setup/cron /var/spool/cron/crontabs/pi
/etc/init.d/cron start

