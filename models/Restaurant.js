// require mongoose and construct schema
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const restaurantSchema = new Schema ({
  name: {
    type: String, required: true
  },
  name_en: {
    type: String
  },
  category: {
    type: String, required: true
  },
  image: {
    type: String, required: true
  },
  location: {
    type: String, required: true
  },
  phone: {
    type: String
  },
  google_map: {
    type: String
  },
  rating: {
    type: Number
  },
  description: {
    type: String
  },
})

// export Restaurant model
module.exports = mongoose.model('Restaurant', restaurantSchema)