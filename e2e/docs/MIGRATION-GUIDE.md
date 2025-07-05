# E2E Test Migration Guide

This guide documents the changes made to update the e2e tests for the new port configuration and provides scripts to complete the migration.

## Changes Made

### Port Configuration
- **Old**: Web app on `localhost:3000`, API on `localhost:3001`
- **New**: Web app on `localhost:3010`, API on `localhost:3015`

### Directory Structure
- **Old**: `testDir: './tests-e2e'` (pointing to apps/web/tests-e2e)
- **New**: `testDir: './'` (tests are in e2e folder itself)

### Screenshot Paths
- **Old**: `path.join('tests-e2e', 'screenshots', ...)`
- **New**: `path.join('screenshots', ...)`

## Files Already Updated ✅

1. `playwright.config.ts` - Updated baseURL and testDir
2. `playwright.prod.config.ts` - Updated testDir
3. `playwright.dual-service.config.ts` - Already correct
4. `pull-request-feed-api.spec.ts` - Already correct
5. `buttons.spec.ts` - URLs and screenshot paths updated
6. `typefaces.spec.ts` - URLs and screenshot paths updated (partial)
7. `package.json` - Created with concurrently support

## Files That Need Updates ⚠️

### URL Updates (localhost:3000 → localhost:3010)

1. `font-check.spec.ts`:
   ```typescript
   // Line 20: Change
   const url = new URL(fontFile, 'http://localhost:3000').href;
   // To:
   const url = new URL(fontFile, 'http://localhost:3010').href;
   ```

2. `element-screenshots.spec.ts`:
   ```typescript
   // Lines 5, 47, 105: Change
   await page.goto('http://localhost:3000/projects');
   // To:
   await page.goto('http://localhost:3010/projects');
   ```

### Screenshot Path Updates (tests-e2e → screenshots)

**Affected files:**
- `typefaces.prod.spec.ts` (4 occurrences)
- `sidebar-visual-test.spec.ts` (11 occurrences) 
- `sidebar-toggle-carousel.spec.ts` (5 occurrences)
- `sidebar-collapse.spec.ts` (5 occurrences)
- `sidebar-carousel.spec.ts` (6 occurrences)
- `element-screenshots.spec.ts` (6 occurrences)
- `carousel-arrow-test.spec.ts` (6 occurrences)
- `buffalo-carousel.spec.ts` (1 occurrence)

**Pattern to replace:**
```typescript
// Change:
path.join('tests-e2e', 'screenshots', ...)
// To:
path.join('screenshots', ...)
```

## Automated Update Script

Save this as `update-tests.js` and run with `node update-tests.js`:

```javascript
const fs = require('fs');
const path = require('path');

const filesToUpdate = [
  'font-check.spec.ts',
  'element-screenshots.spec.ts',
  'typefaces.prod.spec.ts',
  'sidebar-visual-test.spec.ts',
  'sidebar-toggle-carousel.spec.ts',
  'sidebar-collapse.spec.ts',
  'sidebar-carousel.spec.ts',
  'carousel-arrow-test.spec.ts',
  'buffalo-carousel.spec.ts'
];

filesToUpdate.forEach(fileName => {
  const filePath = path.join(__dirname, fileName);
  
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Update localhost URLs
    content = content.replace(/http:\/\/localhost:3000/g, 'http://localhost:3010');
    
    // Update screenshot paths
    content = content.replace(/path\.join\('tests-e2e',/g, "path.join('");
    
    fs.writeFileSync(filePath, content);
    console.log(`✅ Updated ${fileName}`);
  } else {
    console.log(`❌ File not found: ${fileName}`);
  }
});

console.log('🎉 Migration complete!');
```

## Manual Testing Required

After running the updates:

1. **Install dependencies**:
   ```bash
   cd e2e
   npm install
   ```

2. **Test the configurations**:
   ```bash
   npm run dev:both        # Start both services
   npm run test:dual-service  # Test the dual-service integration
   npm test               # Run all tests
   ```

3. **Check screenshot outputs**:
   - Screenshots should be saved to `e2e/screenshots/` instead of `apps/web/tests-e2e/screenshots/`
   - Verify that existing screenshot directories are still accessible

## Validation Commands

```bash
# Check for remaining old URLs
grep -r "localhost:3000" *.ts

# Check for remaining old screenshot paths  
grep -r "tests-e2e" *.ts

# Verify new structure works
npm run test:dual-service:headless
```

## Rollback Instructions

If issues occur, the main files to revert are:
1. `playwright.config.ts` - Revert testDir and baseURL
2. `playwright.prod.config.ts` - Revert testDir
3. Individual test files - Revert URL and path changes

Keep the `package.json` and dual-service configuration as they're improvements regardless of port numbers. 