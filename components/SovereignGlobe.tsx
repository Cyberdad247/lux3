'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { GLOBE_RADIUS } from '@/lib/globe';

export default function SovereignGlobe() {
  const wireRef = useRef<THREE.Mesh>(null);

  // Very slow Y-axis drift independent of OrbitControls
  useFrame((_, delta) => {
    if (wireRef.current) {
      wireRef.current.rotation.y += delta * 0.04;
    }
  });

  return (
    <group>
      {/* Dark matte core sphere */}
      <mesh>
        <sphereGeometry args={[GLOBE_RADIUS, 64, 48]} />
        <meshStandardMaterial
          color="#050507"
          roughness={0.92}
          metalness={0.08}
        />
      </mesh>

      {/* Gold wireframe overlay — slight offset to avoid z-fighting */}
      <mesh ref={wireRef}>
        <sphereGeometry args={[GLOBE_RADIUS + 0.002, 28, 20]} />
        <meshBasicMaterial
          color="#D4AF37"
          wireframe
          transparent
          opacity={0.07}
        />
      </mesh>

      {/* Subtle atmospheric rim glow */}
      <mesh>
        <sphereGeometry args={[GLOBE_RADIUS + 0.06, 32, 24]} />
        <meshBasicMaterial
          color="#D4AF37"
          transparent
          opacity={0.018}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
}
