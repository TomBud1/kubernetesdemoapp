module.exports = {
    redisHost: 'redis-service',
    redisPort: 6379,
    pgHost: 'postgres-service',
    pgUser: process.env.POSTGRES_USER,
    pgPassword: process.env.POSTGRES_PASSWORD
}