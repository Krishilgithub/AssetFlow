const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'components/sections/dashboard.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Replace departments state
const depsStart = content.indexOf('const [departments, setDepartments] = useState([');
if (depsStart !== -1) {
  const depsEnd = content.indexOf(']);', depsStart) + 3;
  const original = content.substring(depsStart, depsEnd);
  
  content = content.replace(original, `const { data: departmentsData } = useDepartments();\n  const departments = departmentsData || [];`);
}

// Replace assetsList state
const assetsStart = content.indexOf('const [assetsList, setAssetsList] = useState([');
if (assetsStart !== -1) {
  const assetsEnd = content.indexOf(']);', assetsStart) + 3;
  const original = content.substring(assetsStart, assetsEnd);
  
  content = content.replace(original, `const { data: assetsData } = useAssetsList();\n  const assetsList = assetsData || [];`);
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully replaced hardcoded states with React Query hooks.');
