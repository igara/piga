#!/bin/bash

ifdown --force wlan0
ifup wlan0
ifdown --force eth0
ifup eth0

