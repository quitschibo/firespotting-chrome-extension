#!/bin/bash -e
#
# Purpose: Pack a Chromium extension directory into crx format

if test $# -ne 2; then
  echo "Usage: crxmake.sh <extension dir> <pem path>"
  exit 1
fi

dir=$1
key=$2

# add header line of private key
echo "-----BEGIN RSA PRIVATE KEY-----" > key.pem

# get private key from env and replace all whitespaces with linebreaks
echo $PEMKEY | tr '|' '\n' >> key.pem

# add base line of private key
echo "-----END RSA PRIVATE KEY-----" >> key.pem

name="firespotting"
# zip up the crx dir
cwd=$(pwd -P)
cd "$dir" && zip -qr -9 -X "../firespotting.zip" .
chmod +x "$cwd/buildcrx.bin"

$cwd/buildcrx.bin firespotting.zip $cwd/key.pem firespotting.crx
mv "$cwd/firespotting.crx" "$cwd/selenium-test/src/main/resources"
