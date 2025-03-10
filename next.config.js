module.exports = {
    output : 'standalone',
    env: {
        MONGO_URI: process.env.MONGODB_URI,
      },
}