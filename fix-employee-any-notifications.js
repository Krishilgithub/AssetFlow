const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'components/sections/employee-dashboard.tsx');
let content = fs.readFileSync(file, 'utf-8');

content = content.replace(/notifications\.map\(\(n, i\) =>/g, 'notifications.map((n: any, i: number) =>');
content = content.replace(/notifications\.filter\(\(n\) =>/g, 'notifications.filter((n: any) =>');
content = content.replace(/notifications\.filter\(n =>/g, 'notifications.filter((n: any) =>');
content = content.replace(/notifications\.map\(n =>/g, 'notifications.map((n: any) =>');

fs.writeFileSync(file, content);
console.log('Fixed implicit any types for notifications in employee dashboard');
