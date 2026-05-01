'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { latLonToVec3, bezierControlPoint, GLOBE_RADIUS } from '@/lib/globe';
import type { GlobeNode, FlightConnection } from '@/lib/globe';

interface Props {
  connection: FlightConnection;
  nodeMap: Record<string, GlobeNode>;
}

const CURVE_SEGMENTS = 80;
const PULSE_COUNT = 3;

export default function FlightLine({ connection, nodeMap }: Props) {
  const fromNode = nodeMap[connection.from];
  const toNode   = nodeMap[connection.to];

  const { curve, staticLine } = useMemo(() => {
    const p0 = latLonToVec3(fromNode.lat, fromNode.lon, GLOBE_RADIUS + 0.02);
    const p2 = latLonToVec3(toNode.lat,   toNode.lon,   GLOBE_RADIUS + 0.02);
    const p1 = bezierControlPoint(p0, p2, 1.65);
    const c  = new THREE.QuadraticBezierCurve3(p0, p1, p2);
    const pts = c.getPoints(CURVE_SEGMENTS);

    // Static dim arc
    const geom = new THREE.BufferGeometry().setFromPoints(pts);
    const mat  = new THREE.LineBasicMaterial({
      color: 0xD4AF37,
      transparent: true,
      opacity: 0.18,
    });
    return { curve: c, staticLine: new THREE.Line(geom, mat) };
  }, [fromNode, toNode]);

  // Travelling head particle
  const pulseRefs = useRef<(THREE.Mesh | null)[]>([]);
  const pulseMeta = useMemo(() => {
    return Array.from({ length: PULSE_COUNT }).map((_, i) => ({
      offset: connection.delay * 0.31 + i * 0.22,
      speed: connection.speed * (0.16 + i * 0.03),
      size: i === 0 ? 0.016 : i === 1 ? 0.011 : 0.008,
      opacity: i === 0 ? 0.95 : i === 1 ? 0.65 : 0.45,
      scale: i === 0 ? 1 : i === 1 ? 0.72 : 0.55,
    }));
  }, [connection.delay, connection.speed]);

  useFrame((state) => {
    const elapsed = state.clock.elapsedTime;
    pulseMeta.forEach((meta, i) => {
      const mesh = pulseRefs.current[i];
      if (!mesh) return;
      const progress = (elapsed * meta.speed + meta.offset) % 1;
      const pos = curve.getPoint(progress);
      mesh.position.copy(pos);
      mesh.scale.setScalar(meta.scale + Math.sin((progress + i * 0.15) * Math.PI) * 0.12);
      const material = mesh.material as THREE.MeshBasicMaterial;
      material.opacity = Math.max(0.06, meta.opacity * (0.35 + Math.sin(progress * Math.PI) * 0.65));
    });
  });

  return (
    <group>
      <primitive object={staticLine} />
      {pulseMeta.map((meta, i) => (
        <mesh
          key={i}
          ref={(el) => {
            pulseRefs.current[i] = el;
          }}
        >
          <sphereGeometry args={[meta.size, 8, 8]} />
          <meshBasicMaterial
            color={i === 0 ? '#ffffff' : '#D4AF37'}
            transparent
            opacity={meta.opacity}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
}
