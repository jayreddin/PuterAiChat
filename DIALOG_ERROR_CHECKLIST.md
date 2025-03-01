# DialogTitle Error Checklist

Since automated search didn't find the issue, check these common scenarios:

## 1. Check Unsaved Work
- Look for unsaved files in your editor that use `DialogTitle`
- Check your current branch for uncommitted changes

## 2. Check Component Names
- You might be using a component that internally uses DialogTitle improperly
- Check for components like `Modal`, `Popup`, or custom dialog components

## 3. Quick Fixes to Try

### Fix Pattern 1: Wrap DialogTitle in Dialog
```jsx
// BEFORE - Error
<div>
  <DialogTitle>Title</DialogTitle>
  <p>Content</p>
</div>

// AFTER - Fixed
<Dialog open={isOpen} onClose={handleClose}>
  <DialogTitle>Title</DialogTitle>
  <p>Content</p>
</Dialog>
```

### Fix Pattern 2: Replace with regular heading if not meant to be in a dialog
```jsx
// BEFORE - Error
<DialogTitle>Section Title</DialogTitle>

// AFTER - Fixed
<h2 className="title">Section Title</h2>
```

### Fix Pattern 3: Check imports and component naming
```jsx
// BEFORE - Error (if ImportedTitle is actually DialogTitle)
import { Dialog, DialogTitle as ImportedTitle } from 'ui-library';
<ImportedTitle>Wrong usage</ImportedTitle>

// AFTER - Fixed
<Dialog>
  <ImportedTitle>Correct usage</ImportedTitle>
</Dialog>
```

## 4. Check Hot Module Replacement
If you can't find the issue, this might be an HMR error. Add this to your vite.config.js:
```js
export default defineConfig({
  // ...other config
  server: {
    hmr: {
      overlay: false
    }
  }
})
```
