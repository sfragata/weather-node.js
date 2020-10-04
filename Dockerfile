FROM node:14.12.0-alpine3.12

LABEL Silvio Fragata da Silva "sfragata@gmail.com"

WORKDIR /weather

RUN mkdir -p /weather/modules && mkdir -p /weather/public 

COPY modules/ /weather/modules/
COPY public/ /weather/public/
COPY package*.json /weather/
COPY Procfile /weather/
COPY weather.js /weather/

RUN npm install

ENV OPEN_WEATHER_API_KEY=$OPEN_WEATHER_API_KEY

ENV GOOGLE_API_KEY=$GOOGLE_API_KEY

EXPOSE 3000

CMD ["node", "weather.js"]