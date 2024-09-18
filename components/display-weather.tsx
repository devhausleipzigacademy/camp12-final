"use client";

import { useEffect, useState } from "react";
import { fetchWeather } from "../lib/weather";
import { fetchCityName } from "../lib/utils/fetchCity";

interface Props {
  lat: number;
  lon: number;
}

export default function DisplayWeather({ lat, lon }: Props) {
  const [weather, setWeather] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [city, setCity] = useState<string | null>(null);

  useEffect(() => {
    async function getCityAndWeather() {
      try {
        const cityName = await fetchCityName(lat.toString(), lon.toString());
        setCity(cityName);

        const weatherData = await fetchWeather(cityName);
        setWeather(weatherData);
      } catch (err: any) {
        setError(err.message);
      }
    }
    getCityAndWeather();
  }, [lat, lon]);

  console.log(weather);

  return (
    <div className="">
      {error && <p>Error: {error}</p>}
      {weather ? (
        <div>
          {weather.current.condition.icon && (
            <img
              src={weather.current.condition.icon}
              // src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt="Weather Icon"
            />
          )}
        </div>
      ) : (
        <p>Loading weather...</p>
      )}
    </div>
  );
}
