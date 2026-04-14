
import { Request, Response } from 'express';
import { Database } from '../patterns/Database';
const prisma = Database.getInstance();




// @desc    Fetch all products with filters
// @route   GET /api/products
// @access  Public
const getProducts = async (req: Request, res: Response): Promise<void> => {
    try {
        const {
            category,
            minPrice,
            maxPrice,
            search,
            sort,
            inStock,
            page = 1,
            limit = 20
        } = req.query;

        // Build where clause
        const where: any = {}; // TODO: map to Prisma.ProductWhereInput

        // Category filter
        if (category && category !== 'All') {
            where.category = category;
        }

        // Price range filter
        if (minPrice || maxPrice) {
            where.price = {};
            if (minPrice) where.price.gte = parseFloat(minPrice as string);
            if (maxPrice) where.price.lte = parseFloat(maxPrice as string);
        }

        // Search filter
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } }
            ];
        }

        // In stock filter
        if (inStock === 'true') {
            where.stock = { gt: 0 };
        }

        // Build orderBy clause
        let orderBy: any = { createdAt: 'desc' }; // Default sort
        if (sort) {
            switch (sort) {
                case 'price_asc':
                    orderBy = { price: 'asc' };
                    break;
                case 'price_desc':
                    orderBy = { price: 'desc' };
                    break;
                case 'name_asc':
                    orderBy = { name: 'asc' };
                    break;
                case 'name_desc':
                    orderBy = { name: 'desc' };
                    break;
                case 'newest':
                    orderBy = { createdAt: 'desc' };
                    break;
                case 'oldest':
                    orderBy = { createdAt: 'asc' };
                    break;
                default:
                    orderBy = { createdAt: 'desc' };
            }
        }

        // Pagination
        const skip = (parseInt(page as string, 10) - 1) * parseInt(limit as string, 10);
        const take = parseInt(limit as string, 10);

        // Get products with filters
        const products = await prisma.product.findMany({
            where,
            orderBy,
            skip,
            take
        });

        // Get total count for pagination
        const totalCount = await prisma.product.count({ where });

        // Get all categories for filter options
        const categories = await prisma.product.findMany({
            select: { category: true },
            distinct: ['category']
        });

        res.json({
            products,
            totalCount,
            currentPage: parseInt(page as string, 10),
            totalPages: Math.ceil(totalCount / take),
            categories: categories.map(c => c.category)
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req: Request, res: Response): Promise<void> => {
    try {
        const product = await prisma.product.findUnique({
            where: { id: parseInt(req.params.id as string, 10) },
        });

        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req: Request, res: Response): Promise<void> => {
    const { name, description, price, image, category, stock } = req.body;

    try {
        const product = await prisma.product.create({
            data: {
                name,
                description,
                price,
                image,
                category,
                stock,
            },
        });
        res.status(201).json(product);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req: Request, res: Response): Promise<void> => {
    const { name, description, price, image, category, stock } = req.body;

    try {
        const product = await prisma.product.update({
            where: { id: parseInt(req.params.id as string, 10) },
            data: {
                name,
                description,
                price,
                image,
                category,
                stock,
            },
        });
        res.json(product);
    } catch (error: any) {
        res.status(404).json({ message: 'Product not found' });
    }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        await prisma.product.delete({
            where: { id: parseInt(req.params.id as string, 10) },
        });
        res.json({ message: 'Product removed' });
    } catch (error: any) {
        res.status(404).json({ message: 'Product not found' });
    }
};

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
};
