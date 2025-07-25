import { createClient } from "redis";

const redis = createClient({
  socket: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT),
    tls: {}  // Required for Redis Cloud
  },
  password: process.env.REDIS_PASSWORD
});

redis.on("error", (err) => {
  console.error("Redis connection error:", err);
});

await redis.connect();

console.log("Redis connected");

export default redis;