echo "About to install Garage-UI (Make sure to run ONLY on a Raspberry Pi)"
read -p "Continue? (Y/N): " confirm && [[ $confirm == [yY] || $confirm == [yY][eE][sS] ]] || exit 1

GARAGE_UI_DIR=$PWD

echo "Installing Node..."
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash

export NVM_DIR="$HOME/.config/nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

nvm install v17.6.0
nvm use
nvm alias default 17.6.0

echo "Installing Dependencies..."
sudo apt-get update -y
sudo apt-get upgrade -y
sudo apt-get install -y matchbox xorg ttf-mscorefonts-installer xwit sqlite3 libnss3
sudo apt-get autoremove -y

echo "Setting Up Emojis..."
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

echo "Installing Auto Start Script..."
sudo chmod 757 /etc/X11/xinit/xinitrc

sed -i '1s/^/cd $GARAGE_UI_DIR\n/' xinitrc
cat xinitrc > /etc/X11/xinit/xinitrc

echo "Appending Startup Script to Shell"
printf "
    RED='\033[1;31m'
    GREEN='\033[1;32m'
    NC='\033[0m'

    echo -e \"\${GREEN}About to launch Garage-UI... \${RED} press Ctrl+C to exit to bashrc.\${NC}\"
    sleep 4s
    startx -- -nocursor | tee $GARAGE_UI_DIR/logs.txt 
" >> ~/.bashrc

echo "Scheduling Auto Updates..."
sudo printf  "# m h dom mon dow command\n0 2 * * 0 /sbin/shutdown -r now\n" >> temp_cron
sudo crontab temp_cron
rm temp_cron

GREEN='\033[1;32m'
NC='\033[0m'
echo -e "${GREEN}Success!! Rebooting...${NC}"
sleep 4s
sudo reboot
