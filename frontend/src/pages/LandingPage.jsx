import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  TreePine,
  ShieldCheck,
  Radio,
  Camera,
  Cpu,
  MapPin,
  Flame,
  AlertTriangle,
  Bell,
  Sun,
  Activity,
  ArrowRight,
  CheckCircle2,
  Users,
  Eye,
  Play,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSimulation } from '../context/SimulationContext';
import ThreatBadge from '../components/common/ThreatBadge';

export const LandingPage = () => {
  const { isAuthenticated } = useAuth();
  const { isSimulating, toggleSimulation } = useSimulation();
  const canvasRef = useRef(null);

  // Animated Canvas Background: Forest Nodes & IoT Connection Mesh
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle nodes representing sensors & wildlife signals
    const particles = Array.from({ length: 45 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      radius: Math.random() * 2.5 + 1.5,
      color: Math.random() > 0.3 ? '#10b981' : Math.random() > 0.5 ? '#f59e0b' : '#34d399',
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw connection lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 140) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(16, 185, 129, ${0.18 * (1 - dist / 140)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      // Draw & update particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const workflowSteps = [
    {
      step: '01',
      title: 'Animal Movement Detected',
      desc: 'Wildlife crosses the monitored perimeter boundary.',
      icon: Activity,
      color: 'text-emerald-400',
    },
    {
      step: '02',
      title: 'Multi-Sensor Data Collection',
      desc: 'PIR sensors, acoustic nodes, and thermal cameras trigger synchronously.',
      icon: Cpu,
      color: 'text-teal-400',
    },
    {
      step: '03',
      title: 'AI Species Identification',
      desc: 'Deep computer vision identifies species (Elephant, Tiger, Boar) with 95%+ confidence.',
      icon: Camera,
      color: 'text-cyan-400',
    },
    {
      step: '04',
      title: 'GPS Location Tagging',
      desc: 'Precise coordinates and directional movement vectors are mapped.',
      icon: MapPin,
      color: 'text-sky-400',
    },
    {
      step: '05',
      title: 'Threat Level Calculation',
      desc: 'Algorithm evaluates distance to village, species hazard, and time of day.',
      icon: Flame,
      color: 'text-amber-400',
    },
    {
      step: '06',
      title: 'Real-Time Alert Dispatch',
      desc: 'Instant sirens, SMS broadcast to residents, and dashboard push alerts.',
      icon: Bell,
      color: 'text-orange-400',
    },
    {
      step: '07',
      title: 'Rapid Ranger Response',
      desc: 'Forest squads deploy non-invasive deterrence to guide wildlife safely away.',
      icon: ShieldCheck,
      color: 'text-red-400',
    },
  ];

  const features = [
    {
      title: 'Real-Time Detection',
      desc: 'Sub-second response times using distributed edge LoRaWAN sensor networks along reserve boundaries.',
      icon: Radio,
      badge: 'Live Stream',
    },
    {
      title: 'AI Animal Recognition',
      desc: 'Advanced neural network models classify elephants, tigers, leopards, and gaurs with high precision.',
      icon: Camera,
      badge: 'Vision AI',
    },
    {
      title: 'GPS Spatial Tracking',
      desc: 'Interactive GIS mapping displaying live intrusion coordinates, forest borders, and village buffers.',
      icon: MapPin,
      badge: 'GIS Mapping',
    },
    {
      title: 'Instant Emergency Alerts',
      desc: 'Automated multi-channel dispatch via SMS, push notifications, dashboard alarms, and hardware sirens.',
      icon: Bell,
      badge: 'Multi-Channel',
    },
    {
      title: 'Smart Sensor Fleet',
      desc: 'Full visibility over battery health, solar telemetry, signal strength, and hardware diagnostics.',
      icon: Cpu,
      badge: 'IoT Fleet',
    },
    {
      title: 'Forest Safety Monitoring',
      desc: 'Comprehensive protection zone management with customizable warning radii and risk escalation.',
      icon: TreePine,
      badge: 'Perimeter Defense',
    },
    {
      title: 'Incident Dossiers',
      desc: 'Complete audit logs, ranger response notes, action timelines, and resolution reporting.',
      icon: ShieldCheck,
      badge: 'Incident Mgmt',
    },
    {
      title: 'Solar Powered Devices',
      desc: 'Eco-friendly, self-sustaining hardware nodes with low-power sleep modes for dense jungle operation.',
      icon: Sun,
      badge: '100% Green',
    },
  ];

  return (
    <div className="relative space-y-24">
      {/* Canvas Particle Background */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-0 opacity-40"
      />

      {/* HERO SECTION */}
      <section className="relative z-10 pt-12 pb-16 text-center max-w-4xl mx-auto space-y-8">
        {/* Top Beacon Badge */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full glass-card border border-emerald-500/30 text-xs font-mono text-emerald-300 shadow-lg shadow-emerald-500/10">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span>AUTONOMOUS WILDLIFE INTRUSION MONITORING PLATFORM</span>
        </div>

        {/* Large Heading */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.1]">
          Protecting Communities Through{' '}
          <span className="bg-gradient-to-r from-emerald-400 via-teal-200 to-cyan-400 bg-clip-text text-transparent">
            Intelligent Wildlife Detection
          </span>
        </h1>

        {/* Subheading */}
        <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          WILD SENSE is an intelligent IoT-based wildlife intrusion detection system that monitors forest boundaries, detects animal movement, identifies threats, and sends real-time alerts to communities and forest authorities.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Link to="/dashboard" className="btn-primary py-3.5 px-7 text-base shadow-xl shadow-emerald-500/25">
            <span>Explore System</span>
            <ArrowRight className="w-5 h-5" />
          </Link>

          {!isAuthenticated && (
            <>
              <Link to="/login" className="btn-secondary py-3.5 px-6 text-base">
                Officer Login
              </Link>
              <Link to="/register" className="btn-outline py-3.5 px-6 text-base">
                Resident Register
              </Link>
            </>
          )}

          <button
            onClick={() => toggleSimulation()}
            className={`btn-secondary py-3.5 px-6 text-base ${
              isSimulating ? 'border-amber-500 text-amber-400' : ''
            }`}
          >
            <Play className="w-4 h-4 fill-current text-amber-400" />
            <span>{isSimulating ? 'Stop Live Simulator' : 'Launch Simulation'}</span>
          </button>
        </div>

        {/* Quick Trust Highlights */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-12 border-t border-forest-800/80">
          <div className="p-4 rounded-2xl glass-card text-center">
            <span className="text-3xl font-black text-emerald-400 font-mono">99.2%</span>
            <p className="text-xs text-slate-400 mt-1">AI Detection Accuracy</p>
          </div>
          <div className="p-4 rounded-2xl glass-card text-center">
            <span className="text-3xl font-black text-cyan-400 font-mono">&lt; 1.5s</span>
            <p className="text-xs text-slate-400 mt-1">Real-Time Alert Speed</p>
          </div>
          <div className="p-4 rounded-2xl glass-card text-center">
            <span className="text-3xl font-black text-amber-400 font-mono">100%</span>
            <p className="text-xs text-slate-400 mt-1">Solar Self-Sustained</p>
          </div>
          <div className="p-4 rounded-2xl glass-card text-center">
            <span className="text-3xl font-black text-teal-400 font-mono">Zero</span>
            <p className="text-xs text-slate-400 mt-1">Human-Wildlife Conflict</p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="relative z-10 py-12 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-mono font-bold tracking-widest text-emerald-400 uppercase">
            END-TO-END WORKFLOW PIPELINE
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            How The Detection Engine Operates
          </h2>
          <p className="text-sm text-slate-400">
            From the initial PIR sensor motion trigger to coordinated forest ranger containment.
          </p>
        </div>

        {/* Step-by-Step Flow Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {workflowSteps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="relative glass-card-hover rounded-2xl p-6 flex flex-col justify-between space-y-4 group border border-forest-700/60"
              >
                {/* Step indicator */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-black text-slate-500 group-hover:text-emerald-400 transition-colors">
                    STEP {item.step}
                  </span>
                  <div className={`p-2.5 rounded-xl bg-forest-850/80 border border-forest-700 ${item.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-slate-100 group-hover:text-emerald-300 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                </div>

                {/* Progress bar line */}
                <div className="w-full h-1 rounded-full bg-forest-850 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500 group-hover:w-full"
                    style={{ width: `${(idx + 1) * 14.2}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="relative z-10 py-12 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-mono font-bold tracking-widest text-emerald-400 uppercase">
            INTELLIGENT CAPABILITIES
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Built For Real-World Forest Perimeters
          </h2>
          <p className="text-sm text-slate-400">
            Engineered to operate reliably under dense canopy foliage, high monsoon humidity, and rugged topography.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="glass-card-hover rounded-2xl p-6 flex flex-col justify-between space-y-4 group border border-forest-700/60"
              >
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-forest-800/80 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-mono font-semibold uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {feat.badge}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-base font-bold text-slate-100 group-hover:text-emerald-300 transition-colors">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{feat.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* INTERACTIVE THREAT MATRIX SHOWCASE */}
      <section className="relative z-10 py-12 max-w-5xl mx-auto">
        <div className="glass-card rounded-3xl p-8 sm:p-12 border border-emerald-500/30 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <span className="text-xs font-mono font-bold tracking-widest text-emerald-400 uppercase">
                INTELLIGENT THREAT MATRIX
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Multi-Factor Hazard Evaluation
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Our dynamic threat algorithm processes species dangerousness, proximity to human schools/fields, time of night, and directional speed to assign calibrated alert levels.
              </p>

              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between p-3 rounded-xl bg-obsidian-900/80 border border-red-500/30">
                  <span className="text-xs font-bold text-white">Tiger / Elephant near Village (&lt; 1km)</span>
                  <ThreatBadge level="CRITICAL" size="xs" />
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-obsidian-900/80 border border-orange-500/30">
                  <span className="text-xs font-bold text-white">Leopard / Bear near boundary trail</span>
                  <ThreatBadge level="HIGH" size="xs" />
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-obsidian-900/80 border border-amber-500/30">
                  <span className="text-xs font-bold text-white">Wild Boar sounder foraging</span>
                  <ThreatBadge level="MEDIUM" size="xs" />
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-obsidian-900/80 border border-emerald-500/30">
                  <span className="text-xs font-bold text-white">Spotted Deer herd in deep forest</span>
                  <ThreatBadge level="LOW" size="xs" />
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-obsidian-950/80 border border-forest-700/80 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-forest-800">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                  <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
                  <span>Real-Time Ingestion Console</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400">EDGE GATEWAY</span>
              </div>

              <div className="space-y-2 text-xs font-mono">
                <p className="text-emerald-400">&gt; [PIR-04] Motion breach detected at Node SEN-CAM-101</p>
                <p className="text-cyan-400">&gt; [AI-INFERENCE] YOLOv8 classified: Elephant (Confidence: 96.4%)</p>
                <p className="text-amber-400">&gt; [GPS] Geotag: 11.6782°N, 76.6214°E (0.7 km to Mangala)</p>
                <p className="text-red-400 font-bold">&gt; [THREAT ENGINE] Severity: CRITICAL. Dispatched SMS &amp; sirens.</p>
              </div>

              <div className="pt-3 border-t border-forest-800 flex justify-end">
                <Link to="/map" className="btn-primary py-2 px-4 text-xs">
                  <span>Open GIS Map</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="relative z-10 py-12 text-center max-w-3xl mx-auto space-y-6">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
          Empowering Wildlife Conservation & Human Safety
        </h2>
        <p className="text-sm text-slate-400 leading-relaxed">
          Access the live monitoring console, configure alert zones, and protect forest fringe communities today.
        </p>

        <div className="flex items-center justify-center gap-4 pt-2">
          <Link to="/dashboard" className="btn-primary py-3.5 px-8 text-sm">
            Launch Control Dashboard
          </Link>
          <Link to="/resident-portal" className="btn-secondary py-3.5 px-6 text-sm">
            Resident Safety Portal
          </Link>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
