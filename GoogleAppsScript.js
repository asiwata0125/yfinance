/**
 * Google Apps Script for retrieving stock prices at earnings announcement dates
 * 
 * This script provides a custom function for Google Sheets that fetches stock prices
 * at earnings announcement dates for a given ticker symbol and year using Yahoo Finance API.
 * 
 * Usage in Google Sheets:
 *   =getEarningsStockPrice("AAPL", 2023)
 *   =getEarningsStockPrice("MSFT", 2024)
 * 
 * @param {string} ticker - Stock ticker symbol (e.g., "AAPL", "MSFT", "GOOGL")
 * @param {number} year - Year to retrieve earnings data for (e.g., 2023, 2024)
 * @return {Array} 2D array with earnings dates and corresponding stock prices
 */
function getEarningsStockPrice(ticker, year) {
  try {
    // Validate inputs
    if (!ticker || typeof ticker !== 'string') {
      return [["Error: Invalid ticker symbol"]];
    }
    
    if (!year || typeof year !== 'number' || year < 1900 || year > 2100) {
      return [["Error: Invalid year"]];
    }
    
    ticker = ticker.toString().trim().toUpperCase();
    
    // Get earnings dates from Yahoo Finance
    const earningsData = getEarningsDates(ticker);
    
    if (!earningsData || earningsData.length === 0) {
      return [["No earnings data found for " + ticker]];
    }
    
    // Filter earnings for the specified year and get stock prices
    const results = [["Earnings Date", "Stock Price (Close)"]];
    
    for (let i = 0; i < earningsData.length; i++) {
      const earningsDate = new Date(earningsData[i].date);
      
      if (earningsDate.getFullYear() === year) {
        const stockPrice = getStockPriceOnDate(ticker, earningsData[i].date);
        results.push([
          Utilities.formatDate(earningsDate, Session.getScriptTimeZone(), "yyyy-MM-dd"),
          stockPrice
        ]);
      }
    }
    
    if (results.length === 1) {
      return [["No earnings data found for year " + year]];
    }
    
    return results;
    
  } catch (error) {
    Logger.log("Error in getEarningsStockPrice: " + error.toString());
    return [["Error: " + error.toString()]];
  }
}

/**
 * Fetches earnings dates for a given ticker from Yahoo Finance
 * 
 * @param {string} ticker - Stock ticker symbol
 * @return {Array} Array of earnings date objects
 */
function getEarningsDates(ticker) {
  try {
    // Yahoo Finance calendar earnings URL
    const url = "https://finance.yahoo.com/calendar/earnings?symbol=" + ticker + "&offset=0&size=100";
    
    const response = UrlFetchApp.fetch(url, {
      'method': 'get',
      'muteHttpExceptions': true,
      'headers': {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36'
      }
    });
    
    if (response.getResponseCode() !== 200) {
      throw new Error("Failed to fetch earnings data. HTTP Status: " + response.getResponseCode());
    }
    
    const html = response.getContentText();
    
    // Parse earnings dates from HTML
    const earningsDates = parseEarningsDatesFromHTML(html);
    
    return earningsDates;
    
  } catch (error) {
    Logger.log("Error in getEarningsDates: " + error.toString());
    throw error;
  }
}

/**
 * Parses earnings dates from Yahoo Finance HTML response
 * 
 * @param {string} html - HTML content from Yahoo Finance
 * @return {Array} Array of earnings date objects with date field
 */
function parseEarningsDatesFromHTML(html) {
  const earningsDates = [];
  
  try {
    // Parse table data from HTML
    // This is a simplified parser - Yahoo's structure may change
    const datePattern = /(\w+\s+\d+,\s+\d{4})/g;
    const dates = html.match(datePattern);
    
    if (dates && dates.length > 0) {
      for (let i = 0; i < Math.min(dates.length, 100); i++) {
        try {
          const dateStr = dates[i];
          const date = new Date(dateStr);
          if (!isNaN(date.getTime())) {
            earningsDates.push({ date: dateStr });
          }
        } catch (e) {
          // Skip invalid dates
        }
      }
    }
    
  } catch (error) {
    Logger.log("Error parsing earnings dates: " + error.toString());
  }
  
  return earningsDates;
}

/**
 * Gets stock price on a specific date using Yahoo Finance API
 * 
 * @param {string} ticker - Stock ticker symbol
 * @param {string} dateStr - Date string (e.g., "January 15, 2024")
 * @return {number} Stock closing price on the specified date
 */
function getStockPriceOnDate(ticker, dateStr) {
  try {
    const date = new Date(dateStr);
    
    // Add some buffer days to account for weekends and holidays
    const startDate = new Date(date);
    startDate.setDate(startDate.getDate() - 3);
    
    const endDate = new Date(date);
    endDate.setDate(endDate.getDate() + 3);
    
    const period1 = Math.floor(startDate.getTime() / 1000);
    const period2 = Math.floor(endDate.getTime() / 1000);
    
    // Yahoo Finance v8 API for historical data
    const url = "https://query2.finance.yahoo.com/v8/finance/chart/" + ticker + 
                "?period1=" + period1 + 
                "&period2=" + period2 + 
                "&interval=1d";
    
    const response = UrlFetchApp.fetch(url, {
      'method': 'get',
      'muteHttpExceptions': true,
      'headers': {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36'
      }
    });
    
    if (response.getResponseCode() !== 200) {
      Logger.log("Failed to fetch stock price. HTTP Status: " + response.getResponseCode());
      return "N/A";
    }
    
    const data = JSON.parse(response.getContentText());
    
    if (!data.chart || !data.chart.result || data.chart.result.length === 0) {
      return "N/A";
    }
    
    const result = data.chart.result[0];
    const timestamps = result.timestamp;
    const quotes = result.indicators.quote[0];
    
    if (!timestamps || !quotes || !quotes.close) {
      return "N/A";
    }
    
    // Find the closest date to the earnings date
    const targetTime = date.getTime() / 1000;
    let closestIndex = 0;
    let minDiff = Math.abs(timestamps[0] - targetTime);
    
    for (let i = 1; i < timestamps.length; i++) {
      const diff = Math.abs(timestamps[i] - targetTime);
      if (diff < minDiff) {
        minDiff = diff;
        closestIndex = i;
      }
    }
    
    const closePrice = quotes.close[closestIndex];
    
    if (closePrice === null || closePrice === undefined) {
      return "N/A";
    }
    
    return Math.round(closePrice * 100) / 100; // Round to 2 decimal places
    
  } catch (error) {
    Logger.log("Error in getStockPriceOnDate: " + error.toString());
    return "N/A";
  }
}

/**
 * Gets historical stock prices for a given year
 * Note: This function returns raw price data, not earnings-specific data.
 * For earnings dates and prices, use getEarningsStockPrice() instead.
 * 
 * Usage in Google Sheets:
 *   =getHistoricalPrices("AAPL", 2023)
 * 
 * @param {string} ticker - Stock ticker symbol
 * @param {number} year - Year to retrieve data for
 * @return {Array} 2D array with message or historical price data
 */
function getHistoricalPrices(ticker, year) {
  try {
    // Validate inputs
    if (!ticker || typeof ticker !== 'string') {
      return [["Error: Invalid ticker symbol"]];
    }
    
    if (!year || typeof year !== 'number') {
      return [["Error: Invalid year"]];
    }
    
    ticker = ticker.toString().trim().toUpperCase();
    
    // Calculate date range for the year
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);
    const period1 = Math.floor(startDate.getTime() / 1000);
    const period2 = Math.floor(endDate.getTime() / 1000);
    
    // Get historical stock prices for the entire year
    const url = "https://query2.finance.yahoo.com/v8/finance/chart/" + ticker + 
                "?period1=" + period1 + 
                "&period2=" + period2 + 
                "&interval=1d&events=div,split";
    
    const response = UrlFetchApp.fetch(url, {
      'method': 'get',
      'muteHttpExceptions': true,
      'headers': {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36'
      }
    });
    
    if (response.getResponseCode() !== 200) {
      return [["Error: Failed to fetch data. HTTP Status: " + response.getResponseCode()]];
    }
    
    const data = JSON.parse(response.getContentText());
    
    if (!data.chart || !data.chart.result || data.chart.result.length === 0) {
      return [["Error: No data found for " + ticker]];
    }
    
    // Note: This function provides the historical price data structure
    // To get actual earnings dates, we need to use the calendar API or scraping
    // For now, return a message guiding the user
    return [[
      "Note: Use getEarningsStockPrice() function instead.",
      "This function requires earnings calendar data which needs separate API call."
    ]];
    
  } catch (error) {
    Logger.log("Error in getEarningsHistory: " + error.toString());
    return [["Error: " + error.toString()]];
  }
}
