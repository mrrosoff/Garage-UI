#!/bin/bash

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
NC='\033[0m'

dt="$YELLOW $(date '+%m/%d/%Y %H:%M:%S') $NC";
LOG_PATH="$HOME/xinit_logs"

cd $HOME/Garage-UI	
printf "$dt -- in $HOME \n\n" > $LOG_PATH

git fetch 

UPSTREAM=${1:-'@{u}'}
LOCAL=$(git rev-parse @)
REMOTE=$(git rev-parse "$UPSTREAM")
printf "$dt -- Checking remote vs local...\n" >> $LOG_PATH

printf "$dt -- " >> $LOG_PATH
git status &>> $LOG_PATH
printf "\n\n" >> $LOG_PATH

if [ $LOCAL = $REMOTE ]; then
	printf "$dt -- $GREEN Up-to-date$NC \n" >> $LOG_PATH
else
	printf "$dt -- $RED Need to pull and npm install$NC \n" >> $LOG_PATH

	printf "$dt -- Pulling...\n" >> $LOG_PATH
	git pull -f &>> $LOG_PATH
	printf "$GREEN Done. $NC\n\n" >> $LOG_PATH

	printf "$dt -- Installing dependecies..." >> $LOG_PATH
	npm install &>> $LOG_PATH
	$(npm bin)/electron-rebuild &>> $LOG_PATH
	printf "$GREEN Done. $NC\n\n" >> $LOG_PATH
fi

printf "$dt -- $GREEN Success! Starting Garage-UI... $NC\n\n" >> $LOG_PATH

xset -dpms 
xset s off 
matchbox-window-manager & 

printf "$dt --" >> $LOG_PATH
npm run garage &>> $LOG_PATH

