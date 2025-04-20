const express = require('express');
const cors = require('cors');
const scrapeIGA = require('./scrapers/igaScraper');
const scrapeALDI = require('./scrapers/aldiScraper');
const path = require('path');
const fs = require('fs');

const corsOptions ={
    origin:'https://aussiefrugal.com', 
    credentials:true, 
    optionSuccessStatus:200
}
const app = express();

app.use(cors(corsOptions));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'https://aussiefrugal.com');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    next();
  });
const PORT = process.env.PORT || 8080;

const dataFolderExists = (filePath) => {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
};

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
    const dataDirectory = path.join(__dirname, 'data');
    const igaDataPath = path.join(__dirname, 'data', 'iga.json');
    
    dataFolderExists(dataDirectory);

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
    const dataDirectory = path.join(__dirname, 'data');
    const aldiDataPath = path.join(__dirname, 'data', 'ALDI.json');
    dataFolderExists(dataDirectory);
    
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
