const userList = document.getElementById('users')

const users = await getUsers()

showUsers()

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