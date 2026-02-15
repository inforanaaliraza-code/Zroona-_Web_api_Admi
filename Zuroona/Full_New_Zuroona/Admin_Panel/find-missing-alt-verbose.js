const fs = require('fs');
const path = require('path');

function walk(dir, filelist=[]) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filepath = path.join(dir, file);
    const stat = fs.statSync(filepath);
    if (stat.isDirectory()) {
      walk(filepath, filelist);
    } else if (file.endsWith('.js') || file.endsWith('.jsx') || file.endsWith('.ts') || file.endsWith('.tsx')) {
      filelist.push(filepath);
    }
  });
  return filelist;
}

const root = path.join(__dirname, 'src');
const files = walk(root);
const results = [];

files.forEach(file => {
  const src = fs.readFileSync(file, 'utf8');
  const regex = /<Image([\s\S]*?)\/?>/g;
  let m;
  while ((m = regex.exec(src)) !== null) {
    const tag = m[0];
    if (!/\balt=/.test(tag)) {
      // compute line number
      const before = src.slice(0, m.index);
      const line = before.split('\n').length;
      results.push({ file, line, tag: tag.replace(/\n/g, ' ').slice(0,300) });
    }
  }
});

if (results.length === 0) {
  console.log('No missing alt props found.');
  process.exit(0);
}

console.log('Found Image tags missing alt:');
results.forEach(r => console.log(`- ${r.file} (line ${r.line}): ${r.tag}`));
process.exit(0);
