// const inquirer = require('inquirer')
import inquirer from 'inquirer'
import 'colors'

const questions = [
  {
    type: 'list',
    name: 'option',
    message: 'What needs to be done?',
    choices: [
      { value: 1, name: `${'1.'.green} Find city` },
      { value: 2, name: `${'2.'.green} History ` },
      { value: 0, name: `${'0.'.green} Exit` },
    
    ]
  }
]

export const listPlaces = async (sites = []) => {
  const choices = sites.map((place, id) => {
    return {
      value: place.id,
      name: `${(id + 1).toString().green} ${place.name}`
    }
  })

  choices.unshift({
    value: '0',
    name: '0 '.green + 'Cancel'
  })

  const questionsTaskToDelete = [
    {
      type: 'list',
      name: 'id',
      message: 'Select place',
      choices
    }
  ]

  const { id } = await inquirer.prompt(questionsTaskToDelete)
  return id
}

export const showListCheckList = async (tareas = []) => {
  const choices = tareas.map((tarea, id) => {
    return {
      value: tarea.id,
      name: `${(id + 1).toString().green} ${tarea.desc}`,
      checked: tarea.completadoEn ? true : false
    }
  })

  const question = [
    {
      type: 'checkbox',
      name: 'ids',
      message: 'Seleecione',
      choices
    }
  ]

  const { ids } = await inquirer.prompt(question)
  return ids
}

export const confirmDeleteTask = async (message) => {
  const question = [
    {
      type: 'confirm',
      name: 'ok',
      message
    }
  ]
  const { ok } = await inquirer.prompt(question)
  return ok
}

export const inquirerMenu = async () => {
  //   console.clear()

  console.log('**********************************'.green)
  console.log('       Select a option       '.green)
  console.log('**********************************\n'.green)

  const { option } = await inquirer.prompt(questions)
  return option
}

export const pause = async () => {
  console.log('\n')
  const opt = await inquirer.prompt([
    {
      type: 'input',
      name: 'enter',
      message: `Presione ${'ENTER'.green} para continuar`
    }
  ])
}

export const leerInput = async (message) => {
  const question = [
    {
      type: 'input',
      name: 'desc',
      message,
      validate(value) {
        if (value.length === 0) {
          return 'Por favor ingresar un valor'
        }
        return true
      }
    }
  ]

  const { desc } = await inquirer.prompt(question)
  return desc
}
