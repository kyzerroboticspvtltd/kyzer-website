import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getBlogPostBySlug } from '@/lib/blogPosts'

export const dynamic = 'force-dynamic'

const STATIC_POSTS: Record<string, {
  title: string
  category: string
  date: string
  readTime: string
  emoji: string
  excerpt: string
  content: { heading?: string; body: string }[]
}> = {
  'best-fpv-flight-controllers-2025': {
    title: 'The Best FPV Flight Controllers in 2025: Compared',
    category: 'FPV Drones',
    date: '2025-11-15',
    readTime: '8 min',
    emoji: '🏁',
    excerpt: 'F4 vs F7 vs H7: which flight controller stack should you pick for your 5" FPV build in 2025?',
    content: [
      { body: 'Choosing a flight controller is the most important decision you make when building an FPV drone. The wrong pick means hours of debugging, compatibility nightmares, and potentially a fried ESC. Here\'s what you actually need to know in 2025.' },
      { heading: 'F4 - Still Worth It?', body: 'F4 processors run Betaflight at up to 8kHz looptime with plenty of UART ports for the essentials: VTX, GPS, ELRS receiver. They are cheap (₹800–₹1,500 for a solid board) and the community support is excellent. If you\'re on a budget and flying 5" freestyle, an F4 like the Matek F405-CTR is still a smart choice in 2025. The only real limitation is that F4 boards can\'t run Betaflight RPM filtering at full 8kHz without CPU overhead; dropping to 4kHz looptime is recommended.' },
      { heading: 'F7 - The Sweet Spot', body: 'F7 flight controllers are the mainstream choice for serious builds in 2025. They handle 8kHz looptime with RPM filtering enabled without breaking a sweat, have dual gyros on many boards (useful for filtering), and typically come with 6–8 UARTs. The SpeedyBee F7 V3 and Matek F722-SE are excellent value in the ₹1,800–₹2,800 range. If you\'re building a long-range or cinematic quad, F7 is where you want to be.' },
      { heading: 'H7 - Do You Actually Need It?', body: 'H7 processors are ARM Cortex-M7 and run at 480MHz, nearly double the F7\'s 216MHz. This headroom is useful for 4K blackbox logging at high rates, running Betaflight\'s more experimental filtering modes, or if you plan to run custom firmware forks. For most pilots: no, you don\'t need H7. The performance difference is not noticeable in flight. H7 boards also cost ₹3,500+ and run hotter. Unless you\'re a competitive racer or doing serious R&D, F7 is the better value.' },
      { heading: 'Our Recommendation by Build Type', body: '**Budget 5" freestyle (under ₹8,000 total build):** F4 with a good 4-in-1 ESC stack.\n\n**Mid-range 5" freestyle / cinematic:** F7 - SpeedyBee F7 V3 or Matek F722.\n\n**Long-range GPS cruiser:** F7 with dedicated GPS UART and barometer.\n\n**Competition racing / R&D:** H7 only if you need the headroom.\n\n**Micro / toothpick builds:** F4 AIO boards - weight matters more than processing power.' },
      { heading: 'What to Look for Beyond the Processor', body: 'The processor letter is just the start. Check: number of UARTs (you need at least 4 for VTX + receiver + GPS + ESC telemetry), motor pad layout, ESC connection type (stack vs. AIO), BlackBox storage (onboard flash vs. SD card), and whether it has a built-in barometer if you want altitude hold. Gyro brand matters too: BMI270 is currently the best option, offering lower noise than the older MPU6000.' },
    ],
  },
  '3d-printing-materials-comparison': {
    title: 'PLA vs PETG vs ABS vs Nylon: Which 3D Print Material for Your Project?',
    category: '3D Printing',
    date: '2025-10-22',
    readTime: '10 min',
    emoji: '🖨️',
    excerpt: 'Choosing the wrong filament can ruin a functional part. We compare the 4 most common FDM materials on strength, temperature resistance, and cost.',
    content: [
      { body: 'Walk into any 3D printing shop in Pune and you\'ll see spools of PLA, PETG, ABS, and Nylon lined up on the wall. Each has a distinct personality. Pick the wrong one for your application and you\'ll end up with a part that warps, snaps, or melts. Here\'s a no-nonsense breakdown.' },
      { heading: 'PLA - The Default Choice', body: 'PLA (Polylactic Acid) is plant-based, easy to print, produces minimal warping, and gives excellent surface finish. It\'s the right choice for: prototypes, display models, non-structural brackets, educational parts, and anything that won\'t see temperatures above 60°C. At Kyzer, roughly 60% of our customer prints are PLA. Cost: ₹800–₹1,200/kg for quality filament. Weakness: heat resistance is poor. Leave a PLA part on a car dashboard in Pune summer and it will deform.' },
      { heading: 'PETG - The Practical Workhorse', body: 'PETG combines the ease of PLA with significantly better mechanical properties. It\'s tougher, more flexible, and handles temperatures up to ~80°C. It\'s our go-to for functional drone components like motor mounts, camera cages, and battery straps. PETG also has good layer adhesion and is nearly as easy to print as PLA. The catch: it\'s stringy, so expect more post-processing. Cost: ₹1,000–₹1,500/kg. If you need one upgrade from PLA, it\'s PETG.' },
      { heading: 'ABS - Tough but Difficult', body: 'ABS (Acrylonitrile Butadiene Styrene) is strong, impact resistant, and handles up to ~100°C. It\'s what LEGO bricks are made from. But printing ABS requires an enclosure, a heated chamber if possible, and good bed adhesion (ABS juice or PEI sheet). It warps aggressively in open-air printers. At our shop, we use ABS for automotive components, housing parts, and anything needing post-processing acetone smoothing. Cost: ₹900–₹1,400/kg. Not recommended for hobbyists without enclosures.' },
      { heading: 'Nylon - The Engineering Grade', body: 'Nylon (PA6 or PA12) is the material of choice for structural mechanical parts: gears, hinges, living hinges, wear-resistant components. It\'s tough, slightly flexible, and handles ~120°C. The downsides: it\'s hygroscopic (absorbs moisture from the air and must be kept dry-stored), requires 240–260°C nozzle temperatures, and is unforgiving to print. Nylon is our recommended material for drone arm reinforcements, motor mounts on high-power builds, and load-bearing structural parts. Cost: ₹1,500–₹2,500/kg.' },
      { heading: 'Quick Decision Guide', body: '**Prototype / visual model:** PLA\n\n**Functional bracket / enclosure:** PETG\n\n**Impact-resistant housing:** ABS (with enclosure)\n\n**Mechanical part / gear / hinge:** Nylon\n\n**Outdoor / UV-resistant:** ASA (a step up from ABS, worth considering)\n\n**Flexible / gasket:** TPU\n\nStill unsure? Email us at info@kyzerrobotics.com with your application and we\'ll recommend the right material for your part.' },
    ],
  },
  'agricultural-drone-india-guide': {
    title: 'Agricultural Drones in India: A Complete Guide for Farmers (2025)',
    category: 'Agriculture',
    date: '2025-09-30',
    readTime: '12 min',
    emoji: '🌾',
    excerpt: 'How much does an agricultural drone cost in India? What are the DGCA rules? Everything you need to know before buying or building an agri drone.',
    content: [
      { body: 'Agricultural drones have gone from novelty to necessity across Indian farming. But the market is noisy: overpriced imports, poor after-sales support, and confusing regulations put off many farmers. This guide cuts through the noise.' },
      { heading: 'What Can an Agri Drone Actually Do?', body: 'The primary use case is spraying: pesticides, fertilisers, and liquid micronutrients. A good agri drone can cover 8–15 acres per hour vs. 1–2 acres/hour for manual spraying, with 30–40% chemical savings through precision application. Secondary uses: crop health mapping (NDVI analysis with multispectral cameras), seeding (for paddy and wheat), and scouting for pest damage.' },
      { heading: 'DGCA Rules in 2025: What You Must Know', body: 'Under the Drone Rules 2021, agricultural drones fall under the Medium category (25–150 kg MTOW for most spray drones). Key requirements: UIN (Unique Identification Number) registration on the Digital Sky platform, Remote Pilot Certificate (RPC) from a DGCA-approved training organisation, and operation only within visual line of sight (VLOS). No-fly zones near airports and state boundaries apply. The good news: agricultural drone operations under 400 ft AGL in rural areas are relatively straightforward to get approved.' },
      { heading: 'How Much Does an Agri Drone Cost in India?', body: 'Entry-level 10L spray drones: ₹3.5–₹5 lakh (Chinese imports, limited support)\n\nMid-range domestic builds: ₹6–₹9 lakh (Indian-assembled, better support)\n\nPremium (DJI Agras T40 equivalent): ₹15–₹25 lakh\n\nCustom Kyzer builds: ₹7–₹12 lakh depending on tank size, frame, and sensors\n\nRemember to factor in: pilot training (₹25,000–₹50,000 for RPC), insurance, maintenance kit, and battery replacement cycles (~500 charge cycles per battery).' },
      { heading: 'Hexacopter vs Octocopter: Which Frame?', body: 'Most agri drones use hexacopter (6-motor) frames for a balance of lifting capacity and motor redundancy. If one motor fails, a hexacopter can often land safely. Octocopters (8-motor) give higher payload capacity (ideal for 20L+ tanks) and better redundancy but cost more to maintain. For most Indian farmers with fields under 50 acres, a 10L hexacopter with a 30-35 minute battery life is the sweet spot.' },
      { heading: 'Should You Buy or Build?', body: 'Buy if: you want plug-and-play, have budget for DJI or a domestic OEM, and your primary need is spraying with minimal technical involvement.\n\nBuild/custom if: you need specific payload configurations, NDVI or multispectral cameras integrated, or you want full control over maintenance and parts sourcing. Custom builds also make economic sense for FPOs (Farmer Producer Organisations) operating fleets.\n\nKyzer offers custom agri drone builds starting at ₹7 lakh. Email info@kyzerrobotics.com for a quote based on your acreage and crop type.' },
    ],
  },
  'kicad-pcb-design-beginners': {
    title: "PCB Design in KiCad: A Practical Beginner's Guide",
    category: 'Electronics',
    date: '2025-09-01',
    readTime: '15 min',
    emoji: '🔌',
    excerpt: 'From schematic to Gerber in KiCad 7. Component placement, trace routing, design rule checks, and generating manufacturing files, step by step.',
    content: [
      { body: 'KiCad is the best free PCB design tool available and it\'s what we use at Kyzer for all our PCB work, from simple breakout boards to 4-layer motor driver PCBs. This guide takes you from blank project to manufactured board.' },
      { heading: 'Step 1: Setting Up Your Project', body: 'Download KiCad 7+ from kicad.org. Create a new project: this generates a .kicad_pro file that links your schematic (.kicad_sch) and board layout (.kicad_pcb) files. Before you start, configure your design rules: go to File → Board Setup → Constraints and set minimum track width (0.2mm for standard JLCPCB specs), minimum clearance (0.2mm), and via diameter (0.6mm drill, 1.2mm pad for standard).' },
      { heading: 'Step 2: Drawing Your Schematic', body: 'Open the Schematic Editor. Press A to add symbols. KiCad has an enormous built-in library. For custom ICs not in the library, install community libraries from kicad.github.io/kicad-packages3D or create your own symbol (it takes about 10 minutes). Connect components with wires (W key) and add power symbols (PWR_FLAG on VCC and GND nets). Label your nets clearly: good net names save hours during layout. Run ERC (Tools → Electrical Rules Checker) before moving to layout.' },
      { heading: 'Step 3: Assigning Footprints', body: 'Every symbol needs a footprint, the physical copper pads on the board. Open the Footprint Assignment tool (Tools → Assign Footprints). Match each component to its package: a 0603 resistor uses Resistor_SMD:R_0603_1608Metric, a SOT-23 transistor uses Package_TO_SOT_SMD:SOT-23, and so on. For ICs, always cross-check the datasheet footprint dimensions against the KiCad footprint. Errors here are expensive.' },
      { heading: 'Step 4: PCB Layout', body: 'Update the PCB from schematic (Tools → Update PCB). You\'ll see your components in a cluster with ratsnest lines (thin lines showing connections to be made). Place components logically: keep decoupling capacitors within 1–2mm of their IC\'s power pin. Route high-current traces wider (motor drives need 1–2mm tracks for 5A+). Use the DRC (Inspect → Design Rules Checker) constantly. Don\'t wait until the end. Add a ground pour on the back copper layer (Add Filled Zone → GND net) to reduce noise and improve current return paths.' },
      { heading: 'Step 5: Generating Gerbers for JLCPCB', body: 'File → Fabrication Outputs → Gerbers. Settings for JLCPCB: Plot format Gerber, check "Use Protel filename extensions", include copper layers, edge cuts, silkscreen, soldermask, and courtyard. Also generate the Drill Files (NC Drill, Excellon format, separate file for PTH/NPTH). Zip all output files and upload to jlcpcb.com. Standard 2-layer 100×100mm boards cost around ₹250 for 5 pieces with 7-day shipping to India.' },
      { heading: 'Common Beginner Mistakes', body: '1. Forgetting to add mounting holes\n2. No silkscreen reference designators (makes assembly hell)\n3. Copper pour touching SMD pads (causes solder bridging)\n4. Via too close to pad (DRC will catch this)\n5. Wrong footprint for component package - always measure your physical component\n6. No test points on critical nets\n7. Importing Gerbers directly without checking in GerberViewer first' },
    ],
  },
  'ros2-raspberry-pi-robot': {
    title: 'Build a ROS2 Robot on Raspberry Pi 5: From Zero to Autonomous Navigation',
    category: 'Robotics',
    date: '2025-08-10',
    readTime: '20 min',
    emoji: '🤖',
    excerpt: 'Complete guide to building a differential drive robot with ROS2 Humble on Raspberry Pi 5, including lidar SLAM and Nav2 navigation.',
    content: [
      { body: 'ROS2 (Robot Operating System 2) is the standard middleware for robotics. Whether you\'re building a home robot, a research platform, or an industrial AGV, understanding ROS2 is essential. This guide builds a functional autonomous robot from scratch using affordable components available in India.' },
      { heading: 'Hardware You Need', body: 'Raspberry Pi 5 (4GB or 8GB, 8GB recommended for Nav2): ₹7,000–₹8,500\nRP2040-based microcontroller (for low-level motor control): ₹400–₹600\n2× DC geared motors with encoders: ₹800–₹1,200\nMotor driver (L298N or TB6612FNG): ₹150–₹400\nLD19 or RPLidar A1 (for SLAM): ₹5,000–₹8,000\nDifferential drive chassis: ₹600–₹1,200\n3S LiPo battery: ₹1,500–₹2,500\nTotal: approximately ₹15,000–₹22,000' },
      { heading: 'Installing ROS2 Humble on Raspberry Pi 5', body: 'Flash Ubuntu 22.04 Server LTS (arm64) to your Pi 5 SD card using Raspberry Pi Imager. Boot, update: `sudo apt update && sudo apt upgrade`. Then follow the official ROS2 Humble installation (binary install from apt). Add `source /opt/ros/humble/setup.bash` to your ~/.bashrc. Install key packages: `sudo apt install ros-humble-navigation2 ros-humble-slam-toolbox ros-humble-teleop-twist-keyboard`.' },
      { heading: 'Setting Up the Differential Drive', body: 'Your RP2040 (or Arduino) handles encoder reading and PWM motor control. Flash it with micro-ROS to communicate with ROS2 over USB serial. The microcontroller publishes /wheel_odom (encoder ticks) and subscribes to /cmd_vel (velocity commands). On the Pi, run the micro-ROS agent: `ros2 run micro_ros_agent micro_ros_agent serial --dev /dev/ttyACM0`. Verify with `ros2 topic echo /wheel_odom`.' },
      { heading: 'SLAM with slam_toolbox', body: 'Connect your lidar (RPLidar: `sudo apt install ros-humble-rplidar-ros`). Launch slam_toolbox in mapping mode. Drive the robot around your space using teleop_twist_keyboard. As the robot moves, it builds a 2D occupancy grid map. Save the map: `ros2 run nav2_map_server map_saver_cli -f ~/my_map`. You now have a map.pgm and map.yaml: your navigation map.' },
      { heading: 'Autonomous Navigation with Nav2', body: 'With a saved map, switch to localisation mode (AMCL) instead of SLAM. Launch nav2_bringup with your map. Open RViz2, load the nav2 perspective, and use the "2D Nav Goal" tool to click a destination on the map. Nav2\'s planner (NavFn or Smac) generates a global path; the controller (DWB) executes it while avoiding obstacles detected by the lidar in real time. First time it works is genuinely exciting.' },
      { heading: 'Debugging Tips', body: '`ros2 topic hz /scan` - check lidar is publishing at expected rate (10Hz+)\n`ros2 run tf2_tools view_frames` - visualise your TF tree, missing transforms are the #1 Nav2 failure cause\n`ros2 doctor` - general health check\nMake sure your /odom → /base_link and /base_link → /laser_frame TF transforms are correct. Wrong transforms make SLAM useless.\nSet use_sim_time:=false when running on real hardware' },
    ],
  },
  'industrial-automation-msme-india': {
    title: 'Industrial Automation for Indian MSMEs: Is It Worth It?',
    category: 'Automation',
    date: '2025-07-18',
    readTime: '7 min',
    emoji: '⚙️',
    excerpt: 'Can a small Indian factory afford automation? Real numbers on investment, payback period, and productivity gains for common MSME automation scenarios.',
    content: [
      { body: 'Automation is no longer just for large manufacturers. Indian MSMEs, from auto component suppliers to food processing units, are increasingly adopting automation to stay competitive. But the fear of high upfront costs holds many back. Let\'s look at real numbers.' },
      { heading: 'The Real Cost of Not Automating', body: 'Before looking at automation costs, consider the baseline: a manual assembly line worker in Pune costs ₹15,000–₹25,000/month in wages alone, plus PF, ESI, training, and turnover costs. For repetitive, precision tasks like filling, labelling, quality inspection, and pick-and-place, manual labour is also slower and more error-prone. A typical MSME running 2 shifts loses 15–25% output to quality defects and rework in manual processes.' },
      { heading: 'Scenario 1: Conveyor + Sensor QC (₹3–6 lakh)', body: 'Adding a basic conveyor system with proximity sensors and a reject mechanism to an existing production line. This handles go/no-go quality checks for dimensional parts, bottles, or packaged goods. ROI timeline: 8–14 months for lines running 2+ shifts. Maintenance: minimal. Conveyor motors and sensors are commodity parts available in Pune\'s industrial belt.' },
      { heading: 'Scenario 2: Pick-and-Place Robot Arm (₹8–18 lakh)', body: 'A 4-DOF robot arm for repetitive pick-and-place, palletising, or machine tending. Suitable for auto component handling, electronics assembly, and packaging. Replaces 1–2 operators per shift. Payback: 18–30 months depending on labour cost and shift pattern. Important: robot arms require integration engineering (₹1–2 lakh additional) and operator training. Kyzer\'s automation team handles end-to-end integration.' },
      { heading: 'Scenario 3: Computer Vision Quality Inspection (₹5–12 lakh)', body: 'A camera-based inspection system that checks for surface defects, label alignment, fill levels, or dimensional accuracy at line speed. Replaces manual visual inspection which typically catches only 70–80% of defects. Vision systems catch 99%+. For food, pharma, and precision component manufacturers, the ROI is rapid: one batch recall costs far more than the system. Payback: 6–18 months.' },
      { heading: 'Government Schemes to Reduce Upfront Cost', body: 'MSMEs can access capital subsidy through the CLCSS (Credit Linked Capital Subsidy Scheme): 15% subsidy on investment in plant and machinery for technology upgradation, capped at ₹15 lakh. The PLI (Production Linked Incentive) scheme covers certain sectors. Maharashtra\'s Package Scheme of Incentives also offers capital subsidies for manufacturing investments. Always consult with your CA and MSME Development Office before investing. Subsidies can significantly improve your payback period.' },
      { heading: 'Our Advice', body: 'Start small and measurable. Pick one bottleneck process, automate it, measure the output improvement for 3 months, then scale. Don\'t try to automate everything at once. The biggest mistake MSMEs make is over-investing in complex systems before their team is ready to operate and maintain them. Reach out to us at info@kyzerrobotics.com and we\'ll do a free process assessment and tell you honestly what\'s worth automating and what isn\'t.' },
    ],
  },
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug, STATIC_POSTS)
  if (!post) return {}
  return {
    title: `${post.title} | Kyzer Robotics Blog`,
    description: post.excerpt,
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug, STATIC_POSTS)
  if (!post) notFound()

  const dateStr = new Date(post.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <main style={{ minHeight: '100vh', background: '#f8f8f6', color: '#111', paddingTop: '100px', fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '48px 20px 100px' }}>

        {/* Back */}
        <Link href="/blog" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#aaa', fontSize: 13, textDecoration: 'none', marginBottom: 40 }}>
          ← Back to Blog
        </Link>

        {/* Meta */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 20, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 11, color: '#FF8C35', fontWeight: 600, fontFamily: "'JetBrains Mono', monospace" }}>{post.category}</span>
          <span style={{ color: '#ccc' }}>·</span>
          <span style={{ fontSize: 11, color: '#aaa' }}>{post.readTime} read</span>
          <span style={{ color: '#ccc' }}>·</span>
          <span style={{ fontSize: 11, color: '#aaa' }}>{dateStr}</span>
        </div>

        {/* Title */}
        <div style={{ fontSize: 40, marginBottom: 20 }}>{post.emoji}</div>
        <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(2rem,5vw,3rem)', fontWeight: 400, letterSpacing: '0.03em', lineHeight: 1.1, marginBottom: 24, color: '#111' }}>
          {post.title}
        </h1>
        <p style={{ fontSize: 16, color: '#888', lineHeight: 1.8, marginBottom: 48, borderBottom: '1px solid rgba(0,0,0,0.08)', paddingBottom: 40 }}>
          {post.excerpt}
        </p>

        {/* Content */}
        <div>
          {(post.content || []).map((block, i) => (
            <div key={i} style={{ marginBottom: 36 }}>
              {block.heading && (
                <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, fontWeight: 400, letterSpacing: '0.06em', color: '#FF8C35', marginBottom: 12 }}>
                  {block.heading}
                </h2>
              )}
              <p style={{ fontSize: 15, color: '#555', lineHeight: 1.9, whiteSpace: 'pre-line' }}>
                {block.body}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ marginTop: 64, background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 14, padding: '36px', textAlign: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
          <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, letterSpacing: '0.06em', color: '#111', marginBottom: 8 }}>WORK WITH KYZER ROBOTICS</p>
          <p style={{ color: '#888', fontSize: 14, marginBottom: 20 }}>Have a project in mind? Let&apos;s talk engineering.</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/consultation" style={{ padding: '11px 24px', background: '#FF8C35', color: '#fff', borderRadius: 8, fontWeight: 700, textDecoration: 'none', fontSize: 14 }}>Get a Quote</a>
            <a href="/blog" style={{ padding: '11px 24px', background: 'transparent', color: '#888', borderRadius: 8, fontWeight: 600, textDecoration: 'none', fontSize: 14, border: '1px solid #ddd' }}>More Articles</a>
          </div>
        </div>

      </div>
    </main>
  )
}
