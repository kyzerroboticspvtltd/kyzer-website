import type { Metadata } from 'next'
import { ServicePageLayout } from '@/components/services/ServicePageLayout'

export const metadata: Metadata = {
  title: 'Custom Drone Development Pune | FPV, Agricultural, Survey UAV — Kyzer Robotics',
  description: 'Custom drone development and manufacturing in Pune — FPV racing drones, agricultural sprayers, survey UAVs, surveillance drones. Full design, assembly, and testing.',
  keywords: ['drone development Pune', 'custom drone manufacturer India', 'FPV drone India', 'agricultural drone Pune', 'UAV development India'],
}

export default function Page() {
  return (
    <ServicePageLayout
      badge="// DRONE DEVELOPMENT — PUNE, INDIA"
      headline="CUSTOM DRONE"
      accentWord="ENGINEERING"
      subheadline="From FPV race drones to agricultural sprayers — fully designed, assembled, and tested UAVs built to your spec in Pune. Flight-ready in as little as 3 weeks."
      tagline="Free 30-min drone consultation · All types · All budgets"
      heroEmoji="🚁"
      accent="#3498db"
      stats={[
        { value: '50+', label: 'Drones Built' },
        { value: '3wks', label: 'Avg. Delivery' },
        { value: '4km', label: 'Max Range Built' },
        { value: '40A', label: 'Max Coverage/hr' },
      ]}
      features={[
        { icon: '🏁', title: 'FPV Racing & Freestyle', desc: 'Custom 5" and 3.5" FPV builds with the latest F7 flight controllers, BLHeli_32 ESCs, and ExpressLRS control. Tuned on our test bench before delivery.' },
        { icon: '🌾', title: 'Agricultural Drones', desc: '10–25 litre spray systems with GPS autonomous row coverage, variable-rate nozzles, and real-time flow monitoring. Custom frame sizing for your crop and terrain.' },
        { icon: '📡', title: 'Survey & Mapping UAVs', desc: '4K gimbal-stabilised survey drones with Mission Planner integration, RTK GPS, and automated grid missions. Deliver orthomosaic maps and 3D point clouds.' },
        { icon: '👁️', title: 'Surveillance & Inspection', desc: 'Long-endurance fixed-wing and hybrid drones with thermal and optical payloads for perimeter patrol, infrastructure inspection, and wildlife monitoring.' },
        { icon: '🔧', title: 'Custom Payloads', desc: 'Sensor mounts, spray systems, delivery mechanisms, lidar integration, and multi-spectral cameras. Any payload, engineered to fly.' },
        { icon: '📚', title: 'After-Build Support', desc: 'PID tuning, pilot training, field support, and repair service. All our drones come with a 3-month warranty on manufacturing defects.' },
      ]}
      process={[
        { step: 'STEP 01', title: 'Requirements call', desc: 'Free 30-minute consultation to understand your application, payload, flight time, range, and budget. We help you spec the right drone.' },
        { step: 'STEP 02', title: 'Design & BOM', desc: 'Frame selection or custom design, component selection, and a full Bill of Materials with pricing. You approve before we order.' },
        { step: 'STEP 03', title: 'Build & Bench test', desc: 'Assembly, soldering, firmware configuration, and bench testing at our Pune workshop. Motor thrust, ESC calibration, and flight controller tuning.' },
        { step: 'STEP 04', title: 'Field test & handover', desc: 'Field flight testing, PID tuning for your payload, and handover with documentation. Training session available on request.' },
      ]}
      faqs={[
        { q: 'Do I need DGCA approval to fly?', a: 'Drones above 250g require DGCA registration under the Digital Sky platform. We help you understand the rules and can assist with documentation. Agricultural drones have specific exemptions in some states.' },
        { q: 'How long does a custom drone build take?', a: 'Simple FPV builds take 1–2 weeks. Agricultural and survey drones typically take 3–4 weeks from spec approval to delivery. Rush builds may be possible — contact us.' },
        { q: 'What is the minimum budget for a custom drone?', a: 'A basic 5" FPV freestyle build starts from ₹18,000. Agricultural sprayers start from ₹1,20,000. Survey UAVs from ₹80,000. We work across all budget points.' },
        { q: 'Do you sell parts separately?', a: 'Yes — frames, flight controllers, motors, ESCs, propellers, batteries, and accessories are all available in our shop. We stock all major brands.' },
        { q: 'Can you repair my existing drone?', a: 'Yes. We repair all makes and models — crash damage, motor replacement, ESC replacement, and firmware issues. WhatsApp us a photo and we\'ll quote the repair.' },
      ]}
      cta={{ primary: 'Book a Free Consultation →', primaryHref: '/consultation', secondary: 'See Drone Portfolio', secondaryHref: '/portfolio' }}
      relatedLinks={[
        { label: '3D Printing', href: '/services/3d-printing' },
        { label: 'PCB Design', href: '/services/pcb-design' },
        { label: 'Robotics Solutions', href: '/services/robotics-solutions' },
      ]}
    />
  )
}
