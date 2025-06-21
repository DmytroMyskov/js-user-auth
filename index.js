const { createServer } = require('http')
const server = createServer()
const port = process.env.PORT || 3000

server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`)
})

server.addListener('request', (req, res) => {
  res.end('Hello, World!\n')
})