const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const https = require('https');
const mongoose = require('mongoose');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const session = require('express-session');
const cookieParser = require('cookie-parser');

const app = express();
app.set('trust proxy', 1);
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'qronfol2024';
const SESSION_SECRET = process.env.SESSION_SECRET || 'qronfol-secret-key-change-in-production';
const DATA_FILE = path.join(__dirname, 'data', 'products.json');
const SETTINGS_FILE = path.join(__dirname, 'data', 'settings.json');
const ORDERS_FILE = path.join(__dirname, 'data', 'orders.json');
const USE_MONGO = !!MONGODB_URI;

// Security
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: false,
}));
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  proxy: true,
  cookie: { secure: true, httpOnly: true, sameSite: 'lax', maxAge: 24 * 60 * 60 * 1000 }
}));

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { error: 'طلبات كثيرة، حاول بعد شوي' }
});
app.use('/api/', apiLimiter);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'محاولات دخول كثيرة، حاول بعد 15 دقيقة' },
});

const authFormLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  handler: (req, res) => {
    res.redirect('/login.html?error=2');
  },
});

// ==================== Admin Auth (MUST be before static) ====================
app.use('/admin.html', (req, res, next) => {
  if (req.session && req.session.isAdmin) return next();
  return res.redirect('/login.html');
});

app.use(['/api/products', '/api/orders', '/api/settings'], (req, res, next) => {
  const writeMethods = ['POST', 'PUT', 'DELETE', 'PATCH'];
  if (writeMethods.includes(req.method)) {
    if (req.session && req.session.isAdmin) return next();
    return res.status(401).json({ error: 'غير مصرح، يرجى تسجيل الدخول' });
  }
  next();
});

app.use(express.static(__dirname, { maxAge: '1h', etag: true }));

// ==================== Admin Routes ====================

app.post('/api/login', authLimiter, (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    req.session.isAdmin = true;
    return res.json({ success: true });
  }
  return res.status(401).json({ error: 'كلمة المرور غير صحيحة' });
});

app.post('/api/login-form', authFormLimiter, (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    req.session.isAdmin = true;
    return res.redirect('/admin.html');
  }
  return res.redirect('/login.html?error=1');
});

app.post('/api/logout', (req, res) => {
  req.session.destroy();
  res.json({ success: true });
});

app.get('/api/check-auth', (req, res) => {
  res.json({ authenticated: !!(req.session && req.session.isAdmin) });
});

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
    { id: 1, title: 'وشاح الكوفية الفلسطينية', titleEn: 'Palestinian Keffiyeh', description: 'كوفية فلسطينية أصلية بتطريز يدوي، رمز التراث والهوية', price: 15.00, oldPrice: null, category: 'accessories', badge: 'best', icon: 'fa-regular fa-hand-peace', image: 'https://images.unsplash.com/photo-1590041794748-2d8eb73a571c?w=400&h=400&fit=crop', stock: null, tags: ['handmade', 'gift'] },
    { id: 2, title: 'سلسلة مفاتيح "غزة في القلب"', titleEn: '"Gaza in Heart" Keychain', description: 'سلسلة مفاتيح خشبية محفورة بعبارة "غزة في القلب"', price: 8.00, oldPrice: null, category: 'accessories', badge: '', icon: 'fa-solid fa-key', image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop', stock: null, tags: ['gift'] },
    { id: 3, title: 'طقم تطريز فلسطيني', titleEn: 'Palestinian Embroidery Kit', description: 'طقم تطريز متكامل يحتوي على خيوط وإبرة وقطن للتطريز', price: 25.00, oldPrice: 30.00, category: 'embroidery', badge: 'sale', icon: 'fa-solid fa-needle', image: 'https://images.unsplash.com/photo-1601024448722-5b38a2f9ceed?w=400&h=400&fit=crop', stock: null },
    { id: 4, title: 'برواز تراثي "القدس"', titleEn: '"Jerusalem" Heritage Frame', description: 'برواز بقبة الصخرة مصنوع يدويًا بتفاصيل تراثية', price: 22.00, oldPrice: null, category: 'decor', badge: 'new', icon: 'fa-regular fa-building', image: 'https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=400&h=400&fit=crop', stock: null },
    { id: 5, title: 'تيشيرت "فلسطين"', titleEn: '"Palestine" T-Shirt', description: 'تيشيرت قطني بطباعة عالية الجودة لخريطة فلسطين', price: 18.00, oldPrice: null, category: 'apparel', badge: '', icon: 'fa-solid fa-shirt', image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&h=400&fit=crop', stock: null },
    { id: 6, title: 'سوار الزيتون', titleEn: 'Olive Bracelet', description: 'سوار جلدي بحبة زيتون فضية، رمز الأرض المباركة', price: 12.00, oldPrice: null, category: 'accessories', badge: '', icon: 'fa-solid fa-tree', image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&h=400&fit=crop', stock: null },
    { id: 7, title: 'قطعة ديكور "مفتاح العودة"', titleEn: '"Key of Return" Decor', description: 'مفتاح العودة الخشبي المطلي بالذهب، رمز الحق الفلسطيني', price: 18.00, oldPrice: null, category: 'decor', badge: 'best', icon: 'fa-solid fa-key', image: 'https://images.unsplash.com/photo-1574027551686-5e80a7a6d72e?w=400&h=400&fit=crop', stock: null },
    { id: 8, title: 'عباية مطرزة', titleEn: 'Embroidered Abaya', description: 'عباية سوداء بتطريز فلسطيني أصيل على الأكمام', price: 45.00, oldPrice: 55.00, category: 'apparel', badge: 'sale', icon: 'fa-solid fa-user-tie', image: 'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=400&h=400&fit=crop', stock: null },
    { id: 9, title: 'حقيبة "تراث"', titleEn: '"Turath" Bag', description: 'حقيبة يد قماشية بتطريز فلسطيني ورسومات تراثية', price: 20.00, oldPrice: null, category: 'accessories', badge: '', icon: 'fa-solid fa-bag-shopping', image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=400&fit=crop', stock: null },
    { id: 10, title: 'magnet الثورة', titleEn: 'Revolution Magnet', description: 'مغناطيس ثلاجة بتصميم علم فلسطين ورسالة دعم', price: 5.00, oldPrice: null, category: 'decor', badge: 'new', icon: 'fa-solid fa-thumbtack', image: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400&h=400&fit=crop', stock: null },
    { id: 11, title: 'طاقية مطرزة', titleEn: 'Embroidered Cap', description: 'طاقية بيسبول بتطريز أسود اللون وزهرة فلسطين', price: 14.00, oldPrice: null, category: 'apparel', badge: '', icon: 'fa-solid fa-hat-cowboy', image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400&h=400&fit=crop', stock: null },
    { id: 12, title: 'لوحة جدارية "الأقصى"', titleEn: '"Al-Aqsa" Wall Art', description: 'لوحة جدارية للمسجد الأقصى بتقنية الرسم الزيتي', price: 30.00, oldPrice: null, category: 'decor', badge: '', icon: 'fa-regular fa-image', image: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=400&h=400&fit=crop', stock: null },
    { id: 13, title: 'مسبحة خشب الزيتون', titleEn: 'Olive Wood Rosary', description: 'مسبحة من خشب الزيتون المقدس من فلسطين', price: 10.00, oldPrice: null, category: 'accessories', badge: '', icon: 'fa-solid fa-dharmachakra', image: 'https://images.unsplash.com/photo-1612966878609-5e055b468499?w=400&h=400&fit=crop', stock: null },
    { id: 14, title: 'طقم كاسات "تراثي"', titleEn: 'Heritage Cup Set', description: 'طقم 4 كاسات سيراميك برسومات تراثية فلسطينية', price: 16.00, oldPrice: null, category: 'decor', badge: '', icon: 'fa-solid fa-mug-saucer', image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400&h=400&fit=crop', stock: null },
    { id: 15, title: 'إيشارب حرير مطبوع', titleEn: 'Printed Silk Scarf', description: 'إيشارب حريري بطبعة علم فلسطين وتصاميم تراثية', price: 12.00, oldPrice: null, category: 'apparel', badge: 'new', icon: 'fa-solid fa-scarf', image: 'https://images.unsplash.com/photo-1601370690183-1c7796ecec61?w=400&h=400&fit=crop', stock: null },
    { id: 16, title: 'قطعة ديكور "أرضنا"', titleEn: '"Our Land" Decor Piece', description: 'مجسم خشبي لخريطة فلسطين مع أسماء المدن', price: 28.00, oldPrice: null, category: 'decor', badge: 'best', icon: 'fa-regular fa-map', image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&h=400&fit=crop', stock: null }
  ];
}

// ==================== MongoDB Schema ====================

let Product, Order, Settings;

if (USE_MONGO) {
  const productSchema = new mongoose.Schema({ id: Number, title: String, titleEn: String, description: String, price: Number, oldPrice: Number, category: String, badge: String, icon: String, image: String, stock: Number, tags: [String], story: [mongoose.Schema.Types.Mixed] }, { collection: 'products' });
  const orderSchema = new mongoose.Schema({ id: Number, name: String, phone: String, address: String, notes: String, items: Array, total: String, createdAt: String, status: String }, { collection: 'orders' });
  const settingsSchema = new mongoose.Schema({
    whatsappNumber: String, callmebotApiKey: String,
    shippingCost: Number, freeShippingOver: Number,
    emailEnabled: Boolean, emailHost: String, emailPort: Number, emailUser: String, emailPass: String, emailFrom: String, emailTo: String,
    paymentMethod: String, stripeKey: String, paypalClientId: String, paypalEnabled: Boolean
  }, { collection: 'settings' });

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
    s = { whatsappNumber: '', callmebotApiKey: '', shippingCost: 2.00, freeShippingOver: 30.00, emailEnabled: false, emailHost: '', emailPort: 587, emailUser: '', emailPass: '', emailFrom: '', emailTo: '', paymentMethod: 'whatsapp', stripeKey: '', paypalClientId: '', paypalEnabled: false };
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
    let { name, phone, address, notes, items, total, shippingCost, paymentMethod } = req.body;
    let settings;
    if (USE_MONGO) {
      settings = await getMongoSettings();
    } else {
      settings = readJSON(SETTINGS_FILE);
    }
    const adminPhone = settings.whatsappNumber;
    const apiKey = settings.callmebotApiKey;

    // Calculate shipping
    const sCost = settings.shippingCost || 2.00;
    const freeOver = settings.freeShippingOver || 30.00;
    const subtotal = parseFloat(total) || 0;
    const shipping = (shippingCost !== undefined) ? shippingCost : (subtotal >= freeOver ? 0 : sCost);
    const grandTotal = subtotal + shipping;

    const order = {
      id: Date.now(),
      name, phone, address, notes, items,
      subtotal: subtotal.toFixed(2),
      shipping: shipping.toFixed(2),
      total: grandTotal.toFixed(2),
      paymentMethod: paymentMethod || 'whatsapp',
      paymentStatus: paymentMethod && paymentMethod !== 'whatsapp' ? 'pending' : 'paid',
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
    console.log(`[ORDER] #${order.id} — ${name} — ${grandTotal.toFixed(2)} JOD`);

    // Build WhatsApp message
    const orderItems = items.map(item =>
      `🛒 ${item.title}\n   ${item.quantity} × ${item.price.toFixed(2)} JOD = ${(item.price * item.quantity).toFixed(2)} JOD`
    ).join('\n');

    const shippingLine = shipping > 0 ? `🚚 *التوصيل:* ${shipping.toFixed(2)} JOD\n` : '🚚 *التوصيل:* مجاني 🎉\n';

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
      `💵 *المجموع الفرعي:* ${subtotal.toFixed(2)} JOD\n` +
      shippingLine +
      `💵 *الإجمالي:* ${grandTotal.toFixed(2)} JOD\n` +
      `━━━━━━━━━━━━━━━━\n` +
      `✅ *الحالة:* جديد\n` +
      `💳 *الدفع:* ${paymentMethod === 'whatsapp' ? 'عن واتساب' : paymentMethod === 'cod' ? 'عند الاستلام' : 'بطاقة ائتمان'}\n` +
      `━━━━━━━━━━━━━━━━\n` +
      `🌐 قرنفل — متجر التراث الفلسطيني`;

    const fallbackUrl = `https://wa.me/${adminPhone || '962792067277'}?text=${encodeURIComponent(whatsappMessage)}`;

    res.json({ success: true, method: 'callmebot', sent: false, orderId: order.id, fallbackUrl, adminPhone: adminPhone || '962792067277', total: grandTotal.toFixed(2), shipping: shipping.toFixed(2) });

    // CallMeBot notification
    if (adminPhone && apiKey) {
      const callmebotUrl = `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(adminPhone)}&text=${encodeURIComponent(whatsappMessage)}&apikey=${encodeURIComponent(apiKey)}`;
      fetch(callmebotUrl).catch(() => {});
    }

    // Email notification
    sendEmailNotification(order, settings).catch(() => {});

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

// ==================== Email Notification ====================

async function sendEmailNotification(order, settings) {
  if (!settings.emailEnabled || !settings.emailHost || !settings.emailUser || !settings.emailPass || !settings.emailTo) return;
  try {
    const nodemailer = require('nodemailer');
    const transporter = nodemailer.createTransport({
      host: settings.emailHost,
      port: settings.emailPort || 587,
      secure: false,
      auth: { user: settings.emailUser, pass: settings.emailPass }
    });
    const itemsHtml = (order.items || []).map(i =>
      `<tr><td>${i.title}</td><td>${i.quantity}</td><td>${(i.price * i.quantity).toFixed(2)} JOD</td></tr>`
    ).join('');
    await transporter.sendMail({
      from: settings.emailFrom || settings.emailUser,
      to: settings.emailTo,
      subject: `🌿 طلب جديد #${order.id} - قرنفل`,
      html: `
        <div dir="rtl" style="font-family:Tajawal,Cairo,sans-serif;max-width:600px;margin:0 auto">
          <h2 style="color:#1b5e20;">🌿 طلب جديد من قرنفل</h2>
          <p><strong>رقم الطلب:</strong> #${order.id}</p>
          <p><strong>العميل:</strong> ${order.name}</p>
          <p><strong>الهاتف:</strong> ${order.phone}</p>
          <p><strong>العنوان:</strong> ${order.address}</p>
          ${order.notes ? `<p><strong>ملاحظات:</strong> ${order.notes}</p>` : ''}
          <table style="width:100%;border-collapse:collapse;margin:16px 0">
            <tr style="background:#1b5e20;color:white"><th style="padding:8px;text-align:right">المنتج</th><th style="padding:8px">الكمية</th><th style="padding:8px">السعر</th></tr>
            ${itemsHtml}
          </table>
          <p><strong>المجموع الفرعي:</strong> ${order.subtotal} JOD</p>
          <p><strong>التوصيل:</strong> ${order.shipping} JOD</p>
          <p style="font-size:18px;font-weight:700;color:#1b5e20;"><strong>الإجمالي:</strong> ${order.total} JOD</p>
          <p style="color:#666;font-size:13px;margin-top:24px">🌐 قرنفل — متجر التراث الفلسطيني</p>
        </div>`
    });
    console.log(`[EMAIL] Notification sent for order #${order.id}`);
  } catch (err) {
    console.error(`[EMAIL] Failed: ${err.message}`);
  }
}

// ==================== Payment Config API ====================

app.get('/api/payment-config', async (req, res) => {
  try {
    let settings;
    if (USE_MONGO) settings = await getMongoSettings();
    else settings = readJSON(SETTINGS_FILE);
    res.json({
      paymentMethod: settings.paymentMethod || 'whatsapp',
      stripeKey: settings.stripeKey || '',
      paypalClientId: settings.paypalClientId || '',
      paypalEnabled: settings.paypalEnabled || false,
      shippingCost: settings.shippingCost || 2.00,
      freeShippingOver: settings.freeShippingOver || 30.00
    });
  } catch { res.json({ paymentMethod: 'whatsapp', shippingCost: 2.00, freeShippingOver: 30.00 }); }
});

// ==================== Dashboard Stats API ====================

app.get('/api/stats', async (req, res) => {
  try {
    let orders;
    if (USE_MONGO) orders = await Order.find().sort({ id: -1 }).lean();
    else orders = readJSON(ORDERS_FILE);
    const totalRevenue = orders.reduce((sum, o) => sum + (parseFloat(o.total) || 0), 0);
    const totalOrders = orders.length;
    const newOrders = orders.filter(o => o.status === 'جديد').length;
    const deliveredOrders = orders.filter(o => o.status === 'تم التوصيل').length;
    const todayOrders = orders.filter(o => {
      const today = new Date().toDateString();
      return new Date(o.createdAt).toDateString() === today;
    }).length;
    const paymentMethods = {};
    orders.forEach(o => {
      const method = o.paymentMethod || 'whatsapp';
      paymentMethods[method] = (paymentMethods[method] || 0) + 1;
    });
    res.json({ totalRevenue, totalOrders, newOrders, deliveredOrders, todayOrders, paymentMethods });
  } catch { res.json({ totalRevenue: 0, totalOrders: 0, newOrders: 0, deliveredOrders: 0, todayOrders: 0, paymentMethods: {} }); }
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
