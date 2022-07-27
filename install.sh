echo "About to install Garage-UI (Make sure to run ONLY on a Raspberry Pi)"
read -p "Continue? (Y/N): " confirm && [[ $confirm == [yY] || $confirm == [yY][eE][sS] ]] || exit 1

GARAGE-UI-DIR=$PWD

cd ../
echo "Installing NVM..."
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
echo "Done."

echo "Setting up NVM..."
nvm install v16.13.2
nvm alias default 16.13.2
echo "Done."

echo "Installing dependencies..."
sudo apt-get update -y
sudo apt-get upgrade -y
sudo apt-get install -y matchbox xorg ttf-mscorefonts-installer xwit sqlite3 libnss3
echo "Done."

echo "Installing auto start script..."
echo "
    cd ${GARAGE-UI-DIR}
    git fetch

    UPSTREAM=${1:-'@{u}'}
    LOCAL=$(git rev-parse @)
    REMOTE=$(git rev-parse "$UPSTREAM")
    BASE=$(git merge-base @ "$UPSTREAM")

    if [ $LOCAL = $REMOTE ]; then
        echo "Up-to-date"
    elif [ $LOCAL = $BASE ]; then
        echo "Need to pull and npm install"
        git pull
        npm install --legacy-peer-deps
        $(npm bin)/electron-rebuild
    else
        echo "Diverged"
    fi

    while true: do

        xset -dpms
        xset s off
        matchbox-window-manager &

        npm start
    
    done;
" > /etc/X11/xinit/xinitrc
echo "Done."

echo "Appending startup script to bashrc..."
echo "
    RED='\033[1;31m'
    GREEN='\033[1;32m'
    NC='\033[0m'
    
    echo -d "${GREEN}About to launch Garage-UI... ${RED} press Ctrl+C to exit to bashrc.${NC}"
    sleep 4s
    startx -- -nocursor 
" >> ~/.bashrc
echo "Done."

echo "Scheduling auto updates..."
echo -e "# m h dom mon dow command\n0 2 * * 0 /sbin/shutdown -r now" >> temp_cron
crontab temp_cron
rm temp_cron
echo "Done."

GREEN='\033[1;32m'
NC='\033[0m'
echo -e "${GREEN}Success!! Rebooting...${NC}"
sleep 4s
sudo reboot