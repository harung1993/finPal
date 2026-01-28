#!/usr/bin/env python3
"""Register a test user"""

import requests
import json

BASE_URL = "http://127.0.0.1:5001/api/v1"

# Test registration
print("Testing registration...")
register_data = {
    "username": "Test User",
    "email": "test@dollardollar.com",
    "password": "Test123456"
}

response = requests.post(f"{BASE_URL}/auth/register", json=register_data)
print(f"Register Status: {response.status_code}")
print(f"Register Response: {json.dumps(response.json(), indent=2)}")
