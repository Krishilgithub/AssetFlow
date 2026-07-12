const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'components/sections/dashboard.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Inject dummy setFunctions right after the query declarations
const depsRegex = /const departments = departmentsData \|\| \[\];/g;
content = content.replace(depsRegex, 'const departments = departmentsData || [];\n  const setDepartments = (val: any) => {};');

const assetsRegex = /const assetsList = assetsData \|\| \[\];/g;
content = content.replace(assetsRegex, 'const assetsList = assetsData || [];\n  const setAssetsList = (val: any) => {};');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully patched set functions.');
