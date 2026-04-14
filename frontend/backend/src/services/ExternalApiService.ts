import axios from 'axios';

const RAINFOREST_API_KEY = process.env.RAINFOREST_API_KEY;
const BASE_URL = 'https://api.rainforestapi.com/request';

interface RainforestProduct {
    position: number;
    title: string;
    asin: string;
    image: string;
    prices?: { value: number; currency: string }[];
    price?: { value: number; currency: string };
    rating?: number;
    ratings_total?: number;
}

interface ProductData {
    name: string;
    description: string;
    price: number;
    image: string;
    category: string;
    gender: string;
    stock: number;
}

class ExternalApiService {
    
    private static async fetchFromRainforest(params: Record<string, string>): Promise<RainforestProduct[]> {
        if (!RAINFOREST_API_KEY || RAINFOREST_API_KEY === 'your_rainforest_api_key_here') {
            throw new Error('RAINFOREST_API_KEY is not set. Please add your API key to .env');
        }

        const response = await axios.get(BASE_URL, {
            params: {
                api_key: RAINFOREST_API_KEY,
                amazon_domain: 'amazon.in',
                ...params
            },
            timeout: 30000
        });

        return response.data?.search_results || response.data?.bestsellers || [];
    }

    static async fetchAmazonProducts(query: string, category: string, gender: string = 'Unisex'): Promise<ProductData[]> {
        try {
            const results = await this.fetchFromRainforest({
                type: 'search',
                search_term: query,
            });

            return results.slice(0, 50).map((item) => {
                const priceVal = item.price?.value || (item.prices?.[0]?.value) || 999;
                return {
                    name: item.title?.substring(0, 120) || 'Product',
                    description: `${item.title} - Genuine product sourced from Amazon.in. ASIN: ${item.asin}`,
                    price: Math.round(priceVal),
                    image: item.image || 'https://via.placeholder.com/400x400?text=No+Image',
                    category,
                    gender,
                    stock: 20
                };
            }).filter((p) => p.image && p.image !== 'https://via.placeholder.com/400x400?text=No+Image');
        } catch (error: any) {
            console.error(`Error fetching ${query}:`, error.message);
            return [];
        }
    }

    static async syncAllProducts(): Promise<ProductData[]> {
        const allProducts: ProductData[] = [];

        console.log('\n📦 Fetching Electronics from Amazon...');
        const electronics = await this.fetchAmazonProducts('wireless headphones electronics gadgets', 'Electronics', 'Unisex');
        allProducts.push(...electronics);
        console.log(`   ✅  ${electronics.length} Electronics products fetched.`);

        console.log('\n📦 Fetching Smartphones from Amazon...');
        const phones = await this.fetchAmazonProducts('smartphones android mobile', 'Electronics', 'Unisex');
        allProducts.push(...phones);
        console.log(`   ✅  ${phones.length} Smartphone products fetched.`);

        console.log('\n📦 Fetching Women Fashion from Amazon...');
        const womenFashion = await this.fetchAmazonProducts('women saree kurti ethnic wear', 'Fashion', 'Female');
        allProducts.push(...womenFashion);
        console.log(`   ✅  ${womenFashion.length} Women\'s Fashion products fetched.`);

        console.log('\n📦 Fetching Men Fashion from Amazon...');
        const menFashion = await this.fetchAmazonProducts('men shirt jeans casual wear', 'Fashion', 'Male');
        allProducts.push(...menFashion);
        console.log(`   ✅  ${menFashion.length} Men\'s Fashion products fetched.`);

        console.log('\n📦 Fetching Kids Fashion from Amazon...');
        const kidsFashion = await this.fetchAmazonProducts('kids children clothing boys girls wear', 'Fashion', 'Kids');
        allProducts.push(...kidsFashion);
        console.log(`   ✅  ${kidsFashion.length} Kids Fashion products fetched.`);

        console.log('\n📦 Fetching Accessories from Amazon...');
        const accessories = await this.fetchAmazonProducts('women jewellery necklace ring accessories', 'Accessories', 'Female');
        allProducts.push(...accessories);
        console.log(`   ✅  ${accessories.length} Accessories products fetched.`);

        console.log('\n📦 Fetching Sports & Fitness items from Amazon...');
        const sports = await this.fetchAmazonProducts('yoga mat gym fitness equipment', 'Sports', 'Unisex');
        allProducts.push(...sports);
        console.log(`   ✅  ${sports.length} Sports products fetched.`);

        return allProducts;
    }
}

export { ExternalApiService, ProductData };
