#!/bin/bash

PORT=8080
IP=$( ifconfig | sed -En 's/127.0.0.1//;s/.*inet (addr:)?(([0-9]*\.){3}[0-9]*).*/\2/p' )
echo $IP

CONFIG_DEV="_config_dev.yml"

# http://stackoverflow.com/questions/24633919/prepend-heredoc-to-a-file-in-bash
read -r -d '' CONFIG_STR << EOF
url: http://$IP:$PORT
host: $IP
port: $PORT
baseurl: ""

sass:
  style: normal
l
EOF
# trick to pertain newline at the end of a message
# see here: http://unix.stackexchange.com/a/20042
CONFIG_STR=${CONFIG_STR%l}
printf %s "$CONFIG_STR" > $CONFIG_DEV
more $CONFIG_DEV



bundle exec jekyll serve --config _config.yml,_config_dev.yml
