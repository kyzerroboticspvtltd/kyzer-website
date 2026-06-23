import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Blog | Kyzer Robotics — Drones, 3D Printing, Robotics Insights',
  description: 'Engineering articles, guides, and project deep-dives from the Kyzer Robotics team in Pune. FPV builds, 3D printing tips, robotics tutorials, and more.',
}

const POSTS = [
  {
    slug: 'best-fpv-flight-controllers-2025',
    title: 'The Best FPV Flight Controllers in 2025: Compared',
    date: '2025-11-15',
    category: 'FPV Drones',
    readTime: '8 min',
    emoji: '🏁',
    excerpt: 'F4 vs F7 vs H7: which flight controller stack should you pick for your 5" FPV build in 2025? We break down the top options by price, features, and compatibility with Betaflight 4.5.',
  },
  {
    slug: '3d-printing-materials-comparison',
    title: 'PLA vs PETG vs ABS vs Nylon: Which 3D Print Material for Your Project?',
    date: '2025-10-22',
    category: '3D Printing',
    readTime: '10 min',
    emoji: '🖨️',
    excerpt: 'Choosing the wrong filament can ruin a functional part. We compare the 4 most common FDM materials on strength, temperature resistance, ease of printing, and cost, with real-world examples.',
  },
  {
    slug: 'agricultural-drone-india-guide',
    title: 'Agricultural Drones in India: A Complete Guide for Farmers (2025)',
    date: '2025-09-30',
    category: 'Agriculture',
    readTime: '12 min',
    emoji: '🌾',
    excerpt: 'How much does an agricultural drone cost in India? What are the DGCA rules? Which spray system is right for your crop? Everything you need to know before buying or building an agri drone.',
  },
  {
    slug: 'kicad-pcb-design-beginners',
    title: "PCB Design in KiCad: A Practical Beginner's Guide",
    date: '2025-09-01',
    category: 'Electronics',
    readTime: '15 min',
    emoji: '🔌',
    excerpt: 'From schematic to Gerber in KiCad 7. We cover component placement, trace routing, design rule checks, and generating manufacturing files — step by step with screenshots.',
  },
  {
    slug: 'ros2-raspberry-pi-robot',
    title: 'Build a ROS2 Robot on Raspberry Pi 5: From Zero to Autonomous Navigation',
    date: '2025-08-10',
    category: 'Robotics',
    readTime: '20 min',
    emoji: '🤖',
    excerpt: 'Complete guide to building a differential drive robot with ROS2 Humble on a Raspberry Pi 5. We cover hardware setup, motor drivers, lidar SLAM, and the Nav2 navigation stack.',
  },
  {
    slug: 'industrial-automation-msme-india',
    title: 'Industrial Automation for Indian MSMEs: Is It Worth It?',
    date: '2025-07-18',
    category: 'Automation',
    readTime: '7 min',
    emoji: '⚙️',
    excerpt: 'Can a small Indian factory afford automation? We break down real numbers — investment, payback period, and productivity gains — for common MSME automation scenarios in 2025.',
  },
]

export default function BlogPage() {
  return (
    <main style={{ minHeight: '100vh', background: '#f8f8f6', color: '#111', paddingTop: '100px', fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '60px 20px 100px' }}>

        <p style={{ color: '#FF8C35', fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.15em', marginBottom: 16 }}>
          // KYZER ROBOTICS BLOG
        </p>
        <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(2.5rem,6vw,4rem)', fontWeight: 400, letterSpacing: '0.04em', marginBottom: 16, lineHeight: 1, color: '#111' }}>
          ENGINEERING INSIGHTS
        </h1>
        <p style={{ color: '#888', maxWidth: 500, lineHeight: 1.8, marginBottom: 52, fontSize: 15 }}>
          Guides, builds, and technical deep-dives from our team in Pune. No fluff — real engineering content.
        </p>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 48 }}>
          {['All', 'FPV Drones', '3D Printing', 'Robotics', 'Electronics', 'Automation', 'Agriculture'].map(cat => (
            <span key={cat} style={{
              padding: '6px 16px', borderRadius: 20, fontSize: 12, fontWeight: 500,
              background: cat === 'All' ? '#FF8C35' : 'transparent',
              color: cat === 'All' ? '#fff' : '#888',
              border: '1px solid',
              borderColor: cat === 'All' ? '#FF8C35' : '#ddd',
              cursor: 'default',
            }}>{cat}</span>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
          {POSTS.map((post, i) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} style={{ textDecoration: 'none' }}>
              <article style={{
                background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 14,
                padding: '28px', height: '100%', display: 'flex', flexDirection: 'column',
                boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
              }}>
                {i === 0 && (
                  <span style={{ fontSize: 10, background: '#FF8C35', color: '#fff', padding: '3px 10px', borderRadius: 4, fontWeight: 700, letterSpacing: '0.1em', marginBottom: 16, display: 'inline-block', width: 'fit-content', fontFamily: "'JetBrains Mono', monospace" }}>
                    LATEST
                  </span>
                )}
                <div style={{ fontSize: 32, marginBottom: 16 }}>{post.emoji}</div>
                <div style={{ display: 'flex', gap: 8, marginBottom: 14, alignItems: 'center', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 11, color: '#FF8C35', fontWeight: 600, fontFamily: "'JetBrains Mono', monospace" }}>{post.category}</span>
                  <span style={{ color: '#ccc' }}>·</span>
                  <span style={{ fontSize: 11, color: '#aaa' }}>{post.readTime} read</span>
                  <span style={{ color: '#ccc' }}>·</span>
                  <span style={{ fontSize: 11, color: '#aaa' }}>{new Date(post.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                </div>
                <h2 style={{ fontSize: 16, fontWeight: 600, color: '#111', lineHeight: 1.45, marginBottom: 10, flex: 1 }}>{post.title}</h2>
                <p style={{ fontSize: 13, color: '#888', lineHeight: 1.75, marginBottom: 20 }}>{post.excerpt}</p>
                <span style={{ fontSize: 13, color: '#FF8C35', fontWeight: 600 }}>Read article →</span>
              </article>
            </Link>
          ))}
        </div>

        <div style={{ marginTop: 72, padding: '40px', background: '#fff', borderRadius: 14, border: '1px solid rgba(0,0,0,0.08)', textAlign: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
          <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, letterSpacing: '0.06em', color: '#111', marginBottom: 8 }}>SUGGEST A TOPIC</p>
          <p style={{ color: '#888', marginBottom: 20, fontSize: 14 }}>Want us to write about something specific? Drop us a message.</p>
          <a href="mailto:info@kyzerrobotics.com?subject=Blog%20topic%20suggestion" style={{
            display: 'inline-block', padding: '12px 28px', background: '#FF8C35',
            color: '#fff', borderRadius: 8, fontWeight: 700, textDecoration: 'none', fontSize: 14,
          }}>Send suggestion</a>
        </div>
      </div>
    </main>
  )
}
