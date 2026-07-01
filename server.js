const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const https = require('https');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data', 'products.json');
const SETTINGS_FILE = path.join(__dirname, 'data', 'settings.json');
const ORDERS_FILE = path.join(__dirname, 'data', 'orders.json');

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static(__dirname));

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

if (!fs.existsSync(DATA_FILE)) writeJSON(DATA_FILE, getDefaultProducts());
if (!fs.existsSync(SETTINGS_FILE)) writeJSON(SETTINGS_FILE, { whatsappNumber: '', callmebotApiKey: '', shippingCost: 0, freeShippingOver: 0 });
if (!fs.existsSync(ORDERS_FILE)) writeJSON(ORDERS_FILE, []);

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

app.get('/api/products', (req, res) => {
  try { res.json(readJSON(DATA_FILE)); }
  catch { res.json(getDefaultProducts()); }
});

app.post('/api/products', (req, res) => {
  try {
    const products = req.body;
    if (!Array.isArray(products)) return res.status(400).json({ error: 'Invalid data format' });
    writeJSON(DATA_FILE, products);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/settings', (req, res) => {
  try { res.json(readJSON(SETTINGS_FILE)); }
  catch { res.json({ whatsappNumber: '', callmebotApiKey: '', shippingCost: 0, freeShippingOver: 0 }); }
});

app.post('/api/settings', (req, res) => {
  try { writeJSON(SETTINGS_FILE, req.body); res.json({ success: true }); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/order', (req, res) => {
  try {
    const { name, phone, address, notes, items, total } = req.body;
    const settings = readJSON(SETTINGS_FILE);
    const adminPhone = settings.whatsappNumber;
    const apiKey = settings.callmebotApiKey;

    const order = {
      id: Date.now(),
      name, phone, address, notes, items, total,
      createdAt: new Date().toISOString(),
      status: 'جديد'
    };

    // Save order to orders log
    const orders = readJSON(ORDERS_FILE);
    orders.unshift(order);
    writeJSON(ORDERS_FILE, orders);
    console.log(`[ORDER] #${order.id} — ${name} — ${total} JOD`);

    // Build WhatsApp message
    const orderItems = items.map(item =>
      `• ${item.title} x${item.quantity} = ${(item.price * item.quantity).toFixed(2)} JOD`
    ).join('\n');

    const whatsappMessage =
      `🆔 *رقم الطلب: ${order.id}*\n` +
      '🌿 *طلب جديد من قرنفل* 🌿\n' +
      '━━━━━━━━━━━━━━━━\n' +
      '*معلومات العميل:*\n' +
      `👤 الاسم: ${name}\n` +
      `📞 الهاتف: ${phone}\n` +
      `📍 العنوان: ${address}\n` +
      (notes ? `📝 ملاحظات: ${notes}\n` : '') +
      '━━━━━━━━━━━━━━━━\n' +
      '*المنتجات:*\n' +
      orderItems + '\n' +
      '━━━━━━━━━━━━━━━━\n' +
      `💵 *المجموع:* ${total} JOD`;

    const fallbackUrl = `https://wa.me/${adminPhone || '962792067277'}?text=${encodeURIComponent(whatsappMessage)}`;

    // Respond immediately so the client doesn't time out
    res.json({ success: true, method: 'callmebot', sent: false, orderId: order.id, fallbackUrl });

    // Try CallMeBot in background (non-blocking, fire-and-forget)
    if (adminPhone && apiKey) {
      const callmebotUrl = `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(adminPhone)}&text=${encodeURIComponent(whatsappMessage)}&apikey=${encodeURIComponent(apiKey)}`;
      fetch(callmebotUrl).catch(() => {});
    }

  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/orders', (req, res) => {
  try { res.json(readJSON(ORDERS_FILE)); }
  catch { res.json([]); }
});

app.put('/api/orders/:id', (req, res) => {
  try {
    const orders = readJSON(ORDERS_FILE);
    const idx = orders.findIndex(o => o.id == req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Order not found' });
    orders[idx] = { ...orders[idx], ...req.body };
    writeJSON(ORDERS_FILE, orders);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Notify customer via CallMeBot when order status changes
app.post('/api/orders/:id/notify', (req, res) => {
  try {
    const orders = readJSON(ORDERS_FILE);
    const order = orders.find(o => o.id == req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });

    const settings = readJSON(SETTINGS_FILE);
    const apiKey = settings.callmebotApiKey;

    if (!apiKey || !order.phone) {
      return res.json({ success: false, error: 'No API key or customer phone' });
    }

    const message =
      `🌿 *قرنفل - تحديث الطلب #${order.id}* 🌿\n` +
      `━━━━━━━━━━━━━━━━\n` +
      `🔄 *الحالة:* ${order.status}\n` +
      `━━━━━━━━━━━━━━━━\n` +
      `شكراً لطلبك من قرنفل! سنتواصل معك قريباً 💚🇵🇸`;

    const customerPhone = order.phone.replace(/^0/, '962');
    const url = `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(customerPhone)}&text=${encodeURIComponent(message)}&apikey=${encodeURIComponent(apiKey)}`;

    https.get(url, (response) => {
      let data = '';
      response.on('data', chunk => data += chunk);
      response.on('end', () => res.json({ success: true, response: data }));
    }).on('error', () => res.json({ success: false }));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// PDF Report — returns HTML table for printing
app.get('/api/orders/report', (req, res) => {
  try {
    const orders = readJSON(ORDERS_FILE);
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

app.listen(PORT, () => {
  console.log(`\n  🌿 Qronfol Store Server`);
  console.log(`  ─────────────────────`);
  console.log(`  🏪  المتجر:  http://localhost:${PORT}`);
  console.log(`  ⚙️  الأدمن:  http://localhost:${PORT}/admin.html`);
  console.log(`  📡 API:     http://localhost:${PORT}/api/products`);
  console.log(`  📡 Orders:  http://localhost:${PORT}/api/orders`);
  console.log(`\n`);
});
