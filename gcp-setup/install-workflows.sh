#!/bin/bash

# Install GitHub Actions workflows for automated deployment

echo "🔧 Installing GitHub Actions workflows..."

# Create .github/workflows directory if it doesn't exist
mkdir -p .github/workflows

# Copy workflows from gcp-setup to .github/workflows
cp gcp-setup/workflows/deploy-web.yml .github/workflows/
cp gcp-setup/workflows/deploy-api.yml .github/workflows/

# Make deployment scripts executable
chmod +x gcp-setup/*.sh

echo "✅ Workflows installed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Add these secrets to your GitHub repository:"
echo "   - GCP_PROJECT_ID: Your Google Cloud project ID"
echo "   - GCP_SA_KEY: Service account key JSON"
echo ""
echo "2. Commit and push the workflow files:"
echo "   git add .github/workflows/"
echo "   git commit -m 'Add Google Cloud deployment workflows'"
echo "   git push"
echo ""
echo "3. Your apps will now deploy automatically on pushes to main branch!"
echo ""
echo "🔗 GitHub Actions will be available at:"
echo "   https://github.com/$(git config --get remote.origin.url | sed 's/.*github.com[:/]\([^/]*\/[^/]*\)\.git/\1/')/actions" 