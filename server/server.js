const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');

const app = express();
app.use(cors()); // Enable CORS for frontend requests
const PORT = process.env.PORT || 8080;

async function scrapeIGA() {
    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();

    await page.goto('https://www.igashop.com.au/specials/1', { waitUntil: 'networkidle2' });
    console.log('✅ page goto iga')

    const items = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('div[data-product-card="true"]')).map(product => {
            return {
                name: product.querySelector('span:nth-of-type(1)')?.innerText.trim() || 'N/A',
                currentPrice: product.querySelector('span.font-bold.leading-none')?.innerText.trim() || 'N/A',
                formerPrice: product.querySelector('div[dat a-tone="secondary"]')?.innerText.trim().replace('was', '').trim() || 'N/A',
                image: product.querySelector('img')?.src || 'N/A'
            };
        });
    });

    await browser.close();
    console.log('✅ browser closed')
    return items;
}

async function scrapeALDI() {
    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();

    await page.goto('https://www.aldi.com.au/en/price-reductions', { waitUntil: 'networkidle2' });
    console.log('✅ page goto aldi')


    const items = await page.evaluate(() => {
        return Array.from(document.querySelectorAll(".box--wrapper")).map(item => ({
            title: item.querySelector(".box--description")?.innerText.trim() || "No title",
            price: item.querySelector(".box--price")?.innerText.trim() || "No price"
        }));
    });

    await browser.close();
    console.log('✅ browser closed')
    return items; // ✅ Fix: Added return statement
}

// API Route to get products
app.get('/api/iga', async (req, res) => {
    try {
        const data = await scrapeIGA();
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: 'Error scraping data', error });
    }
});

app.get('/api/aldi', async (req, res) => {
    try {
        const data = await scrapeALDI();
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: 'Error scraping data', error });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
