# Yahoo Finance Rate Limits & Best Practices

## Overview

The DollarDollar investment feature uses **yfinance** (Yahoo Finance API) to fetch real-time stock data. This document explains rate limits and how we handle them.

## Rate Limits

### Yahoo Finance Limits (Unofficial)

Yahoo Finance does **not** publish official rate limits, but based on community testing:

| Metric | Limit (Estimated) |
|--------|-------------------|
| Requests per hour | ~2,000 |
| Requests per second | 1-2 recommended |
| Daily requests | No hard limit |
| Concurrent requests | Avoid bursts |

**Important Notes:**
- Limits are **per IP address**
- Exceeding limits may result in temporary blocks (15-60 minutes)
- Yahoo may change limits without notice
- Free tier has no official SLA

### What Happens When Rate Limited?

If you exceed limits:
```
1. First offense: Slow responses (throttling)
2. Continued abuse: HTTP 429 errors
3. Severe abuse: Temporary IP ban (15-60 min)
```

## Our Protection Strategy ✅

### 1. File-Based Caching System

**Implementation**: `integrations/investments/yfinance.py:38-270`

```python
cache = YFinanceCache(
    cache_dir='instance/yfcache',  # Cache location
    expire_seconds=86400            # 24 hour cache
)
```

**How it Works:**
- ✅ Every API response is cached to disk
- ✅ Cached for **24 hours** (configurable)
- ✅ Subsequent requests use cache (no API call)
- ✅ Cache files automatically expire
- ✅ Separate cache per stock symbol

**Cache Hit Ratio:**
```
Expected cache hit rate: 95%+
(Most users check their portfolios multiple times per day)
```

### 2. Smart API Calls

**Only fetch when necessary:**

```python
# ✅ GOOD: Fetch once, cache, reuse
investment = db.session.query(Investment).first()
stock_data = yf_cache.get_ticker_info(investment.symbol)

# ❌ BAD: Fetch in loop without cache
for investment in investments:
    yf.Ticker(investment.symbol).info  # No cache!
```

**Our implementation** (investments.py:195-211):
```python
# Update current prices from yfinance
for investment in investments:
    stock_data = yf_cache.get_ticker_info(investment.symbol)
    if stock_data:
        investment.current_price = stock_data.get('price', 0)
        investment.last_update = datetime.utcnow()

# Commit once after all updates
db.session.commit()
```

### 3. Batch Processing

The API updates all holdings in a single request:
```
GET /api/v1/investments/holdings
→ Fetches 10 stocks → ~10 API calls (or 0 if cached)
→ NOT 10 separate API endpoints
```

## Testing Cache Performance

Run the test script to verify caching:

```bash
cd dollardollar
python test_yfinance_cache.py
```

**Expected Output:**
```
1️⃣  First Run - Should hit API
Fetching AAPL... ✅ Got price: $178.25
⏱️  First run took: 5.23 seconds

2️⃣  Second Run - Should use cache
Fetching AAPL... ✅ Got price: $178.25 (cached)
⏱️  Second run took: 0.03 seconds

Speedup: 174.3x faster
API calls saved: 5 calls
```

## Monitoring & Maintenance

### Check Cache Statistics

```python
from integrations.investments.yfinance import YFinanceCache

cache = YFinanceCache()
stats = cache.get_stats()

print(stats)
# Output:
# {
#   'total_requests': 1000,
#   'cache_hits': 950,
#   'cache_misses': 50,
#   'hit_rate': '95.0%',
#   'cache_expiry': '24 hours'
# }
```

### Clear Expired Cache

```python
# Clear only expired entries
count = cache.clear_expired()
print(f"Cleared {count} expired cache files")

# Clear ALL cache (force refresh)
count = cache.clear_all()
print(f"Cleared {count} cache files")
```

### Cache File Location

```bash
dollardollar/instance/yfcache/
├── info_AAPL.json       # Apple stock data
├── info_MSFT.json       # Microsoft stock data
├── history_AAPL_1mo.json  # Apple 1-month chart
└── ...
```

## Rate Limit Scenarios

### Scenario 1: Small Portfolio (10 stocks)
```
User opens app:
- First time: 10 API calls
- Rest of day: 0 API calls (cached)
- Next day: 10 API calls (cache expired)

Daily API calls: 10
Monthly API calls: ~300
✅ Well within limits
```

### Scenario 2: Large Portfolio (100 stocks)
```
User opens app:
- First time: 100 API calls
- Rest of day: 0 API calls (cached)
- Next day: 100 API calls

Daily API calls: 100
Monthly API calls: ~3,000
✅ Still safe
```

### Scenario 3: Many Users (100 users, 10 stocks each)
```
All users open app at same time (worst case):
- Total: 1,000 API calls in ~10 minutes
- Rate: ~100 requests/minute
- After cache warm-up: Near-zero API calls

✅ Within limits due to:
- Staggered user activity
- 24-hour cache
- Different stock symbols shared across users
```

## Best Practices

### ✅ DO:
1. **Use the cache** - Always use `YFinanceCache`, not `yf.Ticker()` directly
2. **Batch updates** - Update all stocks in one request, not individual API calls
3. **Set reasonable cache duration** - 24 hours is good for stock data
4. **Handle errors gracefully** - Don't retry immediately on failure
5. **Log API calls** - Monitor actual usage

### ❌ DON'T:
1. **Don't bypass cache** - Never call yfinance directly
2. **Don't update too frequently** - Stock prices don't change every second
3. **Don't retry aggressively** - Wait before retrying failed requests
4. **Don't fetch unnecessary data** - Only fetch what you need
5. **Don't ignore cache expiry** - Let the system handle cache refresh

## Troubleshooting

### Problem: "429 Too Many Requests"

**Cause**: Rate limit exceeded

**Solution**:
```bash
# 1. Check cache is working
python test_yfinance_cache.py

# 2. Increase cache duration (temporary)
# In investments.py:19
yf_cache = YFinanceCache(expire_seconds=172800)  # 48 hours

# 3. Wait 15-60 minutes before retrying

# 4. Check if you're making direct yf.Ticker() calls
grep -r "yf.Ticker" api/v1/investments.py
# Should only be inside YFinanceCache class
```

### Problem: Stale Stock Prices

**Cause**: Cache too long

**Solution**:
```python
# Reduce cache duration for development
yf_cache = YFinanceCache(expire_seconds=3600)  # 1 hour

# Or force refresh specific stock
cache.clear_all()  # Clear everything
```

### Problem: Slow First Load

**Expected behavior!**

**Explanation**:
- First API call: ~500ms per stock
- Cached calls: <5ms per stock
- This is normal and expected

**Optional improvement** (future):
```python
# Pre-warm cache for popular stocks
def warm_cache():
    popular = ['AAPL', 'MSFT', 'GOOGL', 'TSLA', 'AMZN']
    for symbol in popular:
        yf_cache.get_ticker_info(symbol)
```

## Advanced: Custom Cache Duration

### Market Hours-Aware Caching

```python
from datetime import datetime
import pytz

def get_smart_cache_duration():
    """
    Shorter cache during market hours,
    longer cache outside market hours
    """
    eastern = pytz.timezone('US/Eastern')
    now = datetime.now(eastern)

    # Market hours: 9:30 AM - 4:00 PM ET
    if now.weekday() < 5:  # Monday-Friday
        if 9 <= now.hour < 16:
            return 300  # 5 minutes during market hours

    return 86400  # 24 hours outside market hours

# Use it:
cache = YFinanceCache(expire_seconds=get_smart_cache_duration())
```

## API Usage Estimation

### Realistic Usage Pattern

**Small App (10 users):**
```
Daily API calls: ~100
Monthly API calls: ~3,000
Yearly API calls: ~36,000
✅ No issues
```

**Medium App (100 users):**
```
Daily API calls: ~1,000
Monthly API calls: ~30,000
Yearly API calls: ~360,000
✅ Safe with caching
```

**Large App (1,000+ users):**
```
Daily API calls: ~10,000+
Consider:
- Paid data provider (Alpha Vantage, IEX Cloud)
- Websocket for real-time data
- Pre-populate cache during off-hours
```

## Alternatives (If Needed)

If you exceed Yahoo Finance limits:

### 1. Alpha Vantage (Free Tier)
- **Limit**: 500 calls/day
- **Cost**: Free / $50/month premium
- **Pros**: Official API, reliable
- **Cons**: Lower free tier limit

### 2. IEX Cloud
- **Limit**: 50,000 calls/month free
- **Cost**: Free / $9/month starter
- **Pros**: Developer-friendly, good docs
- **Cons**: US markets only

### 3. Finnhub
- **Limit**: 60 calls/minute free
- **Cost**: Free / $19/month
- **Pros**: Real-time data
- **Cons**: Limited free tier

### 4. Polygon.io
- **Limit**: Varies
- **Cost**: $29/month
- **Pros**: Professional grade
- **Cons**: No free tier

## Summary

### Current Setup ✅

| Component | Status |
|-----------|--------|
| Caching enabled | ✅ Yes (24 hours) |
| Cache location | ✅ instance/yfcache/ |
| Rate limit protection | ✅ Yes |
| Error handling | ✅ Yes |
| Logging | ✅ Yes |
| Testing script | ✅ Available |

### Recommended Monitoring

Add to your monitoring:
```python
# Track API calls per day
# Alert if > 1,000 calls/hour
# Alert on 429 errors
# Monitor cache hit ratio (should be >90%)
```

### Next Steps

1. ✅ Install yfinance: `pip install yfinance>=0.2.28`
2. ✅ Test cache: `python test_yfinance_cache.py`
3. ✅ Monitor usage in production
4. ✅ Adjust cache duration if needed
5. ⏸️  Add monitoring/alerts (optional)
6. ⏸️  Consider paid provider for >1000 users (future)

---

**Last Updated**: December 27, 2024
**yfinance Version**: 0.2.28+
**Cache Strategy**: File-based, 24-hour expiry
**Status**: ✅ Production ready
