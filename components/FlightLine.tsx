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
      opacity: 0.12,
    });
    return { curve: c, staticLine: new THREE.Line(geom, mat) };
  }, [fromNode, toNode]);

  // Travelling head particle
  const particleRef = useRef<THREE.Mesh>(null);
  const progressRef = useRef((connection.delay * 0.31) % 1);

  useFrame((_, delta) => {
    progressRef.current = (progressRef.current + delta * connection.speed * 0.16) % 1;
    if (!particleRef.current) return;
    const pos = curve.getPoint(progressRef.current);
    particleRef.current.position.copy(pos);
    const brightness = 0.3 + Math.sin(progressRef.current * Math.PI) * 0.7;
    (particleRef.current.material as THREE.MeshBasicMaterial).opacity = brightness;
  });

  return (
    <group>
      <primitive object={staticLine} />
      <mesh ref={particleRef}>
        <sphereGeometry args={[0.008, 6, 6]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.9} depthWrite={false} />
      </mesh>
    </group>
  );
}
