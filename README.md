# Mountain-UI

## A Custom UI For Mountain Stats

![Mountain-UI](src/assets/images/Mountain-UI.gif)

## About Project
This project is an another flavor of the original Garage-UI available [here](https://github.com/mrrosoff/Garage-UI). This project, however, does not open a garage and instead shows stats on a specific mountain. It allows users to see the current/forecasted weather, ski conditions, show live feeds from a ski resort of their choice, and a fully interactive map, all at a glance.

This project is an Electron app that runs on a Raspberry Pi. The app is designed to be used with a 10"/12" touch screen. For a suggested list of hardware for this project visit this [link](https://www.amazon.com/hz/wishlist/ls/38NBC7T3TDLGV?ref_=wl_share).

### Installation

Clone the repository and run the [install script](scripts/install.sh). This will install the dependencies, build the app, and change your Raspberry Pi to auto update itself and auto launch to Mountain-UI. ⚠️ ***Make sure to run the script in the Mountain-UI directory.***

### Environment Variables

The project uses environment variables to store API keys and other sensitive information. The following environment variables are required to run the project:

```javascript
// Coordinates for the weather API
VITE_LATITUDE=40.4850 
VITE_LONGITUDE=-106.8317

// National Weather Serivce Zone
VITE_NATIONAL_WEATHER_SERVICE_ZONE= // Your zone

// For quick start, use ski id 6 for Steamboat Springs, CO
VITE_SKI_RESORT_ID= // Your ski resort id

// How often to hit the API's in milliseconds
VITE_TIME_INTERVAL=60000

// Youtube Button Link and Title (Each link and title should be separated by a comma)
VITE_YOUTUBE_LIVE_STREAM_LINK= // Your live stream link
VITE_LIVE_STREAM_BUTTON_TITLE= // Your live stream title
```

## Contributing

Please feel free to use this however you'd like. If you'd like to contribute, please open a pull request and I'll review it as soon as I can. If you have any questions, please open an issue and I'll get back to you as soon as I can.