const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function scrapeIGA() {
    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();
    await page.goto('https://www.igashop.com.au/specials/1', { waitUntil: 'networkidle2' });
    const items = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('div[data-product-card="true"]')).map(product => {
            return {
                name: product.querySelector('span.line-clamp-3')?.innerText.trim() || 'N/A',
                currentPrice: product.querySelector('span.font-bold.leading-none')?.innerText.trim() || 'N/A',
                formerPrice: product.querySelector('div.relative.inline-flex')?.innerText.trim().replace('was', '').trim() || 'N/A',
                image: product.querySelector('img')?.src || 'N/A'
            };
        });
    });
    await browser.close();
    const filepath = path.join(__dirname, '..', 'data', 'iga.json');
    fs.writeFileSync(filepath, JSON.stringify(items, null, 2));
    return items;
}

module.exports = scrapeIGA;
