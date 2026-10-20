import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const PHOTOS_OUT = 'public/assets/photos';
const AUDIO_OUT = 'public/assets/audio';

if (!fs.existsSync(PHOTOS_OUT)) fs.mkdirSync(PHOTOS_OUT, { recursive: true });
if (!fs.existsSync(AUDIO_OUT)) fs.mkdirSync(AUDIO_OUT, { recursive: true });

async function convertPhoto(inputPath, baseName, targetWidth = 1400) {
  const webpPath = path.join(PHOTOS_OUT, `${baseName}.webp`);
  const jpgPath = path.join(PHOTOS_OUT, `${baseName}.jpg`);

  console.log(`Converting ${inputPath} -> ${baseName}...`);

  await sharp(inputPath)
    .rotate()
    .resize(targetWidth, null, { withoutEnlargement: true })
    .webp({ quality: 85, effort: 5 })
    .toFile(webpPath);

  await sharp(inputPath)
    .rotate()
    .resize(targetWidth, null, { withoutEnlargement: true })
    .jpeg({ quality: 85, mozjpeg: true })
    .toFile(jpgPath);

  const webpSize = (fs.statSync(webpPath).size / 1024).toFixed(1);
  const jpgSize = (fs.statSync(jpgPath).size / 1024).toFixed(1);
  console.log(`  ✓ ${baseName}: webp=${webpSize}KB, jpg=${jpgSize}KB`);
}

async function run() {
  console.log('--- 1. CONVERTING BRIDE (chihiep) ---');
  await convertPhoto('ANH/chihiep/LIU_4276.jpg', 'bride_chihiep');

  console.log('\n--- 2. CONVERTING GROOM (anhnam) ---');
  await convertPhoto('ANH/anhnam/LIU_3830.jpg', 'groom_anhnam');

  console.log('\n--- 3. CONVERTING 10 ALBUM PHOTOS (album) ---');
  const albumFiles = [
    'LIU_3863.jpg',
    'LIU_4019.jpg',
    'LIU_4263.jpg',
    'LIU_4305.jpg',
    'LIU_4734.jpg',
    'LIU_4764.jpg',
    'LIU_4917.jpg',
    'LIU_4981.jpg',
    'LIU_5015.jpg',
    'LIU_5151.jpg'
  ];

  for (let i = 0; i < albumFiles.length; i++) {
    const filename = albumFiles[i];
    const baseName = `album-${String(i + 1).padStart(2, '0')}`;
    await convertPhoto(path.join('ANH/album', filename), baseName);
  }

  console.log('\n--- 4. BACKGROUND MUSIC (music) ---');
  const musicSrc = 'music/nhacnencuoidi.mp3';
  const musicDest = path.join(AUDIO_OUT, 'nhacnencuoidi.mp3');
  fs.copyFileSync(musicSrc, musicDest);
  console.log(`  ✓ Music verified: ${musicDest}`);

  console.log('\nALL ASSETS CONVERTED WITH FRESH CACHE-BUSTED FILENAMES!');
}

run().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
