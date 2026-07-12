const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'components/sections/dashboard.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Replace the bad setters with properly typed dummy setters
content = content.replace(/const setDepartments = \(val: any\) => \{\};/g, 'const setDepartments = (val: any | ((prev: any[]) => any[])) => {};');
content = content.replace(/const setAssetsList = \(val: any\) => \{\};/g, 'const setAssetsList = (val: any | ((prev: any[]) => any[])) => {};');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully fixed setter types.');
