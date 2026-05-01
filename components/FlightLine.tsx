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

function hashString(input: string) {
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function seededRandom(seed: number, salt: number) {
  const x = Math.sin(seed * 0.0001 + salt * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

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
    const seed = hashString(`${connection.from}-${connection.to}-${connection.delay}`);
    return Array.from({ length: PULSE_COUNT }).map((_, i) => ({
      offset: seededRandom(seed, i + 1) * 0.92,
      speed: connection.speed * (0.14 + seededRandom(seed, i + 11) * 0.08),
      size: 0.007 + seededRandom(seed, i + 21) * 0.012,
      opacity: 0.42 + seededRandom(seed, i + 31) * 0.53,
      scale: 0.5 + seededRandom(seed, i + 41) * 0.72,
      drift: seededRandom(seed, i + 51) * 0.05,
      wobble: seededRandom(seed, i + 61) * 0.18,
    }));
  }, [connection.delay, connection.speed]);

  useFrame((state) => {
    const elapsed = state.clock.elapsedTime;
    pulseMeta.forEach((meta, i) => {
      const mesh = pulseRefs.current[i];
      if (!mesh) return;
      const progress = (elapsed * meta.speed + meta.offset) % 1;
      const pos = curve.getPoint(progress);
      const tangent = curve.getTangent(progress);
      const normal = new THREE.Vector3(-tangent.y, tangent.x, tangent.z).normalize();
      const lateral = normal.multiplyScalar(Math.sin((elapsed + progress) * 8 + i) * meta.wobble);
      pos.addScaledVector(tangent, meta.drift).add(lateral);
      mesh.position.copy(pos);
      mesh.scale.setScalar(meta.scale + Math.sin((progress + i * 0.15) * Math.PI) * 0.16);
      const material = mesh.material as THREE.MeshBasicMaterial;
      material.opacity = Math.max(0.08, meta.opacity * (0.28 + Math.sin(progress * Math.PI) * 0.72));
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
