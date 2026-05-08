"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initSocket = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = require("../lib/prisma");
const Y = __importStar(require("yjs"));
const ACTIVE_DOCS = new Map();
const SAVE_TIMEOUTS = new Map();
//function to save docs to db
const persistDoc = async (documentId, ydoc) => {
    try {
        //encoding current server state as binary update
        const stateUpdate = Y.encodeStateAsUpdate(ydoc);
        await prisma_1.prisma.document.update({
            where: { id: documentId },
            data: { content: Buffer.from(stateUpdate) }
        });
        console.log(`Doc ${documentId} saved to db`);
    }
    catch (err) {
        console.log(err);
    }
};
const initSocket = (io) => {
    //jwt auth middleware
    io.use((socket, next) => {
        //for postman testing
        const token = socket.handshake.headers.token || socket.handshake.auth.token;
        if (!token) {
            return next(new Error("Authentication error: No token provided"));
        }
        try {
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            console.log("Decoded: ", decoded);
            socket.data.userId = decoded.id;
            next();
        }
        catch (err) {
            next(new Error("Authentication error: Inavalid token"));
        }
    });
    //connection handler
    io.on("connection", (socket) => {
        console.log("User connected:", socket.data.userId);
        //join document room
        socket.on("join-document", async (documentId) => {
            const doc = await prisma_1.prisma.document.findUnique({
                where: { id: documentId }
            });
            if (!doc) {
                socket.emit("error", "Document not found");
                return;
            }
            if (doc.ownerId !== socket.data.userId) {
                socket.emit("error", "Forbidden: You do not have access to this document");
                return;
            }
            let ydoc = ACTIVE_DOCS.get(documentId);
            if (!ydoc) {
                ydoc = new Y.Doc();
                if (doc.content) {
                    Y.applyUpdate(ydoc, new Uint8Array(doc.content));
                }
                ACTIVE_DOCS.set(documentId, ydoc);
            }
            socket.join(documentId);
            console.log(`user ${socket.data.userId} joined document ${documentId}`);
            const initialContent = doc.content || Y.encodeStateAsUpdate(ydoc);
            socket.emit("load-document", initialContent);
        });
        //syncing binary updates 
        socket.on("sync-update", (data) => {
            socket.to(data.documentId).emit("sync-update", data.update);
            let ydoc = ACTIVE_DOCS.get(data.documentId);
            if (!ydoc) {
                ydoc = new Y.Doc();
                ACTIVE_DOCS.set(data.documentId, ydoc);
            }
            Y.applyUpdate(ydoc, new Uint8Array(data.update));
            if (SAVE_TIMEOUTS.has(data.documentId)) {
                clearTimeout(SAVE_TIMEOUTS.get(data.documentId));
            }
            const timeout = setTimeout(() => {
                //save to prisma after 3secs of inacitvity
                persistDoc(data.documentId, ydoc);
                SAVE_TIMEOUTS.delete(data.documentId);
            }, 3000);
            SAVE_TIMEOUTS.set(data.documentId, timeout);
            console.log("Message broadcasted successfuly");
        });
        //awareness
        socket.on("awareness-update", (data) => {
            socket.to(data.documentId).emit("awareness-update", data.update);
        });
        //disconnection - RAM eviction
        socket.on("disconnecting", () => {
            socket.rooms.forEach((roomId) => {
                if (roomId === socket.id)
                    return;
                const room = io.sockets.adapter.rooms.get(roomId);
                if (room && room.size === 1) {
                    console.log(`Last user leaving document ${roomId} ... flushing to DB and freeing RAM`);
                    const ydoc = ACTIVE_DOCS.get(roomId);
                    if (ydoc) {
                        if (SAVE_TIMEOUTS.has(roomId)) {
                            clearTimeout(SAVE_TIMEOUTS.get(roomId));
                            SAVE_TIMEOUTS.delete(roomId);
                        }
                        persistDoc(roomId, ydoc);
                        ydoc.destroy();
                        ACTIVE_DOCS.delete(roomId);
                    }
                }
            });
        });
        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.data.userId);
        });
    });
};
exports.initSocket = initSocket;
