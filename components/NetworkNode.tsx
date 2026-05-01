'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { latLonToVec3, GLOBE_RADIUS } from '@/lib/globe';
import type { GlobeNode } from '@/lib/globe';

interface Props {
  node: GlobeNode;
}

export default function NetworkNode({ node }: Props) {
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);

  const pos = useMemo(
    () => latLonToVec3(node.lat, node.lon, GLOBE_RADIUS + 0.015),
    [node]
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const phase1 = (t * 0.6) % 1;
    const phase2 = (t * 0.6 + 0.5) % 1;

    if (ring1Ref.current) {
      const s = 1 + phase1 * 2.8;
      ring1Ref.current.scale.setScalar(s);
      (ring1Ref.current.material as THREE.MeshBasicMaterial).opacity = Math.max(0, 0.65 - phase1 * 0.65);
    }
    if (ring2Ref.current) {
      const s = 1 + phase2 * 2.8;
      ring2Ref.current.scale.setScalar(s);
      (ring2Ref.current.material as THREE.MeshBasicMaterial).opacity = Math.max(0, 0.65 - phase2 * 0.65);
    }
  });

  return (
    <group position={pos}>
      {/* Core node sphere */}
      <mesh>
        <sphereGeometry args={[0.011, 8, 8]} />
        <meshBasicMaterial color="#D4AF37" />
      </mesh>

      {/* Pulse ring 1 */}
      <mesh ref={ring1Ref}>
        <ringGeometry args={[0.012, 0.017, 24]} />
        <meshBasicMaterial
          color="#D4AF37"
          transparent
          opacity={0.65}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* Pulse ring 2 — offset phase */}
      <mesh ref={ring2Ref}>
        <ringGeometry args={[0.012, 0.017, 24]} />
        <meshBasicMaterial
          color="#E8D48B"
          transparent
          opacity={0.4}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
