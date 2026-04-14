const fs = require('fs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
    try {
        let raw = fs.readFileSync('../frontend/src/data/products.js', 'utf8');
        // Transform ES Module export to CommonJS
        raw = raw.replace(/export\s+const\s+products\s*=\s*/g, 'module.exports = ');
        fs.writeFileSync('./temp_products.js', raw);
        
        const products = require('./temp_products.js');
        console.log(`Loaded ${products.length} products from frontend data. Syncing database...`);
        
        // Clean and Insert
        await prisma.product.deleteMany({});
        
        for(const p of products) {
            await prisma.product.create({
                data: {
                    id: p.id,
                    name: p.name,
                    description: p.description || 'No description provided.',
                    price: p.price,
                    image: p.image,
                    category: p.category,
                    gender: p.gender || 'Unisex',
                    stock: p.stock || 15
                }
            });
        }
        
        console.log(`Successfully synced ${products.length} products into the Database!`);
    } catch (e) {
        console.error("Seeding Error:", e);
    } finally {
        await prisma.$disconnect();
        if(fs.existsSync('./temp_products.js')) {
            fs.unlinkSync('./temp_products.js');
        }
    }
}

run();
