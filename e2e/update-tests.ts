import * as fs from 'fs';
import * as path from 'path';

console.log('🔧 Starting E2E test migration...');

interface FileUpdateResult {
  fileName: string;
  success: boolean;
  changesMade: boolean;
  error?: string;
}

const filesToUpdate: string[] = [
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

let successCount: number = 0;
let errorCount: number = 0;

const updateFile = (fileName: string): FileUpdateResult => {
  const filePath: string = path.join(__dirname, fileName);
  
  if (!fs.existsSync(filePath)) {
    return {
      fileName,
      success: false,
      changesMade: false,
      error: 'File does not exist'
    };
  }

  try {
    let content: string = fs.readFileSync(filePath, 'utf8');
    const originalContent: string = content;
    let changesMade: boolean = false;
    
    // Update localhost URLs (3000 → 3010)
    if (content.includes('localhost:3000')) {
      content = content.replace(/localhost:3000/g, 'localhost:3010');
      changesMade = true;
      console.log(`  ↻ Updated localhost URLs in ${fileName}`);
    }
    
    // Update port references in environment variables
    if (content.includes('PORT=3000')) {
      content = content.replace(/PORT=3000/g, 'PORT=3010');
      changesMade = true;
      console.log(`  ↻ Updated PORT environment variable in ${fileName}`);
    }
    
    // Update any hardcoded port numbers in test configurations
    if (content.includes(':3000/')) {
      content = content.replace(/:3000\//g, ':3010/');
      changesMade = true;
      console.log(`  ↻ Updated port references in ${fileName}`);
    }
    
    // Update base URL configurations
    if (content.includes('baseURL: \'http://localhost:3000\'')) {
      content = content.replace(/baseURL: 'http:\/\/localhost:3000'/g, 'baseURL: \'http://localhost:3010\'');
      changesMade = true;
      console.log(`  ↻ Updated baseURL configuration in ${fileName}`);
    }
    
    // Write file only if changes were made
    if (changesMade) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Successfully updated ${fileName}`);
    } else {
      console.log(`⏭️ No changes needed for ${fileName}`);
    }
    
    return {
      fileName,
      success: true,
      changesMade,
    };
    
  } catch (error: unknown) {
    const errorMessage: string = error instanceof Error ? error.message : 'Unknown error';
    console.log(`❌ Error updating ${fileName}: ${errorMessage}`);
    
    return {
      fileName,
      success: false,
      changesMade: false,
      error: errorMessage
    };
  }
};

// Process all files
const results: FileUpdateResult[] = filesToUpdate.map((fileName: string): FileUpdateResult => {
  console.log(`\n🔄 Processing ${fileName}...`);
  const result: FileUpdateResult = updateFile(fileName);
  
  if (result.success) {
    successCount++;
  } else {
    errorCount++;
  }
  
  return result;
});

// Summary report
console.log('\n📊 Migration Summary:');
console.log(`✅ Successful: ${successCount}`);
console.log(`❌ Errors: ${errorCount}`);
console.log(`📁 Total files processed: ${filesToUpdate.length}`);

if (errorCount > 0) {
  console.log('\n❌ Files with errors:');
  results
    .filter((result: FileUpdateResult): boolean => !result.success)
    .forEach((result: FileUpdateResult): void => {
      console.log(`  • ${result.fileName}: ${result.error}`);
    });
}

const changedFiles: FileUpdateResult[] = results.filter((result: FileUpdateResult): boolean => result.changesMade);
if (changedFiles.length > 0) {
  console.log('\n✏️ Files modified:');
  changedFiles.forEach((result: FileUpdateResult): void => {
    console.log(`  • ${result.fileName}`);
  });
}

console.log('\n🎉 E2E test migration completed!');

// Export for testing
export {
  updateFile,
  FileUpdateResult
}; 