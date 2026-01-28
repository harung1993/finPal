# Integration Testing Guide

## Overview

This document provides a comprehensive guide for testing the modularized DollarDollar application. Since Phase 2 (service extraction) is complete, we need to validate that all services work correctly both individually and together.

---

## Testing Prerequisites

### 1. Environment Setup

```bash
# Navigate to project directory
cd dollardollar

# Create virtual environment (if not exists)
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate  # On Unix/macOS
# OR
venv\Scripts\activate  # On Windows

# Install dependencies
pip install -r requirements.txt

# Copy environment file
cp .env.example .env

# Edit .env with your configuration
nano .env
```

### 2. Database Setup

```bash
# Initialize database
flask db upgrade

# (Optional) Create demo data
python3 demo_reset.py
```

### 3. Start Application

```bash
# Development mode
python3 app.py

# OR with Flask CLI
export FLASK_APP=app.py
flask run --port 5001
```

Expected output:
```
✅ App created successfully
✅ Blueprints registered: 15
✅ DollarDollar application created successfully
```

---

## Service Testing Checklist

### ✅ 1. Currency Service Tests

**Base URL:** `/currencies`

**Tests:**
- [ ] GET `/currencies/` - List all currencies
- [ ] POST `/currencies/add` - Add new currency (admin only)
  - Test with: `{"code": "EUR", "name": "Euro", "symbol": "€"}`
- [ ] POST `/currencies/update/<code>` - Update currency
- [ ] DELETE `/currencies/delete/<code>` - Delete currency
- [ ] POST `/currencies/set-base/<code>` - Set base currency
- [ ] POST `/currencies/update-rates` - Update exchange rates from Frankfurter API
- [ ] POST `/currencies/set-default` - Set user default currency

**Validation Points:**
- ✅ Only admins can add/update/delete currencies
- ✅ Cannot delete base currency
- ✅ ISO code validation (3 letters)
- ✅ Duplicate prevention
- ✅ Exchange rates update successfully

---

### ✅ 2. Category Service Tests

**Base URLs:** `/categories`, `/category_mappings`

**Tests:**
- [ ] GET `/categories` - List all categories
- [ ] POST `/categories/create_defaults` - Create default categories
- [ ] POST `/categories/add` - Add new category
  - Test with: `{"name": "Test Category", "type": "expense"}`
- [ ] POST `/categories/edit/<id>` - Edit category
- [ ] POST `/categories/delete/<id>` - Delete category
- [ ] GET `/category_mappings/` - List mappings
- [ ] POST `/category_mappings/add` - Add mapping
  - Test with: `{"pattern": "starbucks", "category_id": 1}`
- [ ] POST `/category_mappings/bulk_categorize` - Bulk categorize transactions
- [ ] GET `/api/categories` - JSON API endpoint

**Validation Points:**
- ✅ Hierarchical categories (parent/child)
- ✅ Auto-categorization works
- ✅ Bulk categorization processes multiple transactions
- ✅ Category mappings are case-insensitive
- ✅ Cannot delete category with transactions

---

### ✅ 3. Auth Service Tests

**Base URLs:** `/`, `/admin`

**Tests:**
- [ ] POST `/signup` - User registration
  - Test with: `{"email": "test@example.com", "password": "Test123!"}`
- [ ] POST `/login` - User login
- [ ] GET `/logout` - User logout
- [ ] POST `/reset_password_request` - Request password reset
- [ ] POST `/reset_password/<token>` - Reset password with token
- [ ] POST `/admin/add_user` - Admin: Add user
- [ ] POST `/admin/delete_user/<id>` - Admin: Delete user (cascade)
- [ ] POST `/admin/reset_password` - Admin: Reset user password
- [ ] POST `/admin/toggle_admin_status/<id>` - Admin: Toggle admin

**Validation Points:**
- ✅ Password hashing works
- ✅ Session management works
- ✅ OIDC login (if configured)
- ✅ Default categories created on signup
- ✅ Welcome email sent
- ✅ Cascade delete removes all user data
- ✅ Cannot delete self as admin
- ✅ Demo mode timeout works

---

### ✅ 4. Transaction Service Tests

**Base URLs:** `/transactions`, `/tags`

**Tests:**
- [ ] POST `/add_expense` - Create transaction
  - Test with: `{"amount": 100.00, "description": "Test", "category_id": 1}`
- [ ] POST `/update_expense` - Update transaction
- [ ] POST `/delete_expense` - Delete transaction
- [ ] GET `/transactions` - List transactions with filters
  - Test filters: date range, category, account, tags
- [ ] GET `/export_transactions` - CSV export
- [ ] POST `/split_transaction` - Create category split
  - Test with: `{"splits": [{"category_id": 1, "amount": 50}, {"category_id": 2, "amount": 50}]}`
- [ ] POST `/add_tag` - Add tag
- [ ] POST `/delete_tag` - Delete tag

**Validation Points:**
- ✅ Multi-category splits work
- ✅ Split amounts equal transaction amount
- ✅ Tags can be attached to transactions
- ✅ CSV export includes all fields
- ✅ Date filtering works
- ✅ Account balance updates correctly
- ✅ Currency conversion works

---

### ✅ 5. Account Service Tests

**Base URLs:** `/accounts`, `/simplefin`

**Tests:**
- [ ] GET `/accounts` - List accounts
- [ ] POST `/add_account` - Create account
  - Test with: `{"name": "Checking", "type": "checking", "balance": 1000.00}`
- [ ] POST `/update_account` - Update account
- [ ] POST `/delete_account` - Delete account
- [ ] POST `/import_transactions` - CSV import
  - Test with sample CSV file
- [ ] POST `/simplefin/setup_access` - SimpleFin setup
- [ ] POST `/simplefin/sync_accounts` - SimpleFin sync
- [ ] GET `/simplefin/callback` - OAuth callback

**Validation Points:**
- ✅ Account types: checking, savings, credit, investment
- ✅ Balance tracking accurate
- ✅ CSV import auto-categorizes
- ✅ SimpleFin OAuth flow works
- ✅ SimpleFin sync creates transactions
- ✅ Duplicate transaction prevention

---

### ✅ 6. Budget Service Tests

**Base URL:** `/budgets`

**Tests:**
- [ ] GET `/budgets` - List budgets
- [ ] POST `/budgets/add` - Create budget
  - Test with: `{"category_id": 1, "amount": 500.00, "period": "monthly"}`
- [ ] POST `/budgets/update` - Update budget
- [ ] POST `/budgets/delete` - Delete budget
- [ ] GET `/budgets/<id>/transactions` - Budget transactions
- [ ] POST `/budgets/check_alerts` - Check budget alerts

**Validation Points:**
- ✅ Budget periods: monthly, yearly, quarterly
- ✅ Spending calculations accurate
- ✅ Budget alerts trigger correctly
- ✅ Subcategories included in budget
- ✅ Transaction filtering by budget works

---

### ✅ 7. Group Service Tests

**Base URLs:** `/groups`, `/settlements`

**Tests:**
- [ ] GET `/groups` - List groups
- [ ] POST `/add_group` - Create group
  - Test with: `{"name": "Roommates", "members": ["user1@ex.com", "user2@ex.com"]}`
- [ ] GET `/group/<id>` - Group details
- [ ] POST `/update_group` - Update group
- [ ] POST `/delete_group` - Delete group
- [ ] POST `/group/add_member` - Add member
- [ ] POST `/group/remove_member` - Remove member
- [ ] POST `/add_settlement` - Record settlement
  - Test with: `{"from_user_id": 1, "to_user_id": 2, "amount": 50.00}`

**Validation Points:**
- ✅ Split methods: equal, percentage, custom
- ✅ Balance calculations accurate
- ✅ Member invitations work
- ✅ Settlement tracking works
- ✅ Group expenses show in transactions

---

### ✅ 8. Recurring Service Tests

**Base URL:** `/recurring`

**Tests:**
- [ ] GET `/recurring` - List recurring expenses
- [ ] POST `/add_recurring` - Create recurring expense
  - Test with: `{"amount": 50.00, "description": "Netflix", "frequency": "monthly"}`
- [ ] POST `/update_recurring` - Update recurring expense
- [ ] POST `/delete_recurring` - Delete recurring expense
- [ ] POST `/detect_recurring_transactions` - Pattern detection
- [ ] GET `/recurring_candidates` - Suggested recurring expenses
- [ ] POST `/ignore_recurring_pattern` - Ignore pattern

**Validation Points:**
- ✅ Pattern detection identifies recurring expenses
- ✅ Candidate suggestions accurate
- ✅ Scheduling works for different frequencies
- ✅ Ignore list prevents false positives
- ✅ Automatic creation of recurring instances

---

### ✅ 9. Investment Service Tests

**Base URL:** `/investments`

**Tests:**
- [ ] GET `/investments` - View portfolio and investments
- [ ] POST `/add_portfolio` - Create portfolio
- [ ] POST `/add_investment` - Add investment
  - Test with: `{"symbol": "AAPL", "shares": 10, "cost_basis": 150.00}`
- [ ] POST `/update_prices` - Update investment prices (FMP/Yahoo)
- [ ] POST `/sync_investments_to_accounts` - Sync with accounts

**Validation Points:**
- ✅ Price updates from FMP API work
- ✅ Yahoo Finance fallback works
- ✅ Portfolio calculations accurate
- ✅ Sync creates investment accounts
- ✅ Performance tracking works

---

### ✅ 10. Analytics Service Tests

**Base URL:** `/dashboard`, `/stats`

**Tests:**
- [ ] GET `/dashboard` - Main dashboard
- [ ] GET `/stats` - Statistics page
- [ ] POST `/generate_monthly_report` - Generate report
- [ ] GET `/spending_comparison` - Compare spending

**Validation Points:**
- ✅ Dashboard loads all data correctly
- ✅ Statistics calculations accurate
- ✅ Monthly reports generate
- ✅ Spending trends visualize
- ✅ Category analysis works
- ✅ Asset/debt tracking accurate

---

### ✅ 11. Notification Service Tests

**Internal Service** (No HTTP endpoints)

**Tests:**
- [ ] `send_automatic_monthly_reports()` - Scheduled monthly reports
- [ ] `send_budget_alerts()` - Budget alert emails
- [ ] `send_welcome_email()` - New user welcome
- [ ] `send_password_reset_email()` - Password reset
- [ ] `send_group_invitation()` - Group invites

**Validation Points:**
- ✅ Email sending works (SMTP configured)
- ✅ HTML templates render correctly
- ✅ Scheduled tasks execute
- ✅ Email queue processes

---

## Cross-Service Integration Tests

### Test 1: Complete User Workflow
1. **Signup** → Auth Service creates user
2. **Login** → Auth Service authenticates
3. **Create Categories** → Category Service (defaults)
4. **Add Account** → Account Service
5. **Add Transaction** → Transaction Service (updates account balance)
6. **Create Budget** → Budget Service (uses categories)
7. **Check Dashboard** → Analytics Service (aggregates data)

**Expected:** All services work together seamlessly

---

### Test 2: SimpleFin Integration
1. **Setup SimpleFin** → Account Service OAuth
2. **Sync Accounts** → Account Service fetches accounts
3. **Sync Transactions** → Transaction Service creates transactions
4. **Auto-categorize** → Category Service applies mappings
5. **Update Budgets** → Budget Service recalculates
6. **Send Alerts** → Notification Service emails

**Expected:** End-to-end SimpleFin flow works

---

### Test 3: Group Expense Splitting
1. **Create Group** → Group Service
2. **Invite Members** → Notification Service sends emails
3. **Add Group Expense** → Transaction Service
4. **Split Expense** → Group Service calculates balances
5. **Record Settlement** → Group Service updates balances
6. **View Dashboard** → Analytics Service shows group data

**Expected:** Group expense workflow complete

---

### Test 4: Recurring Expense Detection
1. **Add Transactions** → Transaction Service (similar transactions)
2. **Detect Patterns** → Recurring Service analyzes
3. **Suggest Candidates** → Recurring Service lists patterns
4. **Create Recurring** → Recurring Service (user confirms)
5. **Auto-create Future** → Recurring Service schedules
6. **Budget Tracking** → Budget Service includes recurring

**Expected:** Recurring detection and creation works

---

### Test 5: Investment Tracking
1. **Create Portfolio** → Investment Service
2. **Add Investments** → Investment Service
3. **Update Prices** → Investment Service (FMP/Yahoo)
4. **Sync to Account** → Account Service creates account
5. **View Dashboard** → Analytics Service shows portfolio value
6. **Track Performance** → Investment Service calculates returns

**Expected:** Investment tracking end-to-end works

---

## Automated Testing Script

### Create Test Script: `test_integration.py`

```python
"""
Integration test suite for DollarDollar services
Run with: python3 test_integration.py
"""

import requests
import json
from datetime import datetime, timedelta

BASE_URL = "http://localhost:5001"
session = requests.Session()

def test_auth_flow():
    """Test authentication workflow"""
    print("Testing Auth Service...")

    # Signup
    response = session.post(f"{BASE_URL}/signup", data={
        "email": "test@example.com",
        "password": "Test123!",
        "confirm_password": "Test123!"
    })
    assert response.status_code in [200, 302], "Signup failed"

    # Login
    response = session.post(f"{BASE_URL}/login", data={
        "email": "test@example.com",
        "password": "Test123!"
    })
    assert response.status_code in [200, 302], "Login failed"

    print("✅ Auth Service working")

def test_currency_service():
    """Test currency service"""
    print("Testing Currency Service...")

    response = session.get(f"{BASE_URL}/currencies/")
    assert response.status_code == 200, "Currency list failed"

    print("✅ Currency Service working")

def test_category_service():
    """Test category service"""
    print("Testing Category Service...")

    # Create defaults
    response = session.post(f"{BASE_URL}/categories/create_defaults")
    assert response.status_code in [200, 302], "Create defaults failed"

    # List categories
    response = session.get(f"{BASE_URL}/categories")
    assert response.status_code == 200, "List categories failed"

    print("✅ Category Service working")

def test_account_service():
    """Test account service"""
    print("Testing Account Service...")

    response = session.post(f"{BASE_URL}/add_account", data={
        "name": "Test Checking",
        "type": "checking",
        "balance": 1000.00,
        "currency": "USD"
    })
    assert response.status_code in [200, 302], "Add account failed"

    print("✅ Account Service working")

def test_transaction_service():
    """Test transaction service"""
    print("Testing Transaction Service...")

    response = session.post(f"{BASE_URL}/add_expense", data={
        "amount": 50.00,
        "description": "Test Transaction",
        "date": datetime.now().strftime("%Y-%m-%d"),
        "category_id": 1,
        "account_id": 1
    })
    assert response.status_code in [200, 302], "Add transaction failed"

    print("✅ Transaction Service working")

def test_budget_service():
    """Test budget service"""
    print("Testing Budget Service...")

    response = session.get(f"{BASE_URL}/budgets")
    assert response.status_code == 200, "List budgets failed"

    print("✅ Budget Service working")

def test_dashboard():
    """Test analytics dashboard"""
    print("Testing Analytics Service...")

    response = session.get(f"{BASE_URL}/dashboard")
    assert response.status_code == 200, "Dashboard failed"

    print("✅ Analytics Service working")

def run_all_tests():
    """Run all integration tests"""
    print("=" * 50)
    print("DollarDollar Integration Test Suite")
    print("=" * 50)

    try:
        test_auth_flow()
        test_currency_service()
        test_category_service()
        test_account_service()
        test_transaction_service()
        test_budget_service()
        test_dashboard()

        print("\n" + "=" * 50)
        print("✅ ALL TESTS PASSED!")
        print("=" * 50)

    except AssertionError as e:
        print(f"\n❌ TEST FAILED: {e}")
        return False
    except Exception as e:
        print(f"\n❌ ERROR: {e}")
        return False

    return True

if __name__ == "__main__":
    run_all_tests()
```

---

## Manual Testing Checklist

### Pre-Deployment Validation

- [ ] All 11 services load without errors
- [ ] All 15 blueprints registered
- [ ] Database migrations apply successfully
- [ ] Templates render correctly
- [ ] Static files load
- [ ] No 404 errors on known routes
- [ ] No 500 errors on any endpoint
- [ ] CSRF protection works
- [ ] Session management works
- [ ] Login/logout flow works

### Cross-Service Validation

- [ ] Transaction creation updates account balance
- [ ] Budget alerts trigger on overspend
- [ ] Auto-categorization applies to imports
- [ ] Group expenses calculate balances correctly
- [ ] Recurring detection identifies patterns
- [ ] Investment sync creates accounts
- [ ] Dashboard aggregates all data
- [ ] Email notifications send

### Performance Validation

- [ ] Dashboard loads < 2 seconds
- [ ] Transaction list loads < 1 second
- [ ] CSV export completes < 5 seconds
- [ ] SimpleFin sync completes < 30 seconds
- [ ] Price updates complete < 10 seconds

---

## Common Issues & Solutions

### Issue 1: Import Errors
**Symptom:** `ModuleNotFoundError: No module named 'src'`
**Solution:** Ensure you're in the correct directory and PYTHONPATH is set
```bash
export PYTHONPATH="${PYTHONPATH}:$(pwd)"
```

### Issue 2: Database Errors
**Symptom:** `sqlalchemy.exc.OperationalError`
**Solution:** Run migrations
```bash
flask db upgrade
```

### Issue 3: Blueprint Not Found
**Symptom:** `404 Not Found` on valid route
**Solution:** Check blueprint registration in `src/__init__.py`

### Issue 4: CSRF Token Missing
**Symptom:** `The CSRF token is missing`
**Solution:** Ensure forms include `{{ form.csrf_token }}`

### Issue 5: Session Issues
**Symptom:** Logged out unexpectedly
**Solution:** Check SESSION_TYPE in config

---

## Testing Completion Checklist

- [ ] All 11 services tested individually
- [ ] All cross-service workflows tested
- [ ] All edge cases handled
- [ ] All error messages clear
- [ ] All validations working
- [ ] All emails sending
- [ ] All scheduled tasks running
- [ ] All integrations working (OIDC, SimpleFin)
- [ ] Performance acceptable
- [ ] Security tested (XSS, CSRF, SQL injection)

---

## Next Steps After Testing

1. **Fix any issues found** during testing
2. **Document any bugs** in GitHub issues
3. **Update user documentation** based on findings
4. **Create deployment plan** for production
5. **Set up monitoring** for production errors

---

**Document Version:** 1.0
**Last Updated:** December 1, 2024
**Status:** Ready for Testing
