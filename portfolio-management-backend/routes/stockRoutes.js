const express = require('express');
const { getAllStocks, getStockByTicker, addStock, updateStock, deleteStock } = require('../controllers/stockController');
const { fetchStockPrice } = require('../services/stockPriceService'); // Import stock price service

const router = express.Router();

// ✅ Correctly define routes
router.get("/", getAllStocks);
router.get("/:ticker", getStockByTicker);
router.post("/", addStock);
router.put("/:id", updateStock);
router.delete("/:id", deleteStock);

// ✅ Add this route for fetching stock prices
router.get("/price/:ticker", async (req, res) => {
    const { ticker } = req.params;
    console.log(`Fetching price for: ${ticker}`);

    if (!ticker) {
        return res.status(400).json({ error: "Stock symbol is required" });
    }

    try {
        const price = await fetchStockPrice(ticker);
        if (price !== null) {
            res.json({ symbol: ticker, price });
        } else {
            res.status(404).json({ error: "Stock price not found" });
        }
    } catch (error) {
        console.error("Error fetching stock price:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
