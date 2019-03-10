#!/bin/sh
# Load environment variables
. ./paths.sh

# Colors
COLOR_GREEN='\x1b[32m'
COLOR_RED='\x1b[31m'
COLOR_NC='\x1b[0m'

function log() {
  echo "$COLOR_GREEN$1$COLOR_NC"
}

function error() {
  echo "$COLOR_RED$1$COLOR_NC"
  echo $COLOR_RED"Site update failed."$COLOR_NC
  log "============================================================"
  exit 1
}

# Tell shell script to exit 
set -e

echo 

# Build latest version from git
log "============================================================"
log "Date: `date "+%Y-%m-%d %H:%M:%S"`"
log "------------------------------------------------------------"
cd "$PROJECT_ROOT"
git pull origin &> /dev/null && log "Pull successful [1/5]" || error "Pull failed."

bundle install &> /dev/null && log "Bundle install successful [2/5]" || error "Bundle install failed."
bundle exec jekyll build &> /dev/null && log "Jekyll build successful [3/5]" || error "Jekyll build failed."
bundle exec htmlproofer ./_site --disable-external &> /dev/null && log "HTMLProofer successful [4/5]" || error "HTMLProofer failed."

# Copy build directory to deployment
rsync -crz "$PROJECT_ROOT/$PROJECT_BUILD_DIR/" "$DEPLOYMENT_ROOT" &> /dev/null && log "Copy with rsync to deploy folder successful [5/5]" || error "Copy with rsync to deploy folder failed."
log "Site update successful!"
log "============================================================"