import {
  getForecastByCoords,
  getWeatherByCity,
  setLocationObject,
  getDay,
} from "./dataFunctions.js"
import { currentLoc, geoErrorContainer } from "./main.js"

export const displayLocation = (city) => {
  const element = document.querySelector(".search-bar__location span")
  element.textContent = city
  element.classList.add("fade-in")
}

const clearWeatherContainer = (container) => {
  container.remove()
}

export const displayCurWeather = (curWeatherObj) => {
  const curForecastContainer = document.querySelector(
    ".current-forecast__container"
  )
  if (curWeatherObj.cod !== 200) {
    displayLocation("")
    clearWeatherContainer(curForecastContainer)
    displayApiError(curWeatherObj)
    return
  }

  const { temp, feelsLike, name, country, description, iconUrl } = curWeatherObj
  const countryName = new Intl.DisplayNames([country], { type: "region" })
  const container = document.querySelector(".current-forecast")

  curForecastContainer && clearWeatherContainer(curForecastContainer)
  geoErrorContainer.style.display = "none"

  const markup = `
      <div class="current-forecast__container fade-in">
        <div class="current-temperature">
          <h2 class="temp"><span>${Math.round(temp)}</span>&#176;C</h2>
          <p class="feels-like">Feels like <span>${Math.round(
            feelsLike
          )}</span>&#176;C</p>
        </div>
        <div class="current-conditions">
          <p>${description}</p>
          <p class="current-conditions__city">${name}, ${countryName.of(
    country
  )}</p>
          <img
            src="${iconUrl}"
            class="current-conditions__icon"
            alt="${name}"
          />
        </div>
      </div>
    `

  container.insertAdjacentHTML("afterbegin", markup)

  displayLocation(`${name}, ${countryName.of(country)}`)
}

export const displayApiError = (statusCode) => {
  geoErrorContainer.style.display = "block"
  geoErrorContainer.textContent = statusCode.message
}

export const searchLocation = async (e) => {
  e.preventDefault()
  const location = document.querySelector("#search-bar__text").value
  const curWeather = await getWeatherByCity(location)

  if (!curWeather) return displayApiError(curWeather.cod)

  const myCoords = {
    lat: curWeather.lat,
    lon: curWeather.lon,
    name: curWeather.name,
  }
  setLocationObject(currentLoc, myCoords)

  displayCurWeather(curWeather)
  displayDailyForecast(currentLoc, getDay)
  document.querySelector("#search-bar__text").value = ""
}

const clearForecast = (container) => {
  while (container.hasChildNodes()) {
    container.removeChild(container.firstChild)
  }
}

export const displayDailyForecast = async (locationObj, dayFunction) => {
  const forecast = await getForecastByCoords(locationObj)

  if (!forecast) {
    clearForecast(document.querySelector(".daily-forecast"))
    displayLocation("")
    clearWeatherContainer(
      document.querySelector(".current-forecast__container")
    )
    displayApiError(locationObj)
    return
  }

  clearForecast(document.querySelector(".daily-forecast"))

  forecast.forEach((entry) => {
    const { time, tempDay, tempEve, description, icon } = entry

    const markup = `
      <div class="daily-forecast__container fade-in">
        <h4>${dayFunction(time)}</h4>
        <img
          src="${icon}"
          class="current-conditions__icon"
          alt="${description}"
        />
        <p>${description}</p>
        <div>
          <p>${Math.round(tempDay)} &#176;C</p>
          <p>${Math.round(tempEve)} &#176;C</p>
        </div>
      </div>
    `

    document
      .querySelector(".daily-forecast")
      .insertAdjacentHTML("beforeend", markup)
  })
}
