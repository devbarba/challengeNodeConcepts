const express = require('express')
const cors = require('cors')
const { uuid, isUuid } = require('uuidv4')

const app = express()

app.use(express.json())
app.use(cors())

let repositories = []

function verifyIsArray(request, response, next) {
  const { techs } = request.body

  if (!Array.isArray(techs)) {
    return response
      .status(400)
      .json({ message: 'The techs field needs to be an array :)' })
  }

  return next()
}

function verifyIsUuid(request, response, next) {
  const { id } = request.params

  if (!isUuid(id)) {
    return response.status(400).json({ message: 'The Uuid is not valid :(' })
  }

  return next()
}

app.use('/repositories/:id', verifyIsUuid)

app.get('/repositories', (request, response) => {
  return response.status(200).json({ repositories })
})

app.post('/repositories', verifyIsArray, (request, response) => {
  const { title, url, techs } = request.body

  if (!(title && url && techs)) {
    return response.status(400).json({ message: 'Fill the requested fields!' })
  }

  const repository = {
    id: uuid(),
    title: title,
    url: url,
    techs: techs,
    likes: 0,
  }

  repositories.push(repository)

  return response.status(200).json(repository)
})

app.put('/repositories/:id', (request, response) => {
  const { id } = request.params
  const { url, title, techs } = request.body

  const uuid = repositories.findIndex((element) => element.id === id)

  if (uuid < 0) {
    return response.status(400).json({ message: 'Repository not found!' })
  }

  repositories[uuid].url = url
  repositories[uuid].title = title
  repositories[uuid].techs = techs

  return response.status(200).json(repositories[uuid])
})

app.delete('/repositories/:id', (request, response) => {
  const { id } = request.params

  const uuid = repositories.findIndex((element) => element.id === id)

  if (uuid < 0) {
    return response.status(400).json({ message: 'Repository not found!' })
  }

  repositories.splice(uuid, 1)

  return response.status(204).send()
})

app.post('/repositories/:id/like', (request, response) => {
  const { id } = request.params

  const uuid = repositories.findIndex((element) => element.id === id)

  if (uuid < 0) {
    return response.status(400).json({ message: 'Repository not found!' })
  }

  repositories[uuid].likes++

  return response.status(200).json(repositories[uuid])
})

module.exports = app
