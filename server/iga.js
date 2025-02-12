const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');

const app = express();
app.use(cors()); // Enable CORS for frontend requests
const PORT = 5000;

async function scrapeIGA() {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.goto('https://www.igashop.com.au/specials/1', { waitUntil: 'networkidle2' });

    const items = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('div[data-product-card="true"]')).map(product => {
            return {
                name: product.querySelector('div.flex.flex-col.gap-2 span')?.innerText.trim() || 'N/A',
                formerPrice: product.querySelector('div[data-badge-data-variant="solid"]')?.innerText.trim().replace('was', '').trim() || 'N/A',
                currentPrice: product.querySelector('span.font-bold.leading-none')?.innerText.trim() || 'N/A',
                image: product.querySelector('img')?.src || 'N/A'
            };
        });
    });

    await browser.close();
    return items;
}

// API Route to get products
app.get('/api/products', async (req, res) => {
    try {
        const data = await scrapeIGA();
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: 'Error scraping data', error });
    }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
