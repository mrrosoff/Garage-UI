#!/bin/bash

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
NC='\033[0m'

# Cron doesn't load ~/.bashrc, so fall back to the repo this script lives in
GARAGE_UI_DIR="${GARAGE_UI_DIR:-$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)}"

dt="${YELLOW}$(date '+%m/%d/%Y %H:%M:%S')${NC}";
LOG_PATH="${GARAGE_UI_DIR}/logs/reboot.log"

# Cron has no terminal, so apt must never stop to ask a question
export DEBIAN_FRONTEND=noninteractive

# Clear Log Paths
mkdir -p "${GARAGE_UI_DIR}/logs"
rm -rf ${GARAGE_UI_DIR}/logs/*.log &> /dev/null

printf "$dt -- ${YELLOW}Updating & Upgrading & Auto Removing...\n" 
printf "$dt -- ${YELLOW}Updating & Upgrading & Auto Removing...\n" >> $LOG_PATH

printf "$dt -- ${YELLOW}UPDATING...${NC}\n" >> $LOG_PATH
sudo apt-get update -y &>> $LOG_PATH
printf "${GREEN}Done.${NC}\n" >> $LOG_PATH

printf "$dt -- ${YELLOW}UPGRADING...${NC}\n" >> $LOG_PATH
sudo -E apt-get upgrade -y -o Dpkg::Options::="--force-confdef" -o Dpkg::Options::="--force-confold" &>> $LOG_PATH
printf "${GREEN}Done.${NC}\n" >> $LOG_PATH

printf "$dt -- ${YELLOW}AUTO REMOVING...${NC}\n" >> $LOG_PATH
sudo apt-get autoremove -y &>> $LOG_PATH
printf "${GREEN}Done.${NC}\n" >> $LOG_PATH

printf "$dt -- ${GREEN}Success! Rebooting...${NC}\n" >> $LOG_PATH
printf "$dt -- ${GREEN}Success! Rebooting...${NC}\n"
sudo reboot
