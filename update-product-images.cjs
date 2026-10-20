// update-product-images.cjs
// Project root se chalayein:  node update-product-images.cjs

const fs = require('fs');
const path = require('path');

const root = __dirname;
const SKIP = new Set(['node_modules', '.git', 'dist', 'build', '.next']);

// slug -> image file name
const imageMap = {
  'apollo-9-plus': 'Apollo 9 Plus.jpeg',
  'emproror-n2-vet': 'Emperor N2 .jpeg',
  'empror-n2-latest-digital': 'EMPROR N2 LATEST DIGITAL.jpeg',
  'ge-logic-100-pro-ultrasound': 'GE LOGIQ 100 PRO Ultrasound.jpeg',
  'novadex-n3-plus': 'Novadex N3 plus.jpeg',
  'nyro-10-vet-latest-model': 'Nyro 10 Vet latest model.jpeg',
  'orial-note-book': 'Orial note book.jpeg',
  'q-10-vet-ultrasound': 'Q 10 Vet ultrasound.jpeg',
  'sononote-book': 'Sononote book.jpeg',
  'vet-for-scan-smart-ultrasound': 'Vet for scan smart ultrasound.jpeg',
  'vet-ultrasound-machine': 'Vet ultrasound machine.jpeg',
  'volta-notepad-345': 'Volta notepad.jpeg',
  'volta-sonobook': 'Volta sonobook.jpeg',
  'volta-vsonic-295': 'Volta v sonic.jpeg',
  'volta-vsonic-plus12': 'Volta vsonic +12.jpeg',
  'yonkar-7': 'Yonkar 7.jpeg',
  'youki-d8-wireless-vet-colour': 'Youki.jpeg',
};

// spaces, dots, symbols aur capital letters ignore karke match karta hai
const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, '');

function walk(dir, out) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

const allFiles = walk(root, []);
const jsonFiles = allFiles.filter(
  (f) => path.basename(f).toLowerCase() === 'products.json'
);

const imgDir = path.join(root, 'public', 'images', 'categories');

console.log('Project root : ' + root);
console.log('Image folder : ' + imgDir + (fs.existsSync(imgDir) ? '' : '   <-- NAHI MILA'));
console.log('products.json files mili: ' + jsonFiles.length);
jsonFiles.forEach((f) => console.log('   ' + f));

if (!fs.existsSync(imgDir) || jsonFiles.length === 0) {
  console.log('\nRoot folder se script nahi chalayi gayi, ya path galat hai. Upar wale paths check karein.');
  process.exit(1);
}

const actual = {};
const imageFiles = fs.readdirSync(imgDir);
imageFiles.forEach((f) => (actual[norm(f)] = f));

jsonFiles.forEach((jsonPath) => {
  const raw = fs.readFileSync(jsonPath, 'utf8').replace(/^\uFEFF/, '');
  let products;
  try {
    products = JSON.parse(raw);
  } catch (e) {
    console.log('\nSKIP (valid JSON nahi): ' + jsonPath);
    return;
  }
  if (!Array.isArray(products)) {
    console.log('\nSKIP (array nahi): ' + jsonPath);
    return;
  }

  fs.writeFileSync(jsonPath + '.bak', raw);

  let updated = 0;
  const missing = [];

  products.forEach((product) => {
    const wanted = imageMap[product.slug];
    if (!wanted) return;

    const realFile = actual[norm(wanted)];
    if (!realFile) {
      missing.push(product.slug + '  ->  ' + wanted);
      return;
    }

    const src = '/images/categories/' + encodeURIComponent(realFile);
    const img = {
      id: (product.featuredImage && product.featuredImage.id) || product.id,
      src,
      thumbnail: src,
      alt: product.name,
      name: product.name,
    };

    product.featuredImage = img;
    product.gallery = [img];
    if ('image' in product) product.image = src;
    if (Array.isArray(product.images)) product.images = [img];
    if (product.technicalData) delete product.technicalData['Image Status'];

    updated += 1;
    console.log('  OK  ' + product.slug + '  ->  ' + src);
  });

  fs.writeFileSync(jsonPath, JSON.stringify(products, null, 2));
  console.log('\n' + jsonPath + ' : ' + updated + ' products update hue.');

  if (missing.length) {
    console.log('Ye image files folder mein nahi mili:');
    missing.forEach((m) => console.log('   - ' + m));
    console.log('Folder mein jo files hain:');
    imageFiles.forEach((f) => console.log('   * ' + f));
  }
});