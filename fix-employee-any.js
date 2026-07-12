const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'components/sections/employee-dashboard.tsx');
let content = fs.readFileSync(file, 'utf-8');

content = content.replace(/prev =>/g, '(prev: any) =>');
content = content.replace(/b => b\.id === bkg\.id/g, '(b: any) => b.id === bkg.id');
content = content.replace(/t => t\.id === req\.id/g, '(t: any) => t.id === req.id');
content = content.replace(/r => r\.id === req\.id/g, '(r: any) => r.id === req.id');

fs.writeFileSync(file, content);
console.log('Fixed implicit any types in employee dashboard cancel buttons');
