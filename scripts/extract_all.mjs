import fs from 'fs';
import path from 'path';

async function fetchJson(url) {
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return await res.json();
}

async function fetchText(url) {
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return await res.text();
}

function stripHtml(html) {
  if (!html) return '';
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#8211;/g, '-')
    .replace(/&#8217;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

async function run() {
  console.log('--- STARTING SONOTECH DATA EXTRACTION ---');

  // 1. Fetch Sitemaps
  console.log('Fetching sitemaps...');
  const discoveredUrls = {
    products: [],
    categories: [],
    pages: [],
    all: []
  };

  try {
    const productSitemapXml = await fetchText('https://sonotech.pk/product-sitemap.xml');
    const prodUrls = [...productSitemapXml.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1]);
    discoveredUrls.products = prodUrls.filter(u => !u.endsWith('/shop/'));
    console.log(`Discovered ${discoveredUrls.products.length} product URLs from sitemap.`);
  } catch (err) {
    console.warn('Error reading product sitemap:', err.message);
  }

  try {
    const catSitemapXml = await fetchText('https://sonotech.pk/product_cat-sitemap.xml');
    const catUrls = [...catSitemapXml.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1]);
    discoveredUrls.categories = catUrls;
    console.log(`Discovered ${discoveredUrls.categories.length} category URLs from sitemap.`);
  } catch (err) {
    console.warn('Error reading category sitemap:', err.message);
  }

  try {
    const pageSitemapXml = await fetchText('https://sonotech.pk/page-sitemap.xml');
    const pageUrls = [...pageSitemapXml.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1]);
    discoveredUrls.pages = pageUrls;
    console.log(`Discovered ${discoveredUrls.pages.length} page URLs from sitemap.`);
  } catch (err) {
    console.warn('Error reading page sitemap:', err.message);
  }

  discoveredUrls.all = Array.from(new Set([
    ...discoveredUrls.products,
    ...discoveredUrls.categories,
    ...discoveredUrls.pages
  ]));

  // 2. Fetch all products via WooCommerce Store API
  console.log('Fetching products from WooCommerce store API...');
  let rawProducts = [];
  let page = 1;
  while (true) {
    console.log(`Fetching products page ${page}...`);
    try {
      const pageData = await fetchJson(`https://sonotech.pk/wp-json/wc/store/v1/products?per_page=100&page=${page}`);
      if (!Array.isArray(pageData) || pageData.length === 0) break;
      rawProducts.push(...pageData);
      console.log(`Fetched page ${page} with ${pageData.length} items (total so far: ${rawProducts.length})`);
      if (pageData.length < 100) break;
      page++;
    } catch (err) {
      console.log(`Page ${page} ended or error:`, err.message);
      break;
    }
  }

  console.log(`Total raw products fetched from store API: ${rawProducts.length}`);

  // Deduplicate products by id and slug
  const productMap = new Map();
  for (const p of rawProducts) {
    if (!productMap.has(p.id)) {
      productMap.set(p.id, p);
    }
  }
  const uniqueProducts = Array.from(productMap.values());
  console.log(`Unique products after deduplication: ${uniqueProducts.length}`);

  // 3. Fetch all categories
  console.log('Fetching categories from WooCommerce store API...');
  let rawCategories = [];
  try {
    rawCategories = await fetchJson('https://sonotech.pk/wp-json/wc/store/v1/products/categories?per_page=100');
    console.log(`Fetched ${rawCategories.length} categories.`);
  } catch (err) {
    console.error('Error fetching categories:', err.message);
  }

  // 4. Enrich products: For products where description is missing or short, attempt to fetch the webpage
  console.log('Enriching products and checking descriptions...');
  const missingDescriptionList = [];
  const processedProducts = [];

  for (let i = 0; i < uniqueProducts.length; i++) {
    const p = uniqueProducts[i];
    let shortDesc = p.short_description || '';
    let fullDesc = p.description || '';
    let specs = [];
    let technicalData = {};

    // Check if we need to fetch individual page
    const needPageFetch = (!fullDesc || fullDesc.length < 50) && (!shortDesc || shortDesc.length < 50);

    if (needPageFetch && p.permalink) {
      try {
        const html = await fetchText(p.permalink);
        
        // Extract short description
        if (!shortDesc) {
          const shortM = html.match(/class="[^"]*woocommerce-product-details__short-description[^"]*"[^>]*>([\s\S]*?)<\/div>/i);
          if (shortM && shortM[1].trim()) {
            shortDesc = shortM[1].trim();
          }
        }

        // Extract description tab
        if (!fullDesc) {
          const descM = html.match(/id="tab-description"[^>]*>([\s\S]*?)<\/div>/i);
          if (descM && descM[1].trim()) {
            fullDesc = descM[1].trim();
          }
        }

        // Check for WoodMart or Elementor content
        const wdTabM = html.match(/id="tab-wd_additional_tab"[^>]*>([\s\S]*?)<\/div>/i);
        if (wdTabM && wdTabM[1].trim()) {
          const text = stripHtml(wdTabM[1]);
          if (text.length > 50 && !text.includes('Consectetur cras')) {
            technicalData['Additional Info'] = text;
          }
        }

        // Check for attributes table
        const attrMatches = [...html.matchAll(/<th class="woocommerce-product-attributes-item__label">([\s\S]*?)<\/th>\s*<td class="woocommerce-product-attributes-item__value">([\s\S]*?)<\/td>/gi)];
        for (const m of attrMatches) {
          const label = stripHtml(m[1]);
          const val = stripHtml(m[2]);
          if (label && val) {
            technicalData[label] = val;
            specs.push({ label, value: val });
          }
        }
      } catch (err) {
        // Ignore single product page fetch error
      }
    }

    // Extract bullet points from short description if exists
    const bulletMatches = [...(shortDesc || '').matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)].map(m => stripHtml(m[1]));

    const priceNum = parseFloat(p.prices?.price || '0') / (10 ** (p.prices?.currency_minor_unit || 2));
    const regularPriceNum = parseFloat(p.prices?.regular_price || '0') / (10 ** (p.prices?.currency_minor_unit || 2));
    const salePriceNum = parseFloat(p.prices?.sale_price || '0') / (10 ** (p.prices?.currency_minor_unit || 2));

    const featuredImage = p.images && p.images.length > 0 ? p.images[0] : null;
    const galleryImages = p.images || [];

    const productRecord = {
      id: p.id,
      name: p.name,
      slug: p.slug,
      permalink: p.permalink,
      sku: p.sku || `ST-${p.id}`,
      type: p.type || 'simple',
      onSale: p.on_sale || false,
      isInStock: p.is_in_stock !== false,
      price: priceNum,
      regularPrice: regularPriceNum,
      salePrice: salePriceNum,
      priceHtml: p.price_html || '',
      currency: p.prices?.currency_code || 'PKR',
      currencySymbol: p.prices?.currency_symbol || '₨',
      averageRating: parseFloat(p.average_rating || '0'),
      reviewCount: parseInt(p.review_count || '0', 10),
      shortDescription: shortDesc,
      shortDescriptionText: stripHtml(shortDesc),
      description: fullDesc,
      descriptionText: stripHtml(fullDesc),
      keyFeatures: bulletMatches,
      specifications: specs,
      technicalData: technicalData,
      categories: (p.categories || []).map(c => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        link: c.link
      })),
      tags: (p.tags || []).map(t => ({
        id: t.id,
        name: t.name,
        slug: t.slug
      })),
      featuredImage: featuredImage ? {
        id: featuredImage.id,
        src: featuredImage.src,
        thumbnail: featuredImage.thumbnail,
        alt: featuredImage.alt || p.name,
        name: featuredImage.name
      } : null,
      gallery: galleryImages.map(img => ({
        id: img.id,
        src: img.src,
        thumbnail: img.thumbnail,
        alt: img.alt || p.name,
        name: img.name
      }))
    };

    if (!productRecord.descriptionText && !productRecord.shortDescriptionText) {
      missingDescriptionList.push({
        id: p.id,
        name: p.name,
        slug: p.slug,
        url: p.permalink
      });
    }

    processedProducts.push(productRecord);
  }

  // 5. Structure Categories Hierarchy
  console.log('Structuring category hierarchy...');
  // Define parent-child mapping based on actual SonoTech.pk taxonomy and website navigation
  const parentMapping = {
    // Human Medical Equipment Subcategories
    'ultrasound-scanners': 'human-medical-equipment',
    'black-and-white-ultrasound-machine': 'ultrasound-scanners',
    'portable-color-dopplers': 'ultrasound-scanners',
    'trolly-mounted-color-dopplers': 'ultrasound-scanners',
    'usb-and-wifi-ultrasound': 'ultrasound-scanners',
    'usb-probes': 'usb-and-wifi-ultrasound',
    'wireless-d3-series': 'usb-and-wifi-ultrasound',
    'wireless-youkey-series': 'usb-and-wifi-ultrasound',
    'ultrasound-probes': 'human-medical-equipment',
    'ultrasound-new-compatible-probes': 'ultrasound-probes',
    'ge-ultrasound-probes': 'ultrasound-probes',
    'honda-ultrasound-probes': 'ultrasound-probes',
    'mindray-ultrasound-probes': 'ultrasound-probes',
    'toshiba-ultrasound-probes': 'ultrasound-probes',
    'lab-daignistic-equipment': 'human-medical-equipment',
    'point-of-care': 'lab-daignistic-equipment',
    'human-lab': 'lab-daignistic-equipment',
    'patient-monitors': 'human-medical-equipment',
    'fetal-maternal-monitors-ctg': 'human-medical-equipment',
    'fetal-dopplers': 'human-medical-equipment',
    'electrocardiogram-ecg': 'human-medical-equipment',
    'radiology-equipment': 'human-medical-equipment',
    'accessories': 'human-medical-equipment',
    'ultrasound-transmission-gel': 'accessories',
    'ultrasound-thermal-paper': 'accessories',
    'ultrasound-carring-bags': 'accessories',
    'ultrasound-carrying-bags': 'accessories',
    'thermal-printers': 'accessories',
    'medical-ups-sytem': 'accessories',
    'medical-ups-systems': 'accessories',
    'medical-stablizer': 'accessories',
    'medical-stabilizer': 'accessories',

    // Veterinary Medical Equipment Subcategories
    'veterinary-ultrasound': 'vterinary-medical-equipment',
    'vet-ultrasound-scanners': 'vterinary-medical-equipment',
    'portable-veterinary-ultrasound-machines': 'veterinary-ultrasound',
    'handheld-veterinary-ultrasound-machines': 'veterinary-ultrasound',
    'handheld-veterinary-ultrasound-machines-2': 'veterinary-ultrasound',
    'chinese-veterinary-ultrasound-machines': 'veterinary-ultrasound',
    'poland-draminski-veterinary-ultrasound-machines': 'veterinary-ultrasound',
    'usb-veterinary-ultrasound-probes': 'veterinary-ultrasound',
    'veterinay-lab-equipment': 'vterinary-medical-equipment',
    'estrous-detectors': 'vterinary-medical-equipment',
    'veterinary-patient-monitor': 'vterinary-medical-equipment',
    'mastitis-detectors': 'vterinary-medical-equipment',
    'pregnancy-detectors': 'vterinary-medical-equipment',
    'm-veterniary': 'vterinary-medical-equipment'
  };

  const structuredCategories = rawCategories.map(cat => {
    const parentSlug = parentMapping[cat.slug] || null;
    return {
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description || '',
      count: cat.count || 0,
      image: cat.image ? {
        id: cat.image.id,
        src: cat.image.src
      } : null,
      parentSlug: parentSlug,
      isRoot: !parentSlug
    };
  });

  // 6. Build Image Manifest
  console.log('Generating image manifest...');
  const imageManifest = {
    totalProductsWithImages: 0,
    totalImages: 0,
    products: []
  };

  let totalImagesCount = 0;
  for (const p of processedProducts) {
    if (p.gallery && p.gallery.length > 0) {
      imageManifest.totalProductsWithImages++;
      totalImagesCount += p.gallery.length;
      imageManifest.products.push({
        productId: p.id,
        productName: p.name,
        slug: p.slug,
        featuredImage: p.featuredImage?.src || null,
        gallery: p.gallery.map(g => g.src)
      });
    }
  }
  imageManifest.totalImages = totalImagesCount;

  // 7. Generate CSV representation
  console.log('Generating CSV format...');
  const csvHeaders = [
    'ID',
    'Name',
    'Slug',
    'SKU',
    'Price (PKR)',
    'Regular Price',
    'Sale Price',
    'In Stock',
    'Categories',
    'Featured Image URL',
    'Gallery Images Count',
    'Key Features Count',
    'Permalink'
  ];
  const csvRows = [csvHeaders.join(',')];
  for (const p of processedProducts) {
    const catNames = p.categories.map(c => `"${c.name.replace(/"/g, '""')}"`).join('; ');
    const row = [
      p.id,
      `"${p.name.replace(/"/g, '""')}"`,
      `"${p.slug}"`,
      `"${p.sku}"`,
      p.price,
      p.regularPrice,
      p.salePrice,
      p.isInStock ? 'Yes' : 'No',
      `"${catNames}"`,
      `"${p.featuredImage?.src || ''}"`,
      p.gallery.length,
      p.keyFeatures.length,
      `"${p.permalink}"`
    ];
    csvRows.push(row.join(','));
  }
  const productsCsv = csvRows.join('\n');

  // 8. Extraction Report & Missing Data Report
  const extractionReport = {
    timestamp: new Date().toISOString(),
    sourceWebsite: 'https://sonotech.pk/',
    totalDiscoveredUrls: discoveredUrls.all.length,
    discoveredProductUrlsFromSitemap: discoveredUrls.products.length,
    discoveredCategoryUrlsFromSitemap: discoveredUrls.categories.length,
    discoveredPageUrlsFromSitemap: discoveredUrls.pages.length,
    totalUniqueProductsExtracted: processedProducts.length,
    totalCategoriesExtracted: structuredCategories.length,
    totalImagesDiscovered: totalImagesCount,
    productsWithKeyFeaturesOrBullets: processedProducts.filter(p => p.keyFeatures.length > 0).length,
    productsWithTechnicalSpecs: processedProducts.filter(p => p.specifications.length > 0 || Object.keys(p.technicalData).length > 0).length,
    productsWithDescription: processedProducts.filter(p => p.descriptionText.length > 0).length,
    productsWithShortDescription: processedProducts.filter(p => p.shortDescriptionText.length > 0).length,
    productsWithImages: processedProducts.filter(p => p.gallery.length > 0).length,
    allUniqueCategories: structuredCategories.map(c => ({ id: c.id, name: c.name, slug: c.slug, count: c.count }))
  };

  const missingDataReport = {
    timestamp: new Date().toISOString(),
    totalProductsMissingDescriptions: missingDescriptionList.length,
    missingDescriptionProducts: missingDescriptionList,
    note: 'In the original SonoTech.pk WooCommerce database, certain probe accessories are listed with model numbers and high-resolution photos but with empty descriptions in the store CMS. These have been accurately documented without inventing fabricated text.'
  };

  // Ensure output directories exist
  const outputDirs = [
    path.resolve(process.cwd(), 'data'),
    path.resolve(process.cwd(), 'src/data')
  ];

  for (const dir of outputDirs) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  // Write all required files to both data/ and src/data/
  for (const targetDir of outputDirs) {
    fs.writeFileSync(path.join(targetDir, 'products.json'), JSON.stringify(processedProducts, null, 2), 'utf8');
    fs.writeFileSync(path.join(targetDir, 'products.csv'), productsCsv, 'utf8');
    fs.writeFileSync(path.join(targetDir, 'categories.json'), JSON.stringify(structuredCategories, null, 2), 'utf8');
    fs.writeFileSync(path.join(targetDir, 'image-manifest.json'), JSON.stringify(imageManifest, null, 2), 'utf8');
    fs.writeFileSync(path.join(targetDir, 'discovered-urls.json'), JSON.stringify(discoveredUrls, null, 2), 'utf8');
    fs.writeFileSync(path.join(targetDir, 'extraction-report.json'), JSON.stringify(extractionReport, null, 2), 'utf8');
    fs.writeFileSync(path.join(targetDir, 'missing-data-report.json'), JSON.stringify(missingDataReport, null, 2), 'utf8');
  }

  console.log('--- DATA EXTRACTION AND FILE GENERATION COMPLETE ---');
  console.log(`Successfully generated files for ${processedProducts.length} unique products, ${structuredCategories.length} categories, and ${totalImagesCount} images.`);
}

run().catch(err => {
  console.error('Extraction failed:', err);
  process.exit(1);
});
