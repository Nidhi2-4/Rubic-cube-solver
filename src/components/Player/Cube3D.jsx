import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { CUBE_COLORS } from '../../types/cube.js';

// Color map to hex for materials
const STICKER_HEX = {
  W: CUBE_COLORS.W.hex,
  Y: CUBE_COLORS.Y.hex,
  R: CUBE_COLORS.R.hex,
  O: CUBE_COLORS.O.hex,
  B: CUBE_COLORS.B.hex,
  G: CUBE_COLORS.G.hex
};

// Dark plastic inner body color
const BODY_COLOR = '#1E293B';

/**
 * Individual Cubie component representing 1 of the 27 small blocks
 */
function Cubie({ position, stickers, showLabels }) {
  const meshRef = useRef();

  // Three.js BoxGeometry material array order:
  // [0]: +X (Right)
  // [1]: -X (Left)
  // [2]: +Y (Top)
  // [3]: -Y (Bottom)
  // [4]: +Z (Front)
  // [5]: -Z (Back)

  const materials = [
    stickers.R ? STICKER_HEX[stickers.R] : BODY_COLOR,
    stickers.L ? STICKER_HEX[stickers.L] : BODY_COLOR,
    stickers.U ? STICKER_HEX[stickers.U] : BODY_COLOR,
    stickers.D ? STICKER_HEX[stickers.D] : BODY_COLOR,
    stickers.F ? STICKER_HEX[stickers.F] : BODY_COLOR,
    stickers.B ? STICKER_HEX[stickers.B] : BODY_COLOR
  ];

  return (
    <group position={position}>
      <RoundedBox
        ref={meshRef}
        args={[0.92, 0.92, 0.92]}
        radius={0.08}
        smoothness={4}
      >
        {materials.map((color, idx) => (
          <meshStandardMaterial
            key={idx}
            attach={`material-${idx}`}
            color={color}
            roughness={0.2}
            metalness={0.1}
          />
        ))}
      </RoundedBox>
    </group>
  );
}

/**
 * Interactive Rubik's Cube 3D Group
 */
function RubiksCube({ cubeState, currentMove, animationProgress, isAutoRotating, showLabels }) {
  const groupRef = useRef();

  // Continuous gentle rotation when idle
  useFrame((state, delta) => {
    if (isAutoRotating && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.4;
      groupRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.15;
    }
  });

  // Calculate 27 cubie positions and sticker colors based on state
  const cubies = [];

  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      for (let z = -1; z <= 1; z++) {
        // Skip center interior core (0,0,0)
        if (x === 0 && y === 0 && z === 0) continue;

        const stickers = {};

        // Convert grid coordinates to facelet indices
        // U face (+Y, y = 1): 3x3 grid from z = -1 (top row) to z = 1 (bottom row), x = -1 to 1
        if (y === 1) {
          const row = z + 1; // 0, 1, 2
          const col = x + 1; // 0, 1, 2
          stickers.U = cubeState.U?.[row * 3 + col] || 'W';
        }
        // D face (-Y, y = -1)
        if (y === -1) {
          const row = 1 - z; // 0, 1, 2
          const col = x + 1;
          stickers.D = cubeState.D?.[row * 3 + col] || 'Y';
        }
        // F face (+Z, z = 1)
        if (z === 1) {
          const row = 1 - y; // 0, 1, 2
          const col = x + 1;
          stickers.F = cubeState.F?.[row * 3 + col] || 'G';
        }
        // B face (-Z, z = -1)
        if (z === -1) {
          const row = 1 - y;
          const col = 1 - x;
          stickers.B = cubeState.B?.[row * 3 + col] || 'B';
        }
        // R face (+X, x = 1)
        if (x === 1) {
          const row = 1 - y;
          const col = 1 - z;
          stickers.R = cubeState.R?.[row * 3 + col] || 'R';
        }
        // L face (-X, x = -1)
        if (x === -1) {
          const row = 1 - y;
          const col = z + 1;
          stickers.L = cubeState.L?.[row * 3 + col] || 'O';
        }

        cubies.push({
          id: `${x}_${y}_${z}`,
          position: [x * 0.98, y * 0.98, z * 0.98],
          stickers
        });
      }
    }
  }

  return (
    <group ref={groupRef}>
      {cubies.map(c => (
        <Cubie
          key={c.id}
          position={c.position}
          stickers={c.stickers}
          showLabels={showLabels}
        />
      ))}
    </group>
  );
}

export default function Cube3D({
  cubeState,
  currentMove = null,
  isAutoRotating = false,
  showLabels = false,
  height = '500px'
}) {
  const controlsRef = useRef();

  const resetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  return (
    <div className="relative w-full rounded-2xl overflow-hidden glass-panel border border-slate-800" style={{ height }}>
      <Canvas
        camera={{ position: [4.5, 3.5, 4.5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.8} />
        <directionalLight position={[10, 10, 10]} intensity={1.2} />
        <directionalLight position={[-10, -10, -10]} intensity={0.5} />
        <pointLight position={[0, 5, 0]} intensity={0.6} />

        <RubiksCube
          cubeState={cubeState}
          currentMove={currentMove}
          isAutoRotating={isAutoRotating}
          showLabels={showLabels}
        />

        <OrbitControls
          ref={controlsRef}
          enablePan={false}
          minDistance={3}
          maxDistance={10}
          rotateSpeed={0.8}
        />
      </Canvas>

      {/* Floating View Controls overlay */}
      <div className="absolute bottom-3 right-3 flex items-center gap-2 z-10">
        <button
          onClick={resetCamera}
          className="px-3 py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-xs font-medium text-slate-300 border border-slate-700/60 backdrop-blur-md transition-colors"
        >
          Reset View
        </button>
      </div>
    </div>
  );
}
