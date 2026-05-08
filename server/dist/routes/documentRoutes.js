"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const document_1 = require("../controllers/document");
const validate_middleware_1 = require("../middlewares/validate.middleware");
const document_validation_1 = require("../validations/document.validation");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = express_1.default.Router();
router.use(auth_middleware_1.protect);
router.post("/", (0, validate_middleware_1.validate)(document_validation_1.createDocumentSchema), document_1.createDocument);
router.get("/", document_1.listMyDocuments);
router.get("/:id", (0, validate_middleware_1.validate)(document_validation_1.getDocumentSchema), document_1.getDocumentById);
router.patch("/:id", (0, validate_middleware_1.validate)(document_validation_1.updateDocumentSchema), document_1.updateDocument);
router.delete("/:id", (0, validate_middleware_1.validate)(document_validation_1.deleteDocumentSchema), document_1.deleteDocument);
exports.default = router;
