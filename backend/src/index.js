import dotenv from "dotenv";
import connectDB from "./config/db.js"; 
import app from "./app.js";
//import redis from "./config/redis.js" 

dotenv.config({ path: "./.env" }); 

connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000, ()=>{
        console.log(`server is running on port ${process.env.PORT}`);
    })
})
.catch((err)=>{
    console.log("Mongobd connection failed", err)
})

//export { redis }


