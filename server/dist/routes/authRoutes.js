"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../controllers/auth");
const validate_middleware_1 = require("../middlewares/validate.middleware");
const auth_validation_1 = require("../validations/auth.validation");
const router = express_1.default.Router();
router.post("/login", (0, validate_middleware_1.validate)(auth_validation_1.loginSchema), auth_1.login);
router.post("/register", (0, validate_middleware_1.validate)(auth_validation_1.registerSchema), auth_1.register);
exports.default = router;
