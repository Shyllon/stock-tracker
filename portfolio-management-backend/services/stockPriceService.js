const yahooFinance = require("yahoo-finance2").default;

async function fetchStockPrice(stockSymbol) {
    console.log("⚡ Service: fetchStockPrice called for", stockSymbol);

    if (!stockSymbol) {
        console.error("🚨 Error: stockSymbol is undefined!");
        return null;
    }

    try {
        const result = await yahooFinance.quote(stockSymbol);
        console.log("📊 Yahoo API Response:", result);

        // ✅ Check if result is null before accessing properties
        if (!result || result.regularMarketPrice === undefined) {
            console.error("🚨 Error: Yahoo API returned null or missing data for", stockSymbol);
            return null;
        }

        return result.regularMarketPrice;
    } catch (error) {
        console.error("🔥 Yahoo API Error:", error.message);
        return null;
    }
}

module.exports = { fetchStockPrice };
