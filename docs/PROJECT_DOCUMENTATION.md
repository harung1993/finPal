# FinPal - Project Documentation

## Overview

**FinPal** is a modern, privacy-first financial management platform. It's a self-hosted money management solution featuring comprehensive expense tracking, budgeting, account synchronization, and bill-splitting capabilities.

Part of the **PalStack ecosystem** - a suite of privacy-focused, self-hosted applications.

**License:** AGPL-3.0
**Status:** Production Ready

---

## Feature Set

### Core Financial Management
| Feature | Description |
|---------|-------------|
| **Expense Tracking** | Multi-currency support with automatic conversion |
| **Recurring Transactions** | Flexible scheduling with pattern detection |
| **Auto-categorization** | Smart rules engine for automatic transaction tagging |
| **Transaction Import** | CSV import and SimpleFin bank sync |
| **Multi-category Splits** | Split single transactions across multiple categories |
| **Multi-account Support** | Track checking, savings, credit, investment accounts |

### Budgeting & Analytics
| Feature | Description |
|---------|-------------|
| **Custom Budgets** | Real-time tracking with notifications |
| **Monthly Reports** | Email summaries of financial activity |
| **Interactive Charts** | Expense trends visualization |
| **Category Analysis** | Drill-down by category/subcategory |
| **Net Worth Tracking** | Aggregate view across all accounts |
| **Cash Flow Analysis** | Income vs expense tracking |

### Bill Splitting (Groups)
| Feature | Description |
|---------|-------------|
| **Split Methods** | Equal, custom amount, percentage-based |
| **Group Management** | Create groups, invite members via email |
| **Settlement Tracking** | Track who owes whom |
| **IOU Management** | Personal debt tracking |

### Investment Tracking
| Feature | Description |
|---------|-------------|
| **Multiple Portfolios** | Organize investments by strategy |
| **Auto Price Updates** | Yahoo Finance integration |
| **Performance Monitoring** | Gains/losses tracking |
| **Account Linking** | Connect portfolios to accounts |

### Security & Authentication
| Feature | Description |
|---------|-------------|
| **Local Auth** | Email/password with JWT tokens |
| **OIDC Support** | OpenID Connect integration (PKCE) |
| **Password Recovery** | Email-based reset flow |
| **Email Verification** | Account verification on signup |

---

## Integrations

### SimpleFin (Bank Sync)
- **Purpose:** Automatic bank account synchronization
- **Location:** `finpal-backend/integrations/simplefin/`
- **Flow:** Setup token → Access URL → Account/Transaction sync
- **Features:** Auto-sync balances, import transactions, account type detection

### Yahoo Finance (Investments)
- **Purpose:** Stock/ETF price data
- **Location:** `finpal-backend/integrations/investments/yfinance.py`
- **Features:**
  - 35+ international exchanges supported
  - 24-hour caching to respect rate limits
  - Auto currency detection per exchange

### OIDC Authentication
- **Purpose:** Single Sign-On with external providers
- **Location:** `finpal-backend/integrations/oidc/`
- **Features:** PKCE flow, state token validation, auto user provisioning

### Recurring Transaction Detection
- **Purpose:** Auto-detect recurring patterns
- **Location:** `finpal-backend/integrations/recurring/detector.py`
- **Features:** Pattern matching, frequency detection, subscription identification

---

## Technology Stack

### Backend
| Component | Technology |
|-----------|------------|
| Framework | Python 3.11+ / Flask 2.2 |
| Database | PostgreSQL 15 |
| ORM | SQLAlchemy 1.4 |
| Migrations | Alembic / Flask-Migrate |
| Auth | Flask-Login, Flask-JWT-Extended |
| API Docs | Flask-RESTX (Swagger) |
| WSGI Server | Gunicorn |
| Serialization | Marshmallow |

### Web Frontend
| Component | Technology |
|-----------|------------|
| Framework | React 19 |
| Language | TypeScript 5.9 |
| Build Tool | Vite 7 |
| Styling | Tailwind CSS 4 |
| State | Zustand 5 |
| Data Fetching | TanStack React Query 5 |
| Charts | Recharts 3 |
| HTTP Client | Axios |
| Routing | React Router 7 |

### Mobile App
| Component | Technology |
|-----------|------------|
| Framework | React Native 0.74 |
| Platform | Expo SDK 51 |
| Navigation | Expo Router 3.5 |
| State | Zustand 4 |
| Data Fetching | TanStack React Query 5 |
| Secure Storage | expo-secure-store |
| Biometrics | expo-local-authentication |

### Infrastructure
| Component | Technology |
|-----------|------------|
| Containerization | Docker |
| Orchestration | Docker Compose |
| Reverse Proxy | Nginx |
| Database | PostgreSQL (Alpine image) |

---

## Project Structure

```
finpal/
├── finpal-backend/           # Flask API Server
│   ├── api/v1/               # REST API endpoints
│   │   ├── accounts.py       # Account management
│   │   ├── analytics.py      # Dashboard analytics
│   │   ├── auth.py           # Authentication
│   │   ├── budgets.py        # Budget CRUD
│   │   ├── categories.py     # Category management
│   │   ├── csv_import.py     # CSV transaction import
│   │   ├── groups.py         # Bill splitting groups
│   │   ├── investments.py    # Portfolio management
│   │   ├── recurring.py      # Recurring transactions
│   │   ├── transactions.py   # Transaction CRUD
│   │   ├── transaction_rules.py  # Auto-categorization rules
│   │   └── users.py          # User management
│   ├── integrations/
│   │   ├── investments/      # Yahoo Finance integration
│   │   ├── oidc/             # OpenID Connect auth
│   │   ├── recurring/        # Pattern detection
│   │   └── simplefin/        # Bank sync client
│   ├── src/
│   │   ├── models/           # SQLAlchemy models
│   │   └── services/         # Business logic layer
│   ├── migrations/           # Alembic migrations
│   ├── schemas/              # Marshmallow schemas
│   └── tests/                # unit, integration, e2e
│
├── finpal-web/               # React SPA
│   └── src/
│       ├── components/       # Reusable UI components
│       ├── contexts/         # React context providers
│       ├── hooks/            # Custom React hooks
│       ├── pages/            # Page components
│       ├── services/         # API service layer
│       ├── store/            # Zustand stores
│       ├── types/            # TypeScript definitions
│       └── utils/            # Helper functions
│
├── finpal-mobile/            # Expo/React Native App
│   └── app/
│       ├── (auth)/           # Auth screens (login, register)
│       ├── (tabs)/           # Main tab navigation
│       │   ├── dashboard     # Home dashboard
│       │   ├── transactions  # Transaction list
│       │   ├── accounts      # Account management
│       │   ├── budgets       # Budget tracking
│       │   ├── groups        # Bill splitting
│       │   ├── investments   # Portfolio view
│       │   ├── categories    # Category management
│       │   ├── recurring     # Recurring transactions
│       │   └── settings      # App settings
│       └── investments/      # Investment details
│
├── finpal-nginx/             # Reverse proxy config
├── docs/                     # Documentation
├── docker-compose.yml        # Development stack
└── docker-compose.hub.yml    # Production (Docker Hub)
```

---

## Data Models

| Model | Purpose |
|-------|---------|
| **User** | Authentication, preferences, currency settings |
| **Account** | Bank accounts, credit cards, cash |
| **Transaction** | Income/expense records with splits |
| **Category** | Hierarchical categories with subcategories |
| **Budget** | Spending limits with period tracking |
| **Group** | Bill-splitting groups with members |
| **Investment** | Portfolio holdings with price data |
| **TransactionRule** | Auto-categorization rules |
| **Recurring** | Recurring transaction templates |
| **Currency** | Exchange rates and conversions |

---

## User Flows

### Authentication Flow
```
Landing → Register/Login → Email Verification → Onboarding → Dashboard
                ↓
         OIDC Provider (optional)
```

### Core User Journey
```
Dashboard (overview)
    ├── Transactions → Add/Edit/Import → Categorize → View Analytics
    ├── Accounts → Link SimpleFin → Sync Transactions
    ├── Budgets → Create Budget → Track Spending → Notifications
    ├── Groups → Create Group → Add Expense → Split → Settle
    └── Investments → Add Portfolio → Track Holdings → View Performance
```

### Transaction Entry Flow
```
Add Transaction
    ├── Manual Entry → Category Selection → Save
    ├── CSV Import → Column Mapping → Preview → Import
    └── SimpleFin Sync → Auto-categorize → Review
```

### Settings Flow
```
Settings
    ├── Profile (name, email, password)
    ├── Preferences (currency, date format)
    ├── SimpleFin Connection
    ├── Categories Management
    ├── Transaction Rules
    └── Data Export
```

---

## API Structure

Base URL: `/api/v1/`

| Endpoint | Methods | Purpose |
|----------|---------|---------|
| `/auth/*` | POST | Login, register, refresh token |
| `/users/*` | GET, PUT, DELETE | User profile management |
| `/accounts/*` | CRUD | Account management |
| `/transactions/*` | CRUD | Transaction operations |
| `/categories/*` | CRUD | Category hierarchy |
| `/budgets/*` | CRUD | Budget management |
| `/groups/*` | CRUD | Bill-splitting groups |
| `/investments/*` | CRUD | Portfolio management |
| `/recurring/*` | CRUD | Recurring transactions |
| `/analytics/*` | GET | Dashboard data |
| `/csv-import/*` | POST | CSV transaction import |
| `/transaction-rules/*` | CRUD | Auto-categorization |

---

## Deployment

### Requirements
- Docker & Docker Compose
- 2GB RAM minimum (4GB recommended)
- 10GB disk space

### Quick Start
```bash
# Clone and configure
git clone <repo-url>
cp .env.example .env

# Launch with pre-built images
docker-compose -f docker-compose.hub.yml up -d

# Access at http://localhost
```

### Environment Variables
| Variable | Purpose |
|----------|---------|
| `DB_USER`, `DB_PASSWORD`, `DB_NAME` | Database credentials |
| `SECRET_KEY`, `JWT_SECRET_KEY` | Application secrets |
| `DEFAULT_CURRENCY` | Default currency (USD) |
| `SIMPLEFIN_ENABLED` | Enable bank sync |
| `INVESTMENT_TRACKING_ENABLED` | Enable portfolios |
| `OIDC_*` | OIDC provider configuration |

---

## Development

### Backend
```bash
cd finpal-backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
flask run --port 5001
```

### Web Frontend
```bash
cd finpal-web
npm install
npm run dev
```

### Mobile App
```bash
cd finpal-mobile
npm install
npx expo start
```
