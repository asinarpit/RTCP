"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("dotenv/config");
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const error_middleware_1 = require("./middlewares/error.middleware");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const documentRoutes_1 = __importDefault(require("./routes/documentRoutes"));
const socketManager_1 = require("./sockets/socketManager");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
//middlewares
app.use((0, cors_1.default)({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, helmet_1.default)());
app.use((0, morgan_1.default)("dev"));
app.use("/api/auth", authRoutes_1.default);
app.use("/api/documents", documentRoutes_1.default);
app.use(error_middleware_1.errorHandler);
//socket.io init
const io = new socket_io_1.Server(server, {
    cors: {
        origin: process.env.CLIENT_URL || "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});
(0, socketManager_1.initSocket)(io);
const PORT = process.env.PORT || 5000;
app.get("/", (req, res) => {
    res.send("Server is running :)");
});
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    // Keep Render alive
    const url = process.env.RENDER_EXTERNAL_URL;
    if (url) {
        console.log(`Self-pinging started for ${url}`);
        setInterval(() => {
            http_1.default.get(url, (res) => {
                console.log(`Self-ping status: ${res.statusCode}`);
            }).on('error', (err) => {
                console.error(`Self-ping error: ${err.message}`);
            });
        }, 10 * 60 * 1000); // Every 10 minutes
    }
});
