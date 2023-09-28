import express from 'express'

const app = express()

app.use(express.static('./src/server_send_event/public'))

app.get('/sse', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Connection', 'keep-alive')
  res.setHeader('Cache-Control', 'no-cache')

  // res.send('data: hello\n')
  // 会报错：Cannot set headers after they are sent to the client
  // 原因：https://stackoverflow.com/questions/7042340/error-cant-set-headers-after-they-are-sent-to-the-client
  // res.send('data: server send event\n\n')
  // 解决方法如下
  res.writeHead(200)
  res.write('data: hello\n')
  res.write('data: server send event\n\n')

  let interval = setInterval(() => {
    res.write('data: ' + Date.now() + '\n\n')
  }, 1000)

  req.on('close', () => {
    clearInterval(interval)
    console.log('close sse connect')
  })
})

app.listen(8080, () => {
  console.log('server send event: http://localhost:8080')
})
