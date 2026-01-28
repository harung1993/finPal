#!/usr/bin/env python3
"""
Comprehensive Backend API Test Suite for DollarDollar
Tests all API endpoints and functionality
"""

import requests
import json
from datetime import datetime, timedelta

BASE_URL = "http://localhost:5051"
API_V1 = f"{BASE_URL}/api/v1"

class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    END = '\033[0m'

def print_test(name, passed, details=""):
    """Print test result"""
    status = f"{Colors.GREEN}✓ PASS{Colors.END}" if passed else f"{Colors.RED}✗ FAIL{Colors.END}"
    print(f"{status} - {name}")
    if details:
        print(f"  {details}")

def print_section(name):
    """Print section header"""
    print(f"\n{Colors.BLUE}{'='*60}{Colors.END}")
    print(f"{Colors.BLUE}{name}{Colors.END}")
    print(f"{Colors.BLUE}{'='*60}{Colors.END}")

class BackendTester:
    def __init__(self):
        self.session = requests.Session()
        self.token = None
        self.user_email = f"test_{datetime.now().timestamp()}@example.com"
        self.user_password = "TestPassword123!"
        self.account_id = None
        self.category_id = None
        self.transaction_id = None
        self.budget_id = None
        self.group_id = None

    def test_health_check(self):
        """Test basic server health"""
        print_section("HEALTH CHECK")
        try:
            response = requests.get(BASE_URL, timeout=5)
            print_test("Server responding", response.status_code in [200, 302],
                      f"Status: {response.status_code}")
            return True
        except Exception as e:
            print_test("Server responding", False, str(e))
            return False

    def test_registration(self):
        """Test user registration"""
        print_section("USER REGISTRATION")
        try:
            response = self.session.post(
                f"{API_V1}/auth/register",
                json={
                    "email": self.user_email,
                    "password": self.user_password,
                    "confirm_password": self.user_password
                }
            )
            success = response.status_code in [200, 201]
            print_test("User registration", success,
                      f"Status: {response.status_code}")
            if success:
                print(f"  User: {self.user_email}")
            else:
                print(f"  Response: {response.text[:200]}")
            return success
        except Exception as e:
            print_test("User registration", False, str(e))
            return False

    def test_login(self):
        """Test user login"""
        print_section("USER LOGIN")
        try:
            response = self.session.post(
                f"{API_V1}/auth/login",
                json={
                    "email": self.user_email,
                    "password": self.user_password
                }
            )
            success = response.status_code == 200
            if success:
                data = response.json()
                self.token = data.get('access_token')
                if self.token:
                    self.session.headers.update({
                        'Authorization': f'Bearer {self.token}'
                    })
                    print_test("User login", True, "Token received")
                else:
                    print_test("User login", False, "No token in response")
                    success = False
            else:
                print_test("User login", False,
                          f"Status: {response.status_code}, Response: {response.text[:200]}")
            return success
        except Exception as e:
            print_test("User login", False, str(e))
            return False

    def test_accounts(self):
        """Test account management"""
        print_section("ACCOUNT MANAGEMENT")

        # Create account
        try:
            response = self.session.post(
                f"{API_V1}/accounts",
                json={
                    "name": "Test Checking Account",
                    "account_type": "checking",
                    "balance": 1000.00,
                    "currency": "USD"
                }
            )
            success = response.status_code in [200, 201]
            if success:
                data = response.json()
                self.account_id = data.get('id') or data.get('account_id')
                print_test("Create account", True, f"Account ID: {self.account_id}")
            else:
                print_test("Create account", False,
                          f"Status: {response.status_code}, Response: {response.text[:200]}")
                return False
        except Exception as e:
            print_test("Create account", False, str(e))
            return False

        # List accounts
        try:
            response = self.session.get(f"{API_V1}/accounts")
            success = response.status_code == 200
            if success:
                accounts = response.json()
                print_test("List accounts", True, f"Found {len(accounts)} accounts")
            else:
                print_test("List accounts", False, f"Status: {response.status_code}")
        except Exception as e:
            print_test("List accounts", False, str(e))

        # Get specific account
        if self.account_id:
            try:
                response = self.session.get(f"{API_V1}/accounts/{self.account_id}")
                success = response.status_code == 200
                print_test("Get account details", success,
                          f"Status: {response.status_code}")
            except Exception as e:
                print_test("Get account details", False, str(e))

        return True

    def test_categories(self):
        """Test category management"""
        print_section("CATEGORY MANAGEMENT")

        # Create category
        try:
            response = self.session.post(
                f"{API_V1}/categories",
                json={
                    "name": "Test Groceries",
                    "type": "expense",
                    "color": "#FF5733"
                }
            )
            success = response.status_code in [200, 201]
            if success:
                data = response.json()
                self.category_id = data.get('id') or data.get('category_id')
                print_test("Create category", True, f"Category ID: {self.category_id}")
            else:
                print_test("Create category", False,
                          f"Status: {response.status_code}, Response: {response.text[:200]}")
                return False
        except Exception as e:
            print_test("Create category", False, str(e))
            return False

        # List categories
        try:
            response = self.session.get(f"{API_V1}/categories")
            success = response.status_code == 200
            if success:
                categories = response.json()
                print_test("List categories", True, f"Found {len(categories)} categories")
            else:
                print_test("List categories", False, f"Status: {response.status_code}")
        except Exception as e:
            print_test("List categories", False, str(e))

        return True

    def test_transactions(self):
        """Test transaction management"""
        print_section("TRANSACTION MANAGEMENT")

        if not self.account_id or not self.category_id:
            print_test("Transaction test", False, "Missing account or category")
            return False

        # Create transaction
        try:
            response = self.session.post(
                f"{API_V1}/transactions",
                json={
                    "account_id": self.account_id,
                    "category_id": self.category_id,
                    "amount": -50.00,
                    "description": "Test grocery purchase",
                    "date": datetime.now().isoformat(),
                    "type": "expense"
                }
            )
            success = response.status_code in [200, 201]
            if success:
                data = response.json()
                self.transaction_id = data.get('id') or data.get('transaction_id')
                print_test("Create transaction", True, f"Transaction ID: {self.transaction_id}")
            else:
                print_test("Create transaction", False,
                          f"Status: {response.status_code}, Response: {response.text[:200]}")
                return False
        except Exception as e:
            print_test("Create transaction", False, str(e))
            return False

        # List transactions
        try:
            response = self.session.get(f"{API_V1}/transactions")
            success = response.status_code == 200
            if success:
                transactions = response.json()
                print_test("List transactions", True, f"Found {len(transactions)} transactions")
            else:
                print_test("List transactions", False, f"Status: {response.status_code}")
        except Exception as e:
            print_test("List transactions", False, str(e))

        # Get specific transaction
        if self.transaction_id:
            try:
                response = self.session.get(f"{API_V1}/transactions/{self.transaction_id}")
                success = response.status_code == 200
                print_test("Get transaction details", success,
                          f"Status: {response.status_code}")
            except Exception as e:
                print_test("Get transaction details", False, str(e))

        # Update transaction
        if self.transaction_id:
            try:
                response = self.session.put(
                    f"{API_V1}/transactions/{self.transaction_id}",
                    json={
                        "amount": -55.00,
                        "description": "Updated grocery purchase"
                    }
                )
                success = response.status_code == 200
                print_test("Update transaction", success,
                          f"Status: {response.status_code}")
            except Exception as e:
                print_test("Update transaction", False, str(e))

        return True

    def test_budgets(self):
        """Test budget management"""
        print_section("BUDGET MANAGEMENT")

        if not self.category_id:
            print_test("Budget test", False, "Missing category")
            return False

        # Create budget
        try:
            response = self.session.post(
                f"{API_V1}/budgets",
                json={
                    "category_id": self.category_id,
                    "amount": 500.00,
                    "period": "monthly",
                    "start_date": datetime.now().isoformat()
                }
            )
            success = response.status_code in [200, 201]
            if success:
                data = response.json()
                self.budget_id = data.get('id') or data.get('budget_id')
                print_test("Create budget", True, f"Budget ID: {self.budget_id}")
            else:
                print_test("Create budget", False,
                          f"Status: {response.status_code}, Response: {response.text[:200]}")
        except Exception as e:
            print_test("Create budget", False, str(e))

        # List budgets
        try:
            response = self.session.get(f"{API_V1}/budgets")
            success = response.status_code == 200
            if success:
                budgets = response.json()
                print_test("List budgets", True, f"Found {len(budgets)} budgets")
            else:
                print_test("List budgets", False, f"Status: {response.status_code}")
        except Exception as e:
            print_test("List budgets", False, str(e))

        return True

    def test_groups(self):
        """Test group management"""
        print_section("GROUP MANAGEMENT")

        # Create group
        try:
            response = self.session.post(
                f"{API_V1}/groups",
                json={
                    "name": "Test Household",
                    "description": "Test household group"
                }
            )
            success = response.status_code in [200, 201]
            if success:
                data = response.json()
                self.group_id = data.get('id') or data.get('group_id')
                print_test("Create group", True, f"Group ID: {self.group_id}")
            else:
                print_test("Create group", False,
                          f"Status: {response.status_code}, Response: {response.text[:200]}")
        except Exception as e:
            print_test("Create group", False, str(e))

        # List groups
        try:
            response = self.session.get(f"{API_V1}/groups")
            success = response.status_code == 200
            if success:
                groups = response.json()
                print_test("List groups", True, f"Found {len(groups)} groups")
            else:
                print_test("List groups", False, f"Status: {response.status_code}")
        except Exception as e:
            print_test("List groups", False, str(e))

        return True

    def test_analytics(self):
        """Test analytics endpoints"""
        print_section("ANALYTICS")

        # Dashboard stats
        try:
            response = self.session.get(f"{API_V1}/analytics/dashboard")
            success = response.status_code == 200
            if success:
                data = response.json()
                print_test("Dashboard stats", True,
                          f"Keys: {list(data.keys())[:5]}")
            else:
                print_test("Dashboard stats", False, f"Status: {response.status_code}")
        except Exception as e:
            print_test("Dashboard stats", False, str(e))

        # Spending by category
        try:
            response = self.session.get(f"{API_V1}/analytics/spending-by-category")
            success = response.status_code == 200
            print_test("Spending by category", success,
                      f"Status: {response.status_code}")
        except Exception as e:
            print_test("Spending by category", False, str(e))

        # Monthly trends
        try:
            response = self.session.get(f"{API_V1}/analytics/monthly-trends")
            success = response.status_code == 200
            print_test("Monthly trends", success,
                      f"Status: {response.status_code}")
        except Exception as e:
            print_test("Monthly trends", False, str(e))

        return True

    def test_currencies(self):
        """Test currency endpoints"""
        print_section("CURRENCIES")

        try:
            response = self.session.get(f"{API_V1}/currencies")
            success = response.status_code == 200
            if success:
                currencies = response.json()
                print_test("List currencies", True,
                          f"Found {len(currencies)} currencies")
            else:
                print_test("List currencies", False, f"Status: {response.status_code}")
        except Exception as e:
            print_test("List currencies", False, str(e))

        return True

    def run_all_tests(self):
        """Run all tests"""
        print(f"\n{Colors.YELLOW}{'='*60}{Colors.END}")
        print(f"{Colors.YELLOW}DOLLARDOLLAR COMPREHENSIVE API TEST SUITE{Colors.END}")
        print(f"{Colors.YELLOW}{'='*60}{Colors.END}")
        print(f"Base URL: {BASE_URL}")
        print(f"API URL: {API_V1}")
        print(f"Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")

        # Run tests in order
        if not self.test_health_check():
            print(f"\n{Colors.RED}Server is not responding. Cannot continue tests.{Colors.END}")
            return

        if not self.test_registration():
            print(f"\n{Colors.RED}Registration failed. Cannot continue tests.{Colors.END}")
            return

        if not self.test_login():
            print(f"\n{Colors.RED}Login failed. Cannot continue tests.{Colors.END}")
            return

        # Run remaining tests
        self.test_accounts()
        self.test_categories()
        self.test_transactions()
        self.test_budgets()
        self.test_groups()
        self.test_analytics()
        self.test_currencies()

        print(f"\n{Colors.YELLOW}{'='*60}{Colors.END}")
        print(f"{Colors.GREEN}TEST SUITE COMPLETED{Colors.END}")
        print(f"{Colors.YELLOW}{'='*60}{Colors.END}\n")

if __name__ == "__main__":
    tester = BackendTester()
    tester.run_all_tests()
