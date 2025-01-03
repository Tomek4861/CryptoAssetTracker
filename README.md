# Crypto Asset Tracker

**Crypto Asset Tracker** is a web-based clone of trading platforms like TradingView. It enables users to visualize
cryptocurrency prices through candlestick charts, manage their watchlists, and monitor their portfolios. The app includes account management features like registration and login for saving user preferences.

## Key Features

1. **Candlestick Charts**:
    - View (almost) live price movements for various cryptocurrencies.
    - Dynamic updates based on user-selected coins, currencies, and timeframes.
    - Efficient Data Fetching - Responses for chart and coin price endpoints are cached to improve performance.


2. **Watchlist Management**:
    - Add and remove cryptocurrencies to/from a personal watchlist.
    - Display current prices and percentage changes over the last 24 hours.

3. **Portfolio Tracker**:
    - Add, update, and remove cryptocurrencies in a user portfolio.
    - View portfolio value and track daily price changes.

4. **User Authentication**:
    - Secure user registration and login system.
    - Personalized watchlists and portfolios tied to user accounts.

## Technologies Used

- **Backend**: Django (with Django Rest Framework for APIs)
- **Frontend**: Bootstrap, JavaScript, and ApexCharts
- **Database**: SQLite (default)
- **Third-party APIs**: CoinGecko for cryptocurrency data

## Screenshots

### Home Page with Candlestick Charts

![Home Page](https://github.com/user-attachments/assets/0595234d-ecf7-4d00-83a9-46e55e65587a)

### Portfolio Management

![Portfolio](![image](https://github.com/user-attachments/assets/fdfd1d07-c72a-4ec9-b766-5c6aed64f448))

### Login/Register Page

![Login/Register](![image](https://github.com/user-attachments/assets/04d9509e-f42a-40ee-b5d9-5fcb93f2b6d5)
)

## Installation and Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/Tomek4861/CryptoAssetTracker
   cd CryptoAssetTracker
   ```
2. Create a virtual environment and activate it:
   ```bash
   python -m venv venv
   source venv\Scripts\activate 
   ```
3. Install the dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Run migrations:
   ```bash
   python manage.py migrate
   ```
5. Create a `.env` file with the following environment variables:

   ```plaintext
   COINGECKO_API_KEY=<Your CoinGecko API Key>
   DJANGO_SECRET_KEY=<Your Django Secret Key>
   ```

   Save this file in the root directory of the project.


6. Start the development server:
   ```bash
   python manage.py runserver
   ```

## Future Improvements (Very Soon)

- **Hosting**: Deploy the app to a production-ready server.
- **Frontend Code Cleanup**: Refactor and optimize JavaScript, CSS  code.
- **Mobile Optimization**: Enhance UI for mobile devices.
- **Additional Features**:
    - More timeframes, more charting options (If I would find better price api)

## Contributions

Contributions are welcome! Feel free to fork the repository and submit a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.
