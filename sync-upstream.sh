#!/bin/bash

# Script to sync with upstream Handit-AI repository
# This helps pull in changes from the original repo while preserving our customizations

set -e

echo "🔄 Syncing with upstream Handit-AI repository..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if upstream remote exists
if ! git remote | grep -q upstream; then
    echo -e "${YELLOW}Adding upstream remote...${NC}"
    git remote add upstream https://github.com/Handit-AI/handit.ai.git
fi

# Fetch latest from upstream
echo -e "${GREEN}Fetching upstream changes...${NC}"
git fetch upstream

# Get current branch
CURRENT_BRANCH=$(git branch --show-current)

echo -e "${GREEN}Current branch: ${CURRENT_BRANCH}${NC}"

# Show upstream changes
echo -e "\n${YELLOW}Recent upstream commits:${NC}"
git log HEAD..upstream/main --oneline --max-count=10

# Ask user what to do
echo -e "\n${YELLOW}What would you like to do?${NC}"
echo "1) Merge upstream/main into current branch"
echo "2) Create a new branch from upstream/main"
echo "3) Just view differences (no changes)"
echo "4) Exit"

read -p "Choose an option (1-4): " choice

case $choice in
    1)
        echo -e "${GREEN}Creating backup branch...${NC}"
        git branch backup-${CURRENT_BRANCH}-$(date +%Y%m%d-%H%M%S) || true
        
        echo -e "${GREEN}Merging upstream/main...${NC}"
        git merge upstream/main
        
        echo -e "${GREEN}✅ Merge complete! Resolve any conflicts if needed.${NC}"
        ;;
    2)
        read -p "Enter new branch name: " NEW_BRANCH
        git checkout -b $NEW_BRANCH upstream/main
        echo -e "${GREEN}✅ Created new branch '$NEW_BRANCH' from upstream/main${NC}"
        ;;
    3)
        echo -e "${GREEN}Showing differences...${NC}"
        git diff HEAD..upstream/main --stat
        echo -e "\n${YELLOW}Use 'git diff HEAD..upstream/main' to see full diff${NC}"
        ;;
    4)
        echo "Exiting..."
        exit 0
        ;;
    *)
        echo -e "${RED}Invalid option${NC}"
        exit 1
        ;;
esac

echo -e "\n${GREEN}Done! Your local customizations are preserved.${NC}"
echo -e "${YELLOW}Remember to test thoroughly after merging upstream changes.${NC}"