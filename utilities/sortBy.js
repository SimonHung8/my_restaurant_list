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

module.exports = sortBy