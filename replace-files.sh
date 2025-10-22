#!/bin/bash
# File Replacement Script for Task D
# Replaces old files with new versions

set -e  # Exit on error

echo "=== File Replacement Script ==="
echo ""

# Create backup directory
BACKUP_DIR="backups/$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"

echo "1. Creating backups in $BACKUP_DIR..."

# Backup existing files
cp src/App.jsx "$BACKUP_DIR/App.jsx.backup" 2>/dev/null || echo "  ⚠️  App.jsx not found (skipping backup)"
cp src/pages/Dashboard.jsx "$BACKUP_DIR/Dashboard.jsx.backup" 2>/dev/null || echo "  ⚠️  Dashboard.jsx not found (skipping backup)"
cp src/pages/AgentManagement.jsx "$BACKUP_DIR/AgentManagement.jsx.backup" 2>/dev/null || echo "  ⚠️  AgentManagement.jsx not found (skipping backup)"
cp src/pages/PricingPage.jsx "$BACKUP_DIR/PricingPage.jsx.backup" 2>/dev/null || echo "  ⚠️  PricingPage.jsx not found (skipping backup)"
cp src/pages/Billing.jsx "$BACKUP_DIR/Billing.jsx.backup" 2>/dev/null || echo "  ⚠️  Billing.jsx not found (skipping backup)"
cp src/pages/Login.jsx "$BACKUP_DIR/Login.jsx.backup" 2>/dev/null || echo "  ⚠️  Login.jsx not found (skipping backup)"
cp src/components/ProtectedRoute.jsx "$BACKUP_DIR/ProtectedRoute.jsx.backup" 2>/dev/null || echo "  ⚠️  ProtectedRoute.jsx not found (skipping backup)"
cp src/lib/auth.js "$BACKUP_DIR/auth.js.backup" 2>/dev/null || echo "  ⚠️  auth.js not found (skipping backup)"

echo "✅ Backups created"
echo ""

echo "2. Replacing files..."

# Replace App.jsx
if [ -f "src/App-updated.jsx" ]; then
    mv src/App-updated.jsx src/App.jsx
    echo "  ✅ App.jsx replaced"
else
    echo "  ❌ App-updated.jsx not found"
fi

# Replace Dashboard.jsx
if [ -f "src/pages/Dashboard-new.jsx" ]; then
    mv src/pages/Dashboard-new.jsx src/pages/Dashboard.jsx
    echo "  ✅ Dashboard.jsx replaced"
else
    echo "  ❌ Dashboard-new.jsx not found"
fi

# Replace AgentManagement.jsx
if [ -f "src/pages/AgentManagement-updated.jsx" ]; then
    mv src/pages/AgentManagement-updated.jsx src/pages/AgentManagement.jsx
    echo "  ✅ AgentManagement.jsx replaced"
else
    echo "  ❌ AgentManagement-updated.jsx not found"
fi

# Replace PricingPage.jsx
if [ -f "src/pages/PricingPage-with-stripe.jsx" ]; then
    mv src/pages/PricingPage-with-stripe.jsx src/pages/PricingPage.jsx
    echo "  ✅ PricingPage.jsx replaced"
else
    echo "  ❌ PricingPage-with-stripe.jsx not found"
fi

# Replace Billing.jsx
if [ -f "src/pages/Billing-updated.jsx" ]; then
    mv src/pages/Billing-updated.jsx src/pages/Billing.jsx
    echo "  ✅ Billing.jsx replaced"
else
    echo "  ❌ Billing-updated.jsx not found"
fi

# Replace Login.jsx
if [ -f "src/pages/Login-new.jsx" ]; then
    mv src/pages/Login-new.jsx src/pages/Login.jsx
    echo "  ✅ Login.jsx replaced"
else
    echo "  ❌ Login-new.jsx not found"
fi

# Replace ProtectedRoute.jsx
if [ -f "src/components/ProtectedRoute-new.jsx" ]; then
    mv src/components/ProtectedRoute-new.jsx src/components/ProtectedRoute.jsx
    echo "  ✅ ProtectedRoute.jsx replaced"
else
    echo "  ❌ ProtectedRoute-new.jsx not found"
fi

echo ""
echo "3. Removing deprecated files..."

# Remove old auth.js
if [ -f "src/lib/auth.js" ]; then
    rm src/lib/auth.js
    echo "  ✅ Removed src/lib/auth.js"
else
    echo "  ⚠️  src/lib/auth.js already removed"
fi

echo ""
echo "4. Checking for remaining temporary files..."

# Check for any remaining -new or -updated files
TEMP_FILES=$(find src -name "*-new.jsx" -o -name "*-updated.jsx" 2>/dev/null)
if [ -z "$TEMP_FILES" ]; then
    echo "  ✅ No temporary files found"
else
    echo "  ⚠️  Found temporary files:"
    echo "$TEMP_FILES"
fi

echo ""
echo "✅ File replacement complete!"
echo ""
echo "Backups saved to: $BACKUP_DIR"
echo ""
echo "Next steps:"
echo "1. Run 'npm run dev' to test locally"
echo "2. Check for any import errors"
echo "3. Test all features manually"
echo "4. Commit changes if everything works"

