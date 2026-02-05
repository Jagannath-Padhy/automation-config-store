#!/bin/bash
# Script to process environment template files
# This script is called from the GitHub Actions workflow

set -e

TEMPLATE_FILE="$1"
OUTPUT_FILE="$2"

if [ ! -f "$TEMPLATE_FILE" ]; then
  echo "❌ Template file not found: $TEMPLATE_FILE"
  exit 1
fi

# Read template and write to output
# GitHub Actions will have already expanded the ${{ }} expressions
# when this script is called, so we just copy the content
cp "$TEMPLATE_FILE" "$OUTPUT_FILE"

echo "✅ Environment file created from template: $TEMPLATE_FILE"
