# Garage-UI

### A Custom UI For A Garage Door Opener

## About Project

After viewing the button on my family's garageAPI wall for enough years, I decided to finally do something about it. I 
imagined a world where there was a central database for important information about family endeavors, where one could go
for quick information at a glance, but also for more detailed info.

Thus, the Garage-Pi was born.

A Raspberry Pi runs this repo as an Electron app out of our garage. It of course has garage door controls, but it also 
shows tide, weather, and surf data. The app is configured so that new data sources can be easily added at a later date.

## Installation

Clone the repository and run the [install script](install.sh). This will install the dependencies, build the app, and change your Raspberry Pi to auto update itself and auto launch to Garage-UI.

## Environment Variables

We currently use the following environment variables:

```
lat=32.95325541910332
lng=-117.24177865770446
zipCode=92130
noaaStation=9410230
timeInterval=60000
openWeatherMapAppId="114e2f8559d9daba8a4ad4e51464c8b6"
```