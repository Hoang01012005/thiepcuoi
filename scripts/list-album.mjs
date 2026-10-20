import fs from 'fs';
const albumFiles = fs.readdirSync('ANH/album').filter(f => f.endsWith('.jpg'));
console.log('Total album photos:', albumFiles.length);
albumFiles.forEach((f, i) => console.log(`Album ${i+1}: ${f}`));
