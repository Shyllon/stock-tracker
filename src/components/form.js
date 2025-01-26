import React, { useState, useEffect } from 'react';
import './stockForm.css'; // Import the custom CSS file for specific styles

function StockForm({ onSubmit, editStock, onCancelEdit }) {
  const [stock, setStock] = useState({
    stockName: '',
    quantity: '',
    buyPrice: '',
    currentPrice: ''  // Add currentPrice field for better handling
  });

  // Load the selected stock into the form when editing
  useEffect(() => {
    if (editStock) {
      setStock(editStock);
    }
  }, [editStock]);

  const handleChange = (e) => {
    setStock({ ...stock, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Ensure correct types are passed for number fields
    const finalStock = {
      ...stock,
      buyPrice: Number(stock.buyPrice),  // Convert to number
      quantity: Number(stock.quantity),  // Convert to number
      currentPrice: stock.currentPrice ? Number(stock.currentPrice) : null,  // Handle undefined
    };

    onSubmit(finalStock);  // Call onSubmit with the final stock data
    setStock({ stockName: '', quantity: '', buyPrice: '', currentPrice: '' });  // Clear form
  };

  return (
    <div className="mt-4 form-container">
      <h2 className="text-center">{editStock ? 'Edit Stock' : 'Add Stock'}</h2>
      <form onSubmit={handleSubmit} className="form-style">
        <div className="mb-3">
          <label className="form-label">Stock Symbol</label>
          <input 
            type="text" 
            className="form-control" 
            name="stockName" 
            value={stock.stockName} 
            onChange={handleChange} 
            required 
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Quantity</label>
          <input 
            type="number" 
            className="form-control" 
            name="quantity" 
            value={stock.quantity} 
            onChange={handleChange} 
            required 
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Buy Price</label>
          <input 
            type="number" 
            className="form-control" 
            name="buyPrice" 
            value={stock.buyPrice} 
            onChange={handleChange} 
            required 
          />
        </div>
        {/* Optional field for current stock price */}
        <div className="mb-3">
          <label className="form-label">Current Price</label>
          <input 
            type="number" 
            className="form-control" 
            name="currentPrice" 
            value={stock.currentPrice || ''} 
            onChange={handleChange} 
          />
        </div>

        <div className="d-flex justify-content-between">
          {/* Button to either add or update stock */}
          <button 
            type="submit" 
            className="btn btn-success"
          >
            {editStock ? 'Update Stock' : 'Add Stock'}
          </button>

          {/* Cancel button when editing */}
          {editStock && (
            <button 
              type="button" 
              className="btn btn-secondary ms-2" 
              onClick={onCancelEdit}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default StockForm;
