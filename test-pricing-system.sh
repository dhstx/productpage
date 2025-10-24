#!/bin/bash

# Pricing System Integration Test Script
# Version: 3.0
# Date: 2025-10-22

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
API_URL="${1:-https://dhstx.co}"
TEST_USER_ID="${2:-}"

echo "========================================="
echo "Pricing System Integration Tests"
echo "========================================="
echo "API URL: $API_URL"
echo ""

# Test counter
TESTS_PASSED=0
TESTS_FAILED=0

# Helper function to run test
run_test() {
  local test_name="$1"
  local test_command="$2"
  local expected_status="${3:-200}"
  
  echo -n "Testing: $test_name... "
  
  response=$(eval "$test_command" 2>&1)
  status=$?
  
  if [ $status -eq 0 ]; then
    echo -e "${GREEN}✓ PASSED${NC}"
    TESTS_PASSED=$((TESTS_PASSED + 1))
    return 0
  else
    echo -e "${RED}✗ FAILED${NC}"
    echo "  Error: $response"
    TESTS_FAILED=$((TESTS_FAILED + 1))
    return 1
  fi
}

# Test 1: Anonymous request
echo ""
echo "=== Test 1: Anonymous Request ==="
run_test "Anonymous chat request" \
  "curl -s -X POST $API_URL/api/agents/chat \
    -H 'Content-Type: application/json' \
    -d '{
      \"message\": \"Hello, test message\",
      \"agent\": \"commander\",
      \"sessionId\": \"test-session-$(date +%s)\"
    }' | jq -e '.response'"

# Test 2: Anonymous limit check
echo ""
echo "=== Test 2: Anonymous Limit Check ==="
SESSION_ID="test-limit-$(date +%s)"

for i in {1..2}; do
  echo "Request $i..."
  response=$(curl -s -X POST $API_URL/api/agents/chat \
    -H 'Content-Type: application/json' \
    -d "{
      \"message\": \"Test request $i\",
      \"agent\": \"commander\",
      \"sessionId\": \"$SESSION_ID\"
    }")
  
  if [ $i -eq 1 ]; then
    if echo "$response" | jq -e '.response' > /dev/null; then
      echo -e "${GREEN}✓ First request succeeded${NC}"
      TESTS_PASSED=$((TESTS_PASSED + 1))
    else
      echo -e "${RED}✗ First request failed${NC}"
      TESTS_FAILED=$((TESTS_FAILED + 1))
    fi
  else
    if echo "$response" | jq -e '.error' | grep -q "limit"; then
      echo -e "${GREEN}✓ Second request blocked (limit working)${NC}"
      TESTS_PASSED=$((TESTS_PASSED + 1))
    else
      echo -e "${RED}✗ Second request should be blocked${NC}"
      TESTS_FAILED=$((TESTS_FAILED + 1))
    fi
  fi
done

# Test 3: PT cost estimation
if [ -n "$TEST_USER_ID" ]; then
  echo ""
  echo "=== Test 3: PT Cost Estimation ==="
  run_test "PT cost estimation" \
    "curl -s -X POST $API_URL/api/agents/chat \
      -H 'Content-Type: application/json' \
      -d '{
        \"message\": \"Estimate this request\",
        \"userId\": \"$TEST_USER_ID\",
        \"estimateOnly\": true
      }' | jq -e '.estimate.ptCost'"
fi

# Test 4: Authenticated request
if [ -n "$TEST_USER_ID" ]; then
  echo ""
  echo "=== Test 4: Authenticated Request ==="
  run_test "Authenticated chat request" \
    "curl -s -X POST $API_URL/api/agents/chat \
      -H 'Content-Type: application/json' \
      -d '{
        \"message\": \"Test authenticated request\",
        \"agent\": \"commander\",
        \"userId\": \"$TEST_USER_ID\",
        \"sessionId\": \"test-auth-$(date +%s)\"
      }' | jq -e '.response and .ptStatus'"
fi

# Test 5: Usage status endpoint
if [ -n "$TEST_USER_ID" ]; then
  echo ""
  echo "=== Test 5: Usage Status Endpoint ==="
  run_test "Get usage status" \
    "curl -s $API_URL/api/pt/usage?userId=$TEST_USER_ID | jq -e '.ptStatus'"
fi

# Test 6: Health check
echo ""
echo "=== Test 6: API Health Check ==="
run_test "API health check" \
  "curl -s $API_URL/api/health | jq -e '.status == \"ok\"'"

# Test 7: Stripe webhook endpoint exists
echo ""
echo "=== Test 7: Stripe Webhook Endpoint ==="
run_test "Stripe webhook endpoint" \
  "curl -s -o /dev/null -w '%{http_code}' $API_URL/api/webhooks/stripe | grep -q '405\|200'"

# Test 8: Admin endpoints (if accessible)
echo ""
echo "=== Test 8: Admin Endpoints ==="
run_test "Margin monitoring endpoint exists" \
  "curl -s -o /dev/null -w '%{http_code}' $API_URL/api/admin/margin-monitoring | grep -q '401\|403\|200'"

# Test 9: Database connectivity
echo ""
echo "=== Test 9: Database Connectivity ==="
if [ -n "$SUPABASE_URL" ] && [ -n "$SUPABASE_SERVICE_KEY" ]; then
  run_test "Supabase connection" \
    "curl -s -H 'apikey: $SUPABASE_SERVICE_KEY' \
      -H 'Authorization: Bearer $SUPABASE_SERVICE_KEY' \
      '$SUPABASE_URL/rest/v1/subscription_tiers?select=tier,display_name' | jq -e 'length > 0'"
else
  echo -e "${YELLOW}⊘ Skipped (no Supabase credentials)${NC}"
fi

# Test 10: Model routing
if [ -n "$TEST_USER_ID" ]; then
  echo ""
  echo "=== Test 10: Model Routing ==="
  
  # Test Core model request
  run_test "Core model routing" \
    "curl -s -X POST $API_URL/api/agents/chat \
      -H 'Content-Type: application/json' \
      -d '{
        \"message\": \"Short test\",
        \"userId\": \"$TEST_USER_ID\",
        \"requestedModel\": \"core\"
      }' | jq -e '.modelClass == \"core\"'"
fi

# Summary
echo ""
echo "========================================="
echo "Test Summary"
echo "========================================="
echo -e "Passed: ${GREEN}$TESTS_PASSED${NC}"
echo -e "Failed: ${RED}$TESTS_FAILED${NC}"
echo "Total:  $((TESTS_PASSED + TESTS_FAILED))"
echo ""

if [ $TESTS_FAILED -eq 0 ]; then
  echo -e "${GREEN}✓ All tests passed!${NC}"
  exit 0
else
  echo -e "${RED}✗ Some tests failed${NC}"
  exit 1
fi

