#!/bin/sh

yarn install --network-timeout 10000000

if [ $WEB_ENV = "local" ]; then
yarn run dev
elif [ $WEB_ENV = "production" ]; then
yarn run build
yarn start
fi
