#!/bin/bash
echo "Installing NPM dependencies";
npm install;

echo "Installing mkdocs";
pip install mkdocs;

echo "Installing mkdocs 'cinder' theme";
sudo pip install mkdocs-cinder;
sudo pip install pymdown-extensions;
sudo pip install mkdocs-material;
