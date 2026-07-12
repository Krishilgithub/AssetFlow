const fs = require('fs');
const path = require('path');

['add-department-modal.tsx', 'add-asset-modal.tsx'].forEach(file => {
  const filePath = path.join(__dirname, 'components/modals', file);
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(/<DialogTrigger asChild>/g, '<DialogTrigger>');
  fs.writeFileSync(filePath, content, 'utf8');
});

console.log('Fixed DialogTrigger types');
