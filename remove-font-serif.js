const fs = require('fs');
const path = require('path');

function removeFontSerif(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (!fullPath.includes('node_modules') && !fullPath.includes('.git') && !fullPath.includes('.next')) {
        removeFontSerif(fullPath);
      }
    } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes('font-serif')) {
        const newContent = content.replace(/font-serif\s?/g, '');
        fs.writeFileSync(fullPath, newContent);
        console.log('Removed font-serif from ' + fullPath);
      }
    }
  }
}

removeFontSerif('.');
