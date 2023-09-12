import express from 'express'
import QrCode from 'qrcode'

const app = express()

const qrcodeMap = new Map()

app.use(express.static('./src/qrcode/public'))

// 生成二维码
app.get('/qrcode/generate', async(req, res) => {
  const qrcodeId = Date.now()
  console.log('qrcodeId: ', qrcodeId)
  const dataUrl = await QrCode.toDataURL(`http://192.168.20.78:8080/confirm.html?id=${qrcodeId}`)
  // 将生成的二维码信息存一份
  qrcodeMap.set(qrcodeId, { status: 'noscan', userInfo: undefined })
  res.send({ code: 0, msg: '', data: { qrcode_id: qrcodeId, data_url: dataUrl } })
})

// 检查二维码状态
app.get('/qrcode/check', (req, res) => {
  const qrcodeInfo = qrcodeMap.get(Number(req.query.id))
  if (!qrcodeInfo) {
    return res.send({ code: -1, msg: '二维码已过期', data: null })
  }
  res.send({ code: 0, msg: '', data: { status: qrcodeInfo.status } })
})

// 扫描二维码
app.get('/qrcode/scan', (req, res) => {
  const qrcodeInfo = qrcodeMap.get(Number(req.query.id))
  if (!qrcodeInfo) {
    return res.send({ code: -1, msg: '二维码已过期', data: null })
  }
  qrcodeInfo.status = 'scan-wait-confirm'
  res.send({ code: 0, msg: '', data: null })
})

// 确认登录
app.get('/qrcode/confirm', (req, res) => {
  const qrcodeInfo = qrcodeMap.get(Number(req.query.id))
  if (!qrcodeInfo) {
    return res.send({ code: -1, msg: '二维码已过期', data: null })
  }
  qrcodeInfo.status = 'scan-confirm'
  res.send({ code: 0, msg: '', data: null })
})

// 取消登录
app.get('/qrcode/cancel', (req, res) => {
  const qrcodeInfo = qrcodeMap.get(Number(req.query.id))
  if (!qrcodeInfo) {
    return res.send({ code: -1, msg: '二维码已过期', data: null })
  }
  qrcodeInfo.status = 'scan-cancel'
  res.send({ code: 0, msg: '', data: null })
})

app.listen(8080, () => {
  console.log('qrcode: http://localhost:8080')
})
