"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = exports.login = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = require("../lib/prisma");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const COLORS = [
    "#FF5733", // orange
    "#33FF57", // green
    "#3357FF", // blue
    "#F833FF", // pink
    "#FF33A8", // magenta
    "#33FFF5", // cyan
    "#F5FF33", // yellow
    "#FF8C33", // coral
];
//random color picker for cursor color (temp)
const getRandomColor = () => {
    return COLORS[Math.floor(Math.random() * COLORS.length)];
};
const usedColors = new Set();
const getUniqueColor = () => {
    let color;
    do {
        color = getRandomColor();
    } while (usedColors.has(color));
    usedColors.add(color);
    return color;
};
//login
const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        // checking if user exists
        const user = await prisma_1.prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(401).json({
                message: "Invalid credentials"
            });
        }
        //password compare
        const isMatch = await bcryptjs_1.default.compare(password, user?.password);
        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid credentials"
            });
        }
        //jwt token 
        const token = jsonwebtoken_1.default.sign({
            id: user?.id,
            email: user?.email
        }, process.env.JWT_SECRET, { expiresIn: "7d" });
        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                color: user.color
            }
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.login = login;
//register
const register = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        // checking user exists
        const existingUser = await prisma_1.prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(409).json({
                message: "User already exists"
            });
        }
        //password hashing
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const user = await prisma_1.prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                color: getUniqueColor()
            }
        });
        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                color: user.color
            }
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Internal server error"
        });
    }
};
exports.register = register;
