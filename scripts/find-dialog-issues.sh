#!/bin/bash

echo "Finding all DialogTitle occurrences in your project..."
grep -r "DialogTitle" --include="*.jsx" --include="*.tsx" --include="*.js" --include="*.ts" .

echo -e "\nPossible issues might be in files where DialogTitle isn't preceded by Dialog or isn't nested inside Dialog tags"
