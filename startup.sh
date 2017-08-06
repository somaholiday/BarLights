#!/usr/bin/env bash

# This startup script starts the main application whenever the RPi reboots
# Enable by adding @reboot line to crontab:

# sudo crontab -e
# @reboot /home/pi/startup.sh >/tmp/barlightsout 2>/tmp/barlightserrors

cd /home/pi/barlights
sudo ./server/fcserver-rpi & /usr/local/bin/node app/main.js