
import { Request, Response } from 'express';
import { Database } from '../patterns/Database';
const prisma = Database.getInstance();


import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';



// Generate password reset token
const generateResetToken = () => {
    return crypto.randomBytes(32).toString('hex');
};

// @desc    Request password reset
// @route   POST /api/password/forgot
// @access  Public
const forgotPassword = async (req: Request, res: Response): Promise<void> => {
    const { email } = req.body;

    try {
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            // Don't reveal that user doesn't exist for security
            res.json({ message: 'If email exists, reset instructions will be sent' });
        }

        // Generate reset token
        const resetToken = generateResetToken();
        const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

        // Save reset token to database
        await prisma.user.update({
            where: { email },
            data: {
                resetToken,
                resetTokenExpiry
            }
        });

        // In production, send email here
        // For now, return success message
        // Email service integration would go here (nodemailer, sendgrid, etc.)

        console.log(`Password reset token for ${email}: ${resetToken}`);

        res.json({
            message: 'If email exists, reset instructions will be sent',
            // Remove this in production - only for development
            devToken: process.env.NODE_ENV === 'development' ? resetToken : undefined
        });
    } catch (error: any) {
        console.error('Forgot password error:', error);
        res.status(500).json({ message: 'Error processing request' });
    }
};

// @desc    Reset password with token
// @route   POST /api/password/reset
// @access  Public
const resetPassword = async (req: Request, res: Response): Promise<void> => {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
        res.status(400).json({ message: 'Token and new password required' });
    }

    if (newPassword.length < 6) {
        res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    try {
        const user = await prisma.user.findFirst({
            where: {
                resetToken: token,
                resetTokenExpiry: { gt: new Date() }
            }
        });

        if (!user) {
            res.status(400).json({ message: 'Invalid or expired reset token' });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update password and clear reset token
        await prisma.user.update({
            where: { id: user!.id },
            data: {
                password: hashedPassword,
                resetToken: null,
                resetTokenExpiry: null
            }
        });

        res.json({ message: 'Password reset successful' });
    } catch (error: any) {
        console.error('Reset password error:', error);
        res.status(500).json({ message: 'Error resetting password' });
    }
};

// @desc    Change password (logged in user)
// @route   PUT /api/password/change
// @access  Private
const changePassword = async (req: Request, res: Response): Promise<void> => {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
        res.status(400).json({ message: 'Current and new password required' });
    }

    if (newPassword.length < 6) {
        res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user!.id }
        });

        if (!user) {
            res.status(404).json({ message: 'User not found' });
        }

        // Verify current password
        const isMatch = await bcrypt.compare(currentPassword, user!.password);
        if (!isMatch) {
            res.status(400).json({ message: 'Current password is incorrect' });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update password
        await prisma.user.update({
            where: { id: req.user!.id },
            data: { password: hashedPassword }
        });

        res.json({ message: 'Password changed successfully' });
    } catch (error: any) {
        console.error('Change password error:', error);
        res.status(500).json({ message: 'Error changing password' });
    }
};

module.exports = {
    forgotPassword,
    resetPassword,
    changePassword
};
