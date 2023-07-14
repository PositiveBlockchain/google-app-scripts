#!/bin/bash

# Go into a subdirectory with the name of the first argument
cd $1

# Run 'yarn clasp push' to push the changes to the script to the cloud
echo "Pushing changes to the cloud..."
yarn clasp push

# Request a description from the user
echo "Please enter a description: "
read description

# Run 'yarn clasp version' with the description as the argument
output=$(yarn clasp version "$description")

echo "Getting version number for deployment..."
# Extract the version number from the output
# Assuming the version is the last number in the output
version=$(echo $output | grep -o '[0-9]\+' | tail -1)

echo "Attempting to deploy version $version: $description"
# Deploy with the version and description
yarn clasp deploy $version "$description"

git commit -am "Deployed version $version: $description"