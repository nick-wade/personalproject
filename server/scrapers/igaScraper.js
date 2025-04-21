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
            // Get the discount banner text (from the red banner at top)
            const discountBanner = product.querySelector('div.text-white.text-center.py-1.font-semibold, div[data-badge]');
            const discountLabel = discountBanner ? discountBanner.innerText.trim() : 'Special';
            
            // Get the actual former price (with "was" label)
            const wasPriceElement = product.querySelector('span.inline-block.bg-yellow-100.text-yellow-800.text-xs, div[data-variant="solid"][data-tone="secondary"]');
            const formerPrice = wasPriceElement ? 
                wasPriceElement.innerText.trim().replace('was', '').trim() : null;
            
            return {
                name: product.querySelector('span.line-clamp-3, h2.line-clamp-2')?.innerText.trim() || 'N/A',
                currentPrice: product.querySelector('span.font-bold.leading-none, span.text-xl.font-bold')?.innerText.trim() || 'N/A',
                formerPrice: formerPrice,
                discountLabel: discountLabel,
                image: product.querySelector('img')?.src || 'N/A',
            };
        });
    });
    await browser.close();
    const filepath = path.join(__dirname, '..', 'data', 'iga.json');
    fs.writeFileSync(filepath, JSON.stringify(items, null, 2));
    return items;
}

module.exports = scrapeIGA;