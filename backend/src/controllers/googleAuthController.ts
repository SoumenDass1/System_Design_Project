
import { Request, Response } from 'express';
import { Database } from '../patterns/Database';
const prisma = Database.getInstance();

import { OAuth2Client } from 'google-auth-library';
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID as string);


import jwt from 'jsonwebtoken';

const generateToken = (id: string | number) => {
    return jwt.sign({ id }, process.env.JWT_SECRET as string, {
        expiresIn: '30d',
    });
};

const googleAuth = async (req: Request, res: Response): Promise<void> => {
    const { token } = req.body;
    console.log('Google Auth Request Token:', token ? 'Token received' : 'No token');

    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const { name, email, picture } = ticket.getPayload()!;
        console.log('Google User:', { name, email });

        let user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            // Create new user
            user = await prisma.user.create({
                data: {
                    name: name || '',
                    email: email || '',
                    password: '', // No password for Google users
                    avatar: picture,
                },
            });
        } else if (!user.avatar) {
            // If user exists but has no avatar (e.g. was removed), restore Google avatar
            user = await prisma.user.update({
                where: { id: user!.id },
                data: { avatar: picture },
            });
        }

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
    } catch (error: any) {
        console.error('Google Auth Error:', error);
        res.status(400).json({ message: 'Google authentication failed', error: error.message });
    }
};

export {  googleAuth  };
