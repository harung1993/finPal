#!/usr/bin/env python3
"""Test script for DollarDollar REST API"""

import requests
import json

BASE_URL = "http://127.0.0.1:5001/api/v1"

# Test login
print("Testing login...")
login_data = {
    "email": "test@dollardollar.com",
    "password": "Test123456"
}

response = requests.post(f"{BASE_URL}/auth/login", json=login_data)
print(f"Login Status: {response.status_code}")
print(f"Login Response: {json.dumps(response.json(), indent=2)}")

if response.status_code == 200:
    token = response.json()['access_token']
    headers = {"Authorization": f"Bearer {token}"}

    # Test get current user
    print("\nTesting /auth/me...")
    response = requests.get(f"{BASE_URL}/auth/me", headers=headers)
    print(f"Me Status: {response.status_code}")
    print(f"Me Response: {json.dumps(response.json(), indent=2)}")

    # Test get transactions
    print("\nTesting /transactions...")
    response = requests.get(f"{BASE_URL}/transactions", headers=headers)
    print(f"Transactions Status: {response.status_code}")
    if response.status_code == 200:
        print(f"Transactions Response: {json.dumps(response.json(), indent=2)[:500]}...")
    else:
        print(f"Transactions Error: {response.text}")

    # Test get accounts
    print("\nTesting /accounts...")
    response = requests.get(f"{BASE_URL}/accounts", headers=headers)
    print(f"Accounts Status: {response.status_code}")
    if response.status_code == 200:
        print(f"Accounts Response: {json.dumps(response.json(), indent=2)[:500]}...")
    else:
        print(f"Accounts Error: {response.text}")

    # Test get budgets
    print("\nTesting /budgets...")
    response = requests.get(f"{BASE_URL}/budgets", headers=headers)
    print(f"Budgets Status: {response.status_code}")
    if response.status_code == 200:
        print(f"Budgets Response: {json.dumps(response.json(), indent=2)[:500]}...")
    else:
        print(f"Budgets Error: {response.text}")

    # Test get categories
    print("\nTesting /categories...")
    response = requests.get(f"{BASE_URL}/categories", headers=headers)
    print(f"Categories Status: {response.status_code}")
    if response.status_code == 200:
        print(f"Categories Response: {json.dumps(response.json(), indent=2)[:500]}...")
    else:
        print(f"Categories Error: {response.text}")

    # Test dashboard/analytics
    print("\nTesting /analytics/dashboard...")
    response = requests.get(f"{BASE_URL}/analytics/dashboard", headers=headers)
    print(f"Dashboard Status: {response.status_code}")
    if response.status_code == 200:
        print(f"Dashboard Response: {json.dumps(response.json(), indent=2)[:500]}...")
    else:
        print(f"Dashboard Error: {response.text}")
