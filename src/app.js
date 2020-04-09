const express = require('express')
const cors = require('cors')
const { uuid } = require('uuidv4')

const app = express()

app.use(express.json())
app.use(cors())

const repositories = []

function verifyIsArray(request, response, next) {
  const { techs } = request.body

  if (Array.isArray(techs)) {
    next()
  }

  response.status(400)
  return response.json({ message: 'The techs field needs to be an array :)' })
}

app.get('/repositories', (request, response) => {
  response.status(200)
  return response.json({ repositories })
})

app.post('/repositories', verifyIsArray, (request, response) => {
  const { title, url, techs } = request.body

  console.log(title, url, techs)
  if (title && url && techs) {
    const repository = {
      id: uuid(),
      title: title,
      url: url,
      techs: techs,
      likes: 0,
    }
    repositories.push(repository)
    response.status(200)
    return response.json(repository)
  }

  response.status(400)
  return response.json({ message: 'Fill the requested fields!' })
})

app.put('/repositories/:id', (request, response) => {
  // TODO
})

app.delete('/repositories/:id', (req, res) => {
  // TODO
})

app.post('/repositories/:id/like', (request, response) => {
  // TODO
})

module.exports = app
