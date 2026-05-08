import { Server, Socket } from "socket.io"
import jwt from "jsonwebtoken"
import { prisma } from "../lib/prisma"
import * as Y from "yjs"

const ACTIVE_DOCS = new Map<string, Y.Doc>();
const SAVE_TIMEOUTS = new Map<string, NodeJS.Timeout>();


//function to save docs to db
const persistDoc = async (documentId: string, ydoc: Y.Doc) => {
    try {

        //encoding current server state as binary update
        const stateUpdate = Y.encodeStateAsUpdate(ydoc);

        await prisma.document.update({
            where: { id: documentId },
            data: { content: Buffer.from(stateUpdate) }
        });

        console.log(`Doc ${documentId} saved to db`);

    } catch (err) {
        console.log(err);
    }
}

export const initSocket = (io: Server) => {
    //jwt auth middleware
    io.use((socket: any, next: (err?: Error) => void) => {
        //for postman testing
        const token = socket.handshake.headers.token || socket.handshake.auth.token;
        if (!token) {
            return next(new Error("Authentication error: No token provided"))
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;
            console.log("Decoded: ", decoded);
            socket.data.userId = decoded.id;
            next();
        } catch (err) {
            next(new Error("Authentication error: Inavalid token"))
        }
    });


    //connection handler
    io.on("connection", (socket: Socket) => {
        console.log("User connected:", socket.data.userId);

        //join document room
        socket.on("join-document", async (documentId: string) => {
            const doc = await prisma.document.findUnique({
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
        socket.on("sync-update", (data: { documentId: string, update: Uint8Array }) => {
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
                persistDoc(data.documentId, ydoc!);
                SAVE_TIMEOUTS.delete(data.documentId);
            }, 3000);
            SAVE_TIMEOUTS.set(data.documentId, timeout);

            console.log("Message broadcasted successfuly")
        });

        //awareness
        socket.on("awareness-update", (data: { documentId: string, update: Uint8Array }) => {
            socket.to(data.documentId).emit("awareness-update", data.update);
        });


        //disconnection - RAM eviction
        socket.on("disconnecting", () => {
            socket.rooms.forEach((roomId: string) => {
                if (roomId === socket.id) return;

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
}
