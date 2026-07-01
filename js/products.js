const PRODUCTS_STATIC = [
  {
    id: 1,
    title: 'وشاح الكوفية الفلسطينية',
    titleEn: 'Palestinian Keffiyeh',
    description: 'كوفية فلسطينية أصلية بتطريز يدوي، رمز التراث والهوية',
    price: 15.00,
    oldPrice: null,
    category: 'accessories',
    badge: 'best',
    icon: 'fa-regular fa-hand-peace',
    image: '', tags: ['handmade', 'gift']
  },
  {
    id: 2,
    title: 'سلسلة مفاتيح "غزة في القلب"',
    titleEn: '"Gaza in Heart" Keychain',
    description: 'سلسلة مفاتيح خشبية محفورة بعبارة "غزة في القلب"',
    price: 8.00,
    oldPrice: null,
    category: 'accessories',
    badge: '',
    icon: 'fa-solid fa-key',
    image: '', tags: ['gift']
  },
  {
    id: 3,
    title: 'طقم تطريز فلسطيني',
    titleEn: 'Palestinian Embroidery Kit',
    description: 'طقم تطريز متكامل يحتوي على خيوط وإبرة وقطن للتطريز',
    price: 25.00,
    oldPrice: 30.00,
    category: 'embroidery',
    badge: 'sale',
    icon: 'fa-solid fa-needle',
    image: ''
  },
  {
    id: 4,
    title: 'برواز تراثي "القدس"',
    titleEn: '"Jerusalem" Heritage Frame',
    description: 'برواز بقبة الصخرة مصنوع يدويًا بتفاصيل تراثية',
    price: 22.00,
    oldPrice: null,
    category: 'decor',
    badge: 'new',
    icon: 'fa-regular fa-building',
    image: ''
  },
  {
    id: 5,
    title: 'تيشيرت "فلسطين"',
    titleEn: '"Palestine" T-Shirt',
    description: 'تيشيرت قطني بطباعة عالية الجودة لخريطة فلسطين',
    price: 18.00,
    oldPrice: null,
    category: 'apparel',
    badge: '',
    icon: 'fa-solid fa-shirt',
    image: ''
  },
  {
    id: 6,
    title: 'سوار الزيتون',
    titleEn: 'Olive Bracelet',
    description: 'سوار جلدي بحبة زيتون فضية، رمز الأرض المباركة',
    price: 12.00,
    oldPrice: null,
    category: 'accessories',
    badge: '',
    icon: 'fa-solid fa-tree',
    image: ''
  },
  {
    id: 7,
    title: 'قطعة ديكور "مفتاح العودة"',
    titleEn: '"Key of Return" Decor',
    description: 'مفتاح العودة الخشبي المطلي بالذهب، رمز الحق الفلسطيني',
    price: 18.00,
    oldPrice: null,
    category: 'decor',
    badge: 'best',
    icon: 'fa-solid fa-key',
    image: ''
  },
  {
    id: 8,
    title: 'عباية مطرزة',
    titleEn: 'Embroidered Abaya',
    description: 'عباية سوداء بتطريز فلسطيني أصيل على الأكمام',
    price: 45.00,
    oldPrice: 55.00,
    category: 'apparel',
    badge: 'sale',
    icon: 'fa-solid fa-user-tie',
    image: ''
  },
  {
    id: 9,
    title: 'حقيبة "تراث"',
    titleEn: '"Turath" Bag',
    description: 'حقيبة يد قماشية بتطريز فلسطيني ورسومات تراثية',
    price: 20.00,
    oldPrice: null,
    category: 'accessories',
    badge: '',
    icon: 'fa-solid fa-bag-shopping',
    image: ''
  },
  {
    id: 10,
    title: 'magnet الثورة',
    titleEn: 'Revolution Magnet',
    description: 'مغناطيس ثلاجة بتصميم علم فلسطين ورسالة دعم',
    price: 5.00,
    oldPrice: null,
    category: 'decor',
    badge: 'new',
    icon: 'fa-solid fa-thumbtack',
    image: ''
  },
  {
    id: 11,
    title: 'طاقية مطرزة',
    titleEn: 'Embroidered Cap',
    description: 'طاقية بيسبول بتطريز أسود اللون وزهرة فلسطين',
    price: 14.00,
    oldPrice: null,
    category: 'apparel',
    badge: '',
    icon: 'fa-solid fa-hat-cowboy',
    image: ''
  },
  {
    id: 12,
    title: 'لوحة جدارية "الأقصى"',
    titleEn: '"Al-Aqsa" Wall Art',
    description: 'لوحة جدارية للمسجد الأقصى بتقنية الرسم الزيتي',
    price: 30.00,
    oldPrice: null,
    category: 'decor',
    badge: '',
    icon: 'fa-regular fa-image',
    image: ''
  },
  {
    id: 13,
    title: 'مسبحة خشب الزيتون',
    titleEn: 'Olive Wood Rosary',
    description: 'مسبحة من خشب الزيتون المقدس من فلسطين',
    price: 10.00,
    oldPrice: null,
    category: 'accessories',
    badge: '',
    icon: 'fa-solid fa-dharmachakra',
    image: ''
  },
  {
    id: 14,
    title: 'طقم كاسات "تراثي"',
    titleEn: 'Heritage Cup Set',
    description: 'طقم 4 كاسات سيراميك برسومات تراثية فلسطينية',
    price: 16.00,
    oldPrice: null,
    category: 'decor',
    badge: '',
    icon: 'fa-solid fa-mug-saucer',
    image: ''
  },
  {
    id: 15,
    title: 'إيشارب حرير مطبوع',
    titleEn: 'Printed Silk Scarf',
    description: 'إيشارب حريري بطبعة علم فلسطين وتصاميم تراثية',
    price: 12.00,
    oldPrice: null,
    category: 'apparel',
    badge: 'new',
    icon: 'fa-solid fa-scarf',
    image: ''
  },
  {
    id: 16,
    title: 'قطعة ديكور "أرضنا"',
    titleEn: '"Our Land" Decor Piece',
    description: 'مجسم خشبي لخريطة فلسطين مع أسماء المدن',
    price: 28.00,
    oldPrice: null,
    category: 'decor',
    badge: 'best',
    icon: 'fa-regular fa-map',
    image: ''
  }
];

let PRODUCTS = [];
const API_URL = window.location.origin + '/api/products';

function loadProducts() {
  try {
    const saved = localStorage.getItem('qronfol_products');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return PRODUCTS_STATIC;
}

function saveProducts(products) {
  try {
    localStorage.setItem('qronfol_products', JSON.stringify(products));
  } catch {}
  if (window.location.protocol === 'http:' || window.location.protocol === 'https:') {
    fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(products)
    }).catch(() => {});
  }
}

async function fetchProductsFromServer() {
  try {
    const res = await fetch(API_URL);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        PRODUCTS.length = 0;
        PRODUCTS.push(...data);
        document.dispatchEvent(new CustomEvent('products:loaded'));
        return;
      }
    }
  } catch {}
  const local = loadProducts();
  PRODUCTS.length = 0;
  PRODUCTS.push(...local);
  document.dispatchEvent(new CustomEvent('products:loaded'));
}

// Try server first, fallback to local
if (window.location.protocol === 'http:' || window.location.protocol === 'https:') {
  fetchProductsFromServer();
} else {
  const local = loadProducts();
  PRODUCTS.length = 0;
  PRODUCTS.push(...local);
  document.dispatchEvent(new CustomEvent('products:loaded'));
}

const CATEGORIES = {
  all: 'الكل',
  accessories: 'إكسسوارات',
  embroidery: 'تطريز',
  decor: 'ديكور',
  apparel: 'أزياء'
};

const BADGE_LABELS = {
  new: 'جديد',
  sale: 'تخفيض',
  best: 'الأكثر مبيعاً'
};

const TAG_LABELS = {
  gift: '🎁 هدية',
  sale: '🔥 مخفض',
  free_shipping: '🚚 توصيل مجاني',
  limited: '⏳ كمية محدودة',
  handmade: '✋ صنع يدوي'
};

function formatPrice(price) {
  return price.toFixed(2) + ' JOD';
}

function getProductIcon(icon) {
  return icon || 'fa-solid fa-box';
}
