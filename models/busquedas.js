import fs from 'fs'
import axios from 'axios'
export class Busquedas {
  historial = []
  dbPath = './db/database.json'
  constructor() {
    // TODO read DB
    try {
      const { historial } = this.readDB()
      this.historial = historial
    } catch (error) {
      console.log('No DB found !!')
    }
  }

  get paramsMapbox() {
    return {
      access_token: process.env.MAPBOX_KEY,
      language: 'es',
      limit: 6
    }
  }

  get paramsOpenWeather() {
    return {
      appId: process.env.OPEN_WEATHER,
      units: 'metric',
      lang: 'es'
    }
  }

  async city(lugar = '') {
    try {
      const instance = axios.create({
        baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
        params: this.paramsMapbox
      })

      const res = await instance.get()
      // console.log({ res })
      // console.log(res.data)

      return res.data.features.map((lugar) => ({
        id: lugar.id,
        name: lugar.place_name,
        lng: lugar.center[0],
        lat: lugar.center[1]
      }))
    } catch (error) {
      return []
    }
  }

  async climatePlace(lat, lon) {
    try {
      const instanceClimate = axios.create({
        baseURL: `https://api.openweathermap.org/data/2.5/weather`,
        params: { ...this.paramsOpenWeather, lat, lon }
      })

      const { data } = await instanceClimate.get()
      const { weather, main } = data

      return {
        desc: weather[0]?.description || '',
        min: main.temp_min,
        max: main.temp_max,
        temp: main.temp
      }
    } catch (error) {
      console.log(error)
    }
  }

  addHistory = async (place = '') => {
    if (this.historial.includes(place.toLowerCase())) return
    this.historial = this.historial.splice(0, 5)
    this.historial.unshift(place)
    this.saveDB()
  }

  saveDB() {
    const payload = {
      historial: this.historial
    }
    fs.writeFileSync(this.dbPath, JSON.stringify(payload))
  }

  readDB() {
    if (!fs.existsSync(this.dbPath)) {
      return null
    }
    const info = fs.readFileSync(this.dbPath, { encoding: 'utf-8' })
    const data = JSON.parse(info)
    return data
  }

  historyCapitalized = async () => {
    return this.historial.map((itemHistorial) => {
      let words = itemHistorial.split(' ')
      words = words.map(
        (word) => word.charAt(0).toUpperCase() + word.substring(1)
      )

      return words.join(' ')
    })
  }
}
