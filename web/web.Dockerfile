FROM node:alpine

ADD . /web
WORKDIR /web
RUN apk --update add --virtual docker

RUN apk --update add tzdata && \
	rm -rf /var/cache/apk/*

RUN apk --no-cache add openssl python2 make gcc g++ && \
	wget -O /usr/local/bin/dumb-init https://github.com/Yelp/dumb-init/releases/download/v1.2.0/dumb-init_1.2.0_amd64 && \
	chmod +x /usr/local/bin/dumb-init && \
	apk del openssl && \
	apk --no-cache add ca-certificates wget && \
	wget -q -O /etc/apk/keys/sgerrand.rsa.pub https://alpine-pkgs.sgerrand.com/sgerrand.rsa.pub && \
	wget https://github.com/sgerrand/alpine-pkg-glibc/releases/download/2.28-r0/glibc-2.28-r0.apk && \
	apk add glibc-2.28-r0.apk

RUN npm install -g yarn
RUN chmod +x /usr/local/lib/node_modules/yarn/bin/yarn.js
RUN yarn

RUN chmod +x /web/web.sh
CMD ["/web/web.sh"]
