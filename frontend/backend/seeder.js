const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const products = [
    // Accessories
    {
        name: 'Premium Leather Watch',
        description: 'Elegant and durable leather watch for any occasion.',
        price: 299.00,
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
        category: 'Accessories',
        stock: 10,
    },
    {
        name: 'Designer Sunglasses',
        description: 'Stylish sunglasses with UV protection.',
        price: 189.00,
        image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80',
        category: 'Accessories',
        stock: 15,
    },
    {
        name: 'Minimalist Backpack',
        description: 'Sleek and functional backpack for daily use.',
        price: 129.00,
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
        category: 'Accessories',
        stock: 20,
    },
    {
        name: 'Leather Wallet',
        description: 'Genuine leather wallet with RFID protection and multiple card slots.',
        price: 79.00,
        image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80',
        category: 'Accessories',
        stock: 50,
    },
    {
        name: 'Smartphone Case',
        description: 'Durable and stylish smartphone case with shock absorption.',
        price: 19.00,
        image: 'https://images.unsplash.com/photo-1601972600418-5ffbf67078f2?auto=format&fit=crop&w=800&q=80',
        category: 'Accessories',
        stock: 60,
    },
    {
        name: 'Canvas Tote Bag',
        description: 'Eco-friendly canvas tote bag perfect for everyday shopping.',
        price: 35.00,
        image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
        category: 'Accessories',
        stock: 40,
    },
    {
        name: 'Leather Belt',
        description: 'Premium quality leather belt with classic buckle design.',
        price: 55.00,
        image: 'https://images.unsplash.com/photo-1624222247344-550fb60583dc?auto=format&fit=crop&w=800&q=80',
        category: 'Accessories',
        stock: 35,
    },
    {
        name: 'Travel Neck Pillow',
        description: 'Memory foam neck pillow for comfortable travel.',
        price: 29.00,
        image: 'https://images.unsplash.com/photo-1520006403909-838d6b92c22e?auto=format&fit=crop&w=800&q=80',
        category: 'Accessories',
        stock: 45,
    },

    // Electronics
    {
        name: 'Wireless Headphones',
        description: 'High-quality sound with noise cancellation.',
        price: 249.00,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
        category: 'Electronics',
        stock: 8,
    },
    {
        name: 'Smart Fitness Band',
        description: 'Track your fitness goals with precision.',
        price: 89.00,
        image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?auto=format&fit=crop&w=800&q=80',
        category: 'Electronics',
        stock: 25,
    },
    {
        name: 'Wireless Mouse',
        description: 'Ergonomic wireless mouse with high precision sensor.',
        price: 49.00,
        image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80',
        category: 'Electronics',
        stock: 30,
    },
    {
        name: 'Bluetooth Speaker',
        description: 'Portable bluetooth speaker with 360-degree sound.',
        price: 89.00,
        image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=800&q=80',
        category: 'Electronics',
        stock: 22,
    },
    {
        name: 'Wireless Earbuds',
        description: 'True wireless earbuds with crystal clear audio and long battery life.',
        price: 129.00,
        image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80',
        category: 'Electronics',
        stock: 40,
    },
    {
        name: 'Smart Watch Pro',
        description: 'Advanced smartwatch with health monitoring and GPS tracking.',
        price: 349.00,
        image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80',
        category: 'Electronics',
        stock: 15,
    },
    {
        name: 'Portable Charger',
        description: '20000mAh power bank with fast charging support.',
        price: 45.00,
        image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&w=800&q=80',
        category: 'Electronics',
        stock: 55,
    },
    {
        name: 'USB-C Hub',
        description: 'Multi-port USB-C hub with HDMI, USB 3.0, and SD card reader.',
        price: 65.00,
        image: 'https://images.unsplash.com/photo-1625723044792-44de16ccb4e9?auto=format&fit=crop&w=800&q=80',
        category: 'Electronics',
        stock: 28,
    },
    {
        name: 'Mechanical Keyboard',
        description: 'RGB mechanical gaming keyboard with cherry MX switches.',
        price: 159.00,
        image: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=800&q=80',
        category: 'Electronics',
        stock: 18,
    },
    {
        name: 'Webcam HD',
        description: '1080p HD webcam with built-in microphone and auto focus.',
        price: 79.00,
        image: 'https://images.unsplash.com/photo-1587826080692-f439cd0b70da?auto=format&fit=crop&w=800&q=80',
        category: 'Electronics',
        stock: 25,
    },

    // Fashion
    {
        name: 'Cotton T-Shirt',
        description: 'Soft and comfortable cotton t-shirt.',
        price: 29.00,
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80',
        category: 'Fashion',
        stock: 50,
    },
    {
        name: 'Denim Jacket',
        description: 'Classic denim jacket for a cool look.',
        price: 79.00,
        image: 'https://images.unsplash.com/photo-1523205771623-e0faa4d2813d?auto=format&fit=crop&w=800&q=80',
        category: 'Fashion',
        stock: 12,
    },
    {
        name: 'Running Shoes',
        description: 'Lightweight and durable shoes for running.',
        price: 119.00,
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
        category: 'Fashion',
        stock: 18,
    },
    {
        name: 'Hoodie Pullover',
        description: 'Cozy fleece-lined hoodie perfect for casual wear.',
        price: 59.00,
        image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=800&q=80',
        category: 'Fashion',
        stock: 35,
    },
    {
        name: 'Slim Fit Jeans',
        description: 'Comfortable stretch denim in modern slim fit.',
        price: 69.00,
        image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=800&q=80',
        category: 'Fashion',
        stock: 40,
    },
    {
        name: 'Casual Sneakers',
        description: 'Versatile sneakers for everyday comfort and style.',
        price: 89.00,
        image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=800&q=80',
        category: 'Fashion',
        stock: 28,
    },
    {
        name: 'Polo Shirt',
        description: 'Classic polo shirt made from premium cotton pique.',
        price: 45.00,
        image: 'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?auto=format&fit=crop&w=800&q=80',
        category: 'Fashion',
        stock: 45,
    },
    {
        name: 'Chino Pants',
        description: 'Tailored chino pants with comfortable stretch fabric.',
        price: 55.00,
        image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=800&q=80',
        category: 'Fashion',
        stock: 32,
    },
    {
        name: 'Wool Sweater',
        description: 'Premium merino wool sweater for cold weather.',
        price: 99.00,
        image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=800&q=80',
        category: 'Fashion',
        stock: 20,
    },
    {
        name: 'Bomber Jacket',
        description: 'Classic bomber jacket with satin finish and ribbed cuffs.',
        price: 129.00,
        image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80',
        category: 'Fashion',
        stock: 15,
    },

    // Home & Living
    {
        name: 'Scented Candle Set',
        description: 'Set of 3 premium scented candles with natural soy wax.',
        price: 39.00,
        image: 'https://images.unsplash.com/photo-1602028915047-37269d1a73f7?auto=format&fit=crop&w=800&q=80',
        category: 'Home',
        stock: 50,
    },
    {
        name: 'Throw Blanket',
        description: 'Soft and cozy throw blanket for your living room.',
        price: 49.00,
        image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
        category: 'Home',
        stock: 30,
    },
    {
        name: 'Ceramic Vase',
        description: 'Handcrafted ceramic vase with modern minimalist design.',
        price: 35.00,
        image: 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?auto=format&fit=crop&w=800&q=80',
        category: 'Home',
        stock: 25,
    },
    {
        name: 'Wall Clock',
        description: 'Modern wall clock with silent movement mechanism.',
        price: 45.00,
        image: 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?auto=format&fit=crop&w=800&q=80',
        category: 'Home',
        stock: 20,
    },
    {
        name: 'Desk Organizer',
        description: 'Bamboo desk organizer with multiple compartments.',
        price: 29.00,
        image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
        category: 'Home',
        stock: 40,
    },
    {
        name: 'Plant Pot Set',
        description: 'Set of 3 modern ceramic plant pots with drainage holes.',
        price: 32.00,
        image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=800&q=80',
        category: 'Home',
        stock: 35,
    },

    // Sports & Fitness
    {
        name: 'Yoga Mat',
        description: 'Non-slip yoga mat with extra cushioning for comfort.',
        price: 39.00,
        image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?auto=format&fit=crop&w=800&q=80',
        category: 'Sports',
        stock: 45,
    },
    {
        name: 'Resistance Bands Set',
        description: 'Set of 5 resistance bands for home workouts.',
        price: 25.00,
        image: 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?auto=format&fit=crop&w=800&q=80',
        category: 'Sports',
        stock: 60,
    },
    {
        name: 'Dumbbells Set',
        description: 'Adjustable dumbbells set from 5 to 25 lbs.',
        price: 149.00,
        image: 'https://images.unsplash.com/photo-1586401100295-7a8096fd231a?auto=format&fit=crop&w=800&q=80',
        category: 'Sports',
        stock: 15,
    },
    {
        name: 'Water Bottle',
        description: 'Insulated stainless steel water bottle keeps drinks cold 24 hours.',
        price: 29.00,
        image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80',
        category: 'Sports',
        stock: 80,
    },
    {
        name: 'Gym Bag',
        description: 'Spacious gym bag with separate shoe compartment.',
        price: 55.00,
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
        category: 'Sports',
        stock: 25,
    },
    {
        name: 'Jump Rope',
        description: 'Speed jump rope with adjustable length and ball bearings.',
        price: 15.00,
        image: 'https://images.unsplash.com/photo-1434682881908-b43d0467b798?auto=format&fit=crop&w=800&q=80',
        category: 'Sports',
        stock: 70,
    },

    // Books & Stationery
    {
        name: 'Premium Notebook',
        description: 'A5 hardcover notebook with dotted pages and ribbon bookmark.',
        price: 19.00,
        image: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&w=800&q=80',
        category: 'Stationery',
        stock: 100,
    },
    {
        name: 'Fountain Pen',
        description: 'Elegant fountain pen with gold-plated nib.',
        price: 89.00,
        image: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=800&q=80',
        category: 'Stationery',
        stock: 30,
    },
    {
        name: 'Desk Lamp',
        description: 'LED desk lamp with adjustable brightness and color temperature.',
        price: 59.00,
        image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80',
        category: 'Stationery',
        stock: 22,
    },
    {
        name: 'Planner 2025',
        description: 'Weekly planner with goal setting and habit tracking pages.',
        price: 25.00,
        image: 'https://images.unsplash.com/photo-1506784365847-bbad939e9335?auto=format&fit=crop&w=800&q=80',
        category: 'Stationery',
        stock: 55,
    },
];

async function main() {
    console.log('Start seeding ...');

    // Clear existing products
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.product.deleteMany();
    console.log('Cleared existing products');

    for (const p of products) {
        const product = await prisma.product.create({
            data: p,
        });
        console.log(`Created product with id: ${product.id} - ${product.name}`);
    }
    console.log(`Seeding finished. Created ${products.length} products.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
