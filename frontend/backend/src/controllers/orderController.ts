
import { Request, Response } from 'express';
import { Database } from '../patterns/Database';
const prisma = Database.getInstance();




// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = async (req: Request, res: Response): Promise<void> => {
    const {
        orderItems,
        addressLine1,
        addressLine2,
        city,
        zipCode,
        phone,
        totalPrice,
    } = req.body;

    if (orderItems && orderItems.length === 0) {
        res.status(400).json({ message: 'No order items' });
        return;
    }

    try {
        const order = await prisma.order.create({
            data: {
                userId: req.user!.id,
                addressLine1,
                addressLine2,
                city,
                zipCode,
                phone,
                total: totalPrice,
                items: {
                    create: orderItems.map((item: any) => ({
                        productId: item.id,
                        quantity: item.quantity,
                        price: item.price,
                        size: item.size,
                    })),
                },
            },
            include: {
                items: true,
            },
        });

        res.status(201).json(order);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req: Request, res: Response): Promise<void> => {
    try {
        const order = await prisma.order.findUnique({
            where: { id: parseInt(req.params.id as string, 10) },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                    },
                },
                items: {
                    include: {
                        product: true,
                    },
                },
            },
        });

        if (order) {
            // Check if user is admin or order owner
            if (req.user.role === 'admin' || order.userId === req.user!.id) {
                res.json(order);
            } else {
                res.status(401).json({ message: 'Not authorized to view this order' });
            }
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req: Request, res: Response): Promise<void> => {
    try {
        const orders = await prisma.order.findMany({
            where: { userId: req.user!.id },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        res.json(orders);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private
const updateOrderStatus = async (req: Request, res: Response): Promise<void> => {
    const { status } = req.body;

    try {
        const order = await prisma.order.findUnique({
            where: { id: parseInt(req.params.id as string, 10) },
        });

        if (order) {
            // Allow user to cancel if processing
            if (req.user!.id === order.userId && status === 'Cancelled' && order.status === 'Processing') {
                const updatedOrder = await prisma.order.update({
                    where: { id: parseInt(req.params.id as string, 10) },
                    data: { status },
                });
                res.json(updatedOrder);
            }

            // Allow admin to update any status
            if (req.user.role === 'admin') {
                const updatedOrder = await prisma.order.update({
                    where: { id: parseInt(req.params.id as string, 10) },
                    data: { status },
                });
                res.json(updatedOrder);
            }

            res.status(401).json({ message: 'Not authorized to update this order' });
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    addOrderItems,
    getOrderById,
    getMyOrders,
    updateOrderStatus,
};
