#!/bin/bash


# read json value
function readJson {
  UNAMESTR=`uname`
  if [[ "$UNAMESTR" == 'Linux' ]]; then
    SED_EXTENDED='-r'
  elif [[ "$UNAMESTR" == 'Darwin' ]]; then
    SED_EXTENDED='-E'
  fi;

  VALUE=`grep -m 1 "\"${2}\"" ${1} | sed ${SED_EXTENDED} 's/^ *//;s/.*: *"//;s/",?//'`

  if [ ! "$VALUE" ]; then
    echo "Error: Cannot find \"${2}\" in ${1}" >&2;
    exit 1;
  else
    echo $VALUE ;
  fi;
}

PUBLISHED_VERSION=`readJson package.json version` || exit 1;
CURRENT_VERSION=`npm view @gscottqueen/utils version`

if test "$PUBLISHED_VERSION" = "$CURRENT_VERSION"; then
  echo "No change in version skipping...";
  exit 1
else
  echo "Current version changing from $PUBLISHED_VERSIONE to $CURRENT_VERSION, moving to prepublish hooks...";
fi;


