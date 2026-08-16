import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const cubeJsLibDir = path.join(__dirname, '..', 'node_modules', 'cubejs', 'lib');

function patchFile(filename, search, replace) {
  const filePath = path.join(cubeJsLibDir, filename);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    if (content.includes(search)) {
      content = content.replace(search, replace);
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`[patch-cubejs] Successfully patched ${filename}`);
    }
  }
}

// Patch solve.js
patchFile(
  'solve.js',
  'Cube = this.Cube || require(\'./cube\');',
  'Cube = (typeof this !== \'undefined\' && this && this.Cube) || (typeof window !== \'undefined\' && window.Cube) || (typeof globalThis !== \'undefined\' && globalThis.Cube) || require(\'./cube\');'
);

// Patch async.js
patchFile(
  'async.js',
  'Cube = this.Cube || require(\'./cube\');',
  'Cube = (typeof this !== \'undefined\' && this && this.Cube) || (typeof window !== \'undefined\' && window.Cube) || (typeof globalThis !== \'undefined\' && globalThis.Cube) || require(\'./cube\');'
);

// Patch cube.js
patchFile(
  'cube.js',
  'this.Cube = Cube;',
  'if (typeof window !== "undefined") window.Cube = Cube; if (typeof globalThis !== "undefined") globalThis.Cube = Cube;'
);
