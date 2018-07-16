var express = require('express')

var app = express()

app.use(express.static(__dirname + '/../client'))
app.use('/scripts', express.static(__dirname + '/../node_modules'))



app.listen(3000, () => {
  console.log(__dirname)
})