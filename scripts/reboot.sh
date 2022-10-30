#!/bin/bash

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
NC='\033[0m'

dt="$YELLOW $(date '+%m/%d/%Y %H:%M:%S') $NC";
LOG_PATH="$HOME/xinit_logs"

# Clear Log Path
printf "" > $LOG_PATH

printf "$dt -- $RED Updating & Upgrading & Auto Removing...\n" >> $LOG_PATH

printf "$dt -- $YELLOW UPDATING..." >> $LOG_PATH
sudo apt-get update -y &>> $LOG_PATH
printf "$GREEN Done. $NC\n" >> $LOG_PATH

printf "$dt -- $YELLOW UPGRADING..." >> $LOG_PATH
sudo apt-get upgrade -y &>> $LOG_PATH
printf "$GREEN Done. $NC\n" >> $LOG_PATH

printf "$dt -- $YELLOW AUTO REMOVING..." >> $LOG_PATH
sudo apt-get autoremove -y &>> $LOG_PATH
printf "$GREEN Done. $NC\n" >> $LOG_PATH

printf "$dt -- $GREEN Success! Rebooting... Goodbye! :)$NC\n\n" >> $LOG_PATH
/sbin/shutdown -r now