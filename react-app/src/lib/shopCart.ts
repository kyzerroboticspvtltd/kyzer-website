// Shared cart utility for shop sub-pages
// Writes to the same localStorage key that site.js reads on the homepage

export interface CartItem {
  id: string;
  name: string;
  price: string;
  emoji: string;
  qty: number;
}

export function addToLocalCart(product: { id?: string; name: string; price: string; emoji?: string }) {
  try {
    const cart: CartItem[] = JSON.parse(localStorage.getItem('kyzer_cart') || '[]');
    const pid = product.id || ('p-' + Date.now());
    const existing = cart.find(i => i.id === pid);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({
        id: pid,
        name: product.name,
        price: String(parseFloat(String(product.price).replace(/[^0-9.]/g, '')) || 0),
        emoji: product.emoji || '📦',
        qty: 1,
      });
    }
    localStorage.setItem('kyzer_cart', JSON.stringify(cart));
  } catch { /* localStorage unavailable */ }
}

export function buyNow(product: { id?: string; name: string; price: string; emoji?: string }) {
  addToLocalCart(product);
  window.location.href = '/checkout';
}
