Weather-node.js
===============
Simple node.js web application that extracts JSON information from http://www.geobytes.com/free-ajax-cities-jsonp-api.htm
to retrieve the cities list (for autocomplete) and from http://openweathermap.org to show the forecast.

## Setup

Create API keys and add them to your environment:

```bash
export OPEN_WEATHER_API_KEY=<your key here>
export GOOGLE_API_KEY=<your key here>
```

## Build & Run

```bash
npm install
npm run build
npm start
```

The app will be available at http://localhost:3000

## Scripts

| Command | Description |
|---------|-------------|
| `npm run build` | Build the React frontend with webpack |
| `npm start` | Start the Express server |
| `npm run lint` | Run ESLint (SAST) on server and frontend code |
| `npm test` | Run unit and integration tests |
| `npm run test:unit` | Run unit tests only |
| `npm run test:integration` | Run integration tests only |
| `npm run test:e2e` | Run Playwright end-to-end tests |

## Docker

```bash
docker build -t weather-app .
docker run -e OPEN_WEATHER_API_KEY=<key> -e GOOGLE_API_KEY=<key> -p 3000:3000 weather-app
```

## Technologies

- [Node.js](http://nodejs.org) (>=20)
- [Express](http://expressjs.com) 5
- [React](https://react.dev) 19
- [Webpack](https://webpack.js.org) 5
- [Google Maps API](https://developers.google.com/maps/documentation/javascript/)
- [Log4js](https://github.com/nomiddlename/log4js-node)
- [Mocha](https://mochajs.org) + [Sinon](https://sinonjs.org) + [Supertest](https://github.com/ladjs/supertest) (testing)
- [Playwright](https://playwright.dev) (e2e testing)
- [ESLint](https://eslint.org) with security plugin (SAST)
