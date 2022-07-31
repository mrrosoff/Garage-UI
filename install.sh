echo "About to install Garage-UI (Make sure to run ONLY on a Raspberry Pi)"
# read -p "Continue? (Y/N): " confirm && [[ $confirm == [yY] || $confirm == [yY][eE][sS] ]] || exit 1

GARAGE_UI_DIR=$PWD

echo "Installing Node..."
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash

export NVM_DIR="$HOME/.config/nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

nvm install v16.13.2
nvm alias default 16.13.2
echo "Done."

echo "Installing dependencies..."
sudo apt-get update -y
sudo apt-get upgrade -y
sudo apt-get install -y matchbox xorg ttf-mscorefonts-installer xwit sqlite3 libnss3
echo "Done."

echo "Setting up emojis..."
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
echo "Done"

echo "Installing auto start script..."
sudo chmod 757 /etc/X11/xinit/xinitrc
sudo printf "

   export NVM_DIR=\"$HOME/.config/nvm\"
   [ -s \"\$NVM_DIR/nvm.sh\" ] && \. \"\$NVM_DIR/nvm.sh\"  # This loads nvm
   [ -s \"\$NVM_DIR/bash_completion\" ] && \. \"\$NVM_DIR/bash_completion\"  # This loads nvm bash_completion

   cd ${GARAGE_UI_DIR}

    git fetch

    UPSTREAM=\${1:-'@{u}'}
    LOCAL=\$(git rev-parse @)
    REMOTE=\$(git rev-parse \"\$UPSTREAM\")
    BASE=\$(git merge-base @ \"\$UPSTREAM\")

    if [ \$LOCAL = \$REMOTE ]; then
        echo \"Up to date\"
    elif [ \$LOCAL = \$BASE ]; then
       	echo \"Need to pull and npm install\"
        git pull
        npm install --legacy-peer-deps
        \$(npm bin)/electron-rebuild
    else
        echo \"Diverged\"
    fi

    xset -dpms
    xset s off
    matchbox-window-manager &

    npm run garage

" > /etc/X11/xinit/xinitrc
echo "Done."

echo "Appending startup script to bashrc..."
printf "
    RED='\033[1;31m'
    GREEN='\033[1;32m'
    NC='\033[0m'

    echo -e \"\${GREEN}About to launch Garage-UI... \${RED} press Ctrl+C to exit to bashrc.\${NC}\"
    sleep 4s
    startx -- -nocursor | tee $GARAGE_UI_DIR/logs.txt 
" >> ~/.bashrc
echo "Done."

echo "Scheduling auto updates..."
sudo printf  "# m h dom mon dow command\n0 2 * * 0 /sbin/shutdown -r now" >> temp_cron
sudo crontab temp_cron
rm temp_cron
echo "Done."

GREEN='\033[1;32m'
NC='\033[0m'
echo -e "${GREEN}Success!! Rebooting...${NC}"
sleep 4s
sudo reboot
