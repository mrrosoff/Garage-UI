#!/bin/bash
# Source this file to load nvm. The nvm installer uses ~/.nvm unless XDG_CONFIG_HOME is set,
# in which case it uses $XDG_CONFIG_HOME/nvm.

if [ -s "$HOME/.nvm/nvm.sh" ]; then
    export NVM_DIR="$HOME/.nvm"
else
    export NVM_DIR="${XDG_CONFIG_HOME:-$HOME/.config}/nvm"
fi

[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
