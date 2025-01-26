// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import axios from 'axios';  // Import Axios
import Navbar from './components/navbar';
import Dashboard from './components/dashboard';
import StockForm from './components/form';
import StockTable from './components/portfolio';

const App = () => {
  const [stocks, setStocks] = useState([]);
  const [editStock, setEditStock] = useState(null);

  // Fetch stocks from the backend on initial load
  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/stocks');
        console.log("Fetched stocks:", response.data);  // Debugging log
        setStocks(response.data);
      } catch (error) {
        console.error('Error fetching stocks:', error);
      }
    };
    fetchStocks();
  }, []);
  
  const totalValue = stocks.reduce((acc, stock) => acc + stock.quantity * stock.buyPrice, 0);
  const portfolioDistribution = stocks.length * 20; // Mock calculation
  const topStock = stocks.reduce(
    (prev, current) =>
      current.quantity * current.buyPrice > prev.totalValue
        ? { stockName: current.stockName, totalValue: current.quantity * current.buyPrice }
        : prev,
    { stockName: 'N/A', totalValue: 0 }
  );

  // Add stock to the list and make a POST request to the backend
  const addStock = async (stock) => {
    try {
      const response = await axios.post('http://localhost:5000/api/stocks', stock);
      setStocks(prevStocks => [...prevStocks, response.data]);  // Append new stock
    } catch (error) {
      console.error('Error adding stock:', error);
    }
  };
  
  // Delete stock from the list and make a DELETE request to the backend
  const deleteStock = async (stockToDelete) => {
    try {
      await axios.delete(`http://localhost:5000/api/stocks/${stockToDelete.id}`);
      setStocks(stocks.filter(stock => stock.id !== stockToDelete.id));  // Remove stock from state
    } catch (error) {
      console.error('Error deleting stock:', error);
    }
  };

  // Edit stock details (when clicking edit) and update the stock on backend
  const updateStock = async (updatedStock) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/stocks/${updatedStock.id}`, updatedStock);
      setStocks(stocks.map((stock) => (stock.id === updatedStock.id ? response.data : stock)));  // Update stock in state
      setEditStock(null);  // Exit edit mode
    } catch (error) {
      console.error('Error updating stock:', error);
    }
  };

  // Cancel Edit Mode
  const cancelEdit = () => {
    setEditStock(null);
  };

  return (
    <Router>
      <div className="container mt-5">
        <Navbar /> {/* Add Navbar here */}

        <Routes>
          <Route
            path="/"
            element={<Dashboard totalValue={totalValue} topStock={topStock} portfolioDistribution={portfolioDistribution} />}
          />
          <Route
            path="/form"
            element={<StockForm onSubmit={editStock ? updateStock : addStock} editStock={editStock} onCancelEdit={cancelEdit} />}
          />
          <Route
            path="/portfolio"
            element={
              <StockTable 
                stocks={stocks} 
                onDelete={deleteStock} 
                onEdit={setEditStock} 
                onUpdate={updateStock} // Pass onUpdate if needed
              />
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
