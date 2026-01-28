# DollarDollar Backend Modularization Plan

## Executive Summary

This document outlines the complete plan to refactor the monolithic Flask application (12,574 lines in `app.py`) into a modular, service-based architecture using Flask Blueprints. This approach maintains a single application while organizing code into logical, maintainable modules.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Proposed Service Modules](#proposed-service-modules)
3. [Folder Structure](#folder-structure)
4. [Implementation Phases](#implementation-phases)
5. [Migration Strategy](#migration-strategy)
6. [Database Strategy](#database-strategy)
7. [Testing Strategy](#testing-strategy)
8. [Deployment Considerations](#deployment-considerations)
9. [Rollback Plan](#rollback-plan)

---

## 1. Architecture Overview

### Current State
```
dollardollar/
├── app.py (12,574 lines - ALL business logic)
├── oidc_auth.py
├── simplefin_client.py
├── recurring_detection.py
└── [other utility files]
```

### Target State
```
Flask Application (Modular Monolith)
├── API Gateway Layer (app.py)
├── Service Modules (Blueprints)
│   ├── Auth Service
│   ├── Transaction Service
│   ├── Account Service
│   ├── Budget Service
│   ├── Group Service
│   ├── Category Service
│   ├── Recurring Service
│   ├── Investment Service
│   ├── Currency Service
│   ├── Analytics Service
│   └── Notification Service
├── Shared Components
│   ├── Models (SQLAlchemy)
│   ├── Utils
│   └── Config
└── Frontend (unchanged for now)
```

### Design Principles

1. **Modular Monolith First** - Use Flask Blueprints to organize code while maintaining single deployment unit
2. **Clear Boundaries** - Each service has well-defined responsibilities
3. **Shared Database** - All services access same database (for now)
4. **Service Layer Pattern** - Business logic separated from route handlers
5. **Dependency Injection** - Services receive dependencies explicitly
6. **Backward Compatible** - Maintain existing routes and functionality
7. **Testable** - Each service can be unit tested independently

---

## 2. Proposed Service Modules

### 2.1 Auth Service
**Responsibility:** User authentication, authorization, and session management

**Components:**
- User registration and login (local + OIDC)
- Password reset functionality
- Session management
- Admin user management
- Demo mode handling

**Models:**
- `User`
- `UserApiSettings`

**Routes:** (5 routes)
- `POST /login`
- `POST /signup`
- `GET /logout`
- `POST /reset_password`
- `GET/POST /admin/users`

**Dependencies:**
- Flask-Login
- OIDC module (`oidc_auth.py`, `oidc_user.py`)
- Session timeout module

**Key Functions to Extract:**
- `login()` - Line 3442
- `signup()` - Line 3520
- `logout()` - Line 3661
- `reset_password()` - Line 12454
- `send_reset_email()` - Line 12509

---

### 2.2 Transaction Service
**Responsibility:** Core expense/income tracking and transaction management

**Components:**
- Add/edit/delete transactions
- Category splits
- Tag management
- Transaction filtering and search
- CSV export

**Models:**
- `Expense`
- `CategorySplit`
- `Tag`
- `expense_tags` (association table)

**Routes:** (10+ routes)
- `POST /add_expense`
- `POST /update_expense`
- `POST /delete_expense`
- `GET /transactions`
- `GET /export_transactions`
- `POST /add_tag`
- `POST /delete_tag`
- `POST /split_transaction`

**Dependencies:**
- Category Service (for validation)
- Account Service (for balance updates)
- Currency Service (for conversions)
- Notification Service (for budget alerts)

**Key Functions to Extract:**
- `add_expense()` - Line 4056
- `update_expense()` - Line 4226
- `delete_expense()` - Line 4558
- `get_transactions()` - Line 6510
- `export_transactions()` - Line 6644

---

### 2.3 Account Service
**Responsibility:** Bank account management and external syncing

**Components:**
- Account CRUD operations
- SimpleFin integration
- CSV import functionality
- Account balance tracking
- Transaction import from external sources

**Models:**
- `Account`
- `SimpleFin`

**Routes:** (14+ routes)
- `GET /accounts`
- `POST /add_account`
- `POST /update_account`
- `POST /delete_account`
- `POST /import_transactions`
- `POST /simplefin/setup_access`
- `POST /simplefin/sync_accounts`
- `GET /simplefin/callback`

**Dependencies:**
- Transaction Service (for creating imported transactions)
- SimpleFin client module
- Category Service (for auto-categorization)

**Key Functions to Extract:**
- `accounts()` - Line 6737
- `add_account()` - Line 6811
- `import_transactions()` - Line 6867
- `sync_simplefin_accounts()` - Line 7634
- `simplefin_callback()` - Line 7425

---

### 2.4 Budget Service
**Responsibility:** Budget creation, tracking, and alerts

**Components:**
- Budget CRUD operations
- Budget period calculations
- Spending vs budget analysis
- Budget alerts
- Subcategory inclusion

**Models:**
- `Budget`

**Routes:** (11 routes)
- `GET /budgets`
- `POST /budgets/add`
- `POST /budgets/update`
- `POST /budgets/delete`
- `GET /budgets/<id>/transactions`
- `POST /budgets/check_alerts`

**Dependencies:**
- Transaction Service (for spending calculations)
- Category Service (for category hierarchy)
- Notification Service (for alerts)

**Key Functions to Extract:**
- `budgets()` - Line 8848
- `add_budget()` - Line 8909
- `update_budget()` - Line 8981
- `delete_budget()` - Line 9099
- `get_budget_transactions()` - Line 9134

---

### 2.5 Group Service
**Responsibility:** Bill splitting and group expense management

**Components:**
- Group CRUD operations
- Member management
- Split calculation (equal, percentage, custom)
- Settlement tracking
- Balance calculations

**Models:**
- `Group`
- `Settlement`
- `group_users` (association table)

**Routes:** (10 routes)
- `GET /groups`
- `POST /add_group`
- `GET /group/<id>`
- `POST /update_group`
- `POST /delete_group`
- `POST /group/add_member`
- `POST /group/remove_member`
- `POST /add_settlement`

**Dependencies:**
- Transaction Service (for group expenses)
- Notification Service (for invitations)
- Auth Service (for user validation)

**Key Functions to Extract:**
- `groups()` - Line 5689
- `add_group()` - Line 5714
- `group_details()` - Line 5767
- `calculate_balances()` - Line 1206
- `add_settlement()` - Line 6194

---

### 2.6 Category Service
**Responsibility:** Category management and auto-categorization

**Components:**
- Category CRUD operations
- Hierarchical category structure
- Category mapping rules
- Auto-categorization engine
- Bulk categorization

**Models:**
- `Category`
- `CategoryMapping`

**Routes:** (14 routes)
- `GET /categories`
- `POST /add_category`
- `POST /update_category`
- `POST /delete_category`
- `GET /category_mappings`
- `POST /add_mapping`
- `POST /delete_mapping`
- `POST /auto_categorize`
- `POST /bulk_categorize`

**Dependencies:**
- None (foundational service)

**Key Functions to Extract:**
- `categories()` - Line 8639
- `add_category()` - Line 8684
- `category_mappings()` - Line 8024
- `add_mapping()` - Line 8157
- `auto_categorize_transaction()` - Line 1162

---

### 2.7 Recurring Service
**Responsibility:** Recurring transaction detection and management

**Components:**
- Recurring pattern detection
- Recurring expense CRUD
- Candidate suggestion
- Scheduling logic
- Pattern ignore list

**Models:**
- `RecurringExpense`
- `IgnoredRecurringPattern`

**Routes:** (12 routes)
- `GET /recurring`
- `POST /add_recurring`
- `POST /update_recurring`
- `POST /delete_recurring`
- `POST /detect_recurring_transactions`
- `POST /ignore_recurring_pattern`
- `GET /recurring_candidates`

**Dependencies:**
- Transaction Service (for creating recurring instances)
- Recurring detection module
- Notification Service (for reminders)

**Key Functions to Extract:**
- `recurring()` - Line 4809
- `add_recurring_expense()` - Line 4896
- `detect_recurring_transactions()` - Line 5082
- `get_recurring_candidates()` - Line 5376
- `ignore_recurring_pattern()` - Line 5463

---

### 2.8 Investment Service
**Responsibility:** Portfolio and investment tracking (optional feature)

**Components:**
- Portfolio CRUD operations
- Investment tracking
- Price updates (FMP API, Yahoo Finance)
- Portfolio-to-account synchronization
- Performance calculations

**Models:**
- `Portfolio`
- `Investment`
- `InvestmentTransaction`

**Routes:** (14 routes)
- `GET /investments`
- `POST /portfolios/add`
- `POST /portfolios/update`
- `POST /portfolios/delete`
- `POST /investments/add`
- `POST /investments/update`
- `POST /update_prices`
- `POST /sync_investments_to_accounts`

**Dependencies:**
- Account Service (for synchronization)
- FMP cache module
- Yahoo Finance module
- Currency Service (for conversions)

**Key Functions to Extract:**
- `investments()` - Line 10399
- `add_portfolio()` - Line 10601
- `update_investment_prices()` - Line 11052
- `sync_investments_with_accounts()` - Line 11245

---

### 2.9 Currency Service
**Responsibility:** Multi-currency support and exchange rates

**Components:**
- Currency CRUD operations
- Exchange rate updates
- Currency conversion calculations
- Rate caching

**Models:**
- `Currency`

**Routes:** (7 routes)
- `GET /currencies`
- `POST /add_currency`
- `POST /update_currency`
- `POST /delete_currency`
- `POST /update_currency_rates`
- `POST /convert`

**Dependencies:**
- None (foundational service)

**Key Functions to Extract:**
- `currencies()` - Line 6276
- `add_currency()` - Line 6326
- `update_currency_rates()` - Line 6389
- `convert_currency()` - Line 1144

---

### 2.10 Analytics Service
**Responsibility:** Reports, statistics, and dashboard data

**Components:**
- Dashboard data aggregation
- Monthly reports generation
- Spending trend analysis
- Category analysis
- Asset/debt tracking
- Comparison reports

**Routes:** (4 routes)
- `GET /dashboard`
- `GET /stats`
- `POST /generate_monthly_report`
- `GET /spending_comparison`

**Dependencies:**
- Transaction Service (data source)
- Account Service (balance data)
- Investment Service (portfolio data)
- Budget Service (budget data)
- Notification Service (email reports)

**Key Functions to Extract:**
- `dashboard()` - Line 3684
- `stats()` - Line 10102
- `generate_monthly_report()` - Line 10215

---

### 2.11 Notification Service
**Responsibility:** Email notifications and alerts

**Components:**
- Email sending
- Monthly report emails
- Budget alert emails
- Group invitation emails
- Password reset emails

**Routes:** (None - internal service)

**Dependencies:**
- Flask-Mail
- Email templates

**Key Functions to Extract:**
- `send_automatic_monthly_reports()` - Line 2361
- `send_budget_alerts()` - Line 2519
- Email sending logic from various services

---

## 3. Folder Structure

### Complete Folder Structure

```
dollardollar/
├── app.py                          # Main application entry point (minimal)
├── config.py                       # Centralized configuration
├── wsgi.py                         # Production WSGI entry point
├── requirements.txt
├── Dockerfile
├── docker-compose.yml
├── .env.example
├── .gitignore
├── README.md
│
├── src/                            # Main application source code
│   ├── __init__.py                 # Application factory
│   │
│   ├── models/                     # SQLAlchemy Models
│   │   ├── __init__.py
│   │   ├── user.py                 # User, UserApiSettings
│   │   ├── account.py              # Account, SimpleFin
│   │   ├── transaction.py          # Expense, CategorySplit, Tag
│   │   ├── category.py             # Category, CategoryMapping
│   │   ├── budget.py               # Budget
│   │   ├── group.py                # Group, Settlement
│   │   ├── recurring.py            # RecurringExpense, IgnoredRecurringPattern
│   │   ├── investment.py           # Portfolio, Investment, InvestmentTransaction
│   │   ├── currency.py             # Currency
│   │   └── associations.py         # Association tables (group_users, expense_tags)
│   │
│   ├── services/                   # Business Logic Layer
│   │   ├── __init__.py
│   │   │
│   │   ├── auth/
│   │   │   ├── __init__.py
│   │   │   ├── service.py          # AuthService class
│   │   │   ├── routes.py           # Blueprint routes
│   │   │   ├── schemas.py          # Validation schemas
│   │   │   └── utils.py            # Helper functions
│   │   │
│   │   ├── transaction/
│   │   │   ├── __init__.py
│   │   │   ├── service.py          # TransactionService class
│   │   │   ├── routes.py           # Blueprint routes
│   │   │   ├── schemas.py          # Validation schemas
│   │   │   └── utils.py            # Helper functions
│   │   │
│   │   ├── account/
│   │   │   ├── __init__.py
│   │   │   ├── service.py          # AccountService class
│   │   │   ├── routes.py           # Blueprint routes
│   │   │   ├── schemas.py
│   │   │   ├── simplefin.py        # SimpleFin integration
│   │   │   └── importers.py        # CSV import logic
│   │   │
│   │   ├── budget/
│   │   │   ├── __init__.py
│   │   │   ├── service.py          # BudgetService class
│   │   │   ├── routes.py           # Blueprint routes
│   │   │   ├── schemas.py
│   │   │   └── calculators.py      # Budget calculation logic
│   │   │
│   │   ├── group/
│   │   │   ├── __init__.py
│   │   │   ├── service.py          # GroupService class
│   │   │   ├── routes.py           # Blueprint routes
│   │   │   ├── schemas.py
│   │   │   └── splitters.py        # Split calculation logic
│   │   │
│   │   ├── category/
│   │   │   ├── __init__.py
│   │   │   ├── service.py          # CategoryService class
│   │   │   ├── routes.py           # Blueprint routes
│   │   │   ├── schemas.py
│   │   │   └── auto_categorizer.py # Auto-categorization engine
│   │   │
│   │   ├── recurring/
│   │   │   ├── __init__.py
│   │   │   ├── service.py          # RecurringService class
│   │   │   ├── routes.py           # Blueprint routes
│   │   │   ├── schemas.py
│   │   │   ├── detector.py         # Pattern detection logic
│   │   │   └── scheduler.py        # Recurring scheduling
│   │   │
│   │   ├── investment/
│   │   │   ├── __init__.py
│   │   │   ├── service.py          # InvestmentService class
│   │   │   ├── routes.py           # Blueprint routes
│   │   │   ├── schemas.py
│   │   │   ├── price_fetcher.py    # FMP/Yahoo integration
│   │   │   └── sync.py             # Portfolio-account sync
│   │   │
│   │   ├── currency/
│   │   │   ├── __init__.py
│   │   │   ├── service.py          # CurrencyService class
│   │   │   ├── routes.py           # Blueprint routes
│   │   │   ├── schemas.py
│   │   │   └── converter.py        # Conversion logic
│   │   │
│   │   ├── analytics/
│   │   │   ├── __init__.py
│   │   │   ├── service.py          # AnalyticsService class
│   │   │   ├── routes.py           # Blueprint routes
│   │   │   ├── dashboard.py        # Dashboard data
│   │   │   ├── reports.py          # Report generation
│   │   │   └── aggregators.py      # Data aggregation
│   │   │
│   │   └── notification/
│   │       ├── __init__.py
│   │       ├── service.py          # NotificationService class
│   │       ├── email_sender.py     # Email logic
│   │       └── templates.py        # Email template helpers
│   │
│   ├── utils/                      # Shared Utilities
│   │   ├── __init__.py
│   │   ├── decorators.py           # Custom decorators (@login_required, etc.)
│   │   ├── validators.py           # Input validation
│   │   ├── formatters.py           # Data formatting
│   │   ├── date_utils.py           # Date/time helpers
│   │   └── errors.py               # Custom exceptions
│   │
│   ├── extensions.py               # Flask extensions (db, mail, login_manager, etc.)
│   │
│   └── cli.py                      # CLI commands (db init, demo reset, etc.)
│
├── integrations/                   # External Integrations
│   ├── __init__.py
│   ├── oidc/
│   │   ├── __init__.py
│   │   ├── auth.py                 # From oidc_auth.py
│   │   └── user.py                 # From oidc_user.py
│   │
│   ├── simplefin/
│   │   ├── __init__.py
│   │   └── client.py               # From simplefin_client.py
│   │
│   ├── investments/
│   │   ├── __init__.py
│   │   ├── fmp.py                  # FMP API integration
│   │   ├── yahoo.py                # From yfinance_integration_enhanced.py
│   │   └── cache.py                # From fmp_cache.py
│   │
│   └── recurring/
│       ├── __init__.py
│       └── detector.py             # From recurring_detection.py
│
├── migrations/                     # Database migrations
│   └── versions/
│
├── static/                         # Frontend assets (unchanged)
│   ├── css/
│   ├── js/
│   └── images/
│
├── templates/                      # Jinja2 templates (unchanged)
│   ├── base.html
│   ├── dashboard.html
│   └── [other templates...]
│
├── tests/                          # Test Suite
│   ├── __init__.py
│   ├── conftest.py                 # Pytest fixtures
│   │
│   ├── unit/                       # Unit tests
│   │   ├── __init__.py
│   │   ├── test_auth_service.py
│   │   ├── test_transaction_service.py
│   │   ├── test_account_service.py
│   │   ├── test_budget_service.py
│   │   ├── test_group_service.py
│   │   ├── test_category_service.py
│   │   ├── test_recurring_service.py
│   │   ├── test_investment_service.py
│   │   ├── test_currency_service.py
│   │   └── test_analytics_service.py
│   │
│   ├── integration/                # Integration tests
│   │   ├── __init__.py
│   │   ├── test_transaction_flow.py
│   │   ├── test_budget_alerts.py
│   │   ├── test_group_splitting.py
│   │   └── test_simplefin_sync.py
│   │
│   └── e2e/                        # End-to-end tests
│       ├── __init__.py
│       └── test_user_workflows.py
│
├── scripts/                        # Utility scripts
│   ├── init_db.py
│   ├── reset.py
│   ├── demo_reset.py
│   ├── add_column.py
│   ├── fix_currency.py
│   └── update_currencies.py
│
└── docs/                           # Documentation
    ├── API.md                      # API documentation
    ├── ARCHITECTURE.md             # Architecture overview
    ├── DEPLOYMENT.md               # Deployment guide
    └── MIGRATION_GUIDE.md          # Migration guide
```

---

## 4. Implementation Phases

### Phase 0: Preparation (Week 1)
**Goal:** Set up new structure without breaking existing code

**Tasks:**
1. Create new folder structure
2. Set up `src/__init__.py` with application factory pattern
3. Create `config.py` for centralized configuration
4. Set up extensions in `src/extensions.py`
5. Create base test infrastructure
6. Document current API endpoints

**Deliverables:**
- New folder structure in place
- Application factory working
- Tests can run (even if no tests yet)
- Documentation of all current routes

**Testing:**
- App still runs with existing `app.py`
- All existing routes accessible

---

### Phase 1: Extract Models (Week 2)
**Goal:** Separate database models into individual files

**Tasks:**
1. Create model files in `src/models/`
2. Extract models from `app.py` lines 152-1050
3. Set up model imports in `src/models/__init__.py`
4. Update imports in `app.py`
5. Test database operations

**Order of Extraction:**
1. `currency.py` - No dependencies
2. `category.py` - Minimal dependencies
3. `user.py` - Depends on nothing
4. `account.py` - Depends on User, Currency
5. `transaction.py` - Depends on Account, Category, User
6. `budget.py` - Depends on Category, User
7. `group.py` - Depends on User
8. `recurring.py` - Depends on User, Category
9. `investment.py` - Depends on User, Currency
10. `associations.py` - Association tables

**Deliverables:**
- All models in separate files
- `app.py` imports models from `src/models`
- Database migrations still work
- All tests pass

**Testing:**
- Database operations work
- Migrations apply successfully
- No broken imports

---

### Phase 2: Extract Utilities (Week 3)
**Goal:** Create shared utility modules

**Tasks:**
1. Extract helper functions from `app.py` lines 1051-2856
2. Create utility modules:
   - `decorators.py` - Login required, admin required, etc.
   - `validators.py` - Input validation
   - `formatters.py` - Data formatting
   - `date_utils.py` - Date/timezone helpers
3. Move integration modules to `integrations/`
4. Update imports throughout

**Key Functions to Extract:**
- `convert_currency()` → `currency/converter.py`
- `calculate_balances()` → `group/splitters.py`
- `auto_categorize_transaction()` → `category/auto_categorizer.py`
- Date/timezone helpers → `utils/date_utils.py`

**Deliverables:**
- Utility modules created
- Integration modules organized
- `app.py` imports from utilities
- All tests pass

**Testing:**
- All utility functions work
- No circular dependencies
- Integration tests pass

---

### Phase 3: Extract First Service - Currency (Week 4)
**Goal:** Create first complete service as template

**Tasks:**
1. Create `src/services/currency/` structure
2. Create `CurrencyService` class with business logic
3. Create Blueprint with routes
4. Create validation schemas
5. Write unit tests
6. Register Blueprint in app factory
7. Remove currency code from `app.py`

**Files to Create:**
- `service.py` - CurrencyService class
- `routes.py` - Blueprint with 7 routes
- `schemas.py` - Validation schemas
- `converter.py` - Conversion logic
- `tests/unit/test_currency_service.py`

**Deliverables:**
- Currency service fully functional
- Tests passing
- Documentation updated
- Template for other services

**Testing:**
- Unit tests for CurrencyService
- Integration tests for routes
- Currency conversion works
- Exchange rate updates work

---

### Phase 4: Extract Category Service (Week 5)
**Goal:** Extract second foundational service

**Tasks:**
1. Create `src/services/category/` structure
2. Create `CategoryService` class
3. Extract auto-categorization logic
4. Create Blueprint with 14 routes
5. Write tests
6. Remove category code from `app.py`

**Dependencies:**
- None (foundational service)

**Deliverables:**
- Category service functional
- Auto-categorization working
- Tests passing

**Testing:**
- Category CRUD operations
- Auto-categorization accuracy
- Hierarchical category handling

---

### Phase 5: Extract Auth Service (Week 6)
**Goal:** Extract authentication and user management

**Tasks:**
1. Create `src/services/auth/` structure
2. Create `AuthService` class
3. Integrate OIDC modules
4. Create Blueprint with 5+ routes
5. Handle session management
6. Write tests
7. Remove auth code from `app.py`

**Dependencies:**
- OIDC integration modules
- Flask-Login
- Session timeout module

**Deliverables:**
- Auth service functional
- OIDC login working
- Local login working
- Password reset working
- Demo mode working

**Testing:**
- Login/logout flows
- OIDC authentication
- Password reset
- Session management
- Admin functions

---

### Phase 6: Extract Transaction Service (Week 7-8)
**Goal:** Extract core transaction management

**Tasks:**
1. Create `src/services/transaction/` structure
2. Create `TransactionService` class
3. Extract split logic
4. Extract tag logic
5. Create Blueprint with 10+ routes
6. Write comprehensive tests
7. Remove transaction code from `app.py`

**Dependencies:**
- Category Service
- Account Service (for balance updates)
- Currency Service
- Notification Service

**Deliverables:**
- Transaction service functional
- Category splits working
- Tag management working
- CSV export working

**Testing:**
- Transaction CRUD
- Multi-category splits
- Tag operations
- Currency conversions
- Balance calculations

---

### Phase 7: Extract Account Service (Week 9)
**Goal:** Extract account management and SimpleFin

**Tasks:**
1. Create `src/services/account/` structure
2. Create `AccountService` class
3. Integrate SimpleFin client
4. Extract CSV import logic
5. Create Blueprint with 14+ routes
6. Write tests
7. Remove account code from `app.py`

**Dependencies:**
- SimpleFin integration
- Transaction Service
- Category Service (auto-categorization)

**Deliverables:**
- Account service functional
- SimpleFin sync working
- CSV import working
- Account balances accurate

**Testing:**
- Account CRUD
- SimpleFin OAuth flow
- SimpleFin sync
- CSV import
- Balance tracking

---

### Phase 8: Extract Budget Service (Week 10)
**Goal:** Extract budget tracking

**Tasks:**
1. Create `src/services/budget/` structure
2. Create `BudgetService` class
3. Extract budget calculation logic
4. Create Blueprint with 11 routes
5. Write tests
6. Remove budget code from `app.py`

**Dependencies:**
- Transaction Service
- Category Service
- Notification Service

**Deliverables:**
- Budget service functional
- Budget alerts working
- Spending calculations accurate

**Testing:**
- Budget CRUD
- Spending calculations
- Budget alerts
- Subcategory inclusion

---

### Phase 9: Extract Group Service (Week 11)
**Goal:** Extract bill splitting functionality

**Tasks:**
1. Create `src/services/group/` structure
2. Create `GroupService` class
3. Extract balance calculation logic
4. Extract split methods
5. Create Blueprint with 10 routes
6. Write tests
7. Remove group code from `app.py`

**Dependencies:**
- Transaction Service
- Notification Service
- Auth Service

**Deliverables:**
- Group service functional
- Split calculations accurate
- Settlement tracking working
- Invitations working

**Testing:**
- Group CRUD
- Member management
- Split calculations (equal, percentage, custom)
- Settlement tracking
- Balance calculations

---

### Phase 10: Extract Recurring Service (Week 12)
**Goal:** Extract recurring transaction detection

**Tasks:**
1. Create `src/services/recurring/` structure
2. Create `RecurringService` class
3. Integrate recurring detection module
4. Extract scheduling logic
5. Create Blueprint with 12 routes
6. Write tests
7. Remove recurring code from `app.py`

**Dependencies:**
- Transaction Service
- Recurring detection module

**Deliverables:**
- Recurring service functional
- Pattern detection working
- Candidate suggestions accurate
- Scheduling working

**Testing:**
- Recurring CRUD
- Pattern detection
- Candidate suggestions
- Scheduling logic
- Ignore patterns

---

### Phase 11: Extract Investment Service (Week 13)
**Goal:** Extract investment tracking (optional feature)

**Tasks:**
1. Create `src/services/investment/` structure
2. Create `InvestmentService` class
3. Integrate FMP/Yahoo modules
4. Extract sync logic
5. Create Blueprint with 14 routes
6. Write tests
7. Remove investment code from `app.py`

**Dependencies:**
- Account Service
- FMP cache
- Yahoo Finance integration
- Currency Service

**Deliverables:**
- Investment service functional
- Price updates working
- Portfolio sync working
- Performance tracking accurate

**Testing:**
- Portfolio CRUD
- Investment CRUD
- Price updates
- Portfolio-account sync
- Performance calculations

---

### Phase 12: Extract Analytics Service (Week 14)
**Goal:** Extract reporting and analytics

**Tasks:**
1. Create `src/services/analytics/` structure
2. Create `AnalyticsService` class
3. Extract dashboard logic
4. Extract report generation
5. Create Blueprint with 4 routes
6. Write tests
7. Remove analytics code from `app.py`

**Dependencies:**
- Transaction Service
- Account Service
- Investment Service
- Budget Service
- Notification Service

**Deliverables:**
- Analytics service functional
- Dashboard data accurate
- Reports generating correctly
- Stats calculations accurate

**Testing:**
- Dashboard data
- Monthly reports
- Spending trends
- Category analysis
- Asset/debt tracking

---

### Phase 13: Extract Notification Service (Week 15)
**Goal:** Extract email notifications

**Tasks:**
1. Create `src/services/notification/` structure
2. Create `NotificationService` class
3. Extract email sending logic
4. Extract scheduled tasks
5. Write tests
6. Remove notification code from `app.py`

**Dependencies:**
- Flask-Mail
- Email templates

**Deliverables:**
- Notification service functional
- Email sending working
- Scheduled tasks working

**Testing:**
- Email sending
- Monthly reports
- Budget alerts
- Group invitations
- Password reset emails

---

### Phase 14: Finalize & Cleanup (Week 16)
**Goal:** Complete migration and cleanup

**Tasks:**
1. Remove all extracted code from `app.py`
2. `app.py` should be minimal (just application factory registration)
3. Update all documentation
4. Complete test coverage
5. Performance testing
6. Security audit
7. Update deployment scripts

**Final `app.py` Structure:**
```python
from src import create_app

app = create_app()

if __name__ == '__main__':
    app.run()
```

**Deliverables:**
- Minimal `app.py`
- All services extracted
- 100% feature parity
- Comprehensive tests
- Updated documentation

**Testing:**
- Full integration test suite
- Performance benchmarks
- Security scan
- User acceptance testing

---

## 5. Migration Strategy

### Service Class Pattern

Each service follows this pattern:

```python
# src/services/[service_name]/service.py

from src.extensions import db
from src.models import [relevant models]
from src.utils import [relevant utils]

class [ServiceName]Service:
    """Business logic for [service_name]"""

    def __init__(self, db_session=None):
        self.db = db_session or db

    def create_[entity](self, data):
        """Create a new [entity]"""
        # Validation
        # Business logic
        # Database operation
        # Return result
        pass

    def get_[entity](self, entity_id):
        """Get [entity] by ID"""
        pass

    def update_[entity](self, entity_id, data):
        """Update [entity]"""
        pass

    def delete_[entity](self, entity_id):
        """Delete [entity]"""
        pass

    # Additional business logic methods
```

### Blueprint Pattern

Each service blueprint follows this pattern:

```python
# src/services/[service_name]/routes.py

from flask import Blueprint, request, jsonify, render_template
from flask_login import login_required, current_user
from .service import [ServiceName]Service
from .schemas import [ServiceName]Schema

bp = Blueprint('[service_name]', __name__, url_prefix='/[service_name]')
service = [ServiceName]Service()

@bp.route('/create', methods=['POST'])
@login_required
def create_[entity]():
    """Create new [entity]"""
    data = request.get_json()
    result = service.create_[entity](data)
    return jsonify(result), 201

@bp.route('/<int:entity_id>', methods=['GET'])
@login_required
def get_[entity](entity_id):
    """Get [entity] by ID"""
    result = service.get_[entity](entity_id)
    return jsonify(result), 200

# More routes...
```

### Application Factory Pattern

```python
# src/__init__.py

from flask import Flask
from src.extensions import db, mail, login_manager, migrate, scheduler
from src import config

def create_app(config_name='default'):
    app = Flask(__name__)
    app.config.from_object(config.get_config(config_name))

    # Initialize extensions
    db.init_app(app)
    mail.init_app(app)
    login_manager.init_app(app)
    migrate.init_app(app, db)
    scheduler.init_app(app)

    # Register blueprints
    from src.services.auth.routes import bp as auth_bp
    from src.services.transaction.routes import bp as transaction_bp
    from src.services.account.routes import bp as account_bp
    from src.services.budget.routes import bp as budget_bp
    from src.services.group.routes import bp as group_bp
    from src.services.category.routes import bp as category_bp
    from src.services.recurring.routes import bp as recurring_bp
    from src.services.investment.routes import bp as investment_bp
    from src.services.currency.routes import bp as currency_bp
    from src.services.analytics.routes import bp as analytics_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(transaction_bp)
    app.register_blueprint(account_bp)
    app.register_blueprint(budget_bp)
    app.register_blueprint(group_bp)
    app.register_blueprint(category_bp)
    app.register_blueprint(recurring_bp)
    app.register_blueprint(investment_bp)
    app.register_blueprint(currency_bp)
    app.register_blueprint(analytics_bp)

    # Register CLI commands
    from src.cli import register_commands
    register_commands(app)

    return app
```

---

## 6. Database Strategy

### Single Database Approach

**Decision:** Keep all services using the same database for now

**Rationale:**
- Simpler migration path
- No need for distributed transactions
- Easier to test locally
- Can split databases later if needed

### Model Access Pattern

Each service can access any model, but should primarily work with its own models:

**Ownership:**
- Auth Service → User, UserApiSettings
- Transaction Service → Expense, CategorySplit, Tag
- Account Service → Account, SimpleFin
- Budget Service → Budget
- Group Service → Group, Settlement
- Category Service → Category, CategoryMapping
- Recurring Service → RecurringExpense, IgnoredRecurringPattern
- Investment Service → Portfolio, Investment, InvestmentTransaction
- Currency Service → Currency

**Cross-Service Data Access:**
- Services can read other services' models
- Services should NOT write to other services' models
- Use service methods for cross-service operations

### Migration Handling

**Approach:**
- Keep existing Alembic migrations
- New migrations go in `migrations/versions/`
- Run migrations with: `flask db upgrade`

---

## 7. Testing Strategy

### Test Coverage Goals

**Target:** 80%+ code coverage

**Levels of Testing:**

1. **Unit Tests** - Test individual service methods
2. **Integration Tests** - Test service interactions
3. **End-to-End Tests** - Test complete user workflows

### Test Structure

```python
# tests/unit/test_transaction_service.py

import pytest
from src.services.transaction.service import TransactionService
from src.models import Expense, User, Account, Category

class TestTransactionService:

    @pytest.fixture
    def service(self, db_session):
        return TransactionService(db_session)

    @pytest.fixture
    def sample_user(self, db_session):
        user = User(email="test@example.com")
        db_session.add(user)
        db_session.commit()
        return user

    def test_create_transaction(self, service, sample_user):
        """Test creating a new transaction"""
        data = {
            'amount': 100.00,
            'description': 'Test expense',
            'user_id': sample_user.id,
            # ...
        }
        result = service.create_transaction(data)

        assert result['success'] is True
        assert result['transaction']['amount'] == 100.00

    def test_create_transaction_invalid_amount(self, service, sample_user):
        """Test creating transaction with invalid amount"""
        data = {
            'amount': -100.00,  # Invalid
            'user_id': sample_user.id,
        }

        with pytest.raises(ValueError):
            service.create_transaction(data)
```

### Testing Each Phase

**For each service extraction:**
1. Write unit tests for service class
2. Write integration tests for routes
3. Test cross-service interactions
4. Verify existing functionality unchanged

### Continuous Testing

**During migration:**
- Run tests after each extraction
- Maintain test coverage metrics
- No decrease in coverage allowed

---

## 8. Deployment Considerations

### Docker Updates

**Dockerfile Changes:**
- Update paths to new structure
- No other changes needed

**docker-compose.yml:**
- No changes needed
- Same services (app + db)

### Environment Variables

**No changes to `.env` file:**
- All existing variables work
- No new variables needed

### Production Deployment

**Steps:**
1. Pull latest code
2. Run migrations: `flask db upgrade`
3. Restart application
4. Monitor logs

### Rollback Plan

**Each phase has rollback capability:**
1. Keep old code commented out
2. Git tags for each phase
3. Database migrations reversible
4. Quick rollback with git revert

---

## 9. Rollback Plan

### Per-Phase Rollback

**Each phase completion creates:**
- Git tag: `migration-phase-X-complete`
- Database migration checkpoint
- Test results snapshot

**To rollback a phase:**
```bash
# Revert code
git revert [commit-hash]

# Rollback database
flask db downgrade

# Run tests
pytest
```

### Full Rollback

**Emergency rollback to monolith:**
1. Checkout tag before migration started
2. Rollback all database migrations
3. Restart application

**Command:**
```bash
git checkout pre-migration
flask db downgrade [migration-id]
docker-compose restart app
```

---

## 10. Success Criteria

### Phase Completion Criteria

**Each phase must meet:**
1. All tests passing
2. No decrease in code coverage
3. All existing routes working
4. Performance benchmarks met
5. Documentation updated
6. Code review approved

### Final Success Criteria

**Migration complete when:**
1. `app.py` < 200 lines
2. All 11 services extracted
3. Test coverage > 80%
4. All 128 routes working
5. Performance same or better
6. Documentation complete
7. Production deployment successful

---

## 11. Timeline Summary

| Phase | Duration | Description |
|-------|----------|-------------|
| 0 | Week 1 | Preparation & setup |
| 1 | Week 2 | Extract models |
| 2 | Week 3 | Extract utilities |
| 3 | Week 4 | Currency service |
| 4 | Week 5 | Category service |
| 5 | Week 6 | Auth service |
| 6 | Week 7-8 | Transaction service |
| 7 | Week 9 | Account service |
| 8 | Week 10 | Budget service |
| 9 | Week 11 | Group service |
| 10 | Week 12 | Recurring service |
| 11 | Week 13 | Investment service |
| 12 | Week 14 | Analytics service |
| 13 | Week 15 | Notification service |
| 14 | Week 16 | Finalize & cleanup |

**Total Duration:** 16 weeks (4 months)

---

## 12. Next Steps

Once this plan is approved:

1. **Week 1:** Create new folder structure
2. **Week 1:** Set up application factory
3. **Week 1:** Create base test infrastructure
4. **Week 2:** Begin Phase 1 (Extract models)

**Ready to proceed?** Let me know if you'd like to:
- Adjust the timeline
- Change the service boundaries
- Add/remove any services
- Modify the folder structure

I can start implementation immediately once approved!
