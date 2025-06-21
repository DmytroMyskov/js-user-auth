const users = [
  { id: 1, login: 'Bob', password: '1234' },
  { id: 2, login: 'Alice', password: '5678' },
  { id: 3, login: 'Charlie', password: 'abcd' },
]
const userList = document.getElementById('users')

showUsers()

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