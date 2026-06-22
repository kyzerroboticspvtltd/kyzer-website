import type { Metadata } from 'next'
import { ServicePageLayout } from '@/components/services/ServicePageLayout'

export const metadata: Metadata = {
  title: '3D Printing Services Pune | FDM, Nylon, CF Printing — Kyzer Robotics',
  description: 'Professional 3D printing services in Pune — PLA, ABS, PETG, TPU, Nylon, Carbon Fibre. 48-hour turnaround. FDM printing for prototypes, functional parts, enclosures.',
  keywords: ['3D printing Pune', '3D printing service Pune', 'FDM printing India', 'Nylon 3D printing', 'rapid prototyping Pune'],
}

export default function Page() {
  return (
    <ServicePageLayout
      badge="// 3D PRINTING SERVICES — PUNE, INDIA"
      headline="PRECISION 3D"
      accentWord="PRINTING"
      subheadline="FDM printing in PLA, PETG, ABS, TPU, Nylon and Carbon Fibre composites. Functional prototypes to production parts — 48-hour turnaround from Pune."
      tagline="Free quote in 2 hours · Files accepted: STL, STEP, OBJ, 3MF"
      heroEmoji="🖨️"
      accent="#FF8C35"
      stats={[
        { value: '48hr', label: 'Turnaround' },
        { value: '6+', label: 'Materials' },
        { value: '250mm', label: 'Max bed size' },
        { value: '0.1mm', label: 'Layer height' },
      ]}
      features={[
        { icon: '🧱', title: 'FDM Printing', desc: 'Fused Deposition Modelling in PLA, PLA+, PETG, ABS, TPU, Nylon PA12, and Carbon Fibre composites. Ideal for functional parts, enclosures, and structural prototypes.' },
        { icon: '⚙️', title: 'Functional Parts', desc: 'High infill (40–80%) parts for load-bearing and mechanical applications. Gears, brackets, fixtures, jigs, and tooling — printed to your exact tolerance requirements.' },
        { icon: '📦', title: 'Enclosures & Housings', desc: 'PCB enclosures, IoT device housings, and custom product casings. Designed for fitment accuracy with integrated boss, boss, snap-fit and heat-set insert support.' },
        { icon: '🚁', title: 'Drone & RC Parts', desc: 'Frames, mounts, camera cages, prop guards and electronics trays in CF-PLA and Nylon. Lightweight, stiff, and built to survive crashes.' },
        { icon: '🏎️', title: 'Student & Motorsport', desc: 'Competition-grade parts for Formula Student, SAE Aero, and robotics teams. Aero surfaces, ducts, brackets — printed fast to meet competition deadlines.' },
        { icon: '🔩', title: 'Post Processing', desc: 'Sanding (up to 800 grit), priming, painting, and heat-set brass inserts. Parts delivered ready to use or ready to assemble.' },
      ]}
      process={[
        { step: 'STEP 01', title: 'Upload your file', desc: 'Send your STL, STEP, OBJ, or 3MF file via WhatsApp, email, or our quote form. Rough sketches or CAD references also accepted.' },
        { step: 'STEP 02', title: 'Get your quote', desc: 'We review your file, choose the right material and print settings, and send a detailed quote with timeline — usually within 2 hours.' },
        { step: 'STEP 03', title: 'Production starts', desc: 'After confirmation and payment, we slice, set up, and start printing. For urgent jobs, same-day production is available.' },
        { step: 'STEP 04', title: 'Delivered to you', desc: 'Parts are inspected, post-processed if required, and shipped with tracking — or available for pickup in Pune.' },
      ]}
      faqs={[
        { q: 'What file formats do you accept?', a: 'STL, STEP (.stp), OBJ, and 3MF. We can also work from DXF for 2D profiles. If you only have a sketch or idea, our design team can model it for you.' },
        { q: 'How long does a 3D print take?', a: 'Most jobs are completed within 48 hours of file approval. Simple small parts can be done same day. Large batches or complex multi-material jobs may take 3–5 days.' },
        { q: 'What is the maximum print size?', a: 'Our standard FDM beds support up to 250×250×250mm. For larger parts, we can split and bond. Contact us for oversized requirements.' },
        { q: 'Which material should I choose?', a: 'PLA/PLA+ for prototypes and display models. PETG for chemical resistance and outdoor use. ABS/ASA for heat resistance. TPU for flexible parts. Nylon for strength. CF-PLA for lightweight rigidity.' },
        { q: 'Do you do post-processing?', a: 'Yes — sanding (up to 800 grit), priming, painting in any RAL/Pantone colour, heat-set brass inserts, and part bonding. Specify at the time of quoting.' },
        { q: 'What is your minimum order?', a: 'No minimum order. We print single prototypes as readily as batch production runs. Bulk orders (10+ units) get a volume discount.' },
      ]}
      cta={{ primary: 'Get a Free Quote →', primaryHref: '/get-a-quote', secondary: 'See 3D Print Portfolio', secondaryHref: '/portfolio' }}
      relatedLinks={[
        { label: 'Rapid Prototyping', href: '/services/prototyping' },
        { label: 'PCB Design', href: '/services/pcb-design' },
        { label: 'Drone Development', href: '/services/drone-development' },
      ]}
    />
  )
}
