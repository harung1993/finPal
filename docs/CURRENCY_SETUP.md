# Currency and Exchange Rate Setup

## Overview

DollarDollar now includes comprehensive multi-currency support with automatic exchange rate updates.

## Features

### 1. Multi-Currency Support (22 Currencies)

The system now seeds **22 major world currencies** during fresh installation:

#### Base Currency
- **USD** - US Dollar ($)

#### Major Currencies
- **EUR** - Euro (€)
- **GBP** - British Pound (£)
- **JPY** - Japanese Yen (¥)
- **CAD** - Canadian Dollar (C$)
- **AUD** - Australian Dollar (A$)
- **CHF** - Swiss Franc (CHF)

#### Asian Currencies
- **CNY** - Chinese Yuan (¥)
- **INR** - Indian Rupee (₹)
- **KRW** - South Korean Won (₩)
- **SGD** - Singapore Dollar (S$)
- **HKD** - Hong Kong Dollar (HK$)

#### Latin American Currencies
- **MXN** - Mexican Peso (Mex$)
- **BRL** - Brazilian Real (R$)

#### Middle Eastern Currencies
- **AED** - UAE Dirham (د.إ)
- **SAR** - Saudi Riyal (ر.س)

#### Other Major Economies
- **NZD** - New Zealand Dollar (NZ$)
- **ZAR** - South African Rand (R)
- **SEK** - Swedish Krona (kr)
- **NOK** - Norwegian Krone (kr)
- **DKK** - Danish Krone (kr)
- **PLN** - Polish Zloty (zł)

### 2. Automatic Exchange Rate Updates

Exchange rates are automatically updated **daily at 2:00 AM EST** using the free Frankfurter API.

#### Technical Details
- **API Provider**: [Frankfurter](https://api.frankfurter.app/) (free, no API key required)
- **Update Frequency**: Daily at 2:00 AM EST
- **Scheduler**: APScheduler (Flask-APScheduler)
- **Base Currency**: USD (all rates relative to USD)

#### How It Works
```python
# Scheduled task runs daily at 2 AM
@scheduler.task('cron', id='update_exchange_rates', hour=2, minute=0)
def scheduled_exchange_rate_update():
    from src.services.currency.service import CurrencyService
    currency_service = CurrencyService()
    updated_count = currency_service.update_exchange_rates()
    # Logs success/failure
```

The `CurrencyService.update_exchange_rates()` method:
1. Gets the base currency (USD)
2. Fetches latest rates from Frankfurter API: `https://api.frankfurter.app/latest?from=USD`
3. Updates `rate_to_base` for all currencies
4. Updates `last_updated` timestamp
5. Returns count of currencies updated

### 3. Currency Conversion

The system includes utilities for converting between currencies:

```python
from src.utils.currency_converter import convert_currency

# Convert $100 USD to EUR
amount_eur = convert_currency(100, 'USD', 'EUR')
```

Conversion logic:
1. Convert source amount to base currency (USD): `amount * from_currency.rate_to_base`
2. Convert from base to target currency: `base_amount / to_currency.rate_to_base`

## Setup for New Installations

When running a fresh installation, all currencies are automatically seeded:

```bash
# Full fresh install (drops DB, creates currencies, seeds demo data)
docker exec dollardollar-backend /venv/bin/flask fresh-install --force

# Or just reset DB (includes currencies)
docker exec dollardollar-backend /venv/bin/flask reset-db
```

## Testing Exchange Rate Updates

To manually test exchange rate updates:

```bash
# Run the test script
docker exec dollardollar-backend /venv/bin/python test_currencies.py
```

This will:
- Display all currencies in the database
- Manually trigger an exchange rate update
- Show updated rates with timestamps

## Files Modified

1. **`/dollardollar/src/__init__.py`**
   - Added `scheduled_exchange_rate_update()` task (line 325-341)

2. **`/dollardollar/src/cli.py`**
   - Expanded `create_default_currencies()` from 7 to 22 currencies (line 166-210)

3. **`/dollardollar/src/services/currency/service.py`**
   - Contains `update_exchange_rates()` method (uses Frankfurter API)

4. **`/dollardollar/src/models/currency.py`**
   - Currency model with exchange rate fields

5. **`/dollardollar/src/utils/currency_converter.py`**
   - Currency conversion utilities

## Scheduled Tasks

The application now runs 3 scheduled tasks:

| Task | Schedule | Description |
|------|----------|-------------|
| `monthly_reports` | 1st day of month, 1:00 AM | Send monthly financial reports |
| `simplefin_sync` | Daily, 11:00 PM | Sync SimpleFin bank accounts |
| `update_exchange_rates` | Daily, 2:00 AM | Update currency exchange rates |

## API Endpoints

The currency service provides REST API endpoints:

- **GET** `/api/v1/currencies` - List all currencies
- **GET** `/api/v1/currencies/<code>` - Get specific currency
- **POST** `/api/v1/currencies/convert` - Convert between currencies
- **POST** `/api/v1/currencies/update-rates` - Manually trigger rate update

## Database Schema

```sql
CREATE TABLE currencies (
    code VARCHAR(3) PRIMARY KEY,          -- ISO 4217 code (USD, EUR, etc.)
    name VARCHAR(50) NOT NULL,            -- Currency name
    symbol VARCHAR(5) NOT NULL,           -- Currency symbol ($, €, etc.)
    rate_to_base FLOAT NOT NULL,          -- Exchange rate relative to USD
    is_base BOOLEAN DEFAULT FALSE,        -- Whether this is the base currency
    last_updated TIMESTAMP                -- When rates were last updated
);
```

## Notes

- **Base currency is USD**: All exchange rates are relative to the US Dollar
- **Rate updates are automatic**: No manual intervention needed
- **Rates persist in database**: Updated daily and stored for offline use
- **Free API with no limits**: Frankfurter API has no rate limits or API key requirements
- **Existing installations**: Will have old 7-currency set until next fresh install
- **Backwards compatible**: Old currency data remains functional

## Future Enhancements

Potential improvements:
- Allow users to set custom base currency
- Historical exchange rate tracking
- Manual rate override for specific currencies
- Alternative API providers as fallbacks
- Currency conversion in transaction import
- Multi-currency budget support
