#! /bin/bash

if [[ -z "${CRYSTAL_BALL_HOST}" ]]; then
  echo 'Missing host name. Set the CRYSTAL_BALL_HOST env var'
  exit 1
else
  CRYSTAL_BALL_HOST="${CRYSTAL_BALL_HOST}"
fi

yarn build:service
docker build -t gobbees/crystal-ball:latest .
docker push gobbees/crystal-ball:latest 
ssh root@${CRYSTAL_BALL_HOST} "docker pull gobbees/crystal-ball:latest && docker tag gobbees/crystal-ball:latest dokku/crystal-ball:latest && dokku tags:deploy crystal-ball latest"