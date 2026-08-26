import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Float } from '@react-three/drei';
import * as THREE from 'three';

function CentralGeometricMesh() {
  const meshRef = useRef<THREE.Mesh>(null);
  const wireRef = useRef<THREE.Mesh>(null);
  const orbitGroupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();

    // Constant slow spin
    if (meshRef.current) {
      meshRef.current.rotation.y = elapsed * 0.25;
      meshRef.current.rotation.x = elapsed * 0.15;
    }

    if (wireRef.current) {
      wireRef.current.rotation.y = -elapsed * 0.12;
      wireRef.current.rotation.x = -elapsed * 0.08;
    }

    // Outer orbital rings spinning
    if (orbitGroupRef.current) {
      orbitGroupRef.current.rotation.z = elapsed * 0.1;
      orbitGroupRef.current.rotation.y = elapsed * 0.05;
    }
  });

  return (
    <group>
      {/* Outer orbital wireframe ring */}
      <group ref={orbitGroupRef}>
        <mesh>
          <torusGeometry args={[2.0, 0.015, 8, 100]} />
          <meshBasicMaterial color="#e2e8f0" opacity={0.15} transparent />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[2.4, 0.01, 8, 100]} />
          <meshBasicMaterial color="#94a3b8" opacity={0.12} transparent />
        </mesh>
        
        {/* Orbital particles / satellites */}
        <mesh position={[2.0, 0, 0]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial color="#cbd5e1" emissive="#cbd5e1" emissiveIntensity={1.5} />
        </mesh>
        <mesh position={[-1.7, 1.2, 0]}>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshStandardMaterial color="#94a3b8" emissive="#94a3b8" emissiveIntensity={1.0} />
        </mesh>
      </group>

      {/* Main Solid Core */}
      <mesh
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={hovered ? 1.15 : 1.0}
      >
        <icosahedronGeometry args={[1.2, 1]} />
        <meshPhysicalMaterial
          color={hovered ? '#27272a' : '#0e0e11'}
          emissive={hovered ? '#cbd5e1' : '#3f3f46'}
          emissiveIntensity={hovered ? 0.7 : 0.3}
          roughness={0.15}
          metalness={0.95}
          clearcoat={1.0}
          clearcoatRoughness={0.1}
          flatShading
        />
      </mesh>

      {/* Expanding Wireframe Shell */}
      <mesh ref={wireRef} scale={hovered ? 1.25 : 1.12}>
        <icosahedronGeometry args={[1.2, 1]} />
        <meshBasicMaterial
          color={hovered ? '#ffffff' : '#a1a1aa'}
          wireframe
          transparent
          opacity={hovered ? 0.35 : 0.15}
        />
      </mesh>
    </group>
  );
}

function MainParallaxScene() {
  const containerRef = useRef<THREE.Group>(null);

  // Parallax tracking mouse coordinates
  useFrame((state) => {
    if (containerRef.current) {
      const targetX = state.pointer.x * 0.6;
      const targetY = state.pointer.y * 0.4;
      
      // Interpolate with lerp damping for smooth gliding mechanics
      containerRef.current.rotation.y += (targetX - containerRef.current.rotation.y) * 0.08;
      containerRef.current.rotation.x += (-targetY - containerRef.current.rotation.x) * 0.08;
    }
  });

  return (
    <group ref={containerRef}>
      <Float speed={2} floatIntensity={1.5} floatingRange={[-0.2, 0.2]}>
        <CentralGeometricMesh />
      </Float>
    </group>
  );
}

export default function HeroScene() {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-auto interactive-3d z-0">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={2.0} color="#ffffff" />
        <pointLight position={[-10, -10, -5]} intensity={1.2} color="#a1a1aa" />
        <directionalLight position={[0, 5, 0]} intensity={0.8} />

        <MainParallaxScene />
        <Stars radius={100} depth={50} count={2000} factor={6} saturation={0.5} fade speed={1.5} />
      </Canvas>
    </div>
  );
}
