const fs = require('fs');
const path = require('path');

console.log('🔧 Starting E2E test migration...');

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

let successCount = 0;
let errorCount = 0;

filesToUpdate.forEach(fileName => {
  const filePath = path.join(__dirname, fileName);
  
  if (fs.existsSync(filePath)) {
    try {
      let content = fs.readFileSync(filePath, 'utf8');
      let changesMade = false;
      
      // Update localhost URLs (3000 → 3010)
      const originalContent = content;
      content = content.replace(/http:\/\/localhost:3000/g, 'http://localhost:3010');
      if (content !== originalContent) {
        changesMade = true;
        console.log(`  📡 Updated URL in ${fileName}`);
      }
      
      // Update screenshot paths (remove 'tests-e2e' prefix)
      const beforePathUpdate = content;
      content = content.replace(/path\.join\('tests-e2e',\s*'screenshots'/g, "path.join('screenshots'");
      if (content !== beforePathUpdate) {
        changesMade = true;
        console.log(`  📸 Updated screenshot paths in ${fileName}`);
      }
      
      if (changesMade) {
        fs.writeFileSync(filePath, content);
        console.log(`✅ Updated ${fileName}`);
        successCount++;
      } else {
        console.log(`ℹ️  No changes needed for ${fileName}`);
      }
      
    } catch (error) {
      console.error(`❌ Error updating ${fileName}:`, error.message);
      errorCount++;
    }
  } else {
    console.log(`⚠️  File not found: ${fileName}`);
  }
});

console.log('\n📊 Migration Summary:');
console.log(`✅ Successfully updated: ${successCount} files`);
console.log(`❌ Errors: ${errorCount} files`);

if (errorCount === 0) {
  console.log('\n🎉 Migration complete! Next steps:');
  console.log('1. cd e2e && npm install');
  console.log('2. npm run dev:both');
  console.log('3. npm run test:dual-service');
} else {
  console.log('\n⚠️  Some files had errors. Please check manually.');
}

console.log('\n🔍 To verify migration:');
console.log('grep -r "localhost:3000" *.ts');
console.log('grep -r "tests-e2e" *.ts'); 