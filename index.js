const { log } = require('console')
const { readFileSync } = require('fs')
const { createServer } = require('http')
const server = createServer()
const port = process.env.PORT || 3000
let nextId = 1
const users = [
  { id: nextId++, login: 'Bob', password: '1234' },
  { id: nextId++, login: 'Alice', password: '5678' },
  { id: nextId++, login: 'Charlie', password: 'abcd' },
]
const notes = [
  {
    id: nextId++,
    text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Culpa natus dignissimos vel maxime nobis esse quas nesciunt officia assumenda architecto atque, eveniet magni soluta explicabo harum consequuntur exercitationem possimus aliquid perspiciatis. Aperiam, minus doloremque? Commodi ex delectus quidem excepturi ducimus. Facilis nulla sint laudantium a laborum illo eius voluptas? Quis inventore voluptas earum temporibus eum ad tempore impedit laborum, quod reprehenderit, facere itaque, asperiores eius ducimus molestias obcaecati ex magni? Harum quam ab nemo similique deleniti! Mollitia, deserunt. Voluptatibus, vero natus itaque veritatis aperiam similique quas alias inventore, doloremque porro incidunt adipisci fugiat aspernatur eaque esse nihil placeat dicta fuga corrupti nostrum amet? Commodi laudantium non eligendi blanditiis quasi fugit labore omnis cum ea fugiat numquam ipsum voluptates suscipit modi nulla nisi, at itaque perferendis, voluptatum reiciendis eius beatae quis? Non voluptatibus corrupti dignissimos ad adipisci repellendus earum aspernatur at placeat optio in, totam asperiores, sequi quis veritatis suscipit quibusdam iure. Dolorem aspernatur iure in mollitia nihil, nemo eius! Quae odit quos beatae hic veniam minus eligendi quia voluptas earum, quis autem doloribus, doloremque in assumenda eum. Iusto aliquam facere ea earum architecto harum ad accusantium at nemo atque sapiente maiores, maxime magnam aliquid? Ducimus exercitationem laboriosam repellat unde quasi amet numquam, magnam adipisci ea enim, itaque harum reiciendis laborum nisi laudantium dolores, eaque qui. Odio nulla ducimus architecto excepturi necessitatibus dolore exercitationem veritatis molestiae explicabo sit minus fugit eaque quod, dolores, aperiam sint dignissimos dolor. Qui, ipsam quas omnis, unde expedita, doloribus ab eligendi atque iste sint numquam! Aut ea magni ipsam earum officia mollitia quam tempora, voluptatibus suscipit esse et eum nesciunt sequi quibusdam necessitatibus id ducimus saepe nostrum dolores. Qui obcaecati in explicabo, architecto repellat omnis cumque magni! Non cupiditate, magni a sint consequuntur quidem molestias ab minus voluptatum nesciunt explicabo atque fugit impedit rem, quas debitis.",
  },
  { id: nextId++, text: "I'm Bob, I love to code and teach others how to do it. I'm a full-stack developer with a passion for the web." },
  { id: nextId++, text: "I'm Alice, I'm a designer and I love to create beautiful and functional interfaces. I'm also a full-stack developer and I love to learn new things." },
]
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

async function handleApi(request, response) {
  response.setHeader('Content-Type', types.json)

  const { method, url } = request
  const route = url.replace('/api/', "")
  const endpoint = method + ':' + route

  switch (endpoint) {
    case 'GET:users':
      response.end(JSON.stringify(users))
      break

    case 'GET:notes':
      response.end(JSON.stringify(notes))
      break

    case 'POST:user':
      const { login, password } = await getBody(request)

      addUser(login, password)
      response.end(JSON.stringify({ success: true }))
      break

    case 'POST:note':
      const { text } = await getBody(request)

      addNote(text)
      response.end(JSON.stringify({ success: true }))
      break

    case 'DELETE:user': {
      const { id } = await getBody(request)

      deleteUser(id)
      response.end(JSON.stringify({ success: true }))
      break
    }

    case 'DELETE:note':
      const { id } = await getBody(request)

      deleteNote(id)
      response.end(JSON.stringify({ success: true }))
      break

    default:
      response.statusCode = 404
      response.end(JSON.stringify({ error: 'Incorrect endpoint' }))
  }
}

async function getBody(stream) {
  const chunks = []
  for await (const chunk of stream) {
    chunks.push(chunk)
  }
  return JSON.parse(Buffer.concat(chunks))
}

function addUser(login, password) {
  const user = { id: nextId++, login, password }
  users.push(user)
}

function addNote(text) {
  const note = { id: nextId++, text }
  notes.push(note)
}

function deleteUser(id) {
  const i = users.findIndex(user => user.id === id)
  if (i === -1) return
  users.splice(i, 1)
}

function deleteNote(id) {
  const i = notes.findIndex(note => note.id === id)
  if (i === -1) return
  notes.splice(i, 1)
}