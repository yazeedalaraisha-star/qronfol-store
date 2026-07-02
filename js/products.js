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
    image: 'https://images.unsplash.com/photo-1590041794748-2d8eb73a571c?w=400&h=400&fit=crop&auto=format&q=80', tags: ['handmade', 'gift']
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
    image: 'https://images.unsplash.com/photo-1590041794748-2d8eb73a571c?w=400&h=400&fit=crop&auto=format&q=80', tags: ['gift']
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
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop&auto=format&q=80'
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
    image: 'https://images.unsplash.com/photo-1601024448722-5b38a2f9ceed?w=400&h=400&fit=crop&auto=format&q=80'
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
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=400&h=400&fit=crop&auto=format&q=80'
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
    image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&h=400&fit=crop&auto=format&q=80'
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
    image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&h=400&fit=crop&auto=format&q=80'
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
    image: 'https://images.unsplash.com/photo-1574027551686-5e80a7a6d72e?w=400&h=400&fit=crop&auto=format&q=80'
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
    image: 'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=400&h=400&fit=crop&auto=format&q=80'
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
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=400&fit=crop&auto=format&q=80'
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
    image: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400&h=400&fit=crop&auto=format&q=80'
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
    image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400&h=400&fit=crop&auto=format&q=80'
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
    image: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=400&h=400&fit=crop&auto=format&q=80'
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
    image: 'https://images.unsplash.com/photo-1612966878609-5e055b468499?w=400&h=400&fit=crop&auto=format&q=80'
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
    image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400&h=400&fit=crop&auto=format&q=80'
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
    image: 'https://images.unsplash.com/photo-1601370690183-1c7796ecec61?w=400&h=400&fit=crop&auto=format&q=80'
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
  PRODUCTS.length = 0;
  PRODUCTS.push(...JSON.parse(JSON.stringify(PRODUCTS_STATIC)));
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

