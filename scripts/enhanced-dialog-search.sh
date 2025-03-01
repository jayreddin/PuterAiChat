#!/bin/bash

echo "Searching for all Dialog-related components..."
grep -r "Dialog" --include="*.jsx" --include="*.tsx" --include="*.js" --include="*.ts" --include="*.svelte" --include="*.vue" .

echo -e "\nSearching for potential title components inside components..."
grep -r "Title" --include="*.jsx" --include="*.tsx" --include="*.js" --include="*.ts" --include="*.svelte" --include="*.vue" .

echo -e "\nLooking for potentially unsaved work in node_modules..."
grep -r "DialogTitle" --include="*.jsx" --include="*.tsx" --include="*.js" --include="*.ts" ./node_modules
