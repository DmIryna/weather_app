import {
  getWeatherByCoords,
  setLocationObject,
  getDay,
} from "./dataFunctions.js"
import {
  searchLocation,
  displayCurWeather,
  displayDailyForecast,
} from "./domFunctions.js"
import CurrentLocation from "./CurrentLocation.js"

export const currentLoc = new CurrentLocation()
export const geoErrorContainer = document.querySelector(".geo-error")

const init = () => {
  getGeoLocation()
  document
    .querySelector(".search-bar__form")
    .addEventListener("submit", searchLocation)
}

document.addEventListener("DOMContentLoaded", init)

const geoError = (errObj) => {
  const errMessage = errObj ? errObj.message : "Geolocation not supported"
  geoErrorContainer.style.display = "block"
  geoErrorContainer.textContent = errMessage
}

const geoSuccess = async (position) => {
  const myCoords = {
    lat: position.coords.latitude,
    lon: position.coords.longitude,
  }

  const curWeather = await getWeatherByCoords(myCoords)

  setLocationObject(currentLoc, myCoords)

  displayCurWeather(curWeather)

  displayDailyForecast(currentLoc, getDay)
}

const getGeoLocation = () => {
  if (!navigator.geolocation) return geoError()
  navigator.geolocation.getCurrentPosition(geoSuccess, geoError)
}
