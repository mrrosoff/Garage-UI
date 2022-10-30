#!/bin/bash

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
NC='\033[0m'

dt="${YELLOW}$(date '+%m/%d/%Y %H:%M:%S')${NC}";
LOG_PATH="${GARAGE_UI_DIR}/logs/reboot.log"
AUTO_START_LOG_PATH="${GARAGE_UI_DIR}/logs/auto_start.log"

# Clear Log Paths
printf "" > $LOG_PATH
printf "" > $AUTO_START_LOG_PATH

printf "$dt -- ${YELLOW}Updating & Upgrading & Auto Removing...\n" >> $LOG_PATH

printf "$dt -- ${YELLOW}UPDATING...${NC}" >> $LOG_PATH
sudo apt-get update -y &>> $LOG_PATH
printf "$GREEN Done. $NC\n" >> $LOG_PATH

printf "$dt -- ${YELLOW}UPGRADING...${NC}" >> $LOG_PATH
sudo apt-get upgrade -y &>> $LOG_PATH
printf "$GREEN Done. $NC\n" >> $LOG_PATH

printf "$dt -- ${YELLOW}AUTO REMOVING...${NC}" >> $LOG_PATH
sudo apt-get autoremove -y &>> $LOG_PATH
printf "${GREEN}Done.${NC}\n" >> $LOG_PATH

printf "$dt -- ${GREEN}Success! Rebooting...${NC}\n\n" >> $LOG_PATH
sudo reboot