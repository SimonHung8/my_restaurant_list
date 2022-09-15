// require packages used in the project
const express = require('express')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')

const app = express()
const port = 3000

// connect MongoDB via mongoose
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection
db.on('error', () => {
  console.log('MongoDB connection error')
})
db.once('open', () => {
  console.log('MongoDB connected!')
})

// setting template engine
app.engine('hbs', exphbs.engine({ defaultLayout: 'main', extname: 'hbs' }))
app.set('view engine', 'hbs')

// routes setting
app.get('/', (req, res) => {
  res.render('index')
})

// start and listen on the server
app.listen(port, () => {
  console.log(`Express is listening on http://localhost:${port}`)
})