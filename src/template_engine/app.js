import express from 'express'
import url from 'node:url'
import path from 'node:path'

const __filename = url.fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

// 设置模板引擎
app.set('view engine', 'ejs')
// 设置模板位置
app.set('views', path.join(__dirname, './views'))

app.get('/', (req, res) => {
  const list = [
    { id: 1, name: 'Tom', sex: 0 },
    { id: 2, name: 'Khan', sex: 1 },
    { id: 3, name: 'Jack', sex: 1 },
  ]
  res.render('index', { title: 'Ejs', list })
})

app.get('/about', (req, res) => {
  res.render('about')
})

app.listen(8080, () => {
  console.log('template engine: http://localhost:8080')
})
