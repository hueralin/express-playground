import express from 'express'
import session from 'express-session'

const sessionOpt = {
  name: 'sid', // cookie 名字，默认是 connect.sid。
  secret: '7y6G*!!xb8.$',
  resave: false, // 强制将会话保存回会话存储，即使会话在请求期间从未被修改。
  saveUninitialized: false, // 强制将 “未初始化” 的会话保存到存储中。当会话是新的但未修改时，它是未初始化的。
  cookie: {
    maxAge: 60 * 1000 // 60s 过期
  }
}

const app = express()

// app.set('trust proxy', 1) // trust first proxy
app.use(session(sessionOpt))

app.get('/', (req, res) => {
  if (req.session.views) {
    req.session.views++
    res.setHeader('Content-Type', 'text/html')
    res.write('<p>views: ' + req.session.views + '</p>')
    res.write('<p>expires in: ' + (req.session.cookie.maxAge / 1000) + 's</p>')
    res.end()
  } else {
    req.session.views = 1
    res.send('welcome to the session demo. refresh!')
  }
})

app.listen(8080, () => {
  console.log('cookie session: http://localhost:8080')
})
