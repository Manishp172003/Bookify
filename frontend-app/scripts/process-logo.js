import fs from 'fs';
import path from 'path';
import jpeg from 'jpeg-js';
import { PNG } from 'pngjs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputPath = path.join(__dirname, '../public/logo.jpg');
const transparentPath = path.join(__dirname, '../public/logo-transparent.png');
const whitePath = path.join(__dirname, '../public/logo-white.png');

const jpegData = fs.readFileSync(inputPath);
const rawData = jpeg.decode(jpegData, { useTArray: true });

const { width, height, data } = rawData;

// 1. Find bounding box of non-white content
let minX = width, minY = height, maxX = 0, maxY = 0;
for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const idx = (y * width + x) * 4;
    const r = data[idx];
    const g = data[idx + 1];
    const b = data[idx + 2];

    // Background threshold
    if (r < 235 || g < 235 || b < 235) {
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }
}

// Add padding
const pad = 10;
minX = Math.max(0, minX - pad);
minY = Math.max(0, minY - pad);
maxX = Math.min(width - 1, maxX + pad);
maxY = Math.min(height - 1, maxY + pad);

const cropW = maxX - minX + 1;
const cropH = maxY - minY + 1;

const pngTransparent = new PNG({ width: cropW, height: cropH });
const pngWhite = new PNG({ width: cropW, height: cropH });

for (let y = 0; y < cropH; y++) {
  for (let x = 0; x < cropW; x++) {
    const srcIdx = ((minY + y) * width + (minX + x)) * 4;
    const dstIdx = (y * cropW + x) * 4;

    const r = data[srcIdx];
    const g = data[srcIdx + 1];
    const b = data[srcIdx + 2];

    const brightness = (r + g + b) / 3;

    if (brightness >= 245) {
      // Pure White Background -> Transparent
      pngTransparent.data[dstIdx] = 0;
      pngTransparent.data[dstIdx + 1] = 0;
      pngTransparent.data[dstIdx + 2] = 0;
      pngTransparent.data[dstIdx + 3] = 0;

      pngWhite.data[dstIdx] = 0;
      pngWhite.data[dstIdx + 1] = 0;
      pngWhite.data[dstIdx + 2] = 0;
      pngWhite.data[dstIdx + 3] = 0;
    } else {
      // Alpha calculation for smooth anti-aliased edges
      let alpha = 255;
      if (brightness > 210) {
        alpha = Math.round(((250 - brightness) / 40) * 255);
        alpha = Math.max(0, Math.min(255, alpha));
      }

      // 1. Transparent original
      pngTransparent.data[dstIdx] = r;
      pngTransparent.data[dstIdx + 1] = g;
      pngTransparent.data[dstIdx + 2] = b;
      pngTransparent.data[dstIdx + 3] = alpha;

      // 2. White & Cyan Logo for Dark Background
      // Cyan swoosh detector: greenish-blue hue where green or blue is much higher than red
      const isCyan = (b > r + 30 || g > r + 25) && (g > 80 || b > 120);

      if (isCyan) {
        // Brighten the cyan swoosh so it glows on dark backgrounds
        pngWhite.data[dstIdx] = Math.min(255, Math.round(r * 0.8 + 10));
        pngWhite.data[dstIdx + 1] = Math.min(255, Math.round(g * 1.15 + 40));
        pngWhite.data[dstIdx + 2] = Math.min(255, Math.round(b * 1.05 + 50));
        pngWhite.data[dstIdx + 3] = alpha;
      } else {
        // Dark Navy text & dark "A" base -> solid bright crisp white
        pngWhite.data[dstIdx] = 255;
        pngWhite.data[dstIdx + 1] = 255;
        pngWhite.data[dstIdx + 2] = 255;
        pngWhite.data[dstIdx + 3] = alpha;
      }
    }
  }
}

fs.writeFileSync(transparentPath, PNG.sync.write(pngTransparent));
fs.writeFileSync(whitePath, PNG.sync.write(pngWhite));

console.log('Successfully generated high-res transparent and white logos!');
