const fs = require('fs');
const path = require('path');

const baselineDir = path.resolve(__dirname, '..', '.baseline');
const verifyDir = path.resolve(__dirname, '..', '.verify');

function compareScreens() {
  if (!fs.existsSync(baselineDir) || !fs.existsSync(verifyDir)) {
    console.error('Missing baseline or verify directory');
    return;
  }

  const baselineFiles = fs.readdirSync(baselineDir).filter(f => f.endsWith('.png'));
  console.log(`Found ${baselineFiles.length} baseline files to compare.`);

  const desktopWidths = ['1024', '1280', '1440', '1920'];
  let desktopDiffCount = 0;
  let desktopTotal = 0;
  let mobileDiffCount = 0;
  let mobileTotal = 0;

  const results = [];

  for (const f of baselineFiles) {
    const isDesktop = desktopWidths.some(w => f.includes(`_${w}.png`));
    const basePath = path.join(baselineDir, f);
    const verPath = path.join(verifyDir, f);

    if (!fs.existsSync(verPath)) {
      results.push({ file: f, status: 'MISSING_IN_VERIFY', isDesktop });
      if (isDesktop) desktopDiffCount++;
      continue;
    }

    const baseBuf = fs.readFileSync(basePath);
    const verBuf = fs.readFileSync(verPath);

    if (isDesktop) desktopTotal++;
    else mobileTotal++;

    if (baseBuf.equals(verBuf)) {
      results.push({ file: f, status: 'IDENTICAL', isDesktop });
    } else {
      const sizeDiff = verBuf.length - baseBuf.length;
      results.push({ file: f, status: 'DIFF', sizeDiff, isDesktop });
      if (isDesktop) {
        desktopDiffCount++;
        console.warn(`[DESKTOP REGRESSION WARNING] ${f}: baseline ${baseBuf.length}B vs verify ${verBuf.length}B`);
      } else {
        mobileDiffCount++;
      }
    }
  }

  console.log('\n--- DESKTOP PROTECTION SUMMARY ---');
  console.log(`Desktop screens tested: ${desktopTotal}`);
  console.log(`Desktop regressions (diffs): ${desktopDiffCount}`);
  if (desktopDiffCount === 0) {
    console.log('>>> ABSOLUTE ZERO DESKTOP REGRESSION CONFIRMED! <<<');
  } else {
    console.warn(`>>> ALERT: ${desktopDiffCount} DESKTOP FILES SHOW DIFFERENCE! <<<`);
  }

  console.log('\n--- MOBILE UPDATE SUMMARY ---');
  console.log(`Mobile screens tested: ${mobileTotal}`);
  console.log(`Mobile screens with updates/diffs: ${mobileDiffCount}`);

  return { desktopDiffCount, desktopTotal, mobileDiffCount, mobileTotal };
}

compareScreens();

