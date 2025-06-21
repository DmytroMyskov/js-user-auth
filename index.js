const { log } = require('console')
const { readFileSync } = require('fs')
const { createServer } = require('http')
const server = createServer()
const port = process.env.PORT || 3000
const users = [
  { id: 1, login: 'Bob', password: '1234' },
  { id: 2, login: 'Alice', password: '5678' },
  { id: 3, login: 'Charlie', password: 'abcd' },
]
global.users = users
const types = {
  html: 'text/html; charset=utf-8',
  css: 'text/css; charset=utf-8',
  js: 'application/javascript; charset=utf-8',
  json: 'application/json; charset=utf-8',
  "": 'text/plain; charset=utf-8',
}

server.listen(port, () => log(`Server at http://localhost:${port}`))

server.addListener('request', handleRequest)

function handleRequest(request, response) {
  const dataRequest = request.url.startsWith('/api/')

  if (!dataRequest) {
    serveFile(request, response)
  } else {
    handleApi(request, response)
  }
}

function serveFile(request, response) {
  const path = request.url.slice(1) || 'index.html'

  console.log(path)

  try {
    const fileContent = readFileSync(path)
    const i = path.lastIndexOf('.') + 1
    const ext = !i ? "" : path.slice(i)
    response.setHeader('Content-Type', types[ext])
    response.end(fileContent)
  } catch (error) {
    response.statusCode = 404
    response.end(error.message)
  }
}

function handleApi(request, response) {
  response.setHeader('Content-Type', types.json)
  response.end(JSON.stringify(users))
}