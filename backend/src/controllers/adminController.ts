
import { Request, Response } from 'express';
import { Database } from '../patterns/Database';
const prisma = Database.getInstance();




// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getDashboardStats = async (req: Request, res: Response): Promise<void> => {
    try {
        // Get total sales
        const orders = await prisma.order.findMany({
            where: { status: { not: 'Cancelled' } },
            select: { total: true }
        });
        const totalSales = orders.reduce((sum, order) => sum + order.total, 0);

        // Get total orders count
        const totalOrders = await prisma.order.count();

        // Get total products count
        const totalProducts = await prisma.product.count();

        // Get total users count
        const totalUsers = await prisma.user.count();

        // Get recent orders
        const recentOrders = await prisma.order.findMany({
            take: 10,
            orderBy: { createdAt: 'desc' },
            include: {
                user: {
                    select: { name: true, email: true }
                },
                items: {
                    include: { product: true }
                }
            }
        });

        // Get orders by status
        const ordersByStatus = await prisma.order.groupBy({
            by: ['status'],
            _count: { status: true }
        });

        // Get top selling products
        const topProducts = await prisma.orderItem.groupBy({
            by: ['productId'],
            _sum: { quantity: true },
            orderBy: { _sum: { quantity: 'desc' } },
            take: 5
        });

        const topProductsWithDetails = await Promise.all(
            topProducts.map(async (item) => {
                const product = await prisma.product.findUnique({
                    where: { id: item.productId }
                });
                return {
                    ...product,
                    totalSold: item._sum.quantity
                };
            })
        );

        // Get monthly sales data (last 6 months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const monthlySales = await prisma.order.findMany({
            where: {
                createdAt: { gte: sixMonthsAgo },
                status: { not: 'Cancelled' }
            },
            select: { total: true, createdAt: true }
        });

        res.json({
            totalSales,
            totalOrders,
            totalProducts,
            totalUsers,
            recentOrders,
            ordersByStatus,
            topProducts: topProductsWithDetails,
            monthlySales
        });
    } catch (error: any) {
        console.error('Dashboard stats error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                phone: true,
                createdAt: true,
                _count: { select: { orders: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(users);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update user role
// @route   PUT /api/admin/users/:id/role
// @access  Private/Admin
const updateUserRole = async (req: Request, res: Response): Promise<void> => {
    const { role } = req.body;

    try {
        const user = await prisma.user.update({
            where: { id: parseInt(req.params.id as string, 10) },
            data: { role },
            select: { id: true, name: true, email: true, role: true }
        });
        res.json(user);
    } catch (error: any) {
        res.status(404).json({ message: 'User not found' });
    }
};

// @desc    Get all orders (admin)
// @route   GET /api/admin/orders
// @access  Private/Admin
const getAllOrders = async (req: Request, res: Response): Promise<void> => {
    try {
        const orders = await prisma.order.findMany({
            include: {
                user: { select: { name: true, email: true } },
                items: { include: { product: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(orders);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getDashboardStats,
    getAllUsers,
    updateUserRole,
    getAllOrders
};
