import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Database } from '../patterns/Database';

const prisma = Database.getInstance();

const generateToken = (id: number): string => {
    return jwt.sign({ id }, process.env.JWT_SECRET as string, {
        expiresIn: '30d',
    });
};

export const registerUser = async (req: Request, res: Response): Promise<void> => {
    const { name, email, password } = req.body;

    try {
        const userExists = await prisma.user.findUnique({
            where: { email },
        });

        if (userExists) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        });

        if (user) {
            res.status(201).json({
                id: user!.id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user!.id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    try {
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (user && (await bcrypt.compare(password, user!.password))) {
            res.json({
                id: user!.id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone,
                addressLine1: user.addressLine1,
                addressLine2: user.addressLine2,
                city: user.city,
                state: user.state,
                country: user.country,
                zipCode: user.zipCode,
                avatar: user.avatar,
                token: generateToken(user!.id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getUserProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.user?.id) {
            res.status(401).json({ message: 'Not authorized' });
            return;
        }

        const user = await prisma.user.findUnique({
            where: { id: req.user!.id },
        });

        if (user) {
            res.json({
                id: user!.id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone,
                addressLine1: user.addressLine1,
                addressLine2: user.addressLine2,
                city: user.city,
                state: user.state,
                country: user.country,
                zipCode: user.zipCode,
                avatar: user.avatar,
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const updateUserProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.user?.id) {
            res.status(401).json({ message: 'Not authorized' });
            return;
        }

        const user = await prisma.user.findUnique({
            where: { id: req.user!.id },
        });

        if (user) {
            const updatedUser = await prisma.user.update({
                where: { id: req.user!.id },
                data: {
                    name: req.body.name || user.name,
                    email: req.body.email || user.email,
                    phone: req.body.phone !== undefined ? req.body.phone : user.phone,
                    addressLine1: req.body.addressLine1 !== undefined ? req.body.addressLine1 : user.addressLine1,
                    addressLine2: req.body.addressLine2 !== undefined ? req.body.addressLine2 : user.addressLine2,
                    city: req.body.city || user.city,
                    state: req.body.state || user.state,
                    country: req.body.country || user.country,
                    zipCode: req.body.zipCode || user.zipCode,
                    avatar: req.body.avatar !== undefined ? req.body.avatar : user.avatar,
                },
            });

            res.json({
                id: updatedUser.id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                phone: updatedUser.phone,
                addressLine1: updatedUser.addressLine1,
                addressLine2: updatedUser.addressLine2,
                city: updatedUser.city,
                state: updatedUser.state,
                country: updatedUser.country,
                zipCode: updatedUser.zipCode,
                avatar: updatedUser.avatar,
                token: generateToken(updatedUser.id),
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
