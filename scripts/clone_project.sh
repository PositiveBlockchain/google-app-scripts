#!/bin/bash

# Prompt user for Script ID
read -p "Enter the Script ID: " scriptId

# Create directory with the Script ID as the name
mkdir "$scriptId"

# Change to the new directory
cd "$scriptId" || exit

# Create package.json with the name set to the Script ID
echo '{"name": "'"$scriptId"'"}' > package.json

# Run yarn clasp clone with the provided Script ID in the new directory/workspace
yarn clasp clone "$scriptId"

# Update package.json with the Script ID in the workspaces field
cd .. && echo "$(jq --arg id "$scriptId" '.workspaces += [$id]' package.json)" > package.json