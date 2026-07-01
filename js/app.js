document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initCart();
  initProducts();
  initCheckout();
  initSmoothScroll();
});

/* =====================
   Mobile Menu
   ===================== */
function initMobileMenu() {
  const toggle = document.getElementById('menuToggle');
  const mobileNav = document.getElementById('mobileNav');

  toggle.addEventListener('click', () => {
    mobileNav.classList.toggle('open');
    const icon = toggle.querySelector('i');
    icon.classList.toggle('fa-bars');
    icon.classList.toggle('fa-times');
  });

  document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', () => {
      mobileNav.classList.remove('open');
      const icon = toggle.querySelector('i');
      icon.classList.add('fa-bars');
      icon.classList.remove('fa-times');
    });
  });

  document.addEventListener('click', (e) => {
    if (!toggle.contains(e.target) && !mobileNav.contains(e.target)) {
      mobileNav.classList.remove('open');
      const icon = toggle.querySelector('i');
      icon.classList.add('fa-bars');
      icon.classList.remove('fa-times');
    }
  });
}

/* =====================
   Toast Notification
   ===================== */
function showToast(message, icon = 'fa-check-circle') {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toastMessage');
  const toastIcon = toast.querySelector('i');

  toastIcon.className = 'fas ' + icon;
  toastMsg.textContent = message;
  toast.classList.add('show');

  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 2800);
}

/* =====================
   Cart UI
   ===================== */
function initCart() {
  const cartBtn = document.getElementById('cartBtn');
  const cartSidebar = document.getElementById('cartSidebar');
  const cartOverlay = document.getElementById('cartOverlay');
  const cartClose = document.getElementById('cartClose');
  const countEl = document.getElementById('cartCount');
  const itemsEl = document.getElementById('cartItems');
  const footerEl = document.getElementById('cartFooter');
  const totalEl = document.getElementById('cartTotal');

  function openCart() {
    cartSidebar.classList.add('open');
    cartOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeCart() {
    cartSidebar.classList.remove('open');
    cartOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  cartBtn.addEventListener('click', openCart);
  cartClose.addEventListener('click', closeCart);
  cartOverlay.addEventListener('click', closeCart);

  function renderCart() {
    const items = cart.getItems();
    const count = cart.getItemCount();
    countEl.textContent = count;

    if (items.length === 0) {
      itemsEl.innerHTML = `
        <div class="cart-empty">
          <i class="fas fa-shopping-bag"></i>
          <p>عربة التسوق فارغة</p>
          <span>أضف منتجات لتتمكن من الطلب</span>
        </div>
      `;
      footerEl.style.display = 'none';
      return;
    }

    footerEl.style.display = 'flex';
    let html = '';
    items.forEach(item => {
      html += `
        <div class="cart-item" data-id="${item.id}">
          <div class="cart-item-image">
            <i class="${item.icon || 'fa-solid fa-box'}"></i>
          </div>
          <div class="cart-item-info">
            <div class="cart-item-title">${item.title}</div>
            <div class="cart-item-price">${formatPrice(item.price)}</div>
            <div class="cart-item-actions">
              <button class="qty-btn" onclick="cart.updateQuantity(${item.id}, -1)">−</button>
              <span class="cart-item-qty">${item.quantity}</span>
              <button class="qty-btn" onclick="cart.updateQuantity(${item.id}, 1)">+</button>
              <button class="remove-item" onclick="cart.removeItem(${item.id})">
                <i class="fas fa-trash-alt"></i>
              </button>
            </div>
          </div>
        </div>
      `;
    });
    itemsEl.innerHTML = html;
    totalEl.textContent = formatPrice(cart.getTotal());
  }

  cart.onUpdate(renderCart);
  renderCart();
}

/* =====================
   Products
   ===================== */
function initProducts() {
  const grid = document.getElementById('productsGrid');
  const loading = document.getElementById('productsLoading');
  const filterContainer = document.getElementById('categoriesFilter');

  let activeCategory = 'all';

  function renderProducts(category) {
    const filtered = category === 'all'
      ? PRODUCTS
      : PRODUCTS.filter(p => p.category === category);

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div style="grid-column:1/-1;text-align:center;padding:60px 0;color:var(--text-light)">
          <i class="fas fa-box-open" style="font-size:48px;margin-bottom:16px;color:var(--cream-dark)"></i>
          <p style="font-size:18px">لا توجد منتجات في هذا القسم</p>
        </div>
      `;
      return;
    }

    let html = '';
    filtered.forEach(product => {
      const badgeClass = product.badge ? `badge-${product.badge}` : '';
      const badgeLabel = product.badge ? (BADGE_LABELS[product.badge] || '') : '';
      const oldPriceHtml = product.oldPrice
        ? `<span class="old-price">${formatPrice(product.oldPrice)}</span>`
        : '';

      const imageHtml = product.image
        ? `<img src="${product.image}" alt="${product.title}" class="product-img" onerror="handleImageError(this)"><div class="product-image-placeholder" style="display:none"><i class="${getProductIcon(product.icon)}"></i></div>`
        : `<div class="product-image-placeholder"><i class="${getProductIcon(product.icon)}"></i></div>`;

      html += `
        <div class="product-card" data-id="${product.id}">
          <div class="product-image">
            ${imageHtml}
            ${badgeLabel ? `<span class="product-badge ${badgeClass}">${badgeLabel}</span>` : ''}
          </div>
          <div class="product-body">
            <span class="product-category">${CATEGORIES[product.category] || product.category}</span>
            <h3 class="product-title" title="${product.titleEn || ''}">${product.title}</h3>
            <p class="product-description">${product.description}</p>
            <div class="product-footer">
              <span class="product-price">${oldPriceHtml}${formatPrice(product.price)}</span>
              <button class="add-to-cart-btn" onclick="handleAddToCart(${product.id})" title="أضف إلى السلة">
                <i class="fas fa-plus"></i>
              </button>
            </div>
          </div>
        </div>
      `;
    });
    grid.innerHTML = html;

    setTimeout(() => {
      loading.style.display = 'none';
      grid.style.opacity = '1';
    }, 150);
  }

  // Category filter
  filterContainer.addEventListener('click', (e) => {
    const btn = e.target.closest('.cat-btn');
    if (!btn) return;

    filterContainer.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    activeCategory = btn.dataset.category;
    renderProducts(activeCategory);
  });

  // Initial render with loading
  loading.style.display = 'block';
  grid.style.opacity = '0';
  renderProducts('all');
}

function handleImageError(img) {
  img.style.display = 'none';
  const placeholder = img.parentElement.querySelector('.product-image-placeholder');
  if (placeholder) placeholder.style.display = 'flex';
}

/* =====================
   Add to Cart Handler
   ===================== */
function handleAddToCart(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  cart.addItem(product);
  showToast(`تمت إضافة "${product.title}" إلى السلة!`);
}

/* =====================
   Checkout via WhatsApp
   ===================== */
function initCheckout() {
  const checkoutBtn = document.getElementById('checkoutBtn');
  const modal = document.getElementById('checkoutModal');
  const overlay = document.getElementById('checkoutOverlay');
  const closeBtn = document.getElementById('checkoutModalClose');
  const orderItemsEl = document.getElementById('checkoutOrderItems');
  const totalEl = document.getElementById('checkoutModalTotal');
  const form = document.getElementById('checkoutForm');

  function openModal() {
    const items = cart.getItems();
    if (items.length === 0) {
      showToast('عربة التسوق فارغة! أضف منتجات أولاً', 'fa-exclamation-circle');
      return;
    }

    const itemsHtml = items.map(item =>
      `• ${item.title} x${item.quantity} = ${formatPrice(item.price * item.quantity)}`
    ).join('<br>');
    orderItemsEl.innerHTML = itemsHtml;
    totalEl.textContent = formatPrice(cart.getTotal());

    modal.classList.add('open');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('open');
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  checkoutBtn.addEventListener('click', openModal);
  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', closeModal);
}

function submitCheckout(e) {
  e.preventDefault();

  const name = document.getElementById('checkoutName').value.trim();
  const phone = document.getElementById('checkoutPhone').value.trim();
  const address = document.getElementById('checkoutAddress').value.trim();
  const notes = document.getElementById('checkoutNotes').value.trim();

  const items = cart.getItems();
  if (items.length === 0) {
    showToast('عربة التسوق فارغة!', 'fa-exclamation-circle');
    return false;
  }

  const orderItems = items.map(item =>
    `• ${item.title} x${item.quantity} = ${formatPrice(item.price * item.quantity)}`
  ).join('\n');

  const total = formatPrice(cart.getTotal());

  const message = encodeURIComponent(
    '🌿 *طلب جديد من قرنفل* 🌿\n\n' +
    '━━━━━━━━━━━━━━━━\n' +
    '*معلومات العميل:*\n' +
    `👤 الاسم: ${name}\n` +
    `📞 الهاتف: ${phone}\n` +
    `📍 العنوان: ${address}\n` +
    (notes ? `📝 ملاحظات: ${notes}\n` : '') +
    '━━━━━━━━━━━━━━━━\n' +
    '*المنتجات:*\n' +
    orderItems +
    '\n━━━━━━━━━━━━━━━━\n' +
    `💵 *المجموع:* ${total}\n` +
    '━━━━━━━━━━━━━━━━\n' +
    '🇵🇸 خيطٌ من تراث .. وقلبٌ مع غزة'
  );

  window.open(`https://wa.me/962792067277?text=${message}`, '_blank');

  document.getElementById('checkoutModal').classList.remove('open');
  document.getElementById('checkoutOverlay').classList.remove('open');
  document.body.style.overflow = '';
  cart.clear();
  showToast('تم إرسال طلبك عبر واتساب! ✅');

  return false;
}

/* =====================
   Smooth Scroll
   ===================== */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

/* =====================
   Scroll-based nav highlight
   ===================== */
window.addEventListener('scroll', () => {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  let current = '';
  sections.forEach(section => {
    const top = section.offsetTop - 120;
    if (window.scrollY >= top) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) {
      link.classList.add('active');
    }
  });
});
