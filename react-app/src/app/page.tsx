"use client";
import Script from "next/script";

const PAGE_HTML = `<div id="mainSite">

<!-- COMING SOON OVERLAY -->
<div id="comingSoonOverlay">
  <img src="logo.png" class="cs-logo" alt="Kyzer Robotics">
  <div class="cs-brand">Kyzer Robotics</div>
  <div class="cs-headline" id="csHeadline">Coming Soon</div>
  <p class="cs-tagline" id="csTagline">Precision drones, custom 3D printing &amp; rapid prototyping — launching June 2, 2026.</p>
  <div class="cs-countdown" id="csCountdown">
    <div class="cs-unit"><span class="cs-num" id="csDays">00</span><span class="cs-lbl">Days</span></div>
    <div class="cs-sep">:</div>
    <div class="cs-unit"><span class="cs-num" id="csHours">00</span><span class="cs-lbl">Hours</span></div>
    <div class="cs-sep">:</div>
    <div class="cs-unit"><span class="cs-num" id="csMins">00</span><span class="cs-lbl">Minutes</span></div>
    <div class="cs-sep">:</div>
    <div class="cs-unit"><span class="cs-num" id="csSecs">00</span><span class="cs-lbl">Seconds</span></div>
  </div>
  <div class="cs-notify-wrap">
    <input type="email" id="csEmail" placeholder="Your email — get notified on launch">
    <button onclick="csSignup()">Notify me →</button>
  </div>
  <div class="cs-notify-msg" id="csSignupMsg">✓ You're on the list! We'll reach out on launch day.</div>
  <div class="cs-social">
    <a href="https://wa.me/919049695264" target="_blank" rel="noopener">WhatsApp</a>
    <span>·</span>
    <a href="https://www.instagram.com/kyzer.robotics" target="_blank" rel="noopener">Instagram</a>
  </div>
</div>

<!-- ANNOUNCEMENT BAR -->
<div id="announcementBar">
  <span>⚡ Free same-day quote on orders over ₹999 &nbsp;·&nbsp; <a href="https://wa.me/919049695264" target="_blank" rel="noopener">Chat on WhatsApp →</a></span>
  <button class="ann-dismiss" onclick="dismissAnnouncement()" aria-label="Dismiss">×</button>
</div>

<!-- NAV -->
<nav id="navbar">
  <a class="nav-logo" href="#">
    <img src="logo.png" alt="Kyzer Robotics" class="nav-logo-img">
    <div>
      <div class="nav-logo-text">Kyzer</div>
      <div class="nav-logo-sub">Robotics</div>
    </div>
  </a>
  <ul class="nav-links" id="navLinks">
    <a href="#about">About</a>
    <a href="#services">Services</a>
    <a href="#products">Shop</a>
    <a href="#contact">Contact</a>
    <a href="#" onclick="showPage('quote'); return false;" style="color:#FF8C35;font-weight:500;">3D Quote ⚡</a>
  </ul>
  <div class="nav-right-group">
    <a class="nav-cta" href="/get-a-quote">Get a quote</a>
    <div class="nav-util-divider"></div>
    <!-- Orders -->
    <button class="nav-util-btn" id="navOrdersBtn" onclick="handleOrdersBtnClick()" title="My Orders">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M5 8h14l-1.5 9H6.5L5 8z"/><path d="M5 8L4 4H2"/><circle cx="9" cy="20" r="1"/><circle cx="15" cy="20" r="1"/></svg>
      <span class="nav-util-label">Orders</span>
      <span class="nav-util-badge" id="navOrdersBadge" style="display:none;"></span>
    </button>
    <!-- Account -->
    <div class="nav-account-wrap" id="navAccountWrap">
      <button class="nav-util-btn" id="navAccountBtn" onclick="handleAccountBtnClick()" title="Account">
        <span class="acc-avatar" id="navAccAvatar" style="display:none;"></span>
        <svg id="navAccIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
        <span class="nav-util-label" id="navAccountLabel">Account</span>
      </button>
      <div class="acc-dropdown" id="accDropdown">
        <div class="acc-dropdown-header">
          <div class="acc-dropdown-name" id="accDropName"></div>
          <div class="acc-dropdown-email" id="accDropEmail"></div>
        </div>
        <div class="acc-dropdown-item" onclick="showPage('account'); closeAccDropdown();">&#128100; My Account</div>
        <div class="acc-dropdown-item" onclick="showPage('account'); setAccountSection('orders'); closeAccDropdown();">&#128230; My Orders</div>
        <div class="acc-dropdown-item logout" onclick="logoutCustomer()">Sign out</div>
      </div>
    </div>
    <!-- Wishlist -->
    <button class="nav-util-btn" id="navWishBtn" onclick="toggleWishlist()" title="Wishlist">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
      <span class="nav-util-label">Wishlist</span>
      <span class="nav-util-badge" id="navWishBadge" style="display:none;"></span>
    </button>
    <!-- Cart -->
    <button class="nav-util-btn" id="navCartBtn" onclick="openCartDrawer()" title="Cart">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
      <span class="nav-util-label">Cart</span>
      <span class="nav-util-badge" id="navCartBadge" style="display:none;"></span>
    </button>
    <!-- Quote bag -->
    <button class="nav-util-btn" id="navQuoteBtn" onclick="showPage('quote')" title="3D Print Quote">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
      <span class="nav-util-label">Quote</span>
    </button>
  </div>
  <button class="hamburger" id="hamburger" aria-label="Menu">
    <span></span><span></span><span></span>
  </button>
</nav>

<!-- LOGGED-IN PROFILE STRIP -->
<div id="profileStrip" style="display:none;">
  <div class="pstrip-inner">
    <div class="pstrip-avatar" id="pstripAvatar">K</div>
    <div class="pstrip-info">
      <div class="pstrip-greeting" id="pstripGreeting">Welcome back!</div>
      <div class="pstrip-addr" id="pstripAddr"></div>
    </div>
    <div class="pstrip-actions">
      <button class="pstrip-btn" onclick="showPage('account'); setAccountSection('orders');">&#128230; My Orders</button>
      <button class="pstrip-btn pstrip-btn-ghost" onclick="showPage('account');">Edit Profile</button>
    </div>
  </div>
</div>

<!-- HERO -->
<section class="hero" id="home">
  <div class="hero-grid-bg"></div>
  <div class="hero-glow"></div>

  <!-- Left: text content -->
  <div class="hero-left">
    <div class="hero-tag">// KYZER ROBOTICS PVT. LTD. — PUNE, INDIA</div>
    <h1>Innovate.<br>Automate.<br><span class="accent">Elevate.</span></h1>
    <p class="hero-sub">Intelligent robotic solutions and advanced 3D printing for a smarter tomorrow — built for hobbyists, startups, and industrial teams across India.</p>
    <div class="hero-btns">
      <button class="btn-primary" onclick="document.querySelector('#products').scrollIntoView({behavior:'smooth'})">
        Shop products <span>→</span>
      </button>
      <button class="btn-outline" onclick="document.querySelector('#contact').scrollIntoView({behavior:'smooth'})">
        Request a prototype
      </button>
    </div>
    <div class="hero-stats">
      <div>
        <div class="hero-stat-num">10+</div>
        <div class="hero-stat-label">Projects delivered</div>
      </div>
      <div>
        <div class="hero-stat-num">48hr</div>
        <div class="hero-stat-label">Prototype turnaround</div>
      </div>
      <div>
        <div class="hero-stat-num">100%</div>
        <div class="hero-stat-label">Custom builds</div>
      </div>
    </div>
  </div>


  <div class="scroll-hint">SCROLL</div>
</section>

<!-- MARQUEE STRIP -->
<div class="marquee-strip" aria-hidden="true">
  <div class="marquee-inner">
    <span class="marquee-item"><span class="marquee-dot"></span>DRONE BUILDS</span>
    <span class="marquee-item"><span class="marquee-dot"></span>FDM 3D PRINTING</span>
    <span class="marquee-item"><span class="marquee-dot"></span>RAPID PROTOTYPING</span>
    <span class="marquee-item"><span class="marquee-dot"></span>CARBON FIBRE PARTS</span>
    <span class="marquee-item"><span class="marquee-dot"></span>NYLON ENGINEERING</span>
    <span class="marquee-item"><span class="marquee-dot"></span>FPV RACING DRONES</span>
    <span class="marquee-item"><span class="marquee-dot"></span>AGRICULTURAL DRONES</span>
    <span class="marquee-item"><span class="marquee-dot"></span>PCB ENCLOSURES</span>
    <span class="marquee-item"><span class="marquee-dot"></span>ROBOTICS KITS</span>
    <span class="marquee-item"><span class="marquee-dot"></span>PRODUCT DEV SPRINTS</span>
    <span class="marquee-item"><span class="marquee-dot"></span>DRONE BUILDS</span>
    <span class="marquee-item"><span class="marquee-dot"></span>FDM 3D PRINTING</span>
    <span class="marquee-item"><span class="marquee-dot"></span>RAPID PROTOTYPING</span>
    <span class="marquee-item"><span class="marquee-dot"></span>CARBON FIBRE PARTS</span>
    <span class="marquee-item"><span class="marquee-dot"></span>NYLON ENGINEERING</span>
    <span class="marquee-item"><span class="marquee-dot"></span>FPV RACING DRONES</span>
    <span class="marquee-item"><span class="marquee-dot"></span>AGRICULTURAL DRONES</span>
    <span class="marquee-item"><span class="marquee-dot"></span>PCB ENCLOSURES</span>
    <span class="marquee-item"><span class="marquee-dot"></span>ROBOTICS KITS</span>
    <span class="marquee-item"><span class="marquee-dot"></span>PRODUCT DEV SPRINTS</span>
  </div>
</div>

<!-- ABOUT -->
<section id="about">
  <div class="about-wrap">
    <div class="about-text reveal">
      <div class="sec-label">// 00 — ABOUT US</div>
      <h2>Built by makers,<br>for makers.</h2>
      <p>Kyzer Robotics is a Pune-based technology company founded by engineers passionate about drones and advanced manufacturing. We design, build, and deliver custom robotic solutions — from FPV racing drones to agricultural survey systems and precision 3D-printed parts.</p>
      <p>Whether you're a startup needing a rapid prototype, a college team building a competition UAV, or an industrial client looking for automation — we bring engineering precision and maker enthusiasm to every project.</p>
    </div>
    <div class="about-highlights reveal">
      <div class="about-hl">
        <div class="about-hl-num">Pune</div>
        <div class="about-hl-label">Maharashtra, India — where we design and manufacture</div>
      </div>
      <div class="about-hl">
        <div class="about-hl-num">48hr</div>
        <div class="about-hl-label">Average turnaround on 3D print orders</div>
      </div>
      <div class="about-hl">
        <div class="about-hl-num">FDM+</div>
        <div class="about-hl-label">PLA, ABS, PETG, TPU, Nylon, CF composites</div>
      </div>
      <div class="about-hl">
        <div class="about-hl-num">100%</div>
        <div class="about-hl-label">Custom builds — engineered to your exact spec</div>
      </div>
    </div>
  </div>
</section>

<!-- SERVICES -->
<section id="services">
  <div class="reveal">
    <div class="sec-label">// 01 — SERVICES</div>
    <div class="sec-title">What we build</div>
    <div class="sec-sub">Intelligent automation, advanced 3D printing, and custom robotic solutions — all under one roof in Pune.</div>
  </div>
  <div class="services-grid reveal">
    <a class="service-card" href="/shop/complete-drones">
      <div class="sc-num">01</div>
      <h3>Custom Drones</h3>
      <p>FPV racing, survey, and agricultural drones built to your spec — designed, assembled, and tested in Pune with full after-build support.</p>
    </a>
    <a class="service-card" href="/shop/3d-printing">
      <div class="sc-num">02</div>
      <h3>3D Printing</h3>
      <p>FDM printing in PLA, PETG, ABS, TPU, and Nylon. Functional parts and production-ready prints with a 48-hour turnaround.</p>
    </a>
    <a class="service-card" href="/shop/prototyping">
      <div class="sc-num">03</div>
      <h3>Rapid Prototyping</h3>
      <p>From sketch or CAD file to physical prototype in as fast as 48 hours — design verification, printing, and assembly all in-house.</p>
    </a>
    <a class="service-card" href="/get-a-quote">
      <div class="sc-num">04</div>
      <h3>Automation & Robotics</h3>
      <p>Custom robotic platforms and smart control systems for industrial clients, startups, and college R&D teams.</p>
    </a>
    <a class="service-card" href="/get-a-quote">
      <div class="sc-num">05</div>
      <h3>AI & Computer Vision</h3>
      <p>Embedded AI and computer vision integrated into drones, robots, and automation systems for real-world deployments.</p>
    </a>
  </div>
</section>

<!-- HOW IT WORKS -->
<section id="process">
  <div class="reveal">
    <div class="sec-label">// 02 — PROCESS</div>
    <div class="sec-title">How it works</div>
    <div class="sec-sub">From enquiry to delivery — a simple, transparent process built around your timeline.</div>
  </div>
  <div class="process-steps reveal">
    <div class="process-step">
      <div class="ps-num">01</div>
      <div class="ps-title">Tell us what you need</div>
      <div class="ps-desc">Fill in the contact form or send us your CAD file, sketch, or idea via WhatsApp. No spec is too rough to start with.</div>
    </div>
    <div class="process-step">
      <div class="ps-num">02</div>
      <div class="ps-title">Get a quote in hours</div>
      <div class="ps-desc">We review your project, check material and print settings, and send back a detailed price breakdown — usually same day.</div>
    </div>
    <div class="process-step">
      <div class="ps-num">03</div>
      <div class="ps-title">We build & iterate</div>
      <div class="ps-desc">Production starts after confirmation. Track progress via WhatsApp and request adjustments before final delivery.</div>
    </div>
    <div class="process-step">
      <div class="ps-num">04</div>
      <div class="ps-title">Delivery to your door</div>
      <div class="ps-desc">Parts are inspected, packed, and shipped with tracking — or available for pickup from our Pune workshop.</div>
    </div>
  </div>
</section>


<!-- PRODUCTS -->
<section id="products">
  <div class="products-header reveal">
    <div>
      <div class="sec-label">// 03 — PRODUCTS</div>
      <div class="sec-title">Shop</div>
    </div>
    <div class="filter-tabs" id="catFilterTabs" style="display:none;"></div>
  </div>
  <div class="cat-tiles reveal" id="catTilesContainer"></div>

  <!-- Print subcategory picker (shown when 3D Printing tile is clicked) -->
  <div class="drone-subcat-picker" id="printSubcatPicker" style="display:none;">
    <div class="dsp-label">// SELECT CATEGORY</div>
    <div class="dsp-grid">
      <a class="dsp-card" href="/shop/3d-printing">
        <div class="dsp-name">3D Print Services</div>
        <div class="dsp-desc">Custom FDM prints — PLA, PETG, ABS, Nylon, TPU — any geometry, any spec</div>
        <div class="dsp-arrow">Browse Prints →</div>
      </a>
      <a class="dsp-card" href="/shop/prototyping">
        <div class="dsp-name">Prototyping</div>
        <div class="dsp-desc">48-hour rapid prototypes and product dev sprints — design to delivery</div>
        <div class="dsp-arrow">Browse Services →</div>
      </a>
      <a class="dsp-card" href="/shop/printers-supplies">
        <div class="dsp-name">Printers & Supplies</div>
        <div class="dsp-desc">3D printers, filaments, upgrades & spare components</div>
        <div class="dsp-arrow">Browse Supplies →</div>
      </a>
    </div>
  </div>

  <!-- Drone subcategory picker (shown when Drones tile is clicked) -->
  <div class="drone-subcat-picker" id="droneSubcatPicker" style="display:none;">
    <div class="dsp-label">// SELECT CATEGORY</div>
    <div class="dsp-grid">
      <a class="dsp-card" href="/shop/drone-frames">
        <div class="dsp-name">Drone Frames</div>
        <div class="dsp-desc">Racing, quadcopter & hexacopter frames — carbon fiber & glass fiber</div>
        <div class="dsp-arrow">Browse Frames →</div>
      </a>
      <a class="dsp-card" href="/shop/complete-drones">
        <div class="dsp-name">Complete Drones</div>
        <div class="dsp-desc">Ready-to-fly survey, FPV & agricultural drones — fully assembled</div>
        <div class="dsp-arrow">Browse Drones →</div>
      </a>
    </div>
  </div>

  <!-- Subcategory tabs (populated dynamically per category) -->
  <div class="subcat-tabs" id="subcatTabs"></div>

  <!-- Drone frame filter panel -->
  <div class="frame-filter-panel" id="frameFilterPanel" style="display:none;">
    <div class="frame-filter-row">
      <span class="frame-filter-label">Frame Type</span>
      <div class="frame-chips">
        <button class="frame-chip active" data-type="all"        onclick="filterFrame('all',undefined)">All</button>
        <button class="frame-chip"        data-type="racing"     onclick="filterFrame('racing',undefined)">Racing</button>
        <button class="frame-chip"        data-type="quadcopter" onclick="filterFrame('quadcopter',undefined)">Quadcopter</button>
        <button class="frame-chip"        data-type="hexacopter" onclick="filterFrame('hexacopter',undefined)">Hexacopter</button>
      </div>
    </div>
    <div class="frame-filter-row">
      <span class="frame-filter-label">Material</span>
      <div class="frame-chips">
        <button class="frame-chip active" data-mat="all"          onclick="filterFrame(undefined,'all')">All</button>
        <button class="frame-chip"        data-mat="carbon-fiber" onclick="filterFrame(undefined,'carbon-fiber')">Carbon Fiber</button>
        <button class="frame-chip"        data-mat="glass-fiber"  onclick="filterFrame(undefined,'glass-fiber')">Glass Fiber</button>
      </div>
    </div>
    <div class="frame-filter-row">
      <span class="frame-filter-label">Size</span>
      <div class="frame-chips">
        <button class="frame-chip active" data-size="all"    onclick="filterFrame(undefined,undefined,'all')">All</button>
        <button class="frame-chip"        data-size="micro"  onclick="filterFrame(undefined,undefined,'micro')">Micro &lt;250mm</button>
        <button class="frame-chip"        data-size="mid"    onclick="filterFrame(undefined,undefined,'mid')">Mid 250–500mm</button>
        <button class="frame-chip"        data-size="large"  onclick="filterFrame(undefined,undefined,'large')">Large &gt;500mm</button>
      </div>
    </div>
  </div>

  <div class="products-grid" id="productsGrid">
    <div class="prod-card" data-cat="drone" onclick="openProduct(this)" data-product='{"emoji":"🚁","badge":"NEW","badgeType":"new","name":"KZ-Recon X1","price":"42000","description":"4K aerial survey drone, 35-min flight, GPS hold","details":"The KZ-Recon X1 is Kyzer Robotics flagship aerial survey platform. Engineered for precision mapping and inspection, it features a 4K Sony sensor with 3-axis gimbal stabilization, 35-minute flight time on a single charge, and onboard GPS with return-to-home safety. Ideal for land surveys, construction site monitoring, and infrastructure inspection.","specs":["4K camera with 3-axis gimbal stabilization","35-min flight time per charge","GPS hold and return-to-home","500m control range","Foldable compact design","Hard carrying case included"]}'>
      <div class="prod-img">🚁</div>
      <div class="prod-body">
        <span class="prod-badge new">NEW</span>
        <h4>KZ-Recon X1</h4>
        <p>4K aerial survey drone, 35-min flight, GPS hold</p>
        <div class="prod-footer">
          <span class="prod-price">₹42,000</span>
          <button class="prod-btn">Enquire</button>
        </div>
      </div>
    </div>
    <div class="prod-card" data-cat="drone" onclick="openProduct(this)" data-product='{"emoji":"✈️","badge":"POPULAR","badgeType":"","name":"FPV Racing Kit","price":"18500","description":"Full 5\" freestyle frame kit with motor mounts and ESC","details":"Complete FPV racing and freestyle kit built around a stiff 5-inch carbon fibre frame. Includes top-spec brushless motors, 4-in-1 ESC, and a compact flight controller — all pre-soldered and bench-tested. Compatible with any 4S LiPo battery. Just add your receiver and goggles and you are ready to fly.","specs":["5-inch truX carbon fibre frame","2306 brushless motors 2450KV","45A 4-in-1 BLHeli_32 ESC","F7 flight controller pre-installed","Pre-soldered and bench tested","Supports FrSky, TBS and ExpressLRS"]}'>
      <div class="prod-img">✈️</div>
      <div class="prod-body">
        <span class="prod-badge">POPULAR</span>
        <h4>FPV Racing Kit</h4>
        <p>Full 5" freestyle frame kit with motor mounts and ESC</p>
        <div class="prod-footer">
          <span class="prod-price">₹18,500</span>
          <button class="prod-btn">Enquire</button>
        </div>
      </div>
    </div>
    <div class="prod-card" data-cat="drone" onclick="openProduct(this)" data-product='{"emoji":"🛸","badge":"IN STOCK","badgeType":"","name":"KZ-Agri Sprayer","price":"120000","description":"Agricultural spray drone, 10L tank, 15m spray width","details":"Built for modern precision agriculture, the KZ-Agri Sprayer covers 15 metres of spray width per pass with a 10-litre tank capacity. The hexacopter frame provides stable hover even in light wind, and variable-rate nozzles ensure even chemical distribution. Custom field mapping missions available on request.","specs":["10-litre chemical tank","15m effective spray width per pass","Hexacopter frame for stable hover","20-min flight time per charge","Variable-rate spray nozzles","Custom field mission planning available"]}'>
      <div class="prod-img">🛸</div>
      <div class="prod-body">
        <span class="prod-badge">IN STOCK</span>
        <h4>KZ-Agri Sprayer</h4>
        <p>Agricultural spray drone, 10L tank, 15m spray width</p>
        <div class="prod-footer">
          <span class="prod-price">₹1,20,000</span>
          <button class="prod-btn">Enquire</button>
        </div>
      </div>
    </div>
    <div class="prod-card" data-cat="print" onclick="openProduct(this)" data-product='{"emoji":"🖨️","badge":"CUSTOM","badgeType":"","name":"Nylon enclosure print","price":"From ₹800","description":"High-strength engineering nylon housing, any spec","details":"Engineering-grade nylon (PA12) printed on industrial FDM machines for enclosures, brackets, and structural housings. Strong, slightly flexible, and resistant to common chemicals and heat. DXF, STEP, or STL files accepted. Lead time 2–3 business days from file approval.","specs":["PA12 Nylon 12 material","Layer height 0.15–0.3mm","Build volume up to 300×300×400mm","Chemical and heat resistant","STEP, STL or DXF files accepted","2–3 business day lead time"]}'>
      <div class="prod-img">🖨️</div>
      <div class="prod-body">
        <span class="prod-badge">CUSTOM</span>
        <h4>Nylon enclosure print</h4>
        <p>High-strength engineering nylon housing, any spec</p>
        <div class="prod-footer">
          <span class="prod-price">From ₹800</span>
          <button class="prod-btn">Order</button>
        </div>
      </div>
    </div>
    <div class="prod-card" data-cat="print" onclick="openProduct(this)" data-product='{"emoji":"⚙️","badge":"CUSTOM","badgeType":"","name":"Functional gear print","price":"From ₹500","description":"PETG/ABS mechanical gears, brackets, and fixtures","details":"Precision-printed gears, brackets, and mechanical fixtures in PETG or ABS. Great for prototyping drivetrain components, replacement parts, or custom tooling. Parts are printed with 40–60% infill for strength and post-processed for dimensional accuracy.","specs":["PETG or ABS material options","40–60% infill for strength","Post-processed for accuracy","Spur, bevel and worm gear profiles","STEP, DXF or drawing input","Same-day turnaround for simple parts"]}'>
      <div class="prod-img">⚙️</div>
      <div class="prod-body">
        <span class="prod-badge">CUSTOM</span>
        <h4>Functional gear print</h4>
        <p>PETG/ABS mechanical gears, brackets, and fixtures</p>
        <div class="prod-footer">
          <span class="prod-price">From ₹500</span>
          <button class="prod-btn">Order</button>
        </div>
      </div>
    </div>
    <div class="prod-card" data-cat="proto" onclick="openProduct(this)" data-product='{"emoji":"💡","badge":"48HR","badgeType":"new","name":"Rapid prototype pack","price":"From ₹3,500","description":"Design + print + assembly, delivered within 48 hours","details":"From concept to physical prototype in under 48 hours. We handle design verification (or accept your CAD), print, and assemble the final part. Ideal for pitch demos, investor samples, user testing, and iterative design cycles. Up to 3 design revisions included.","specs":["48-hour turnaround guaranteed","Design verification included","Up to 3 revisions","Any FDM material available","Full assembly and finishing","Perfect for pitch demos and samples"]}'>
      <div class="prod-img">💡</div>
      <div class="prod-body">
        <span class="prod-badge new">48HR</span>
        <h4>Rapid prototype pack</h4>
        <p>Design + print + assembly, delivered within 48 hours</p>
        <div class="prod-footer">
          <span class="prod-price">From ₹3,500</span>
          <button class="prod-btn">Book</button>
        </div>
      </div>
    </div>
    <div class="prod-card" data-cat="proto" onclick="openProduct(this)" data-product='{"emoji":"🔬","badge":"R&D","badgeType":"","name":"Product dev sprint","price":"From ₹15,000","description":"3-day iterative design and prototyping sprint for startups","details":"A structured 3-day design and prototyping sprint for startups and product teams. Day 1: requirements gathering and CAD. Day 2: print, test, iterate. Day 3: final prototype and documentation. Delivered with a build report, BOM, and ready-to-manufacture files.","specs":["3-day structured sprint","Full CAD design included","Minimum 2 prototype iterations","Build report and BOM delivered","Manufacture-ready files","Post-sprint support available"]}'>
      <div class="prod-img">🔬</div>
      <div class="prod-body">
        <span class="prod-badge">R&D</span>
        <h4>Product dev sprint</h4>
        <p>3-day iterative design and prototyping sprint for startups</p>
        <div class="prod-footer">
          <span class="prod-price">From ₹15,000</span>
          <button class="prod-btn">Book</button>
        </div>
      </div>
    </div>
    <div class="prod-card" data-cat="drone" onclick="openProduct(this)" data-product='{"emoji":"🎮","badge":"IN STOCK","badgeType":"","name":"Beginner Micro Drone","price":"4500","description":"Indoor mini drone, perfect for learning and hobby flying","details":"The perfect starter drone for anyone new to flying. Compact, lightweight, and packed with beginner-friendly features — altitude hold, one-key takeoff and landing, and a durable frame that survives crashes. Comes fully assembled with a 2.4GHz remote controller, spare props, and a USB charger.","specs":["Altitude hold mode","One-key takeoff and landing","2.4GHz controller included","10-min flight time per battery","Spare propellers in the box","USB charger included"]}'>
      <div class="prod-img">🎮</div>
      <div class="prod-body">
        <span class="prod-badge">IN STOCK</span>
        <h4>Beginner Micro Drone</h4>
        <p>Indoor mini drone, perfect for learning and hobby flying</p>
        <div class="prod-footer">
          <span class="prod-price">₹4,500</span>
          <button class="prod-btn">Buy</button>
        </div>
      </div>
    </div>

    <!-- ── 3D PRINTERS ── -->
    <div class="prod-card" data-cat="3dprint" data-subcat="printer" onclick="openProduct(this)" data-product='{"emoji":"🖨️","badge":"IN STOCK","badgeType":"new","name":"Bambu Lab A1 Mini","price":"29999","description":"Fast compact FDM printer — 256×256×256mm, multicolor ready","details":"The Bambu Lab A1 Mini is a compact, high-speed FDM printer with automatic calibration, vibration compensation, and multicolor printing support via AMS Lite. Perfect for hobbyists and professionals who want reliable results out of the box.","specs":["256×256×256mm build volume","Max 500mm/s print speed","Auto bed leveling & calibration","Multicolor ready with AMS Lite","Compatible with PLA, PETG, TPU, PLA-CF","Wi-Fi & app control"]}'>
      <div class="prod-img">🖨️</div>
      <div class="prod-body">
        <span class="prod-badge new">IN STOCK</span>
        <h4>Bambu Lab A1 Mini</h4>
        <p>Fast compact FDM printer — 256×256×256mm, multicolor ready</p>
        <div class="prod-footer">
          <span class="prod-price">₹29,999</span>
          <button class="prod-btn">Buy</button>
        </div>
      </div>
    </div>
    <div class="prod-card" data-cat="3dprint" data-subcat="printer" onclick="openProduct(this)" data-product='{"emoji":"🖨️","badge":"POPULAR","badgeType":"","name":"Creality Ender 3 V3 KE","price":"18999","description":"Reliable beginner printer — 220×220×250mm, auto-leveling","details":"The Creality Ender 3 V3 KE is one of the best entry-level FDM printers on the market. It features automatic bed leveling, a direct drive extruder, and a large online community for support. Ideal for students, hobbyists, and anyone starting out with 3D printing.","specs":["220×220×250mm build volume","Direct drive extruder","Auto bed leveling (CR Touch)","Max 300mm/s print speed","Compatible with PLA, PETG, TPU, ABS","Open-source firmware"]}'>
      <div class="prod-img">🖨️</div>
      <div class="prod-body">
        <span class="prod-badge">POPULAR</span>
        <h4>Creality Ender 3 V3 KE</h4>
        <p>Reliable beginner printer — 220×220×250mm, auto-leveling</p>
        <div class="prod-footer">
          <span class="prod-price">₹18,999</span>
          <button class="prod-btn">Buy</button>
        </div>
      </div>
    </div>
    <div class="prod-card" data-cat="3dprint" data-subcat="printer" onclick="openProduct(this)" data-product='{"emoji":"🖨️","badge":"HIGH SPEED","badgeType":"new","name":"Creality K1C","price":"42999","description":"High-speed FDM printer — 600mm/s, carbon fibre compatible","details":"The Creality K1C is a CoreXY high-speed printer capable of 600mm/s. It includes an all-metal hotend that handles abrasive filaments like carbon fibre and glass-fibre reinforced materials. Built-in AI camera for print monitoring.","specs":["220×220×250mm build volume","600mm/s max print speed","All-metal hotend — CF/GF compatible","AI camera & print monitoring","Auto levelling & vibration compensation","Supports PLA, PETG, ABS, ASA, PLA-CF, PA-CF"]}'>
      <div class="prod-img">🖨️</div>
      <div class="prod-body">
        <span class="prod-badge new">HIGH SPEED</span>
        <h4>Creality K1C</h4>
        <p>High-speed FDM printer — 600mm/s, carbon fibre compatible</p>
        <div class="prod-footer">
          <span class="prod-price">₹42,999</span>
          <button class="prod-btn">Buy</button>
        </div>
      </div>
    </div>

    <!-- ── FILAMENTS ── -->
    <div class="prod-card" data-cat="3dprint" data-subcat="filament" onclick="openProduct(this)" data-product='{"emoji":"🎨","badge":"IN STOCK","badgeType":"","name":"PLA+ 1kg Spool","price":"899","description":"High-quality PLA+, 1.75mm — multiple colors available","details":"Premium PLA+ filament with improved impact resistance and reduced brittleness compared to standard PLA. Consistent diameter tolerance of ±0.02mm for reliable prints. Available in 20+ colors — specify when ordering.","specs":["1kg spool, 1.75mm diameter","Diameter tolerance ±0.02mm","Print temp: 200–230°C","Bed temp: 0–60°C (no heated bed needed)","20+ colors available","Compatible with all FDM printers"]}'>
      <div class="prod-img">🎨</div>
      <div class="prod-body">
        <span class="prod-badge">IN STOCK</span>
        <h4>PLA+ 1kg Spool</h4>
        <p>High-quality PLA+, 1.75mm — multiple colors available</p>
        <div class="filament-colors">
          <span class="fc" style="background:#ffffff" title="White"></span>
          <span class="fc" style="background:#1a1a1a" title="Black"></span>
          <span class="fc" style="background:#e53935" title="Red"></span>
          <span class="fc" style="background:#ff6f00" title="Orange"></span>
          <span class="fc" style="background:#fdd835" title="Yellow"></span>
          <span class="fc" style="background:#43a047" title="Green"></span>
          <span class="fc" style="background:#1e88e5" title="Blue"></span>
          <span class="fc" style="background:#8e24aa" title="Purple"></span>
          <span class="fc" style="background:#e91e8c" title="Pink"></span>
          <span class="fc" style="background:#757575" title="Grey"></span>
          <span class="fc" style="background:#c0c0c0" title="Silver"></span>
        </div>
        <div class="prod-footer">
          <span class="prod-price">₹899</span>
          <button class="prod-btn prod-btn-buy">Buy Now →</button>
        </div>
      </div>
    </div>
    <div class="prod-card" data-cat="3dprint" data-subcat="filament" onclick="openProduct(this)" data-product='{"emoji":"🎨","badge":"IN STOCK","badgeType":"","name":"PETG 1kg Spool","price":"999","description":"Chemical resistant PETG, 1.75mm — great for functional parts","details":"PETG offers a great balance between ease of printing and mechanical performance. More durable and impact-resistant than PLA, with good chemical resistance. Ideal for enclosures, brackets, and outdoor parts.","specs":["1kg spool, 1.75mm diameter","Diameter tolerance ±0.02mm","Print temp: 230–250°C","Bed temp: 70–90°C","Chemical and moisture resistant","Multiple colors available"]}'>
      <div class="prod-img">🎨</div>
      <div class="prod-body">
        <span class="prod-badge">IN STOCK</span>
        <h4>PETG 1kg Spool</h4>
        <p>Chemical resistant PETG, 1.75mm — great for functional parts</p>
        <div class="filament-colors">
          <span class="fc" style="background:#ffffff" title="White"></span>
          <span class="fc" style="background:#1a1a1a" title="Black"></span>
          <span class="fc" style="background:#e53935" title="Red"></span>
          <span class="fc" style="background:#1e88e5" title="Blue"></span>
          <span class="fc" style="background:#fdd835" title="Yellow"></span>
          <span class="fc" style="background:#b0bec5;border:1px solid #90a4ae" title="Clear"></span>
          <span class="fc" style="background:#757575" title="Grey"></span>
          <span class="fc" style="background:#43a047" title="Green"></span>
        </div>
        <div class="prod-footer">
          <span class="prod-price">₹999</span>
          <button class="prod-btn prod-btn-buy">Buy Now →</button>
        </div>
      </div>
    </div>
    <div class="prod-card" data-cat="3dprint" data-subcat="filament" onclick="openProduct(this)" data-product='{"emoji":"🎨","badge":"IN STOCK","badgeType":"","name":"TPU Flexible 500g","price":"799","description":"95A flexible TPU, 1.75mm — grips, gaskets & flex parts","details":"Flexible 95A Shore hardness TPU for printing grips, gaskets, phone cases, and any part that needs to flex or absorb impact. Best used with a direct drive extruder.","specs":["500g spool, 1.75mm diameter","Shore hardness 95A","Print temp: 220–240°C","Direct drive extruder recommended","Excellent layer adhesion","UV and oil resistant"]}'>
      <div class="prod-img">🎨</div>
      <div class="prod-body">
        <span class="prod-badge">IN STOCK</span>
        <h4>TPU Flexible 500g</h4>
        <p>95A flexible TPU, 1.75mm — grips, gaskets & flex parts</p>
        <div class="filament-colors">
          <span class="fc" style="background:#1a1a1a" title="Black"></span>
          <span class="fc" style="background:#ffffff" title="White"></span>
          <span class="fc" style="background:#e53935" title="Red"></span>
          <span class="fc" style="background:#1e88e5" title="Blue"></span>
          <span class="fc" style="background:#fdd835" title="Yellow"></span>
          <span class="fc" style="background:#43a047" title="Green"></span>
        </div>
        <div class="prod-footer">
          <span class="prod-price">₹799</span>
          <button class="prod-btn prod-btn-buy">Buy Now →</button>
        </div>
      </div>
    </div>
    <div class="prod-card" data-cat="3dprint" data-subcat="filament" onclick="openProduct(this)" data-product='{"emoji":"🎨","badge":"IN STOCK","badgeType":"","name":"Carbon Fibre PLA 500g","price":"1299","description":"CF-reinforced PLA, 1.75mm — lightweight and stiff","details":"Carbon fibre reinforced PLA for parts that need to be lightweight and rigid. Matte finish, excellent dimensional stability, and very low warping. Requires a hardened steel nozzle.","specs":["500g spool, 1.75mm diameter","Carbon fibre reinforced PLA matrix","Print temp: 210–230°C","Hardened steel nozzle required","Matte finish, excellent rigidity","Low warping, high dimensional accuracy"]}'>
      <div class="prod-img">🎨</div>
      <div class="prod-body">
        <span class="prod-badge">IN STOCK</span>
        <h4>Carbon Fibre PLA 500g</h4>
        <p>CF-reinforced PLA, 1.75mm — lightweight and stiff</p>
        <div class="filament-colors">
          <span class="fc" style="background:#2b2b2b" title="Matte Black"></span>
          <span class="fc" style="background:#3d3d3d" title="Dark Grey"></span>
        </div>
        <div class="prod-footer">
          <span class="prod-price">₹1,299</span>
          <button class="prod-btn prod-btn-buy">Buy Now →</button>
        </div>
      </div>
    </div>

    <!-- ── COMPONENTS ── -->
    <div class="prod-card" data-cat="3dprint" data-subcat="component" onclick="openProduct(this)" data-product='{"emoji":"⚙️","badge":"IN STOCK","badgeType":"","name":"Hardened Steel Nozzle 0.4mm","price":"299","description":"Universal 0.4mm nozzle — handles abrasive filaments","details":"Hardened steel nozzle suitable for abrasive filaments like carbon fibre, glass fibre, and glow-in-the-dark. Much longer lifespan than brass nozzles. Compatible with most FDM printers using standard MK8 or V6 thread.","specs":["0.4mm orifice diameter","Hardened steel — abrasive filament rated","MK8 thread (fits most FDM printers)","V6 thread version also available","Max temp: 300°C","Pack of 2"]}'>
      <div class="prod-img">⚙️</div>
      <div class="prod-body">
        <span class="prod-badge">IN STOCK</span>
        <h4>Hardened Steel Nozzle 0.4mm</h4>
        <p>Universal 0.4mm nozzle — handles abrasive filaments</p>
        <div class="prod-footer">
          <span class="prod-price">₹299</span>
          <button class="prod-btn">Buy</button>
        </div>
      </div>
    </div>
    <div class="prod-card" data-cat="3dprint" data-subcat="component" onclick="openProduct(this)" data-product='{"emoji":"⚙️","badge":"IN STOCK","badgeType":"","name":"PEI Spring Steel Sheet","price":"599","description":"Magnetic flexible print bed — prints pop off when cool","details":"Double-sided textured PEI spring steel sheet with magnetic base. Prints adhere firmly when hot and release easily when the sheet flexes after cooling — no scraper needed. Compatible with most FDM printers with a heated bed.","specs":["235×235mm (Ender 3 size)","Double-sided textured PEI surface","Magnetic base for easy removal","Works with PLA, PETG, ABS, TPU","No adhesive or glue stick needed","Easy to clean and long-lasting"]}'>
      <div class="prod-img">⚙️</div>
      <div class="prod-body">
        <span class="prod-badge">IN STOCK</span>
        <h4>PEI Spring Steel Sheet</h4>
        <p>Magnetic flexible print bed — prints pop off when cool</p>
        <div class="prod-footer">
          <span class="prod-price">₹599</span>
          <button class="prod-btn">Buy</button>
        </div>
      </div>
    </div>
    <div class="prod-card" data-cat="3dprint" data-subcat="component" onclick="openProduct(this)" data-product='{"emoji":"⚙️","badge":"UPGRADE","badgeType":"","name":"Direct Drive Extruder Kit","price":"1499","description":"Universal direct drive upgrade — better flexible filament control","details":"Converts a Bowden-setup printer to direct drive for better flexible filament performance and reduced stringing. Includes motor bracket, tensioner, PTFE tube, and all hardware.","specs":["Universal bracket (fits most FDM printers)","Reduces retraction distance significantly","Improved flexible filament handling","Includes all mounting hardware","PTFE-lined path for smooth feeding","Compatible with NEMA 17 motors"]}'>
      <div class="prod-img">⚙️</div>
      <div class="prod-body">
        <span class="prod-badge">UPGRADE</span>
        <h4>Direct Drive Extruder Kit</h4>
        <p>Universal direct drive upgrade — better flexible filament control</p>
        <div class="prod-footer">
          <span class="prod-price">₹1,499</span>
          <button class="prod-btn">Buy</button>
        </div>
      </div>
    </div>
    <div class="prod-card" data-cat="3dprint" data-subcat="component" onclick="openProduct(this)" data-product='{"emoji":"⚙️","badge":"IN STOCK","badgeType":"","name":"Hotend Heater Block Kit","price":"399","description":"Replacement heater block, thermistor & heater cartridge set","details":"Complete hotend replacement kit including heater block, thermistor, heater cartridge, and all mounting screws. Fixes heat creep, temperature errors, and heat block damage. Compatible with E3D V6 and most clone hotends.","specs":["Aluminium heater block","24V 40W heater cartridge","NTC 100K thermistor","M6 thread, E3D V6 compatible","All screws and PTFE clip included","Rated to 300°C"]}'>
      <div class="prod-img">⚙️</div>
      <div class="prod-body">
        <span class="prod-badge">IN STOCK</span>
        <h4>Hotend Heater Block Kit</h4>
        <p>Replacement heater block, thermistor & heater cartridge set</p>
        <div class="prod-footer">
          <span class="prod-price">₹399</span>
          <button class="prod-btn">Buy</button>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- TESTIMONIALS -->
<section id="testimonials">
  <div class="reveal">
    <div class="sec-label">// 04 — TESTIMONIALS</div>
    <div class="sec-title">What clients say</div>
  </div>
  <div class="testi-grid reveal" style="max-width:960px;margin-left:auto;margin-right:auto;">

    <!-- Vinit Kiran Kumbhar -->
    <div class="testi-card" style="display:flex;flex-direction:column;gap:12px;">
      <div style="display:flex;align-items:center;gap:10px;">
        <div style="width:40px;height:40px;border-radius:50%;background:#5C6BC0;color:#fff;font-weight:700;font-size:16px;display:flex;align-items:center;justify-content:center;flex-shrink:0;">V</div>
        <div>
          <div class="testi-name" style="font-size:14px;font-weight:600;">Vinit Kiran Kumbhar</div>
          <div style="display:flex;align-items:center;gap:4px;margin-top:2px;">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            <span style="font-size:11px;color:var(--muted);">Google review</span>
          </div>
        </div>
      </div>
      <div class="testi-stars" style="font-size:16px;color:#FBBC05;letter-spacing:2px;">★★★★★</div>
      <div style="font-size:12px;color:var(--muted);margin-top:auto;">6 weeks ago</div>
    </div>

    <!-- Raghav Yogi -->
    <div class="testi-card" style="display:flex;flex-direction:column;gap:12px;">
      <div style="display:flex;align-items:center;gap:10px;">
        <div style="width:40px;height:40px;border-radius:50%;background:#EF5350;color:#fff;font-weight:700;font-size:16px;display:flex;align-items:center;justify-content:center;flex-shrink:0;">R</div>
        <div>
          <div class="testi-name" style="font-size:14px;font-weight:600;">Raghav Yogi</div>
          <div style="display:flex;align-items:center;gap:4px;margin-top:2px;">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            <span style="font-size:11px;color:var(--muted);">Google review</span>
          </div>
        </div>
      </div>
      <div class="testi-stars" style="font-size:16px;color:#FBBC05;letter-spacing:2px;">★★★★★</div>
      <div class="testi-text" style="font-size:14px;line-height:1.6;color:var(--text);flex:1;">"Hospitality is very impressive. Service is great."</div>
      <div style="font-size:12px;color:var(--muted);margin-top:auto;">6 weeks ago</div>
    </div>

    <!-- Mohammed Ali Shakeel Ashtikar -->
    <div class="testi-card" style="display:flex;flex-direction:column;gap:12px;">
      <div style="display:flex;align-items:center;gap:10px;">
        <div style="width:40px;height:40px;border-radius:50%;background:#26A69A;color:#fff;font-weight:700;font-size:16px;display:flex;align-items:center;justify-content:center;flex-shrink:0;">M</div>
        <div>
          <div class="testi-name" style="font-size:14px;font-weight:600;">Mohammed Ali Shakeel</div>
          <div style="display:flex;align-items:center;gap:4px;margin-top:2px;">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            <span style="font-size:11px;color:var(--muted);">Google review</span>
          </div>
        </div>
      </div>
      <div class="testi-stars" style="font-size:16px;color:#FBBC05;letter-spacing:2px;">★★★★★</div>
      <div class="testi-text" style="font-size:14px;line-height:1.6;color:var(--text);flex:1;">"I had an excellent experience with Kyzer Robotics. Their work truly reflects innovation, precision, and a strong understanding of advanced robotics. The team is highly professional, knowledgeable, and dedicated to delivering top-quality solutions."</div>
      <div style="font-size:12px;color:var(--muted);margin-top:auto;">6 weeks ago</div>
    </div>

  </div>
  <div class="reveal" style="text-align:center;margin-top:2rem;">
    <p style="font-size:13px;color:var(--muted);margin-bottom:1rem;">Worked with us? We'd love your feedback.</p>
    <a href="https://g.page/r/CTEFLjTGuzKKEAI/review" target="_blank" rel="noopener"
       style="display:inline-flex;align-items:center;gap:8px;padding:10px 20px;border:0.5px solid var(--border);border-radius:8px;font-size:13px;font-weight:500;color:var(--text);text-decoration:none;transition:border-color 0.2s,color 0.2s;"
       onmouseover="this.style.borderColor='#FF8C35';this.style.color='#FF8C35';"
       onmouseout="this.style.borderColor='';this.style.color='';">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
      Leave us a Google review
    </a>
  </div>
</section>

<!-- DEALS -->
<section id="deals">
  <div class="deals-inner reveal">
    <div class="deals-badge">LIMITED OFFERS</div>
    <h2>Deals you can't resist.</h2>
    <div class="deals-items">
      <span>🖨️ &nbsp;<strong>Bulk 3D prints</strong> — 10% off on 10+ pieces</span>
      <span class="deals-sep"> · </span>
      <span>🚁 &nbsp;<strong>Drone service package</strong> — save ₹3,000</span>
      <span class="deals-sep"> · </span>
      <span>🎨 &nbsp;<strong>Free filament spool</strong> on orders above ₹5,000</span>
    </div>
    <div class="deals-ctas">
      <a href="#contact" class="deals-btn-primary">Claim your deal →</a>
      <a href="#" onclick="showPage('quote'); return false;" class="deals-btn-ghost">Get a 3D quote ⚡</a>
    </div>
  </div>
</section>

<!-- CONTACT -->
<section id="contact">
  <div class="reveal">
    <div class="sec-label">// 05 — CONTACT</div>
    <div class="sec-title">Let's build<br>something.</div>
  </div>
  <div class="contact-layout reveal">
    <div class="contact-info">
      <h3>Get in touch</h3>
      <p>Have a project in mind? Need a quote for a custom drone or prototype? Drop us a message and we'll get back within 24 hours.</p>
      <div class="ci-row">
        <div class="ci-icon">📍</div>
        <a href="https://maps.google.com/?q=Kyzer+Robotics+Ambegaon+Pathar+Pune" target="_blank" rel="noopener" style="color:inherit;text-decoration:none;border-bottom:1px dashed var(--border);transition:color 0.15s;" onmouseover="this.style.color='var(--orange)'" onmouseout="this.style.color=''">Pune, Maharashtra, India</a>
      </div>
      <div style="margin-top:1rem;border-radius:12px;overflow:hidden;border:0.5px solid var(--border);">
        <iframe
          src="https://maps.google.com/maps?q=Kyzer+Robotics+Ambegaon+Pathar+Pune+Maharashtra&output=embed&z=15"
          width="100%" height="200" style="border:0;display:block;" allowfullscreen loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"></iframe>
      </div>
      <div class="ci-row"><div class="ci-icon">✉️</div> <a href="mailto:info@kyzerrobotics.com">info@kyzerrobotics.com</a></div>
      <div class="ci-row"><div class="ci-icon">📞</div> <a href="tel:+919049695264">+91 90496 95264</a></div>
      <div class="ci-row"><div class="ci-icon">📸</div> <a href="https://www.instagram.com/kyzer.robotics?igsh=bjZ3enVqaGk2NXY0" target="_blank" rel="noopener">@Kyzer.robotics</a></div>
    </div>
    <div>
      <form class="form" id="contactForm">
        <div class="form-row">
          <input id="contactName" type="text" placeholder="Your name" required />
          <input id="contactEmail" type="email" placeholder="Email address" required />
        </div>
        <input id="contactPhone" type="tel" placeholder="Phone number *" required />
        <select id="contactSubject" required>
          <option value="">What are you looking for?</option>
          <option>Drone purchase</option>
          <option>Custom drone build</option>
          <option>3D printing order</option>
          <option>Rapid prototyping</option>
          <option>Product development sprint</option>
          <option>Other</option>
        </select>
        <textarea id="contactMessage" placeholder="Tell us about your project..."></textarea>
        <button type="submit" class="form-submit">Send message →</button>
        <div class="form-success" id="formSuccess">
          ✓ Message sent! We'll get back to you within 24 hours.
        </div>
      </form>
    </div>
  </div>
</section>

<!-- NEWSLETTER -->
<section id="newsletter">
  <div class="newsletter-inner reveal">
    <div class="nl-left">
      <div class="sec-label" style="margin-bottom:0.5rem;">// STAY UPDATED</div>
      <div class="sec-title" style="font-size:clamp(28px,4vw,44px);margin-bottom:0.75rem;">Build updates.<br>No spam.</div>
      <p>Get early access to new products, 3D print material drops, and project showcases — straight to your inbox.</p>
      <form class="nl-form" onsubmit="submitNewsletter(event)">
        <input type="email" id="nlEmail" placeholder="your@email.com" required autocomplete="email">
        <button type="submit">Subscribe →</button>
      </form>
      <div id="nlSuccess" class="nl-success">✓ You're in! Watch your inbox.</div>
    </div>
    <div class="nl-divider"></div>
    <div class="nl-right">
      <div class="nl-wa-icon">💬</div>
      <h3>Prefer WhatsApp?</h3>
      <p>Drop us a message and we'll add you to our updates group — instant notifications on new drops and restocks.</p>
      <a href="https://wa.me/919049695264?text=Hi%2C%20add%20me%20to%20Kyzer%20updates%20please!" target="_blank" rel="noopener" class="nl-wa-btn">Chat on WhatsApp →</a>
    </div>
  </div>
</section>

<!-- FOOTER -->
<footer>
  <div class="footer-left">
    <img src="logo.png" alt="Kyzer Robotics" class="footer-logo">
    <p>© 2026 Kyzer Robotics Pvt. Ltd. · Pune, India</p>
  </div>
  <div class="footer-links">
    <a href="#home">Home</a>
    <a href="#services">Services</a>
    <a href="#products">Products</a>
    <a href="#contact">Contact</a>
    <a href="#" onclick="openPrivacyModal();return false;">Privacy</a>
  </div>
</footer>
</div><!-- end #mainSite -->

<!-- PRODUCT DETAIL PAGE -->
<div id="productPage">
  <button class="back-btn" onclick="showPage('main')">← Back to products</button>
  <div class="pdp-wrap">
    <div class="pdp-gallery-col">
      <div class="pdp-img-box" id="pdpEmoji">📦</div>
      <div class="pdp-thumbs" id="pdpThumbs"></div>
    </div>
    <div class="pdp-info-col">
      <span class="prod-badge" id="pdpBadge"></span>
      <h1 id="pdpName"></h1>
      <p class="pdp-short-desc" id="pdpShort"></p>
      <div class="pdp-divider"></div>
      <div class="pdp-long-desc" id="pdpLong"></div>
      <ul class="pdp-specs-list" id="pdpSpecs"></ul>
      <div id="pdpPriceWrap" style="display:none;">
        <div class="pdp-price" id="pdpPrice"></div>
        <div class="pdp-price-note" id="pdpPriceNote">Incl. GST · excl. shipping</div>
        <div class="pdp-qty-row" id="pdpQtyRow">
          <span class="pdp-qty-label">Qty</span>
          <div class="pdp-qty-ctrl">
            <button onclick="pdpQtyChange(-1)">&#8722;</button>
            <span id="pdpQtyVal">1</span>
            <button onclick="pdpQtyChange(1)">&#43;</button>
          </div>
        </div>
      </div>
      <div class="pdp-actions">
        <button class="btn-primary" id="pdpBuyNowBtn" onclick="pdpBuyNow()" style="display:none;">Buy Now →</button>
        <button class="btn-add-cart" id="pdpAddCartBtn" onclick="pdpAddToCart()" style="display:none;">Add to cart</button>
        <button class="btn-primary" id="pdpGetQuoteBtn" onclick="showPage('quote')" style="display:none;">Get a Quote →</button>
        <button class="btn-outline" id="pdpEnquireBtn" onclick="pdpEnquire()">Enquire now</button>
        <button class="btn-whatsapp" onclick="pdpWhatsApp()">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.558 4.122 1.532 5.856L.044 23.444a.5.5 0 0 0 .612.612l5.588-1.488A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.897 0-3.671-.524-5.188-1.435l-.372-.22-3.862 1.028 1.028-3.862-.22-.372A9.944 9.944 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
          WhatsApp
        </button>
        <button class="btn-outline" onclick="showPage('main')">← All products</button>
      </div>
      <div class="trust-badges">
        <div class="trust-badge"><span>🚚</span> Free delivery above ₹999</div>
        <div class="trust-badge"><span>🔒</span> Secure checkout</div>
        <div class="trust-badge"><span>↩️</span> Easy returns</div>
        <div class="trust-badge"><span>💳</span> COD available</div>
      </div>
    </div>
  </div>
</div>

<!-- 3D PRINT QUOTE PAGE -->
<div id="quotePage">
  <button class="back-btn" onclick="showPage('main')">← Back to site</button>

  <div class="quote-v2-layout">
    <!-- LEFT: Model viewer -->
    <div class="qv2-left">
      <!-- 3D Viewer -->
      <div class="model-viewer" id="modelViewer" style="border-radius:12px 12px 0 0;margin-bottom:0;height:380px;">
        <div class="model-viewer-label">// MODEL PREVIEW</div>
        <canvas id="threeCanvas" style="display:none;width:100%;height:100%;"></canvas>
        <div id="modelPlaceholderWrap" style="display:flex;flex-direction:column;align-items:center;gap:8px;">
          <div class="model-placeholder" id="modelEmoji">📦</div>
          <div class="model-filename" id="modelViewerLabel">No file uploaded</div>
        </div>
        <div id="modelViewerHint" style="display:none;position:absolute;bottom:10px;right:12px;font-family:'JetBrains Mono',monospace;font-size: 10px;color:#888;">drag to rotate · scroll to zoom</div>
      </div>

      <!-- Upload button -->
      <button class="qv2-upload-btn" id="uploadZone">
        <input type="file" id="fileInput" accept=".stl,.obj,.step,.stp,.3mf,.iges" />
        ⬆ Upload Model
      </button>

      <!-- File name bar -->
      <div id="filePreview" style="display:none;align-items:center;gap:10px;background:var(--bg2);border:0.5px solid var(--border);border-top:none;padding:10px 14px;font-size: 14px;color:#CC5500;border-radius:0 0 10px 10px;margin-bottom:8px;">
        <span>📄</span>
        <span id="filePreviewName" style="flex:1;">filename.stl</span>
        <button id="fileRemove" style="background:none;border:none;color:var(--muted);cursor:pointer;font-size: 18px;">✕</button>
      </div>

      <!-- Analysing bar -->
      <div class="analysing-bar" id="analysingBar">
        <span style="animation:spin 1s linear infinite;display:inline-block;">⟳</span>
        Analysing model... calculating volume
      </div>

      <!-- Meta: file unit + rotation -->
      <div class="qv2-meta">
        <div class="qv2-meta-row">
          <label>File Unit</label>
          <div class="unit-opts">
            <label><input type="radio" name="fileUnit" value="mm" checked> MM</label>
            <label><input type="radio" name="fileUnit" value="inch"> Inch</label>
          </div>
        </div>
        <div class="qv2-meta-row">
          <label>Rotation</label>
          <span style="font-size: 13px;">X</span>
          <input type="number" id="rotX" value="0" style="width:60px;background:var(--bg3);border:0.5px solid var(--border);color:var(--text);border-radius:6px;padding:5px 8px;font-size: 14px;font-family:'DM Sans',sans-serif;" />
          <span style="font-size: 13px;">Y</span>
          <input type="number" id="rotY" value="0" style="width:60px;background:var(--bg3);border:0.5px solid var(--border);color:var(--text);border-radius:6px;padding:5px 8px;font-size: 14px;font-family:'DM Sans',sans-serif;" />
          <button class="qv2-apply-btn" onclick="applyRotation()">Apply</button>
        </div>
      </div>

      <!-- OR divider -->
      <div class="qv2-divider" style="margin:12px 0;">OR ENTER DIMENSIONS MANUALLY</div>

      <!-- Manual dimensions -->
      <div class="qv2-dim-row">
        <div>
          <div class="qv2-dim-label">LENGTH (mm)</div>
          <input class="qv2-dim-input" type="number" id="dimL" placeholder="0" min="1" oninput="calculateQuote()" />
        </div>
        <div>
          <div class="qv2-dim-label">WIDTH (mm)</div>
          <input class="qv2-dim-input" type="number" id="dimW" placeholder="0" min="1" oninput="calculateQuote()" />
        </div>
        <div>
          <div class="qv2-dim-label">HEIGHT (mm)</div>
          <input class="qv2-dim-input" type="number" id="dimH" placeholder="0" min="1" oninput="calculateQuote()" />
        </div>
      </div>

      <!-- Model stats (shown after upload) -->
      <div class="qv2-stats" id="modelStats">
        <div class="qv2-stat-row"><span>Material Volume</span><span id="statVol">—</span></div>
        <div class="qv2-stat-row"><span>Dimensions</span><span id="statDims">—</span></div>
        <div class="qv2-stat-row"><span>Est. Weight</span><span id="statWeight">—</span></div>
      </div>
    </div>

    <!-- RIGHT: Accordion -->
    <div class="qv2-right">
      <div class="qv2-title">Kyzer 3D Print Service</div>
      <div class="qv2-subtitle">FDM printing · PLA · ABS · PETG · TPU · Nylon · Same-day available</div>

      <!-- Step 1: Quality -->
      <div class="accord-section open" id="acc-quality">
        <div class="accord-header" onclick="toggleAccord('quality')">
          <span class="acc-num">1</span>
          <span class="acc-title">Print Quality</span>
          <span class="acc-arrow">▲</span>
        </div>
        <div class="accord-body">
          <div class="acc-radio-list">
            <label class="acc-radio-item" onclick="setQuality('Draft',0.8,this)">
              <input type="radio" name="quality" value="Draft">
              <div style="flex:1;">
                <div class="acc-radio-name">Draft · 0.3mm</div>
                <div class="acc-radio-sub">Fastest print, visible layer lines</div>
              </div>
              <span class="acc-radio-price">−20%</span>
            </label>
            <label class="acc-radio-item selected" onclick="setQuality('Standard',1.0,this)">
              <input type="radio" name="quality" value="Standard" checked>
              <div style="flex:1;">
                <div class="acc-radio-name">Standard · 0.2mm</div>
                <div class="acc-radio-sub">Best value, smooth finish</div>
              </div>
              <span class="acc-radio-price">Base</span>
            </label>
            <label class="acc-radio-item" onclick="setQuality('Fine',1.4,this)">
              <input type="radio" name="quality" value="Fine">
              <div style="flex:1;">
                <div class="acc-radio-name">Fine · 0.1mm</div>
                <div class="acc-radio-sub">High detail, longer print time</div>
              </div>
              <span class="acc-radio-price">+40%</span>
            </label>
          </div>
        </div>
      </div>

      <!-- Step 2: Material -->
      <div class="accord-section" id="acc-material">
        <div class="accord-header" onclick="toggleAccord('material')">
          <span class="acc-num">2</span>
          <span class="acc-title">Material</span>
          <span class="acc-arrow">▲</span>
        </div>
        <div class="accord-body">
          <div class="acc-radio-list" id="materialAccordList">
            <label class="acc-radio-item selected" onclick="setMat('PLA',4,this)">
              <input type="radio" name="material" value="PLA" checked>
              <div style="flex:1;"><div class="acc-radio-name">PLA</div><div class="acc-radio-sub">Standard · biodegradable</div></div>
              <span class="acc-radio-price">₹4/g</span>
            </label>
            <label class="acc-radio-item" onclick="setMat('ABS',3,this)">
              <input type="radio" name="material" value="ABS">
              <div style="flex:1;"><div class="acc-radio-name">ABS</div><div class="acc-radio-sub">Durable · heat resistant</div></div>
              <span class="acc-radio-price">₹3/g</span>
            </label>
            <label class="acc-radio-item" onclick="setMat('PETG',4,this)">
              <input type="radio" name="material" value="PETG">
              <div style="flex:1;"><div class="acc-radio-name">PETG</div><div class="acc-radio-sub">Chemical resistant</div></div>
              <span class="acc-radio-price">₹4/g</span>
            </label>
            <label class="acc-radio-item" onclick="setMat('TPU',5,this)">
              <input type="radio" name="material" value="TPU">
              <div style="flex:1;"><div class="acc-radio-name">TPU</div><div class="acc-radio-sub">Flexible · rubber-like</div></div>
              <span class="acc-radio-price">₹5/g</span>
            </label>
            <label class="acc-radio-item" onclick="setMat('Nylon',5,this)">
              <input type="radio" name="material" value="Nylon">
              <div style="flex:1;"><div class="acc-radio-name">Nylon</div><div class="acc-radio-sub">Engineering grade</div></div>
              <span class="acc-radio-price">₹5/g</span>
            </label>
          </div>
        </div>
      </div>

      <!-- Step 3: Settings -->
      <div class="accord-section" id="acc-settings">
        <div class="accord-header" onclick="toggleAccord('settings')">
          <span class="acc-num">3</span>
          <span class="acc-title">Infill, Finish & Quantity</span>
          <span class="acc-arrow">▲</span>
        </div>
        <div class="accord-body">
          <div class="acc-slider-wrap">
            <div class="acc-slider-top">
              <span>Infill Density</span>
              <span class="acc-slider-val" id="infillVal">20%</span>
            </div>
            <input type="range" id="infillSlider" min="10" max="100" step="5" value="20"
              oninput="document.getElementById('infillVal').textContent=this.value+'%'; calculateQuote()" />
            <div style="display:flex;justify-content:space-between;font-size: 11px;color:var(--muted);margin-top:4px;font-family:'JetBrains Mono',monospace;">
              <span>10% light</span><span>50% medium</span><span>100% solid</span>
            </div>
          </div>

          <div style="font-size: 12px;color:var(--muted);margin-bottom:8px;font-family:'JetBrains Mono',monospace;letter-spacing:0.05em;">COLOUR / FINISH</div>
          <div class="color-swatches" id="colorSwatches">
            <div class="color-swatch selected" data-color="#FFFFFF" data-name="White" data-premium="0" onclick="selectColorSwatch(this)"><div class="swatch-circle" style="background:#fff;"></div>White</div>
            <div class="color-swatch" data-color="#1a1a1a" data-name="Black" data-premium="0" onclick="selectColorSwatch(this)"><div class="swatch-circle" style="background:#1a1a1a;"></div>Black</div>
            <div class="color-swatch" data-color="#9E9E9E" data-name="Gray" data-premium="0" onclick="selectColorSwatch(this)"><div class="swatch-circle" style="background:#9E9E9E;"></div>Gray</div>
            <div class="color-swatch" data-color="#F5DEB3" data-name="Natural" data-premium="0" onclick="selectColorSwatch(this)"><div class="swatch-circle" style="background:#F5DEB3;border-color:#ccc;"></div>Natural</div>
            <div class="color-swatch" data-color="#EF5350" data-name="Red" data-premium="20" onclick="selectColorSwatch(this)"><div class="swatch-circle" style="background:#EF5350;"></div>Red</div>
            <div class="color-swatch" data-color="#42A5F5" data-name="Blue" data-premium="20" onclick="selectColorSwatch(this)"><div class="swatch-circle" style="background:#42A5F5;"></div>Blue</div>
            <div class="color-swatch" data-color="#66BB6A" data-name="Green" data-premium="20" onclick="selectColorSwatch(this)"><div class="swatch-circle" style="background:#66BB6A;"></div>Green</div>
            <div class="color-swatch" data-color="#FF8C35" data-name="Orange" data-premium="20" onclick="selectColorSwatch(this)"><div class="swatch-circle" style="background:#FF8C35;"></div>Orange</div>
            <div class="color-swatch" data-color="#AB47BC" data-name="Purple" data-premium="20" onclick="selectColorSwatch(this)"><div class="swatch-circle" style="background:#AB47BC;"></div>Purple</div>
            <div class="color-swatch" data-color="custom" data-name="Custom" data-premium="20" onclick="selectColorSwatch(this)"><div class="swatch-circle swatch-custom">+</div>Custom</div>
          </div>
          <div class="custom-color-row" id="customColorRow">
            <input type="color" id="customColorPicker" value="#FF0000" oninput="syncCustomColor(this.value)">
            <input type="text" id="customColorHex" placeholder="#FF0000" maxlength="7" oninput="syncCustomHex(this.value)">
            <span style="font-size:11px;color:var(--muted);">+₹20</span>
          </div>

          <div style="font-size: 12px;color:var(--muted);margin-bottom:6px;font-family:'JetBrains Mono',monospace;letter-spacing:0.05em;">SUPPORT STRUCTURES</div>
          <select class="acc-select" id="supportSelect" onchange="calculateQuote()">
            <option value="0">None needed</option>
            <option value="1">Standard supports (+10%)</option>
            <option value="2">Heavy supports (+20%)</option>
          </select>

          <div style="font-size: 12px;color:var(--muted);margin-bottom:8px;font-family:'JetBrains Mono',monospace;letter-spacing:0.05em;">QUANTITY</div>
          <div class="acc-qty-wrap">
            <button class="acc-qty-btn" onclick="changeQty(-1)">−</button>
            <input type="number" id="qtyInput" value="1" min="1" max="100"
              style="width:52px;text-align:center;background:var(--bg3);border:0.5px solid var(--border);color:var(--text);border-radius:8px;padding:6px 4px;font-size:15px;font-family:'DM Sans',sans-serif;"
              oninput="setQtyDirect(this.value)">
            <button class="acc-qty-btn" onclick="changeQty(1)">+</button>
            <span style="font-size: 12px;color:var(--muted);">bulk discount at 5+</span>
          </div>

          <div style="font-size: 12px;color:var(--muted);margin-bottom:8px;font-family:'JetBrains Mono',monospace;letter-spacing:0.05em;">DELIVERY</div>
          <div class="rush-toggle-row">
            <div>
              <div class="rush-toggle-label">⚡ Rush Priority</div>
              <div class="rush-toggle-sub">Jump the queue · +50% to total</div>
            </div>
            <div style="display:flex;align-items:center;gap:8px;">
              <span class="rush-toggle-badge" id="rushBadge" style="display:none;">+50%</span>
              <div class="toggle-switch" id="rushToggle" onclick="toggleRush()"></div>
            </div>
          </div>
          <div class="acc-delivery-grid">
            <button class="acc-del-btn" id="delSameDay" onclick="selectDelivery('sameday',this)">
              Same Day<span>+₹200</span>
            </button>
            <button class="acc-del-btn selected" id="del7d" onclick="selectDelivery('7day',this)">
              7 Days<span>+₹150</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Step 4: Finalize -->
      <div class="accord-section" id="acc-finalize">
        <div class="accord-header" onclick="toggleAccord('finalize')">
          <span class="acc-num">4</span>
          <span class="acc-title">Finalize & Order</span>
          <span class="acc-arrow">▲</span>
        </div>
        <div class="accord-body">
          <div class="qv2-price-big">
            <div class="qv2-price-label">ESTIMATED TOTAL</div>
            <div class="qv2-price-num" id="priceAmount">₹—</div>
            <div style="font-size: 13px;color:var(--muted);margin-top:4px;" id="priceSub">Enter dimensions to get a quote</div>
          </div>

          <div class="qv2-breakdown">
            <div class="qv2-pb-row"><span>Material</span><span id="bMat">—</span></div>
            <div class="qv2-pb-row"><span>Machine time</span><span id="bTime">—</span></div>
            <div class="qv2-pb-row"><span>Quality</span><span id="bQual">—</span></div>
            <div class="qv2-pb-row"><span>Infill</span><span id="bInfill">—</span></div>
            <div class="qv2-pb-row"><span>Colour</span><span id="bColor">—</span></div>
            <div class="qv2-pb-row"><span>Supports</span><span id="bSupport">—</span></div>
            <div class="qv2-pb-row"><span>Setup fee</span><span id="bSetup">—</span></div>
            <div class="qv2-pb-row"><span>Quantity</span><span id="bQty">—</span></div>
            <div class="qv2-pb-row"><span>Rush priority</span><span id="bRush" style="color:#e65100;">—</span></div>
            <div class="qv2-pb-row"><span>Delivery</span><span id="bDelivery">—</span></div>
            <div class="qv2-pb-row total"><span>TOTAL</span><span id="bTotal">—</span></div>
          </div>

          <div style="background:#fff3e8;border:0.5px solid rgba(255,140,53,0.25);border-radius:8px;padding:10px 14px;display:flex;align-items:center;gap:8px;margin-bottom:1rem;font-size: 13px;color:#CC5500;" id="turnaroundBar">
            ⚡ <span id="turnaroundText">Enter dimensions to see turnaround</span>
          </div>

          <button class="qv2-order-btn" onclick="orderNow()">Place order →</button>
          <button class="qv2-save-btn" onclick="saveQuote()">💾 Save / download quote</button>
          <div class="qv2-note">Prices are estimates. Final quote confirmed after file review.<br>GST applicable as per government norms.</div>
        </div>
      </div>
    </div>
  </div>

  <!-- Quote Checkout -->
  <div id="quoteContactSection" style="display:none;">

    <!-- Step bar -->
    <div class="qco-steps">
      <div class="qco-step active" id="qcoStep1">
        <div class="qco-step-circle" id="qcoCircle1">1</div>
        <div class="qco-step-lbl">DELIVERY</div>
      </div>
      <div class="qco-line"></div>
      <div class="qco-step" id="qcoStep2">
        <div class="qco-step-circle" id="qcoCircle2">2</div>
        <div class="qco-step-lbl">REVIEW</div>
      </div>
      <div class="qco-line"></div>
      <div class="qco-step" id="qcoStep3">
        <div class="qco-step-circle" id="qcoCircle3">3</div>
        <div class="qco-step-lbl">PAYMENT</div>
      </div>
    </div>

    <div class="checkout-wrap">
      <!-- LEFT: step panels -->
      <div class="checkout-form">

        <!-- PANEL 1: Delivery details -->
        <div class="qco-panel active" id="qcoPanel1">
          <div class="checkout-section">
            <div class="checkout-section-header">
              <div class="checkout-step-num">01</div>
              <div class="checkout-step-title">Contact details</div>
            </div>
            <div class="qcp-grid-2">
              <input class="qcp-input" type="text" placeholder="Full name *" id="qfName" />
              <input class="qcp-input" type="email" placeholder="Email address *" id="qfEmail" />
            </div>
            <div class="qcp-grid-2">
              <input class="qcp-input" type="tel" placeholder="Phone number *" id="qfPhone" />
              <input class="qcp-input" type="text" placeholder="Company / Organisation (optional)" id="qfCompany" />
            </div>
          </div>
          <div class="checkout-section">
            <div class="checkout-section-header">
              <div class="checkout-step-num">02</div>
              <div class="checkout-step-title">Shipping address</div>
            </div>
            <input class="qcp-input qcp-full" type="text" placeholder="Address line 1 (house / flat / building) *" id="qfAddr1" />
            <input class="qcp-input qcp-full" type="text" placeholder="Address line 2 (street, area — optional)" id="qfAddr2" />
            <div class="qcp-grid-3">
              <input class="qcp-input" type="text" placeholder="City *" id="qfCity" />
              <input class="qcp-input" type="text" placeholder="State *" id="qfState" />
              <input class="qcp-input" type="text" placeholder="Pincode *" id="qfPincode" inputmode="numeric" maxlength="6" />
            </div>
            <input class="qcp-input qcp-full" type="text" placeholder="Landmark (optional)" id="qfLandmark" />
          </div>
          <div class="checkout-section">
            <div class="checkout-section-header">
              <div class="checkout-step-num">03</div>
              <div class="checkout-step-title">Additional notes</div>
            </div>
            <textarea class="qcp-input qcp-full" style="height:70px;resize:none;" placeholder="Special instructions, colour preferences, deadline, etc." id="qfNotes"></textarea>
          </div>
          <button class="qv2-order-btn" onclick="qcoAdvance()">Continue to Review →</button>
        </div>

        <!-- PANEL 2: Review -->
        <div class="qco-panel" id="qcoPanel2">
          <div class="qco-review-box">
            <div style="font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:0.08em;color:var(--muted);margin-bottom:10px;">ORDER REVIEW</div>
            <div style="font-size:17px;font-weight:600;margin-bottom:2px;" id="qcoRevName">—</div>
            <div style="font-size:12px;color:var(--muted);margin-bottom:14px;" id="qcoRevContact">—</div>
            <div class="qco-rev-row"><span>Material</span><span id="qcoRevMat">—</span></div>
            <div class="qco-rev-row"><span>Quality</span><span id="qcoRevQual">—</span></div>
            <div class="qco-rev-row"><span>Colour</span><span id="qcoRevColor">—</span></div>
            <div class="qco-rev-row"><span>Quantity</span><span id="qcoRevQty">—</span></div>
            <div class="qco-rev-row"><span>Delivery</span><span id="qcoRevDel">—</span></div>
            <div class="qco-rev-row"><span>Dimensions</span><span id="qcoRevDims">—</span></div>
            <div class="qco-rev-row grand"><span>Estimated Total</span><span id="qcoRevTotal" style="color:var(--orange);font-size:17px;">₹—</span></div>
          </div>
          <div style="font-size:12px;color:var(--muted);margin-bottom:1rem;line-height:1.6;">Price is an estimate. Final amount confirmed after file review by our team.</div>
          <button class="qv2-order-btn" onclick="qcoAdvance()">Continue to Payment →</button>
          <span class="qco-back-link" onclick="qcoGoStep(1)">← Edit details</span>
        </div>

        <!-- PANEL 3: Payment -->
        <div class="qco-panel" id="qcoPanel3">
          <div class="qco-pay-box">
            <div style="font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:0.08em;color:var(--muted);">ESTIMATED TOTAL</div>
            <div class="qco-pay-amount" id="qcoPayTotal">₹—</div>
            <div style="font-size:11px;color:var(--muted);">Final confirmed after file review</div>
          </div>
          <div style="display:flex;flex-direction:column;gap:10px;">
            <button class="qv2-order-btn" id="qcoPayBtn" onclick="qcoPay()" style="background:var(--orange);">
              💳 Pay Now →
            </button>
            <div style="text-align:center;font-size:12px;color:var(--muted);padding:2px 0;">— or —</div>
            <button class="qv2-save-btn" id="qcoPayLaterBtn" onclick="qcoSubmitWithoutPayment()">
              📋 Submit without payment · We'll send payment link after review
            </button>
          </div>
          <div id="qfSuccess" style="display:none;background:#e8f5e9;border:0.5px solid rgba(76,175,80,0.4);color:#2e7d32;border-radius:10px;padding:14px;font-size:14px;text-align:center;margin-top:16px;line-height:1.6;">
            ✓ Order placed!
          </div>
          <span class="qco-back-link" onclick="qcoGoStep(2)">← Back to review</span>
          <div class="qv2-note" style="margin-top:14px;">Payments secured by Razorpay · Or email <a href="mailto:info@kyzerrobotics.com" style="color:#FF8C35;">info@kyzerrobotics.com</a></div>
        </div>

      </div>

      <!-- RIGHT: order summary (always visible) -->
      <div class="checkout-summary">
        <div class="cs-heading">🧾 Order summary</div>
        <div class="cs-row"><span class="cs-label">Material</span><span class="cs-val" id="cs-material">—</span></div>
        <div class="cs-row"><span class="cs-label">Quality</span><span class="cs-val" id="cs-quality">—</span></div>
        <div class="cs-row"><span class="cs-label">Infill</span><span class="cs-val" id="cs-infill">—</span></div>
        <div class="cs-row"><span class="cs-label">Colour</span><span class="cs-val" id="cs-colour">—</span></div>
        <div class="cs-row"><span class="cs-label">Support</span><span class="cs-val" id="cs-support">—</span></div>
        <div class="cs-row"><span class="cs-label">Quantity</span><span class="cs-val" id="cs-qty">—</span></div>
        <div class="cs-row"><span class="cs-label">Delivery</span><span class="cs-val" id="cs-delivery">—</span></div>
        <div class="cs-row"><span class="cs-label">Dimensions</span><span class="cs-val" id="cs-dims">—</span></div>
        <div id="cs-file-wrap" style="display:none;">
          <div class="cs-file-row">📎 <span id="cs-filename" style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;"></span></div>
        </div>
        <div class="cs-total-row">
          <span class="cs-total-label">Estimated total</span>
          <span class="cs-total-price" id="cs-total">₹—</span>
        </div>
      </div>
    </div>
  </div>
</div>


<!-- AUTH MODAL -->
<div class="auth-overlay" id="authOverlay">
  <div class="auth-modal" id="authModal">
    <div class="auth-modal-header">
      <div class="auth-modal-logo">Kyzer <span>Robotics</span></div>
      <button class="auth-close" onclick="closeAuthModal()" aria-label="Close">&times;</button>
    </div>
    <div class="auth-tabs">
      <div class="auth-tab active" id="authTabLogin" onclick="switchAuthTab('login')">Sign In</div>
      <div class="auth-tab" id="authTabRegister" onclick="switchAuthTab('register')">Create Account</div>
    </div>
    <div class="auth-body">
      <!-- LOGIN -->
      <div id="authLoginForm">
        <button class="auth-google-btn" onclick="signInWithGoogle(); return false;">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          Continue with Google
        </button>
        <div class="auth-divider"><span>or sign in with email</span></div>
        <div class="auth-field">
          <label>Email</label>
          <input type="email" id="authLoginEmail" placeholder="you@example.com" autocomplete="email">
        </div>
        <div class="auth-field">
          <label>Password</label>
          <input type="password" id="authLoginPass" placeholder="Your password" autocomplete="current-password">
        </div>
        <div class="auth-error" id="authLoginError"></div>
        <button class="auth-submit" id="authLoginBtn" onclick="loginCustomer()">Sign in &#8594;</button>
        <div class="auth-switch">Forgot password? <a href="mailto:info@kyzerrobotics.com">Contact us</a></div>
      </div>
      <!-- REGISTER -->
      <div id="authRegForm" style="display:none;">
        <button class="auth-google-btn" onclick="signInWithGoogle(); return false;">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          Sign up with Google
        </button>
        <div class="auth-divider"><span>or create account with email</span></div>
        <div class="auth-field">
          <label>Full Name</label>
          <input type="text" id="authRegName" placeholder="Your full name" autocomplete="name">
        </div>
        <div class="auth-field">
          <label>Email</label>
          <input type="email" id="authRegEmail" placeholder="you@example.com" autocomplete="email">
        </div>
        <div class="auth-field">
          <label>Phone</label>
          <input type="tel" id="authRegPhone" placeholder="+91 XXXXX XXXXX" autocomplete="tel">
        </div>
        <div class="auth-field">
          <label>Password</label>
          <input type="password" id="authRegPass" placeholder="Min. 6 characters" autocomplete="new-password">
        </div>
        <div class="auth-error" id="authRegError"></div>
        <button class="auth-submit" id="authRegBtn" onclick="registerCustomer()">Create account &#8594;</button>
        <div class="auth-switch">Already have an account? <a onclick="switchAuthTab('login')">Sign in</a></div>
      </div>
    </div>
  </div>
</div>

<!-- MY ACCOUNT PAGE -->
<div id="accountPage">
  <div class="account-wrap">
    <div class="account-back" onclick="showPage('main')">&#8592; Back to site</div>
    <div class="account-page-title">My Account</div>
    <div class="account-page-subtitle">Manage your profile and track your orders</div>
    <div class="account-grid">
      <!-- Sidebar -->
      <div class="account-sidebar">
        <div class="account-avatar-big" id="accBigAvatar">K</div>
        <div class="account-display-name" id="accDispName">—</div>
        <div class="account-display-email" id="accDispEmail">—</div>
        <div class="account-nav-item active" id="accnav-profile" onclick="setAccountSection('profile')">&#128100; Profile</div>
        <div class="account-nav-item" id="accnav-orders" onclick="setAccountSection('orders')">&#128230; My Orders</div>
        <div class="account-nav-item logout-item" onclick="logoutCustomer()">&#128275; Sign out</div>
      </div>
      <!-- Main panel -->
      <div class="account-main-panel">
        <!-- Profile -->
        <div class="account-section active" id="accSec-profile">
          <div class="account-section-title">Profile</div>
          <div class="profile-form-grid">
            <div class="profile-field">
              <label>Full Name</label>
              <input type="text" id="pfName" placeholder="Your full name">
            </div>
            <div class="profile-field">
              <label>Phone</label>
              <input type="tel" id="pfPhone" placeholder="+91 XXXXX XXXXX">
            </div>
            <div class="profile-field full">
              <label>Email (cannot be changed)</label>
              <input type="email" id="pfEmail" readonly style="opacity:0.55;cursor:default;">
            </div>
            <div class="profile-field full">
              <label>Address Line 1</label>
              <input type="text" id="pfAddr1" placeholder="Flat/House no., Street name">
            </div>
            <div class="profile-field full">
              <label>Address Line 2</label>
              <input type="text" id="pfAddr2" placeholder="Area, Colony (optional)">
            </div>
            <div class="profile-field">
              <label>City</label>
              <input type="text" id="pfCity" placeholder="City">
            </div>
            <div class="profile-field">
              <label>State</label>
              <input type="text" id="pfState" placeholder="State">
            </div>
            <div class="profile-field">
              <label>Pincode</label>
              <input type="text" id="pfPincode" placeholder="Pincode">
            </div>
            <div class="profile-field">
              <label>Landmark</label>
              <input type="text" id="pfLandmark" placeholder="Nearby landmark (optional)">
            </div>
          </div>
          <div style="display:flex;align-items:center;gap:14px;margin-top:18px;">
            <button class="profile-save-btn" onclick="saveProfile()">Save changes</button>
            <span id="profileSaveMsg" style="font-size:0.85rem;color:#1a8f4f;display:none;">Saved!</span>
          </div>
        </div>
        <!-- Orders -->
        <div class="account-section" id="accSec-orders">
          <div class="account-section-title">My Orders</div>
          <div id="orderHistList"></div>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- CART DRAWER -->
<div class="cart-overlay" id="cartOverlay" onclick="closeCartDrawer()"></div>
<div class="cart-drawer" id="cartDrawer">
  <div class="cart-drawer-header">
    <div class="cart-drawer-title">Your Cart</div>
    <button class="cart-drawer-close" onclick="closeCartDrawer()" aria-label="Close cart">&#10005;</button>
  </div>
  <div class="cart-items-list" id="cartItemsList"></div>
  <div class="cart-drawer-footer" id="cartDrawerFooter" style="display:none;">
    <div id="freeShipBar"></div>
    <div class="cart-total-row">
      <span class="cart-total-label">Total</span>
      <span class="cart-total-val" id="cartTotalVal">₹0</span>
    </div>
    <button class="cart-checkout-btn" onclick="goToCheckout()">Proceed to Checkout →</button>
  </div>
</div>

<!-- BRANDED PAGE LOADER -->
<div id="pageLoader">
  <div class="loader-drone">
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
      <g class="loader-prop" style="transform-origin:16px 28px"><rect x="6" y="26" width="20" height="4" rx="2" fill="#FF8C35"/></g>
      <g class="loader-prop" style="transform-origin:48px 28px"><rect x="38" y="26" width="20" height="4" rx="2" fill="#FF8C35"/></g>
      <rect x="24" y="30" width="16" height="10" rx="4" fill="#111"/>
      <rect x="28" y="40" width="8" height="6" rx="2" fill="#333"/>
      <line x1="16" y1="28" x2="24" y2="32" stroke="#555" stroke-width="2"/>
      <line x1="48" y1="28" x2="40" y2="32" stroke="#555" stroke-width="2"/>
    </svg>
  </div>
</div>

<!-- CHECKOUT PAGE -->
<div id="checkoutPage">
  <button class="co-back-btn" onclick="openCartDrawer()">← Back to cart</button>
  <div class="co-page-title">Checkout</div>
  <div class="co-steps" id="coSteps">
    <div class="co-step active" id="coStep1" onclick="coGoStep(1)">
      <div class="co-step-num"><span class="co-step-num-txt">1</span></div>
      <span class="co-step-label">Delivery</span>
    </div>
    <div class="co-step" id="coStep2" onclick="coGoStep(2)">
      <div class="co-step-num"><span class="co-step-num-txt">2</span></div>
      <span class="co-step-label">Review</span>
    </div>
    <div class="co-step" id="coStep3" onclick="coGoStep(3)">
      <div class="co-step-num"><span class="co-step-num-txt">3</span></div>
      <span class="co-step-label">Payment</span>
    </div>
  </div>
  <div class="checkout-wrap">

    <!-- LEFT: multi-step panels -->
    <div class="checkout-form">

      <!-- STEP 1: Delivery details -->
      <div class="co-panel active" id="coPanel1">
        <div class="checkout-section">
          <div class="checkout-section-header">
            <div class="checkout-step-num">01</div>
            <div class="checkout-step-title">Contact details</div>
          </div>
          <div class="qcp-grid-2">
            <input class="qcp-input" type="text" placeholder="Full name *" id="coName" />
            <input class="qcp-input" type="email" placeholder="Email address *" id="coEmail" />
          </div>
          <div class="qcp-grid-2">
            <input class="qcp-input" type="tel" placeholder="Phone number *" id="coPhone" />
            <input class="qcp-input" type="text" placeholder="Company / Organisation (optional)" id="coCompany" />
          </div>
        </div>
        <div class="checkout-section">
          <div class="checkout-section-header">
            <div class="checkout-step-num">02</div>
            <div class="checkout-step-title">Shipping address</div>
          </div>
          <input class="qcp-input qcp-full" type="text" placeholder="Address line 1 (house / flat / building) *" id="coAddr1" />
          <input class="qcp-input qcp-full" type="text" placeholder="Address line 2 (street, area — optional)" id="coAddr2" />
          <div class="qcp-grid-3">
            <input class="qcp-input" type="text" placeholder="City *" id="coCity" />
            <input class="qcp-input" type="text" placeholder="State *" id="coState" />
            <input class="qcp-input" type="text" placeholder="Pincode *" id="coPincode" inputmode="numeric" maxlength="6" />
          </div>
          <input class="qcp-input qcp-full" type="text" placeholder="Landmark (optional)" id="coLandmark" />
          <textarea class="qcp-input qcp-full" style="height:70px;resize:none;margin-top:10px;" placeholder="Delivery instructions (optional)" id="coNotes"></textarea>
        </div>
        <button class="qv2-order-btn" onclick="coAdvance()">Continue to Review →</button>
      </div>

      <!-- STEP 2: Review order -->
      <div class="co-panel" id="coPanel2">
        <div class="checkout-section">
          <div class="checkout-section-header">
            <div class="checkout-step-num">✓</div>
            <div class="checkout-step-title">Your order</div>
          </div>
          <div id="coReviewItems"></div>
        </div>
        <div class="checkout-section">
          <div class="checkout-section-header">
            <div class="checkout-step-num">✓</div>
            <div class="checkout-step-title">Delivering to</div>
          </div>
          <div id="coReviewAddress" style="font-size:14px;color:var(--muted);line-height:1.7;"></div>
          <button onclick="coGoStep(1)" style="margin-top:8px;background:none;border:none;color:var(--orange);font-size:13px;cursor:pointer;padding:0;">Edit address ↗</button>
        </div>
        <button class="qv2-order-btn" onclick="coAdvance()">Continue to Payment →</button>
      </div>

      <!-- STEP 3: Payment -->
      <div class="co-panel" id="coPanel3">
        <div class="checkout-section">
          <div class="checkout-section-header">
            <div class="checkout-step-num">03</div>
            <div class="checkout-step-title">Payment</div>
          </div>
          <div style="display:flex;flex-wrap:wrap;gap:10px;margin-bottom:16px;">
            <div class="trust-badge"><span>🔒</span> Secured by Razorpay</div>
            <div class="trust-badge"><span>💳</span> Card / UPI</div>
            <div class="trust-badge"><span>🏦</span> Netbanking</div>
            <div class="trust-badge"><span>👛</span> Wallets</div>
          </div>
          <button class="qv2-order-btn" id="coSubmitBtn" onclick="submitProductOrder()">Pay now →</button>
          <div id="coSuccess" style="display:none;background:#e8f5e9;border:0.5px solid rgba(76,175,80,0.4);color:#2e7d32;border-radius:10px;padding:14px;font-size:15px;text-align:center;margin-top:12px;"></div>
          <div class="qv2-note" style="margin-top:10px;">Questions? <a href="https://wa.me/919049695264" target="_blank" style="color:#FF8C35;">WhatsApp us</a></div>
        </div>
      </div>

    </div>

    <!-- RIGHT: order summary -->
    <div class="checkout-summary">
      <div class="cs-heading">&#x1F9FE; Order summary</div>
      <div id="coSummaryItems"></div>
      <div style="border-top:0.5px solid var(--border);margin:10px 0 8px;"></div>
      <div class="cs-row"><span class="cs-label">Subtotal</span><span class="cs-val" id="coSummarySubtotal">—</span></div>
      <div class="cs-row"><span class="cs-label">GST (18%)</span><span class="cs-val" id="coSummaryGST">—</span></div>
      <div class="cs-row"><span class="cs-label">Delivery</span><span class="cs-val" id="coSummaryDelivery">—</span></div>
      <div class="cs-total-row" style="margin-top:0.75rem;border-top:0.5px solid var(--border);padding-top:0.75rem;">
        <span class="cs-total-label">Total</span>
        <span class="cs-total-price" id="coSummaryTotal">₹0</span>
      </div>
      <p style="font-size:11px;color:var(--muted);margin-top:10px;line-height:1.6;">Free delivery on orders above ₹999 · Secure checkout</p>
    </div>

  </div>
</div>

<!-- PRIVACY POLICY MODAL -->
<div class="auth-overlay" id="privacyOverlay" onclick="if(event.target===this)closePrivacyModal()">
  <div class="auth-modal" style="max-width:560px;max-height:90vh;display:flex;flex-direction:column;">
    <div class="auth-modal-header">
      <div class="auth-modal-logo">Privacy <span>Policy</span></div>
      <button class="auth-close" onclick="closePrivacyModal()" aria-label="Close">&times;</button>
    </div>
    <div style="padding:24px 28px;overflow-y:auto;font-size:14px;line-height:1.7;color:var(--text);">
      <p style="color:var(--muted);font-size:12px;margin-bottom:16px;">Last updated: May 2026</p>

      <p><strong>Kyzer Robotics Pvt. Ltd.</strong> ("we", "us") is committed to protecting your privacy. This policy explains what information we collect, how we use it, and your rights.</p>

      <h4 style="margin:18px 0 6px;font-size:14px;">Information we collect</h4>
      <p>When you contact us, request a quote, or place an order, we may collect:</p>
      <ul style="padding-left:20px;margin:6px 0 12px;">
        <li>Name, email address, and phone number</li>
        <li>Shipping address and delivery instructions</li>
        <li>Project files (STL, OBJ, or similar) submitted for 3D print quotes</li>
        <li>Payment confirmation details (we do not store card numbers — payments are processed by Razorpay)</li>
      </ul>

      <h4 style="margin:18px 0 6px;font-size:14px;">How we use your information</h4>
      <ul style="padding-left:20px;margin:6px 0 12px;">
        <li>To respond to your inquiries and deliver ordered services</li>
        <li>To send order confirmations and status updates</li>
        <li>To improve our products and services</li>
        <li>To comply with applicable Indian laws and regulations</li>
      </ul>

      <h4 style="margin:18px 0 6px;font-size:14px;">Data sharing</h4>
      <p>We do not sell, rent, or share your personal information with third parties for marketing purposes. We may share data with service providers (e.g., delivery partners, payment processors) only as necessary to fulfil your order.</p>

      <h4 style="margin:18px 0 6px;font-size:14px;">Data retention</h4>
      <p>We retain your information for as long as necessary to provide our services and comply with legal obligations. You may request deletion of your data at any time.</p>

      <h4 style="margin:18px 0 6px;font-size:14px;">Your rights</h4>
      <p>Under applicable Indian law (IT Act 2000, DPDP Act 2023), you have the right to access, correct, or request deletion of your personal data.</p>

      <h4 style="margin:18px 0 6px;font-size:14px;">Contact</h4>
      <p>For privacy-related queries, email us at <a href="mailto:info@kyzerrobotics.com" style="color:var(--orange);">info@kyzerrobotics.com</a>.</p>

      <p style="margin-top:18px;font-size:12px;color:var(--muted);">Kyzer Robotics Pvt. Ltd. · Pune, Maharashtra, India</p>
    </div>
  </div>
</div>

<!-- Floating WhatsApp Button -->
<a class="wa-fab" href="https://wa.me/919049695264" target="_blank" rel="noopener" aria-label="Chat on WhatsApp">
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.558 4.122 1.532 5.856L.044 23.444a.5.5 0 0 0 .612.612l5.588-1.488A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.897 0-3.671-.524-5.188-1.435l-.372-.22-3.862 1.028 1.028-3.862-.22-.372A9.944 9.944 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
  </svg>
</a>`;

export default function HomePage() {
  const rzpKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '';
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: `window.__RZP_KEY__=${JSON.stringify(rzpKey)};` }} />
      <Script src="https://accounts.google.com/gsi/client" strategy="afterInteractive" />
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js" strategy="afterInteractive" />
      <Script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/STLLoader.js" strategy="afterInteractive" />
      <Script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/OBJLoader.js" strategy="afterInteractive" />
      <Script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js" strategy="afterInteractive" />
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />
      <div dangerouslySetInnerHTML={{ __html: PAGE_HTML }} />
      <Script src="/site.js" strategy="afterInteractive" />
    </>
  );
}
