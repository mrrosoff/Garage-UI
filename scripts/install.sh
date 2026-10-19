#!/bin/bash

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
NC='\033[0m'

printf "${YELLOW}About to install Garage-UI (Make sure to run ONLY on a Raspberry Pi)${NC}\n"
read -p "Continue? (Y/N): " confirm && [[ $confirm == [yY] || $confirm == [yY][eE][sS] ]] || exit 1

if [ "$EUID" -eq 0 ]; then
    printf "${RED}ERROR: Run this as your normal user, not with sudo. Exiting...${NC}\n"
    exit 1
fi

if [ $(pwd | sed 's#.*/##') != "Garage-UI" ]; then
    printf "${RED}ERROR: Not in Garage-UI directory. Exiting...${NC}\n"
    exit 1
fi

if [ ! -f .env ]; then
    printf "${RED}ERROR: Missing .env file. See the Environment Variables section of README.md. Exiting...${NC}\n"
    exit 1
fi

set -e

mkdir -p logs
GARAGE_UI_DIR=$PWD

# Package names differ between Debian releases (e.g. libgtk-3-0 became libgtk-3-0t64 in trixie)
first_available_package() {
    for pkg in "$@"; do
        if apt-cache policy "$pkg" 2>/dev/null | grep -q "Candidate: [^(]"; then
            echo "$pkg"
            return
        fi
    done
}

printf "${YELLOW}Installing Dependencies...${NC}\n"
export DEBIAN_FRONTEND=noninteractive
echo "ttf-mscorefonts-installer msttcorefonts/accept-mscorefonts-eula select true" | sudo debconf-set-selections
sudo apt-get update -y
sudo -E apt-get upgrade -y
# python3 and build-essential compile the GPIO library's native module
sudo -E apt-get install -y git curl python3 build-essential \
    matchbox-window-manager xorg xwit x11-xserver-utils \
    fonts-noto-color-emoji libnss3 libgbm1 \
    $(first_available_package ttf-mscorefonts-installer) \
    $(first_available_package libgtk-3-0t64 libgtk-3-0) \
    $(first_available_package libasound2t64 libasound2)
sudo apt-get autoremove -y
printf "${GREEN}Done.${NC}\n"

printf "${YELLOW}Installing Node...${NC}\n"
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.8/install.sh | bash

set +e # nvm's scripts don't run cleanly under set -e
source "$GARAGE_UI_DIR/scripts/load-nvm.sh"
nvm install
nvm use
set -e
printf "${GREEN}Done.${NC}\n"

printf "${YELLOW}Installing Garage-UI Packages...${NC}\n"
npm ci
npx electron-rebuild
# Tells xinitrc these dependencies are installed, so the first boot doesn't reinstall them
sha256sum package-lock.json | cut -d" " -f1 > node_modules/.installed-lockfile
printf "${GREEN}Done.${NC}\n"

printf "${YELLOW}Installing Auto Start Script...${NC}\n"
# Boot to the console and log in automatically, so ~/.bashrc can launch the app with startx
if command -v raspi-config &>/dev/null; then
    sudo raspi-config nonint do_boot_behaviour B2
else
    printf "${YELLOW}raspi-config not found. Set up console autologin yourself.${NC}\n"
fi

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
