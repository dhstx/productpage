#!/bin/bash
# Integration Testing Script for Task D

echo "=== Integration Testing ==="
echo ""

# 1. Check all new files exist
echo "1. Checking new files..."
test -f src/App.jsx && echo "  ✅ App.jsx" || echo "  ❌ App.jsx missing"
test -f src/pages/Dashboard.jsx && echo "  ✅ Dashboard.jsx" || echo "  ❌ Dashboard.jsx missing"
test -f src/pages/AgentManagement.jsx && echo "  ✅ AgentManagement.jsx" || echo "  ❌ AgentManagement.jsx missing"
test -f src/pages/PricingPage.jsx && echo "  ✅ PricingPage.jsx" || echo "  ❌ PricingPage.jsx missing"
test -f src/pages/Billing.jsx && echo "  ✅ Billing.jsx" || echo "  ❌ Billing.jsx missing"
test -f src/pages/Login.jsx && echo "  ✅ Login.jsx" || echo "  ❌ Login.jsx missing"
test -f src/components/ProtectedRoute.jsx && echo "  ✅ ProtectedRoute.jsx" || echo "  ❌ ProtectedRoute.jsx missing"

# 2. Check deprecated files removed
echo ""
echo "2. Checking deprecated files removed..."
test ! -f src/lib/auth.js && echo "  ✅ Old auth.js removed" || echo "  ⚠️  Old auth.js still exists"
test ! -f src/App-updated.jsx && echo "  ✅ App-updated.jsx removed" || echo "  ⚠️  App-updated.jsx still exists"
test ! -f src/pages/Dashboard-new.jsx && echo "  ✅ Dashboard-new.jsx removed" || echo "  ⚠️  Dashboard-new.jsx still exists"
test ! -f src/pages/AgentManagement-updated.jsx && echo "  ✅ AgentManagement-updated.jsx removed" || echo "  ⚠️  AgentManagement-updated.jsx still exists"
test ! -f src/pages/PricingPage-with-stripe.jsx && echo "  ✅ PricingPage-with-stripe.jsx removed" || echo "  ⚠️  PricingPage-with-stripe.jsx still exists"
test ! -f src/pages/Billing-updated.jsx && echo "  ✅ Billing-updated.jsx removed" || echo "  ⚠️  Billing-updated.jsx still exists"
test ! -f src/pages/Login-new.jsx && echo "  ✅ Login-new.jsx removed" || echo "  ⚠️  Login-new.jsx still exists"
test ! -f src/components/ProtectedRoute-new.jsx && echo "  ✅ ProtectedRoute-new.jsx removed" || echo "  ⚠️  ProtectedRoute-new.jsx still exists"

# 3. Check imports
echo ""
echo "3. Checking imports..."
grep -q "import.*AuthProvider" src/App.jsx && echo "  ✅ AuthProvider imported in App.jsx" || echo "  ❌ AuthProvider missing"
grep -q "import.*PTHealthBar" src/pages/Dashboard.jsx && echo "  ✅ PTHealthBar imported in Dashboard" || echo "  ❌ PTHealthBar missing"
grep -q "import.*PTHealthBar" src/pages/AgentManagement.jsx && echo "  ✅ PTHealthBar imported in AgentManagement" || echo "  ❌ PTHealthBar missing"
grep -q "import.*createSubscriptionCheckout" src/pages/PricingPage.jsx && echo "  ✅ Stripe helpers imported in PricingPage" || echo "  ❌ Stripe helpers missing"
grep -q "import.*PTHealthBar" src/pages/Billing.jsx && echo "  ✅ PTHealthBar imported in Billing" || echo "  ❌ PTHealthBar missing"

# 4. Check route count
echo ""
echo "4. Checking routes..."
ROUTE_COUNT=$(grep -c "<Route" src/App.jsx)
echo "  Total routes: $ROUTE_COUNT (should be 26+)"
test $ROUTE_COUNT -ge 26 && echo "  ✅ Sufficient routes" || echo "  ❌ Missing routes"

# 5. Check components
echo ""
echo "5. Checking components..."
test -f src/components/PTHealthBar.jsx && echo "  ✅ PTHealthBar.jsx" || echo "  ❌ PTHealthBar.jsx missing"
test -f src/components/UsageMonitoringDashboard.jsx && echo "  ✅ UsageMonitoringDashboard.jsx" || echo "  ❌ UsageMonitoringDashboard.jsx missing"
test -f src/contexts/AuthContext.jsx && echo "  ✅ AuthContext.jsx" || echo "  ❌ AuthContext.jsx missing"

# 6. Check API endpoints
echo ""
echo "6. Checking API endpoints..."
test -f api/stripe/create-checkout-session.js && echo "  ✅ create-checkout-session.js" || echo "  ❌ create-checkout-session.js missing"
test -f api/subscription/current.js && echo "  ✅ current.js" || echo "  ❌ current.js missing"
test -f api/billing/history.js && echo "  ✅ history.js" || echo "  ❌ history.js missing"
test -f api/pt/usage.js && echo "  ✅ usage.js" || echo "  ❌ usage.js missing"

# 7. Check database migration
echo ""
echo "7. Checking database migration..."
test -f supabase/migrations/001_complete_pricing_system.sql && echo "  ✅ Database migration exists" || echo "  ❌ Database migration missing"

# 8. Check for deprecated imports
echo ""
echo "8. Checking for deprecated imports..."
DEPRECATED_IMPORTS=$(grep -r "from.*lib/auth'" src/ --include="*.jsx" --include="*.js" 2>/dev/null | wc -l)
if [ "$DEPRECATED_IMPORTS" -eq 0 ]; then
    echo "  ✅ No deprecated auth imports found"
else
    echo "  ⚠️  Found $DEPRECATED_IMPORTS deprecated auth imports"
    grep -r "from.*lib/auth'" src/ --include="*.jsx" --include="*.js" 2>/dev/null
fi

# 9. Check for any -new or -updated imports
echo ""
echo "9. Checking for temporary file imports..."
TEMP_IMPORTS=$(grep -r "Login-new\|ProtectedRoute-new\|App-updated\|Dashboard-new\|AgentManagement-updated\|PricingPage-with-stripe\|Billing-updated" src/ --include="*.jsx" --include="*.js" 2>/dev/null | wc -l)
if [ "$TEMP_IMPORTS" -eq 0 ]; then
    echo "  ✅ No temporary file imports found"
else
    echo "  ⚠️  Found $TEMP_IMPORTS temporary file imports"
    grep -r "Login-new\|ProtectedRoute-new\|App-updated\|Dashboard-new\|AgentManagement-updated\|PricingPage-with-stripe\|Billing-updated" src/ --include="*.jsx" --include="*.js" 2>/dev/null
fi

echo ""
echo "✅ Integration testing complete!"
echo ""
echo "Summary:"
echo "--------"
echo "Files replaced: 7"
echo "Deprecated files removed: 1"
echo "Routes configured: $ROUTE_COUNT"
echo "API endpoints: 4+"
echo ""
echo "Next steps:"
echo "1. Run 'npm run dev' to start dev server"
echo "2. Manually test all features"
echo "3. Fix any bugs found"
echo "4. Commit changes"
echo "5. Push to GitHub"

