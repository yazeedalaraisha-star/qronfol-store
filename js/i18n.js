const I18N = {
  ar: {
    lang: 'ar', dir: 'rtl', label: 'العربية',
    navProducts: 'المنتجات',
    navAbout: 'عن قرنفل',
    navContact: 'اتصل بنا',
    heroTitle: 'خيطٌ من تراث ..<br>وقلبٌ مع غزة',
    heroDesc: 'من الأردن إلى العالم، نقدم لك قطعًا تراثية تحكي قصص فلسطين',
    heroBtn: 'تسوق الآن',
    searchPlaceholder: 'ابحث عن منتج...',
    sortDefault: 'ترتيب: الافتراضي',
    sortAsc: 'السعر: من الأقل للأعلى',
    sortDesc: 'السعر: من الأعلى للأقل',
    cartEmpty: 'عربة التسوق فارغة',
    cartEmptySub: 'أضف منتجات لتتمكن من الطلب',
    total: 'المجموع',
    checkout: 'إتمام الطلب عبر واتساب',
    sectionProducts: 'منتجاتنا',
    sectionProductsSub: 'كل قطعة تحكي قصة تراث وتمسك بالأرد',
    sectionAbout: 'عن قرنفل',
    aboutCard1Title: 'تراث أصيل',
    aboutCard1Desc: 'نستلهم من تراثنا الفلسطيني العريق، ونقدمه بأيدي ماهرة تحافظ على هوية كل قطعة',
    aboutCard2Title: 'قلب مع غزة',
    aboutCard2Desc: 'جزء من أرباحنا يدعم صمود أهلنا في غزة، لأن القضية ما زالت حية في قلوبنا',
    aboutCard3Title: 'صنع في الأردن',
    aboutCard3Desc: 'ننتج ونشحن من الأردن، ونسعى لنشر التراث الفلسطيني في كل مكان',
    aboutMore: 'اقرأ قصتنا كاملة',
    footerTagline: 'خيطٌ من تراث .. وقلبٌ مع غزة 💚🇵🇸',
    contactTitle: 'تواصل معنا',
    contactSub: 'للطلبات والاستفسارات',
    noProducts: 'لا توجد منتجات مطابقة',
    addToCart: 'أضف إلى السلة',
    removeWishlist: 'إزالة من المفضلة',
    addWishlist: 'أضف إلى المفضلة',
    showWishlist: 'عرض المفضلة',
    outOfStock: 'نفذ من المخزون',
    storyBtn: 'القصة',
    relatedTitle: 'منتجات قد تعجبك',
    treeTitle: '🌿 غابتنا تنمو',
    treeDesc: 'كل طلب يزرع شجرة زيتون في غابتنا الرقمية',
    search: 'بحث',
    cancel: 'إلغاء',
    save: 'حفظ',
    delete: 'حذف',
    edit: 'تعديل',
    confirm: 'تأكيد',
  },
  en: {
    lang: 'en', dir: 'ltr', label: 'English',
    navProducts: 'Products',
    navAbout: 'About Qronfol',
    navContact: 'Contact Us',
    heroTitle: 'A Thread of Heritage..<br>A Heart with Gaza',
    heroDesc: 'From Jordan to the world, we offer heritage pieces that tell Palestine\'s stories',
    heroBtn: 'Shop Now',
    searchPlaceholder: 'Search products...',
    sortDefault: 'Sort: Default',
    sortAsc: 'Price: Low to High',
    sortDesc: 'Price: High to Low',
    cartEmpty: 'Your cart is empty',
    cartEmptySub: 'Add products to start shopping',
    total: 'Total',
    checkout: 'Checkout via WhatsApp',
    sectionProducts: 'Our Products',
    sectionProductsSub: 'Each piece tells a story of heritage',
    sectionAbout: 'About Qronfol',
    aboutCard1Title: 'Authentic Heritage',
    aboutCard1Desc: 'We draw inspiration from our rich Palestinian heritage, crafted by skilled hands preserving each piece\'s identity',
    aboutCard2Title: 'Heart with Gaza',
    aboutCard2Desc: 'Part of our profits supports our people in Gaza, because the cause still lives in our hearts',
    aboutCard3Title: 'Made in Jordan',
    aboutCard3Desc: 'We produce and ship from Jordan, spreading Palestinian heritage everywhere',
    aboutMore: 'Read our full story',
    footerTagline: 'A Thread of Heritage.. A Heart with Gaza 💚🇵🇸',
    contactTitle: 'Contact Us',
    contactSub: 'For orders and inquiries',
    noProducts: 'No matching products found',
    addToCart: 'Add to cart',
    removeWishlist: 'Remove from wishlist',
    addWishlist: 'Add to wishlist',
    showWishlist: 'Show wishlist',
    outOfStock: 'Out of stock',
    storyBtn: 'Story',
    relatedTitle: 'You may also like',
    treeTitle: '🌿 Our Forest Grows',
    treeDesc: 'Every order plants an olive tree in our digital forest',
    search: 'Search',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    confirm: 'Confirm',
  }
};

let currentLang = localStorage.getItem('qronfol_lang') || 'ar';

function getText(key) {
  return I18N[currentLang] && I18N[currentLang][key] !== undefined ? I18N[currentLang][key] : I18N['ar'][key] || key;
}

function switchLanguage(lang) {
  if (!I18N[lang]) return;
  currentLang = lang;
  localStorage.setItem('qronfol_lang', lang);
  document.documentElement.lang = lang;
  document.documentElement.dir = I18N[lang].dir;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    el.innerHTML = getText(key);
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    el.placeholder = getText(el.dataset.i18nPlaceholder);
  });
  const toggleBtn = document.getElementById('langToggle');
  if (toggleBtn) toggleBtn.textContent = currentLang === 'ar' ? 'EN' : 'AR';
}

function initI18n() {
  document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.getElementById('langToggle');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        switchLanguage(currentLang === 'ar' ? 'en' : 'ar');
      });
    }
    switchLanguage(currentLang);
  });
}

initI18n();
