import express from 'express'
import mime from 'mime'
import path from 'node:path'
import fs from 'node:fs'

const app = express()

app.use(express.static('./src/content_type/public'))

// 旧方法
app.get('/download/:filename', (req, res) => {
	const filePath = `./src/content_type/download/${req.params.filename}`
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      res.status(404).send('File Not Found')
    } else {
      const filename = path.basename(filePath)
      const mimeType = mime.getType(path.extname(filePath))
      res.setHeader('Content-Disposition', `attachment; filename=${filename}`)
      res.setHeader('Content-Type', mimeType)
      const fr = fs.createReadStream(filePath)
      fr.pipe(res)
    }
  })
})

// 新方法
app.get('/download2/:filename', (req, res) => {
  const filePath = `./src/content_type/download/${req.params.filename}`
  res.download(filePath)
})

app.listen(8080, () => {
  console.log('server send event: http://localhost:8080')
})
