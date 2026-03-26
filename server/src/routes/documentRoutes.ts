import express from "express";
import { createDocument, listMyDocuments, getDocumentById } from "../controllers/document";
import { validate } from "../middlewares/validate.middleware";
import { createDocumentSchema, getDocumentSchema } from "../validations/document.validation";
import { protect } from "../middlewares/auth.middleware";

const router = express.Router();

router.use(protect);

router.post("/", validate(createDocumentSchema), createDocument);
router.get("/", listMyDocuments);
router.get("/:id", validate(getDocumentSchema), getDocumentById);

export default router;
