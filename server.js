const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'data', 'products.json');

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static(__dirname));

// Ensure data directory exists
if (!fs.existsSync(path.join(__dirname, 'data'))) {
  fs.mkdirSync(path.join(__dirname, 'data'));
}

// Initialize data file with default products if not exists
if (!fs.existsSync(DATA_FILE)) {
  const defaultProducts = getDefaultProducts();
  fs.writeFileSync(DATA_FILE, JSON.stringify(defaultProducts, null, 2));
}

function getDefaultProducts() {
  return [
    { id: 1, title: 'وشاح الكوفية الفلسطينية', titleEn: 'Palestinian Keffiyeh', description: 'كوفية فلسطينية أصلية بتطريز يدوي، رمز التراث والهوية', price: 15.00, oldPrice: null, category: 'accessories', badge: 'best', icon: 'fa-regular fa-hand-peace', image: '' },
    { id: 2, title: 'سلسلة مفاتيح "غزة في القلب"', titleEn: '"Gaza in Heart" Keychain', description: 'سلسلة مفاتيح خشبية محفورة بعبارة "غزة في القلب"', price: 8.00, oldPrice: null, category: 'accessories', badge: '', icon: 'fa-solid fa-key', image: '' },
    { id: 3, title: 'طقم تطريز فلسطيني', titleEn: 'Palestinian Embroidery Kit', description: 'طقم تطريز متكامل يحتوي على خيوط وإبرة وقطن للتطريز', price: 25.00, oldPrice: 30.00, category: 'embroidery', badge: 'sale', icon: 'fa-solid fa-needle', image: '' },
    { id: 4, title: 'برواز تراثي "القدس"', titleEn: '"Jerusalem" Heritage Frame', description: 'برواز بقبة الصخرة مصنوع يدويًا بتفاصيل تراثية', price: 22.00, oldPrice: null, category: 'decor', badge: 'new', icon: 'fa-regular fa-building', image: '' },
    { id: 5, title: 'تيشيرت "فلسطين"', titleEn: '"Palestine" T-Shirt', description: 'تيشيرت قطني بطباعة عالية الجودة لخريطة فلسطين', price: 18.00, oldPrice: null, category: 'apparel', badge: '', icon: 'fa-solid fa-shirt', image: '' },
    { id: 6, title: 'سوار الزيتون', titleEn: 'Olive Bracelet', description: 'سوار جلدي بحبة زيتون فضية، رمز الأرض المباركة', price: 12.00, oldPrice: null, category: 'accessories', badge: '', icon: 'fa-solid fa-tree', image: '' },
    { id: 7, title: 'قطعة ديكور "مفتاح العودة"', titleEn: '"Key of Return" Decor', description: 'مفتاح العودة الخشبي المطلي بالذهب، رمز الحق الفلسطيني', price: 18.00, oldPrice: null, category: 'decor', badge: 'best', icon: 'fa-solid fa-key', image: '' },
    { id: 8, title: 'عباية مطرزة', titleEn: 'Embroidered Abaya', description: 'عباية سوداء بتطريز فلسطيني أصيل على الأكمام', price: 45.00, oldPrice: 55.00, category: 'apparel', badge: 'sale', icon: 'fa-solid fa-user-tie', image: '' },
    { id: 9, title: 'حقيبة "تراث"', titleEn: '"Turath" Bag', description: 'حقيبة يد قماشية بتطريز فلسطيني ورسومات تراثية', price: 20.00, oldPrice: null, category: 'accessories', badge: '', icon: 'fa-solid fa-bag-shopping', image: '' },
    { id: 10, title: 'magnet الثورة', titleEn: 'Revolution Magnet', description: 'مغناطيس ثلاجة بتصميم علم فلسطين ورسالة دعم', price: 5.00, oldPrice: null, category: 'decor', badge: 'new', icon: 'fa-solid fa-thumbtack', image: '' },
    { id: 11, title: 'طاقية مطرزة', titleEn: 'Embroidered Cap', description: 'طاقية بيسبول بتطريز أسود اللون وزهرة فلسطين', price: 14.00, oldPrice: null, category: 'apparel', badge: '', icon: 'fa-solid fa-hat-cowboy', image: '' },
    { id: 12, title: 'لوحة جدارية "الأقصى"', titleEn: '"Al-Aqsa" Wall Art', description: 'لوحة جدارية للمسجد الأقصى بتقنية الرسم الزيتي', price: 30.00, oldPrice: null, category: 'decor', badge: '', icon: 'fa-regular fa-image', image: '' },
    { id: 13, title: 'مسبحة خشب الزيتون', titleEn: 'Olive Wood Rosary', description: 'مسبحة من خشب الزيتون المقدس من فلسطين', price: 10.00, oldPrice: null, category: 'accessories', badge: '', icon: 'fa-solid fa-dharmachakra', image: '' },
    { id: 14, title: 'طقم كاسات "تراثي"', titleEn: 'Heritage Cup Set', description: 'طقم 4 كاسات سيراميك برسومات تراثية فلسطينية', price: 16.00, oldPrice: null, category: 'decor', badge: '', icon: 'fa-solid fa-mug-saucer', image: '' },
    { id: 15, title: 'إيشارب حرير مطبوع', titleEn: 'Printed Silk Scarf', description: 'إيشارب حريري بطبعة علم فلسطين وتصاميم تراثية', price: 12.00, oldPrice: null, category: 'apparel', badge: 'new', icon: 'fa-solid fa-scarf', image: '' },
    { id: 16, title: 'قطعة ديكور "أرضنا"', titleEn: '"Our Land" Decor Piece', description: 'مجسم خشبي لخريطة فلسطين مع أسماء المدن', price: 28.00, oldPrice: null, category: 'decor', badge: 'best', icon: 'fa-regular fa-map', image: '' }
  ];
}

// GET /api/products - return all products
app.get('/api/products', (req, res) => {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    res.json(JSON.parse(data));
  } catch {
    res.json(getDefaultProducts());
  }
});

// POST /api/products - save all products
app.post('/api/products', (req, res) => {
  try {
    const products = req.body;
    if (!Array.isArray(products)) {
      return res.status(400).json({ error: 'Invalid data format' });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(products, null, 2));
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`\n  🌿 Qronfol Store Server`);
  console.log(`  ─────────────────────`);
  console.log(`  🏪  المتجر:  http://localhost:${PORT}`);
  console.log(`  ⚙️  الأدمن:  http://localhost:${PORT}/admin.html`);
  console.log(`  📡 API:     http://localhost:${PORT}/api/products`);
  console.log(`\n`);
});
