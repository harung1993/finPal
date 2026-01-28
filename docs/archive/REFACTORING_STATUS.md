# Backend Modularization - Current Status

## Completed Tasks ✅

### 1. Folder Structure Created
All necessary folders have been created:
- `src/models/` - Database models
- `src/services/` - Service modules (11 services)
- `src/utils/` - Utility functions
- `integrations/` - External integrations
- `tests/` - Test suite structure

### 2. Core Files Created
- ✅ `src/extensions.py` - Flask extensions initialization
- ✅ `src/config.py` - Centralized configuration
- ✅ `src/models/__init__.py` - Models package

### 3. Models Extracted
All 18 database models have been extracted into separate files:
- ✅ `src/models/associations.py` - Association tables (group_users, expense_tags)
- ✅ `src/models/currency.py` - Currency model
- ✅ `src/models/user.py` - User, UserApiSettings models
- ✅ `src/models/category.py` - Category, CategoryMapping, Tag models
- ✅ `src/models/account.py` - Account, SimpleFin models
- ✅ `src/models/transaction.py` - Expense, CategorySplit models (with calculate_splits method)
- ✅ `src/models/group.py` - Group, Settlement models
- ✅ `src/models/recurring.py` - RecurringExpense, IgnoredRecurringPattern models
- ✅ `src/models/budget.py` - Budget model (with all calculation methods)
- ✅ `src/models/investment.py` - Portfolio, Investment, InvestmentTransaction models

---

## Remaining Tasks 🔄

### Phase 1: Complete Foundation (High Priority)

#### 1.1 Update User Model Relationships
The User model needs to include relationship definitions that reference Group:
```python
# Add to user.py
created_groups = db.relationship('Group', backref='creator', lazy=True, foreign_keys='Group.created_by')
```

#### 1.2 Create Application Factory
File: `src/__init__.py`
- Set up Flask app factory pattern
- Initialize extensions
- Register all blueprints
- Configure OIDC if enabled
- Set up scheduled tasks

#### 1.3 Move Integration Modules
Move existing integration files to `integrations/`:
- `oidc_auth.py` → `integrations/oidc/auth.py`
- `oidc_user.py` → `integrations/oidc/user.py`
- `simplefin_client.py` → `integrations/simplefin/client.py`
- `recurring_detection.py` → `integrations/recurring/detector.py`
- `fmp_cache.py` → `integrations/investments/fmp_cache.py`
- `yfinance_integration_enhanced.py` → `integrations/investments/yfinance.py`
- `session_timeout.py` → Move to `src/utils/session_timeout.py`

#### 1.4 Extract Utility Functions
Create utility modules:
- `src/utils/decorators.py` - Login required, admin required, demo limited
- `src/utils/currency_converter.py` - Currency conversion logic
- `src/utils/date_utils.py` - Date/timezone helpers

---

### Phase 2: Extract Services (Service by Service)

Each service needs 3-4 files:
1. `service.py` - Business logic class
2. `routes.py` - Flask Blueprint with route handlers
3. `__init__.py` - Service initialization

#### 2.1 Currency Service (SIMPLEST - START HERE)
Location: `src/services/currency/`

**service.py:**
- `CurrencyService` class
- Methods: `get_all()`, `add()`, `update()`, `delete()`, `convert()`, `update_rates()`

**routes.py:**
- Blueprint: `currency_bp`
- Routes: `/currencies`, `/currencies/add`, `/currencies/update`, etc. (7 routes)
- Extract from app.py lines: 6276-6508

#### 2.2 Category Service
Location: `src/services/category/`

**service.py:**
- `CategoryService` class
- Methods: CRUD + `auto_categorize()`, `bulk_categorize()`

**routes.py:**
- Blueprint: `category_bp`
- Routes: 14 routes
- Extract from app.py lines: 8024-8846

#### 2.3 Auth Service
Location: `src/services/auth/`

**service.py:**
- `AuthService` class
- Methods: `login()`, `signup()`, `logout()`, `reset_password()`, etc.

**routes.py:**
- Blueprint: `auth_bp`
- Routes: 5+ routes
- Extract from app.py lines: 3442-3680, 12454-12554

#### 2.4 Transaction Service
Location: `src/services/transaction/`

**service.py:**
- `TransactionService` class
- Methods: `create()`, `update()`, `delete()`, `get_all()`, `export()`

**routes.py:**
- Blueprint: `transaction_bp`
- Routes: 10+ routes
- Extract from app.py lines: 4056-4727, 6510-6735

#### 2.5 Account Service
Location: `src/services/account/`

**service.py:**
- `AccountService` class
- Methods: CRUD + `import_csv()`, `sync_simplefin()`

**routes.py:**
- Blueprint: `account_bp`
- Routes: 14+ routes
- Extract from app.py lines: 6737-8023

#### 2.6 Budget Service
Location: `src/services/budget/`

**service.py:**
- `BudgetService` class
- Methods: CRUD + `check_alerts()`, `get_spending()`

**routes.py:**
- Blueprint: `budget_bp`
- Routes: 11 routes
- Extract from app.py lines: 8848-10013

#### 2.7 Group Service
Location: `src/services/group/`

**service.py:**
- `GroupService` class
- Methods: CRUD + `calculate_balances()`, `add_member()`, `remove_member()`

**routes.py:**
- Blueprint: `group_bp`
- Routes: 10 routes
- Extract from app.py lines: 5689-6274

#### 2.8 Recurring Service
Location: `src/services/recurring/`

**service.py:**
- `RecurringService` class
- Methods: CRUD + `detect_patterns()`, `get_candidates()`

**routes.py:**
- Blueprint: `recurring_bp`
- Routes: 12 routes
- Extract from app.py lines: 4809-5627

#### 2.9 Investment Service
Location: `src/services/investment/`

**service.py:**
- `InvestmentService` class
- Methods: Portfolio/Investment CRUD + `update_prices()`, `sync_to_accounts()`

**routes.py:**
- Blueprint: `investment_bp`
- Routes: 14 routes
- Extract from app.py lines: 10399-11409

#### 2.10 Analytics Service
Location: `src/services/analytics/`

**service.py:**
- `AnalyticsService` class
- Methods: `get_dashboard_data()`, `generate_monthly_report()`, `get_stats()`

**routes.py:**
- Blueprint: `analytics_bp`
- Routes: 4 routes
- Extract from app.py lines: 3684-3989, 10102-10397

#### 2.11 Notification Service
Location: `src/services/notification/`

**service.py:**
- `NotificationService` class
- Methods: `send_email()`, `send_monthly_reports()`, `send_budget_alerts()`

**No routes** - Internal service only
- Extract email logic from throughout app.py

---

### Phase 3: Update Main Application

#### 3.1 Create New app.py
The new `app.py` should be minimal:

```python
from src import create_app
import os

app = create_app()

if __name__ == '__main__':
    app.run(
        host='0.0.0.0',
        port=int(os.getenv('PORT', 5001)),
        debug=os.getenv('DEBUG', 'False').lower() == 'true'
    )
```

#### 3.2 Backup Old app.py
Rename current `app.py` to `app_old.py` for reference

#### 3.3 Update Imports
All files that import from `app` need updating:
- Utility scripts (init_db.py, reset.py, etc.)
- Templates that use Flask context
- Any other files

---

### Phase 4: Testing & Validation

#### 4.1 Create Test Configuration
- `tests/conftest.py` - Pytest fixtures
- Database fixtures
- Mock user fixtures

#### 4.2 Test Each Service
- Unit tests for service classes
- Integration tests for routes
- Test database operations

#### 4.3 Test Full Application
- Start the application
- Test all major workflows:
  - User login/signup
  - Add expense
  - Create budget
  - SimpleFin sync
  - Generate report
  - etc.

---

## Quick Start Commands

### To Continue Modularization:

1. **Complete Foundation:**
```bash
# We need to create:
# - src/__init__.py (application factory)
# - Move integration modules
# - Create utility modules
```

2. **Start with Currency Service (simplest):**
```bash
# Create service files
mkdir -p src/services/currency
# Create service.py, routes.py, __init__.py
```

3. **Test After Each Service:**
```bash
# Run tests
pytest tests/unit/test_currency_service.py

# Or run app
python app.py
```

---

## Critical Dependencies

### Model Import Order (Important!)
Models must be imported in this order to avoid circular dependencies:
1. associations
2. currency
3. user
4. category, tag
5. account
6. transaction
7. group
8. recurring
9. budget
10. investment

### Service Dependencies
```
Auth Service ← (no dependencies)
Currency Service ← (no dependencies)
Category Service ← (no dependencies)
Account Service ← Transaction, Category
Transaction Service ← Category, Account, Currency
Budget Service ← Transaction, Category
Group Service ← Transaction
Recurring Service ← Transaction
Investment Service ← Account, Currency
Analytics Service ← ALL services
Notification Service ← (uses data from other services)
```

---

## Estimated Effort Remaining

- **Phase 1 (Foundation):** 2-3 hours
- **Phase 2 (Services):** 10-15 hours (1-1.5 hours per service)
- **Phase 3 (Main App):** 1-2 hours
- **Phase 4 (Testing):** 3-5 hours

**Total:** ~16-25 hours of work

---

## Next Immediate Steps

1. ✅ Create `src/__init__.py` application factory
2. ✅ Move integration modules to `integrations/`
3. ✅ Create utility modules
4. ✅ Extract Currency Service (easiest, good test case)
5. ✅ Test Currency Service works
6. ✅ Proceed with remaining services

---

## Notes & Considerations

### Database Migrations
- Existing migrations in `migrations/` folder will continue to work
- No database schema changes needed
- Just code reorganization

### Frontend (No Changes Needed)
- Templates stay in `templates/`
- Static files stay in `static/`
- JavaScript files unchanged
- Only backend routes reorganized

### Docker
- Dockerfile may need path updates
- docker-compose.yml should work as-is

### Environment Variables
- All `.env` variables stay the same
- No new variables needed

---

## Risk Mitigation

1. **Keep app_old.py** - Original file as backup
2. **Test incrementally** - Test after each service extraction
3. **Git commits** - Commit after each major milestone
4. **Rollback plan** - Can revert to monolith if needed

---

## Benefits After Completion

✨ **Maintainability:** Each service ~200-500 lines instead of 12,574 lines
✨ **Readability:** Clear separation of concerns
✨ **Testability:** Isolated unit tests per service
✨ **Scalability:** Easy to convert to microservices later
✨ **Team Collaboration:** Multiple devs can work on different services
✨ **Debugging:** Easier to locate and fix bugs
