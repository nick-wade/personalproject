const express = require('express');
const cors = require('cors');
const scrapeIGA = require('./scrapers/igaScraper');
const scrapeALDI = require('./scrapers/aldiScraper');

const app = express();
app.use(cors());
const PORT = process.env.PORT || 8080;

app.get('/api/iga', async (req, res) => {
    try {
        const data = await scrapeIGA();
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: 'Error scraping IGA data', error });
    }
});

app.get('/api/aldi', async (req, res) => {
    try {
        const data = await scrapeALDI();
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: 'Error scraping ALDI data', error });
    }
});
scrapeALDI();
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
