"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDocumentSchema = exports.updateDocumentSchema = exports.getDocumentSchema = exports.createDocumentSchema = void 0;
const zod_1 = require("zod");
exports.createDocumentSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().min(1, "Title is required").max(100, "Title is too long"),
        content: zod_1.z.any().optional(), //this is binary
    }),
});
exports.getDocumentSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid("Invalid document ID format"),
    }),
});
exports.updateDocumentSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid("Invalid document ID format"),
    }),
    body: zod_1.z.object({
        title: zod_1.z.string().min(1, "Title is required").max(100, "Title is too long"),
    }),
});
exports.deleteDocumentSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid("Invalid document ID format"),
    }),
});
