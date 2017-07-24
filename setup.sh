#! /bin/bash

curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get -y update
sudo apt-get install -y nodejs
sudo apt-get install -y git
sudo apt-get install -y npm
sudo apt-get install redis-server
git clone https://Harpuia@github.com/Harpuia/SimpleAmazon.git
cd SimpleAmazon
npm install
nodejs server.js