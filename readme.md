# How to

Raspberry Pi Type B
Raspbian Image Version: 2018-06-27-raspbian-stretch-lite
USB Wifi Module: WLI-UC-GNM
(※電波傍受的に検索する必要がなければGW-USNanoのような停電力なものでも良い)

# Setup

```
$ ssh pi@rasperrypi.local
$ sudo sh setup.sh
```

# Learn IR

```
$ sudo irrecord -n -f -d /dev/lirc0 [any].conf
上記で作成したconfを/etc/lirc/lircd.confに記載する必要がある
```

## Send remote controll signal

```
$ sudo irsend SEND_ONCE regza on
```

## On push remote controll button list

```
$ irw
```

# Search Network

## 電波傍受方法

```
$ sudo ifconfig wlan0 down
$ sudo iwconfig wlan0 mode monitor
$ sudo ifconfig wlan0 up
$ sudo airmon-ng start wlan0
# 電波傍受
$ sudo airodump-ng wlan0mon[sudo airmon-ng start wlan0した時のinterfaceを表記する 端末によってmon0,ra0である可能性がある]
# 対象のアクセスポイントに絞り込んで電波傍受 and ログ出力
sudo airodump-ng wlan0mon --bssid XX:XX:XX:XX:XX:XX[AP MAC Address] -w log
```

## 逆引き的にルータ内の機器を検索

```
nmap 192.168.88.0-254
# ARPテーブル一覧表示(IPとMACアドレス表示)
arp -a
# 削除したいARPテーブルキャッシュの削除
sudo arp -d 192.168.88.XXX
```
