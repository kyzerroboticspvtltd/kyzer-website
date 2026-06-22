import type { Metadata } from 'next'
import { ServicePageLayout } from '@/components/services/ServicePageLayout'

export const metadata: Metadata = {
  title: 'Custom Robotics Solutions Pune | Robotic Arms, AI Robots — Kyzer Robotics',
  description: 'Custom robotics solutions from Pune — robotic arms, autonomous ground vehicles, AI-integrated robots, student robotics kits, and research platforms. End-to-end build.',
  keywords: ['robotics solutions Pune', 'custom robotic arm India', 'robotics company Pune', 'autonomous robot India', 'robotics development Pune'],
}

export default function Page() {
  return (
    <ServicePageLayout
      badge="// ROBOTICS SOLUTIONS — PUNE, INDIA"
      headline="INTELLIGENT"
      accentWord="ROBOTICS"
      subheadline="Custom robotic systems for industrial, research, and educational applications. Robotic arms, autonomous ground vehicles, and AI-integrated platforms — built end-to-end in Pune."
      tagline="From concept to working robot · All programming included · Student discounts available"
      heroEmoji="🤖"
      accent="#e74c3c"
      stats={[
        { value: '15+', label: 'Robots Built' },
        { value: '6DOF', label: 'Max Arm Reach' },
        { value: 'ROS2', label: 'Control Stack' },
        { value: 'AI', label: 'Computer Vision' },
      ]}
      features={[
        { icon: '🦾', title: 'Robotic Arms', desc: '3–6 DOF robotic arms for manipulation, assembly, pick-and-place, and research. Custom reach, payload, and speed. Dynamixel or stepper driven with ROS2.' },
        { icon: '🚗', title: 'Autonomous Ground Vehicles', desc: 'Differential drive and mecanum wheel AGVs with lidar SLAM navigation, obstacle avoidance, and ROS2 Nav2 stack. Indoor and outdoor variants.' },
        { icon: '🧠', title: 'AI & Computer Vision', desc: 'YOLOv8 object detection, pose estimation, and semantic segmentation on Jetson Nano/Orin. Trained on custom datasets for your specific application.' },
        { icon: '🎓', title: 'Educational Robots', desc: 'Arduino and Raspberry Pi based robot kits for schools, colleges, and maker spaces. Curriculum-aligned, well-documented, and actually fun to build.' },
        { icon: '📡', title: 'Sensor Integration', desc: 'Lidar (RPLidar, Hokuyo), depth cameras (Intel RealSense, ZED), IMUs, encoders, and force-torque sensors. Full sensor fusion and calibration.' },
        { icon: '💻', title: 'Software & Firmware', desc: 'ROS2 packages, Arduino firmware, and Python control scripts. All source code delivered. Containerised with Docker for easy deployment and reproducibility.' },
      ]}
      process={[
        { step: 'STEP 01', title: 'Define the problem', desc: 'Tell us what task the robot needs to perform, the environment it operates in, and your budget. We scope the right platform and tech stack.' },
        { step: 'STEP 02', title: 'Design & BOM', desc: 'Mechanical design, electronics architecture, and software plan. Full BOM with pricing for your approval before we start building.' },
        { step: 'STEP 03', title: 'Build & program', desc: 'Hardware fabrication, assembly, wiring, and firmware development in our Pune workshop. Integration testing at each stage.' },
        { step: 'STEP 04', title: 'Deliver & document', desc: 'Full robot delivered with source code, wiring diagrams, user manual, and training session. Support available post-delivery.' },
      ]}
      faqs={[
        { q: 'Can you build a robot for my college project?', a: 'Absolutely — student and research projects are welcome. We offer discounted rates for college teams. WhatsApp us your requirement and budget and we will scope something feasible.' },
        { q: 'Do you use ROS?', a: 'Yes — all our complex robots use ROS2 (Robot Operating System 2). Simpler systems use Arduino or MicroPython firmware. All code is delivered in full.' },
        { q: 'Can you integrate AI into an existing robot?', a: 'Yes. If you have an existing robot platform, we can add computer vision (object detection, pose estimation), voice control, or autonomous navigation capabilities.' },
        { q: 'What is the typical cost of a custom robotic arm?', a: 'A 4-DOF research arm with Dynamixel servos, ROS2 control, and a basic end-effector starts from ₹35,000. 6-DOF industrial-grade systems with force control start from ₹1.2L.' },
        { q: 'Do you train the client team to operate the robot?', a: 'Yes — all deliveries include a handover session covering operation, maintenance, and basic troubleshooting. Extended training engagements are available.' },
      ]}
      cta={{ primary: 'Discuss Your Robot →', primaryHref: '/get-a-quote', secondary: 'See Robotics Portfolio', secondaryHref: '/portfolio' }}
      relatedLinks={[
        { label: 'Industrial Automation', href: '/services/industrial-automation' },
        { label: 'PCB Design', href: '/services/pcb-design' },
        { label: 'Drone Development', href: '/services/drone-development' },
      ]}
    />
  )
}
