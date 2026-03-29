FROM node:22-alpine

LABEL maintainer="Silvio Fragata da Silva <sfragata@gmail.com>"

WORKDIR /weather

RUN mkdir -p /weather/modules && mkdir -p /weather/public

COPY modules/ /weather/modules/
COPY public/ /weather/public/
COPY package*.json /weather/
COPY weather.js /weather/

RUN npm ci --omit=dev

ENV OPEN_WEATHER_API_KEY=""
ENV GOOGLE_API_KEY=""

EXPOSE 3000

USER node

CMD ["node", "weather.js"]
