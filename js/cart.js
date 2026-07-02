class Cart {
  constructor() {
    this.items = this.loadCart();
    this.wishlist = this.loadWishlist();
    this.renderCallbacks = [];
    this.wishlistCallbacks = [];
  }

  loadCart() {
    try {
      const stored = localStorage.getItem('qronfol_cart');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  saveCart() {
    localStorage.setItem('qronfol_cart', JSON.stringify(this.items));
  }

  loadWishlist() {
    try {
      const stored = localStorage.getItem('qronfol_wishlist');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  saveWishlist() {
    localStorage.setItem('qronfol_wishlist', JSON.stringify(this.wishlist));
  }

  // Wishlist methods
  toggleWishlist(productId) {
    const idx = this.wishlist.indexOf(productId);
    if (idx > -1) this.wishlist.splice(idx, 1);
    else this.wishlist.push(productId);
    this.saveWishlist();
    this.notifyWishlist();
    return this.isInWishlist(productId);
  }

  isInWishlist(productId) {
    return this.wishlist.includes(productId);
  }

  getWishlist() {
    return [...this.wishlist];
  }

  getWishlistCount() {
    return this.wishlist.length;
  }

  onWishlistUpdate(callback) {
    this.wishlistCallbacks.push(callback);
  }

  notifyWishlist() {
    this.wishlistCallbacks.forEach(cb => cb(this));
  }

  // Reviews
  getReviews(productId) {
    try {
      const all = JSON.parse(localStorage.getItem('qronfol_reviews') || '{}');
      return all[productId] || [];
    } catch { return []; }
  }

  addReview(productId, rating, text) {
    const all = JSON.parse(localStorage.getItem('qronfol_reviews') || '{}');
    if (!all[productId]) all[productId] = [];
    all[productId].push({ rating, text, date: new Date().toISOString() });
    localStorage.setItem('qronfol_reviews', JSON.stringify(all));
  }

  getAverageRating(productId) {
    const reviews = this.getReviews(productId);
    if (!reviews.length) return 0;
    return reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
  }

  getItems() {
    return [...this.items];
  }

  getItemCount() {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
  }

  getTotal() {
    return this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  addItem(product) {
    const existing = this.items.find(item => item.id === product.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      this.items.push({
        id: product.id,
        title: product.title,
        price: product.price,
        icon: product.icon || 'fa-solid fa-box',
        quantity: 1
      });
    }
    this.saveCart();
    this.notify();
    return true;
  }

  removeItem(productId) {
    this.items = this.items.filter(item => item.id !== productId);
    this.saveCart();
    this.notify();
  }

  updateQuantity(productId, delta) {
    const item = this.items.find(item => item.id === productId);
    if (!item) return;
    item.quantity = Math.max(1, item.quantity + delta);
    this.saveCart();
    this.notify();
  }

  setQuantity(productId, qty) {
    const item = this.items.find(item => item.id === productId);
    if (!item) return;
    item.quantity = Math.max(1, Math.min(99, qty));
    this.saveCart();
    this.notify();
  }

  clear() {
    this.items = [];
    this.saveCart();
    this.notify();
  }

  onUpdate(callback) {
    this.renderCallbacks.push(callback);
  }

  notify() {
    this.renderCallbacks.forEach(cb => cb(this));
  }
}

const cart = new Cart();
