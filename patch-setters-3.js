const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'components/sections/dashboard.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Replace the bad setters with properly typed dummy setters using Dispatch<SetStateAction>
content = content.replace(/const setDepartments = \(val: any \| \(\(prev: any\[\]\) => any\[\]\)\) => \{\};/g, 'const setDepartments: React.Dispatch<React.SetStateAction<any[]>> = (val) => {};');
content = content.replace(/const setAssetsList = \(val: any \| \(\(prev: any\[\]\) => any\[\]\)\) => \{\};/g, 'const setAssetsList: React.Dispatch<React.SetStateAction<any[]>> = (val) => {};');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully fixed setter types with SetStateAction.');
