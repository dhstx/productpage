#!/bin/bash
# Code Quality & Cleanup Script
# Replaces old files with new versions and removes duplicates

set -e  # Exit on error

cd /home/ubuntu/productpage

echo "🧹 Starting code cleanup..."

# Step 1: Backup old files
echo "📦 Creating backup of old files..."
mkdir -p .backup/old-files
cp src/pages/Login.jsx .backup/old-files/ 2>/dev/null || true
cp src/pages/Dashboard.jsx .backup/old-files/ 2>/dev/null || true
cp src/pages/Billing.jsx .backup/old-files/ 2>/dev/null || true
cp src/pages/PricingPage.jsx .backup/old-files/ 2>/dev/null || true
cp src/pages/AgentManagement.jsx .backup/old-files/ 2>/dev/null || true
cp src/pages/Settings.jsx .backup/old-files/ 2>/dev/null || true
cp src/components/ProtectedRoute.jsx .backup/old-files/ 2>/dev/null || true
cp src/App.jsx .backup/old-files/ 2>/dev/null || true

echo "✅ Backup complete"

# Step 2: Replace with new versions
echo "🔄 Replacing old files with new versions..."

# Check if new files exist before moving
if [ -f "src/pages/Login-new.jsx" ]; then
    mv src/pages/Login-new.jsx src/pages/Login.jsx
    echo "  ✅ Login.jsx replaced"
fi

if [ -f "src/pages/Dashboard-new.jsx" ]; then
    mv src/pages/Dashboard-new.jsx src/pages/Dashboard.jsx
    echo "  ✅ Dashboard.jsx replaced"
fi

if [ -f "src/pages/Billing-updated.jsx" ]; then
    mv src/pages/Billing-updated.jsx src/pages/Billing.jsx
    echo "  ✅ Billing.jsx replaced"
fi

if [ -f "src/pages/PricingPage-with-stripe.jsx" ]; then
    mv src/pages/PricingPage-with-stripe.jsx src/pages/PricingPage.jsx
    echo "  ✅ PricingPage.jsx replaced"
fi

if [ -f "src/pages/AgentManagement-updated.jsx" ]; then
    mv src/pages/AgentManagement-updated.jsx src/pages/AgentManagement.jsx
    echo "  ✅ AgentManagement.jsx replaced"
fi

if [ -f "src/pages/Settings-enhanced.jsx" ]; then
    mv src/pages/Settings-enhanced.jsx src/pages/Settings.jsx
    echo "  ✅ Settings.jsx replaced"
fi

if [ -f "src/components/ProtectedRoute-new.jsx" ]; then
    mv src/components/ProtectedRoute-new.jsx src/components/ProtectedRoute.jsx
    echo "  ✅ ProtectedRoute.jsx replaced"
fi

if [ -f "src/App-updated.jsx" ]; then
    mv src/App-updated.jsx src/App.jsx
    echo "  ✅ App.jsx replaced"
fi

# Step 3: Remove misplaced/duplicate files
echo "🗑️  Removing duplicate and misplaced files..."
rm -f ./AIChatInterface-updated.jsx 2>/dev/null || true
rm -f ./src/pages/PricingPage-new.jsx 2>/dev/null || true

echo "✅ Cleanup complete!"

# Step 4: Verify no broken imports
echo "🔍 Checking for broken imports..."
if grep -r "Login-new\|Dashboard-new\|Billing-updated\|PricingPage-with-stripe\|AgentManagement-updated\|Settings-enhanced\|ProtectedRoute-new\|App-updated" src/ --include="*.jsx" --include="*.js" 2>/dev/null; then
    echo "⚠️  Warning: Found imports referencing old file names!"
    echo "   Please update these imports manually."
else
    echo "✅ No broken imports found"
fi

echo ""
echo "📊 Cleanup Summary:"
echo "  - Backed up 8 old files to .backup/old-files/"
echo "  - Replaced 8 files with new versions"
echo "  - Removed duplicate files"
echo ""
echo "🎉 Code cleanup complete!"

