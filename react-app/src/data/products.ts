export interface Product {
  id: string
  name: string
  slug: string
  category: string
  subcategory: string
  price: number
  originalPrice?: number
  image?: string
  emoji: string
  badge?: 'NEW' | 'SALE' | 'HOT' | 'LIMITED'
  shortDesc: string
  specs?: string[]
  inStock: boolean
  featured?: boolean
  whatsappMsg?: string
}

export interface Category {
  id: string
  name: string
  slug: string
  emoji: string
  description: string
  subcategories: Subcategory[]
}

export interface Subcategory {
  id: string
  name: string
  slug: string
}

export const CATEGORIES: Category[] = [
  {
    id: 'electronics',
    name: 'Electronics',
    slug: 'electronics',
    emoji: '⚡',
    description: 'Arduino, Raspberry Pi, sensors, motors, modules and more.',
    subcategories: [
      { id: 'arduino', name: 'Arduino & MCUs', slug: 'arduino' },
      { id: 'sensors', name: 'Sensors', slug: 'sensors' },
      { id: 'motors', name: 'Motors & Actuators', slug: 'motors' },
      { id: 'modules', name: 'Modules', slug: 'modules' },
      { id: 'batteries', name: 'Batteries & Power', slug: 'batteries' },
      { id: 'displays', name: 'Displays', slug: 'displays' },
    ],
  },
  {
    id: 'drones',
    name: 'Drones',
    slug: 'drones',
    emoji: '🚁',
    description: 'Frames, flight controllers, motors, ESCs, propellers and complete builds.',
    subcategories: [
      { id: 'complete', name: 'Complete Drones', slug: 'complete' },
      { id: 'frames', name: 'Frames', slug: 'frames' },
      { id: 'flight-controllers', name: 'Flight Controllers', slug: 'flight-controllers' },
      { id: 'motors', name: 'Motors', slug: 'motors' },
      { id: 'escs', name: 'ESCs', slug: 'escs' },
      { id: 'props', name: 'Propellers', slug: 'props' },
    ],
  },
  {
    id: '3d-printing',
    name: '3D Printing',
    slug: '3d-printing',
    emoji: '🖨️',
    description: 'Custom 3D printing in PLA, ABS, PETG, TPU and Nylon with 48hr turnaround.',
    subcategories: [
      { id: 'fdm', name: 'FDM Printing', slug: 'fdm' },
      { id: 'resin', name: 'Resin Printing', slug: 'resin' },
      { id: 'filaments', name: 'Filaments', slug: 'filaments' },
    ],
  },
  {
    id: 'prototyping',
    name: 'Prototyping',
    slug: 'prototyping',
    emoji: '🔧',
    description: 'PCB design, CNC machining, laser cutting and rapid prototyping services.',
    subcategories: [
      { id: 'pcb', name: 'PCB Design & Mfg', slug: 'pcb' },
      { id: 'cnc', name: 'CNC Machining', slug: 'cnc' },
      { id: 'laser', name: 'Laser Cutting', slug: 'laser' },
    ],
  },
  {
    id: 'printers-supplies',
    name: 'Printer Supplies',
    slug: 'printers-supplies',
    emoji: '🧵',
    description: 'Filaments, resins, nozzles, beds and all your 3D printing consumables.',
    subcategories: [
      { id: 'filaments', name: 'Filaments', slug: 'filaments' },
      { id: 'resins', name: 'Resins', slug: 'resins' },
      { id: 'parts', name: 'Printer Parts', slug: 'parts' },
    ],
  },
]

// ─── PRODUCTS ────────────────────────────────────────────────────────────────
// Fill in price, specs, and details for each product below.
// Set inStock: false to show "Out of Stock" badge.
// Set featured: true to show on shop landing page.

export const PRODUCTS: Product[] = [
  // ── ELECTRONICS → ARDUINO ────────────────────────────────────────────────
  {
    id: 'e-uno',
    name: 'Arduino Uno R3',
    slug: 'arduino-uno-r3',
    category: 'electronics',
    subcategory: 'arduino',
    price: 446,
    emoji: '🔵',
    badge: 'HOT',
    image: 'https://images.unsplash.com/photo-1586920740099-f3ceb65bc51e?w=600&q=80&auto=format&fit=crop',
    shortDesc: 'The classic ATmega328P development board. Perfect for beginners and pros alike.',
    specs: ['ATmega328P MCU', '14 digital I/O pins', '6 analog inputs', 'USB-B connector'],
    inStock: true,
    featured: true,
  },
  {
    id: 'e-mega',
    name: 'Arduino Mega 2560',
    slug: 'arduino-mega-2560',
    category: 'electronics',
    subcategory: 'arduino',
    price: 1299,
    emoji: '🟢',
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&q=80&auto=format&fit=crop',
    shortDesc: 'More pins, more power. 54 digital I/O pins and 256KB flash for complex projects.',
    specs: ['ATmega2560 MCU', '54 digital I/O', '16 analog inputs', '256KB flash'],
    inStock: true,
  },
  {
    id: 'e-nano',
    name: 'Arduino Nano',
    slug: 'arduino-nano',
    category: 'electronics',
    subcategory: 'arduino',
    price: 299,
    emoji: '🔷',
    image: 'https://images.unsplash.com/photo-1603732551658-5fabbafa84eb?w=600&q=80&auto=format&fit=crop',
    shortDesc: 'Compact and powerful. All the Arduino goodness in a tiny breadboard-friendly form.',
    specs: ['ATmega328P', 'Mini USB', 'Breadboard compatible', '22 I/O pins'],
    inStock: true,
  },
  {
    id: 'e-esp32',
    name: 'ESP32 Dev Board',
    slug: 'esp32-dev-board',
    category: 'electronics',
    subcategory: 'modules',
    price: 349,
    emoji: '📡',
    badge: 'HOT',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80&auto=format&fit=crop',
    shortDesc: 'Dual-core WiFi + Bluetooth powerhouse. The go-to chip for IoT projects.',
    specs: ['Xtensa LX6 dual-core', 'Wi-Fi 802.11 b/g/n', 'Bluetooth 4.2', '38 GPIO pins'],
    inStock: true,
    featured: true,
  },
  {
    id: 'e-esp8266',
    name: 'ESP8266 NodeMCU',
    slug: 'esp8266-nodemcu',
    category: 'electronics',
    subcategory: 'modules',
    price: 199,
    emoji: '📶',
    image: 'https://images.unsplash.com/photo-1553406926-ba6e4e9ce89e?w=600&q=80&auto=format&fit=crop',
    shortDesc: 'The WiFi module that changed everything. Budget IoT with built-in USB.',
    specs: ['ESP8266EX', 'Wi-Fi 802.11 b/g/n', '11 GPIO', 'Micro USB'],
    inStock: true,
  },
  {
    id: 'e-rpi4',
    name: 'Raspberry Pi 4B (4GB)',
    slug: 'raspberry-pi-4b-4gb',
    category: 'electronics',
    subcategory: 'arduino',
    price: 6499,
    emoji: '🍓',
    badge: 'NEW',
    image: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=600&q=80&auto=format&fit=crop',
    shortDesc: 'Full Linux SBC with 4GB RAM. Powers robots, AI projects and media centres.',
    specs: ['Cortex-A72 quad-core', '4GB LPDDR4', 'Gigabit Ethernet', 'USB 3.0 × 2'],
    inStock: true,
    featured: true,
  },
  {
    id: 'e-ultrasonic',
    name: 'HC-SR04 Ultrasonic Sensor',
    slug: 'hc-sr04',
    category: 'electronics',
    subcategory: 'sensors',
    price: 89,
    emoji: '📏',
    image: 'https://images.unsplash.com/photo-1581092160607-ee67df0c4a6b?w=600&q=80&auto=format&fit=crop',
    shortDesc: 'Accurate distance sensing from 2cm to 400cm. Robotics staple.',
    specs: ['Range: 2–400 cm', '±3mm accuracy', '5V supply', 'TTL output'],
    inStock: true,
  },
  {
    id: 'e-servo',
    name: 'SG90 Micro Servo',
    slug: 'sg90-servo',
    category: 'electronics',
    subcategory: 'motors',
    price: 79,
    emoji: '⚙️',
    image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&q=80&auto=format&fit=crop',
    shortDesc: 'Lightweight 9g servo for small robotic arms, pan-tilt mounts and RC projects.',
    specs: ['Torque: 1.8 kg·cm', 'Speed: 0.1s/60°', '4.8–6V', '180° rotation'],
    inStock: true,
  },

  // ── DRONES ────────────────────────────────────────────────────────────────
  {
    id: 'd-fpv5',
    name: '5" FPV Racing Drone',
    slug: '5-fpv-racing-drone',
    category: 'drones',
    subcategory: 'complete',
    price: 18999,
    emoji: '🚀',
    badge: 'HOT',
    image: 'https://images.unsplash.com/photo-1527977966861-8dfc86d96f3f?w=600&q=80&auto=format&fit=crop',
    shortDesc: 'Ready-to-fly 5" FPV racer built and tuned in-house. Plug in a battery and fly.',
    specs: ['5" props', 'F4 flight controller', '2207 motors', 'HD VTX'],
    inStock: true,
    featured: true,
  },
  {
    id: 'd-frame-5',
    name: '5" Freestyle Frame',
    slug: '5-freestyle-frame',
    category: 'drones',
    subcategory: 'frames',
    price: 2499,
    emoji: '🔩',
    image: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=600&q=80&auto=format&fit=crop',
    shortDesc: 'True X carbon fibre frame. Rigid, light and built to survive crashes.',
    specs: ['3K carbon fibre', 'True X 215mm', '4mm arms', '30×30 stack mount'],
    inStock: true,
    featured: true,
  },
  {
    id: 'd-f7',
    name: 'F7 Flight Controller',
    slug: 'f7-flight-controller',
    category: 'drones',
    subcategory: 'flight-controllers',
    price: 3499,
    emoji: '🎛️',
    badge: 'NEW',
    image: 'https://images.unsplash.com/photo-1601132359864-b06e71c7c50e?w=600&q=80&auto=format&fit=crop',
    shortDesc: 'Betaflight-ready F7 FC with onboard blackbox and 8 UARTs.',
    specs: ['STM32F7 MCU', '8 UARTs', 'Onboard blackbox', 'ICM-42688 gyro'],
    inStock: true,
  },
  {
    id: 'd-2207',
    name: '2207 2450KV Brushless Motor',
    slug: '2207-2450kv-motor',
    category: 'drones',
    subcategory: 'motors',
    price: 1299,
    emoji: '⚡',
    image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=600&q=80&auto=format&fit=crop',
    shortDesc: 'High-torque stator for punchy 5" builds. 4–6S compatible.',
    specs: ['2207 stator', '2450KV', '4–6S LiPo', 'Max thrust: 1400g'],
    inStock: true,
  },
  {
    id: 'd-4in1-esc',
    name: '45A 4-in-1 ESC',
    slug: '45a-4in1-esc',
    category: 'drones',
    subcategory: 'escs',
    price: 3999,
    emoji: '🔌',
    image: 'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=600&q=80&auto=format&fit=crop',
    shortDesc: 'BLHeli_32 4-in-1 ESC stack. 45A per channel, 30×30mm mount.',
    specs: ['45A continuous', 'BLHeli_32', '3–6S', '30×30mm'],
    inStock: true,
  },

  // ── 3D PRINTING SERVICES ──────────────────────────────────────────────────
  {
    id: 'p-pla',
    name: 'PLA Printing Service',
    slug: 'pla-printing',
    category: '3d-printing',
    subcategory: 'fdm',
    price: 999,
    emoji: '🟡',
    badge: 'HOT',
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80&auto=format&fit=crop',
    shortDesc: 'Most popular material. Great for prototypes, enclosures and visual models.',
    specs: ['Layer resolution: 0.1–0.3mm', '40+ colours', '48hr turnaround', 'Max size: 250×250×250mm'],
    inStock: true,
    featured: true,
  },
  {
    id: 'p-petg',
    name: 'PETG Printing Service',
    slug: 'petg-printing',
    category: '3d-printing',
    subcategory: 'fdm',
    price: 1199,
    emoji: '🔵',
    image: 'https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?w=600&q=80&auto=format&fit=crop',
    shortDesc: 'Tough, slightly flexible and moisture resistant. Ideal for functional parts.',
    specs: ['High impact resistance', 'Food safe options', '48hr turnaround', 'Max size: 250×250×250mm'],
    inStock: true,
  },
  {
    id: 'p-tpu',
    name: 'TPU Flexible Printing',
    slug: 'tpu-printing',
    category: '3d-printing',
    subcategory: 'fdm',
    price: 1399,
    emoji: '🟠',
    image: 'https://images.unsplash.com/photo-1565034946487-077786996e27?w=600&q=80&auto=format&fit=crop',
    shortDesc: 'Rubber-like flexible material. Perfect for drone canopies, gaskets and grips.',
    specs: ['Shore 95A hardness', 'High elasticity', '72hr turnaround', 'Max size: 200×200×200mm'],
    inStock: true,
    featured: true,
  },
  {
    id: 'p-nylon',
    name: 'Nylon Printing Service',
    slug: 'nylon-printing',
    category: '3d-printing',
    subcategory: 'fdm',
    price: 1599,
    emoji: '⚪',
    badge: 'NEW',
    image: 'https://images.unsplash.com/photo-1609695001873-99e78e2f38cc?w=600&q=80&auto=format&fit=crop',
    shortDesc: 'Engineering-grade nylon for mechanical parts requiring strength and heat resistance.',
    specs: ['PA12 nylon', 'High heat resistance', '72hr turnaround', 'Max size: 250×250×250mm'],
    inStock: true,
  },

  // ── PROTOTYPING SERVICES ──────────────────────────────────────────────────
  {
    id: 'proto-pcb',
    name: 'PCB Design & Manufacturing',
    slug: 'pcb-design',
    category: 'prototyping',
    subcategory: 'pcb',
    price: 0,
    emoji: '🟢',
    badge: 'NEW',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80&auto=format&fit=crop',
    shortDesc: 'From schematic to board — we design, fabricate and assemble your PCB.',
    specs: ['2–8 layer boards', 'SMD & through-hole', 'DFM review included', '7–14 day delivery'],
    inStock: true,
    featured: true,
  },
  {
    id: 'proto-cnc',
    name: 'CNC Machining Service',
    slug: 'cnc-machining',
    category: 'prototyping',
    subcategory: 'cnc',
    price: 0,
    emoji: '🔨',
    image: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=600&q=80&auto=format&fit=crop',
    shortDesc: 'Precision CNC milling in aluminium, steel, acrylic and wood. ±0.1mm tolerance.',
    specs: ['Al, steel, acrylic, wood', '±0.1mm tolerance', 'STL/STEP/DXF accepted', '5–10 day delivery'],
    inStock: true,
  },

  // ── PRINTER SUPPLIES ──────────────────────────────────────────────────────
  {
    id: 'sup-pla-1kg',
    name: 'PLA Filament 1kg',
    slug: 'pla-filament-1kg',
    category: 'printers-supplies',
    subcategory: 'filaments',
    price: 0,
    emoji: '🧵',
    image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=600&q=80&auto=format&fit=crop',
    shortDesc: 'Premium PLA in 30+ colours. Consistent diameter, tangle-free spool.',
    specs: ['1.75mm diameter', '±0.02mm tolerance', '1kg net weight', '30+ colours'],
    inStock: true,
    featured: true,
  },
  {
    id: 'sup-petg-1kg',
    name: 'PETG Filament 1kg',
    slug: 'petg-filament-1kg',
    category: 'printers-supplies',
    subcategory: 'filaments',
    price: 0,
    emoji: '🔵',
    image: 'https://images.unsplash.com/photo-1605647540924-852290f6b0d5?w=600&q=80&auto=format&fit=crop',
    shortDesc: 'Tough PETG for functional parts. Clear, black, white and more.',
    specs: ['1.75mm diameter', '±0.02mm tolerance', '1kg net weight', '10+ colours'],
    inStock: true,
  },
]

export function getProductsByCategory(categorySlug: string): Product[] {
  return PRODUCTS.filter(p => p.category === categorySlug)
}

export function getProductsBySubcategory(categorySlug: string, subcategorySlug: string): Product[] {
  return PRODUCTS.filter(p => p.category === categorySlug && p.subcategory === subcategorySlug)
}

export function getFeaturedProducts(): Product[] {
  return PRODUCTS.filter(p => p.featured && p.inStock)
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return CATEGORIES.find(c => c.slug === slug)
}

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find(p => p.slug === slug)
}
