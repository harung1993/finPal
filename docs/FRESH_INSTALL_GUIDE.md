# Fresh Install & Demo Data Guide

## Quick Start: Fresh Install with Demo Data

To get a clean database with 3 demo accounts pre-loaded with mock data, run:

```bash
docker exec -it dollardollar-api-1 flask fresh-install
```

This will:
1. ✅ Reset the entire database (delete all data)
2. ✅ Create default currencies
3. ✅ Create 3 demo user accounts with:
   - 18 main categories + 100+ subcategories (with emoji icons)
   - 100+ auto-categorization rules
   - 20+ realistic mock transactions
   - 3 bank accounts per user
   - Budget allocations
   - Investment portfolios (for Carol)
4. ✅ Display login credentials

## Demo Account Credentials

After running `fresh-install`, you'll get 3 demo accounts:

### 👤 Alice Johnson (Personal Finance User)
- **Email**: `alice@example.com`
- **Password**: `demo123`
- **Profile**: Personal finance enthusiast, tracks groceries and dining carefully
- **Transactions**: Salary, groceries, dining, utilities, entertainment

### 💼 Bob Smith (Business Owner)
- **Email**: `bob@example.com`
- **Password**: `demo123`
- **Profile**: Small business owner, tracks business expenses and income
- **Transactions**: Client invoices, office supplies, software, marketing, business meals

### 📈 Carol Williams (Investor)
- **Email**: `carol@example.com`
- **Password**: `demo123`
- **Profile**: Active investor, tracks portfolio and investment income
- **Transactions**: Dividends, rental income, stock purchases, consulting, property expenses
- **Investments**: 3 portfolios (Growth, Income, Speculative) with 12+ stock holdings

## Individual Commands

### Seed Demo Data Only
If you already have a database and just want to add demo users:

```bash
docker exec -it dollardollar-api-1 flask seed-demo
```

### Delete Demo Users
To remove all demo users and their data:

```bash
docker exec -it dollardollar-api-1 flask delete-demo
```

### Reset Database Only
To reset the database without demo data:

```bash
docker exec -it dollardollar-api-1 flask reset-db
```

### Initialize Empty Database
To create a fresh empty database:

```bash
docker exec -it dollardollar-api-1 flask init-db
```

## What's Included in Demo Accounts

Each demo account comes with:

### 📁 Categories (18 main + 100+ subcategories)
- Income (Salary, Freelance, Business, Dividends, etc.)
- Housing (Rent, Mortgage, Utilities, etc.)
- Transportation (Fuel, Public Transit, Rideshare, etc.)
- Food & Dining (Groceries, Restaurants, Coffee, etc.)
- Shopping, Entertainment, Healthcare, Fitness, Travel, Education, and more!

### ⚡ Transaction Rules (100+)
Smart auto-categorization rules that match common merchants:
- `netflix` → Entertainment/Streaming Services
- `starbucks` → Dining/Coffee Shops
- `whole foods` → Groceries
- `uber` → Transportation/Rideshare
- `salary|payroll|paycheck` → Income/Salary
- And 95+ more patterns!

### 💳 Transactions (20+ per user)
Realistic mock transactions for January-February 2025:
- Mix of income and expenses
- Automatically categorized by rules
- Different patterns for each user type (personal, business, investor)

### 🏦 Bank Accounts (3 per user)
- Checking account (with positive balance)
- Savings account (with larger balance)
- Credit card (with negative balance)

### 📊 Budgets
Pre-configured budget allocations matching each user's profile

### 💼 Investment Portfolios (Carol only)
Carol's investor account includes:
- **Growth Portfolio**: AAPL, MSFT, NVDA, GOOGL, VOO (tech stocks & S&P 500 ETF)
- **Income Portfolio**: JNJ, PG, VYM, KO (dividend aristocrats & high-yield ETF)
- **Speculative Portfolio**: TSLA, COIN, ARKK (high-risk growth plays)
- Total of 12 individual holdings across 3 portfolios
- Real-world stock symbols with purchase prices and current values
- Automatic gain/loss calculations

## Testing the Rules System

After fresh install, you can test:

1. **View Pre-loaded Rules**
   - Login as any demo user
   - Go to Settings → Transaction Rules
   - See 100+ default rules already configured
   - Check the statistics dashboard

2. **See Auto-categorization in Action**
   - View the Transactions page
   - Notice all transactions are already categorized
   - This happened automatically via the rules!

3. **Create New Transactions**
   - Add a transaction with description "Starbucks Coffee"
   - It will automatically be categorized as "Dining/Coffee Shops"
   - Add "Netflix Subscription" → Auto-categorized as "Entertainment/Streaming Services"

4. **Test Rule Suggestions**
   - Edit an existing transaction
   - Change its category
   - You'll get a prompt asking if you want to create a rule for similar transactions

5. **Bulk Apply Rules**
   - Go to Settings → Transaction Rules
   - Click "Apply to All Transactions"
   - Watch it re-categorize all transactions

## Docker Commands Reference

### View Container Logs
```bash
docker logs dollardollar-api-1 -f
```

### Access Container Shell
```bash
docker exec -it dollardollar-api-1 bash
```

### Restart Services
```bash
docker-compose restart
```

### Rebuild Everything
```bash
docker-compose down
docker-compose up --build -d
```

## Troubleshooting

### "Container not found"
If you get an error about container not found, check the container name:
```bash
docker ps
```
Look for the container running the Flask app and use its name.

### "Module not found"
If you get import errors, rebuild the container:
```bash
docker-compose down
docker-compose up --build -d
```

### Database Migrations
If you need to apply migrations:
```bash
docker exec -it dollardollar-api-1 flask db upgrade
```

## Database Location

The database is stored in Docker volume: `dollardollar_postgres-data`

To completely wipe everything including the database:
```bash
docker-compose down -v
docker-compose up -d
docker exec -it dollardollar-api-1 flask fresh-install
```

## Next Steps

After fresh install:

1. ✅ Login with any demo account credentials
2. ✅ Explore the pre-loaded transactions
3. ✅ Check out the Transaction Rules in Settings
4. ✅ Try creating new transactions to see auto-categorization
5. ✅ Test the bulk apply feature
6. ✅ Experiment with creating custom rules
7. ✅ Check the web UI and mobile app (if available)

## Production Warning

⚠️ **IMPORTANT**: These demo accounts use weak passwords (`demo123`) and contain mock data.

**DO NOT use fresh-install or seed-demo in production!**

For production:
- Use `flask init-db` for a clean database
- Let users register their own accounts
- They will automatically get default categories and rules
- No demo data will be created

---

Enjoy testing the DollarDollar transaction rules system! 🎉
