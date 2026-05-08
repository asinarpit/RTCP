"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDocument = exports.updateDocument = exports.getDocumentById = exports.listMyDocuments = exports.createDocument = void 0;
const prisma_1 = require("../lib/prisma");
const createDocument = async (req, res) => {
    try {
        const { title = "Untitled Document" } = req.body;
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const document = await prisma_1.prisma.document.create({
            data: {
                title,
                owner: { connect: { id: userId } }
            }
        });
        return res.status(201).json({
            message: "Document created successfully",
            document
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
};
exports.createDocument = createDocument;
const listMyDocuments = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }
        const docs = await prisma_1.prisma.document.findMany({
            where: { ownerId: userId },
            select: {
                id: true,
                title: true,
                createdAt: true,
                updatedAt: true
            }
        });
        res.status(200).json({
            message: "User documents successfully fetched",
            documents: docs
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
};
exports.listMyDocuments = listMyDocuments;
const getDocumentById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }
        if (!id) {
            return res.status(400).json({ message: "Invalid document ID" });
        }
        const document = await prisma_1.prisma.document.findUnique({
            where: { id }
        });
        if (!document) {
            return res.status(404).json({
                message: "Doc not found"
            });
        }
        res.status(200).json({
            message: "Document successfully fetched",
            document
        });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.getDocumentById = getDocumentById;
const updateDocument = async (req, res) => {
    try {
        const { id } = req.params;
        const { title } = req.body;
        const userId = req.user?.id;
        if (!userId)
            return res.status(401).json({ message: "Unauthorized" });
        const document = await prisma_1.prisma.document.findUnique({ where: { id } });
        if (!document)
            return res.status(404).json({ message: "Document not found" });
        if (document.ownerId !== userId) {
            return res.status(403).json({ message: "Forbidden: You are not the owner" });
        }
        const updatedDoc = await prisma_1.prisma.document.update({
            where: { id },
            data: { title }
        });
        return res.status(200).json({
            message: "Document updated successfully",
            document: updatedDoc
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
exports.updateDocument = updateDocument;
const deleteDocument = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;
        if (!userId)
            return res.status(401).json({ message: "Unauthorized" });
        const document = await prisma_1.prisma.document.findUnique({ where: { id } });
        if (!document)
            return res.status(404).json({ message: "Document not found" });
        if (document.ownerId !== userId) {
            return res.status(403).json({ message: "Forbidden: You are not the owner" });
        }
        await prisma_1.prisma.document.delete({ where: { id } });
        return res.status(200).json({ message: "Document deleted successfully" });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
exports.deleteDocument = deleteDocument;
