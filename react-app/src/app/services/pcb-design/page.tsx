import type { Metadata } from 'next'
import { ServicePageLayout } from '@/components/services/ServicePageLayout'

export const metadata: Metadata = {
  title: 'PCB Design & Manufacturing Pune | Schematic to Assembly — Kyzer Robotics',
  description: 'PCB design and manufacturing service in Pune — KiCad/Altium schematic, layout, JLCPCB manufacturing, SMD assembly. From prototype to production run.',
  keywords: ['PCB design Pune', 'PCB manufacturing India', 'custom PCB Pune', 'electronics design India', 'PCB assembly Pune'],
}

export default function Page() {
  return (
    <ServicePageLayout
      badge="// PCB DESIGN & MANUFACTURING — PUNE"
      headline="CUSTOM PCB"
      accentWord="DESIGN"
      subheadline="End-to-end PCB service — schematic, layout, Gerber generation, manufacturing coordination, and SMD assembly. Prototype to production from our Pune engineering team."
      tagline="Schematic to assembled PCB in 10–15 days · 2-layer to 6-layer"
      heroEmoji="🔌"
      accent="#1abc9c"
      stats={[
        { value: '2–6', label: 'Layer capability' },
        { value: '10d', label: 'Prototype lead time' },
        { value: '0.1mm', label: 'Min track width' },
        { value: 'SMD', label: 'Assembly included' },
      ]}
      features={[
        { icon: '📐', title: 'Schematic Design', desc: 'Full schematic capture in KiCad or Altium. Component selection, power supply design, signal integrity review, and DRC checks.' },
        { icon: '🗂️', title: 'PCB Layout', desc: 'Single to 6-layer layout with design rule checks, impedance control for RF/high-speed, and thermal management. Manufacturing-ready Gerber files.' },
        { icon: '🏭', title: 'Manufacturing', desc: 'We coordinate PCB fabrication at JLCPCB, PCBWay, or local Indian fabs. FR4, Rogers, aluminium substrate — all options managed for you.' },
        { icon: '🔧', title: 'SMD Assembly', desc: 'SMD component procurement and assembly — pick and place, reflow, hand soldering of through-hole. Full assembled and tested boards delivered.' },
        { icon: '🧪', title: 'Testing & Validation', desc: 'Functional test, in-circuit test, and bring-up of assembled boards. Firmware flashing and calibration where required.' },
        { icon: '📦', title: 'Production Scale-up', desc: 'From 1-prototype to 1,000-unit production run. BOM optimisation for cost, AVL management, and production documentation.' },
      ]}
      process={[
        { step: 'STEP 01', title: 'Requirements brief', desc: 'Share your circuit requirements, schematic (if any), form factor, power budget, and production quantity. We scope the project.' },
        { step: 'STEP 02', title: 'Schematic & review', desc: 'We complete the schematic, share for your review, and iterate until approved. Component availability and cost confirmed.' },
        { step: 'STEP 03', title: 'Layout & Gerbers', desc: 'PCB layout completed per your mechanical constraints. Gerbers generated, DRC clean, ready to send to fab.' },
        { step: 'STEP 04', title: 'Fab & assembly', desc: 'PCB ordered, components sourced, assembly completed. Functional test before delivery. Typically 10–15 days total.' },
      ]}
      faqs={[
        { q: 'What PCB tools do you use?', a: 'Primarily KiCad (open-source, all files delivered). We also work in Altium and EasyEDA. All project files handed over on completion.' },
        { q: 'Can you design mixed-signal and RF boards?', a: 'Yes — we have experience with 2.4GHz and 5.8GHz RF layouts, impedance-controlled traces, RF shielding, and ferrite bead filtering for noisy power rails.' },
        { q: 'What is the minimum prototype quantity?', a: 'We can do 1-off prototypes. Most fab houses have a minimum of 5 boards for the same price as 1, so we typically order 5 and give you all of them.' },
        { q: 'Do you handle component sourcing?', a: 'Yes — we source from Mouser, DigiKey, LCSC, and local Indian distributors. We manage the BOM, check availability, and handle procurement.' },
        { q: 'Can you reverse-engineer an existing PCB?', a: 'Yes. Send us the board and we will trace, schematic-capture, and create a KiCad project. Useful for obsolete boards or boards without documentation.' },
      ]}
      cta={{ primary: 'Get a PCB Quote →', primaryHref: '/get-a-quote', secondary: 'See Portfolio', secondaryHref: '/portfolio' }}
      relatedLinks={[
        { label: '3D Printing', href: '/services/3d-printing' },
        { label: 'Prototyping', href: '/services/prototyping' },
        { label: 'Robotics Solutions', href: '/services/robotics-solutions' },
      ]}
    />
  )
}
