const newUserForm = document.getElementById('new-user')
const userList = document.getElementById('users')

const newNoteForm = document.getElementById('new-note')
const noteList = document.getElementById('notes')

let users = await getUsers()
let notes = await getNotes()

newUserForm.onsubmit = handleNewUserSubmit
userList.onclick = handleUserListClick

newNoteForm.onsubmit = handleNewNoteSubmit
noteList.onclick = handleNoteListClick

showUsers()
showNotes()

async function handleNewUserSubmit(e) {
  e.preventDefault()

  const login = newUserForm.login.value
  const password = newUserForm.password.value

  await addUser(login, password)

  newUserForm.reset()
  users = await getUsers()
  showUsers()
}

async function handleNewNoteSubmit(e) {
  e.preventDefault()

  const text = newNoteForm.text.value

  await addNote(text)

  newNoteForm.reset()
  notes = await getNotes()
  showNotes()
}

async function handleUserListClick(e) {
  if (e.target.tagName != "BUTTON") return

  const btn = e.target
  const item = btn.closest('li')
  const { id } = item.dataset

  await deleteUser(+id)

  users = await getUsers()
  showUsers()
}

async function handleNoteListClick(e) {
  if (e.target.tagName != "BUTTON") return

  const btn = e.target
  const item = btn.closest('li')
  const { id } = item.dataset

  await deleteNote(+id)

  notes = await getNotes()
  showNotes()
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

async function addNote(text) {
  const data = { text }
  const init = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(data),
  }

  return fetch('/api/note', init)
}

async function deleteUser(id) {
  const data = { id }
  const init = {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(data),
  }

  return fetch('/api/user', init)
}

async function deleteNote(id) {
  const data = { id }
  const init = {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(data),
  }

  return fetch('/api/note', init)
}

async function getUsers() {
  const response = await fetch('/api/users')
  return response.json()
}

async function getNotes() {
  const response = await fetch('/api/notes')
  return response.json()
}

function showUsers() {
  const items = []

  for (const user of users) {
    items.push(buildUserItem(user))
  }

  userList.replaceChildren(...items)
}

function showNotes() {
  const items = []

  for (const note of notes) {
    items.push(buildNoteItem(note))
  }

  noteList.replaceChildren(...items)
}

function buildUserItem(user) {
  const li = document.createElement('li')
  const btn = document.createElement('button')
  li.dataset.id = user.id
  btn.innerHTML = '&times;'
  li.append(user.login, ' ', btn)
  return li
}

function buildNoteItem(note) {
  const li = document.createElement('li')
  const details = document.createElement('details')
  const summary = document.createElement('summary')
  const p = document.createElement('p')
  const btn = document.createElement('button')
  li.dataset.id = note.id
  btn.innerHTML = '&times;'
  li.append(details, btn)
  details.append(summary, p)
  summary.append(note.text.slice(0, 80))
  p.append(note.text)
  return li
}