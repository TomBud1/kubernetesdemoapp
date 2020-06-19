module.exports = {
    redisHost: 'redis-service',
    redisPort: 6379,
    pgHost: 'postgres-service',
    pgUser: process.env.PGUSER,
    pgPassword: process.env.PGPASSWORD
}