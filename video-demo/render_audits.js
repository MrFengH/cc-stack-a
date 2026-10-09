const { execSync } = require('child_process');

const clips = [
  { id: 'Clip01', end: 195 },
  { id: 'Clip02', end: 500 },
  { id: 'Clip03', end: 460 },
  { id: 'Clip07', end: 270 },
  { id: 'Clip08', end: 580 },
  { id: 'Clip09a', end: 475 },
  { id: 'Clip09b', end: 565 },
];

for (const c of clips) {
  console.log(`Rendering ${c.id} frame ${c.end}`);
  execSync(`npx remotion still ${c.id} out/audit-${c.id}-end.png --frame=${c.end}`, { stdio: 'inherit' });
}
console.log('All stills rendered.');
