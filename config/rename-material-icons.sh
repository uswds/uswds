#!/bin/bash

#Save current directory so we can restore it later
cur=$PWD

#Save command line arguments so functions can access it
args=("$@")​

#Process the file names when called from the loop below
function dir_command {
    cd $1;
    for f in `find . -name '24px.svg'`
    do
        filename=`echo $f|awk -F'/' '{SL = NF-1; TL = NF-2; print $SL "/" $TL ".svg"}'`
        cp $f ./processed/$filename
    done
    cd ..;
}

#Declare the top level directory names
declare -a dirs=("action" "alert" "av" "communication" "content" "device" "editor" "file" "hardware" "home" "image" "maps" "navigation" "notification" "places" "social" "toggle")

#Loop through each directory and call the dir_command above
for dir in "${dirs[@]}"; do
    dir_command "$dir/"
done

#Restore the folder
cd "$cur"