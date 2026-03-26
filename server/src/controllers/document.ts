import { Response } from "express"
import { AuthRequest } from "../types/auth-request";
import { prisma } from "../lib/prisma"

const createDocument = async (req: AuthRequest, res: Response) => {
    try {
        const { title = "Untitled Document" } = req.body;
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const document = await prisma.document.create({
            data: {
                title,
                owner: { connect: { id: userId } }
            }
        })

        return res.status(201).json({
            message: "Document created successfully",
            document
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

const listMyDocuments = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({
                message: "Unauthorized"
            })
        }


        const docs = await prisma.document.findMany({
            where: { ownerId: userId },
            select: {
                id: true,
                title: true,
                createdAt: true,
                updatedAt: true
            }
        })

        res.status(200).json({
            message: "User documents successfully fetched",
            documents: docs
        })

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

const getDocumentById = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params as { id: string };
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({
                message: "Unauthorized"
            })
        }

        if (!id) {
            return res.status(400).json({ message: "Invalid document ID" });
        }

        const document = await prisma.document.findUnique({
            where: { id }
        })

        if (!document) {
            return res.status(404).json({
                message: "Doc not found"
            })
        }

        if (document.ownerId !== userId) {
            return res.status(403).json({ message: "Forbidden access...you're not the owner" })
        }

        res.status(200).json({
            message: "Document successfully fetched",
            document
        })

    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal server error" })
    }
}

export { createDocument, listMyDocuments, getDocumentById }