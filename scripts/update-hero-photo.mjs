import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const PHOTOS_DIR = 'public/assets/photos';
const RAW_SRC = 'ANH/album/LIU_3863.jpg';

async function updateHero() {
  console.log('Generating 1200x630 landscape hero and OG preview from LIU_3863.jpg...');

  const heroJpg = path.join(PHOTOS_DIR, 'hero.jpg');
  const heroWebp = path.join(PHOTOS_DIR, 'hero.webp');
  const ogPreviewJpg = path.join(PHOTOS_DIR, 'og-preview.jpg');

  // Extract top: 250, width: 4983, height: 2616 (1.905 aspect ratio)
  await sharp(RAW_SRC)
    .extract({ left: 0, top: 250, width: 4983, height: 2616 })
    .resize(1200, 630)
    .jpeg({ quality: 90, mozjpeg: true })
    .toFile(heroJpg);

  await sharp(RAW_SRC)
    .extract({ left: 0, top: 250, width: 4983, height: 2616 })
    .resize(1200, 630)
    .webp({ quality: 90, effort: 5 })
    .toFile(heroWebp);

  fs.copyFileSync(heroJpg, ogPreviewJpg);

  console.log('✓ Successfully generated:');
  console.log('  - ' + heroJpg);
  console.log('  - ' + heroWebp);
  console.log('  - ' + ogPreviewJpg);
}

updateHero().catch(console.error);
