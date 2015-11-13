#!/bin/bash

curl -L -s https://github.com/01org/rib/archive/master.zip -o rib.zip
unzip rib.zip
cd rib-master
python -mSimpleHTTPServer 8004 &
echo "Rib up and running!  Check it out:  http://localhost:8004/"
