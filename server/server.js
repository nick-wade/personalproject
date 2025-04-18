const express = require('express');
const cors = require('cors');
const scrapeIGA = require('./scrapers/igaScraper');
const scrapeALDI = require('./scrapers/aldiScraper');

const app = express();
app.use(cors({origin: 'https://aussiefrugal.com'}));
const PORT = process.env.PORT || 8080;

const readJSONFile = (filePath) => {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading JSON file:', error);
        return null;
    }
};

app.get('/api/iga', async (req, res) => {
    const igaDataPath = path.join(__dirname, 'data', 'iga.json');
    
    // Check if JSON file exists
    if (fs.existsSync(igaDataPath)) {
        const data = readJSONFile(igaDataPath);
        if (data) {
            return res.json(data);
        }
    }

    try {
        const data = await scrapeIGA();
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: 'Error scraping IGA data', error });
    }
});

app.get('/api/aldi', async (req, res) => {
    const aldiDataPath = path.join(__dirname, 'data', 'ALDI.json');

    // Check if JSON file exists
    if (fs.existsSync(aldiDataPath)) {
        const data = readJSONFile(aldiDataPath);
        if (data) {
            return res.json(data);
        }
    }


    try {
        const data = await scrapeALDI();
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: 'Error scraping ALDI data', error });
    }
});
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
