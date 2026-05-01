'use client';

import { Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import SovereignGlobe from './SovereignGlobe';
import NetworkNode from './NetworkNode';
import FlightLine from './FlightLine';
import { NODES, CONNECTIONS } from '@/lib/globe';
import type { GlobeNode } from '@/lib/globe';

export default function GlobeScene() {
  const nodeMap = useMemo(() => {
    return NODES.reduce<Record<string, GlobeNode>>((acc, n) => {
      acc[n.id] = n;
      return acc;
    }, {});
  }, []);

  return (
    <div className="fixed inset-0 z-0" style={{ background: '#010101' }}>
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0.4, 4.2], fov: 42 }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
        }}
        style={{ background: '#010101' }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.15} />
        <pointLight position={[4, 4, 4]}   color="#D4AF37" intensity={1.2} />
        <pointLight position={[-4, -2, -3]} color="#ffffff" intensity={0.35} />
        <pointLight position={[0, 5, -2]}   color="#D4AF37" intensity={0.4} />

        {/* No stars — pure void per blueprint */}

        <Suspense fallback={null}>
          <SovereignGlobe />

          {NODES.map(node => (
            <NetworkNode key={node.id} node={node} />
          ))}

          {CONNECTIONS.map((conn, i) => (
            <FlightLine key={i} connection={conn} nodeMap={nodeMap} />
          ))}
        </Suspense>

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI * 0.2}
          maxPolarAngle={Math.PI * 0.8}
          autoRotate
          autoRotateSpeed={0.25}
          enableDamping
          dampingFactor={0.06}
          rotateSpeed={0.55}
        />
      </Canvas>
    </div>
  );
}
