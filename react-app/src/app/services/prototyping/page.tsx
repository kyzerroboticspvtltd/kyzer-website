import type { Metadata } from 'next'
import { ServicePageLayout } from '@/components/services/ServicePageLayout'

export const metadata: Metadata = {
  title: 'Rapid Prototyping Services Pune | 48-Hour Prototype — Kyzer Robotics',
  description: 'Rapid prototyping in Pune — 48-hour turnaround from CAD to physical prototype. 3D printing, CNC, laser cutting, and product development sprints for startups and engineers.',
  keywords: ['rapid prototyping Pune', 'prototype manufacturing India', '48 hour prototype', 'product development Pune', 'prototype service India'],
}

export default function Page() {
  return (
    <ServicePageLayout
      badge="// RAPID PROTOTYPING — PUNE, INDIA"
      headline="48-HOUR"
      accentWord="PROTOTYPING"
      subheadline="From idea or CAD file to physical prototype in 48 hours. We handle the full loop — design, print, machine, assemble, and deliver. Built for startups and engineers who move fast."
      tagline="Free design consultation · 3 revisions included · Pune pickup or nationwide shipping"
      heroEmoji="💡"
      accent="#9b59b6"
      stats={[
        { value: '48hr', label: 'Guaranteed turnaround' },
        { value: '3', label: 'Revisions included' },
        { value: '100+', label: 'Prototypes built' },
        { value: '5', label: 'Manufacturing methods' },
      ]}
      features={[
        { icon: '🖨️', title: 'FDM 3D Printing', desc: 'PLA, PETG, ABS, Nylon, TPU, CF-PLA. Fast, affordable functional prototypes with good dimensional accuracy. Best for form-fit-function validation.' },
        { icon: '⚙️', title: 'CNC Machining', desc: 'Aluminium, steel, and engineering plastics machined to ±0.1mm tolerance. For parts requiring metal properties or precision holes and threads.' },
        { icon: '✂️', title: 'Laser Cutting', desc: 'Acrylic, wood, MDF, and thin aluminium laser-cut to your DXF. Enclosures, panels, gaskets, and structural parts cut in hours.' },
        { icon: '🔌', title: 'Electronics Integration', desc: 'PCB prototyping, wiring, and firmware for hardware products. We bring your electronics prototype to life alongside the mechanical housing.' },
        { icon: '📋', title: 'Design Sprints', desc: 'Our signature 3-day sprint — requirements on day 1, build on day 2, iterate on day 3. Perfect for investor demos, user testing, and hackathons.' },
        { icon: '📄', title: 'Documentation', desc: 'Build report, BOM, and manufacture-ready files delivered with every prototype. Ready to hand to a contract manufacturer for production.' },
      ]}
      process={[
        { step: 'STEP 01', title: 'Brief us', desc: 'Share your CAD, sketch, reference images, or just describe what you need. We help you spec materials, tolerances, and timeline.' },
        { step: 'STEP 02', title: 'We quote', desc: 'Detailed quote with breakdown by manufacturing method, material, and post-processing. Usually back to you within 2 hours.' },
        { step: 'STEP 03', title: 'Production', desc: 'Manufacture starts on confirmation. You get WhatsApp progress updates. Design changes mid-build are possible for an additional charge.' },
        { step: 'STEP 04', title: 'Delivery', desc: 'Parts inspected, packed, and dispatched. For Pune customers, same-day pickup from our workshop. Shipped nationally with tracking.' },
      ]}
      faqs={[
        { q: 'Can you really deliver in 48 hours?', a: 'Yes — for most standard 3D print prototypes under 250×250×250mm. CNC and laser-cut parts may take slightly longer depending on complexity. We always confirm the timeline before accepting the job.' },
        { q: 'What if I only have a sketch?', a: 'That is fine. Our design team can create a 3D model from your sketch, reference images, or verbal description. Basic CAD modelling is included for simple shapes. Complex designs are quoted separately.' },
        { q: 'What is the difference between a prototype and a final product?', a: 'Prototypes are built for validation — form, fit, and function — not for mass production. Materials and processes are optimised for speed and cost, not for high-volume manufacturing. We can help you transition to production once your design is validated.' },
        { q: 'Do you sign NDAs?', a: 'Yes. We are happy to sign a mutual NDA before discussing your project. Client confidentiality is taken seriously — your files and designs are never shared.' },
        { q: 'What is a product development sprint?', a: 'A structured 3-day engagement where we go from requirements to a functional prototype. Day 1: requirements and CAD. Day 2: manufacturing. Day 3: assembly, test, and iteration. Delivered with full documentation.' },
      ]}
      cta={{ primary: 'Start a Prototype →', primaryHref: '/get-a-quote', secondary: 'See Portfolio', secondaryHref: '/portfolio' }}
      relatedLinks={[
        { label: '3D Printing', href: '/services/3d-printing' },
        { label: 'PCB Design', href: '/services/pcb-design' },
        { label: 'Industrial Automation', href: '/services/industrial-automation' },
      ]}
    />
  )
}
