# Garage-UI

### A Custom UI For A Garage Door Opener

![Garage-UI](src/assets/example.png)

## About Project

After viewing the button on my family's garageAPI wall for enough years, I decided to finally do something about it. I 
imagined a world where there was a central database for important information about family endeavors, where one could go
for quick information at a glance, but also for more detailed info.

Thus, the Garage-Pi was born.

A Raspberry Pi runs this repo as an Electron app out of our garage. It of course has garage door controls, but it also 
shows tide, weather, and surf data. The app is configured so that new data sources can be easily added at a later date.

## Installation

Clone the repository and run the [install script](scripts/install.sh). This will install the dependencies, build the app, and change your Raspberry Pi to auto update itself and auto launch to Garage-UI. ⚠️ ***Make sure to run the script in the Garage-UI directory.***

## Environment Variables

We currently use the following environment variables:

```
VITE_LATITUDE=32.95325541910332
VITE_LONGITUDE=-117.24177865770446
VITE_ZIP_CODE=92130
VITE_NOAA_STATION=9410230
VITE_TIME_INTERVAL=60000

VITE_OPEN_WEATHER_MAP_ID="your-key-here"
VITE_OPEN_UV_API_TOKEN="your-token-here"

VITE_SURF_SPOT_ONE_ID="5842041f4e65fad6a770883b"
VITE_SURF_SPOT_ONE_NAME="Blacks"

VITE_SURF_SPOT_TWO_ID="5842041f4e65fad6a77088af"
VITE_SURF_SPOT_TWO_NAME="15th Street"

VITE_SURF_SPOT_THREE_ID="5842041f4e65fad6a77088a0"
VITE_SURF_SPOT_THREE_NAME="Beacons"
```