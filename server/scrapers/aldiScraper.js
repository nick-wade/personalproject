const puppeteer = require('puppeteer-core');
const executablePath = require('puppeteer').executablePath();
const fs = require('fs');
const path = require('path');

async function scrapeALDI() {
    const browser = await puppeteer.launch({
        headless: 'new',
        executablePath: executablePath(),  // Use the bundled Chromium
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();
    const specialBuysDate = '2025-04-30'; // Change dynamically if needed
    await page.goto(`https://www.aldi.com.au/special-buys/${specialBuysDate}`, {
        waitUntil: 'networkidle2'
    });
    const items = await page.evaluate(() => {
        const baseURL = 'https://www.aldi.com.au';
        return Array.from(document.querySelectorAll('.product-tile')).map(tile => {
            const linkElement = tile.querySelector('a.product-tile__link');
            return {
                name: tile.querySelector('.product-tile__name')?.innerText.trim() || 'No name',
                brand: tile.querySelector('.product-tile__brandname')?.innerText.trim() || '',
                price: tile.querySelector('.base-price--product-tile__price')?.innerText.trim() || 'No price',
                url: linkElement ? baseURL + linkElement.getAttribute('href') : '',
            };
        });
    });
    await browser.close();
    const filepath = path.join(__dirname, '..', 'data', 'ALDI.json');
    fs.writeFileSync(filepath, JSON.stringify(items, null, 2));
    return items;
}

module.exports = scrapeALDI;
