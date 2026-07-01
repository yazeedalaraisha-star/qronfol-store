const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const https = require('https');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;
const DATA_FILE = path.join(__dirname, 'data', 'products.json');
const SETTINGS_FILE = path.join(__dirname, 'data', 'settings.json');
const ORDERS_FILE = path.join(__dirname, 'data', 'orders.json');
const USE_MONGO = !!MONGODB_URI;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static(__dirname, { maxAge: '1h', etag: true }));

if (!fs.existsSync(path.join(__dirname, 'data'))) {
  fs.mkdirSync(path.join(__dirname, 'data'));
}

function readJSON(file) {
  const raw = fs.readFileSync(file, 'utf8');
  return JSON.parse(raw.replace(/^\uFEFF/, ''));
}

function writeJSON(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
}

function getDefaultProducts() {
  return [
    { id: 1, title: 'وشاح الكوفية الفلسطينية', titleEn: 'Palestinian Keffiyeh', description: 'كوفية فلسطينية أصلية بتطريز يدوي، رمز التراث والهوية', price: 15.00, oldPrice: null, category: 'accessories', badge: 'best', icon: 'fa-regular fa-hand-peace', image: '', stock: null },
    { id: 2, title: 'سلسلة مفاتيح "غزة في القلب"', titleEn: '"Gaza in Heart" Keychain', description: 'سلسلة مفاتيح خشبية محفورة بعبارة "غزة في القلب"', price: 8.00, oldPrice: null, category: 'accessories', badge: '', icon: 'fa-solid fa-key', image: '', stock: null },
    { id: 3, title: 'طقم تطريز فلسطيني', titleEn: 'Palestinian Embroidery Kit', description: 'طقم تطريز متكامل يحتوي على خيوط وإبرة وقطن للتطريز', price: 25.00, oldPrice: 30.00, category: 'embroidery', badge: 'sale', icon: 'fa-solid fa-needle', image: '', stock: null },
    { id: 4, title: 'برواز تراثي "القدس"', titleEn: '"Jerusalem" Heritage Frame', description: 'برواز بقبة الصخرة مصنوع يدويًا بتفاصيل تراثية', price: 22.00, oldPrice: null, category: 'decor', badge: 'new', icon: 'fa-regular fa-building', image: '', stock: null },
    { id: 5, title: 'تيشيرت "فلسطين"', titleEn: '"Palestine" T-Shirt', description: 'تيشيرت قطني بطباعة عالية الجودة لخريطة فلسطين', price: 18.00, oldPrice: null, category: 'apparel', badge: '', icon: 'fa-solid fa-shirt', image: '', stock: null },
    { id: 6, title: 'سوار الزيتون', titleEn: 'Olive Bracelet', description: 'سوار جلدي بحبة زيتون فضية، رمز الأرض المباركة', price: 12.00, oldPrice: null, category: 'accessories', badge: '', icon: 'fa-solid fa-tree', image: '', stock: null },
    { id: 7, title: 'قطعة ديكور "مفتاح العودة"', titleEn: '"Key of Return" Decor', description: 'مفتاح العودة الخشبي المطلي بالذهب، رمز الحق الفلسطيني', price: 18.00, oldPrice: null, category: 'decor', badge: 'best', icon: 'fa-solid fa-key', image: '', stock: null },
    { id: 8, title: 'عباية مطرزة', titleEn: 'Embroidered Abaya', description: 'عباية سوداء بتطريز فلسطيني أصيل على الأكمام', price: 45.00, oldPrice: 55.00, category: 'apparel', badge: 'sale', icon: 'fa-solid fa-user-tie', image: '', stock: null },
    { id: 9, title: 'حقيبة "تراث"', titleEn: '"Turath" Bag', description: 'حقيبة يد قماشية بتطريز فلسطيني ورسومات تراثية', price: 20.00, oldPrice: null, category: 'accessories', badge: '', icon: 'fa-solid fa-bag-shopping', image: '', stock: null },
    { id: 10, title: 'magnet الثورة', titleEn: 'Revolution Magnet', description: 'مغناطيس ثلاجة بتصميم علم فلسطين ورسالة دعم', price: 5.00, oldPrice: null, category: 'decor', badge: 'new', icon: 'fa-solid fa-thumbtack', image: '', stock: null },
    { id: 11, title: 'طاقية مطرزة', titleEn: 'Embroidered Cap', description: 'طاقية بيسبول بتطريز أسود اللون وزهرة فلسطين', price: 14.00, oldPrice: null, category: 'apparel', badge: '', icon: 'fa-solid fa-hat-cowboy', image: '', stock: null },
    { id: 12, title: 'لوحة جدارية "الأقصى"', titleEn: '"Al-Aqsa" Wall Art', description: 'لوحة جدارية للمسجد الأقصى بتقنية الرسم الزيتي', price: 30.00, oldPrice: null, category: 'decor', badge: '', icon: 'fa-regular fa-image', image: '', stock: null },
    { id: 13, title: 'مسبحة خشب الزيتون', titleEn: 'Olive Wood Rosary', description: 'مسبحة من خشب الزيتون المقدس من فلسطين', price: 10.00, oldPrice: null, category: 'accessories', badge: '', icon: 'fa-solid fa-dharmachakra', image: '', stock: null },
    { id: 14, title: 'طقم كاسات "تراثي"', titleEn: 'Heritage Cup Set', description: 'طقم 4 كاسات سيراميك برسومات تراثية فلسطينية', price: 16.00, oldPrice: null, category: 'decor', badge: '', icon: 'fa-solid fa-mug-saucer', image: '', stock: null },
    { id: 15, title: 'إيشارب حرير مطبوع', titleEn: 'Printed Silk Scarf', description: 'إيشارب حريري بطبعة علم فلسطين وتصاميم تراثية', price: 12.00, oldPrice: null, category: 'apparel', badge: 'new', icon: 'fa-solid fa-scarf', image: '', stock: null },
    { id: 16, title: 'قطعة ديكور "أرضنا"', titleEn: '"Our Land" Decor Piece', description: 'مجسم خشبي لخريطة فلسطين مع أسماء المدن', price: 28.00, oldPrice: null, category: 'decor', badge: 'best', icon: 'fa-regular fa-map', image: '', stock: null }
  ];
}

// ==================== MongoDB Schema ====================

let Product, Order, Settings;

if (USE_MONGO) {
  const productSchema = new mongoose.Schema({ id: Number, title: String, titleEn: String, description: String, price: Number, oldPrice: Number, category: String, badge: String, icon: String, image: String, stock: Number, tags: [String] }, { collection: 'products' });
  const orderSchema = new mongoose.Schema({ id: Number, name: String, phone: String, address: String, notes: String, items: Array, total: String, createdAt: String, status: String }, { collection: 'orders' });
  const settingsSchema = new mongoose.Schema({ whatsappNumber: String, callmebotApiKey: String, shippingCost: Number, freeShippingOver: Number }, { collection: 'settings' });

  Product = mongoose.model('Product', productSchema);
  Order = mongoose.model('Order', orderSchema);
  Settings = mongoose.model('Settings', settingsSchema);
}

async function getMongoProducts() {
  const count = await Product.countDocuments();
  if (count === 0) await Product.insertMany(getDefaultProducts());
  return await Product.find().lean();
}

async function getMongoSettings() {
  let s = await Settings.findOne().lean();
  if (!s) {
    s = { whatsappNumber: '', callmebotApiKey: '', shippingCost: 0, freeShippingOver: 0 };
    await Settings.create(s);
  }
  return s;
}

// ==================== Cache ====================
let productsCache = null;
let productsCacheTime = 0;
const CACHE_TTL = 5000;

// ==================== Health Check ====================
app.get('/health', (req, res) => res.json({ ok: true, mongo: USE_MONGO }));

// ==================== Products API ====================

app.get('/api/products', async (req, res) => {
  try {
    if (USE_MONGO) {
      // Simple cache: products rarely change, cache for 5s
      if (productsCache && Date.now() - productsCacheTime < CACHE_TTL) {
        return res.json(productsCache);
      }
      productsCache = await getMongoProducts();
      productsCacheTime = Date.now();
      return res.json(productsCache);
    }
    res.json(readJSON(DATA_FILE));
  } catch { res.json(getDefaultProducts()); }
});

app.post('/api/products', async (req, res) => {
  try {
    const products = req.body;
    if (!Array.isArray(products)) return res.status(400).json({ error: 'Invalid data format' });
    if (USE_MONGO) {
      await Product.deleteMany({});
      await Product.insertMany(products);
      productsCache = null; // invalidate cache
      return res.json({ success: true });
    }
    writeJSON(DATA_FILE, products);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ==================== Settings API ====================

app.get('/api/settings', async (req, res) => {
  try {
    if (USE_MONGO) return res.json(await getMongoSettings());
    res.json(readJSON(SETTINGS_FILE));
  } catch { res.json({ whatsappNumber: '', callmebotApiKey: '', shippingCost: 0, freeShippingOver: 0 }); }
});

app.post('/api/settings', async (req, res) => {
  try {
    if (USE_MONGO) {
      await Settings.findOneAndUpdate({}, req.body, { upsert: true });
      return res.json({ success: true });
    }
    writeJSON(SETTINGS_FILE, req.body);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ==================== Order API ====================

app.post('/api/order', async (req, res) => {
  try {
    const { name, phone, address, notes, items, total } = req.body;
    let settings;
    if (USE_MONGO) {
      settings = await getMongoSettings();
    } else {
      settings = readJSON(SETTINGS_FILE);
    }
    const adminPhone = settings.whatsappNumber;
    const apiKey = settings.callmebotApiKey;

    const order = {
      id: Date.now(),
      name, phone, address, notes, items, total,
      createdAt: new Date().toISOString(),
      status: 'جديد'
    };

    // Save order
    if (USE_MONGO) {
      await Order.create(order);
    } else {
      const orders = readJSON(ORDERS_FILE);
      orders.unshift(order);
      writeJSON(ORDERS_FILE, orders);
    }
    console.log(`[ORDER] #${order.id} — ${name} — ${total} JOD`);

    // Build WhatsApp message
    const orderItems = items.map(item =>
      `🛒 ${item.title}\n   ${item.quantity} × ${item.price.toFixed(2)} JOD = ${(item.price * item.quantity).toFixed(2)} JOD`
    ).join('\n');

    const whatsappMessage =
      `🌿 *قرنفل — طلب جديد* 🌿\n` +
      `━━━━━━━━━━━━━━━━\n` +
      `🆔 *رقم الطلب:* #${order.id}\n` +
      `📅 *التاريخ:* ${new Date().toLocaleString('ar', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}\n` +
      `━━━━━━━━━━━━━━━━\n` +
      `👤 *العميل:* ${name}\n` +
      `📞 *الهاتف:* ${phone}\n` +
      `📍 *العنوان:* ${address}\n` +
      (notes ? `📝 *ملاحظات:* ${notes}\n` : '') +
      `━━━━━━━━━━━━━━━━\n` +
      `*المنتجات:*\n${orderItems}\n` +
      `━━━━━━━━━━━━━━━━\n` +
      `💵 *الإجمالي:* ${total} JOD\n` +
      `━━━━━━━━━━━━━━━━\n` +
      `✅ *الحالة:* جديد\n` +
      `━━━━━━━━━━━━━━━━\n` +
      `🌐 قرنفل — متجر التراث الفلسطيني`;

    const fallbackUrl = `https://wa.me/${adminPhone || '962792067277'}?text=${encodeURIComponent(whatsappMessage)}`;

    res.json({ success: true, method: 'callmebot', sent: false, orderId: order.id, fallbackUrl, adminPhone: adminPhone || '962792067277' });

    if (adminPhone && apiKey) {
      const callmebotUrl = `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(adminPhone)}&text=${encodeURIComponent(whatsappMessage)}&apikey=${encodeURIComponent(apiKey)}`;
      fetch(callmebotUrl).catch(() => {});
    }

  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/orders', async (req, res) => {
  try {
    if (USE_MONGO) {
      const orders = await Order.find().sort({ id: -1 }).lean();
      return res.json(orders);
    }
    res.json(readJSON(ORDERS_FILE));
  } catch { res.json([]); }
});

app.put('/api/orders/:id', async (req, res) => {
  try {
    if (USE_MONGO) {
      await Order.findOneAndUpdate({ id: req.params.id }, req.body);
      return res.json({ success: true });
    }
    const orders = readJSON(ORDERS_FILE);
    const idx = orders.findIndex(o => o.id == req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Order not found' });
    orders[idx] = { ...orders[idx], ...req.body };
    writeJSON(ORDERS_FILE, orders);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Notify customer via CallMeBot
app.post('/api/orders/:id/notify', async (req, res) => {
  try {
    let order;
    if (USE_MONGO) {
      order = await Order.findOne({ id: req.params.id }).lean();
    } else {
      const orders = readJSON(ORDERS_FILE);
      order = orders.find(o => o.id == req.params.id);
    }
    if (!order) return res.status(404).json({ error: 'Order not found' });

    let settings;
    if (USE_MONGO) {
      settings = await getMongoSettings();
    } else {
      settings = readJSON(SETTINGS_FILE);
    }
    const apiKey = settings.callmebotApiKey;

    if (!apiKey || !order.phone) {
      return res.json({ success: false, error: 'No API key or customer phone' });
    }

    const items = (order.items || []).map(i =>
      `🛒 ${i.title}\n   ${i.quantity} × ${i.price.toFixed(2)} JOD = ${(i.price * i.quantity).toFixed(2)} JOD`
    ).join('\n');
    const message =
      `🌿 *قرنفل — تحديث الطلب #${order.id}* 🌿\n` +
      `━━━━━━━━━━━━━━━━\n` +
      `👤 *العميل:* ${order.name}\n` +
      `📞 *الهاتف:* ${order.phone}\n` +
      `📍 *العنوان:* ${order.address}\n` +
      `━━━━━━━━━━━━━━━━\n` +
      `*المنتجات:*\n${items}\n` +
      `━━━━━━━━━━━━━━━━\n` +
      `💵 *الإجمالي:* ${order.total} JOD\n` +
      `━━━━━━━━━━━━━━━━\n` +
      `🔄 *الحالة:* ${order.status}\n` +
      `━━━━━━━━━━━━━━━━\n` +
      `🌐 قرنفل — متجر التراث الفلسطيني\n` +
      `نشكرك على ثقتك! 💚🇵🇸`;

    const customerPhone = order.phone.replace(/^0/, '962');
    const url = `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(customerPhone)}&text=${encodeURIComponent(message)}&apikey=${encodeURIComponent(apiKey)}`;

    https.get(url, (response) => {
      let data = '';
      response.on('data', chunk => data += chunk);
      response.on('end', () => res.json({ success: true, response: data }));
    }).on('error', () => res.json({ success: false }));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// PDF Report
app.get('/api/orders/report', async (req, res) => {
  try {
    let orders;
    if (USE_MONGO) {
      orders = await Order.find().sort({ id: -1 }).lean();
    } else {
      orders = readJSON(ORDERS_FILE);
    }
    let totalRevenue = 0;
    const rows = orders.map(o => {
      totalRevenue += parseFloat(o.total) || 0;
      const items = o.items.map(i => `${i.title} x${i.quantity}`).join(', ');
      return `<tr>
        <td>#${o.id}</td>
        <td>${o.name}</td>
        <td>${o.phone}</td>
        <td>${o.address}</td>
        <td>${o.total} JOD</td>
        <td>${new Date(o.createdAt).toLocaleDateString('ar')}</td>
        <td>${o.status}</td>
        <td>${items}</td>
      </tr>`;
    }).join('');

    res.send(`<!DOCTYPE html><html dir="rtl"><head><meta charset="UTF-8">
      <title>تقرير الطلبات - قرنفل</title>
      <style>
        body { font-family: 'Cairo', sans-serif; padding: 20px; }
        h1 { text-align: center; color: #1b5e20; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th { background: #1b5e20; color: white; padding: 10px; text-align: right; }
        td { padding: 8px 10px; border-bottom: 1px solid #ddd; }
        .total { text-align: center; font-size: 18px; margin-top: 20px; font-weight: 700; }
        @media print { .no-print { display: none; } }
      </style>
    </head><body>
      <h1>🌿 قرنفل - تقرير الطلبات</h1>
      <p style="text-align:center">${new Date().toLocaleDateString('ar')}</p>
      <table><thead><tr>
        <th>#</th><th>العميل</th><th>الهاتف</th><th>العنوان</th><th>المبلغ</th><th>التاريخ</th><th>الحالة</th><th>المنتجات</th>
      </tr></thead><tbody>${rows}</tbody></table>
      <div class="total">إجمالي المبيعات: ${totalRevenue.toFixed(2)} JOD</div>
      <div class="no-print" style="text-align:center;margin-top:20px">
        <button onclick="window.print()" style="padding:10px 24px;background:#1b5e20;color:white;border:none;border-radius:8px;font-size:16px;cursor:pointer">🖨️ طباعة / حفظ PDF</button>
      </div>
    </body></html>`);
  } catch (err) { res.status(500).send(err.message); }
});

// ==================== Start Server ====================

async function start() {
  if (USE_MONGO) {
    try {
      mongoose.set('strictQuery', false);
      await mongoose.connect(MONGODB_URI, {
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 5000,
        socketTimeoutMS: 30000,
        maxPoolSize: 5
      });
      console.log('  🍃 MongoDB connected');
    } catch (err) {
      console.error('  ❌ MongoDB connection failed:', err.message);
      process.exit(1);
    }
  }

  if (!USE_MONGO) {
    try {
      if (!fs.existsSync(DATA_FILE)) writeJSON(DATA_FILE, getDefaultProducts());
      if (!fs.existsSync(SETTINGS_FILE)) writeJSON(SETTINGS_FILE, { whatsappNumber: '', callmebotApiKey: '', shippingCost: 0, freeShippingOver: 0 });
      if (!fs.existsSync(ORDERS_FILE)) writeJSON(ORDERS_FILE, []);
    } catch {}
  }

  app.listen(PORT, () => {
    console.log(`\n  🌿 Qronfol Store Server`);
    console.log(`  ─────────────────────`);
    console.log(`  🏪  المتجر:  http://localhost:${PORT}`);
    console.log(`  ⚙️  الأدمن:  http://localhost:${PORT}/admin.html`);
    console.log(`  📡 API:     http://localhost:${PORT}/api/products`);
    console.log(`  📡 Orders:  http://localhost:${PORT}/api/orders`);
    console.log(`  📦 Storage: ${USE_MONGO ? 'MongoDB Atlas' : 'Local JSON files'}`);
    console.log(`\n`);
  });
}

start();
