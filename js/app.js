document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initCart();
  initProducts();
  initCheckout();
  initSmoothScroll();
  loadShippingConfig();
  registerSW();
});

function registerSW() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  }
}

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
  const wishlistBtn = document.getElementById('wishlistBtn');
  const wishlistCount = document.getElementById('wishlistCount');

  // Wishlist
  if (wishlistBtn) {
    wishlistBtn.addEventListener('click', () => {
      window.activeFilter = 'wishlist';
      document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
      window.renderProducts();
      showToast(getText('showWishlist'), 'fa-heart');
    });
  }

  function updateWishlistCount() {
    if (wishlistCount) wishlistCount.textContent = cart.getWishlistCount();
  }
  if (wishlistBtn) cart.onWishlistUpdate(updateWishlistCount);
  setTimeout(updateWishlistCount, 100);

  function openCart() { cartSidebar.classList.add('open'); cartOverlay.classList.add('open'); document.body.style.overflow = 'hidden'; }
  function closeCart() { cartSidebar.classList.remove('open'); cartOverlay.classList.remove('open'); document.body.style.overflow = ''; }

  cartBtn.addEventListener('click', openCart);
  cartClose.addEventListener('click', closeCart);
  cartOverlay.addEventListener('click', closeCart);

  function renderCart() {
    const items = cart.getItems();
    countEl.textContent = cart.getItemCount();
    if (items.length === 0) {
      itemsEl.innerHTML = '<div class="cart-empty"><i class="fas fa-shopping-bag"></i><p>' + getText('cartEmpty') + '</p><span>' + getText('cartEmptySub') + '</span></div>';
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
    if (category !== undefined) {
      activeCategory = category;
      window.activeFilter = null;
    }
    let filtered = PRODUCTS.filter(p => {
      if (window.activeFilter === 'wishlist' && !cart.isInWishlist(p.id)) return false;
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
          <p style="font-size:18px">${getText('noProducts')}</p>
        </div>`;
      return;
    }

    const shareProduct = (p) => {
      const url = encodeURIComponent(window.location.origin + '/?product=' + p.id);
      const text = encodeURIComponent(`🌿 ${p.title} - ${formatPrice(p.price)}`);
      return `
        <div class="product-share" onclick="event.stopPropagation()">
          <a href="https://wa.me/?text=${text}%20${url}" target="_blank" title="مشاركة على واتساب"><i class="fab fa-whatsapp"></i></a>
          <a href="https://www.facebook.com/sharer/sharer.php?u=${url}" target="_blank" title="مشاركة على فيسبوك"><i class="fab fa-facebook"></i></a>
        </div>`;
    };

    grid.innerHTML = filtered.map(product => {
      const badgeClass = product.badge ? `badge-${product.badge}` : '';
      const badgeLabel = product.badge ? (BADGE_LABELS[product.badge] || '') : '';
      const oldPriceHtml = product.oldPrice ? `<span class="old-price">${formatPrice(product.oldPrice)}</span>` : '';
      const imageHtml = product.image
        ? `<img src="${product.image}" alt="${product.title}" class="product-img" loading="lazy" onerror="handleImageError(this)"><div class="product-image-placeholder" style="display:none"><i class="${getProductIcon(product.icon)}"></i></div>`
        : `<div class="product-image-placeholder"><i class="${getProductIcon(product.icon)}"></i></div>`;

      const isOutOfStock = product.stock === 0;
      const addBtnHtml = isOutOfStock
        ? `<span class="out-of-stock-badge">${getText('outOfStock')}</span>`
        : `<button class="add-to-cart-btn" onclick="event.stopPropagation();handleAddToCart(${product.id})" title="${getText('addToCart')}"><i class="fas fa-plus"></i></button>`;

      const tagsHtml = (product.tags && product.tags.length)
        ? `<div class="product-tags">${product.tags.map(t => `<span class="product-tag">${TAG_LABELS[t] || t}</span>`).join('')}</div>`
        : '';

      const avgRating = cart.getAverageRating(product.id);
      const starsHtml = avgRating > 0
        ? `<div class="review-stars">${[1,2,3,4,5].map(i => `<span class="review-star ${i <= Math.round(avgRating) ? 'active' : ''}">★</span>`).join('')}<span style="font-size:11px;color:var(--text-light);margin-right:4px">${avgRating.toFixed(1)}</span></div>`
        : '';

      const isWishlisted = cart.isInWishlist(product.id);
      const wishlistIcon = isWishlisted ? 'fas' : 'far';

      return `
        <div class="product-card" data-id="${product.id}" onclick="window.location.href='/product.html?id=${product.id}'" style="cursor:pointer">
          <div class="product-image">
            <button class="wishlist-toggle ${isWishlisted ? 'active' : ''}" onclick="event.stopPropagation();toggleWishlist(${product.id})" title="${isWishlisted ? getText('removeWishlist') : getText('addWishlist')}">
              <i class="${wishlistIcon} fa-heart"></i>
            </button>
            ${imageHtml}
            ${badgeLabel ? `<span class="product-badge ${badgeClass}">${badgeLabel}</span>` : ''}
            ${isOutOfStock ? `<span class="product-badge badge-out">${getText('outOfStock')}</span>` : ''}
          </div>
          <div class="product-body">
            <span class="product-category">${getText('cat' + product.category.charAt(0).toUpperCase() + product.category.slice(1)) || CATEGORIES[product.category] || product.category}</span>
            <h3 class="product-title" title="${product.titleEn || ''}">${product.title}</h3>
            ${tagsHtml}
            <p class="product-description">${product.description}</p>
            ${starsHtml ? `<div class="product-reviews">${starsHtml}</div>` : ''}
            <div class="product-footer">
              <span class="product-price">${oldPriceHtml}${formatPrice(product.price)}</span>
              <div class="product-footer-left">
                ${addBtnHtml}
              </div>
            </div>
            <div class="product-actions">
              ${(product.story && product.story.length) ? `<button class="story-btn" onclick="event.stopPropagation();openStory(${product.id})"><i class="fas fa-book-open"></i> ${getText('storyBtn')}</button>` : ''}
              ${shareProduct(product)}
            </div>
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
      const avg = cart.getAverageRating(p.id);
      const s = avg > 0 ? [1,2,3,4,5].map(i => `<span class="review-star ${i <= Math.round(avg) ? 'active' : ''}">★</span>`).join('') : '';
      const rHtml = s ? `<div class="product-reviews"><div class="review-stars">${s}<span style="font-size:11px;color:var(--text-light);margin-right:4px">${avg.toFixed(1)}</span></div></div>` : '';
      const imageHtml = p.image
        ? `<img src="${p.image}" alt="${p.title}" class="product-img" loading="lazy" onerror="this.style.display='none'">`
        : `<div class="product-image-placeholder"><i class="${p.icon || 'fa-solid fa-box'}"></i></div>`;
      return `<div class="product-card" data-id="${p.id}" onclick="window.location.href='/product.html?id=${p.id}'" style="cursor:pointer">
        <div class="product-image">${imageHtml}</div>
        <div class="product-body">
          <span class="product-category">${CATEGORIES[p.category] || p.category}</span>
          <h3 class="product-title">${p.title}</h3>
          ${rHtml}
          <div class="product-footer">
            <span class="product-price">${formatPrice(p.price)}</span>
            <button class="add-to-cart-btn" onclick="event.stopPropagation();handleAddToCart(${p.id})"><i class="fas fa-plus"></i></button>
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
  showToast(getText('addedToCart'));
}

window.toggleWishlist = function(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;
  const isNow = cart.toggleWishlist(productId);
  showToast(isNow ? getText('addToCartWishlist') : getText('removeFromWishlist'), isNow ? 'fa-heart' : 'fa-heart-broken');
  window.renderProducts();
};

let shippingConfig = { shippingCost: 2.00, freeShippingOver: 30.00 };
let appliedCoupon = null;

window.applyCoupon = async function() {
  const input = document.getElementById('checkoutCoupon');
  const msg = document.getElementById('couponMsg');
  const code = input.value.trim();
  if (!code) { msg.textContent = ''; appliedCoupon = null; return; }
  try {
    const subtotal = cart.getTotal();
    const res = await fetch('/api/coupons/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, subtotal })
    });
    const data = await res.json();
    if (data.valid) {
      appliedCoupon = { code: data.code, discount: data.discount, id: data.id };
      msg.innerHTML = `<span style="color:var(--green-mid)">✓ ${getText('discountApplied').replace('{amount}', data.discount.toFixed(2))}</span> <button onclick="removeCoupon()" style="background:none;border:none;color:var(--palestine-red);cursor:pointer;font-size:13px"><i class="fas fa-times"></i></button>`;
      input.style.borderColor = 'var(--green-mid)';
      updateCheckoutTotal();
    } else {
      appliedCoupon = null;
      msg.innerHTML = `<span style="color:var(--palestine-red)">${data.error || getText('invalidCode')}</span>`;
      input.style.borderColor = 'var(--palestine-red)';
    }
  } catch { msg.textContent = getText('connectionError'); }
};

window.removeCoupon = function() {
  appliedCoupon = null;
  document.getElementById('checkoutCoupon').value = '';
  document.getElementById('couponMsg').textContent = '';
  document.getElementById('checkoutCoupon').style.borderColor = '';
  updateCheckoutTotal();
};

function updateCheckoutTotal() {
  const subtotal = cart.getTotal();
  const shipping = subtotal >= shippingConfig.freeShippingOver ? 0 : shippingConfig.shippingCost;
  const discount = appliedCoupon ? appliedCoupon.discount : 0;
  const total = Math.max(0, subtotal + shipping - discount);
  const totalEl = document.getElementById('checkoutModalTotal');
  if (totalEl) totalEl.textContent = formatPrice(total);
  // Show discount line
  const discountRow = document.getElementById('checkoutDiscountRow');
  if (discountRow) {
    if (discount > 0) {
      discountRow.style.display = 'flex';
      document.getElementById('checkoutModalDiscount').textContent = '-' + formatPrice(discount);
    } else {
      discountRow.style.display = 'none';
    }
  }
}

async function loadShippingConfig() {
  try {
    const res = await fetch('/api/payment-config');
    if (res.ok) shippingConfig = await res.json();
  } catch {}
}

function initCheckout() {
  const checkoutBtn = document.getElementById('checkoutBtn');
  const modal = document.getElementById('checkoutModal');
  const overlay = document.getElementById('checkoutOverlay');
  const closeBtn = document.getElementById('checkoutModalClose');
  const orderItemsEl = document.getElementById('checkoutOrderItems');
  const subtotalEl = document.getElementById('checkoutModalSubtotal');
  const shippingEl = document.getElementById('checkoutModalShipping');
  const shippingRow = document.getElementById('checkoutShippingRow');
  const totalEl = document.getElementById('checkoutModalTotal');

  function openModal() {
    const items = cart.getItems();
    if (items.length === 0) { showToast(getText('emptyCartCheckout'), 'fa-exclamation-circle'); return; }
    orderItemsEl.innerHTML = items.map(item =>
      `• ${item.title} x${item.quantity} = ${formatPrice(item.price * item.quantity)}`
    ).join('<br>');
    const subtotal = cart.getTotal();
    const shipping = subtotal >= shippingConfig.freeShippingOver ? 0 : shippingConfig.shippingCost;
    subtotalEl.textContent = formatPrice(subtotal);
    if (shipping > 0) {
      shippingRow.style.display = 'flex';
      shippingEl.textContent = formatPrice(shipping);
    } else if (shippingConfig.shippingCost > 0) {
      shippingRow.style.display = 'flex';
      shippingEl.textContent = 'مجاني 🎉';
    } else {
      shippingRow.style.display = 'none';
    }
    appliedCoupon = null;
    document.getElementById('checkoutCoupon').value = '';
    document.getElementById('couponMsg').textContent = '';
    document.getElementById('checkoutCoupon').style.borderColor = '';
    updateCheckoutTotal();
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
  const paymentMethod = document.getElementById('checkoutPayment').value;
  const items = cart.getItems();

  if (items.length === 0) { showToast('عربة التسوق فارغة!', 'fa-exclamation-circle'); return false; }

  const submitBtn = e.target.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> ' + getText('sending');

  const subtotal = cart.getTotal();
  const shipping = subtotal >= shippingConfig.freeShippingOver ? 0 : shippingConfig.shippingCost;

  const discount = appliedCoupon ? appliedCoupon.discount : 0;
  const finalTotal = Math.max(0, subtotal + shipping - discount);

  const orderData = {
    name, phone, address, notes, paymentMethod,
    items: items.map(i => ({ title: i.title, quantity: i.quantity, price: i.price })),
    total: finalTotal.toFixed(2),
    subtotal: subtotal.toFixed(2),
    shippingCost: shipping,
    discount: discount > 0 ? discount.toFixed(2) : '0',
    couponCode: appliedCoupon ? appliedCoupon.code : '',
    couponDiscount: discount > 0 ? discount.toFixed(2) : '0'
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

      // Save order in session for reference if customer returns
      sessionStorage.setItem('lastOrder', JSON.stringify({
        id: data.orderId,
        name, phone, address, notes, paymentMethod,
        items: items.map(i => ({ title: i.title, quantity: i.quantity, price: i.price })),
        total: data.total || (subtotal + shipping).toFixed(2),
        shipping: data.shipping || shipping.toFixed(2),
        createdAt: new Date().toISOString()
      }));

      cart.clear();
      updateOliveTree();

      if (data.fallbackUrl) {
        window.location.href = data.fallbackUrl;
      } else {
        window.location.href = '/order-confirmed.html?id=' + data.orderId;
      }
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
  submitBtn.innerHTML = '<i class="fab fa-whatsapp"></i> ' + getText('submitOrder');
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

// ==================== STORY VIEWER ====================
let currentStory = [];
let storyIndex = 0;
let storyTimer = null;

window.openStory = function(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product || !product.story || !product.story.length) return;
  currentStory = product.story;
  storyIndex = 0;
  document.getElementById('storyProductName').textContent = product.title;
  document.getElementById('storyOverlay').style.display = 'flex';
  showStorySlide(0);
  startStoryTimer();
};

function showStorySlide(idx) {
  if (idx < 0 || idx >= currentStory.length) { closeStory(); return; }
  storyIndex = idx;
  const slide = currentStory[idx];
  const container = document.getElementById('storySlideContent');
  const caption = document.getElementById('storyCaption');
  const progress = document.getElementById('storyProgress');

  // Update progress bars
  progress.innerHTML = currentStory.map((_, i) =>
    `<div class="story-progress-bar ${i < idx ? 'done' : i === idx ? 'active' : ''}"><div class="story-progress-fill" style="${i === idx ? 'animation: storyProgress 4s linear' : ''}"></div></div>`
  ).join('');

  caption.textContent = slide.caption || '';

  if (slide.type === 'image') {
    container.innerHTML = `<img src="${slide.url}" alt="" class="story-media" onerror="this.outerHTML='<div class=story-error>⚠️ فشل تحميل الصورة</div>'">`;
  } else if (slide.type === 'video') {
    container.innerHTML = `<video src="${slide.url}" class="story-media" autoplay controls playsinline onerror="this.outerHTML='<div class=story-error>⚠️ فشل تحميل الفيديو</div>'"></video>`;
  } else if (slide.type === 'text') {
    container.innerHTML = `<div class="story-text-content">${slide.content.replace(/\n/g, '<br>')}</div>`;
  }
}

window.nextStorySlide = function() {
  clearTimeout(storyTimer);
  showStorySlide(storyIndex + 1);
  startStoryTimer();
};

window.prevStorySlide = function() {
  clearTimeout(storyTimer);
  showStorySlide(storyIndex - 1);
  startStoryTimer();
};

function startStoryTimer() {
  clearTimeout(storyTimer);
  const slide = currentStory[storyIndex];
  if (!slide) return;
  const delay = slide.type === 'text' ? 8000 : 4000;
  storyTimer = setTimeout(nextStorySlide, delay);
}

window.closeStory = function() {
  clearTimeout(storyTimer);
  document.getElementById('storyOverlay').style.display = 'none';
  document.getElementById('storySlideContent').innerHTML = '';
};

// Keyboard navigation
document.addEventListener('keydown', (e) => {
  if (document.getElementById('storyOverlay').style.display !== 'flex') return;
  if (e.key === 'ArrowRight') nextStorySlide();
  else if (e.key === 'ArrowLeft') prevStorySlide();
  else if (e.key === 'Escape') closeStory();
});

// ==================== OLIVE TREE ====================
function updateOliveTree() {
  const visual = document.getElementById('treeVisual');
  const countEl = document.getElementById('treeCount');
  if (!visual || !countEl) return;
  fetch('/api/orders', { signal: AbortSignal.timeout(10000) })
    .then(r => r.json())
    .then(orders => {
      const count = orders.length;
      const stages = [0, 5, 20, 50, 100];
      let stage = 0;
      for (let i = stages.length - 1; i >= 0; i--) {
        if (count >= stages[i]) { stage = i; break; }
      }
      visual.className = 'tree-visual tree-stage-' + stage;
      countEl.textContent = count;
    })
    .catch(() => { countEl.textContent = '🌱'; });
}

// Init tree on load
setTimeout(updateOliveTree, 1500);

// ==================== SCROLL ACTIVE NAV ====================
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
