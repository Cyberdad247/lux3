'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import * as THREE from 'three';
import { latLonToVec3, bezierControlPoint, GLOBE_RADIUS } from '@/lib/globe';
import type { GlobeNode, FlightConnection } from '@/lib/globe';

interface Props {
  connection: FlightConnection;
  nodeMap: Record<string, GlobeNode>;
}

const CURVE_SEGMENTS = 64;

export default function FlightLine({ connection, nodeMap }: Props) {
  const fromNode = nodeMap[connection.from];
  const toNode   = nodeMap[connection.to];

  const { curve, arcPoints } = useMemo(() => {
    const p0 = latLonToVec3(fromNode.lat, fromNode.lon, GLOBE_RADIUS + 0.02);
    const p2 = latLonToVec3(toNode.lat,   toNode.lon,   GLOBE_RADIUS + 0.02);
    const p1 = bezierControlPoint(p0, p2, 1.65);
    const c  = new THREE.QuadraticBezierCurve3(p0, p1, p2);
    return { curve: c, arcPoints: c.getPoints(CURVE_SEGMENTS) };
  }, [fromNode, toNode]);

  // Travelling head particle
  const particleRef = useRef<THREE.Mesh>(null);
  const progressRef = useRef((connection.delay * 0.31) % 1);

  useFrame((_, delta) => {
    progressRef.current = (progressRef.current + delta * connection.speed * 0.18) % 1;
    const t = progressRef.current;

    if (particleRef.current) {
      const pos = curve.getPoint(t);
      particleRef.current.position.copy(pos);
      const brightness = 0.4 + Math.sin(t * Math.PI) * 0.6;
      (particleRef.current.material as THREE.MeshBasicMaterial).opacity = brightness;
    }
  });

  return (
    <group>
      {/* Static arc base — very dim */}
      <Line
        points={arcPoints}
        color="#D4AF37"
        lineWidth={0.6}
        transparent
        opacity={0.10}
      />

      {/* Travelling head particle */}
      <mesh ref={particleRef}>
        <sphereGeometry args={[0.009, 6, 6]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.9} />
      </mesh>
    </group>
  );
}
