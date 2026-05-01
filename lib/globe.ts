import * as THREE from 'three';

export const GLOBE_RADIUS = 1.5;

export interface GlobeNode {
  id: string;
  label: string;
  lat: number;
  lon: number;
  position?: THREE.Vector3;
}

export interface FlightConnection {
  from: string;
  to: string;
  speed: number; // 0.2–1.0
  delay: number; // seconds
}

/** Convert geographic coordinates to 3D Cartesian on a sphere */
export function latLonToVec3(lat: number, lon: number, radius = GLOBE_RADIUS): THREE.Vector3 {
  const phi   = (90 - lat)  * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
     radius * Math.cos(phi),
     radius * Math.sin(phi) * Math.sin(theta),
  );
}

/** Build a quadratic bezier control point lifted above the sphere surface */
export function bezierControlPoint(a: THREE.Vector3, b: THREE.Vector3, lift = 1.6): THREE.Vector3 {
  const mid = new THREE.Vector3().addVectors(a, b).multiplyScalar(0.5);
  return mid.normalize().multiplyScalar(GLOBE_RADIUS * lift);
}

export const NODES: GlobeNode[] = [
  { id: 'nyc',       label: 'New York',   lat:  40.71, lon:  -74.00 },
  { id: 'lon',       label: 'London',     lat:  51.51, lon:   -0.13 },
  { id: 'zur',       label: 'Zurich',     lat:  47.38, lon:    8.54 },
  { id: 'tok',       label: 'Tokyo',      lat:  35.68, lon:  139.69 },
  { id: 'sin',       label: 'Singapore',  lat:   1.35, lon:  103.82 },
];

export const CONNECTIONS: FlightConnection[] = [
  { from: 'nyc', to: 'lon', speed: 0.45, delay: 0.0  },
  { from: 'lon', to: 'zur', speed: 0.70, delay: 1.2  },
  { from: 'nyc', to: 'zur', speed: 0.40, delay: 2.5  },
  { from: 'lon', to: 'sin', speed: 0.35, delay: 0.8  },
  { from: 'zur', to: 'tok', speed: 0.38, delay: 1.8  },
  { from: 'tok', to: 'sin', speed: 0.65, delay: 0.4  },
  { from: 'sin', to: 'nyc', speed: 0.28, delay: 3.1  },
];
