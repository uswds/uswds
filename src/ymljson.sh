#!/bin/bash
#@filename: script.sh

for file in $(find "./components" -type f -name "*.yml"); do
     echo "$file"
     yq eval -o=j "$file" > "${file%.yml}.json"
done
