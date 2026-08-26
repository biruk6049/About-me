import { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { 
  Code2, 
  Cpu, 
  Layers, 
  Boxes, 
  FileCode, 
  Wind, 
  Database,
  Send, 
  GitBranch,
  Terminal,
  Anchor,
  Globe,
  Settings,
  HardDrive
} from 'lucide-react';
import { SkillItem } from '../types';

// Curated professional skills list
const SKILLS_DATA: SkillItem[] = [
  { name: 'React', category: 'frontend', icon: 'Code2', level: 95, description: 'Single Page Apps & Context Architecture' },
  { name: 'TypeScript', category: 'frontend', icon: 'FileCode', level: 90, description: 'Type-safe interfaces and architectures' },
  { name: 'Three.js', category: '3d', icon: 'Boxes', level: 85, description: 'WebGL scenes & direct camera renders' },
  { name: 'Node.js', category: 'backend', icon: 'Terminal', level: 88, description: 'Asynchronous event-loop services' },
  { name: 'Tailwind CSS', category: 'frontend', icon: 'Wind', level: 95, description: 'Responsive high-fidelity styling' },
  { name: 'Framer Motion', category: '3d', icon: 'Layers', level: 90, description: 'Fluid micro-animations & layout transitions' },
  { name: 'Express', category: 'backend', icon: 'HardDrive', level: 85, description: 'RESTful API controller layer' },
  { name: 'PostgreSQL', category: 'backend', icon: 'Database', level: 80, description: 'Schema queries and relational state' },
  { name: 'GraphQL', category: 'backend', icon: 'Anchor', level: 75, description: 'Flexible graph query resolution' },
  { name: 'WebGL', category: '3d', icon: 'Cpu', level: 82, description: 'Vertex/fragment shaders and buffers' },
  { name: 'Git', category: 'tools', icon: 'GitBranch', level: 90, description: 'Version control branch strategies' },
  { name: 'Docker', category: 'tools', icon: 'Settings', level: 78, description: 'Isolated container runtime layers' },
  { name: 'Vite', category: 'tools', icon: 'Globe', level: 92, description: 'Ultra-fast bundle compilations' },
  { name: 'Firebase', category: 'tools', icon: 'Send', level: 84, description: 'OAuth and Firestore persistent storage' }
];

// Helper to resolve icon name dynamically as React elements
function getSkillIcon(iconName: string) {
  const iconProps = { className: 'w-4 h-4' };
  switch (iconName) {
    case 'Code2': return <Code2 {...iconProps} />;
    case 'Cpu': return <Cpu {...iconProps} />;
    case 'Layers': return <Layers {...iconProps} />;
    case 'Boxes': return <Boxes {...iconProps} />;
    case 'FileCode': return <FileCode {...iconProps} />;
    case 'Wind': return <Wind {...iconProps} />;
    case 'Database': return <Database {...iconProps} />;
    case 'Send': return <Send {...iconProps} />;
    case 'GitBranch': return <GitBranch {...iconProps} />;
    case 'Terminal': return <Terminal {...iconProps} />;
    case 'Anchor': return <Anchor {...iconProps} />;
    case 'Globe': return <Globe {...iconProps} />;
    case 'Settings': return <Settings {...iconProps} />;
    case 'HardDrive': return <HardDrive {...iconProps} />;
    default: return <Code2 {...iconProps} />;
  }
}

function SkillNode({ skill, position, onHoverSkill }: { 
  skill: SkillItem; 
  position: THREE.Vector3;
  onHoverSkill: (skill: SkillItem | null) => void;
}) {
  const [hovered, setHovered] = useState(false);

  // Category classes
  const getCategoryTheme = (cat: string) => {
    switch (cat) {
      case 'frontend':
        return 'border-cyan-500/30 text-cyan-400 bg-cyan-950/25';
      case 'backend':
        return 'border-purple-500/30 text-purple-400 bg-purple-950/25';
      case '3d':
        return 'border-pink-500/30 text-pink-400 bg-pink-950/25';
      case 'tools':
        return 'border-emerald-500/30 text-emerald-400 bg-emerald-950/25';
      default:
        return 'border-gray-500/30 text-gray-400 bg-gray-950/25';
    }
  };

  return (
    <Html
      position={position}
      center
      distanceFactor={6}
      style={{
        transition: 'all 0.3s ease',
        pointerEvents: 'auto',
      }}
    >
      <div
        className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 border text-xs font-medium cursor-pointer transition-all duration-300 whitespace-nowrap select-none backdrop-blur-md 
          ${getCategoryTheme(skill.category)}
          ${hovered ? 'scale-115 shadow-lg border-white/40 ring-1 ring-white/10 z-50 translate-z-10 bg-black/80 text-white' : 'scale-100'}
        `}
        onMouseEnter={() => {
          setHovered(true);
          onHoverSkill(skill);
        }}
        onMouseLeave={() => {
          setHovered(false);
          onHoverSkill(null);
        }}
      >
        {getSkillIcon(skill.icon)}
        <span>{skill.name}</span>
      </div>
    </Html>
  );
}

function CloudSphere({ onHoverSkill }: { onHoverSkill: (skill: SkillItem | null) => void }) {
  const groupRef = useRef<THREE.Group>(null);

  // Generate spherical coordinates using a Golden Spiral distribution
  const computedPoints = useMemo(() => {
    const N = SKILLS_DATA.length;
    const r = 3.5; // Radius of sphere
    return SKILLS_DATA.map((skill, i) => {
      // Golden geometry formula
      const offset = 2 / N;
      const increment = Math.PI * (3 - Math.sqrt(5));
      
      const y = ((i * offset) - 1) + (offset / 2);
      const radius = Math.sqrt(1 - Math.pow(y, 2)) * r;
      
      const phi = i * increment;
      
      const x = Math.cos(phi) * radius;
      const z = Math.sin(phi) * radius;
      
      return {
        skill,
        position: new THREE.Vector3(x, y * r, z)
      };
    });
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      // Steady orbital drift
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.12;
      groupRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.05) * 0.08;
    }
  });

  return (
    <group ref={groupRef}>
      {computedPoints.map(({ skill, position }, i) => (
        <SkillNode 
          key={i} 
          skill={skill} 
          position={position} 
          onHoverSkill={onHoverSkill} 
        />
      ))}
      {/* Light structural sphere inside */}
      <mesh>
        <sphereGeometry args={[2.5, 16, 16]} />
        <meshBasicMaterial 
          color="#3b0764" 
          wireframe 
          transparent 
          opacity={0.03} 
        />
      </mesh>
    </group>
  );
}

export default function SkillsCloud() {
  const [activeSkill, setActiveSkill] = useState<SkillItem | null>(null);

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#06060c]/40 border border-white/5 rounded-3xl p-6 lg:p-10 backdrop-blur-xl transition-all duration-300">
      
      {/* 30% Panel description */}
      <div className="lg:col-span-5 flex flex-col justify-center text-left order-2 lg:order-1">
        <div className="text-xs font-mono text-cyber-cyan mb-2 tracking-widest uppercase">
          ✦ My Skill Set
        </div>
        <h3 className="text-2xl lg:text-3xl font-display font-semibold text-white tracking-tight mb-4">
          Technologies I Love Working With
        </h3>
        <p className="text-sm text-gray-400 font-sans leading-relaxed mb-6">
          Hover or drag the interactive 3D skill sphere to explore what I work with.
          Each node represents a technology I use regularly across my projects.
        </p>

        {/* Dynamic description box */}
        <div className="h-44 flex flex-col justify-center p-5 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-md relative overflow-hidden transition-all duration-300">
          <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500/80" />
          {activeSkill ? (
            <div className="animate-fade-in">
              <div className="flex items-center gap-2 mb-2">
                <span className="p-1 rounded bg-cyan-500/10 text-cyan-400">
                  {getSkillIcon(activeSkill.icon)}
                </span>
                <span className="text-lg font-display font-semibold text-white">
                  {activeSkill.name}
                </span>
                <span className="ml-auto text-xs font-mono px-2 py-0.5 rounded-full border border-cyan-500/20 text-cyan-400">
                  {activeSkill.level}% Expert
                </span>
              </div>
              <div className="text-xs text-gray-300 font-mono mb-3 uppercase tracking-wider">
                Category: <span className="text-purple-400">{activeSkill.category}</span>
              </div>
              <p className="text-sm text-gray-400 font-sans leading-relaxed">
                {activeSkill.description}
              </p>
              {/* Graphical level bar */}
              <div className="mt-4 w-full h-1 bg-white/5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-500"
                  style={{ width: `${activeSkill.level}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500 font-sans text-sm">
              <p>Hover over a skill to learn more</p>
              <p className="text-xs text-gray-600 mt-1 font-mono">DRAG TO EXPLORE</p>
            </div>
          )}
        </div>
      </div>

      {/* 3D Scene canvas container */}
      <div className="lg:col-span-7 h-[400px] lg:h-[480px] w-full relative select-none cursor-grab active:cursor-grabbing order-1 lg:order-2 interactive-3d">
        <Canvas
          camera={{ position: [0, 0, 7.5], fov: 60 }}
          gl={{ antialias: true, alpha: true }}
        >
          <ambientLight intensity={1.2} />
          <pointLight position={[10, 10, 10]} intensity={1.5} color="#06b6d4" />
          <CloudSphere onHoverSkill={setActiveSkill} />
          <OrbitControls 
            enableZoom={false} 
            enablePan={false}
            autoRotate={false}
            dampingFactor={0.05}
            enableDamping
          />
        </Canvas>
      </div>

    </div>
  );
}
