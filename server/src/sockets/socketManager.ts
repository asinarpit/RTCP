import { Server, Socket } from "socket.io"
import jwt from "jsonwebtoken"
import { prisma } from "../lib/prisma"

export const initSocket = (io: Server) => {
    //jwt auth middleware
    io.use((socket, next) => {
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
            //checking if user has access to doc
            const doc = await prisma.document.findUnique({
                where: { id: documentId }
            });

            if (!doc) {
                socket.emit("error", "Document not found");
                return;
            }

            //adding user to private document room
            socket.join(documentId);
            console.log(`user ${socket.data.userId} joined document ${documentId}`);

            //sending binary content from database to this user
            if (doc.content) {
                socket.emit("load-document", doc.content);
            }
        });

        //syncing binary updates 
        socket.on("sync-update", (data: { documentId: string, update: Uint8Array }) => {
            socket.to(data.documentId).emit("sync-update", data.update);
            console.log("Message broadcasted successfuly")
        });


        //disconnection
        socket.on("disconnect", () => {
            console.log("User disconnected: ", socket.data.userId);
        })
    })
}