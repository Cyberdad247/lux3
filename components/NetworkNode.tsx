'use client';

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { latLonToVec3, GLOBE_RADIUS } from '@/lib/globe';
import type { GlobeNode } from '@/lib/globe';

interface Props {
  node: GlobeNode;
  active?: boolean;
}

const GOLD = new THREE.Color('#D4AF37');
const WHITE = new THREE.Color('#ffffff');

export default function NetworkNode({ node, active = true }: Props) {
  const ringRef   = useRef<THREE.Mesh>(null);
  const ring2Ref  = useRef<THREE.Mesh>(null);
  const coreRef   = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const pos = latLonToVec3(node.lat, node.lon, GLOBE_RADIUS + 0.015);
  const normal = pos.clone().normalize();

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    // Pulse ring scale
    if (ringRef.current) {
      const s = 1 + ((t * 0.7) % 1) * 2.5;
      const o = Math.max(0, 0.7 - ((t * 0.7) % 1) * 0.7);
      ringRef.current.scale.setScalar(s);
      (ringRef.current.material as THREE.MeshBasicMaterial).opacity = o;
    }
    // Second ring offset
    if (ring2Ref.current) {
      const phase = (t * 0.7 + 0.5) % 1;
      const s = 1 + phase * 2.5;
      const o = Math.max(0, 0.7 - phase * 0.7);
      ring2Ref.current.scale.setScalar(s);
      (ring2Ref.current.material as THREE.MeshBasicMaterial).opacity = o;
    }
    // Core brightness flicker
    if (coreRef.current) {
      const intensity = 0.85 + Math.sin(t * 3.2) * 0.15;
      (coreRef.current.material as THREE.MeshBasicMaterial).color.lerpColors(
        GOLD, WHITE, hovered ? 0.9 : intensity * 0.1
      );
    }
  });

  return (
    <group position={pos}>
      {/* Orient everything to face outward from sphere surface */}
      <group quaternion={new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 0, 1),
        normal
      )}>
        {/* Core dot */}
        <mesh ref={coreRef}>
          <sphereGeometry args={[0.012, 8, 8]} />
          <meshBasicMaterial color={GOLD} />
        </mesh>

        {/* Pulse rings (flat discs in XY plane, face outward) */}
        <mesh ref={ringRef}>
          <ringGeometry args={[0.013, 0.018, 24]} />
          <meshBasicMaterial
            color="#D4AF37"
            transparent
            opacity={0.7}
            side={THREE.DoubleSide}
          />
        </mesh>
        <mesh ref={ring2Ref}>
          <ringGeometry args={[0.013, 0.018, 24]} />
          <meshBasicMaterial
            color="#D4AF37"
            transparent
            opacity={0.35}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>

      {/* 2D HTML label — pointer-events none so orbit still works */}
      <Html
        center
        distanceFactor={6}
        style={{ pointerEvents: 'none', userSelect: 'none' }}
        position={[normal.x * 0.12, normal.y * 0.12, normal.z * 0.12]}
      >
        <div className="flex flex-col items-center gap-0.5" style={{ minWidth: 64 }}>
          <span
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 7,
              letterSpacing: '0.25em',
              color: 'rgba(212,175,55,0.9)',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
              textShadow: '0 0 8px rgba(212,175,55,0.6)',
            }}
          >
            {node.label}
          </span>
          <span
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 5,
              letterSpacing: '0.2em',
              color: 'rgba(255,255,255,0.3)',
              whiteSpace: 'nowrap',
            }}
          >
            {node.lat.toFixed(1)}°N {Math.abs(node.lon).toFixed(1)}°{node.lon < 0 ? 'W' : 'E'}
          </span>
        </div>
      </Html>
    </group>
  );
}
