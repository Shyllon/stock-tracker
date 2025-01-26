import React from 'react';

function Dashboard({ totalValue, topStock, portfolioDistribution }) {
  return (
    <div className="dashboard mb-5">
      <h2 className="mb-4 text-center">Portfolio Dashboard</h2>
      <div className="row">
        <div className="col-md-4">
          <div className="card text-white bg-primary mb-3">
            <div className="card-body">
              <h5 className="card-title">Total Portfolio Value</h5>
              <p className="card-text">${totalValue.toFixed(2)}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-white bg-success mb-3">
            <div className="card-body">
              <h5 className="card-title">Top Performing Stock</h5>
              {topStock ? (
                <>
                  <p className="card-text">
                    <strong>{topStock.stockName}</strong>
                  </p>
                  <p className="card-text">
                    Total Value: ${topStock.totalValue.toFixed(2)}
                  </p>
                </>
              ) : (
                <p className="card-text">No stocks yet.</p>
              )}
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-white bg-info mb-3">
            <div className="card-body">
              <h5 className="card-title">Portfolio Distribution</h5>
              <p className="card-text">{portfolioDistribution}% diversified</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
