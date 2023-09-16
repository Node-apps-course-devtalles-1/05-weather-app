import 'dotenv/config'
import {
  inquirerMenu,
  leerInput,
  listPlaces,
  pause
} from './helpers/inquirer.js'
import { Busquedas } from './models/busquedas.js'

const main = async () => {
  const busquedas = new Busquedas()
  let opt = ''
  do {
    opt = await inquirerMenu()

    switch (opt) {
      case 1:
        const term = await leerInput('Ciudad: ')
        const placesFind = await busquedas.city(term)

        const idPlace = await listPlaces(placesFind)

        if (idPlace === '0') continue

        console.log('\nCity information\n'.green)

        const placeSelected = await placesFind.find(
          (place) => place.id === idPlace
        )

        await busquedas.addHistory(placeSelected.name)

        const { desc, min, max, temp } = await busquedas.climatePlace(
          placeSelected.lat,
          placeSelected.lng
        )
        console.clear()
        console.log('** Place information **\n'.green)
        console.log('City: ', placeSelected.name.green)
        console.log('Lat: ', placeSelected.lat)
        console.log('Lng: ', placeSelected.lng)
        console.log('temperature: ', temp)
        console.log('Min: ', min)
        console.log('Max: ', max)
        console.log('The climate is: ', desc.green)
        break
      case 2:
        const historyCapitalized_ = await busquedas.historyCapitalized()
        historyCapitalized_.forEach((place, i) => {
          const index = `${i + 1}.`.green
          console.log(`${index} ${place}`)
        })
        break

      default:
        break
    }

    if (opt !== 0) await pause()
  } while (opt !== 0)
}

main()
