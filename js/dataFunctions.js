export const setLocationObject = (locationObj, coordsObj) => {
  const { lat, lon } = coordsObj
  locationObj.setLat(lat)
  locationObj.setLon(lon)
}

export const getWeatherByCity = async (city) => {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${WEATHER_API_KEY}&units=metric`
  try {
    const res = await fetch(url)
    const data = await res.json()

    if (data.cod !== 200) return data

    const curWeather = {
      cod: data.cod,
      temp: data.main.temp,
      feelsLike: data.main.feels_like,
      name: data.name,
      country: data.sys.country,
      description: data.weather[0].description,
      iconUrl: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
      lon: data.coord.lon,
      lat: data.coord.lat,
    }

    return curWeather
  } catch (err) {
    console.error(err)
  }
}

export const getWeatherByCoords = async (coordsObj) => {
  const { lon, lat } = coordsObj
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`
  try {
    const res = await fetch(url)
    const data = await res.json()

    if (data.cod !== 200) return data

    const myWeather = {
      cod: data.cod,
      temp: data.main.temp,
      feelsLike: data.main.feels_like,
      name: data.name,
      country: data.sys.country,
      description: data.weather[0].description,
      iconUrl: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
    }

    return myWeather
  } catch (err) {
    console.log(err)
  }
}

export const getForecastByCoords = async (locationObj) => {
  const { lon, lat } = locationObj
  const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&units=metric&appid=${WEATHER_API_KEY}`

  try {
    const res = await fetch(url)
    const data = await res.json()
    if (!data) return data

    const forecastArray = data.daily.slice(1, 6).map((entry) => {
      return {
        time: entry.dt,
        tempDay: entry.temp.day,
        tempEve: entry.temp.eve,
        description: entry.weather[0].description,
        icon: `https://openweathermap.org/img/wn/${entry.weather[0].icon}.png`,
      }
    })

    return forecastArray
  } catch (err) {
    console.log(err)
  }
}

export const getDay = (ms) => {
  const date = new Date(ms * 1000)
  return date.toLocaleString("en-US", { weekday: "short" })
}
