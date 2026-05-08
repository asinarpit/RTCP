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
import { initSocket } from "./sockets/socketManager"

import cors from "cors";

const app = express();

const server = http.createServer(app);


//middlewares
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(helmet())
app.use(morgan("dev"));

app.use("/api/auth", authRoutes)
app.use("/api/documents", documentRoutes)
app.use(errorHandler)


//socket.io init
const io = new Server(server, {
    cors:{
        origin: process.env.CLIENT_URL || "http://localhost:5173",
        methods: ["GET", "POST"]
    }
})


initSocket(io);

const PORT = process.env.PORT || 5000;

app.get("/",(req,res)=>{
    res.send("Server is running :)")
})


server.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
    
    // Keep Render alive
    const url = process.env.RENDER_EXTERNAL_URL;
    if (url) {
        console.log(`Self-pinging started for ${url}`);
        setInterval(() => {
            http.get(url, (res) => {
                console.log(`Self-ping status: ${res.statusCode}`);
            }).on('error', (err) => {
                console.error(`Self-ping error: ${err.message}`);
            });
        }, 10 * 60 * 1000); // Every 10 minutes
    }
})