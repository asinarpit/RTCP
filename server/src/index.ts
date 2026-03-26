import express from "express"
import 'dotenv/config'
import {prisma} from './lib/prisma'
import http from "http"
import { Server } from "socket.io"
import helmet from "helmet"
import morgan from "morgan"
import { errorHandler } from "./middlewares/error.middleware"
import authRoutes from "./routes/authRoutes"
import documentRoutes from "./routes/documentRoutes";

const app = express();

const server = http.createServer(app);


//middlewares
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(helmet())
app.use(morgan("dev"));

app.use("/api/auth", authRoutes)
app.use("/api/documents", documentRoutes)
app.use(errorHandler)


//socke.io init
const io = new Server(server, {
    cors:{
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
})
const PORT = process.env.PORT || 5000;

app.get("/",(req,res)=>{
    res.send("Server is running :)")
})

server.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})