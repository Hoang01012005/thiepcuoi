import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const outDir = 'public/assets/thumbs_preview';

async function previewRemaining() {
  const remaining = [
    'LIU_4263.jpg',
    'LIU_4764.jpg',
    'LIU_4981.jpg',
    'LIU_5015.jpg',
    'LIU_5151.jpg'
  ];
  for (const f of remaining) {
    const p = path.join('ANH/album', f);
    const meta = await sharp(p).metadata();
    console.log(`${f}: ${meta.width}x${meta.height}, ratio: ${(meta.width / meta.height).toFixed(2)}`);
  }
}

previewRemaining().catch(console.error);
