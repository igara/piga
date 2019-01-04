#!/bin/sh

yarn

if [ $WEB_ENV = "local" ]; then
yarn run dev
elif [ $WEB_ENV = "production" ]; then
yarn run build
yarn start
fi
