function getRandomRestaurants(restaurantArray, quantity) {
  if (restaurantArray.length < quantity) return
  const randomRestaurants = []
  for (let i = 0; i < quantity; i++) {
    const randomIndex = Math.floor(Math.random() * restaurantArray.length)
    randomRestaurants.push(restaurantArray.splice(randomIndex, randomIndex + 1)[0])
  }
  return randomRestaurants
}

module.exports = getRandomRestaurants