import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Github, 
  Linkedin, 
  Mail, 
  Terminal, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  MapPin, 
  Cpu, 
  Layers, 
  Database,
  MonitorSmartphone,
  Send
} from 'lucide-react';

import CustomCursor from './components/CustomCursor';
import HeroScene from './components/HeroScene';
import SkillsCloud from './components/SkillsCloud';
import GithubCards from './components/GithubCards';

// --- Spring Magnetic Wrapper Component ---
export function Magnetic({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    const x = clientX - centerX;
    const y = clientY - centerY;
    
    // Smooth magnetic attraction factor (30% pull)
    setPosition({ x: x * 0.3, y: y * 0.3 });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 180, damping: 14, mass: 0.1 }}
    >
      {children}
    </motion.div>
  );
}

export default function App() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

  // Monitor scroll for state changes
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      // Section tracker
      const sections = ['home', 'about', 'skills', 'projects', 'contact'];
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 120 && rect.bottom >= 120) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 5000); // clear after 5s
  };

  return (
    <div id="top-layout" className="relative min-h-screen font-sans bg-[#050505] text-[#f1f5f9] selection:bg-cyan-500/30 overflow-x-hidden cyber-grid">
      
      {/* Visual Cursor */}
      <CustomCursor />

      {/* Decorative Blur Background Emitters */}
      <div className="absolute top-[-10%] left-[-5%] w-[45vw] h-[45vw] rounded-full bg-zinc-600/5 glow-blur -z-10" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[55vw] h-[55vw] rounded-full bg-slate-800/10 glow-blur -z-10" />
      <div className="absolute top-[40%] right-[10%] w-[35vw] h-[35vw] rounded-full bg-white/[0.02] glow-blur -z-10" />

      {/* --- FIXED HEADER NAV BAR --- */}
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b
          ${scrolled 
            ? 'py-4 glassmorphism border-white/[0.05] shadow-[0_10px_35px_rgba(3,3,5,0.85)]' 
            : 'py-6 bg-transparent border-transparent'}`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          
          {/* Logo Name */}
          <a href="#home" className="flex items-center gap-2 group">
            <span className="p-2 rounded-xl bg-gradient-to-tr from-white/20 to-white/60 p-[1px]">
              <div className="bg-dark-bg px-2.5 py-1 rounded-[11px] font-display font-bold text-sm tracking-widest text-[#050505] bg-white flex items-center justify-center">
                B
              </div>
            </span>
            <span className="font-display font-semibold tracking-widest text-white group-hover:text-gray-300 transition-colors uppercase text-sm">
              Biruk<span className="text-white/80">.</span>Dev
            </span>
          </a>

          {/* Nav Anchors */}
          <nav className="hidden md:flex items-center gap-1">
            {['home', 'about', 'skills', 'projects', 'contact'].map((sect) => (
              <Magnetic key={sect}>
                <a
                  href={`#${sect}`}
                  className={`px-4 py-1.5 rounded-full text-xs font-mono tracking-wider capitalize transition-all duration-300 relative
                    ${activeSection === sect 
                      ? 'text-white' 
                      : 'text-gray-400 hover:text-white'}`}
                >
                  {sect}
                  {activeSection === sect && (
                    <motion.span 
                      layoutId="activeIndicator"
                      className="absolute bottom-0 left-1/3 right-1/3 h-[2px] bg-white rounded-full"
                    />
                  )}
                </a>
              </Magnetic>
            ))}
          </nav>

          {/* Social icons CTA */}
          <div className="flex items-center gap-3">
            <Magnetic>
              <a 
                href="https://github.com/biruk6049" 
                target="_blank" 
                referrerPolicy="no-referrer"
                rel="noreferrer" 
                className="p-2 rounded-xl border border-white/5 bg-white/[0.02] text-gray-400 hover:text-white hover:border-white/20 hover:bg-white/[0.05] transition-all"
                title="GitHub Profile"
              >
                <Github className="w-4 h-4" />
              </a>
            </Magnetic>
            <Magnetic>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                referrerPolicy="no-referrer"
                rel="noreferrer" 
                className="p-2 rounded-xl border border-white/5 bg-white/[0.02] text-gray-400 hover:text-white hover:border-white/20 hover:bg-white/[0.05] transition-all"
                title="LinkedIn Link"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </Magnetic>
          </div>
        </div>
      </header>

      {/* --- HERO SECTION --- */}
      <section 
        id="home" 
        className="relative h-screen min-h-[600px] w-full flex items-center justify-center overflow-hidden"
      >
        {/* WebGL Canvas Component background */}
        <HeroScene />

        {/* Dense filter fade at screen edge */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#050505] to-transparent pointer-events-none" />

        {/* Hero typography overlay content */}
        <div className="max-w-7xl mx-auto px-6 w-full text-center relative z-10 select-none">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6 max-w-4xl mx-auto"
          >
            {/* Tagline intro badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 text-gray-300 bg-white/5 backdrop-blur-md text-[10px] font-bold tracking-wider uppercase shadow-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
              <span>Available for Projects</span>
            </div>

            {/* Display title */}
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-display font-extrabold tracking-tight leading-[1.05] text-white">
              Crafting{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-300 to-neutral-500">
                Web Experiences
              </span>
            </h1>

            {/* Short subtitle description */}
            <p className="text-sm sm:text-base md:text-lg text-white/60 font-sans max-w-2xl mx-auto leading-relaxed">
              Full-stack developer passionate about building beautiful, interactive websites with smooth animations and thoughtful design details.
            </p>

            {/* Actions button strip */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Magnetic>
                <a
                  href="#projects"
                  className="px-6 py-3 rounded-full bg-white text-black font-medium text-xs font-mono uppercase tracking-wider hover:bg-gray-200 shadow-[0_4px_20px_rgba(255,255,255,0.1)] transition-all flex items-center gap-2 group cursor-pointer"
                >
                  <span>View My Projects</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </a>
              </Magnetic>

              <Magnetic>
                <a
                  href="#contact"
                  className="px-6 py-3 rounded-full border border-white/10 hover:border-white/20 bg-white/[0.02] hover:bg-white/[0.06] text-white font-medium text-xs font-mono uppercase tracking-wider transition-all cursor-pointer"
                >
                  Say Hello
                </a>
              </Magnetic>
            </div>
          </motion.div>
        </div>

        {/* Scroll down indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50 hover:opacity-100 transition-opacity z-10 pointer-events-none">
          <span className="text-[10px] font-mono tracking-widest text-gray-400 uppercase">Scroll Down</span>
          <div className="w-[1.5px] h-8 bg-gradient-to-b from-gray-400 to-transparent relative overflow-hidden rounded-full">
            <motion.div 
              className="absolute top-0 left-0 right-0 h-1/2 bg-white"
              animate={{ y: ['0%', '100%'] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            />
          </div>
        </div>
      </section>

      {/* --- BUSINESS BENTO ABOUT SECTION --- */}
      <section id="about" className="py-24 max-w-7xl mx-auto px-6 relative">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="text-xs font-mono text-gray-400 tracking-widest uppercase mb-1">✦ ABOUT ME</div>
          <h2 className="text-3xl md:text-5xl font-display font-semibold tracking-tight text-white">Who I Am</h2>
        </div>

        {/* Profile Introduction */}
        <div className="flex flex-col md:flex-row items-center gap-8 mb-16">
          <div className="w-36 h-36 md:w-44 md:h-44 rounded-full overflow-hidden border-2 border-white/10 shadow-[0_0_40px_rgba(255,255,255,0.06)] flex-shrink-0 relative group">
            <img src="/profile.png" alt="Biruk - Full-Stack Developer" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            <div className="absolute inset-0 rounded-full bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
          </div>
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-display font-semibold text-white mb-3">Hey there, I'm Biruk</h3>
            <p className="text-sm text-gray-400 leading-relaxed max-w-lg font-sans">
              I'm a full-stack developer who loves turning ideas into polished, interactive web experiences.
              I enjoy working with modern tools like React, TypeScript, and Three.js to create things
              that not only work great — but feel great to use. When I'm not coding, you'll find me
              exploring new technologies and pushing creative boundaries.
            </p>
          </div>
        </div>

        {/* Bento Board Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Bento box 1: Hardware graphics acceleration (8 cols) */}
          <div className="md:col-span-8 p-8 rounded-3xl border border-white/5 bg-white/[0.01] glassmorphism backdrop-blur-lg flex flex-col justify-between h-72 md:h-80 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/[0.02] glow-blur group-hover:scale-125 transition-transform" />
            
            <div className="p-3 bg-neutral-900 border border-white/10 text-white rounded-2xl w-fit">
              <Cpu className="w-6 h-6" />
            </div>
            
            <div>
              <h3 className="text-xl md:text-2xl font-display font-medium text-white mb-2">Smooth & Interactive Experiences</h3>
              <p className="text-sm text-gray-400 leading-relaxed max-w-xl">
                I care about performance as much as design. Every animation runs smoothly, every interaction feels snappy, and every page loads fast — because great user experience shouldn't come with compromises.
              </p>
            </div>
          </div>

          {/* Bento box 2: Metrics stack (4 cols) */}
          <div className="md:col-span-4 p-8 rounded-3xl border border-white/5 bg-white/[0.01] glassmorphism backdrop-blur-lg flex flex-col justify-between h-72 md:h-80 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/[0.01] glow-blur" />
            
            <div className="text-xs font-mono text-gray-400 uppercase tracking-widest">✦ AT A GLANCE</div>
            
            <div className="space-y-4">
              <div>
                <span className="text-3xl font-display font-bold text-white">2+ Years</span>
                <p className="text-xs font-mono text-gray-500">Hands-on Experience</p>
              </div>
              <div>
                <span className="text-3xl font-display font-bold text-white">5+</span>
                <p className="text-xs font-mono text-gray-500">Projects Delivered</p>
              </div>
              <div>
                <span className="text-3xl font-display font-bold text-white">99.9%</span>
                <p className="text-xs font-mono text-gray-500">Performance Score</p>
              </div>
            </div>
          </div>

          {/* Bento box 3: System Developer Profile (4 cols) */}
          <div className="md:col-span-4 p-8 rounded-3xl border border-white/5 bg-white/[0.01] glassmorphism backdrop-blur-lg flex flex-col justify-between h-72 md:h-80 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/[0.01] glow-blur" />
            
            <div className="p-3 bg-neutral-900 border border-white/10 text-white rounded-2xl w-fit">
              <Terminal className="w-5 h-5" />
            </div>
            
            <div>
              <h3 className="text-lg font-display font-medium text-white mb-1.5">My Toolkit</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                I work primarily with TypeScript, React, and Vite — tools that help me write clean, maintainable code. I love a well-organized project and a fast dev server.
              </p>
            </div>
          </div>

          {/* Bento box 4: Responsive Stack (8 cols) */}
          <div className="md:col-span-8 p-8 rounded-3xl border border-white/5 bg-white/[0.01] glassmorphism backdrop-blur-lg flex flex-col justify-between h-72 md:h-80 relative overflow-hidden group">
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-white/[0.02] glow-blur group-hover:scale-125 transition-transform" />
            
            <div className="p-3 bg-neutral-900 border border-white/10 text-white rounded-2xl w-fit">
              <MonitorSmartphone className="w-5 h-5" />
            </div>
            
            <div>
              <h3 className="text-xl md:text-2xl font-display font-medium text-white mb-2">Built for Every Screen</h3>
              <p className="text-sm text-gray-400 leading-relaxed max-w-xl">
                Everything I build looks and works beautifully on any device — from wide desktop monitors to phones in your pocket. Responsive design isn't an afterthought, it's baked in from the start.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* --- SKILLS SECTION --- */}
      <section id="skills" className="py-24 max-w-7xl mx-auto px-6 relative">
        <div className="text-center mb-16">
          <div className="text-xs font-mono text-gray-400 tracking-widest uppercase mb-1">✦ SKILLS</div>
          <h2 className="text-3xl md:text-5xl font-display font-semibold tracking-tight text-white">My Tech Stack</h2>
        </div>

        {/* Rotation cloud block */}
        <SkillsCloud />
      </section>

      {/* --- REPOSITORIES PROJECTS SECTION --- */}
      <section id="projects" className="py-24 max-w-7xl mx-auto px-6 relative">
        
        <div className="text-center mb-16">
          <div className="text-xs font-mono text-gray-400 tracking-widest uppercase mb-1">✦ PROJECTS</div>
          <h2 className="text-3xl md:text-5xl font-display font-semibold tracking-tight text-white">Recent Projects</h2>
          <p className="text-sm text-gray-400 mt-3 font-sans max-w-lg mx-auto">
            Here are some of my recent projects, pulled live from my <span className="text-white font-mono font-medium">GitHub</span>. Hover over the cards to explore!
          </p>
        </div>

        {/* Load GitHub tilt cards */}
        <GithubCards />
      </section>

      {/* --- CONTACT CONSOLE SECTION --- */}
      <section id="contact" className="py-24 max-w-7xl mx-auto px-6 relative mb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left info column (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between text-left space-y-8">
            <div>
              <div className="text-xs font-mono text-gray-400 tracking-widest uppercase mb-1">✦ GET IN TOUCH</div>
              <h2 className="text-3xl md:text-5xl font-display font-semibold tracking-tight text-white mb-4">Let's Work Together</h2>
              <p className="text-sm text-gray-400 leading-relaxed font-sans">
                Have a project in mind or just want to say hi? I'd love to hear from you! I typically respond within a few hours.
              </p>
            </div>

            {/* Direct info items */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 rounded-2xl border border-white/5 bg-white/[0.01]">
                <Mail className="w-5 h-5 text-gray-300" />
                <div>
                  <div className="text-xs text-gray-500 font-mono uppercase">Email</div>
                  <div className="text-sm text-white font-mono select-all">biruk5868@gmail.com</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-2xl border border-white/5 bg-white/[0.01]">
                <MapPin className="w-5 h-5 text-gray-300" />
                <div>
                  <div className="text-xs text-gray-500 font-mono uppercase">Location</div>
                  <div className="text-sm text-white font-sans">Europe / Remote</div>
                </div>
              </div>
            </div>

            <div className="text-xs text-gray-500 font-mono uppercase">
              // Always happy to chat
            </div>
          </div>

          {/* Right form column (7 cols) */}
          <div className="lg:col-span-7">
            <div className="p-8 rounded-3xl border border-white/5 bg-white/[0.01] glassmorphism-card pb-10 relative">
              
              <AnimatePresence mode="wait">
                {formSubmitted ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex flex-col items-center justify-center text-center py-20"
                  >
                    <div className="w-14 h-14 rounded-full bg-neutral-900 border border-white/20 text-white flex items-center justify-center mb-6 shadow-xl animate-bounce">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-display font-semibold text-white mb-2">Message Sent!</h3>
                    <p className="text-xs text-gray-400 font-mono max-w-sm mb-4">
                      Reference: #{Math.floor(Math.random() * 900000 + 100000)}
                    </p>
                    <p className="text-sm text-gray-400">
                      Thanks for reaching out! I'll get back to you as soon as I can.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleFormSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-mono text-gray-500 uppercase">Your Name *</label>
                        <input
                          required
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full py-2.5 px-4 rounded-xl border border-white/5 bg-white/[0.02] focus:bg-white/[0.05] focus:border-white/30 text-sm text-white outline-none transition-all"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-mono text-gray-500 uppercase">Your Email *</label>
                        <input
                          required
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full py-2.5 px-4 rounded-xl border border-white/5 bg-white/[0.02] focus:bg-white/[0.05] focus:border-white/30 text-sm text-white outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-mono text-gray-500 uppercase">Subject</label>
                      <input
                        type="text"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full py-2.5 px-4 rounded-xl border border-white/5 bg-white/[0.02] focus:bg-white/[0.05] focus:border-white/30 text-sm text-white outline-none transition-all"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-mono text-gray-500 uppercase">Your Message *</label>
                      <textarea
                        required
                        rows={5}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full py-2.5 px-4 rounded-xl border border-white/5 bg-white/[0.02] focus:bg-white/[0.05] focus:border-white/30 text-sm text-white outline-none transition-all resize-none"
                      />
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        className="w-full py-3.5 rounded-xl bg-white hover:bg-gray-200 text-black font-mono text-xs tracking-widest uppercase shadow-md active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer font-bold"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Send Message</span>
                      </button>
                    </div>
                  </form>
                )}
              </AnimatePresence>

            </div>
          </div>

        </div>
      </section>

      {/* --- FOOTER REGION --- */}
      <footer className="py-12 border-t border-white/[0.03] bg-[#050505]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <span className="font-display font-semibold tracking-wider text-white text-xs uppercase">
              Biruk<span className="text-cyan-400">.</span>Dev © 2026
            </span>
            <span className="text-gray-600 text-xs font-mono">| Full-Stack Developer</span>
          </div>

          <div className="flex items-center gap-6">
            <a href="#home" className="text-xs font-mono text-gray-500 hover:text-white transition-colors">Top</a>
            <a href="#about" className="text-xs font-mono text-gray-500 hover:text-white transition-colors">About</a>
            <a href="#skills" className="text-xs font-mono text-gray-500 hover:text-white transition-colors">Skills</a>
            <a href="#projects" className="text-xs font-mono text-gray-500 hover:text-white transition-colors">GitHub</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
