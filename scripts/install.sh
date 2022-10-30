#!/bin/bash

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
NC='\033[0m'

echo "${YELLOW}About to install Garage-UI (Make sure to run ONLY on a Raspberry Pi)${NC}"
read -p "Continue? (Y/N): " confirm && [[ $confirm == [yY] || $confirm == [yY][eE][sS] ]] || exit 1

if [ $(pwd | sed 's#.*/##') != "Garage-UI" ]; then
    echo "${RED}Not in Garage-UI directory. Exiting...${NC}"
    exit 1
fi

GARAGE_UI_DIR=$PWD

echo "${YELLOW}Installing Node...${NC}"
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash

export NVM_DIR="$HOME/.config/nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

nvm install v18.0.0
nvm use
nvm alias default 18.0.0
echo "${GREEN}Done.${NC}"

echo "${YELLOW}Installing Dependencies...${NC}"
sudo apt-get update -y
sudo apt-get upgrade -y
sudo apt-get install -y matchbox xorg ttf-mscorefonts-installer xwit sqlite3 libnss3
sudo apt-get autoremove -y
echo "${GREEN}Done.${NC}"

echo "${YELLOW}Setting Up Emojis...${NC}"
mkdir emj_temp
cd emj_temp
wget https://fontsdata.com/zipdown-segoeuiemoji-132714.htm 
wget https://noto-website.storage.googleapis.com/pkgs/NotoColorEmoji-unhinted.zip
mv zipdown-segoeuiemoji-132714.htm segoeuiemoji.zip
unzip segoeuiemoji.zip
unzip NotoColorEmoji-unhinted.zip
mkdir $HOME/.fonts &>/dev/null
mv seguiemj.ttf "$HOME/.fonts/Segoe UI.ttf"
mv NotoColorEmoji.ttf "$HOME/.fonts/Noto Color Emoji.ttf"
fc-cache -f -v &>/dev/null
cd ..
rm -rf emj_temp
echo "${GREEN}Done.${NC}"

echo "${YELLOW}Installing Auto Start Script...${NC}"
rm /etc/X11/xinit/xinitrc 2>/dev/null
sudo chmod 757 /etc/X11/xinit/xinitrc
sed -i "2 i cd $GARAGE_UI_DIR" xinitrc
cat xinitrc > /etc/X11/xinit/xinitrc

echo "${YELLOW}Appending Startup Script to Shell${NC}"
printf "
    export GARAGE_UI_DIR=\${GARAGE_UI_DIR}
    RED='\033[1;31m'
    GREEN='\033[1;32m'
    NC='\033[0m'

    echo -e \"\${GREEN}About to launch Garage-UI... \${RED}press Ctrl+C to exit to bashrc.\${NC}\"
    sleep 4s
    startx -- -nocursor 
" >> ~/.bashrc
echo "${GREEN}Done.${NC}"

echo "${YELLOW}Scheduling Auto Updates...${NC}"
sudo chmod 757 $GARAGE_UI_DIR/scripts/reboot.sh
sudo printf  "# m h dom mon dow command\n0 2 * * 0 $GARAGE_UI_DIR/scripts/reboot.sh\n" >> temp_cron
sudo crontab temp_cron
rm temp_cron
echo "${GREEN}Done.${NC}"

echo -e "${GREEN}Success!! Rebooting...${NC}"
sleep 4s
sudo reboot
