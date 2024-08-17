import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
dotenv.config({});

const app = express();

//middle ware for authentic
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
const corsOptions = {
    origin: 'https//localhost:3000',
    credentials:true
}
app.use(cors(corsOptions));

const PORT = process.env.PORT || 4000 ;

app.listen(PORT,()=>{
    // connectDB();
    console.log(`Server running at port ${PORT}`);
})
