import express from "express";
import dotenv from "dotenv";
dotenv.config();
import connectDb from "./config/Database.js";
import authRouter from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors"
import userRouter from "./routes/user.routes.js";
import geminiResponse from "./gemini.js";


const app = express();
app.use(cors({
    origin:"https://vs-frontend.onrender.com",
    credentials:true
}))

const port = process.env.PORT || 8080
app.use(express.json())
app.use(cookieParser())
app.use("/api/auth",authRouter)
app.use("/api/user",userRouter)


app.listen(port, ()=> {
    connectDb()
    console.log(`Server running on port: ${port}`)
})
