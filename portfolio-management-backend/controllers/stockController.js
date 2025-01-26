const Stock = require('../models/stock');
const { fetchStockPrice } = require('../services/stockPriceService');

// Get all stocks
exports.getAllStocks = async (req, res) => {
  try {
    const stocks = await Stock.find();
    const updatedStocks = await Promise.all(
      stocks.map(async (stock) => {
        const { price } = await fetchStockPrice(stock.ticker);
        return {
          ...stock._doc,
          currentPrice: price,
          totalValue: price * stock.quantity,
        };
      })
    );
    res.status(200).json(updatedStocks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a single stock by ticker
exports.getStockByTicker = async (req, res) => {
  try {
    const stock = await Stock.findOne({ ticker: req.params.ticker });
    if (!stock) {
      return res.status(404).json({ error: 'Stock not found' });
    }
    const { price } = await fetchStockPrice(stock.ticker);
    res.status(200).json({ ...stock._doc, currentPrice: price });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add a new stock
exports.addStock = async (req, res) => {
  const { stockName, ticker, quantity, buyPrice, currentPrice, totalValue } = req.body;

  // ✅ Validate required fields
  if (!stockName || !ticker || !quantity || !buyPrice) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  try {
    const stock = await Stock.create({
      stockName,
      ticker,
      quantity,
      buyPrice,
      currentPrice: currentPrice || 0, // Default to 0 if not provided
      totalValue: totalValue || quantity * (currentPrice || buyPrice), // Default totalValue if missing
    });

    res.status(201).json({ message: "Stock added successfully.", stock });
  } catch (err) {
    if (err.code === 11000) {
      res.status(409).json({ error: "Duplicate stock entry detected." });
    } else {
      res.status(400).json({ error: err.message });
    }
  }
};

// Update a stock
exports.updateStock = async (req, res) => {
  try {
    const updatedStock = await Stock.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedStock) {
      return res.status(404).json({ error: 'Stock not found' });
    }
    res.status(200).json(updatedStock);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a stock
exports.deleteStock = async (req, res) => {
  try {
    const deletedStock = await Stock.findByIdAndDelete(req.params.id);
    if (!deletedStock) {
      return res.status(404).json({ error: 'Stock not found' });
    }
    res.status(200).json({ message: 'Stock deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get portfolio metrics
exports.getPortfolioMetrics = async (req, res) => {
  try {
    const stocks = await Stock.find();
    let totalValue = 0;
    let topStock = { name: '', ticker: '', performance: 0 };

    for (let stock of stocks) {
      const { price, changePercent } = await fetchStockPrice(stock.ticker);
      const stockValue = price * stock.quantity;
      totalValue += stockValue;
      if (parseFloat(changePercent) > topStock.performance) {
        topStock = { name: stock.stockName, ticker: stock.ticker, performance: parseFloat(changePercent) };
      }
    }

    res.status(200).json({
      totalValue,
      topStock,
      stockCount: stocks.length,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
