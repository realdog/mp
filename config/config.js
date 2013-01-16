module.exports = {
    development: {
      root: require('path').normalize(__dirname + '/..'),
      app: {
        name: 'mp'
      },
      db: 'mongodb://localhost/mp'
    }
  , test: {
      root: require('path').normalize(__dirname + '/..'),
      app: {
        name: 'mp'
      },
      db: 'mongodb://localhost/mp'
    }
  , production: {
      root: require('path').normalize(__dirname + '/..'),
      app: {
        name: 'mp'
      },
      db: 'mongodb://localhost/mp'
    }
}