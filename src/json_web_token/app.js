import express from 'express'
import bodyParser from 'body-parser'
import jwt from 'jsonwebtoken'

const app = express()

const SECRET_KEY = '&hs5Gbdfc$3sf'

const userList = [
  { account: 'xxx', password: 'xxx', email: 'xxx@qq.com' },
  { account: 'yyy', password: 'yyy', email: 'yyy@qq.com' },
]

app.use(express.static('./src/json_web_token/public'))
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.post('/login', (req, res) => {
  const user = userList.find(item => item.account === req.body.account)
  if (!user) {
    return res.send({ code: -1, msg: '用户不存在', data: null })
  } else if (user.password !== req.body.password) {
    return res.send({ code: -1, msg: '用户密码错误', data: null })
  } else {
    const user_info = { account: user.account, email: user.email }
    const access_token = jwt.sign(user_info, SECRET_KEY, { expiresIn: '1m' })
    const refresh_token = jwt.sign(user_info, SECRET_KEY, { expiresIn: '1d' })
    res.send({ code: 0, msg: '', data: { user_info, access_token, refresh_token } })
  }
})

app.get('/refresh', (req, res) => {
  const token = req.query.refresh_token
  if (!token) {
    return res.status(401).send('')
  }
  try {
    const result = jwt.verify(token, SECRET_KEY)
    const user_info = { account: result.account, email: result.email }
    const access_token = jwt.sign(user_info, SECRET_KEY, { expiresIn: '1m' })
    const refresh_token = jwt.sign(user_info, SECRET_KEY, { expiresIn: '1d' })
    res.send({ code: 0, msg: '', data: { user_info, access_token, refresh_token } })
  } catch (err) {
    res.status(401).send('')
  }
})

app.get('/need-login', (req, res) => {
  const token = req.header('Authorization')
  if (!token) {
    return res.status(401).send( '未登录')
  }
  try {
    const userInfo = jwt.verify(token.split(' ')[1], SECRET_KEY)
    res.send({ code: 0, msg: '', data: null })
  } catch (err) {
    res.status(401).send({ code: -1, msg: err.message, data: null })
  }
})

app.listen(8080, () => {
  console.log('json web token: http://localhost:8080')
})
