import path from 'node:path'
import url from 'node:url'
import express from 'express'
import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'

const __filename = url.fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const userList = [
  { username: 'tom', password: '123456' },
]

const app = express()
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.json())

// 初始化 passport
app.use(passport.initialize())
// 定义策略
passport.use('login', new LocalStrategy({}, (username, password, done) => {
  console.log('username: ', username)
  console.log('password: ', password)
  const user = userList.find(item => item.username === username)
  if (!user) return done(null, false)
  if (user.password !== password) return done(null, false)
  return done(null, user)
}))

app.get('/login', (req, res) => {
  console.log('render login page')
  res.render('login')
})

// TODO: 测试失败，一直 failure，且 verifyCallback 没执行
app.post('/login', passport.authenticate('login', {
  successRedirect: '/profile',
  failureRedirect: '/login'
}))

app.listen(8080, () => {
  console.log('passport-local: http://localhost:8080')
})
