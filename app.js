// require packages used in the project
const express = require('express')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const Restaurant = require('./models/Restaurant')

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

// setting static css file and body-parser
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))

// routes setting
app.get('/', (req, res) => {
  const sort = req.query.sort
  const homePage = true
  Restaurant.find()
    .lean()
    .sort(sortBy(sort))
    .then(restaurants => {
      res.render('index', { restaurants, homePage })
    })
    .catch(err => console.log(err))
})

app.get('/search', (req, res) => {
  const keyword = req.query.keyword
  Restaurant.find()
    .lean()
    .then(restaurants => {
      const filteredRestaurants = restaurants.filter(restaurant => {
        return trimmed(restaurant.name).includes(trimmed(keyword)) ||
          trimmed(restaurant.category).includes(trimmed(keyword))
      })
      const cannotFind = filteredRestaurants.length ? false : true
      const resultRestaurants = filteredRestaurants.length ? filteredRestaurants : getRandomRestaurants(restaurants, 3)
      res.render('index', { restaurants: resultRestaurants, keyword, cannotFind })
    })
    .catch(err => console.log(err))
})

app.get('/restaurants/new', (req, res) => {
  res.render('new')
})

app.post('/restaurants', (req, res) => {
  Restaurant.create(req.body)
    .then(() => res.redirect('/'))
    .catch(err => console.log(err))
})

app.get('/restaurants/:id', (req, res) => {
  const id = req.params.id
  Restaurant.findById(id)
    .lean()
    .then(restaurant => res.render('show', { restaurant }))
    .catch(err => console.log(err))
})

app.get('/restaurants/:id/edit', (req, res) => {
  const id = req.params.id
  Restaurant.findById(id)
    .lean()
    .then(restaurant => res.render('edit', { restaurant }))
    .catch(err => console.log(err))
})

app.post('/restaurants/:id/edit', (req, res) => {
  const id = req.params.id
  Restaurant.findByIdAndUpdate(id, req.body)
    .then(() => res.redirect(`/restaurants/${id}`))
    .catch(err => console.log(err))
})

app.post('/restaurants/:id/delete', (req, res) => {
  const id = req.params.id
  Restaurant.findById(id)
    .then(restaurant => restaurant.remove())
    .then(() => res.redirect('/'))
    .catch(err => console.log(err))
})

// start and listen on the server
app.listen(port, () => {
  console.log(`Express is listening on http://localhost:${port}`)
})

// function
function trimmed(str) {
  return str.replace(/\s*/g, "").toLowerCase()
}

function getRandomRestaurants(restaurantArray, quantity) {
  if (restaurantArray.length < quantity) return
  const randomRestaurants = []
  for (let i = 0; i < quantity; i++) {
    const randomIndex = Math.floor(Math.random() * restaurantArray.length)
    randomRestaurants.push(restaurantArray.splice(randomIndex, randomIndex + 1)[0])
  }
  return randomRestaurants
}

function sortBy(sort) {
  switch (sort) {
    case 'name-asc':
      return { name: 'asc' }
    case 'name-desc':
      return { name: 'desc' }
    case 'category':
      return { category: 'asc' }
    case 'location':
      return { location: 'asc' }
  }
}