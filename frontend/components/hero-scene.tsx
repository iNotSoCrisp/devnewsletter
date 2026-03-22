"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, MeshTransmissionMaterial, Sparkles } from "@react-three/drei";
import { Suspense, useRef } from "react";
import type { Group, Mesh } from "three";

/* ─── Shared spinning core ─────────────────────────────────────────────────── */
function CoreCluster({ speed = 1 }: { speed?: number }) {
  const groupRef = useRef<Group>(null);
  const ringOneRef = useRef<Mesh>(null);
  const ringTwoRef = useRef<Mesh>(null);
  const coreRef = useRef<Mesh>(null);

  useFrame((state, delta) => {
    const elapsed = state.clock.getElapsedTime();
    const s = speed;

    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.16 * s;
      groupRef.current.position.y = Math.sin(elapsed * 0.75 * s) * 0.12;
    }
    if (ringOneRef.current) {
      ringOneRef.current.rotation.x += delta * 0.22 * s;
      ringOneRef.current.rotation.y += delta * 0.18 * s;
    }
    if (ringTwoRef.current) {
      ringTwoRef.current.rotation.x -= delta * 0.16 * s;
      ringTwoRef.current.rotation.z += delta * 0.24 * s;
    }
    if (coreRef.current) {
      coreRef.current.rotation.x += delta * 0.14 * s;
      coreRef.current.rotation.z -= delta * 0.12 * s;
    }
  });

  return (
    <group ref={groupRef} position={[0.55, 0.15, 0]}>
      <Float speed={2.8 * speed} rotationIntensity={0.8} floatIntensity={1.25}>
        <mesh ref={coreRef}>
          <icosahedronGeometry args={[1.45, 12]} />
          <MeshTransmissionMaterial
            samples={4}
            resolution={128}
            thickness={0.9}
            anisotropy={0.2}
            roughness={0.08}
            chromaticAberration={0.05}
            distortion={0.18}
            color="#92f4ff"
            temporalDistortion={0.18}
            background={undefined}
          />
        </mesh>
      </Float>

      <mesh ref={ringOneRef} rotation={[1.1, 0.2, 0.35]}>
        <torusGeometry args={[2.3, 0.055, 32, 220]} />
        <meshStandardMaterial color="#f7a262" emissive="#f7a262" emissiveIntensity={0.5} metalness={0.9} roughness={0.22} />
      </mesh>

      <mesh ref={ringTwoRef} rotation={[0.45, 0.9, 0.6]}>
        <torusGeometry args={[2.85, 0.035, 16, 180]} />
        <meshStandardMaterial color="#d4ff64" emissive="#d4ff64" emissiveIntensity={0.5} metalness={0.95} roughness={0.12} />
      </mesh>

      <mesh position={[-2.35, -1.2, -0.55]}>
        <sphereGeometry args={[0.22, 32, 32]} />
        <meshStandardMaterial color="#76f2ff" emissive="#76f2ff" emissiveIntensity={0.8} />
      </mesh>

      <mesh position={[2.1, 1.5, 0.4]}>
        <sphereGeometry args={[0.14, 32, 32]} />
        <meshStandardMaterial color="#f7a262" emissive="#f7a262" emissiveIntensity={0.8} />
      </mesh>
    </group>
  );
}

/* ─── Hero scene (right-column use, if needed) ─────────────────────────────── */
export function HeroScene() {
  return (
    <div className="absolute inset-0" style={{ background: "transparent" }}>
      <Canvas
        camera={{ position: [0, 0, 7.5], fov: 42 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
      >
        <fog attach="fog" args={["#050915", 8, 18]} />
        <ambientLight intensity={0.75} />
        <directionalLight position={[4, 5, 5]} intensity={1.25} color="#ffffff" />
        <pointLight position={[-4, -3, 4]} intensity={2.4} color="#76f2ff" />
        <pointLight position={[4, 4, 2]} intensity={1.85} color="#f7a262" />
        <Sparkles count={120} scale={[12, 8, 8]} size={2.2} speed={0.45} color="#ffffff" />
        <Suspense fallback={null}>
          <CoreCluster />
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
}

/* ─── Background scene (full-page fixed, very subtle) ─────────────────────── */
export function BackgroundScene() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        opacity: 0.18,
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 9], fov: 50 }}
        dpr={[1, 1.2]}
        gl={{ antialias: true, alpha: true }}
        onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
      >
        {/* No fog — let the globe be visible across the whole page */}
        <ambientLight intensity={0.35} />
        <directionalLight position={[4, 5, 5]} intensity={0.5} color="#ffffff" />
        <pointLight position={[-4, -3, 4]} intensity={0.9} color="#76f2ff" />
        <pointLight position={[4, 4, 2]} intensity={0.7} color="#f7a262" />
        {/* Fewer sparkles for the subtle background version */}
        <Sparkles count={30} scale={[14, 10, 10]} size={1.0} speed={0.18} color="#ffffff" />
        <Suspense fallback={null}>
          {/* Slower rotation (speed=0.55) so it's ambient, not distracting */}
          <CoreCluster speed={0.55} />
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
}
