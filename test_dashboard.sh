#!/bin/bash
# Get auth token for Carol
TOKEN=$(curl -s -X POST http://localhost/api/v1/auth/login -H "Content-Type: application/json" -d '{"email":"carol@example.com","password":"demo123"}' | jq -r '.access_token')

echo "Token: ${TOKEN:0:20}..."
echo ""
echo "Top Categories for Carol:"
curl -s -H "Authorization: Bearer $TOKEN" http://localhost/api/v1/analytics/dashboard | jq '.data.top_categories'
