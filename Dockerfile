FROM node:6.12.3-alpine

MAINTAINER Silvio Fragata da Silva "sfragata@gmail.com"

WORKDIR /weather

RUN mkdir -p /weather/modules && mkdir -p /weather/public 

COPY modules/ /weather/modules/
COPY public/ /weather/public/
COPY package*.json /weather/
COPY Procfile /weather/
COPY weather.js /weather/

RUN npm install

ENV OPEN_WEATHER_API_KEY=$OPEN_WEATHER_API_KEY

EXPOSE 3000

CMD ["node", "weather.js"]