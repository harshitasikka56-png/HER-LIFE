#!/usr/bin/env bash
# HER LIFE - Automated Git & Vercel Push Script
set -e

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$REPO_DIR"

COMMIT_MSG="${1:-Update HER LIFE web application and database}"

echo "🔨 Building frontend..."
cd frontend
npm run build
cd "$REPO_DIR"

echo "📦 Staging changes..."
git add -A

if git diff-index --quiet HEAD --; then
  echo "ℹ️  No new changes to commit. Local branch is up to date."
else
  echo "📝 Committing: $COMMIT_MSG"
  git commit -m "$COMMIT_MSG"
fi

echo "🚀 Pushing to GitHub repository..."
git push origin main

echo ""
echo "✅ Successfully pushed to GitHub!"
echo "🌐 Vercel will automatically deploy to: https://her-life-git-main-sikka1.vercel.app/"
