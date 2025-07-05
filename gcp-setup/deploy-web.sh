#!/bin/bash

# Deploy Web App to Firebase Hosting - FREE TIER ONLY
# This script ensures we never exceed free tier limits

set -e

echo "🚀 Deploying Web App to Firebase Hosting (FREE TIER)"
echo "================================================"

# Safety checks
echo "🔒 Performing safety checks..."

# Check if we're in the right directory
if [ ! -f "apps/web/package.json" ]; then
    echo "❌ Error: Run this script from the project root directory"
    exit 1
fi

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI is not installed. Installing..."
    npm install -g firebase-tools
fi

# Check if logged in to Firebase
if ! firebase projects:list &> /dev/null; then
    echo "🔑 Please log in to Firebase first:"
    firebase login
fi

# Check project configuration
if [ ! -f "apps/web/.firebaserc" ]; then
    echo "❌ Error: .firebaserc not found. Please configure your Firebase project first."
    exit 1
fi

# Navigate to web app directory
cd apps/web

# Check if build directory exists and is reasonable size
if [ -d "build" ]; then
    BUILD_SIZE=$(du -sm build | cut -f1)
    if [ $BUILD_SIZE -gt 8000 ]; then
        echo "⚠️  Warning: Build size is ${BUILD_SIZE}MB, approaching 10GB free tier limit"
        read -p "Continue anyway? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    fi
fi

# Build the application
echo "🏗️  Building application..."
npm run build

# Deploy to Firebase Hosting
echo "📤 Deploying to Firebase Hosting..."
firebase deploy --only hosting

# Get the hosting URL
PROJECT_ID=$(firebase projects:list --json | jq -r '.[] | select(.state == "ACTIVE") | .projectId' | head -1)
HOSTING_URL="https://${PROJECT_ID}.web.app"

echo "✅ Deployment completed successfully!"
echo "🌐 Your web app is live at: $HOSTING_URL"
echo "📊 Check your Firebase console for usage statistics"
echo "🆓 Remember: Firebase Hosting free tier includes 10GB storage and 10GB/month bandwidth"

# Return to project root
cd ../.. 