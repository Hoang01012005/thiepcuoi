import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const outDir = 'public/assets/thumbs_preview';
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

async function makeThumbs() {
  const chihiepFiles = fs.readdirSync('ANH/chihiep').filter(f => f.endsWith('.jpg'));
  for (const f of chihiepFiles) {
    await sharp(path.join('ANH/chihiep', f))
      .resize(400)
      .jpeg({ quality: 75 })
      .toFile(path.join(outDir, `chihiep_${f}`));
  }

  const anhnamFiles = fs.readdirSync('ANH/anhnam').filter(f => f.endsWith('.jpg'));
  for (const f of anhnamFiles) {
    await sharp(path.join('ANH/anhnam', f))
      .resize(400)
      .jpeg({ quality: 75 })
      .toFile(path.join(outDir, `anhnam_${f}`));
  }

  const albumFiles = fs.readdirSync('ANH/album').filter(f => f.endsWith('.jpg'));
  for (const f of albumFiles) {
    await sharp(path.join('ANH/album', f))
      .resize(400)
      .jpeg({ quality: 75 })
      .toFile(path.join(outDir, `album_${f}`));
  }
  console.log('Thumbnails created successfully in', outDir);
}

makeThumbs().catch(console.error);
