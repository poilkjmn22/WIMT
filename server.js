var express = require('express')
var app = express()

app.get('/WIMTList', (req, res) => {
  res.json(require('./json/WIMTList.json'))
})
app.listen(8091)
