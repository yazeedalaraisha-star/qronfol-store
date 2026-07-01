class Cart {
  constructor() {
    this.items = this.loadCart();
    this.renderCallbacks = [];
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
