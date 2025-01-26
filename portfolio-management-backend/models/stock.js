const mongoose = require("mongoose");

const stockSchema = new mongoose.Schema({
  stockName: { type: String, required: true },  // e.g., Microsoft
  ticker: { type: String, required: true, unique: true },  // e.g., MSFT
  quantity: { type: Number, required: true, default: 1 },
  buyPrice: { type: Number, required: true },
  currentPrice: { type: Number, default: 0 },  // Latest stock price
  totalValue: { type: Number, default: 0 },  // quantity * currentPrice
  lastUpdated: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Stock", stockSchema);

