#!/bin/bash

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
NC='\033[0m'

GARAGE_UI_DIR="${GARAGE_UI_DIR:-$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)}"

dt="${YELLOW}$(date '+%m/%d/%Y %H:%M:%S')${NC}";
LOG_PATH="${GARAGE_UI_DIR}/logs/auto_start.log"

mkdir -p "${GARAGE_UI_DIR}/logs"
printf "$dt -- in ${GARAGE_UI_DIR}\n\n" > $LOG_PATH

cd "$GARAGE_UI_DIR"
git fetch

UPSTREAM=${1:-'@{u}'}
LOCAL=$(git rev-parse @)
REMOTE=$(git rev-parse "$UPSTREAM")
printf "$dt -- Checking remote vs local...\n" >> $LOG_PATH

printf "$dt -- " >> $LOG_PATH
git status &>> $LOG_PATH
printf "\n\n" >> $LOG_PATH

source "$GARAGE_UI_DIR/scripts/load-nvm.sh"
# Installs the newest Node in the .nvmrc LTS line if it's missing, then switches to it
nvm install &>> $LOG_PATH

if [ "$LOCAL" = "$REMOTE" ]; then
	printf "$dt -- ${GREEN}Up-to-date${NC}\n" >> $LOG_PATH
else
	printf "$dt -- ${RED}Need to rebuild dependencies${NC}\n" >> $LOG_PATH

	# Match the remote exactly, so local edits or rewritten history can't block updates.
	# Ignored files like .env, logs, and node_modules are left alone.
	printf "$dt -- Pulling...\n" >> $LOG_PATH
	git reset --hard "$UPSTREAM" &>> $LOG_PATH
	printf "${GREEN}Done.${NC}\n\n" >> $LOG_PATH
fi

# Reinstall unless the last successful install used this exact lockfile. This also covers
# fresh installs and an install that was interrupted (e.g. by a power cut) partway through.
INSTALL_MARKER="node_modules/.installed-lockfile"
LOCKFILE_HASH=$(sha256sum package-lock.json | cut -d" " -f1)
if [ "$(cat "$INSTALL_MARKER" 2>/dev/null)" != "$LOCKFILE_HASH" ]; then
	printf "$dt -- Installing Dependencies...\n" >> $LOG_PATH
	if npm ci &>> $LOG_PATH && npx electron-rebuild &>> $LOG_PATH; then
		echo "$LOCKFILE_HASH" > "$INSTALL_MARKER"
		printf "${GREEN}Done.${NC}\n\n" >> $LOG_PATH
	else
		printf "$dt -- ${RED}Install failed, will retry next boot${NC}\n\n" >> $LOG_PATH
	fi
fi

printf "$dt -- ${GREEN}Success! Starting Garage-UI...${NC}\n" >> $LOG_PATH

xset -dpms
xset s off
matchbox-window-manager &

printf "$dt --" >> $LOG_PATH
npm run garage &>> $LOG_PATH
