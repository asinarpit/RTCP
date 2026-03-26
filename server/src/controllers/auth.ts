import { Request, Response } from "express"
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma"
import bcrypt from "bcryptjs";

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
const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
        // checking if user exists
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            return res.status(401).json({
                message: "Invalid credentials"
            })
        }

        //password compare
        const isMatch = await bcrypt.compare(password, user?.password);

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid credentials"
            })
        }


        //jwt token 
        const token = jwt.sign({
            id: user?.id,
            email: user?.email
        }, process.env.JWT_SECRET as string, { expiresIn: "7d" })

        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user.id,
                email: user.email
            }
        })

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal server error" })
    }
}


//register
const register = async (req: Request, res: Response) => {
    const { name, email, password } = req.body;
    try {
        // checking user exists
        const existingUser = await prisma.user.findUnique({ where: { email } })

        if (existingUser) {
            return res.status(409).json({
                message: "User already exists"
            })
        }

        //password hashing
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                color: getUniqueColor()
            }
        })

        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            }
        })
    }

    catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Internal server error"
        })
    }

}


export { login, register }