#!/bin/bash

# Go into a subdirectory with the name of the first argument
cd $1

# Run 'yarn clasp push' to push the changes to the script to the cloud
echo "Pushing changes to the cloud..."
yarn clasp push

echo "Changes pushed. Please run deploy command next"

