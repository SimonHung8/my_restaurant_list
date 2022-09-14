// require packages used in the project
const express = require('express')

const app = express()
const port = 3000

// routes setting
app.get('/', (req, res) => {
  res.send('index page')
})

// start and listen on the server
app.listen(port, () => {
  console.log(`Express is listening on http://localhost:${port}`)
})