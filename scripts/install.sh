#!/bin/bash

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
NC='\033[0m'

printf "${YELLOW}About to install Garage-UI (Make sure to run ONLY on a Raspberry Pi)${NC}\n"
read -p "Continue? (Y/N): " confirm && [[ $confirm == [yY] || $confirm == [yY][eE][sS] ]] || exit 1

if [ $(pwd | sed 's#.*/##') != "Garage-UI" ]; then
    printf "${RED}ERROR: Not in Garage-UI directory. Exiting...${NC}\n"
    exit 1
fi

mkdir -p logs
GARAGE_UI_DIR=$PWD

printf "${YELLOW}Installing Node...${NC}\n"
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash

source "$GARAGE_UI_DIR/scripts/load-nvm.sh"

nvm install lts/*
nvm use
printf "${GREEN}Done.${NC}\n"

printf "${YELLOW}Installing Dependencies...${NC}\n"
sudo apt-get update -y
sudo apt-get upgrade -y
sudo apt-get install -y matchbox xorg ttf-mscorefonts-installer fonts-noto-color-emoji xwit sqlite3 libnss3
sudo apt-get autoremove -y
printf "${GREEN}Done.${NC}\n"

printf "${YELLOW}Installing Auto Start Script...${NC}\n"
# startx runs ~/.xinitrc, which hands off to the repo's xinitrc so updates to it take effect
printf "#!/bin/bash\nexport GARAGE_UI_DIR=\"${GARAGE_UI_DIR}\"\nexec bash \"${GARAGE_UI_DIR}/xinitrc\"\n" > ~/.xinitrc
chmod 755 ~/.xinitrc

# Check if not already appended
if ! grep -q "export GARAGE_UI_DIR" ~/.bashrc; then
    printf "${YELLOW}Appending Startup Script to Shell${NC}\n"
    printf "
    export GARAGE_UI_DIR=\"${GARAGE_UI_DIR}\"
    RED='\033[1;31m'
    GREEN='\033[1;32m'
    NC='\033[0m'

    if [[ -z \$SSH_CONNECTION ]]; then
        echo -e \"\${GREEN}About to launch Garage-UI... \${RED}press Ctrl+C to exit to terminal.\${NC}\"
        sleep 4s
        startx -- -nocursor
    fi
    " >> ~/.bashrc
    printf "${GREEN}Done.${NC}\n"
fi

printf "${YELLOW}Scheduling Auto Updates...${NC}\n"
chmod 755 $GARAGE_UI_DIR/scripts/reboot.sh
printf "# m h dom mon dow command\n0 4 * * 0 GARAGE_UI_DIR=\"$GARAGE_UI_DIR\" $GARAGE_UI_DIR/scripts/reboot.sh\n" > temp_cron
sudo crontab temp_cron
rm temp_cron
printf "${GREEN}Done.${NC}\n"

printf "${GREEN}Success! Rebooting...${NC}\n"
sleep 4s
sudo reboot
