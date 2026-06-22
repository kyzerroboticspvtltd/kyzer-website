import type { Metadata } from 'next'
import { ServicePageLayout } from '@/components/services/ServicePageLayout'

export const metadata: Metadata = {
  title: 'Industrial Automation Pune | PLC, Robotics, Custom Automation — Kyzer Robotics',
  description: 'Industrial automation solutions in Pune — PLC programming, robotic arm integration, conveyor automation, computer vision inspection, and custom control systems for MSMEs.',
  keywords: ['industrial automation Pune', 'PLC automation India', 'robotic automation Pune', 'factory automation India', 'MSME automation Pune'],
}

export default function Page() {
  return (
    <ServicePageLayout
      badge="// INDUSTRIAL AUTOMATION — PUNE"
      headline="SMART FACTORY"
      accentWord="AUTOMATION"
      subheadline="Custom industrial automation for Pune MSMEs and manufacturers — robotic arms, conveyor systems, computer vision quality control, and PLC-based process automation."
      tagline="Free 1-hour site visit for Pune-based clients · ROI analysis included"
      heroEmoji="⚙️"
      accent="#e67e22"
      stats={[
        { value: '8+', label: 'Automation Projects' },
        { value: '3×', label: 'Avg. Throughput Gain' },
        { value: '8mo', label: 'Avg. ROI Period' },
        { value: '0.3%', label: 'Error Rate Achieved' },
      ]}
      features={[
        { icon: '🦾', title: 'Robotic Arms', desc: 'Custom 3–6 DOF robotic arms for pick-and-place, sorting, assembly, and welding tasks. Dynamixel servo or stepper motor driven with ROS2 control stack.' },
        { icon: '👁️', title: 'Computer Vision QC', desc: 'YOLOv8-based visual inspection systems for defect detection, part orientation, and measurement. Jetson-based edge AI with real-time rejection signals.' },
        { icon: '📟', title: 'PLC & HMI', desc: 'Allen Bradley, Siemens S7, and Arduino-based PLC programming for conveyor control, sequencing, and safety interlocking. HMI design and SCADA integration.' },
        { icon: '🏭', title: 'Conveyor Systems', desc: 'Custom conveyor design, assembly, and control for sorting, inspection, and packaging lines. Sensor integration, variable speed drives, and reject mechanisms.' },
        { icon: '📊', title: 'OEE & Data Logging', desc: 'Real-time production monitoring, downtime tracking, and OEE dashboards. Data logged to cloud or local server for management reporting.' },
        { icon: '🔧', title: 'AMC & Support', desc: 'Annual maintenance contracts, remote monitoring, and on-site support for all systems we build. 24-hour response for critical production line issues.' },
      ]}
      process={[
        { step: 'STEP 01', title: 'Site visit & assessment', desc: 'Free 1-hour visit for Pune clients to understand your production line, bottlenecks, and automation potential. Remote assessment available for outstation.' },
        { step: 'STEP 02', title: 'ROI proposal', desc: 'Detailed proposal with scope, timeline, investment, and projected ROI calculation. We only propose automation that pays back within 12 months.' },
        { step: 'STEP 03', title: 'Build & install', desc: 'Custom fabrication, assembly, wiring, and programming at our workshop. Installation and commissioning at your facility with minimal production downtime.' },
        { step: 'STEP 04', title: 'Training & handover', desc: 'Operator training, maintenance procedures, and documentation. Remote support access configured. AMC available for ongoing reliability.' },
      ]}
      faqs={[
        { q: 'Is automation suitable for my small factory?', a: 'Yes — most of our clients are MSMEs with 10–100 employees. Automation does not require a large factory. Even a single robotic pick-and-place can eliminate 2 manual operators and pay back in 8–12 months.' },
        { q: 'What is the minimum project size?', a: 'Our minimum engagement is ₹50,000 for a simple automation project. Full conveyor and robotic systems typically range from ₹1.5L to ₹15L depending on complexity.' },
        { q: 'Do I need to shut down my production line for installation?', a: 'We design for minimal downtime. Most installations happen during scheduled maintenance windows or weekends. We plan the commissioning timeline with your production schedule.' },
        { q: 'Can you integrate with my existing machinery?', a: 'Yes. We design control systems that interface with existing PLCs, sensors, and machines. We have experience with Siemens, Allen Bradley, Mitsubishi, and generic relay logic systems.' },
        { q: 'Do you offer post-installation support?', a: 'Yes — all projects include 3 months of free support. After that, we offer Annual Maintenance Contracts with defined SLAs and response times.' },
      ]}
      cta={{ primary: 'Book a Free Site Visit →', primaryHref: '/consultation', secondary: 'See Automation Portfolio', secondaryHref: '/portfolio' }}
      relatedLinks={[
        { label: 'Robotics Solutions', href: '/services/robotics-solutions' },
        { label: 'PCB Design', href: '/services/pcb-design' },
        { label: 'Prototyping', href: '/services/prototyping' },
      ]}
    />
  )
}
