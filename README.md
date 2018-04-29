# react-asyncify
> A React Higher-Order Component for making async requests with Functional Components.

## Installation

```shell
npm install --save react-asyncify
```

### Examples

```js
import asyncify from 'react-asyncify';
import React, {Component} from 'react';
import axios from 'axios';
const FETCH_WEATHER_FORECAST = "FETCH_WEATHER_FORECAST";

const OpenWeatherForecast = (props) => {
    const {fetcher, fetcherWrapper} = props;
    const getWeatherForecast = fetcher(FETCH_WEATHER_FORECAST, async () => {
        const url = "http://api.openweathermap.org/data/2.5/forecast";
        const res = await axios.get(url);
        return res.data.list;
    });

    fetcherWrapper(getWeatherForecast);

    const weatherForecast = getWeatherForecast.data.map(recording => 
        <li key={recording.dt}>
            {recording.dt}      |       {recording.main.temp}
        </li>
    );

    return (
        <div>
            <ul>{weatherForecast}</ul>
        </div>
    );
}

const preloadValues = {
    FETCH_WEATHER_FORECAST: []
};

export default asyncify(OpenWeatherForecast, preloadValues);
```
