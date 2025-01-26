import React, { useState, useEffect } from 'react';
import axios from 'axios';  // Ensure axios is installed to make HTTP requests

function StockTable({ stocks, onDelete, onEdit, onUpdate }) {
  const [loading, setLoading] = useState(true);
  const [stockData, setStockData] = useState(stocks); // Track updated stock data with current prices

  useEffect(() => {
    if (stocks.length > 0) {
      setLoading(false);
      fetchCurrentPrices(stocks); // Fetch current prices for each stock
    }
  }, [stocks]);

  // Function to fetch the current price for each stock
  const fetchCurrentPrices = async (stocks) => {
    try {
      const updatedStocks = await Promise.all(stocks.map(async (stock) => {
        const response = await axios.get(`http://localhost:5000/api/stocks/price/${stock.ticker}`);
        const currentPrice = response.data.price || null;
        return {
          ...stock,
          currentPrice: currentPrice,  // Update stock with the fetched price
        };
      }));

      setStockData(updatedStocks);  // Update the stock data with current prices
    } catch (error) {
      console.error('Error fetching stock prices:', error);
    }
  };

  return (
    <div className="mt-4">
      <h2>Portfolio Tracker</h2>
      {loading ? (
        <p>Loading stocks...</p>
      ) : (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Stock Symbol</th>
              <th>Quantity</th>
              <th>Buy Price</th>
              <th>Current Price</th>
              <th>Value</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {stockData.length > 0 ? (
              stockData.map((stock) => (
                <tr key={stock._id}>
                  <td>{stock.stockName}</td>
                  <td>{stock.quantity}</td>
                  <td>${stock.buyPrice.toFixed(2)}</td>
                  <td>{stock.currentPrice ? `$${stock.currentPrice.toFixed(2)}` : 'N/A'}</td>
                  <td>${(stock.quantity * (stock.currentPrice || stock.buyPrice)).toFixed(2)}</td>
                  <td>
                    <button className="btn btn-primary btn-sm me-2" onClick={() => onEdit(stock)}>
                      Edit
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => onDelete(stock)}>
                      Delete
                    </button>
                    {onUpdate && (
                      <button className="btn btn-success btn-sm ms-2" onClick={() => onUpdate(stock)}>
                        Update
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">
                  No stocks added yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default StockTable;
