window.SUPABASE_URL = 'https://alrgkykezmlcagovkkdl.supabase.co';
window.SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFscmdreWtlem1sY2Fnb3Zra2RsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk2MjIxMjMsImV4cCI6MjA5NTE5ODEyM30.g_UjIRnjov6cUAkwjlifL2kDUzh1G7cpsThj6Ygq83U';
window.GOOGLE_CLIENT_ID = '957884556895-vr9saiqht9n2djo77j5hp8auk61cj7cd.apps.googleusercontent.com';

  // Hamburger
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    hamburger.classList.toggle('open');
  });

  // Smooth scroll for nav links
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const t = document.querySelector(a.getAttribute('href'));
      if (t) t.scrollIntoView({ behavior: 'smooth' });
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
    });
  });
  function scrollTo(sel) { document.querySelector(sel).scrollIntoView({ behavior: 'smooth' }); }

  // Scroll reveal
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); } });
  }, { threshold: 0.1 });
  reveals.forEach(r => observer.observe(r));


  // Product filter
  function applyFilter(filter) {
    document.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t.dataset.filter === filter));
    document.querySelectorAll('[data-cat-tile]').forEach(t => t.classList.toggle('active-cat', t.dataset.catTile === filter));
    document.querySelectorAll('.prod-card').forEach(card => {
      card.style.display = (filter !== '__none__' && (filter === 'all' || card.dataset.cat === filter)) ? '' : 'none';
    });
  }

  let _activeCat = 'all';

  function filterCat(cat) {
    _activeCat = cat;
    const grid        = document.getElementById('productsGrid');
    const subcatTabs  = document.getElementById('subcatTabs');
    const framePanel  = document.getElementById('frameFilterPanel');
    const dronePicker = document.getElementById('droneSubcatPicker');
    const printPicker = document.getElementById('printSubcatPicker');

    grid.classList.add('cat-open');
    if (framePanel)  framePanel.style.display  = 'none';
    if (dronePicker) dronePicker.style.display = 'none';
    if (printPicker) printPicker.style.display = 'none';
    subcatTabs.innerHTML = '';
    subcatTabs.classList.remove('visible');

    if (cat === 'drone') {
      // Show subcategory picker — hide products until user picks
      applyFilter('__none__');
      if (dronePicker) {
        dronePicker.style.display = '';
        setTimeout(() => dronePicker.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
      }
    } else if (cat === 'print' || cat === 'printing') {
      // Show subcategory picker — hide products until user picks
      applyFilter('__none__');
      if (printPicker) {
        printPicker.style.display = '';
        setTimeout(() => printPicker.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
      }
    } else if (cat === '3dprint') {
      applyFilter(cat);
      subcatTabs.innerHTML =
        `<button class="subcat-tab active" data-subcat="all"       onclick="filterSubcat('all')">All</button>` +
        `<button class="subcat-tab"        data-subcat="printer"   onclick="filterSubcat('printer')">3D Printers</button>` +
        `<button class="subcat-tab"        data-subcat="filament"  onclick="filterSubcat('filament')">Filaments</button>` +
        `<button class="subcat-tab"        data-subcat="component" onclick="filterSubcat('component')">Components</button>`;
      subcatTabs.classList.add('visible');
      filterSubcat('all', false);
      setTimeout(() => grid.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
    } else {
      applyFilter(cat);
      setTimeout(() => grid.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
    }
  }

  function showCompleteDrones() {
    const dronePicker = document.getElementById('droneSubcatPicker');
    if (dronePicker) dronePicker.style.display = 'none';
    applyFilter('drone');
    document.querySelectorAll('.prod-card[data-cat="drone"]').forEach(card => {
      if (card.dataset.subcat === 'frame') card.style.display = 'none';
    });
    const grid = document.getElementById('productsGrid');
    setTimeout(() => grid.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
  }

  function filterSubcat(subcat, scroll) {
    document.querySelectorAll('.subcat-tab').forEach(t =>
      t.classList.toggle('active', t.dataset.subcat === subcat)
    );
    document.querySelectorAll(`.prod-card[data-cat="${_activeCat}"]`).forEach(card => {
      card.style.display = (subcat === 'all' || card.dataset.subcat === subcat) ? '' : 'none';
    });
    const framePanel = document.getElementById('frameFilterPanel');
    if (framePanel) {
      framePanel.style.display = (subcat === 'frame') ? '' : 'none';
      if (subcat === 'frame') { window._fType = 'all'; window._fMat = 'all'; window._fSize = 'all'; }
    }
  }

  function filterFrame(type, mat, size) {
    if (type !== undefined) {
      window._fType = type;
      document.querySelectorAll('.frame-chip[data-type]').forEach(c => c.classList.toggle('active', c.dataset.type === type));
    }
    if (mat !== undefined) {
      window._fMat = mat;
      document.querySelectorAll('.frame-chip[data-mat]').forEach(c => c.classList.toggle('active', c.dataset.mat === mat));
    }
    if (size !== undefined) {
      window._fSize = size;
      document.querySelectorAll('.frame-chip[data-size]').forEach(c => c.classList.toggle('active', c.dataset.size === size));
    }
    const ft = window._fType || 'all';
    const fm = window._fMat  || 'all';
    const fs = window._fSize || 'all';
    document.querySelectorAll('.prod-card[data-subcat="frame"]').forEach(card => {
      const wb = parseInt(card.dataset.wheelbase || '0');
      const matchType = ft === 'all' || card.dataset.frameType === ft;
      const matchMat  = fm === 'all' || card.dataset.material  === fm;
      const matchSize = fs === 'all'
        || (fs === 'micro' && wb < 250)
        || (fs === 'mid'   && wb >= 250 && wb <= 500)
        || (fs === 'large' && wb > 500);
      card.style.display = (matchType && matchMat && matchSize) ? '' : 'none';
    });
  }

  // Tab click handled inline via onclick in renderCategoryTiles

  // Default categories used before Supabase data loads
  const DEFAULT_CATS = [
    { id: 'drone',   name: 'Drones',             desc: 'Survey, FPV & agricultural platforms' },
    { id: 'print',   name: 'Print Services',     desc: 'Custom FDM prints, nylon parts & enclosures' },
    { id: 'proto',   name: 'Prototyping',        desc: 'PCB, enclosures & rapid development' },
    { id: '3dprint', name: 'Printers & Supplies', desc: '3D printers, filaments & upgrade components' },
  ];

  const CAT_PAGES = {
    drone:    '/shop/drones',
    printing: '/shop/printing',
    print:    '/shop/printing',
    proto:    '/shop/prototyping',
    '3dprint':'/shop/printing',
  };

  const PRINT_IDS = ['print', '3dprint'];

  function mergePrintCats(list) {
    const printIdx = list.findIndex(c => PRINT_IDS.includes(c.id));
    if (printIdx === -1) return list;
    const printCats = list.filter(c => PRINT_IDS.includes(c.id));
    // Inherit name, desc, photo and emoji from whichever print cat has them set
    const baseCat = printCats.find(c => c.photo) || printCats[0];
    const merged = {
      id:    'printing',
      name:  baseCat.name  || '3D Printing',
      desc:  baseCat.desc  || 'FDM prints, prototyping & printer supplies',
      emoji: baseCat.emoji || '🖨️',
      photo: baseCat.photo || null,
    };
    const rest = list.filter(c => !PRINT_IDS.includes(c.id));
    rest.splice(printIdx, 0, merged);
    return rest;
  }

  function renderCategoryTiles(cats) {
    const raw  = cats && cats.length ? cats : DEFAULT_CATS;
    const list = mergePrintCats(raw);
    const tilesEl = document.getElementById('catTilesContainer');
    const tabsEl  = document.getElementById('catFilterTabs');
    if (!tilesEl) return;

    tilesEl.innerHTML = list.map(cat => {
      const icon = cat.photo
        ? `<div class="cat-tile-photo"><img src="${cat.photo}" alt="${cat.name}"></div>`
        : `<div class="cat-tile-icon">${cat.emoji || '📦'}</div>`;
      const href = CAT_PAGES[cat.id] || '/get-a-quote';
      return `<a class="cat-tile" href="${href}" data-cat-tile="${cat.id}">
        ${icon}
        <div class="cat-tile-name">${cat.name}</div>
        <div class="cat-tile-desc">${cat.desc || ''}</div>
        <div class="cat-tile-count" id="catCount-${cat.id}"></div>
      </a>`;
    }).join('');

    if (tabsEl) {
      tabsEl.innerHTML = `<button class="tab active" data-filter="all" onclick="applyFilter('all')">All</button>`
        + list.map(cat => `<button class="tab" data-filter="${cat.id}" onclick="applyFilter('${cat.id}')">${cat.name}</button>`).join('');
    }

    updateCatCounts();
  }

  // Count products per category and update tiles
  function updateCatCounts() {
    document.querySelectorAll('[id^="catCount-"]').forEach(el => {
      const cat = el.id.replace('catCount-', '');
      let n;
      if (cat === 'printing') {
        n = document.querySelectorAll('.prod-card[data-cat="print"], .prod-card[data-cat="proto"], .prod-card[data-cat="3dprint"]').length;
      } else {
        n = document.querySelectorAll(`.prod-card[data-cat="${cat}"]`).length;
      }
      el.textContent = n + (n === 1 ? ' product' : ' products');
    });
  }

  renderCategoryTiles(JSON.parse(localStorage.getItem('kyzer_categories') || 'null'));

  document.getElementById('contactForm').addEventListener('submit', async e => {
    e.preventDefault();
    const btn = e.target.querySelector('.form-submit');
    btn.textContent = 'Sending...';
    btn.disabled = true;
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name:    document.getElementById('contactName').value.trim(),
          email:   document.getElementById('contactEmail').value.trim(),
          phone:   document.getElementById('contactPhone').value.trim(),
          subject: document.getElementById('contactSubject').value,
          message: document.getElementById('contactMessage').value.trim(),
        }),
      });
      const data = await res.json();
      if (data.ok) {
        btn.style.display = 'none';
        document.getElementById('formSuccess').style.display = 'block';
      } else {
        throw new Error(data.message || 'failed');
      }
    } catch {
      btn.textContent = 'Send message →';
      btn.disabled = false;
      if (confirm('Message could not send automatically.\n\nClick OK to open WhatsApp instead, or Cancel to email us at info@kyzerrobotics.com')) {
        const n = document.getElementById('contactName').value.trim();
        const m = document.getElementById('contactMessage').value.trim();
        window.open('https://wa.me/919049695264?text=' + encodeURIComponent(`Hi Kyzer Robotics,\n\n${m}\n\n— ${n}`), '_blank');
      }
    }
  });

  // Navbar scroll effect
  window.addEventListener('scroll', () => {
    document.getElementById('navbar').style.background =
      window.scrollY > 60 ? 'rgba(248,248,246,0.97)' : 'rgba(248,248,246,0.92)';
  });

  // ====== PAGE SWITCHER ======
  function showPage(page) {
    const coPage = document.getElementById('checkoutPage');
    if (coPage) coPage.classList.remove('active');
    if (page === 'account') {
      if (!getCurrentCustomer()) { openAuthModal('login'); return; }
      document.getElementById('mainSite').style.display = 'none';
      document.getElementById('quotePage').classList.remove('active');
      document.getElementById('productPage').classList.remove('active');
      var ap = document.getElementById('accountPage');
      if (ap) ap.classList.add('active');
      loadAccountPage();
      history.pushState(null, '', '#account');
      window.scrollTo(0, 0);
      return;
    }
    var ap2 = document.getElementById('accountPage');
    if (ap2) ap2.classList.remove('active');
    const main    = document.getElementById('mainSite');
    const quote   = document.getElementById('quotePage');
    const product = document.getElementById('productPage');
    main.style.display = 'none';
    quote.classList.remove('active');
    product.classList.remove('active');
    if (page === 'quote') {
      quote.classList.add('active');
      history.pushState(null, '', '#quote');
    } else if (page === 'product') {
      product.classList.add('active');
      history.pushState(null, '', '#product');
    } else if (page === 'checkout') {
      if (coPage) { coPage.classList.add('active'); loadCheckoutPage(); }
      history.pushState(null, '', '#checkout');
    } else {
      main.style.display = 'block';
      history.pushState(null, '', location.pathname);
    }
    window.scrollTo(0, 0);
  }

  function restorePageFromHash() {
    const hash = window.location.hash;
    if (hash === '#quote')         showPage('quote');
    else if (hash === '#account')  showPage('account');
    else if (hash === '#checkout') { renderCartDrawer(); goToCheckout(); }
    else if (hash === '#cart')     openCartDrawer();
  }

  // Handle browser back/forward
  window.addEventListener('popstate', function() {
    const hash = window.location.hash;
    if (hash === '#quote')         showPage('quote');
    else if (hash === '#account')  showPage('account');
    else if (hash === '#checkout') { renderCartDrawer(); goToCheckout(); }
    else showPage('main');
  });

  // ====== CART ======
  let cart = JSON.parse(localStorage.getItem('kyzer_cart') || '[]');

  function saveCart() {
    localStorage.setItem('kyzer_cart', JSON.stringify(cart));
    updateCartBadge();
  }

  function updateCartBadge() {
    const total = cart.reduce((s, i) => s + i.qty, 0);
    const badge = document.getElementById('navCartBadge');
    if (badge) { badge.textContent = total; badge.style.display = total > 0 ? '' : 'none'; }
  }

  function addToCart(product, qty) {
    const existing = cart.find(i => i.id === product.id);
    if (existing) {
      existing.qty += qty;
    } else {
      cart.push({
        id: product.id || ('p-' + Date.now()),
        name: product.name,
        price: product.price,
        emoji: product.emoji || '📦',
        photo: (pdpPhotos && pdpPhotos.length > 0) ? pdpPhotos[0] : null,
        qty,
      });
    }
    saveCart();
  }

  function removeFromCart(id) {
    cart = cart.filter(i => i.id !== id);
    saveCart();
    renderCartDrawer();
  }

  function updateCartItemQty(id, delta) {
    const item = cart.find(i => i.id === id);
    if (!item) return;
    item.qty = Math.max(1, item.qty + delta);
    saveCart();
    renderCartDrawer();
  }

  function parseNumericPrice(v) {
    if (!v || String(v).toLowerCase().includes('from')) return 0;
    const n = parseFloat(String(v).replace(/[^0-9.]/g, ''));
    return isNaN(n) ? 0 : n;
  }

  function cartTotal() {
    return cart.reduce((s, i) => s + (parseNumericPrice(i.price) * i.qty), 0);
  }

  function openCartDrawer() {
    renderCartDrawer();
    document.getElementById('cartOverlay').classList.add('open');
    document.getElementById('cartDrawer').classList.add('open');
    document.body.style.overflow = 'hidden';
    // hide checkout page if open, don't go to main
    const co = document.getElementById('checkoutPage');
    if (co && co.classList.contains('active')) co.classList.remove('active');
  }

  function closeCartDrawer() {
    document.getElementById('cartOverlay').classList.remove('open');
    document.getElementById('cartDrawer').classList.remove('open');
    document.body.style.overflow = '';
  }

  function renderCartDrawer() {
    const list = document.getElementById('cartItemsList');
    const footer = document.getElementById('cartDrawerFooter');
    if (!list) return;
    if (cart.length === 0) {
      list.innerHTML = `<div class="cart-empty"><div class="cart-empty-icon">🛒</div><div class="cart-empty-text">Your cart is empty.<br>Browse our products to get started.</div></div>`;
      if (footer) footer.style.display = 'none';
      return;
    }
    if (footer) footer.style.display = '';
    list.innerHTML = cart.map(item => {
      const thumb = item.photo
        ? `<img src="${item.photo}" alt="${item.name}">`
        : item.emoji;
      const _np = parseNumericPrice(item.price);
      const _unit = _np ? '₹' + _np.toLocaleString('en-IN') : (item.price || '');
      const _sub  = _np ? '₹' + (_np * item.qty).toLocaleString('en-IN') : '—';
      return `<div class="cart-item">
        <div class="cart-item-img">${thumb}</div>
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">${_unit ? _unit + ' · ' + _sub : ''}</div>
          <div class="cart-item-controls">
            <button class="cart-qty-btn" onclick="updateCartItemQty('${item.id}', -1)">&#8722;</button>
            <span class="cart-item-qty">${item.qty}</span>
            <button class="cart-qty-btn" onclick="updateCartItemQty('${item.id}', 1)">&#43;</button>
            <button class="cart-item-remove" onclick="removeFromCart('${item.id}')" title="Remove">&#10005;</button>
          </div>
        </div>
      </div>`;
    }).join('');
    const tot = cartTotal();
    const totEl = document.getElementById('cartTotalVal');
    if (totEl) totEl.textContent = tot > 0 ? '₹' + tot.toLocaleString('en-IN') : '—';
  }

  function goToCheckout() {
    closeCartDrawer();
    showPage('checkout');
  }

  // ====== PDP CART HELPERS ======
  function pdpQtyChange(delta) {
    pdpQty = Math.max(1, pdpQty + delta);
    document.getElementById('pdpQtyVal').textContent = pdpQty;
  }

  function pdpAddToCart() {
    if (!pdpCurrentProduct) return;
    addToCart(pdpCurrentProduct, pdpQty);
    const btn = document.getElementById('pdpAddCartBtn');
    btn.textContent = '✓ Added!';
    btn.classList.add('added');
    setTimeout(() => { btn.textContent = 'Add to cart'; btn.classList.remove('added'); }, 1800);
  }

  function pdpBuyNow() {
    if (!pdpCurrentProduct) return;
    addToCart(pdpCurrentProduct, pdpQty);
    goToCheckout();
  }

  // ====== CHECKOUT PAGE ======
  function loadCheckoutPage() {
    const session = typeof getCurrentCustomer === 'function' ? getCurrentCustomer() : null;
    if (session) {
      const customers = typeof getCustomers === 'function' ? getCustomers() : [];
      const full = customers.find(x => x.id === session.id) || session;
      const fill = (id, val) => { const el = document.getElementById(id); if (el && val) el.value = val; };
      fill('coName',    full.name);
      fill('coEmail',   full.email);
      fill('coPhone',   full.phone);
      const a = full.address || {};
      fill('coAddr1',   a.addr1);
      fill('coAddr2',   a.addr2);
      fill('coCity',    a.city);
      fill('coState',   a.state);
      fill('coPincode', a.pincode);
      fill('coLandmark',a.landmark);
    }
    renderCheckoutSummary();
  }

  const DELIVERY_FREE_ABOVE = 999;
  const DELIVERY_CHARGE    = 99;
  const GST_RATE           = 0.18;

  function orderBreakdown() {
    const subtotal = cartTotal();
    const gst      = Math.round(subtotal * GST_RATE);
    const delivery = subtotal >= DELIVERY_FREE_ABOVE ? 0 : DELIVERY_CHARGE;
    return { subtotal, gst, delivery, total: subtotal + gst + delivery };
  }

  function renderCheckoutSummary() {
    const itemsEl = document.getElementById('coSummaryItems');
    const totEl   = document.getElementById('coSummaryTotal');
    if (!itemsEl) return;
    itemsEl.innerHTML = cart.map(item => {
      const thumb = item.photo
        ? `<img src="${item.photo}" alt="${item.name}">`
        : item.emoji;
      const _np2 = parseNumericPrice(item.price);
      const sub = _np2 ? '₹' + (_np2 * item.qty).toLocaleString('en-IN') : (item.price || '—');
      return `<div class="co-cart-item-row">
        <div class="co-cart-thumb">${thumb}</div>
        <div class="co-cart-item-name">${item.name}</div>
        <div class="co-cart-item-qty">×${item.qty}</div>
        <div class="co-cart-item-sub">${sub}</div>
      </div>`;
    }).join('');
    const { subtotal, gst, delivery, total } = orderBreakdown();
    const fmt = n => '₹' + n.toLocaleString('en-IN');
    const subtotalEl = document.getElementById('coSummarySubtotal');
    const gstEl      = document.getElementById('coSummaryGST');
    const delivEl    = document.getElementById('coSummaryDelivery');
    if (subtotalEl) subtotalEl.textContent = subtotal > 0 ? fmt(subtotal) : '—';
    if (gstEl)      gstEl.textContent      = subtotal > 0 ? fmt(gst) : '—';
    if (delivEl)    delivEl.textContent    = delivery === 0 ? 'FREE' : fmt(delivery);
    if (totEl)      totEl.textContent      = total > 0 ? fmt(total) : '—';
  }

  async function submitProductOrder() {
    const name    = document.getElementById('coName').value.trim();
    const email   = document.getElementById('coEmail').value.trim();
    const phone   = document.getElementById('coPhone').value.trim();
    const addr1   = document.getElementById('coAddr1').value.trim();
    const city    = document.getElementById('coCity').value.trim();
    const state   = document.getElementById('coState').value.trim();
    const pincode = document.getElementById('coPincode').value.trim();

    if (!name || !email)                       { alert('Please enter your name and email.'); return; }
    if (!phone)                                { alert('Please enter your phone number.'); return; }
    if (!addr1 || !city || !state || !pincode) { alert('Please fill in your complete shipping address.'); return; }
    if (cart.length === 0)                     { alert('Your cart is empty.'); return; }

    const btn = document.getElementById('coSubmitBtn');
    btn.textContent = 'Processing…';
    btn.disabled = true;

    const shipping = {
      addr1, addr2: document.getElementById('coAddr2').value.trim(),
      city, state, pincode,
      landmark: document.getElementById('coLandmark').value.trim(),
    };
    const shippingFull = [addr1, shipping.addr2, city, state, pincode, shipping.landmark]
      .filter(Boolean).join(', ');

    const orderId = 'SHOP-' + Date.now();
    const { subtotal, gst, delivery, total } = orderBreakdown();
    const orderData = {
      id:          orderId,
      type:        'product',
      submittedAt: new Date().toISOString(),
      status:      'new',
      name, email, phone,
      subtotal, gst, delivery,
      company:     document.getElementById('coCompany').value.trim(),
      notes:       document.getElementById('coNotes').value.trim(),
      shipping, shippingFull,
      items:       JSON.parse(JSON.stringify(cart)),
      total,
    };

    // ── Payment method: COD or Online ──
    const payMethod = window._payMethod || 'online';

    if (payMethod === 'cod') {
      orderData.paymentMethod = 'cod';
      orderData.status = 'new';
      _finaliseOrder(orderData, shippingFull, btn);
      return;
    }

    // ── Try Razorpay online payment ──
    const rzpKeyId = window.__RZP_KEY__ || localStorage.getItem('kyzer_razorpay_key_id') || '';

    if (!rzpKeyId || typeof Razorpay === 'undefined') {
      // Auto-fallback: ask user to switch to COD
      if (confirm('Online payment is not configured yet.\n\nSwitch to Cash on Delivery instead?')) {
        selectPayMethod('cod');
        btn.textContent = 'Place Order →';
        btn.disabled = false;
      } else {
        btn.textContent = 'Place Order →';
        btn.disabled = false;
      }
      return;
    }

    if (rzpKeyId && typeof Razorpay !== 'undefined') {
      try {
        // 1. Create Razorpay order
        const createRes = await fetch('/api/create-razorpay-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            cartItems: cart.map(i => ({ id: i.id, qty: i.qty || 1 })),
            currency: 'INR',
            receipt: orderId,
            notes: { customer: name, email },
          }),
        });
        const createData = await createRes.json();
        if (!createData.ok) throw new Error(createData.error || 'Order creation failed');

        // 2. Open Razorpay modal
        btn.textContent = 'Pay now →';
        btn.disabled = false;

        const rzpOptions = {
          key:         rzpKeyId,
          amount:      createData.order.amount,
          currency:    'INR',
          name:        'Kyzer Robotics',
          description: `Order ${orderId}`,
          image:       'https://kyzerrobotics.com/logo.png',
          order_id:    createData.order.id,
          prefill: { name, email, contact: phone },
          theme: { color: '#FF8C35' },
          config: {
            display: {
              hide: [],
              preferences: { show_default_blocks: true },
            },
          },
          handler: async function (response) {
            btn.textContent = 'Verifying…';
            btn.disabled = true;
            try {
              // 3. Verify signature
              const verRes = await fetch('/api/verify-payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  razorpay_order_id:   response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature:  response.razorpay_signature,
                  orderData,
                }),
              });
              const verData = await verRes.json();
              if (!verData.ok) throw new Error(verData.error || 'Verification failed');

              orderData.paymentId = response.razorpay_payment_id;
              orderData.status    = 'paid';
              _finaliseOrder(orderData, shippingFull, btn);
            } catch (verErr) {
              alert('Payment received but verification failed — please contact us with Payment ID: ' + response.razorpay_payment_id);
              btn.textContent = 'Pay now →';
              btn.disabled = false;
            }
          },
          modal: {
            ondismiss: function () {
              btn.textContent = 'Pay now →';
              btn.disabled = false;
            },
          },
        };
        const rzp = new Razorpay(rzpOptions);
        rzp.open();
        return;
      } catch (err) {
        console.error('Razorpay init error:', err);
        btn.textContent = 'Place Order →';
        btn.disabled = false;
        alert('Payment failed to initialise. Please check your internet connection and try again.\n\nError: ' + err.message);
        return;
      }
    }
  }

  function _finaliseOrder(orderData, shippingFull, btn) {
    // Save to localStorage for admin panel
    const orders = JSON.parse(localStorage.getItem('kyzer_product_orders') || '[]');
    orders.unshift(orderData);
    localStorage.setItem('kyzer_product_orders', JSON.stringify(orders));

    // Non-blocking Supabase INSERT for cross-device admin real-time
    (function() {
      const _sbUrl = (typeof SUPABASE_URL !== 'undefined' && SUPABASE_URL) || '';
      const _sbKey = (typeof SUPABASE_KEY !== 'undefined' && SUPABASE_KEY) || '';
      if (!_sbUrl || !_sbKey) return;
      fetch(_sbUrl + '/rest/v1/shop_orders', {
        method: 'POST',
        headers: { 'apikey': _sbKey, 'Authorization': 'Bearer ' + _sbKey, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
        body: JSON.stringify({ id: orderData.id, status: orderData.status || 'new', data: orderData })
      }).catch(() => {});
    })();

    // Send email notification for offline/COD orders (paid orders are notified by verify-payment)
    if (!orderData.paymentId) {
      fetch('/api/order-notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderData }),
      }).catch(() => {});
    }

    // Clear cart
    cart = [];
    saveCart();

    // WhatsApp admin notification — only for COD/offline orders (paid orders are notified via backend email/SMS)
    if (!orderData.paymentId) {
      const itemLines = (orderData.items || []).map(i =>
        `  • ${i.name} ×${i.qty} — ₹${(Number(i.price||0)*i.qty).toLocaleString('en-IN')}`
      ).join('\n');
      const waMsg = encodeURIComponent(
        `🛒 *New Shop Order — ${orderData.id}*\n\n` +
        `*Customer:* ${orderData.name}\n*Phone:* ${orderData.phone}\n*Email:* ${orderData.email}\n\n` +
        `*Items:*\n${itemLines}\n\n` +
        `*Subtotal:* ₹${(orderData.subtotal||orderData.total||0).toLocaleString('en-IN')}\n` +
        `*GST (18%):* ₹${(orderData.gst||0).toLocaleString('en-IN')}\n` +
        `*Delivery:* ${orderData.delivery===0?'FREE':'₹'+(orderData.delivery||0).toLocaleString('en-IN')}\n` +
        `*Total:* ₹${(orderData.total||0).toLocaleString('en-IN')}\n\n` +
        `*Ship to:* ${shippingFull}` +
        (orderData.notes ? `\n\n*Notes:* ${orderData.notes}` : '')
      );
      setTimeout(() => window.open('https://wa.me/919049695264?text=' + waMsg, '_blank'), 400);
    }

    document.getElementById('coSuccess').style.display = '';
    document.getElementById('coSuccess').textContent =
      orderData.paymentId
        ? `✓ Payment successful! Order ${orderData.id} confirmed. Check your email for details.`
        : `✓ Order placed! We'll be in touch soon to confirm your order.`;
    btn.textContent = '✓ Done!';
    btn.disabled = true;
  }

  // Init cart badge on load
  updateCartBadge();

  // ====== PRODUCT DETAIL PAGE ======
  let pdpPhotos = [];
  let pdpCurrentProduct = null;
  let pdpQty = 1;

  function openProduct(card) {
    const d = JSON.parse(card.dataset.product);
    pdpCurrentProduct = d;
    pdpQty = 1;
    document.getElementById('pdpQtyVal').textContent = '1';
    pdpPhotos = [];

    if (d.id) {
      const allProds = JSON.parse(localStorage.getItem('kyzer_products') || '[]');
      const full = allProds.find(p => p.id === d.id);
      if (full) pdpPhotos = full.photos || (full.photo ? [full.photo] : []);
    }

    const pdpBox = document.getElementById('pdpEmoji');
    const thumbsEl = document.getElementById('pdpThumbs');
    if (pdpPhotos.length > 0) {
      pdpBox.innerHTML = `<img src="${pdpPhotos[0]}" alt="${d.name}" style="width:100%;height:100%;object-fit:contain;display:block;">`;
      thumbsEl.innerHTML = pdpPhotos.length > 1
        ? pdpPhotos.map((src, i) => `<img src="${src}" class="pdp-thumb${i===0?' active':''}" onclick="pdpSwitchPhoto(${i})" alt="">`).join('')
        : '';
    } else {
      pdpBox.textContent = d.emoji;
      thumbsEl.innerHTML = '';
    }

    const badge = document.getElementById('pdpBadge');
    badge.textContent  = d.badge;
    badge.className    = 'prod-badge' + (d.badgeType ? ' ' + d.badgeType : '');
    document.getElementById('pdpName').textContent   = d.name;
    document.getElementById('pdpShort').textContent  = d.description;
    document.getElementById('pdpLong').textContent   = d.details || '';
    const specsList = document.getElementById('pdpSpecs');
    specsList.innerHTML = (d.specs || []).map(s => `<li>${s}</li>`).join('');
    // Price + buttons — three modes:
    // 1. Numeric price  → Buy Now + Add to Cart
    // 2. "From ₹X"      → price shown + Get Quote (redirect to quote page)
    // 3. No price       → Enquire only
    const priceWrap   = document.getElementById('pdpPriceWrap');
    const addCartBtn  = document.getElementById('pdpAddCartBtn');
    const buyNowBtn   = document.getElementById('pdpBuyNowBtn');
    const getQuoteBtn = document.getElementById('pdpGetQuoteBtn');
    const enquireBtn  = document.getElementById('pdpEnquireBtn');
    const qtyRow      = document.getElementById('pdpQtyRow');
    const numPrice = parseNumericPrice(d.price);
    const isFromPrice = d.price && String(d.price).toLowerCase().startsWith('from');

    // Reset all buttons hidden
    [addCartBtn, buyNowBtn, getQuoteBtn, enquireBtn].forEach(b => b.style.display = 'none');
    addCartBtn.textContent = 'Add to Cart';
    addCartBtn.classList.remove('added');

    if (d.price && numPrice > 0) {
      document.getElementById('pdpPrice').textContent = '₹' + numPrice.toLocaleString('en-IN');
      document.getElementById('pdpPriceNote').textContent = 'Incl. GST · excl. shipping';
      qtyRow.style.display = '';
      priceWrap.style.display = '';
      buyNowBtn.style.display = '';
      addCartBtn.style.display = '';
    } else if (isFromPrice) {
      document.getElementById('pdpPrice').textContent = d.price;
      document.getElementById('pdpPriceNote').textContent = 'Final price confirmed after file review';
      qtyRow.style.display = 'none';
      priceWrap.style.display = '';
      getQuoteBtn.style.display = '';
      enquireBtn.style.display = '';
    } else {
      priceWrap.style.display = 'none';
      enquireBtn.style.display = '';
    }
    showPage('product');
  }

  function pdpSwitchPhoto(i) {
    document.getElementById('pdpEmoji').innerHTML =
      `<img src="${pdpPhotos[i]}" alt="" style="width:100%;height:100%;object-fit:contain;display:block;">`;
    document.querySelectorAll('.pdp-thumb').forEach((t, idx) => t.classList.toggle('active', idx === i));
  }

  function pdpEnquire() {
    showPage('main');
    setTimeout(() => document.querySelector('#contact').scrollIntoView({ behavior: 'smooth' }), 80);
  }

  function pdpWhatsApp() {
    const name = document.getElementById('pdpName').textContent;
    const msg = encodeURIComponent(`Hi Kyzer Robotics, I'm interested in the *${name}*. Could you please share more details?`);
    window.open('https://wa.me/919049695264?text=' + msg, '_blank');
  }

  // ====== QUOTE STATE ======
  let quoteState = {
    matRate: 4, matName: 'PLA',
    qualMult: 1.0, qualName: 'Standard',
    rush: false, colorName: 'White', colorHex: '#FFFFFF',
    infill: 20,
    colorExtra: 0,
    supportMult: 0,
    qty: 1,
    delivery: '7day',
    hasFile: false, fileName: '',
    fileData: null, fileSize: 0,
    L: 0, W: 0, H: 0
  };

  // Material select
  // Accordion toggle
  function toggleAccord(name) {
    const sec = document.getElementById('acc-' + name);
    sec.classList.toggle('open');
  }

  // New accordion-style setters
  function setQuality(name, mult, label) {
    document.querySelectorAll('#acc-quality .acc-radio-item').forEach(el => el.classList.remove('selected'));
    label.classList.add('selected');
    quoteState.qualMult = mult;
    quoteState.qualName = name;
    calculateQuote();
  }
  function setMat(name, rate, label) {
    document.querySelectorAll('#acc-material .acc-radio-item').forEach(el => el.classList.remove('selected'));
    label.classList.add('selected');
    quoteState.matRate = rate;
    quoteState.matName = name;
    calculateQuote();
  }

  // Legacy compat (used by applyAdminStorage material rebuild)
  function selectMat(btn) {
    quoteState.matRate = parseFloat(btn.dataset.rate);
    quoteState.matName = btn.dataset.mat;
    calculateQuote();
  }
  function selectQual(btn) {
    quoteState.qualMult = parseFloat(btn.dataset.qmult);
    quoteState.qualName = btn.dataset.quality;
    calculateQuote();
  }

  // Delivery select
  function selectDelivery(type, btn) {
    document.querySelectorAll('#delSameDay, #del7d').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    quoteState.delivery = type;
    calculateQuote();
  }

  // Quantity
  function changeQty(delta) {
    quoteState.qty = Math.max(1, Math.min(100, quoteState.qty + delta));
    const inp = document.getElementById('qtyInput');
    if (inp) inp.value = quoteState.qty;
    calculateQuote();
  }

  function setQtyDirect(val) {
    quoteState.qty = Math.max(1, Math.min(100, parseInt(val) || 1));
    calculateQuote();
  }

  // Color swatches
  function selectColorSwatch(el) {
    document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('selected'));
    el.classList.add('selected');
    quoteState.colorName = el.dataset.name;
    quoteState.colorHex  = el.dataset.color;
    quoteState.colorExtra = parseInt(el.dataset.premium) || 0;
    const customRow = document.getElementById('customColorRow');
    if (customRow) customRow.style.display = el.dataset.name === 'Custom' ? 'flex' : 'none';
    calculateQuote();
  }

  function syncCustomColor(hex) {
    quoteState.colorHex = hex;
    const hexInput = document.getElementById('customColorHex');
    if (hexInput) hexInput.value = hex.toUpperCase();
    quoteState.colorName = 'Custom (' + hex.toUpperCase() + ')';
    calculateQuote();
  }

  function syncCustomHex(val) {
    if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
      quoteState.colorHex = val;
      quoteState.colorName = 'Custom (' + val.toUpperCase() + ')';
      const picker = document.getElementById('customColorPicker');
      if (picker) picker.value = val;
      calculateQuote();
    }
  }

  // Rush toggle
  function toggleRush() {
    quoteState.rush = !quoteState.rush;
    const tog = document.getElementById('rushToggle');
    const badge = document.getElementById('rushBadge');
    if (tog) tog.classList.toggle('active', quoteState.rush);
    if (badge) badge.style.display = quoteState.rush ? 'inline-flex' : 'none';
    calculateQuote();
  }

  // ====== CALCULATE ======
  function calculateQuote() {
    const L = quoteState.L;
    const W = quoteState.W;
    const H = quoteState.H;
    quoteState.infill = parseInt(document.getElementById('infillSlider').value);
    quoteState.supportMult = 0;

    if (!L || !W || !H) {
      document.getElementById('priceAmount').textContent = '₹—';
      document.getElementById('priceSub').textContent = 'Upload a file to get a quote';
      ['bMat','bTime','bQual','bInfill','bColor','bQty','bDelivery','bTotal'].forEach(id => {
        document.getElementById(id).textContent = '—';
      });
      document.getElementById('turnaroundText').textContent = 'Upload a file to see turnaround';
      return;
    }

    // Volume in cm³, density ~1.2 g/cm³ average, weight estimation
    const volumeMm3 = L * W * H * 0.6;
    const volumeCm3 = volumeMm3 / 1000;
    const infillFactor = quoteState.infill / 100;
    const estimatedGrams = Math.max(5, volumeCm3 * 1.2 * infillFactor);

    const matCost     = estimatedGrams * quoteState.matRate;
    const printHours  = Math.max(0.5, estimatedGrams / 15);
    const printTimeCost = printHours * (window._MACHINE_RATE || 80);
    const qualityCost = (matCost + printTimeCost) * (quoteState.qualMult - 1);
    let subtotal = matCost + printTimeCost + qualityCost + quoteState.colorExtra;
    const setupFee = window._SETUP_FEE || 25;
    subtotal += setupFee;

    // Bulk discount
    let qtyMultiplier = 1;
    if (quoteState.qty >= 10) qtyMultiplier = 0.75;
    else if (quoteState.qty >= 5) qtyMultiplier = 0.85;
    const qtyTotal = subtotal * quoteState.qty * qtyMultiplier;

    // Rush multiplier
    const rushMult = quoteState.rush ? (window._RUSH_MULT || 1.5) : 1;
    const rushExtra = qtyTotal * (rushMult - 1);
    const afterRush = qtyTotal + rushExtra;

    // Delivery
    const deliveryCost = quoteState.delivery === 'sameday'
      ? (window._DELIVERY?.sameday ?? 200)
      : (window._DELIVERY?.sevenDay ?? 150);
    const rawTotal = afterRush + deliveryCost;
    const minOrder = window._MIN_ORDER || 50;
    const finalTotal = Math.round(Math.max(minOrder, rawTotal));

    // Update UI
    const priceEl = document.getElementById('priceAmount');
    priceEl.textContent = '₹' + finalTotal.toLocaleString('en-IN');
    document.getElementById('priceSub').textContent =
      `${estimatedGrams.toFixed(0)}g · ${quoteState.matName} · ${quoteState.colorName} · ${quoteState.qualName} · Qty ${quoteState.qty}${quoteState.rush ? ' · Rush' : ''}`;

    document.getElementById('bMat').textContent     = `₹${matCost.toFixed(0)} (${estimatedGrams.toFixed(0)}g × ₹${quoteState.matRate})`;
    document.getElementById('bTime').textContent    = `₹${printTimeCost.toFixed(0)} (${printHours.toFixed(1)} hrs)`;
    document.getElementById('bQual').textContent    = quoteState.qualMult === 1 ? 'Standard (×1.0)' : `${quoteState.qualName} (×${quoteState.qualMult})`;
    document.getElementById('bInfill').textContent  = quoteState.infill + '%';
    document.getElementById('bColor').textContent   = quoteState.colorExtra > 0 ? `${quoteState.colorName} +₹${quoteState.colorExtra}` : `${quoteState.colorName} (included)`;
    document.getElementById('bSetup').textContent   = `₹${setupFee}`;
    document.getElementById('bQty').textContent     = `×${quoteState.qty}` + (qtyMultiplier < 1 ? ` (${((1-qtyMultiplier)*100).toFixed(0)}% bulk discount)` : '');
    document.getElementById('bRush').textContent    = quoteState.rush ? `+₹${rushExtra.toFixed(0)} (×${rushMult})` : '—';
    document.getElementById('bDelivery').textContent = quoteState.delivery === 'sameday' ? `₹${deliveryCost} (On Priority)` : `₹${deliveryCost} (7 Days)`;
    document.getElementById('bTotal').textContent   = '₹' + finalTotal.toLocaleString('en-IN');

    // Turnaround
    const rushDays = quoteState.rush ? '1–2' : (quoteState.delivery === 'sameday' ? '1–2 (Priority)' : '5–7');
    document.getElementById('turnaroundText').textContent = `Estimated delivery: ${rushDays} working days · ${estimatedGrams.toFixed(0)}g`;

    // Animate price
    priceEl.style.transform = 'scale(1.08)';
    setTimeout(() => priceEl.style.transform = 'scale(1)', 200);
  }

  // ====== FILE UPLOAD ======
  const fileInput = document.getElementById('fileInput');
  const uploadZone = document.getElementById('uploadZone');
  const filePreview = document.getElementById('filePreview');
  const filePreviewName = document.getElementById('filePreviewName');
  const modelEmoji = document.getElementById('modelEmoji');
  const modelViewerLabel = document.getElementById('modelViewerLabel');

  function handleFile(file) {
    if (!file) return;
    quoteState.hasFile = true;
    quoteState.fileName = file.name;
    quoteState.fileSize = file.size;
    quoteState.fileData = null;
    if (file.size <= 5 * 1024 * 1024) {
      const reader = new FileReader();
      reader.onload = e => { quoteState.fileData = e.target.result; };
      reader.readAsDataURL(file);
    }
    filePreviewName.textContent = file.name;
    filePreview.style.display = 'flex';
    uploadZone.style.display = 'none';
    document.getElementById('analysingBar').classList.add('show');
    modelViewerLabel.textContent = file.name;

    const ext = file.name.split('.').pop().toLowerCase();
    if (ext === 'stl') {
      loadSTLFile(file);
    } else if (ext === 'obj') {
      loadOBJFile(file);
    } else {
      modelEmoji.textContent = '📐';
      document.getElementById('modelViewerLabel').textContent = 'Preview unavailable for .' + ext;
      document.getElementById('analysingBar').classList.remove('show');
    }

    const estimatedGrams = Math.max(5, Math.round(file.size / 5000));
    document.getElementById('dimL').value = '';
    document.getElementById('dimW').value = '';
    document.getElementById('dimH').value = '';
    quoteState.L = Math.cbrt(estimatedGrams / 1.2 * 1000) * 1.5;
    quoteState.W = quoteState.L * 0.8;
    quoteState.H = quoteState.L * 0.6;
    calculateQuote();
  }

  fileInput.addEventListener('change', e => handleFile(e.target.files[0]));
  uploadZone.addEventListener('dragover', e => { e.preventDefault(); uploadZone.classList.add('drag-over'); });
  uploadZone.addEventListener('dragleave', () => uploadZone.classList.remove('drag-over'));
  uploadZone.addEventListener('drop', e => {
    e.preventDefault();
    uploadZone.classList.remove('drag-over');
    handleFile(e.dataTransfer.files[0]);
  });

  document.getElementById('fileRemove').addEventListener('click', () => {
    clearThreeViewer();
    filePreview.style.display = 'none';
    document.getElementById('analysingBar').classList.remove('show');
    uploadZone.style.display = '';
    fileInput.value = '';
    quoteState.hasFile = false;
    quoteState.fileName = '';
    quoteState.fileData = null;
    quoteState.fileSize = 0;
    quoteState.L = quoteState.W = quoteState.H = 0;
    modelEmoji.textContent = '📦';
    modelViewerLabel.textContent = 'No file uploaded';
    calculateQuote();
  });

  // ====== ORDER / SAVE ======
  function orderNow() {
    if (!quoteState.L && !quoteState.hasFile) {
      alert('Please enter dimensions or upload a file first!');
      return;
    }
    const sec = document.getElementById('quoteContactSection');
    sec.style.display = 'block';
    updateCheckoutSummary();
    autoFillCheckout();
    qcoGoStep(1);
    sec.scrollIntoView({ behavior: 'smooth' });
  }

  // ── QUOTE CHECKOUT STEPS ──
  let _qcoStep = 1;

  function qcoGoStep(n) {
    [1,2,3].forEach(i => {
      const step   = document.getElementById('qcoStep'   + i);
      const circle = document.getElementById('qcoCircle' + i);
      const panel  = document.getElementById('qcoPanel'  + i);
      if (step)   { step.classList.remove('active','done'); if (i < n) step.classList.add('done'); else if (i === n) step.classList.add('active'); }
      if (circle && i < n) circle.innerHTML = '✓';
      if (circle && i >= n) circle.innerHTML = String(i);
      if (panel)  panel.classList.toggle('active', i === n);
    });
    _qcoStep = n;
    document.getElementById('quoteContactSection').scrollIntoView({ behavior: 'smooth', block: 'start' });
    if (n === 2) _qcoLoadReview();
    if (n === 3) _qcoLoadPayment();
  }

  function qcoAdvance() {
    if (_qcoStep === 1) {
      const name    = document.getElementById('qfName').value.trim();
      const email   = document.getElementById('qfEmail').value.trim();
      const phone   = document.getElementById('qfPhone').value.trim();
      const addr1   = document.getElementById('qfAddr1').value.trim();
      const city    = document.getElementById('qfCity').value.trim();
      const state   = document.getElementById('qfState').value.trim();
      const pincode = document.getElementById('qfPincode').value.trim();
      if (!name || !email)  { alert('Please enter your name and email.'); return; }
      if (!phone)           { alert('Please enter your phone number.'); return; }
      if (!addr1 || !city || !state || !pincode) { alert('Please fill in your complete shipping address.'); return; }
      qcoGoStep(2);
    } else if (_qcoStep === 2) {
      qcoGoStep(3);
    }
  }

  function _qcoLoadReview() {
    const name  = document.getElementById('qfName').value.trim();
    const email = document.getElementById('qfEmail').value.trim();
    const phone = document.getElementById('qfPhone').value.trim();
    const dims  = quoteState.L ? `${Math.round(quoteState.L)}×${Math.round(quoteState.W)}×${Math.round(quoteState.H)} mm` : '—';
    document.getElementById('qcoRevName').textContent    = name;
    document.getElementById('qcoRevContact').textContent = email + ' · ' + phone;
    document.getElementById('qcoRevMat').textContent     = quoteState.matName;
    document.getElementById('qcoRevQual').textContent    = quoteState.qualName;
    document.getElementById('qcoRevColor').textContent   = quoteState.colorName || 'White';
    document.getElementById('qcoRevQty').textContent     = '×' + quoteState.qty;
    document.getElementById('qcoRevDel').textContent     = quoteState.delivery === 'sameday' ? 'On Priority' : '7 working days';
    document.getElementById('qcoRevDims').textContent    = dims;
    document.getElementById('qcoRevTotal').textContent   = document.getElementById('bTotal').textContent;
  }

  function _qcoLoadPayment() {
    const total  = document.getElementById('bTotal').textContent;
    document.getElementById('qcoPayTotal').textContent = total;
    const rzpKey = window.__RZP_KEY__ || '';
    const payBtn = document.getElementById('qcoPayBtn');
    if (payBtn) {
      if (rzpKey) {
        payBtn.style.display = '';
        payBtn.textContent = '💳 Pay ' + total + ' Now →';
      } else {
        payBtn.style.display = 'none';
      }
    }
  }

  function qcoWhatsAppDiscuss() {
    const name    = document.getElementById('qfName')?.value.trim() || '';
    const mat     = quoteState.matName || '—';
    const qual    = quoteState.qualName || '—';
    const colour  = quoteState.colorName || 'White';
    const qty     = quoteState.qty || 1;
    const del     = quoteState.delivery === 'sameday' ? 'On Priority' : '7 Days';
    const total   = document.getElementById('bTotal')?.textContent || '—';
    const file    = quoteState.fileName ? `\nFile: ${quoteState.fileName}` : '';
    const msg = encodeURIComponent(
      `Hi Kyzer Robotics! I'd like to discuss the price for my 3D print order 🖨️\n\n` +
      `${name ? `Name: ${name}\n` : ''}` +
      `Material: ${mat}\nQuality: ${qual}\nColour: ${colour}\nQty: ${qty}\nDelivery: ${del}${file}\n\nEstimated Total: ${total}\n\nCould you please check if there's any flexibility on the price?`
    );
    window.open(`https://wa.me/919049695264?text=${msg}`, '_blank');
  }

  async function qcoPay() {
    const rzpKey = window.__RZP_KEY__ || '';
    if (!rzpKey) {
      alert('Payment not configured yet. Use "Submit without payment" for now.');
      return;
    }
    const rawTotal = document.getElementById('bTotal').textContent.replace(/[₹,\s]/g, '');
    const amount   = parseInt(rawTotal);
    if (!amount || amount < 1) {
      alert('Please complete your quote dimensions before paying.');
      return;
    }
    const payBtn = document.getElementById('qcoPayBtn');
    payBtn.textContent = 'Opening payment…';
    payBtn.disabled = true;
    try {
      const res = await fetch('/api/create-razorpay-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quoteParams: {
            L: quoteState.L, W: quoteState.W, H: quoteState.H,
            matName: quoteState.matName, qualName: quoteState.qualName,
            infill: quoteState.infill,
            supportLevel: 0,
            colorExtra: quoteState.colorExtra || 0,
            qty: quoteState.qty, rush: quoteState.rush || false,
            delivery: quoteState.delivery,
          },
          currency: 'INR', receipt: 'PRINT-' + Date.now()
        })
      });
      const json = await res.json();
      if (!json.ok) throw new Error(json.error || 'Could not create order');
      await _loadRazorpay();
      const name  = document.getElementById('qfName').value.trim();
      const email = document.getElementById('qfEmail').value.trim();
      const phone = document.getElementById('qfPhone').value.trim();
      const rzp = new window.Razorpay({
        key: rzpKey, amount: json.order.amount, currency: json.order.currency,
        name: 'Kyzer Robotics', description: '3D Print Order',
        image: './logo.png', order_id: json.order.id,
        prefill: { name, email, contact: phone },
        theme: { color: '#FF8C35' },
        handler: async (response) => { await _qcoVerifyPayment(response); },
      });
      rzp.on('payment.failed', () => {
        payBtn.textContent = '💳 Pay ' + document.getElementById('bTotal').textContent + ' Now →';
        payBtn.disabled = false;
      });
      rzp.open();
      payBtn.textContent = '💳 Pay ' + document.getElementById('bTotal').textContent + ' Now →';
      payBtn.disabled = false;
    } catch(e) {
      payBtn.textContent = '💳 Pay ' + document.getElementById('bTotal').textContent + ' Now →';
      payBtn.disabled = false;
      alert('Could not start payment: ' + e.message + '. Try "Submit without payment" instead.');
    }
  }

  async function _qcoVerifyPayment(rzpResp) {
    const order = _buildQcoOrder('paid');
    order.razorpayOrderId   = rzpResp.razorpay_order_id;
    order.razorpayPaymentId = rzpResp.razorpay_payment_id;
    const total = parseInt(document.getElementById('bTotal').textContent.replace(/[₹,\s]/g,'')) || 0;
    try {
      const res = await fetch('/api/verify-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          razorpay_order_id:   rzpResp.razorpay_order_id,
          razorpay_payment_id: rzpResp.razorpay_payment_id,
          razorpay_signature:  rzpResp.razorpay_signature,
          orderData: { ...order,
            items: [{ name: `3D Print · ${order.material} · ${order.quality}`, qty: order.quantity, price: total }],
            total, shippingFull: [order.shipping.addr1, order.shipping.city, order.shipping.state, order.shipping.pincode].filter(Boolean).join(', ')
          }
        })
      });
      const data = await res.json();
      if (data.ok) {
        _saveQcoOrder(order);
        _showQcoSuccess('✓ Payment successful! Order confirmed — check your email for confirmation.');
      } else { throw new Error(data.error); }
    } catch(e) {
      _saveQcoOrder(order);
      _showQcoSuccess('✓ Payment received (ref: ' + rzpResp.razorpay_payment_id + '). Order confirmed!');
    }
  }

  async function qcoSubmitWithoutPayment() {
    const btn = document.getElementById('qcoPayLaterBtn');
    btn.textContent = 'Submitting…';
    btn.disabled = true;
    const order = _buildQcoOrder('pending_payment');
    _saveQcoOrder(order);
    try {
      await fetch('/api/print-quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order),
      });
    } catch(e) {}
    _showQcoSuccess('✓ Quote request received! We\'ll confirm pricing and send a payment link within a few hours.');
    btn.textContent = 'Submit without payment';
    btn.disabled = false;
  }

  function _buildQcoOrder(paymentStatus) {
    const dims = quoteState.L ? `${Math.round(quoteState.L)}×${Math.round(quoteState.W)}×${Math.round(quoteState.H)} mm` : '—';
    return {
      id: 'ORD-' + Date.now(), submittedAt: new Date().toISOString(),
      status: 'new', paymentStatus,
      name:    document.getElementById('qfName').value.trim(),
      email:   document.getElementById('qfEmail').value.trim(),
      phone:   document.getElementById('qfPhone').value.trim(),
      company: document.getElementById('qfCompany').value.trim(),
      notes:   document.getElementById('qfNotes').value.trim(),
      shipping: {
        addr1:    document.getElementById('qfAddr1').value.trim(),
        addr2:    document.getElementById('qfAddr2').value.trim(),
        city:     document.getElementById('qfCity').value.trim(),
        state:    document.getElementById('qfState').value.trim(),
        pincode:  document.getElementById('qfPincode').value.trim(),
        landmark: document.getElementById('qfLandmark').value.trim(),
      },
      material: quoteState.matName, quality: quoteState.qualName,
      infill:   document.getElementById('infillVal').textContent,
      colour:   quoteState.colorName || 'White',
      quantity: quoteState.qty, delivery: quoteState.delivery,
      fileName: quoteState.fileName || '', fileData: quoteState.fileData || null,
      fileSize: quoteState.fileSize || 0, dimensions: dims,
      estimatedTotal: document.getElementById('bTotal').textContent,
    };
  }

  function _saveQcoOrder(order) {
    const orders = JSON.parse(localStorage.getItem('kyzer_print_orders') || '[]');
    orders.unshift(order);
    localStorage.setItem('kyzer_print_orders', JSON.stringify(orders));
    const _sbUrl = (typeof SUPABASE_URL !== 'undefined' && SUPABASE_URL) || '';
    const _sbKey = (typeof SUPABASE_KEY !== 'undefined' && SUPABASE_KEY) || '';
    if (_sbUrl && _sbKey) {
      fetch(_sbUrl + '/rest/v1/orders', {
        method: 'POST',
        headers: { 'apikey': _sbKey, 'Authorization': 'Bearer ' + _sbKey, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
        body: JSON.stringify({ id: order.id, status: 'new', data: order })
      }).catch(() => {});
    }
  }

  function _showQcoSuccess(msg) {
    const el = document.getElementById('qfSuccess');
    if (el) { el.innerHTML = msg; el.style.display = 'block'; }
    const p = document.getElementById('qcoPayBtn');
    const l = document.getElementById('qcoPayLaterBtn');
    if (p) p.style.display = 'none';
    if (l) l.style.display = 'none';
  }

  function _loadRazorpay() {
    return new Promise((resolve, reject) => {
      if (window.Razorpay) { resolve(); return; }
      const s = document.createElement('script');
      s.src = 'https://checkout.razorpay.com/v1/checkout.js';
      s.onload = resolve; s.onerror = reject;
      document.head.appendChild(s);
    });
  }

  // ====== THREE.JS MODEL VIEWER ======
  let _threeRenderer = null, _threeAnimId = null, _threeControls = null;

  function clearThreeViewer() {
    if (_threeAnimId) { cancelAnimationFrame(_threeAnimId); _threeAnimId = null; }
    if (_threeControls) { _threeControls.dispose(); _threeControls = null; }
    if (_threeRenderer) { _threeRenderer.dispose(); _threeRenderer = null; }
    document.getElementById('threeCanvas').style.display = 'none';
    document.getElementById('modelViewer').style.cursor = 'pointer';
    document.getElementById('modelPlaceholderWrap').style.display = 'flex';
    document.getElementById('modelViewerHint').style.display = 'none';
    window._threeModel = null;
  }

  function showThreeModel(object) {
    if (typeof THREE === 'undefined' || !window._OrbitControls) {
      showUnsupportedPreview('stl');
      return;
    }
    const container = document.getElementById('modelViewer');
    const canvas = document.getElementById('threeCanvas');
    clearThreeViewer();

    const w = container.clientWidth;
    const h = container.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x2a2a2a);
    const camera = new THREE.PerspectiveCamera(45, w / h, 0.01, 100000);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    _threeRenderer = renderer;

    scene.add(new THREE.AmbientLight(0xffffff, 0.8));
    const key = new THREE.DirectionalLight(0xffffff, 1.4);
    key.position.set(5, 10, 7);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xffeedd, 0.6);
    fill.position.set(-5, -4, -5);
    scene.add(fill);
    const back = new THREE.DirectionalLight(0xffffff, 0.3);
    back.position.set(0, -10, -5);
    scene.add(back);

    const box = new THREE.Box3().setFromObject(object);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    object.position.sub(center);
    const maxDim = Math.max(size.x, size.y, size.z);
    object.scale.setScalar(4 / maxDim);
    scene.add(object);
    window._threeModel = object;

    const scaledRadius = Math.sqrt(size.x ** 2 + size.y ** 2 + size.z ** 2) / 2 * (4 / maxDim);
    const dist = (scaledRadius / Math.tan((camera.fov / 2) * Math.PI / 180)) * 1.3;
    camera.position.copy(new THREE.Vector3(0.6, 0.4, 0.7).normalize().multiplyScalar(dist));
    camera.lookAt(0, 0, 0);

    const controls = new window._OrbitControls(camera, canvas);
    controls.target.set(0, 0, 0);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.update();
    _threeControls = controls;

    canvas.style.display = 'block';
    document.getElementById('modelViewer').style.cursor = 'default';
    document.getElementById('modelPlaceholderWrap').style.display = 'none';
    document.getElementById('modelViewerHint').style.display = 'block';
    document.getElementById('analysingBar').classList.remove('show');
    document.getElementById('modelStats').classList.add('show');
    document.getElementById('statDims').textContent = size.x.toFixed(1)+'×'+size.y.toFixed(1)+'×'+size.z.toFixed(1)+' mm';
    const vol = (size.x * size.y * size.z * 0.2).toFixed(1);
    document.getElementById('statVol').textContent = vol + ' cm³';
    document.getElementById('statWeight').textContent = (vol * 1.24).toFixed(1) + ' g (PLA est.)';

    function animate() {
      _threeAnimId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    }
    animate();
  }

  function loadSTLFile(file) {
    const reader = new FileReader();
    reader.onload = e => {
      try {
        const geometry = new window._STLLoader().parse(e.target.result);
        geometry.computeVertexNormals();
        const mat = new THREE.MeshStandardMaterial({ color: 0xFF8C35, roughness: 0.4, metalness: 0.1 });
        showThreeModel(new THREE.Mesh(geometry, mat));
      } catch(err) { console.error('STL preview:', err); showUnsupportedPreview('stl'); }
    };
    reader.readAsArrayBuffer(file);
  }

  function loadOBJFile(file) {
    const reader = new FileReader();
    reader.onload = e => {
      try {
        const obj = new window._OBJLoader().parse(e.target.result);
        obj.traverse(c => {
          if (c.isMesh) { c.geometry.computeVertexNormals(); c.material = new THREE.MeshStandardMaterial({ color: 0xFF8C35, roughness: 0.4, metalness: 0.1 }); }
        });
        showThreeModel(obj);
      } catch(err) { console.error('OBJ preview:', err); showUnsupportedPreview('obj'); }
    };
    reader.readAsText(file);
  }

  function showUnsupportedPreview(ext) {
    document.getElementById('analysingBar').classList.remove('show');
    document.getElementById('modelEmoji').textContent = '📐';
    document.getElementById('modelViewerLabel').textContent = 'Preview unavailable for .' + ext;
  }

  // Populate the checkout order summary panel
  function updateCheckoutSummary() {
    const dims = quoteState.L
      ? `${Math.round(quoteState.L)}×${Math.round(quoteState.W)}×${Math.round(quoteState.H)} mm`
      : '—';
    const del = quoteState.delivery === 'sameday' ? 'On Priority' : '7 working days';
    const txt = (id) => { const el = document.getElementById(id); return el ? el.textContent : '—'; };
    document.getElementById('cs-material').textContent  = quoteState.matName || '—';
    document.getElementById('cs-quality').textContent   = quoteState.qualName || '—';
    document.getElementById('cs-infill').textContent    = txt('infillVal') + '%';
    document.getElementById('cs-colour').textContent    = quoteState.colorName || '—';
    document.getElementById('cs-qty').textContent       = quoteState.qty;
    document.getElementById('cs-delivery').textContent  = del;
    document.getElementById('cs-dims').textContent      = dims;
    document.getElementById('cs-total').textContent     = '₹' + txt('bTotal');
    const fileWrap = document.getElementById('cs-file-wrap');
    if (quoteState.fileName) {
      fileWrap.style.display = '';
      document.getElementById('cs-filename').textContent = quoteState.fileName;
    } else {
      fileWrap.style.display = 'none';
    }
  }

  async function submitQuoteForm() {
    const name   = document.getElementById('qfName').value.trim();
    const email  = document.getElementById('qfEmail').value.trim();
    const phone  = document.getElementById('qfPhone').value.trim();
    const addr1  = document.getElementById('qfAddr1').value.trim();
    const city   = document.getElementById('qfCity').value.trim();
    const state  = document.getElementById('qfState').value.trim();
    const pincode = document.getElementById('qfPincode').value.trim();

    if (!name || !email)  { alert('Please enter your name and email.'); return; }
    if (!phone)           { alert('Please enter your phone number.'); return; }
    if (!addr1 || !city || !state || !pincode) { alert('Please fill in your complete shipping address.'); return; }

    const btn = document.getElementById('qfSubmitBtn');
    btn.textContent = 'Placing order...';
    btn.disabled = true;

    const dims = quoteState.L
      ? `${Math.round(quoteState.L)}×${Math.round(quoteState.W)}×${Math.round(quoteState.H)} mm`
      : '—';

    const shipping = {
      addr1,
      addr2:    document.getElementById('qfAddr2').value.trim(),
      city,
      state,
      pincode,
      landmark: document.getElementById('qfLandmark').value.trim(),
    };
    const shippingFull = [addr1, shipping.addr2, city, state, pincode, shipping.landmark]
      .filter(Boolean).join(', ');

    // Save order to localStorage for admin panel
    const order = {
      id:           'ORD-' + Date.now(),
      submittedAt:  new Date().toISOString(),
      status:       'new',
      name, email, phone,
      company:      document.getElementById('qfCompany').value.trim(),
      notes:        document.getElementById('qfNotes').value.trim(),
      shipping,
      material:     quoteState.matName,
      quality:      quoteState.qualName,
      infill:       document.getElementById('infillVal').textContent,
      colour:       quoteState.colorName || 'White',
      quantity:     quoteState.qty,
      delivery:     quoteState.delivery,
      fileName:     quoteState.fileName || '',
      fileData:     quoteState.fileData || null,
      fileSize:     quoteState.fileSize || 0,
      dimensions:   dims,
      estimatedTotal: document.getElementById('bTotal').textContent,
    };
    const _orders = JSON.parse(localStorage.getItem('kyzer_print_orders') || '[]');
    _orders.unshift(order);
    localStorage.setItem('kyzer_print_orders', JSON.stringify(_orders));

    // Non-blocking: push to Supabase so admin gets real-time notification
    (function() {
      const _sbUrl = (typeof SUPABASE_URL !== 'undefined' && SUPABASE_URL) || '';
      const _sbKey = (typeof SUPABASE_KEY !== 'undefined' && SUPABASE_KEY) || '';
      if (!_sbUrl || !_sbKey) return;
      fetch(_sbUrl + '/rest/v1/orders', {
        method: 'POST',
        headers: {
          'apikey': _sbKey, 'Authorization': 'Bearer ' + _sbKey,
          'Content-Type': 'application/json', 'Prefer': 'return=minimal'
        },
        body: JSON.stringify({ id: order.id, status: 'new', data: order })
      }).catch(() => {});
    })();

    try {
      await fetch('/api/print-quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id:             order.id,
          name, email, phone,
          company:        document.getElementById('qfCompany').value.trim(),
          material:       quoteState.matName,
          quality:        quoteState.qualName,
          infill:         document.getElementById('infillVal').textContent + '%',
          colour:         quoteState.colorName || 'White',
          quantity:       quoteState.qty,
          delivery:       quoteState.delivery,
          fileName:       quoteState.fileName || '',
          dimensions:     dims,
          estimatedTotal: document.getElementById('bTotal').textContent,
          notes:          document.getElementById('qfNotes').value.trim(),
          shipping,
        }),
      });
    } catch(_) {}
    btn.style.display = 'none';
    document.getElementById('qfSuccess').style.display = 'block';
  }

  // ====== LOAD FROM ADMIN STORAGE ======
  function applyAdminStorage() {
    const ld = (key, def) => JSON.parse(localStorage.getItem(key) || 'null') || def;

    // Categories — fully re-render tiles and filter tabs from saved array
    const savedCats = JSON.parse(localStorage.getItem('kyzer_categories') || 'null');
    renderCategoryTiles(savedCats);

    // Products
    const savedProducts = localStorage.getItem('kyzer_products');
    if (savedProducts) {
      const arr = JSON.parse(savedProducts).filter(p => p.visible);
      document.getElementById('productsGrid').innerHTML = arr.map(p => {
        const pd = JSON.stringify({
          id: p.id, emoji: p.emoji, badge: p.badge, badgeType: p.badgeType || '',
          name: p.name, price: p.price, description: p.description,
          details: p.details || '', specs: p.specs || [],
        }).replace(/'/g, '&#39;');
        const firstPhoto = (p.photos && p.photos.length > 0) ? p.photos[0] : (p.photo || null);
        const cardImg = firstPhoto ? `<img src="${firstPhoto}" alt="${p.name}">` : p.emoji;
        const _cnp = parseNumericPrice(p.price);
        const _isFrom = p.price && String(p.price).toLowerCase().startsWith('from');
        const priceHtml = p.price
          ? `<span class="prod-price">${_cnp > 0 ? '₹' + _cnp.toLocaleString('en-IN') : p.price}</span>`
          : '';
        const actionBtns = _isFrom
          ? `<button class="prod-cart-btn" onclick="event.stopPropagation();showPage('quote')">Get Quote</button>
             <button class="prod-buy-btn" onclick="event.stopPropagation();_cardEnquire(this)">Order →</button>`
          : `<button class="prod-cart-btn" onclick="event.stopPropagation();_cardAddToCart(this)">+ Cart</button>
             <button class="prod-buy-btn" onclick="event.stopPropagation();_cardBuyNow(this)">Buy Now →</button>`;
        return `
        <div class="prod-card" data-cat="${p.category}" data-subcat="${p.subcat||''}" data-frame-type="${p.frameType||''}" data-material="${p.material||''}" data-wheelbase="${p.wheelbase||''}" onclick="openProduct(this)" data-product='${pd}'>
          <div class="prod-img">${cardImg}</div>
          <div class="prod-body">
            <span class="prod-badge ${p.badgeType}">${p.badge}</span>
            <h4>${p.name}</h4>
            <p>${p.description}</p>
            <div class="prod-footer">${priceHtml}</div>
            <div class="prod-actions">${actionBtns}</div>
          </div>
        </div>`;
      }).join('');
      if (typeof updateCatCounts === 'function') updateCatCounts();
    }

    // Hero
    const hero = ld('kyzer_hero', null);
    if (hero) {
      if (hero.tag) document.querySelector('.hero-tag').textContent = hero.tag;
      if (hero.l1 || hero.l2 || hero.l3) {
        document.querySelector('.hero h1').innerHTML =
          `${hero.l1 || 'Build.'}<br>${hero.l2 || 'Fly.'}<br><span class="accent">${hero.l3 || 'Innovate.'}</span>`;
      }
      if (hero.sub) document.querySelector('.hero-sub').textContent = hero.sub;
      if (hero.stats) {
        const nums = document.querySelectorAll('.hero-stat-num');
        const lbls = document.querySelectorAll('.hero-stat-label');
        hero.stats.forEach((s, i) => {
          if (nums[i]) { nums[i].textContent = s.num; nums[i].removeAttribute('data-count'); }
          if (lbls[i]) lbls[i].textContent = s.lbl;
        });
      }
    }

    // Services
    const svcs = ld('kyzer_services', null);
    if (svcs) {
      const items = document.querySelectorAll('.service-card');
      svcs.forEach((s, i) => {
        if (!items[i]) return;
        items[i].querySelector('h3').textContent = s.title;
        items[i].querySelector('p').textContent = s.desc;
      });
    }

    // Contact — always enforce correct email
    const _ciRaw = ld('kyzer_contact', null);
    if (_ciRaw) { _ciRaw.email = 'info@kyzerrobotics.com'; }
    const ci = _ciRaw;
    if (ci) {
      // Section label & title
      const secLbl = document.querySelector('#contact .sec-label');
      const secTitle = document.querySelector('#contact .sec-title');
      if (secLbl  && ci.secLabel) secLbl.textContent = ci.secLabel;
      if (secTitle && (ci.title1 || ci.title2))
        secTitle.innerHTML = (ci.title1 || "Let's build") + '<br>' + (ci.title2 || 'something.');
      // Heading & description
      const ciH3 = document.querySelector('.contact-info h3');
      const descEl = document.querySelector('.contact-info p');
      if (ciH3  && ci.heading) ciH3.textContent = ci.heading;
      if (descEl && ci.desc)   descEl.textContent = ci.desc;
      // Contact info rows
      const rows = document.querySelectorAll('.ci-row');
      const icon = r => r.querySelector('.ci-icon').outerHTML;
      if (rows[0] && ci.loc)    rows[0].innerHTML = icon(rows[0]) + ' ' + ci.loc;
      if (rows[1] && ci.email)  rows[1].innerHTML = icon(rows[1]) + ' <a href="mailto:' + ci.email + '">' + ci.email + '</a>';
      if (rows[2] && ci.phone)  rows[2].innerHTML = icon(rows[2]) + ' <a href="tel:' + ci.phone.replace(/\D/g,'') + '">' + ci.phone + '</a>';
      // Form subjects dropdown
      if (ci.subjects && ci.subjects.length) {
        const sel = document.getElementById('contactSubject');
        if (sel) {
          const placeholder = sel.options[0];
          sel.innerHTML = '';
          sel.appendChild(placeholder);
          ci.subjects.forEach(s => {
            const opt = document.createElement('option');
            opt.value = s; opt.textContent = s;
            sel.appendChild(opt);
          });
        }
      }
    }

    // Links (from Links tab in admin)
    const lk = ld('kyzer_links', null);
    const ciRows = document.querySelectorAll('.ci-row');
    const ciIcon = r => r.querySelector('.ci-icon').outerHTML;
    if (lk) {
      const ph = (lk.phone || '').replace(/\D/g,'');
      const em = lk.email || '';
      if (ciRows[1] && em  && !(ci && ci.email))  ciRows[1].innerHTML = ciIcon(ciRows[1]) + ' <a href="mailto:' + em + '">' + em + '</a>';
      if (ciRows[2] && ph  && !(ci && ci.phone))  ciRows[2].innerHTML = ciIcon(ciRows[2]) + ' <a href="tel:+' + ph + '">' + lk.phone + '</a>';
      // rebuild social rows from the socials array
      const socialWrap = document.querySelector('.contact-info');
      if (socialWrap && lk.socials) {
        const existing = socialWrap.querySelectorAll('.ci-row');
        // remove rows beyond index 3 (keep loc, email, phone, hardcoded instagram)
        for (let i = existing.length - 1; i >= 4; i--) existing[i].remove();
        lk.socials.filter(s => s.visible && !/instagram/i.test(s.label)).forEach(s => {
          const row = document.createElement('div');
          row.className = 'ci-row';
          row.innerHTML = '<div class="ci-icon">' + s.icon + '</div> <a href="' + s.url + '" target="_blank" rel="noopener">' + s.label + '</a>';
          socialWrap.appendChild(row);
        });
      }
    }

    // Hero photos
    const heroPhotos = JSON.parse(localStorage.getItem('kyzer_hero_photos') || '[]');
    if (heroPhotos.length >= 2) {
      const colA = document.querySelector('.photo-col-a');
      const colB = document.querySelector('.photo-col-b');
      if (colA && colB) {
        const half = Math.ceil(heroPhotos.length / 2);
        const buildCol = (col, imgs) => {
          const looped = [...imgs, ...imgs];
          col.innerHTML = looped.map(src => `<img src="${src}" alt="">`).join('');
        };
        buildCol(colA, heroPhotos.slice(0, half));
        buildCol(colB, heroPhotos.slice(half).length ? heroPhotos.slice(half) : heroPhotos.slice(0, half));
      }
    }

    // Quote settings
    const q = ld('kyzer_quote', null);
    if (q) {
      window._MACHINE_RATE = q.machineRate || 80;
      window._DELIVERY = { sameday: q.sameDayFee || 200, sevenDay: q.sevenDayFee || 150 };
      window._SETUP_FEE  = q.setupFee   != null ? q.setupFee   : 25;
      window._RUSH_MULT  = q.rushMult   != null ? q.rushMult   : 1.5;
      window._MIN_ORDER  = q.minOrder   != null ? q.minOrder   : 50;
      // Update color swatch premiums if admin has configured them
      if (q.colorPremiums) {
        document.querySelectorAll('.color-swatch').forEach(sw => {
          const name = sw.dataset.name;
          if (q.colorPremiums[name] != null) sw.dataset.premium = q.colorPremiums[name];
        });
      }
      // Rebuild material buttons
      if (q.materials && q.materials.length) {
        const grid = document.querySelector('.material-grid');
        if (grid) {
          grid.innerHTML = q.materials.map((m, i) => `
            <button class="mat-btn ${i===0?'selected':''}" data-mat="${m.name}" data-rate="${m.rate}" onclick="selectMat(this)"
              ${i === q.materials.length - 1 && q.materials.length % 2 !== 0 ? 'style="grid-column:span 2;"' : ''}>
              ${m.name} <span>₹${m.rate}/g · ${m.desc}</span>
            </button>
          `).join('');
          quoteState.matRate = q.materials[0].rate;
          quoteState.matName = q.materials[0].name;
        }
      }
    }
  }

  // Upgrades every .prod-card button to Buy Now / Get Quote based on its data-product price
  function upgradeStaticCards() {
    document.querySelectorAll('.prod-card').forEach(card => {
      try {
        const d = JSON.parse(card.dataset.product || '{}');
        if (!d.price) return;
        const np = parseNumericPrice(d.price);
        const isFrom = String(d.price).toLowerCase().startsWith('from');
        const footer = card.querySelector('.prod-footer');
        if (!footer) return;
        // Add price span if missing (e.g. dynamic cards without price)
        if (!footer.querySelector('.prod-price')) {
          const ps = document.createElement('span');
          ps.className = 'prod-price';
          if (np > 0 && d.originalPrice) {
            const op = parseNumericPrice(d.originalPrice);
            if (op > np) {
              const pct = Math.round(((op - np) / op) * 100);
              ps.innerHTML = `<span class="prod-discount-badge"><span class="prod-mrp">₹${op.toLocaleString('en-IN')}</span><span class="prod-off">${pct}% OFF</span></span>₹${np.toLocaleString('en-IN')}`;
            } else {
              ps.textContent = '₹' + np.toLocaleString('en-IN');
            }
          } else {
            ps.textContent = np > 0 ? '₹' + np.toLocaleString('en-IN') : d.price;
          }
          footer.insertBefore(ps, footer.firstChild);
        }
        // Upgrade button style and label
        const btn = footer.querySelector('button');
        if (!btn) return;
        if (np > 0 && !btn.classList.contains('prod-btn-buy')) {
          btn.textContent = 'Buy Now →';
          btn.classList.add('prod-btn-buy');
        } else if (isFrom) {
          btn.textContent = 'Get Quote →';
        }
      } catch (e) {}
    });
  }

  // ── COMING SOON ──
  let _csTimerStarted = false;
  function checkComingSoon() {
    const cs = JSON.parse(localStorage.getItem('kyzer_coming_soon') || 'null');
    if (!cs || !cs.enabled) return;
    if (location.search.includes('preview') || localStorage.getItem('kyzer_admin_authed') === '1') return;
    const overlay = document.getElementById('comingSoonOverlay');
    if (!overlay || overlay.classList.contains('active')) return;
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';

    if (cs.headline) document.getElementById('csHeadline').textContent = cs.headline;
    if (cs.tagline)  document.getElementById('csTagline').textContent  = cs.tagline;

    if (!_csTimerStarted) {
      _csTimerStarted = true;
      const launch = new Date(cs.date || 'June 2, 2026 00:00:00 IST');
      function tick() {
        const diff = launch - Date.now();
        if (diff <= 0) {
          overlay.classList.remove('active');
          document.body.style.overflow = '';
          return;
        }
        const d = Math.floor(diff / 864e5);
        const h = Math.floor((diff % 864e5) / 36e5);
        const m = Math.floor((diff % 36e5) / 6e4);
        const s = Math.floor((diff % 6e4) / 1e3);
        document.getElementById('csDays').textContent  = String(d).padStart(2,'0');
        document.getElementById('csHours').textContent = String(h).padStart(2,'0');
        document.getElementById('csMins').textContent  = String(m).padStart(2,'0');
        document.getElementById('csSecs').textContent  = String(s).padStart(2,'0');
      }
      tick();
      setInterval(tick, 1000);
    }
  }
  checkComingSoon();

  function csSignup() {
    const email = document.getElementById('csEmail').value.trim();
    if (!email || !email.includes('@')) { alert('Please enter a valid email.'); return; }
    const subs = JSON.parse(localStorage.getItem('kyzer_cs_subscribers') || '[]');
    if (!subs.includes(email)) { subs.push(email); localStorage.setItem('kyzer_cs_subscribers', JSON.stringify(subs)); }
    fetch('/api/cs-subscribe', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ email }) }).catch(()=>{});
    document.getElementById('csSignupMsg').style.display = '';
    document.getElementById('csEmail').style.display = 'none';
    document.querySelector('#comingSoonOverlay .cs-notify-wrap button').style.display = 'none';
  }

  // ── GOOGLE ANALYTICS (GA4) ──
  (function initGA() {
    const gid = localStorage.getItem('kyzer_ga_id') || '';
    if (!gid || !gid.startsWith('G-')) return;
    const s = document.createElement('script');
    s.async = true; s.src = 'https://www.googletagmanager.com/gtag/js?id=' + gid;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    window.gtag = gtag;
    gtag('js', new Date()); gtag('config', gid);
  })();

  // ── VISIT COUNTER ──
  (function trackVisit() {
    fetch('/api/track-visit', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ page: location.pathname }) }).catch(()=>{});
  })();

  // Apply local data first (instant)
  applyAdminStorage();
  upgradeStaticCards();

  // Then fetch from Supabase and re-apply if configured
  (function fetchFromSupabase() {
    const sbUrl = (typeof SUPABASE_URL !== 'undefined' && SUPABASE_URL) || '';
    const sbKey = (typeof SUPABASE_KEY !== 'undefined' && SUPABASE_KEY) || '';
    if (!sbUrl || !sbKey) return;
    fetch(sbUrl + '/rest/v1/site_data?id=eq.1&select=*', {
      headers: { 'apikey': sbKey, 'Authorization': 'Bearer ' + sbKey }
    })
    .then(r => r.ok ? r.json() : null)
    .then(rows => {
      if (!rows || !rows.length) return;
      const row = rows[0];
      const map = {
        kyzer_products:    row.products,
        kyzer_categories:  row.categories,
        kyzer_hero:        row.hero,
        kyzer_services:    row.services,
        kyzer_contact:     row.contact,
        kyzer_links:       row.links,
        kyzer_quote:       row.quote,
        kyzer_hero_photos: row.hero_photos,
        kyzer_coming_soon: row.coming_soon,
      };
      Object.entries(map).forEach(([k, v]) => {
        if (v !== null && v !== undefined) localStorage.setItem(k, JSON.stringify(v));
      });
      applyAdminStorage();
      upgradeStaticCards();
      checkComingSoon();
    })
    .catch(() => {});
  })();

  // ── SCROLL-AWARE HEADER ──
  (function initScrollNav() {
    let lastY = 0, ticking = false;
    const nav = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        if (y > lastY && y > 80) nav.classList.add('nav-hidden');
        else nav.classList.remove('nav-hidden');
        lastY = y;
        ticking = false;
      });
    }, { passive: true });
  })();

  // ── SCROLL CARD ANIMATIONS ──
  (function initCardReveal() {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) {
          setTimeout(() => e.target.classList.add('visible'), i * 80);
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.prod-card').forEach(c => {
      c.classList.add('card-reveal');
      io.observe(c);
    });
  })();

  // ── CART BADGE BOUNCE ──
  const _origUpdateCartBadge = updateCartBadge;
  window.updateCartBadge = function() {
    _origUpdateCartBadge();
    const badge = document.getElementById('navCartBadge');
    if (badge && badge.style.display !== 'none') {
      badge.classList.remove('bounce');
      void badge.offsetWidth;
      badge.classList.add('bounce');
      setTimeout(() => badge.classList.remove('bounce'), 450);
    }
  };

  // ── FREE SHIPPING BAR ──
  const FREE_SHIP_THRESHOLD = 999;
  const _origRenderCartDrawer = renderCartDrawer;
  window.renderCartDrawer = function() {
    _origRenderCartDrawer();
    const bar = document.getElementById('freeShipBar');
    if (!bar) return;
    const tot = cartTotal();
    if (tot <= 0) { bar.innerHTML = ''; return; }
    if (tot >= FREE_SHIP_THRESHOLD) {
      bar.innerHTML = `<div class="free-ship-bar achieved">🎉 You qualify for <strong>free delivery</strong>!</div>`;
    } else {
      const rem = FREE_SHIP_THRESHOLD - tot;
      const pct = Math.round((tot / FREE_SHIP_THRESHOLD) * 100);
      bar.innerHTML = `<div class="free-ship-bar">Add <strong>₹${rem.toLocaleString('en-IN')}</strong> more for free delivery 🚚<div class="free-ship-progress"><div class="free-ship-progress-fill" style="width:${pct}%"></div></div></div>`;
    }
  };

  // ── CHECKOUT STEPS ──
  let _coCurrentStep = 1;
  function coGoStep(n) {
    if (n < 1 || n > 3) return;
    if (n > _coCurrentStep + 1) return;
    _coCurrentStep = n;
    [1,2,3].forEach(i => {
      const step = document.getElementById('coStep' + i);
      const panel = document.getElementById('coPanel' + i);
      if (step) { step.classList.remove('active','done'); if (i < n) step.classList.add('done'); else if (i === n) step.classList.add('active'); }
      if (panel) { panel.classList.remove('active'); if (i === n) panel.classList.add('active'); }
    });
    if (n === 2) loadCheckoutReview();
    if (n === 3) loadCheckoutPayment();
    document.getElementById('checkoutPage')?.scrollTo({ top: 0, behavior: 'smooth' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  function coAdvance() {
    if (_coCurrentStep === 1) {
      const name = document.getElementById('coName').value.trim();
      const email = document.getElementById('coEmail').value.trim();
      const phone = document.getElementById('coPhone').value.trim();
      const addr1 = document.getElementById('coAddr1').value.trim();
      const city  = document.getElementById('coCity').value.trim();
      const pin   = document.getElementById('coPincode').value.trim();
      if (!name || !email || !phone || !addr1 || !city || !pin) {
        alert('Please fill in all required fields (*)'); return;
      }
      coGoStep(2);
    } else if (_coCurrentStep === 2) {
      coGoStep(3);
    }
  }
  function loadCheckoutReview() {
    const items = cart.map(i => {
      const np = parseNumericPrice(i.price);
      return `<div class="co-cart-item-row">
        <div class="co-cart-thumb">${i.photo ? `<img src="${i.photo}">` : i.emoji || '📦'}</div>
        <div class="co-cart-item-name">${i.name} × ${i.qty}</div>
        <div style="font-weight:600;color:var(--orange);">${np ? '₹' + (np*i.qty).toLocaleString('en-IN') : i.price}</div>
      </div>`;
    }).join('');
    const rev = document.getElementById('coReviewItems');
    if (rev) rev.innerHTML = items || '<p style="color:var(--muted);font-size:14px;">Cart is empty.</p>';
    const addrEl = document.getElementById('coReviewAddress');
    if (addrEl) {
      const parts = [
        document.getElementById('coName')?.value,
        document.getElementById('coPhone')?.value,
        document.getElementById('coAddr1')?.value,
        document.getElementById('coAddr2')?.value,
        [document.getElementById('coCity')?.value, document.getElementById('coState')?.value, document.getElementById('coPincode')?.value].filter(Boolean).join(', '),
        document.getElementById('coLandmark')?.value,
      ].filter(Boolean);
      addrEl.innerHTML = parts.join('<br>');
    }
    renderCheckoutSummary();
  }
  function loadCheckoutPayment() {
    renderCheckoutSummary();
    // Default to online if Razorpay key available, else COD
    const hasKey = !!(window.__RZP_KEY__ || localStorage.getItem('kyzer_razorpay_key_id'));
    selectPayMethod(hasKey ? 'online' : 'cod');
  }

  function selectPayMethod(mode) {
    window._payMethod = mode;
    const onlineBtn  = document.getElementById('payMethodOnlineBtn');
    const codBtn     = document.getElementById('payMethodCODBtn');
    const note       = document.getElementById('payMethodNote');
    const badges     = document.getElementById('payOnlineBadges');
    const submitBtn  = document.getElementById('coSubmitBtn');
    if (!onlineBtn) return;

    if (mode === 'online') {
      onlineBtn.style.background = 'var(--orange)';
      onlineBtn.style.borderColor = 'var(--orange)';
      onlineBtn.style.color = '#111';
      codBtn.style.background = 'var(--bg3)';
      codBtn.style.borderColor = 'var(--border)';
      codBtn.style.color = 'var(--muted)';
      if (badges) badges.style.display = 'flex';
      if (note) note.textContent = 'Card, UPI, Netbanking & Wallets — secured by Razorpay.';
      if (submitBtn) submitBtn.textContent = 'Pay Online →';
    } else {
      codBtn.style.background = 'var(--orange)';
      codBtn.style.borderColor = 'var(--orange)';
      codBtn.style.color = '#111';
      onlineBtn.style.background = 'var(--bg3)';
      onlineBtn.style.borderColor = 'var(--border)';
      onlineBtn.style.color = 'var(--muted)';
      if (badges) badges.style.display = 'none';
      if (note) note.textContent = 'Pay with cash when your order is delivered.';
      if (submitBtn) submitBtn.textContent = 'Place Order (COD) →';
    }
  }

  // Re-init step on checkout open
  const _origShowPage = showPage;
  window.showPage = function(p) {
    _origShowPage(p);
    if (p === 'checkout') {
      _coCurrentStep = 1;
      loadCheckoutPage();
      coGoStep(1);
    }
    if (p !== 'main') {
      const loader = document.getElementById('pageLoader');
      if (loader) { loader.classList.add('show'); setTimeout(() => loader.classList.remove('show'), 350); }
    }
  };

  function saveQuote() {
    const quoteNo  = 'KR-' + Date.now().toString().slice(-6);
    const today    = new Date().toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' });
    const validTil = new Date(Date.now() + 7*24*60*60*1000).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' });
    const dims     = quoteState.L ? `${Math.round(quoteState.L)} × ${Math.round(quoteState.W)} × ${Math.round(quoteState.H)} mm` : '—';
    const delivery = quoteState.delivery === 'sameday' ? 'On Priority (+₹200)' : '7 Working Days (+₹150)';
    const rush     = quoteState.rush ? 'Yes (+50%)' : 'No';
    const total    = document.getElementById('bTotal').textContent || '—';
    const mat      = document.getElementById('bMat').textContent  || '—';
    const time     = document.getElementById('bTime').textContent || '—';
    const qual     = document.getElementById('bQual').textContent || '—';
    const infill   = document.getElementById('bInfill').textContent || '—';
    const colour   = document.getElementById('bColor').textContent || '—';
    const setup    = document.getElementById('bSetup').textContent || '—';
    const qty      = document.getElementById('bQty').textContent  || '—';

    const rows = [
      ['Material cost',   mat],
      ['Machine time',    time],
      ['Print quality',   qual],
      ['Infill density',  infill],
      ['Colour',          colour],
      ['Setup fee',       setup],
      ['Quantity',        qty],
      ['Rush priority',   rush],
      ['Delivery',        delivery],
    ];

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<title>Kyzer Robotics — Quote ${quoteNo}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Segoe UI', Arial, sans-serif; color: #111; background: #fff; }
  .page { max-width: 780px; margin: 0 auto; padding: 48px 40px; }
  /* Header */
  .header { display: flex; justify-content: space-between; align-items: flex-start; padding-bottom: 28px; border-bottom: 3px solid #FF8C35; margin-bottom: 32px; }
  .brand-name { font-size: 28px; font-weight: 900; letter-spacing: 2px; color: #111; text-transform: uppercase; }
  .brand-sub  { font-size: 11px; color: #FF8C35; letter-spacing: 3px; text-transform: uppercase; margin-top: 4px; }
  .quote-meta { text-align: right; }
  .quote-meta .label  { font-size: 10px; color: #888; text-transform: uppercase; letter-spacing: 1px; }
  .quote-meta .value  { font-size: 14px; font-weight: 600; margin-bottom: 6px; }
  .quote-badge { background: #FF8C35; color: #fff; font-size: 11px; font-weight: 700; letter-spacing: 2px; padding: 4px 12px; border-radius: 4px; display: inline-block; margin-bottom: 10px; text-transform: uppercase; }
  /* Section */
  .section-title { font-size: 10px; font-weight: 700; color: #FF8C35; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 14px; }
  /* Spec block */
  .spec-block { background: #faf9f6; border: 1px solid #e8e8e4; border-radius: 10px; padding: 20px 24px; margin-bottom: 28px; }
  .spec-row { display: flex; justify-content: space-between; align-items: center; padding: 7px 0; border-bottom: 1px solid #eee; font-size: 13.5px; }
  .spec-row:last-child { border-bottom: none; }
  .spec-row .key { color: #555; }
  .spec-row .val { font-weight: 600; color: #111; }
  /* Breakdown */
  .breakdown { border: 1px solid #e8e8e4; border-radius: 10px; overflow: hidden; margin-bottom: 28px; }
  .breakdown-row { display: flex; justify-content: space-between; padding: 10px 20px; font-size: 13px; border-bottom: 1px solid #f0f0ee; }
  .breakdown-row:last-child { border-bottom: none; }
  .breakdown-row .k { color: #555; }
  .breakdown-row .v { font-weight: 500; }
  /* Total */
  .total-row { background: #111; color: #fff; display: flex; justify-content: space-between; align-items: center; padding: 16px 20px; border-radius: 10px; margin-bottom: 28px; }
  .total-row .t-label { font-size: 11px; letter-spacing: 2px; text-transform: uppercase; opacity: 0.7; }
  .total-row .t-amount { font-size: 28px; font-weight: 900; color: #FF8C35; }
  /* Footer */
  .note { background: #fff8f0; border-left: 3px solid #FF8C35; padding: 12px 16px; font-size: 12px; color: #555; line-height: 1.6; margin-bottom: 28px; border-radius: 0 6px 6px 0; }
  .footer { display: flex; justify-content: space-between; align-items: center; padding-top: 20px; border-top: 1px solid #e8e8e4; font-size: 12px; color: #888; }
  .footer strong { color: #111; }
  @media print {
    body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
    .page { padding: 20px; }
    @page { margin: 0.5in; size: A4; }
  }
</style>
</head>
<body>
<div class="page">
  <div class="header">
    <div>
      <div class="brand-name">Kyzer Robotics</div>
      <div class="brand-sub">Intelligent Automation · Drones · 3D Printing</div>
    </div>
    <div class="quote-meta">
      <div class="quote-badge">Quotation</div>
      <div class="label">Quote No.</div>
      <div class="value">${quoteNo}</div>
      <div class="label">Date</div>
      <div class="value">${today}</div>
      <div class="label">Valid Until</div>
      <div class="value">${validTil}</div>
    </div>
  </div>

  <div class="section-title">Print Specifications</div>
  <div class="spec-block">
    <div class="spec-row"><span class="key">Material</span><span class="val">${quoteState.matName}</span></div>
    <div class="spec-row"><span class="key">Print Quality</span><span class="val">${quoteState.qualName}</span></div>
    <div class="spec-row"><span class="key">Infill Density</span><span class="val">${quoteState.infill}%</span></div>
    <div class="spec-row"><span class="key">Colour</span><span class="val">${quoteState.colorName || 'White'}</span></div>
    <div class="spec-row"><span class="key">Dimensions</span><span class="val">${dims}</span></div>
    <div class="spec-row"><span class="key">Quantity</span><span class="val">${quoteState.qty}</span></div>
    <div class="spec-row"><span class="key">Delivery</span><span class="val">${delivery}</span></div>
    ${quoteState.fileName ? `<div class="spec-row"><span class="key">File</span><span class="val">${quoteState.fileName}</span></div>` : ''}
  </div>

  <div class="section-title">Price Breakdown</div>
  <div class="breakdown">
    ${rows.map(([k,v]) => `<div class="breakdown-row"><span class="k">${k}</span><span class="v">${v}</span></div>`).join('')}
  </div>

  <div class="total-row">
    <div>
      <div class="t-label">Estimated Total</div>
      <div style="font-size:11px;opacity:0.5;margin-top:2px;">Incl. GST · Final confirmed after file review</div>
    </div>
    <div class="t-amount">${total}</div>
  </div>

  <div class="note">
    ⚠️ This is an <strong>estimated quotation</strong>. Final pricing is confirmed after our team reviews your file and specifications. Prices are inclusive of GST. Shipping charges applied at checkout.
  </div>

  <div class="footer">
    <div>
      <strong>Kyzer Robotics Pvt. Ltd.</strong><br>
      Pune, Maharashtra, India 411046<br>
      info@kyzerrobotics.com · +91 90496 95264
    </div>
    <div style="text-align:right;">
      <strong>kyzerrobotics.com</strong><br>
      Quote valid for 7 days from issue date
    </div>
  </div>
</div>
<script>window.onload = function(){ window.print(); }<\/script>
</body>
</html>`;

    const win = window.open('', '_blank');
    win.document.write(html);
    win.document.close();
  }

  // ── ANNOUNCEMENT BAR ──
  (function() {
    if (sessionStorage.getItem('ann_dismissed')) {
      const bar = document.getElementById('announcementBar');
      if (bar) bar.style.display = 'none';
    } else {
      document.body.classList.add('has-ann');
    }
  })();

  function dismissAnnouncement() {
    const bar = document.getElementById('announcementBar');
    bar.classList.add('ann-hidden');
    document.body.classList.remove('has-ann');
    sessionStorage.setItem('ann_dismissed', '1');
    setTimeout(() => { bar.style.display = 'none'; }, 320);
  }

  // ── CUSTOMER AUTH ──
  async function hashPassword(password) {
    const enc = new TextEncoder().encode(password);
    const buf = await crypto.subtle.digest('SHA-256', enc);
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2,'0')).join('');
  }

  function getCustomers() { return JSON.parse(localStorage.getItem('kyzer_customers') || '[]'); }
  function saveCustomers(arr) { localStorage.setItem('kyzer_customers', JSON.stringify(arr)); }
  function getCurrentCustomer() { return JSON.parse(localStorage.getItem('kyzer_current_customer') || 'null'); }
  function setCurrentCustomer(c) { localStorage.setItem('kyzer_current_customer', JSON.stringify(c)); }

  function openAuthModal(tab) {
    switchAuthTab(tab || 'login');
    document.getElementById('authOverlay').classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeAuthModal(e) {
    if (e && e.target !== document.getElementById('authOverlay')) return;
    document.getElementById('authOverlay').classList.remove('open');
    document.body.style.overflow = '';
  }
  function switchAuthTab(tab) {
    document.getElementById('authTabLogin').classList.toggle('active', tab === 'login');
    document.getElementById('authTabRegister').classList.toggle('active', tab === 'register');
    document.getElementById('authLoginForm').style.display = tab === 'login' ? '' : 'none';
    document.getElementById('authRegForm').style.display = tab === 'register' ? '' : 'none';
    document.getElementById('authLoginError').style.display = 'none';
    document.getElementById('authRegError').style.display = 'none';
  }

  async function registerCustomer() {
    const name  = document.getElementById('authRegName').value.trim();
    const email = document.getElementById('authRegEmail').value.trim().toLowerCase();
    const phone = document.getElementById('authRegPhone').value.trim();
    const pass  = document.getElementById('authRegPass').value;
    const errEl = document.getElementById('authRegError');
    errEl.style.display = 'none';
    if (!name || !email || !pass) { errEl.textContent = 'Name, email and password are required.'; errEl.style.display = 'block'; return; }
    if (pass.length < 6) { errEl.textContent = 'Password must be at least 6 characters.'; errEl.style.display = 'block'; return; }
    const customers = getCustomers();
    if (customers.find(c => c.email === email)) { errEl.textContent = 'An account with this email already exists.'; errEl.style.display = 'block'; return; }
    const btn = document.getElementById('authRegBtn');
    btn.disabled = true; btn.textContent = 'Creating account…';
    const hashed = await hashPassword(pass);
    const customer = { id: 'CUS-' + Date.now(), name, email, phone, password: hashed, address: {}, createdAt: new Date().toISOString() };
    customers.push(customer);
    saveCustomers(customers);
    const session = { id: customer.id, name, email };
    setCurrentCustomer(session);
    updateNavAccount();
    document.getElementById('authOverlay').classList.remove('open');
    document.body.style.overflow = '';
    btn.disabled = false; btn.textContent = 'Create account →';
    showPage('account');
  }

  async function loginCustomer() {
    const email = document.getElementById('authLoginEmail').value.trim().toLowerCase();
    const pass  = document.getElementById('authLoginPass').value;
    const errEl = document.getElementById('authLoginError');
    errEl.style.display = 'none';
    if (!email || !pass) { errEl.textContent = 'Please enter your email and password.'; errEl.style.display = 'block'; return; }
    const btn = document.getElementById('authLoginBtn');
    btn.disabled = true; btn.textContent = 'Signing in…';
    const hashed = await hashPassword(pass);
    const customers = getCustomers();
    const match = customers.find(c => c.email === email && c.password === hashed);
    btn.disabled = false; btn.textContent = 'Sign in →';
    if (!match) { errEl.textContent = 'Incorrect email or password.'; errEl.style.display = 'block'; return; }
    const session = { id: match.id, name: match.name, email: match.email };
    setCurrentCustomer(session);
    updateNavAccount();
    document.getElementById('authOverlay').classList.remove('open');
    document.body.style.overflow = '';
    showPage('account');
  }

  function logoutCustomer() {
    localStorage.removeItem('kyzer_current_customer');
    updateNavAccount();
    closeAccDropdown();
    showPage('main');
  }

  function handleAccountBtnClick() {
    const c = getCurrentCustomer();
    if (c) { toggleAccDropdown(); } else { openAuthModal('login'); }
  }

  function toggleAccDropdown() {
    document.getElementById('accDropdown').classList.toggle('open');
  }
  function closeAccDropdown() {
    document.getElementById('accDropdown').classList.remove('open');
  }

  function toggleBrandsMenu(e) {
    e.stopPropagation();
    const drop = document.getElementById('brandsDrop');
    const chevron = document.getElementById('brandsChevron');
    const isOpen = drop.classList.toggle('open');
    if (chevron) chevron.style.transform = isOpen ? 'rotate(180deg)' : '';
  }
  document.addEventListener('click', function() {
    const drop = document.getElementById('brandsDrop');
    const chevron = document.getElementById('brandsChevron');
    if (drop) { drop.classList.remove('open'); }
    if (chevron) chevron.style.transform = '';
  });

  function updateNavAccount() {
    const c = getCurrentCustomer();
    const label     = document.getElementById('navAccountLabel');
    const avatar    = document.getElementById('navAccAvatar');
    const icon      = document.getElementById('navAccIcon');
    const accBtn    = document.getElementById('navAccountBtn');
    const dropName  = document.getElementById('accDropName');
    const dropEmail = document.getElementById('accDropEmail');
    const strip     = document.getElementById('profileStrip');
    if (c) {
      const initials = c.name.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase();
      if (avatar) { avatar.textContent = initials; avatar.style.display = 'flex'; }
      if (icon)   icon.style.display = 'none';
      if (label)  label.textContent = c.name.split(' ')[0];
      if (accBtn) accBtn.classList.add('active');
      if (dropName)  dropName.textContent  = c.name;
      if (dropEmail) dropEmail.textContent = c.email;
      // Orders badge
      const allOrders = JSON.parse(localStorage.getItem('kyzer_print_orders') || '[]');
      const myOrders  = allOrders.filter(o => o.email && o.email.toLowerCase() === c.email.toLowerCase());
      const badge = document.getElementById('navOrdersBadge');
      if (badge) { badge.textContent = myOrders.length; badge.style.display = myOrders.length ? 'flex' : 'none'; }
      // Profile strip
      if (strip) {
        strip.style.display = 'block';
        document.getElementById('pstripAvatar').textContent = initials;
        document.getElementById('pstripGreeting').textContent = 'Welcome back, ' + c.name.split(' ')[0] + '!';
        const customers = getCustomers();
        const full = customers.find(x => x.id === c.id);
        const a = (full && full.address) || {};
        const addrParts = [a.addr1, a.city, a.state, a.pincode].filter(Boolean);
        document.getElementById('pstripAddr').textContent = addrParts.length
          ? '📍 ' + addrParts.join(', ')
          : 'No saved address — add one in your profile';
      }
    } else {
      if (avatar) avatar.style.display = 'none';
      if (icon)   icon.style.display = '';
      if (label)  label.textContent = 'Account';
      if (accBtn) accBtn.classList.remove('active');
      const badge = document.getElementById('navOrdersBadge');
      if (badge)  badge.style.display = 'none';
      if (strip)  strip.style.display = 'none';
    }
    updateWishlistBadge();
  }

  function handleOrdersBtnClick() {
    const c = getCurrentCustomer();
    if (c) { showPage('account'); setAccountSection('orders'); }
    else   { openAuthModal('login'); }
  }

  // ── WISHLIST ──
  function getWishlist() { return JSON.parse(localStorage.getItem('kyzer_wishlist') || '[]'); }
  function saveWishlist(arr) { localStorage.setItem('kyzer_wishlist', JSON.stringify(arr)); }
  function updateWishlistBadge() {
    const w = getWishlist();
    const badge = document.getElementById('navWishBadge');
    const btn   = document.getElementById('navWishBtn');
    if (badge) { badge.textContent = w.length; badge.style.display = w.length ? 'flex' : 'none'; }
    if (btn)   btn.classList.toggle('wish-active', w.length > 0);
  }
  function toggleWishlist() {
    showPage('account');
  }

  function setAccountSection(sec) {
    ['profile','orders'].forEach(s => {
      document.getElementById('accSec-' + s).classList.toggle('active', s === sec);
      document.getElementById('accnav-' + s).classList.toggle('active', s === sec);
    });
    if (sec === 'orders') loadOrderHistory();
  }

  function loadAccountPage() {
    const c = getCurrentCustomer();
    if (!c) return;
    const customers = getCustomers();
    const full = customers.find(x => x.id === c.id) || c;
    const initials = c.name.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase();
    document.getElementById('accBigAvatar').textContent = initials;
    document.getElementById('accDispName').textContent  = c.name;
    document.getElementById('accDispEmail').textContent = c.email;
    // Fill profile form
    document.getElementById('pfName').value    = full.name  || '';
    document.getElementById('pfPhone').value   = full.phone || '';
    document.getElementById('pfEmail').value   = full.email || '';
    const a = full.address || {};
    document.getElementById('pfAddr1').value   = a.addr1    || '';
    document.getElementById('pfAddr2').value   = a.addr2    || '';
    document.getElementById('pfCity').value    = a.city     || '';
    document.getElementById('pfState').value   = a.state    || '';
    document.getElementById('pfPincode').value = a.pincode  || '';
    document.getElementById('pfLandmark').value= a.landmark || '';
    setAccountSection('profile');
  }

  function saveProfile() {
    const c = getCurrentCustomer();
    if (!c) return;
    const customers = getCustomers();
    const idx = customers.findIndex(x => x.id === c.id);
    if (idx === -1) return;
    customers[idx].name  = document.getElementById('pfName').value.trim() || customers[idx].name;
    customers[idx].phone = document.getElementById('pfPhone').value.trim();
    customers[idx].address = {
      addr1:    document.getElementById('pfAddr1').value.trim(),
      addr2:    document.getElementById('pfAddr2').value.trim(),
      city:     document.getElementById('pfCity').value.trim(),
      state:    document.getElementById('pfState').value.trim(),
      pincode:  document.getElementById('pfPincode').value.trim(),
      landmark: document.getElementById('pfLandmark').value.trim(),
    };
    saveCustomers(customers);
    const session = { id: c.id, name: customers[idx].name, email: c.email };
    setCurrentCustomer(session);
    updateNavAccount();
    document.getElementById('accDispName').textContent = session.name;
    document.getElementById('accBigAvatar').textContent = session.name.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase();
    const msg = document.getElementById('profileSaveMsg');
    msg.style.display = 'inline';
    setTimeout(() => { msg.style.display = 'none'; }, 2500);
  }

  function loadOrderHistory() {
    const c = getCurrentCustomer();
    const listEl = document.getElementById('orderHistList');
    if (!c) { listEl.innerHTML = ''; return; }
    const allOrders = JSON.parse(localStorage.getItem('kyzer_print_orders') || '[]');
    const mine = allOrders.filter(o => o.email && o.email.toLowerCase() === c.email.toLowerCase());
    if (!mine.length) {
      listEl.innerHTML = '<div class="order-hist-empty"><div class="order-hist-empty-icon">&#128230;</div><div>No orders yet.</div></div>';
      return;
    }
    listEl.innerHTML = mine.map(o => {
      const date = new Date(o.submittedAt).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' });
      const statusCls = (o.status || 'new').toLowerCase().replace(/\s+/g,'-');
      return `<div class="order-hist-item">
        <div class="order-hist-header">
          <span class="order-hist-id">${o.id}</span>
          <span class="order-hist-status ${statusCls}">${o.status || 'New'}</span>
        </div>
        <div class="order-hist-date">${date}</div>
        <div class="order-hist-chips">
          ${o.material ? `<span class="order-hist-chip">${o.material}</span>` : ''}
          ${o.quality  ? `<span class="order-hist-chip">${o.quality}</span>` : ''}
          ${o.dimensions ? `<span class="order-hist-chip">${o.dimensions}</span>` : ''}
          ${o.estimatedTotal ? `<span class="order-hist-chip">&#8377;${o.estimatedTotal}</span>` : ''}
        </div>
      </div>`;
    }).join('');
  }

  function autoFillCheckout() {
    const c = getCurrentCustomer();
    if (!c) return;
    const customers = getCustomers();
    const full = customers.find(x => x.id === c.id);
    if (!full) return;
    const set = (id, val) => { const el = document.getElementById(id); if (el && val) el.value = val; };
    set('qfName',    full.name);
    set('qfEmail',   full.email);
    set('qfPhone',   full.phone);
    const a = full.address || {};
    set('qfAddr1',   a.addr1);
    set('qfAddr2',   a.addr2);
    set('qfCity',    a.city);
    set('qfState',   a.state);
    set('qfPincode', a.pincode);
    set('qfLandmark',a.landmark);
  }

  // Close dropdown when clicking outside
  // Works whether DOMContentLoaded already fired (Next.js afterInteractive) or not
  function _domReady(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  _domReady(function() {
    document.addEventListener('click', function(e) {
      const wrap = document.getElementById('navAccountWrap');
      if (wrap && !wrap.contains(e.target)) closeAccDropdown();
    });
    // Close auth modal on overlay click
    const authOv = document.getElementById('authOverlay');
    if (authOv) authOv.addEventListener('click', function(e) {
      if (e.target === this) closeAuthModal(e);
    });
    // Enter key in auth inputs
    ['authLoginEmail','authLoginPass'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('keydown', e => { if (e.key === 'Enter') loginCustomer(); });
    });
    ['authRegName','authRegEmail','authRegPhone','authRegPass'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('keydown', e => { if (e.key === 'Enter') registerCustomer(); });
    });
    updateNavAccount();
    restorePageFromHash();
    setTimeout(initGoogleAuth, 500);
    _enhanceProductCards();
    // Cookie consent banner
    if (!_ckGet()) {
      setTimeout(function() {
        var b = document.getElementById('cookieBanner');
        if (b) b.style.display = 'flex';
      }, 1500);
    }
  });

  // ── CARD QUICK-BUY ────────────────────────────────────────────────────────
  function _cardGetPd(btn) {
    var card = btn.closest('[data-product]');
    if (!card) return null;
    try { return JSON.parse(card.dataset.product); } catch(e) { return null; }
  }

  function _cardAddToCart(btn) {
    var pd = _cardGetPd(btn);
    if (!pd) return;
    addToCart(pd, 1);
    renderCartDrawer();
    btn.textContent = '✓ Added!';
    btn.classList.add('added');
    setTimeout(function() { btn.textContent = '+ Cart'; btn.classList.remove('added'); }, 1600);
  }

  function _cardBuyNow(btn) {
    var pd = _cardGetPd(btn);
    if (!pd) return;
    addToCart(pd, 1);
    renderCartDrawer();
    setTimeout(goToCheckout, 80);
  }

  function _cardEnquire(btn) {
    var pd = _cardGetPd(btn);
    var name = pd ? pd.name : 'your service';
    window.open('https://wa.me/919049695264?text=' + encodeURIComponent('Hi, I\'d like to enquire about: ' + name), '_blank');
  }

  function _enhanceProductCards() {
    document.querySelectorAll('.prod-card').forEach(function(card) {
      if (card.querySelector('.prod-actions')) return;
      var btn = card.querySelector('.prod-btn, .prod-btn-buy');
      var pd;
      try { pd = JSON.parse(card.dataset.product || 'null'); } catch(e) { return; }
      if (!pd) return;
      var price = String(pd.price || '');
      var isFrom = price.toLowerCase().startsWith('from') || price === '';
      if (btn) btn.remove();
      var actions = document.createElement('div');
      actions.className = 'prod-actions';
      if (isFrom) {
        actions.innerHTML =
          '<button class="prod-cart-btn" onclick="event.stopPropagation();showPage(\'quote\')">Get Quote</button>' +
          '<button class="prod-buy-btn" onclick="event.stopPropagation();_cardEnquire(this)">Order →</button>';
      } else {
        actions.innerHTML =
          '<button class="prod-cart-btn" onclick="event.stopPropagation();_cardAddToCart(this)">+ Cart</button>' +
          '<button class="prod-buy-btn" onclick="event.stopPropagation();_cardBuyNow(this)">Buy Now →</button>';
      }
      var body = card.querySelector('.prod-body');
      if (body) body.appendChild(actions);
    });
  }

  // ── COOKIE CONSENT ────────────────────────────────────────────────────────
  var _CK_KEY = 'kyzer_cookie_consent';

  function _ckGet() {
    try { return JSON.parse(localStorage.getItem(_CK_KEY) || 'null'); } catch(e) { return null; }
  }

  function _ckSave(prefs) {
    localStorage.setItem(_CK_KEY, JSON.stringify(prefs));
    var b = document.getElementById('cookieBanner');
    if (b) b.style.display = 'none';
    closeCookieModal();
  }

  function acceptAllCookies() { _ckSave({ necessary: true, functional: true, analytics: true }); }
  function rejectAllCookies() { _ckSave({ necessary: true, functional: false, analytics: false }); }

  function saveConsentPreferences() {
    _ckSave({
      necessary: true,
      functional: document.getElementById('ckToggleFunctional').checked,
      analytics:  document.getElementById('ckToggleAnalytics').checked,
    });
  }

  function openCookieModal() {
    var p = _ckGet();
    document.getElementById('ckToggleFunctional').checked = !p || p.functional !== false;
    document.getElementById('ckToggleAnalytics').checked  = p ? !!p.analytics : false;
    document.getElementById('cookieModal').classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeCookieModal() {
    var m = document.getElementById('cookieModal');
    if (m) m.classList.remove('open');
    document.body.style.overflow = '';
  }

  function toggleCookieCat(cat) {
    var body = document.getElementById('ck-body-' + cat);
    if (!body) return;
    var row = body.previousElementSibling;
    var isOpen = body.classList.toggle('open');
    if (row) row.classList.toggle('expanded', isOpen);
  }

  // ── GOOGLE SIGN-IN ──
  // To enable: go to console.cloud.google.com → APIs & Services → Credentials
  // Create OAuth 2.0 Client ID (Web application) → add your domain as authorized origin
  // Paste the Client ID below.
  var GOOGLE_CLIENT_ID = window.GOOGLE_CLIENT_ID || '';

  function initGoogleAuth() {
    if (!window.google || !GOOGLE_CLIENT_ID) return;
    google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: handleGoogleCredential,
      auto_select: false,
      cancel_on_tap_outside: true,
    });
  }

  function signInWithGoogle() {
    if (!window.google) {
      alert('Google Sign-In is loading, please try again in a moment.');
      return;
    }
    if (!GOOGLE_CLIENT_ID) {
      alert('Google Sign-In is not configured yet.\nPlease use email and password to sign in.');
      return;
    }
    google.accounts.id.prompt(function(notification) {
      if (notification.isSkippedMoment() || notification.isDismissedMoment()) {
        // Fallback: open popup
        var client = google.accounts.oauth2.initCodeClient({
          client_id: GOOGLE_CLIENT_ID,
          scope: 'email profile openid',
          ux_mode: 'popup',
          callback: function() {},
        });
        client.requestCode();
      }
    });
  }

  function handleGoogleCredential(response) {
    try {
      var parts = response.credential.split('.');
      var b64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      var payload = JSON.parse(decodeURIComponent(escape(atob(b64))));
      var name  = payload.name  || payload.given_name || 'Google User';
      var email = (payload.email || '').toLowerCase();
      if (!email) { alert('Could not get email from Google. Please try email sign-in.'); return; }
      var customers = getCustomers();
      var customer  = customers.find(function(c) { return c.email === email; });
      if (!customer) {
        customer = {
          id: 'CUS-' + Date.now(), name: name, email: email,
          phone: '', password: null, googleId: payload.sub,
          address: {}, createdAt: new Date().toISOString()
        };
        customers.push(customer);
        saveCustomers(customers);
      } else if (!customer.googleId) {
        customer.googleId = payload.sub;
        saveCustomers(customers);
      }
      setCurrentCustomer({ id: customer.id, name: customer.name, email: customer.email });
      updateNavAccount();
      document.getElementById('authOverlay').classList.remove('open');
      document.body.style.overflow = '';
      showPage('account');
    } catch(err) {
      alert('Google sign-in failed. Please try email sign-in.');
    }
  }

  // ── NEWSLETTER ──
  async function submitNewsletter(e) {
    e.preventDefault();
    const email = document.getElementById('nlEmail').value.trim();
    if (!email) return;
    const btn = e.target.querySelector('button');
    btn.textContent = 'Subscribing…'; btn.disabled = true;
    try {
      await fetch('/api/cs-subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
    } catch(_) {}
    document.getElementById('nlSuccess').style.display = 'block';
    e.target.style.display = 'none';
  }

  function openPrivacyModal() {
    document.getElementById('privacyOverlay').classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closePrivacyModal() {
    document.getElementById('privacyOverlay').classList.remove('open');
    document.body.style.overflow = '';
  }
