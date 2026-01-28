# 💳 CreditCardDB - Open Source Credit Card Rewards Database

## 🎯 Project Vision

**"The definitive, community-maintained database of credit card rewards and benefits"**

An open-source API that any developer can use to build credit card optimization features. Think of it like "IMDB for credit cards" or "CoinGecko for credit card rewards."

---

## 🗄️ Database Schema

### **Core Tables**

```sql
-- ============================================
-- CREDIT CARDS MASTER TABLE
-- ============================================
CREATE TABLE credit_cards (
    id SERIAL PRIMARY KEY,
    card_id VARCHAR(100) UNIQUE NOT NULL,  -- 'chase-freedom-flex'
    name VARCHAR(200) NOT NULL,            -- 'Chase Freedom Flex'
    display_name VARCHAR(200),             -- 'Freedom Flex℠' (with special chars)
    issuer VARCHAR(100) NOT NULL,          -- 'Chase', 'American Express', etc.
    network VARCHAR(50),                   -- 'Visa', 'Mastercard', 'Amex', 'Discover'
    
    -- Card Details
    annual_fee DECIMAL(10,2) DEFAULT 0,
    foreign_transaction_fee DECIMAL(5,2),  -- Usually 0 or 3%
    
    -- Visual
    card_color VARCHAR(7),                 -- '#3b82f6' for UI
    card_image_url TEXT,                   -- URL to card image
    issuer_logo_url TEXT,
    
    -- Product Links
    application_url TEXT,                  -- Official application link
    terms_url TEXT,                        -- Official terms & conditions
    
    -- Metadata
    active BOOLEAN DEFAULT true,           -- Card still being issued?
    premium_card BOOLEAN DEFAULT false,    -- Premium/luxury card?
    business_card BOOLEAN DEFAULT false,   -- Business vs personal
    
    -- SEO & Discovery
    keywords TEXT[],                       -- ['travel', 'cashback', 'no-annual-fee']
    description TEXT,
    
    -- Tracking
    popularity_score INTEGER DEFAULT 0,    -- Based on user adds
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    last_verified_at TIMESTAMP,
    verified_by VARCHAR(100)               -- 'admin', 'community', 'scraper'
);

-- Indexes
CREATE INDEX idx_cards_issuer ON credit_cards(issuer);
CREATE INDEX idx_cards_active ON credit_cards(active);
CREATE INDEX idx_cards_network ON credit_cards(network);
CREATE INDEX idx_cards_keywords ON credit_cards USING gin(keywords);

-- ============================================
-- REWARD CATEGORIES
-- ============================================
CREATE TABLE card_rewards (
    id SERIAL PRIMARY KEY,
    card_id VARCHAR(100) REFERENCES credit_cards(card_id) ON DELETE CASCADE,
    
    -- Reward Details
    category VARCHAR(100) NOT NULL,        -- 'gas', 'dining', 'groceries', 'rotating'
    reward_type VARCHAR(50) DEFAULT 'cashback',  -- 'cashback', 'points', 'miles'
    reward_rate DECIMAL(5,2) NOT NULL,     -- 3.0 for 3% or 3x points
    
    -- Limits
    quarterly_limit DECIMAL(10,2),         -- $1,500 per quarter
    annual_limit DECIMAL(10,2),            -- $6,000 per year
    monthly_limit DECIMAL(10,2),           -- Rare but exists
    lifetime_limit DECIMAL(10,2),          -- Very rare
    
    -- Period
    period VARCHAR(20) NOT NULL,           -- 'monthly', 'quarterly', 'annual', 'lifetime'
    reset_day INTEGER,                     -- Day of month/quarter when limit resets
    
    -- Rotating Categories
    is_rotating BOOLEAN DEFAULT false,
    rotation_frequency VARCHAR(20),        -- 'quarterly', 'monthly'
    requires_activation BOOLEAN DEFAULT false,  -- Must activate each period?
    
    -- Restrictions
    exclusions TEXT[],                     -- ['walmart', 'target', 'warehouse_clubs']
    inclusions TEXT[],                     -- Specific merchants only
    merchant_codes TEXT[],                 -- MCC codes if applicable
    
    -- Metadata
    description TEXT,
    terms TEXT,
    notes TEXT,                            -- Special conditions
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_rewards_card ON card_rewards(card_id);
CREATE INDEX idx_rewards_category ON card_rewards(category);
CREATE INDEX idx_rewards_rotating ON card_rewards(is_rotating);

-- ============================================
-- ROTATING CATEGORY CALENDAR
-- ============================================
CREATE TABLE rotating_categories (
    id SERIAL PRIMARY KEY,
    card_id VARCHAR(100) REFERENCES credit_cards(card_id) ON DELETE CASCADE,
    
    -- Period
    year INTEGER NOT NULL,
    quarter INTEGER,                       -- 1, 2, 3, 4 (NULL if monthly rotation)
    month INTEGER,                         -- 1-12 (NULL if quarterly rotation)
    
    -- Categories for this period
    categories TEXT[] NOT NULL,            -- ['gas', 'fitness', 'streaming']
    
    -- Dates
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    
    -- Activation
    activation_required BOOLEAN DEFAULT false,
    activation_deadline DATE,
    
    -- Metadata
    announced_date DATE,                   -- When issuer announced it
    source VARCHAR(100),                   -- 'chase.com', 'scraper', 'manual'
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(card_id, year, quarter, month)
);

-- Indexes
CREATE INDEX idx_rotating_period ON rotating_categories(year, quarter);
CREATE INDEX idx_rotating_dates ON rotating_categories(start_date, end_date);

-- ============================================
-- SIGNUP BONUSES (Optional - Nice to Have)
-- ============================================
CREATE TABLE signup_bonuses (
    id SERIAL PRIMARY KEY,
    card_id VARCHAR(100) REFERENCES credit_cards(card_id) ON DELETE CASCADE,
    
    -- Bonus Details
    bonus_amount DECIMAL(10,2),            -- $200
    bonus_type VARCHAR(50),                -- 'cashback', 'points', 'miles'
    point_value DECIMAL(5,2),              -- For points/miles (e.g., 20,000 points)
    
    -- Requirements
    spending_requirement DECIMAL(10,2),    -- $500 minimum spend
    time_period_months INTEGER,            -- Within 3 months
    
    -- Restrictions
    public_offer BOOLEAN DEFAULT true,     -- vs targeted/invite-only
    in_branch_only BOOLEAN DEFAULT false,
    
    -- Dates
    valid_from DATE,
    valid_until DATE,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- ADDITIONAL BENEFITS (Optional)
-- ============================================
CREATE TABLE card_benefits (
    id SERIAL PRIMARY KEY,
    card_id VARCHAR(100) REFERENCES credit_cards(card_id) ON DELETE CASCADE,
    
    benefit_type VARCHAR(100) NOT NULL,    -- 'travel_insurance', 'purchase_protection', etc.
    description TEXT,
    value_estimate DECIMAL(10,2),          -- Estimated value
    
    created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- DATA QUALITY & AUDIT
-- ============================================
CREATE TABLE data_updates (
    id SERIAL PRIMARY KEY,
    
    -- What Changed
    entity_type VARCHAR(50) NOT NULL,      -- 'card', 'reward', 'rotating_category'
    entity_id INTEGER NOT NULL,
    action VARCHAR(20) NOT NULL,           -- 'create', 'update', 'delete'
    
    -- Change Details
    field_changed VARCHAR(100),
    old_value TEXT,
    new_value TEXT,
    full_diff JSONB,                       -- Complete before/after
    
    -- Source
    source VARCHAR(100) NOT NULL,          -- 'scraper_nerdwallet', 'manual_admin', 'user_pr', 'github_pr'
    source_url TEXT,                       -- URL where data came from
    
    -- Review
    status VARCHAR(20) DEFAULT 'pending',  -- 'pending', 'approved', 'rejected'
    reviewed_by VARCHAR(100),
    reviewed_at TIMESTAMP,
    review_notes TEXT,
    
    -- Metadata
    confidence_score DECIMAL(3,2),         -- 0.00-1.00 for ML verification
    created_at TIMESTAMP DEFAULT NOW()
);

-- Index for audit trail
CREATE INDEX idx_updates_entity ON data_updates(entity_type, entity_id);
CREATE INDEX idx_updates_status ON data_updates(status);
CREATE INDEX idx_updates_date ON data_updates(created_at DESC);

-- ============================================
-- CATEGORY TAXONOMY (Standardization)
-- ============================================
CREATE TABLE reward_categories (
    id SERIAL PRIMARY KEY,
    category_id VARCHAR(50) UNIQUE NOT NULL,  -- 'gas_station'
    display_name VARCHAR(100) NOT NULL,       -- 'Gas Stations'
    parent_category VARCHAR(50),              -- 'transportation'
    
    -- Matching
    keywords TEXT[],                          -- ['gas', 'fuel', 'shell', 'exxon']
    merchant_codes TEXT[],                    -- MCC codes ['5541', '5542']
    
    -- UI
    icon_emoji VARCHAR(10),                   -- '⛽'
    color VARCHAR(7),                         -- '#ef4444'
    
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Standard categories
INSERT INTO reward_categories (category_id, display_name, icon_emoji, color, keywords) VALUES
('gas_station', 'Gas Stations', '⛽', '#ef4444', ARRAY['gas', 'fuel', 'shell', 'chevron', 'exxon']),
('grocery', 'Groceries', '🛒', '#10b981', ARRAY['grocery', 'supermarket', 'whole foods', 'safeway']),
('dining', 'Dining & Restaurants', '🍔', '#f59e0b', ARRAY['restaurant', 'dining', 'food', 'cafe']),
('travel', 'Travel', '✈️', '#3b82f6', ARRAY['airline', 'hotel', 'travel', 'airbnb']),
('streaming', 'Streaming Services', '📺', '#8b5cf6', ARRAY['netflix', 'hulu', 'spotify', 'disney']),
('drugstore', 'Drugstores', '💊', '#ec4899', ARRAY['pharmacy', 'cvs', 'walgreens', 'rite aid']),
('transit', 'Public Transportation', '🚇', '#14b8a6', ARRAY['subway', 'bus', 'train', 'uber', 'lyft']),
('utilities', 'Utilities', '⚡', '#06b6d4', ARRAY['electric', 'gas', 'water', 'internet', 'phone']),
('online_shopping', 'Online Shopping', '🛍️', '#a855f7', ARRAY['amazon', 'ebay', 'online']),
('wholesale', 'Wholesale Clubs', '🏪', '#84cc16', ARRAY['costco', 'sams club', 'bjs']),
('home_improvement', 'Home Improvement', '🔨', '#f97316', ARRAY['home depot', 'lowes', 'hardware']),
('fitness', 'Fitness & Gym', '💪', '#22c55e', ARRAY['gym', 'fitness', 'yoga', 'sports']),
('default', 'Everything Else', '💰', '#64748b', ARRAY['all', 'everything', 'other']);

-- ============================================
-- COMMUNITY CONTRIBUTIONS
-- ============================================
CREATE TABLE contributors (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255),
    github_username VARCHAR(100),
    
    -- Stats
    contributions_count INTEGER DEFAULT 0,
    approved_count INTEGER DEFAULT 0,
    rejected_count INTEGER DEFAULT 0,
    accuracy_score DECIMAL(5,2) DEFAULT 100.00,  -- 0-100%
    
    -- Reputation
    reputation_points INTEGER DEFAULT 0,
    badges TEXT[],                         -- ['verified', 'expert', 'top_contributor']
    
    created_at TIMESTAMP DEFAULT NOW(),
    last_contribution_at TIMESTAMP
);

-- ============================================
-- USER TRACKING (For DollarPal Integration)
-- ============================================
CREATE TABLE user_credit_cards (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,         -- DollarPal user ID
    card_id VARCHAR(100) REFERENCES credit_cards(card_id),
    
    -- User's Card Details
    nickname VARCHAR(100),                 -- User's custom name
    last_four VARCHAR(4),
    custom_color VARCHAR(7),               -- Override default color
    
    -- Account Linking
    account_id INTEGER,                    -- Link to DollarPal account
    
    -- Status
    active BOOLEAN DEFAULT true,
    primary_card BOOLEAN DEFAULT false,
    
    -- Preferences
    auto_suggest BOOLEAN DEFAULT true,     -- Show suggestions for this card?
    notification_threshold INTEGER DEFAULT 80,  -- Alert at 80% of limit
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- SPENDING TRACKING (Per User, Per Card, Per Category)
-- ============================================
CREATE TABLE user_card_spending (
    id SERIAL PRIMARY KEY,
    user_credit_card_id INTEGER REFERENCES user_credit_cards(id) ON DELETE CASCADE,
    category VARCHAR(100) NOT NULL,
    
    -- Period Tracking
    period_type VARCHAR(20) NOT NULL,      -- 'monthly', 'quarterly', 'annual'
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    
    -- Spending
    amount_spent DECIMAL(10,2) DEFAULT 0,
    transaction_count INTEGER DEFAULT 0,
    limit_amount DECIMAL(10,2),            -- From card_rewards
    
    -- Calculations
    percentage_used DECIMAL(5,2) GENERATED ALWAYS AS (
        CASE 
            WHEN limit_amount > 0 THEN (amount_spent / limit_amount * 100)
            ELSE 0
        END
    ) STORED,
    
    cashback_earned DECIMAL(10,2) DEFAULT 0,
    
    -- Alerts
    alert_80_sent BOOLEAN DEFAULT false,
    alert_90_sent BOOLEAN DEFAULT false,
    alert_100_sent BOOLEAN DEFAULT false,
    
    last_updated TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(user_credit_card_id, category, period_start)
);

-- ============================================
-- CARD SUGGESTIONS LOG
-- ============================================
CREATE TABLE card_suggestions (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    
    -- Transaction Context
    merchant_name VARCHAR(200),
    amount DECIMAL(10,2),
    category VARCHAR(100),
    transaction_date TIMESTAMP,
    
    -- Current Selection
    current_card_id INTEGER REFERENCES user_credit_cards(id),
    current_reward_rate DECIMAL(5,2),
    
    -- Suggestion
    suggested_card_id INTEGER REFERENCES user_credit_cards(id),
    suggested_reward_rate DECIMAL(5,2),
    potential_savings DECIMAL(10,2),
    
    -- Reasoning
    reason TEXT,                           -- Why this suggestion?
    alert_type VARCHAR(50),                -- 'limit_approaching', 'better_rate', 'maxed_category'
    
    -- Outcome
    status VARCHAR(20) DEFAULT 'pending',  -- 'pending', 'accepted', 'rejected', 'ignored'
    user_action VARCHAR(50),               -- 'used_suggestion', 'used_different', 'ignored'
    
    created_at TIMESTAMP DEFAULT NOW(),
    responded_at TIMESTAMP
);

-- ============================================
-- OPTIMIZATION STATS (User Performance)
-- ============================================
CREATE TABLE user_optimization_stats (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    
    -- Period
    period_type VARCHAR(20) NOT NULL,      -- 'monthly', 'quarterly', 'annual'
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    
    -- Performance
    total_transactions INTEGER DEFAULT 0,
    optimized_transactions INTEGER DEFAULT 0,
    optimization_score DECIMAL(5,2),       -- 0-100
    
    -- Earnings
    total_cashback_earned DECIMAL(10,2) DEFAULT 0,
    potential_cashback DECIMAL(10,2) DEFAULT 0,
    missed_cashback DECIMAL(10,2) DEFAULT 0,
    
    -- Best/Worst
    best_card_id INTEGER REFERENCES user_credit_cards(id),
    best_card_earnings DECIMAL(10,2),
    
    created_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(user_id, period_start)
);
```

---

## 🌐 Public API Design

### **Base URL:** `https://api.creditcarddb.com/v1`

### **Authentication**
```
Free Tier: API Key (100 requests/day)
Paid Tier: API Key (10,000 requests/day) - $29/month
Enterprise: Custom limits - $299/month
```

---

### **Endpoints**

#### **1. Get All Cards**
```http
GET /cards
```

**Query Parameters:**
- `issuer` - Filter by issuer (chase, amex, etc.)
- `network` - Filter by network (visa, mastercard)
- `annual_fee_max` - Max annual fee (e.g., 0 for no-fee cards)
- `category` - Filter by reward category
- `min_rate` - Minimum reward rate for category
- `active_only` - Only active cards (default: true)
- `page` - Pagination (default: 1)
- `per_page` - Results per page (default: 50, max: 100)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "card_id": "chase-freedom-flex",
      "name": "Chase Freedom Flex",
      "issuer": "Chase",
      "network": "Visa",
      "annual_fee": 0,
      "color": "#3b82f6",
      "image_url": "https://cdn.creditcarddb.com/cards/chase-freedom-flex.png",
      "application_url": "https://www.chase.com/...",
      "rewards_summary": "5% rotating, 3% dining/drugstore/gas, 1% everything",
      "active": true,
      "last_updated": "2025-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "per_page": 50,
    "total": 247,
    "pages": 5
  }
}
```

---

#### **2. Get Card Details**
```http
GET /cards/{card_id}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "card_id": "chase-freedom-flex",
    "name": "Chase Freedom Flex",
    "issuer": "Chase",
    "network": "Visa",
    "annual_fee": 0,
    "foreign_transaction_fee": 0,
    "color": "#3b82f6",
    "image_url": "https://cdn.creditcarddb.com/cards/chase-freedom-flex.png",
    "rewards": [
      {
        "category": "rotating",
        "description": "5% cash back on rotating categories",
        "rate": 5.0,
        "limit": 1500,
        "period": "quarterly",
        "requires_activation": true,
        "current_categories": ["gas", "fitness"],
        "next_rotation": "2025-04-01"
      },
      {
        "category": "dining",
        "description": "3% on dining",
        "rate": 3.0,
        "limit": null,
        "period": "monthly"
      },
      {
        "category": "drugstore",
        "description": "3% at drugstores",
        "rate": 3.0,
        "limit": null,
        "period": "monthly"
      },
      {
        "category": "gas_station",
        "description": "3% at gas stations (excluding Target, Walmart)",
        "rate": 3.0,
        "limit": null,
        "period": "monthly",
        "exclusions": ["target", "walmart"]
      },
      {
        "category": "default",
        "description": "1% on everything else",
        "rate": 1.0,
        "limit": null,
        "period": "monthly"
      }
    ],
    "signup_bonus": {
      "amount": 200,
      "requirement": "Spend $500 in first 3 months"
    },
    "benefits": [
      "0% intro APR for 15 months",
      "No foreign transaction fees",
      "Cell phone protection up to $800"
    ],
    "last_updated": "2025-01-15T10:30:00Z",
    "verified": true
  }
}
```

---

#### **3. Get Rotating Categories**
```http
GET /rotating-categories
```

**Query Parameters:**
- `year` - Year (default: current)
- `quarter` - Quarter 1-4 (default: current)
- `card_id` - Filter by specific card

**Response:**
```json
{
  "success": true,
  "data": {
    "year": 2025,
    "quarter": 1,
    "period": "2025-01-01 to 2025-03-31",
    "cards": [
      {
        "card_id": "chase-freedom-flex",
        "card_name": "Chase Freedom Flex",
        "categories": ["gas", "fitness"],
        "rate": 5.0,
        "limit": 1500,
        "activation_required": true,
        "activation_deadline": "2025-03-31"
      },
      {
        "card_id": "discover-it",
        "card_name": "Discover it",
        "categories": ["grocery", "drugstore"],
        "rate": 5.0,
        "limit": 1500,
        "activation_required": false
      }
    ],
    "next_rotation": "2025-04-01"
  }
}
```

---

#### **4. Search Cards by Reward**
```http
GET /cards/search
```

**Query Parameters:**
- `category` - Category (gas, dining, etc.)
- `min_rate` - Minimum reward rate
- `no_annual_fee` - Only no-fee cards (true/false)
- `no_limit` - Only unlimited rewards (true/false)

**Response:**
```json
{
  "success": true,
  "query": {
    "category": "dining",
    "min_rate": 3.0,
    "no_annual_fee": true
  },
  "results": [
    {
      "card_id": "amex-gold",
      "name": "American Express Gold",
      "rate": 4.0,
      "limit": null,
      "annual_fee": 250,
      "effective_rate_after_fee": 3.2
    },
    {
      "card_id": "chase-freedom-flex",
      "name": "Chase Freedom Flex",
      "rate": 3.0,
      "limit": null,
      "annual_fee": 0
    }
  ],
  "count": 12
}
```

---

#### **5. Get Card Recommendations**
```http
POST /recommendations
```

**Request Body:**
```json
{
  "user_cards": [
    {
      "card_id": "chase-freedom-flex",
      "current_spending": {
        "gas": 347,
        "dining": 450,
        "groceries": 892
      }
    },
    {
      "card_id": "amex-gold",
      "current_spending": {
        "dining": 645,
        "groceries": 1230
      }
    }
  ],
  "transaction": {
    "merchant": "Shell Gas Station",
    "category": "gas",
    "amount": 52.30
  }
}
```

**Response:**
```json
{
  "success": true,
  "recommendation": {
    "suggested_card": "chase-freedom-flex",
    "suggested_rate": 5.0,
    "current_card": "amex-gold",
    "current_rate": 1.0,
    "savings": 2.09,
    "reason": "Chase Freedom Flex offers 5% on gas this quarter (Q1). You have $1,153 remaining in your $1,500 quarterly limit.",
    "confidence": "high",
    "alternative_cards": [
      {
        "card_id": "bofa-cash-rewards",
        "rate": 3.0,
        "limit_status": "maxed",
        "reason": "Typically good for gas but you've maxed the category"
      }
    ]
  }
}
```

---

#### **6. Submit Card Data (Community)**
```http
POST /contribute/card
Authorization: Bearer {api_key}
```

**Request Body:**
```json
{
  "card_id": "new-awesome-card",
  "name": "New Awesome Card",
  "issuer": "Big Bank",
  "rewards": [...],
  "source_url": "https://bigbank.com/awesome-card",
  "contributor_notes": "Found this new card launch"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Thank you! Your contribution is pending review.",
  "contribution_id": "contrib_12345",
  "estimated_review_time": "2-3 business days",
  "status": "pending"
}
```

---

## 🔄 Update & Sync Strategy

### **Automated Weekly Workflow**

```python
# scripts/weekly_update.py
import schedule
import time

def weekly_update_job():
    """Run every Monday at 2 AM"""
    print("Starting weekly credit card data update...")
    
    # Step 1: Run all scrapers
    scraped_data = run_all_scrapers()
    
    # Step 2: Detect changes
    changes = detect_changes(scraped_data)
    
    # Step 3: Auto-approve low-risk changes
    auto_approved = auto_approve_safe_changes(changes)
    
    # Step 4: Flag high-risk changes for manual review
    flagged = flag_for_review(changes)
    
    # Step 5: Send admin notification
    send_admin_report(auto_approved, flagged)
    
    # Step 6: Update last_sync timestamp
    update_sync_status()
    
    print(f"Update complete. Auto-approved: {len(auto_approved)}, Flagged: {len(flagged)}")

# Schedule
schedule.every().monday.at("02:00").do(weekly_update_job)

while True:
    schedule.run_pending()
    time.sleep(3600)  # Check every hour
```

### **Auto-Approval Rules**

```python
def can_auto_approve(change):
    """Determine if change is safe to auto-approve"""
    
    # Safe changes (auto-approve):
    AUTO_APPROVE = [
        'new_rotating_category_from_official_source',
        'minor_description_update',
        'broken_link_fix',
        'image_url_update'
    ]
    
    # Requires review:
    MANUAL_REVIEW = [
        'reward_rate_change',
        'new_limit_added',
        'card_discontinuation',
        'annual_fee_change'
    ]
    
    if change['type'] in AUTO_APPROVE:
        return True
    
    if change['type'] in MANUAL_REVIEW:
        return False
    
    # ML-based confidence score
    if change.get('confidence_score', 0) > 0.95:
        return True
    
    return False
```

---

## 📦 Sample Data Files

### **Chase Freedom Flex**
```json
{
  "card_id": "chase-freedom-flex",
  "name": "Chase Freedom Flex",
  "display_name": "Freedom Flex℠",
  "issuer": "Chase",
  "network": "Visa",
  "annual_fee": 0,
  "foreign_transaction_fee": 0,
  "card_color": "#3b82f6",
  "card_image_url": "https://creditcards.chase.com/content/dam/creditcards/flex.png",
  "application_url": "https://creditcards.chase.com/cash-back-credit-cards/freedom/flex",
  "terms_url": "https://www.chase.com/card-benefits/freedomflex/...",
  "active": true,
  "premium_card": false,
  "business_card": false,
  "keywords": ["cashback", "rotating", "no-annual-fee", "grocery", "dining"],
  "description": "Earn 5% cash back on up to $1,500 in combined purchases in bonus categories each quarter you activate, 3% on dining and drugstores, and unlimited 1% on all other purchases.",
  "rewards": [
    {
      "category": "rotating",
      "reward_type": "cashback",
      "reward_rate": 5.0,
      "quarterly_limit": 1500,
      "period": "quarterly",
      "is_rotating": true,
      "requires_activation": true,
      "rotation_frequency": "quarterly",
      "description": "5% cash back on rotating categories",
      "terms": "Must activate. Up to $1,500 combined purchases per quarter."
    },
    {
      "category": "dining",
      "reward_type": "cashback",
      "reward_rate": 3.0,
      "quarterly_limit": null,
      "period": "monthly",
      "is_rotating": false,
      "description": "3% on dining at restaurants",
      "inclusions": ["restaurants", "bars", "cafes"],
      "exclusions": ["grocery_stores_with_restaurants"]
    },
    {
      "category": "drugstore",
      "reward_type": "cashback",
      "reward_rate": 3.0,
      "quarterly_limit": null,
      "period": "monthly",
      "description": "3% at drugstores",
      "inclusions": ["cvs", "walgreens", "rite_aid"]
    },
    {
      "category": "gas_station",
      "reward_type": "cashback",
      "reward_rate": 3.0,
      "quarterly_limit": null,
      "period": "monthly",
      "description": "3% at gas stations",
      "exclusions": ["walmart", "target", "warehouse_clubs"],
      "notes": "Excludes gas purchased at superstores"
    },
    {
      "category": "default",
      "reward_type": "cashback",
      "reward_rate": 1.0,
      "quarterly_limit": null,
      "period": "monthly",
      "description": "1% on all other purchases"
    }
  ],
  "rotating_calendar_2025": {
    "Q1": {
      "categories": ["gas", "fitness"],
      "start_date": "2025-01-01",
      "end_date": "2025-03-31",
      "activation_deadline": "2025-03-14"
    },
    "Q2": {
      "categories": ["grocery", "home_improvement"],
      "start_date": "2025-04-01",
      "end_date": "2025-06-30",
      "activation_deadline": "2025-06-14"
    },
    "Q3": {
      "categories": ["amazon", "streaming"],
      "start_date": "2025-07-01",
      "end_date": "2025-09-30"
    },
    "Q4": {
      "categories": ["paypal", "wholesale_clubs"],
      "start_date": "2025-10-01",
      "end_date": "2025-12-31"
    }
  },
  "signup_bonus": {
    "amount": 200,
    "requirement": "Spend $500 in first 3 months",
    "type": "cashback"
  },
  "benefits": [
    "0% intro APR on purchases and balance transfers for 15 months",
    "No foreign transaction fees",
    "Cell phone protection (up to $800 per claim, $50 deductible)",
    "Purchase protection",
    "Extended warranty protection",
    "Auto rental collision damage waiver"
  ],
  "last_updated": "2025-01-15T10:30:00Z",
  "verified_by": "admin",
  "verification_source": "chase.com"
}
```

---

### **Amex Gold**
```json
{
  "card_id": "amex-gold",
  "name": "American Express Gold Card",
  "issuer": "American Express",
  "network": "American Express",
  "annual_fee": 250,
  "annual_fee_credits": [
    {"type": "dining", "amount": 120, "description": "$10/month Uber Eats credit"},
    {"type": "dining", "amount": 120, "description": "$10/month dining credit"}
  ],
  "effective_annual_fee": 10,  // $250 - $240 in credits
  "card_color": "#fbbf24",
  "rewards": [
    {
      "category": "dining",
      "reward_type": "points",
      "reward_rate": 4.0,
      "quarterly_limit": null,
      "description": "4X Membership Rewards points at restaurants worldwide",
      "notes": "Includes takeout and delivery in U.S."
    },
    {
      "category": "grocery",
      "reward_type": "points",
      "reward_rate": 4.0,
      "quarterly_limit": null,
      "annual_limit": 25000,  // $25K spend = 100K points
      "description": "4X points at U.S. supermarkets",
      "notes": "Then 1X after $25,000 in purchases per year"
    },
    {
      "category": "flights",
      "reward_type": "points",
      "reward_rate": 3.0,
      "quarterly_limit": null,
      "description": "3X points on flights booked directly with airlines"
    },
    {
      "category": "default",
      "reward_type": "points",
      "reward_rate": 1.0,
      "quarterly_limit": null
    }
  ],
  "point_value": {
    "transfer_partners": true,
    "estimated_cpp": 2.0,  // Cents per point
    "cashback_value": 0.6  // 60 cents per point for statement credit
  }
}
```

---

## 🏗️ Initial Database Seed

### **Top 50 Cards to Start With**

**Chase (8 cards):**
1. Freedom Flex
2. Freedom Unlimited
3. Freedom (discontinued but many still have)
4. Sapphire Preferred
5. Sapphire Reserve
6. Ink Business Cash
7. Ink Business Unlimited
8. Amazon Prime Rewards

**American Express (8 cards):**
1. Gold Card
2. Platinum Card
3. Blue Cash Preferred
4. Blue Cash Everyday
5. Cash Magnet
6. EveryDay Preferred
7. Delta SkyMiles Gold
8. Hilton Honors

**Citi (6 cards):**
1. Custom Cash
2. Double Cash
3. Rewards+
4. Premier
5. Diamond Preferred
6. Dividend (discontinued)

**Discover (3 cards):**
1. Discover it Cash Back
2. Discover it Chrome
3. Discover it Miles

**Capital One (6 cards):**
1. Venture
2. Venture X
3. VentureOne
4. SavorOne
5. Quicksilver
6. Spark Cash (business)

**Bank of America (4 cards):**
1. Cash Rewards
2. Customized Cash Rewards
3. Premium Rewards
4. Unlimited Cash Rewards

**Wells Fargo (3 cards):**
1. Active Cash
2. Autograph
3. Reflect

**US Bank (3 cards):**
1. Cash+
2. Altitude Go
3. Altitude Reserve

**Others (9 cards):**
- Fidelity Rewards Visa
- PayPal Cashback Mastercard
- Apple Card
- Amazon Prime Visa
- Target RedCard
- Costco Anywhere Visa
- Sam's Club Mastercard
- USAA Cashback Rewards Plus
- Navy Federal More Rewards

**Total: 50 cards covering ~85% of market**

---

## 🚀 Launch Strategy

### **Phase 1: Private Beta (Month 1)**
- Build database with 30 cards
- Set up API infrastructure
- Test with DollarPal only
- Iron out bugs

### **Phase 2: Open Source Launch (Month 2)**
- Release database on GitHub
- Publish API documentation
- Announce on Reddit (r/churning, r/personalfinance)
- Accept community contributions

### **Phase 3: API Monetization (Month 3)**
- Free tier: 100 requests/day
- Paid tier: $29/month
- Market to finance app developers
- Offer free access to open-source projects

### **Phase 4: Community Platform (Month 4+)**
- User contribution portal
- Verification system
- Reputation/badges
- Make it the "Wikipedia of Credit Cards"

---

## 💰 Revenue Potential

**If you build a good API:**

- **100 developers** × $29/month = $2,900/month
- **10 companies** × $299/month = $2,990/month
- **Affiliate revenue:** $50-200 per card signup
- **Total potential:** $5,000-10,000/month

**This could fund DollarPal development!**

---

## 🎯 Summary & Next Steps

### **Recommended Action Plan:**

**Week 1:**
1. Set up database schema (use SQL above)
2. Create 10 sample card JSON files
3. Build import script (JSON → PostgreSQL)

**Week 2:**
4. Build basic REST API (Flask/FastAPI)
5. Create API documentation
6. Test with DollarPal integration

**Week 3:**
7. Add 20 more popular cards
8. Build NerdWallet scraper
9. Set up weekly cron job

**Week 4:**
10. Create GitHub repo for JSON files
11. Write contribution guidelines
12. Soft launch on Reddit

**This is totally achievable and creates massive value for the ecosystem!** 🚀

Want me to:
1. Create sample JSON files for the top 10 cards?
2. Write the Flask API boilerplate?
3. Design the contribution portal UI?