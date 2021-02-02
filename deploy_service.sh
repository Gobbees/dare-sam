#! /bin/bash

yarn build:service
docker build -t gobbees/crystal-ball:latest .
docker push gobbees/crystal-ball:latest 
ssh root@206.189.19.164 "docker pull gobbees/crystal-ball:latest && docker tag gobbees/crystal-ball:latest dokku/crystal-ball:latest && dokku tags:deploy crystal-ball latest"