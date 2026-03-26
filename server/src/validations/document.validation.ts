import { z } from "zod";

export const createDocumentSchema = z.object({
  body: z.object({
    title: z.string().min(1, "Title is required").max(100, "Title is too long"),
    content: z.any().optional(),   //this is binary
  }),
});

export const getDocumentSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid document ID format"),
  }),
});
