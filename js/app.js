document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initCart();
  initProducts();
  initCheckout();
  initSmoothScroll();
});

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

function showToast(message, icon = 'fa-check-circle') {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toastMessage');
  const toastIcon = toast.querySelector('i');
  toastIcon.className = 'fas ' + icon;
  toastMsg.textContent = message;
  toast.classList.add('show');
  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => toast.classList.remove('show'), 2800);
}

function initCart() {
  const cartBtn = document.getElementById('cartBtn');
  const cartSidebar = document.getElementById('cartSidebar');
  const cartOverlay = document.getElementById('cartOverlay');
  const cartClose = document.getElementById('cartClose');
  const countEl = document.getElementById('cartCount');
  const itemsEl = document.getElementById('cartItems');
  const footerEl = document.getElementById('cartFooter');
  const totalEl = document.getElementById('cartTotal');

  function openCart() { cartSidebar.classList.add('open'); cartOverlay.classList.add('open'); document.body.style.overflow = 'hidden'; }
  function closeCart() { cartSidebar.classList.remove('open'); cartOverlay.classList.remove('open'); document.body.style.overflow = ''; }

  cartBtn.addEventListener('click', openCart);
  cartClose.addEventListener('click', closeCart);
  cartOverlay.addEventListener('click', closeCart);

  function renderCart() {
    const items = cart.getItems();
    countEl.textContent = cart.getItemCount();
    if (items.length === 0) {
      itemsEl.innerHTML = '<div class="cart-empty"><i class="fas fa-shopping-bag"></i><p>عربة التسوق فارغة</p><span>أضف منتجات لتتمكن من الطلب</span></div>';
      footerEl.style.display = 'none';
      return;
    }
    footerEl.style.display = 'flex';
    itemsEl.innerHTML = items.map(item => `
      <div class="cart-item" data-id="${item.id}">
        <div class="cart-item-image"><i class="${item.icon || 'fa-solid fa-box'}"></i></div>
        <div class="cart-item-info">
          <div class="cart-item-title">${item.title}</div>
          <div class="cart-item-price">${formatPrice(item.price)}</div>
          <div class="cart-item-actions">
            <button class="qty-btn" onclick="cart.updateQuantity(${item.id}, -1)">−</button>
            <span class="cart-item-qty">${item.quantity}</span>
            <button class="qty-btn" onclick="cart.updateQuantity(${item.id}, 1)">+</button>
            <button class="remove-item" onclick="cart.removeItem(${item.id})"><i class="fas fa-trash-alt"></i></button>
          </div>
        </div>
      </div>
    `).join('');
    totalEl.textContent = formatPrice(cart.getTotal());
  }

  cart.onUpdate(renderCart);
  renderCart();
}

let activeCategory = 'all';
let searchQuery = '';
let sortValue = '';

function initProducts() {
  const grid = document.getElementById('productsGrid');
  const loading = document.getElementById('productsLoading');
  const filterContainer = document.getElementById('categoriesFilter');

  window.renderProducts = function(category) {
    if (category !== undefined) activeCategory = category;
    let filtered = PRODUCTS.filter(p => {
      if (activeCategory !== 'all' && p.category !== activeCategory) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const match = (p.title && p.title.toLowerCase().includes(q)) ||
                      (p.titleEn && p.titleEn.toLowerCase().includes(q)) ||
                      (p.description && p.description.toLowerCase().includes(q));
        if (!match) return false;
      }
      return true;
    });

    if (sortValue === 'price-asc') filtered.sort((a, b) => a.price - b.price);
    else if (sortValue === 'price-desc') filtered.sort((a, b) => b.price - a.price);

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div style="grid-column:1/-1;text-align:center;padding:60px 0;color:var(--text-light)">
          <i class="fas fa-box-open" style="font-size:48px;margin-bottom:16px;color:var(--cream-dark)"></i>
          <p style="font-size:18px">لا توجد منتجات مطابقة</p>
        </div>`;
      return;
    }

    const shareProduct = (p) => {
      const url = encodeURIComponent(window.location.origin + '/?product=' + p.id);
      const text = encodeURIComponent(`🌿 ${p.title} - ${formatPrice(p.price)}`);
      return `
        <div class="product-share">
          <a href="https://wa.me/?text=${text}%20${url}" target="_blank" title="مشاركة على واتساب"><i class="fab fa-whatsapp"></i></a>
          <a href="https://www.facebook.com/sharer/sharer.php?u=${url}" target="_blank" title="مشاركة على فيسبوك"><i class="fab fa-facebook"></i></a>
        </div>`;
    };

    grid.innerHTML = filtered.map(product => {
      const badgeClass = product.badge ? `badge-${product.badge}` : '';
      const badgeLabel = product.badge ? (BADGE_LABELS[product.badge] || '') : '';
      const oldPriceHtml = product.oldPrice ? `<span class="old-price">${formatPrice(product.oldPrice)}</span>` : '';
      const imageHtml = product.image
        ? `<img src="${product.image}" alt="${product.title}" class="product-img" onerror="handleImageError(this)"><div class="product-image-placeholder" style="display:none"><i class="${getProductIcon(product.icon)}"></i></div>`
        : `<div class="product-image-placeholder"><i class="${getProductIcon(product.icon)}"></i></div>`;

      const isOutOfStock = product.stock === 0;
      const addBtnHtml = isOutOfStock
        ? `<span class="out-of-stock-badge">نفذ من المخزون</span>`
        : `<button class="add-to-cart-btn" onclick="handleAddToCart(${product.id})" title="أضف إلى السلة"><i class="fas fa-plus"></i></button>`;

      const tagsHtml = (product.tags && product.tags.length)
        ? `<div class="product-tags">${product.tags.map(t => `<span class="product-tag">${TAG_LABELS[t] || t}</span>`).join('')}</div>`
        : '';

      return `
        <div class="product-card" data-id="${product.id}">
          <div class="product-image">
            ${imageHtml}
            ${badgeLabel ? `<span class="product-badge ${badgeClass}">${badgeLabel}</span>` : ''}
            ${isOutOfStock ? '<span class="product-badge badge-out">نفذ</span>' : ''}
          </div>
          <div class="product-body">
            <span class="product-category">${CATEGORIES[product.category] || product.category}</span>
            <h3 class="product-title" title="${product.titleEn || ''}">${product.title}</h3>
            ${tagsHtml}
            <p class="product-description">${product.description}</p>
            <div class="product-footer">
              <span class="product-price">${oldPriceHtml}${formatPrice(product.price)}</span>
              <div class="product-footer-left">
                ${addBtnHtml}
              </div>
            </div>
            ${shareProduct(product)}
          </div>
        </div>`;
    }).join('');

    loading.style.display = 'none';
    grid.style.opacity = '1';
    if (window.renderRelatedProducts) window.renderRelatedProducts();
  };

  window.renderRelatedProducts = function(productId) {
    const container = document.getElementById('relatedProducts');
    const grid = document.getElementById('relatedGrid');
    if (!container || !grid) return;
    const current = productId ? PRODUCTS.find(p => p.id === productId) : null;
    const cat = current ? current.category : activeCategory;
    let candidates = PRODUCTS.filter(p => p.category === cat && p.id !== (productId || -1));
    if (candidates.length === 0) candidates = PRODUCTS.filter(p => p.id !== (productId || -1));
    const related = candidates.slice(0, 4);
    if (related.length === 0) { container.style.display = 'none'; return; }
    container.style.display = 'block';
    grid.innerHTML = related.map(p => {
      const imageHtml = p.image
        ? `<img src="${p.image}" alt="${p.title}" class="product-img" onerror="this.style.display='none'">`
        : `<div class="product-image-placeholder"><i class="${p.icon || 'fa-solid fa-box'}"></i></div>`;
      return `<div class="product-card" data-id="${p.id}">
        <div class="product-image">${imageHtml}</div>
        <div class="product-body">
          <span class="product-category">${CATEGORIES[p.category] || p.category}</span>
          <h3 class="product-title">${p.title}</h3>
          <div class="product-footer">
            <span class="product-price">${formatPrice(p.price)}</span>
            <button class="add-to-cart-btn" onclick="handleAddToCart(${p.id})"><i class="fas fa-plus"></i></button>
          </div>
        </div>
      </div>`;
    }).join('');
  };

  filterContainer.addEventListener('click', (e) => {
    const btn = e.target.closest('.cat-btn');
    if (!btn) return;
    filterContainer.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeCategory = btn.dataset.category;
    window.renderProducts();
  });

  loading.style.display = 'block';
  grid.style.opacity = '0';
  window.renderProducts('all');
}

document.addEventListener('products:loaded', () => {
  const loading = document.getElementById('productsLoading');
  const grid = document.getElementById('productsGrid');
  if (loading && grid) window.renderProducts();
  const countEl = document.getElementById('productsCount');
  if (countEl) countEl.textContent = PRODUCTS.length;
  if (window.renderRelatedProducts) window.renderRelatedProducts();
});

function handleSearch() {
  searchQuery = document.getElementById('searchInput').value;
  window.renderProducts();
}

function handleSort() {
  sortValue = document.getElementById('sortSelect').value;
  window.renderProducts();
}

function handleImageError(img) {
  img.style.display = 'none';
  const placeholder = img.parentElement.querySelector('.product-image-placeholder');
  if (placeholder) placeholder.style.display = 'flex';
}

function handleAddToCart(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product || product.stock === 0) return;
  cart.addItem(product);
  showToast(`تمت إضافة "${product.title}" إلى السلة!`);
}

function initCheckout() {
  const checkoutBtn = document.getElementById('checkoutBtn');
  const modal = document.getElementById('checkoutModal');
  const overlay = document.getElementById('checkoutOverlay');
  const closeBtn = document.getElementById('checkoutModalClose');
  const orderItemsEl = document.getElementById('checkoutOrderItems');
  const totalEl = document.getElementById('checkoutModalTotal');

  function openModal() {
    const items = cart.getItems();
    if (items.length === 0) { showToast('عربة التسوق فارغة! أضف منتجات أولاً', 'fa-exclamation-circle'); return; }
    orderItemsEl.innerHTML = items.map(item =>
      `• ${item.title} x${item.quantity} = ${formatPrice(item.price * item.quantity)}`
    ).join('<br>');
    totalEl.textContent = formatPrice(cart.getTotal());
    document.getElementById('checkoutOrderId').textContent = '';
    modal.classList.add('open');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() { modal.classList.remove('open'); overlay.classList.remove('open'); document.body.style.overflow = ''; }

  checkoutBtn.addEventListener('click', openModal);
  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', closeModal);
}

async function submitCheckout(e) {
  e.preventDefault();
  const name = document.getElementById('checkoutName').value.trim();
  const phone = document.getElementById('checkoutPhone').value.trim();
  const address = document.getElementById('checkoutAddress').value.trim();
  const notes = document.getElementById('checkoutNotes').value.trim();
  const items = cart.getItems();

  if (items.length === 0) { showToast('عربة التسوق فارغة!', 'fa-exclamation-circle'); return false; }

  const submitBtn = e.target.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الإرسال...';

  const orderData = {
    name, phone, address, notes,
    items: items.map(i => ({ title: i.title, quantity: i.quantity, price: i.price })),
    total: cart.getTotal().toFixed(2)
  };

  try {
    console.log('Submitting order...', orderData);
    const res = await fetch('/api/order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });

    if (res.ok) {
      const data = await res.json();
      console.log('Order response:', data);
      document.getElementById('checkoutModal').classList.remove('open');
      document.getElementById('checkoutOverlay').classList.remove('open');
      document.body.style.overflow = '';

      sessionStorage.setItem('lastOrder', JSON.stringify({
        id: data.orderId,
        name, phone, address, notes,
        items: items.map(i => ({ title: i.title, quantity: i.quantity, price: i.price })),
        total: cart.getTotal().toFixed(2),
        createdAt: new Date().toISOString()
      }));

      cart.clear();

      // Open WhatsApp so customer can send order to admin manually
      if (data.fallbackUrl) {
        window.open(data.fallbackUrl, '_blank');
      }

      window.location.href = '/order-confirmed.html?id=' + data.orderId;
    } else {
      const errText = await res.text().catch(() => '');
      console.error('Server error:', res.status, errText);
      showToast('حدث خطأ في السيرفر: ' + (errText.substring(0, 50) || res.status), 'fa-exclamation-circle');
    }
  } catch (e) {
    console.error('Checkout error:', e);
    showToast('حدث خطأ: ' + (e.message || 'الاتصال بالسيرفر'), 'fa-exclamation-circle');
  }

  submitBtn.disabled = false;
  submitBtn.innerHTML = '<i class="fab fa-whatsapp"></i> إرسال الطلب عبر واتساب';
  return false;
}

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });
}

window.addEventListener('scroll', () => {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  let current = '';
  sections.forEach(section => {
    const top = section.offsetTop - 120;
    if (window.scrollY >= top) current = section.getAttribute('id');
  });
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) link.classList.add('active');
  });
});
