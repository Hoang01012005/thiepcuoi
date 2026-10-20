import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const dirs = [
  { name: 'chihiep', path: 'ANH/chihiep' },
  { name: 'anhnam', path: 'ANH/anhnam' },
  { name: 'album', path: 'ANH/album' },
];

async function inspect() {
  for (const d of dirs) {
    console.log(`\n=== FOLDER: ${d.name} ===`);
    const files = fs.readdirSync(d.path).filter(f => f.toLowerCase().endsWith('.jpg') || f.toLowerCase().endsWith('.png'));
    for (const f of files) {
      const fullPath = path.join(d.path, f);
      const meta = await sharp(fullPath).metadata();
      const stats = fs.statSync(fullPath);
      console.log(`- ${f}: ${meta.width}x${meta.height}, format: ${meta.format}, size: ${(stats.size / (1024 * 1024)).toFixed(2)} MB`);
    }
  }
}

inspect().catch(console.error);
