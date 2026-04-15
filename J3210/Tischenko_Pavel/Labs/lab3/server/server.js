import express from 'express'
import cors from 'cors'
import jsonServer from 'json-server'
import { nanoid } from 'nanoid'
import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const dbPath = path.join(__dirname, 'db.json')

const app = express()
app.use(cors({ origin: 'http://localhost:8080' }))
app.use(express.json())

const router = jsonServer.router(dbPath)
const middlewares = jsonServer.defaults()
app.use(middlewares)

function createToken(user) {
  const payload = {
    sub: user.id,
    role: user.role,
    email: user.email,
    iat: Date.now()
  }
  return Buffer.from(JSON.stringify(payload)).toString('base64url')
}

function parseToken(token) {
  try {
    const raw = Buffer.from(token, 'base64url').toString('utf-8')
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function getAuth(req) {
  const header = req.headers.authorization || ''
  const [, token] = header.split(' ')
  if (!token) return null
  return parseToken(token)
}

function requireAuth(req, res, next) {
  const payload = getAuth(req)
  if (!payload?.sub) {
    return res.status(401).json({ message: 'Требуется авторизация.' })
  }
  req.user = payload
  return next()
}

function requireRole(role) {
  return (req, res, next) => {
    const payload = getAuth(req)
    if (!payload?.sub) {
      return res.status(401).json({ message: 'Требуется авторизация.' })
    }
    if (payload.role !== role) {
      return res.status(403).json({ message: 'Недостаточно прав.' })
    }
    req.user = payload
    return next()
  }
}

function allowReadElseRole(role) {
  return (req, res, next) => {
    if (req.method === 'GET') return next()
    return requireRole(role)(req, res, next)
  }
}

function normalizeRole(input) {
  if (input === 'teacher') return 'trainer'
  return input
}

async function readDb() {
  const raw = await readFile(dbPath, 'utf-8')
  return JSON.parse(raw)
}

async function writeDb(data) {
  await writeFile(dbPath, JSON.stringify(data, null, 2), 'utf-8')
}

app.post('/api/auth/register', async (req, res) => {
  const { name, firstName, lastName, email, password } = req.body || {}
  const role = normalizeRole(req.body?.role)
  if (!email || !password || !role) {
    return res.status(400).json({ message: 'Заполните все поля.' })
  }
  if (!['student', 'trainer'].includes(role)) {
    return res.status(400).json({ message: 'Некорректная роль.' })
  }

  const db = await readDb()
  const exists = db.users.find((u) => u.email.toLowerCase() === String(email).toLowerCase())
  if (exists) {
    return res.status(409).json({ message: 'Пользователь с таким email уже существует.' })
  }

  const user = {
    id: nanoid(10),
    firstName: String(firstName || name || '').trim(),
    lastName: String(lastName || '').trim(),
    email: String(email).trim().toLowerCase(),
    password: String(password),
    role
  }
  db.users.push(user)
  await writeDb(db)

  const token = createToken(user)
  return res.status(201).json({
    token,
    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role
    }
  })
})

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body || {}
  const role = normalizeRole(req.body?.role)
  if (!email || !password || !role) {
    return res.status(400).json({ message: 'Заполните email, пароль и роль.' })
  }

  const db = await readDb()
  const user = db.users.find(
    (u) =>
      u.email.toLowerCase() === String(email).toLowerCase() &&
      u.password === String(password) &&
      u.role === role
  )

  if (!user) {
    return res.status(401).json({ message: 'Неверные данные для входа.' })
  }

  const token = createToken(user)
  return res.json({
    token,
    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role
    }
  })
})

app.get('/api/auth/me', requireAuth, async (req, res) => {
  const db = await readDb()
  const user = db.users.find((u) => u.id === req.user.sub)
  if (!user) {
    return res.status(404).json({ message: 'Пользователь не найден.' })
  }
  return res.json({
    id: user.id,
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    email: user.email,
    role: user.role
  })
})

app.use('/api/enrollments', requireAuth)
app.use('/api/certificates', requireAuth)
app.use('/api/courses', allowReadElseRole('trainer'))
app.use('/api/materials', allowReadElseRole('trainer'))
app.use('/api/lessons', allowReadElseRole('trainer'))
app.use('/api/assignments', allowReadElseRole('trainer'))

app.use('/api', router)

app.listen(3001, () => {
  console.log('Lab3 API started on http://localhost:3001')
})
