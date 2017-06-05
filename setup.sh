#! /bin/bash

sudo apt-get -y update
sudo apt-get install -y nodejs
sudo apt-get install -y git
sudo apt-get install -y npm
git clone https://Harpuia@github.com/Harpuia/SimpleAmazon.git
cd SimpleAmazon
npm install
nodemon server.js
