import config from "./src/config/config.js";
import app from "./src/app.js";
import connectDB from "./src/db/db.js";

connectDB();
app.listen(config.PORT,()=>{
    console.log(`Server is running on the PORT:${config.PORT}`)
})