const { log } = require('console')
const { readFileSync } = require('fs')
const { createServer } = require('http')
const server = createServer()
const port = process.env.PORT || 3000

server.listen(port, () => log(`Server at http://localhost:${port}`))

server.addListener('request', handleRequest)

function handleRequest(request, response) {
  const path = request.url.slice(1) || 'index.html'

  console.log(path)

  try {
    const fileContent = readFileSync(path)

    response.end(fileContent)
  } catch (error) {
    response.statusCode = 404
    response.end(error.message)
  }
}