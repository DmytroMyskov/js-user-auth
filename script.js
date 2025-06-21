const form = document.getElementById('new-user')
const userList = document.getElementById('users')

let users = await getUsers()

form.onsubmit = handleSubmit

showUsers()

async function handleSubmit(e) {
  e.preventDefault()

  const login = form.login.value
  const password = form.password.value

  await addUser(login, password)

  form.reset()
  users = await getUsers()
  showUsers()
}

async function addUser(login, password) {
  const data = { login, password }
  const init = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(data),
  }

  return fetch('/api/user', init)
}

async function getUsers() {
  const respone = await fetch('/api/users')
  return respone.json()
}

function showUsers() {
  const items = []

  for (const user of users) {
    items.push(buildUserItem(user))
  }

  userList.replaceChildren(...items)
}

function buildUserItem(user) {
  const li = document.createElement('li')
  li.append(user.login)
  return li
}