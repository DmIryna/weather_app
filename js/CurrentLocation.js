export default class CurrentLocation {
  constructor() {
    this.lat = null
    this.lon = null
  }

  getLat() {
    return this.lat
  }

  setLat(lat) {
    this.lat = lat
  }

  getLon() {
    return this.lon
  }

  setLon(lon) {
    this.lon = lon
  }
}
