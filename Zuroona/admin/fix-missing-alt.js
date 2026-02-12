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
let changedFiles = 0;

files.forEach(file => {
  let src = fs.readFileSync(file, 'utf8');
  const regex = /<Image([\s\S]*?)\/?>/g;
  let m;
  let newSrc = src;
  const edits = [];

  while ((m = regex.exec(src)) !== null) {
    const fullTag = m[0];
    if (/\balt=/.test(fullTag)) continue; // has alt

    // find src= inside the tag
    const tagStart = m.index;
    const tagBody = m[1];
    const srcMatch = /\bsrc\s*=\s*/.exec(tagBody);
    if (!srcMatch) continue;
    const srcIndexInBody = srcMatch.index + srcMatch[0].length;
    const globalSrcIndex = tagStart + 6 + srcIndexInBody; // 6 = length of '<Image'
    // Determine attribute value end
    const rest = src.slice(globalSrcIndex);
    let endIndex = -1;
    if (rest.startsWith('{')) {
      // find matching closing brace
      let depth = 0;
      for (let i = 0; i < rest.length; i++) {
        if (rest[i] === '{') depth++;
        else if (rest[i] === '}') {
          depth--;
          if (depth === 0) { endIndex = globalSrcIndex + i + 1; break; }
        }
      }
    } else if (rest.startsWith('"') || rest.startsWith("'")) {
      const quote = rest[0];
      for (let i = 1; i < rest.length; i++) {
        if (rest[i] === quote && rest[i-1] !== '\\') { endIndex = globalSrcIndex + i + 1; break; }
      }
    } else {
      // fallback: find next whitespace or '>'
      for (let i = 0; i < rest.length; i++) {
        if (rest[i] === '>' || /\s/.test(rest[i])) { endIndex = globalSrcIndex + i; break; }
      }
    }

    if (endIndex === -1) continue;

    // Insert alt="" after endIndex
    const insertPos = endIndex;
    edits.push({ pos: insertPos, file, tagPreview: fullTag.slice(0,200) });
  }

  if (edits.length > 0) {
    // apply edits from end to start to not shift indices
    edits.sort((a,b) => b.pos - a.pos);
    edits.forEach(e => {
      newSrc = newSrc.slice(0, e.pos) + ' alt=""' + newSrc.slice(e.pos);
    });

    fs.writeFileSync(file, newSrc, 'utf8');
    changedFiles++;
    console.log(`Patched ${file} (${edits.length} image tags)`);
  }
});

console.log(`Done. Modified ${changedFiles} files.`);
