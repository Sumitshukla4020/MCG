// import { createClient } from "redis"

// const redisClient = createClient({
//   socket: {
//     host: process.env.REDIS_HOST,
//     port: parseInt(process.env.REDIS_PORT),
//     tls: true,
//     servername: process.env.REDIS_HOST
//   },
//   password: process.env.REDIS_PASSWORD
// })

// redisClient.on("error", (err) => {
//   console.error("Redis connection error:", err)
// })

// await redisClient.connect()

// export default redisClient
