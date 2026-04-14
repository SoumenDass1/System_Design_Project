/**
 * Product Sync Script — Rainforest API (Amazon.in)
 * Fetches 1000+ real products across all categories and genders.
 * Usage: node scripts/syncProducts.js
 */

require('dotenv').config({ path: __dirname + '/../.env' });
const { PrismaClient } = require('@prisma/client');
const axios = require('axios');

const prisma = new PrismaClient();
const API_KEY = process.env.RAINFOREST_API_KEY;
const BASE_URL = 'https://api.rainforestapi.com/request';

if (!API_KEY || API_KEY === 'your_rainforest_api_key_here') {
    console.error('\n❌ ERROR: RAINFOREST_API_KEY not set in backend/.env\n');
    process.exit(1);
}

// 54 search queries = 54 credits = ~1000 products (20 each)
const SEARCH_QUERIES = [
    // === ELECTRONICS (12 queries) ===
    { query: 'wireless bluetooth headphones earphones india', category: 'Electronics', gender: 'Unisex' },
    { query: 'smartphone 5g android mobile phone india', category: 'Electronics', gender: 'Unisex' },
    { query: 'laptop notebook computer student', category: 'Electronics', gender: 'Unisex' },
    { query: 'smart watch fitness band wearable', category: 'Electronics', gender: 'Unisex' },
    { query: 'bluetooth speaker portable waterproof', category: 'Electronics', gender: 'Unisex' },
    { query: 'power bank fast charging portable', category: 'Electronics', gender: 'Unisex' },
    { query: 'gaming mouse mechanical keyboard', category: 'Electronics', gender: 'Unisex' },
    { query: 'action camera drone photography', category: 'Electronics', gender: 'Unisex' },
    { query: 'wifi router networking modem', category: 'Electronics', gender: 'Unisex' },
    { query: 'led smart tv 4k television', category: 'Electronics', gender: 'Unisex' },
    { query: 'usb hub memory card pendrive storage', category: 'Electronics', gender: 'Unisex' },
    { query: 'tablet ipad android tab kids', category: 'Electronics', gender: 'Unisex' },

    // === WOMEN FASHION (12 queries) ===
    { query: 'women saree silk banarasi ethnic', category: 'Fashion', gender: 'Female' },
    { query: 'kurti anarkali suit women printed cotton', category: 'Fashion', gender: 'Female' },
    { query: 'womens dress western frock maxi', category: 'Fashion', gender: 'Female' },
    { query: 'lehenga choli bridal wedding women', category: 'Fashion', gender: 'Female' },
    { query: 'women jeans trousers palazzo cotton', category: 'Fashion', gender: 'Female' },
    { query: 'women top blouse shirt casual', category: 'Fashion', gender: 'Female' },
    { query: 'women jacket coat cardigan winter', category: 'Fashion', gender: 'Female' },
    { query: 'women kurta set with dupatta', category: 'Fashion', gender: 'Female' },
    { query: 'women salwar suit ethnic traditional', category: 'Fashion', gender: 'Female' },
    { query: 'women nightwear nightdress lounge wear', category: 'Fashion', gender: 'Female' },
    { query: 'women sweatshirt hoodie pullover', category: 'Fashion', gender: 'Female' },
    { query: 'women georgette chiffon printed saree', category: 'Fashion', gender: 'Female' },

    // === MEN FASHION (10 queries) ===
    { query: 'men shirt formal office cotton', category: 'Fashion', gender: 'Male' },
    { query: 'men casual t-shirt printed round neck', category: 'Fashion', gender: 'Male' },
    { query: 'men jeans slim fit stretch denim', category: 'Fashion', gender: 'Male' },
    { query: 'men kurta ethnic wear india cotton', category: 'Fashion', gender: 'Male' },
    { query: 'men jacket hoodie winter sweatshirt', category: 'Fashion', gender: 'Male' },
    { query: 'men formal trousers chinos pants', category: 'Fashion', gender: 'Male' },
    { query: 'men polo shirt sportswear active wear', category: 'Fashion', gender: 'Male' },
    { query: 'men suit blazer formal party wear', category: 'Fashion', gender: 'Male' },
    { query: 'men shorts bermuda casual summer', category: 'Fashion', gender: 'Male' },
    { query: 'men shoes sneakers casual formal', category: 'Fashion', gender: 'Male' },

    // === KIDS FASHION (5 queries) ===
    { query: 'kids boys clothing shirt jeans set', category: 'Fashion', gender: 'Kids' },
    { query: 'girls frock dress party wear kids', category: 'Fashion', gender: 'Kids' },
    { query: 'kids ethnic wear kurta girls boys', category: 'Fashion', gender: 'Kids' },
    { query: 'baby infant romper newborn clothing', category: 'Fashion', gender: 'Kids' },
    { query: 'kids shoes sandals sneakers school', category: 'Fashion', gender: 'Kids' },

    // === ACCESSORIES — FEMALE (8 queries) ===
    { query: 'women jewellery necklace earrings gold', category: 'Accessories', gender: 'Female' },
    { query: 'women bangles bracelet kada gold silver', category: 'Accessories', gender: 'Female' },
    { query: 'women handbag purse leather tote', category: 'Accessories', gender: 'Female' },
    { query: 'women sunglasses fashion designer', category: 'Accessories', gender: 'Female' },
    { query: 'women watch analog digital fashion', category: 'Accessories', gender: 'Female' },
    { query: 'women scarf dupatta stole silk', category: 'Accessories', gender: 'Female' },
    { query: 'hair accessories clips pins headband women', category: 'Accessories', gender: 'Female' },
    { query: 'womens sandals heels flats footwear', category: 'Accessories', gender: 'Female' },

    // === ACCESSORIES — MALE (3 queries) ===
    { query: 'mens wallet genuine leather card holder', category: 'Accessories', gender: 'Male' },
    { query: 'mens watch digital analog sport', category: 'Accessories', gender: 'Male' },
    { query: 'men belt formal leather buckle', category: 'Accessories', gender: 'Male' },

    // === SPORTS & FITNESS (4 queries) ===
    { query: 'yoga mat exercise fitness non slip', category: 'Sports', gender: 'Unisex' },
    { query: 'dumbbells resistance bands gym equipment', category: 'Sports', gender: 'Unisex' },
    { query: 'sports shoes running gym training', category: 'Sports', gender: 'Unisex' },
    { query: 'protein shaker gym bag sports accessories', category: 'Sports', gender: 'Unisex' },
];

async function fetchSearchResults(query) {
    const response = await axios.get(BASE_URL, {
        params: { api_key: API_KEY, type: 'search', amazon_domain: 'amazon.in', search_term: query },
        timeout: 30000
    });
    return response.data?.search_results || [];
}

function mapToDbFormat(items, category, gender) {
    const seen = new Set();
    return items
        .filter(item => {
            const img = item.image || item.thumbnail;
            if (!img || img.includes('placeholder')) return false;
            const price = item.price?.value || item.prices?.[0]?.value;
            if (!price || price <= 0) return false;
            if (seen.has(item.asin)) return false;
            seen.add(item.asin);
            return true;
        })
        .slice(0, 20)
        .map(item => ({
            name: (item.title || 'Product').substring(0, 150).trim(),
            description: `${(item.title || 'Product').substring(0, 120).trim()} — Genuine product from Amazon.in (ASIN: ${item.asin || 'N/A'})`,
            price: Math.round(item.price?.value || item.prices?.[0]?.value || 0),
            image: item.image || item.thumbnail,
            category,
            gender,
            stock: Math.floor(Math.random() * 40) + 10,
        }));
}

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function sync() {
    console.log('\n══════════════════════════════════════════════');
    console.log('  TheBrand Mega Sync — 1000+ Real Products    ');
    console.log('══════════════════════════════════════════════\n');
    console.log(`🔑 API Key: ${API_KEY.substring(0, 8)}...`);
    console.log(`📋 Total queries: ${SEARCH_QUERIES.length} (≈${SEARCH_QUERIES.length * 20} products)\n`);

    console.log('🗑️  Purging all existing products...');
    const { count } = await prisma.product.deleteMany({});
    console.log(`   ✅ Deleted ${count} products.\n`);

    let totalSynced = 0;
    let errors = 0;

    for (let i = 0; i < SEARCH_QUERIES.length; i++) {
        const { query, category, gender } = SEARCH_QUERIES[i];
        process.stdout.write(`[${String(i + 1).padStart(2)}/${SEARCH_QUERIES.length}] 📦 "${query.substring(0, 45)}..." `);

        try {
            const results = await fetchSearchResults(query);
            const products = mapToDbFormat(results, category, gender);

            if (products.length === 0) {
                console.log(`⚠️  No valid results.`);
                continue;
            }

            for (const p of products) {
                await prisma.product.create({ data: p });
            }

            totalSynced += products.length;
            console.log(`✅ +${products.length}`);

            if (i < SEARCH_QUERIES.length - 1) await sleep(300);

        } catch (err) {
            errors++;
            if (err.response?.status === 401) {
                console.log(`\n❌ Invalid API key!`); break;
            } else if (err.response?.status === 402) {
                console.log(`\n❌ Credits exhausted!`); break;
            } else {
                console.log(`❌ ${err.message.substring(0, 50)}`);
            }
        }
    }

    const final = await prisma.product.count();
    console.log('\n══════════════════════════════════════════════');
    console.log(`   ✅ Mega Sync Complete!`);
    console.log(`   📊 Total products in DB: ${final}`);
    console.log(`   📦 Synced this run: ${totalSynced}`);
    if (errors > 0) console.log(`   ⚠️  Failed queries: ${errors}`);
    console.log('══════════════════════════════════════════════\n');

    await prisma.$disconnect();
}

sync().catch(async (e) => {
    console.error('\n💥 Fatal:', e.message);
    await prisma.$disconnect();
    process.exit(1);
});
