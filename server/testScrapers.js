const scrapeIGA = require('./scrapers/igaScraper');
const scrapeALDI = require('./scrapers/aldiScraper');

async function testScrapers() {
    try {
        console.log("Testing IGA Scraper...");
        const igaData = await scrapeIGA();
        console.log("IGA Scraper Success: ", igaData.length, "items scraped");

        console.log("Testing ALDI Scraper...");
        const aldiData = await scrapeALDI();
        console.log("ALDI Scraper Success: ", aldiData.length, "items scraped");
    } catch (error) {
        console.error("Error during scraping:", error);
    }
}

testScrapers();