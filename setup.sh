#!/bin/bash
echo "Installing NPM dependencies";
npm install;

echo "Installing mkdocs";
pip install mkdocs;

echo "Installing mkdocs 'cinder' theme";
pip install mkdocs-cinder;