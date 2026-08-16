import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import { CUBE_COLORS } from '../../types/cube.js';

// Sticker Hex mapping
const STICKER_HEX = {
  W: CUBE_COLORS.W.hex,
  Y: CUBE_COLORS.Y.hex,
  R: CUBE_COLORS.R.hex,
  O: CUBE_COLORS.O.hex,
  B: CUBE_COLORS.B.hex,
  G: CUBE_COLORS.G.hex
};

// Sticker Text colors
const STICKER_TEXT_HEX = {
  W: '#000000',
  Y: '#000000',
  R: '#FFFFFF',
  O: '#FFFFFF',
  B: '#FFFFFF',
  G: '#FFFFFF'
};

const BODY_COLOR = '#0F172A'; // Dark slate body plastic

/**
 * Single Sticker Mesh attached to outer face of a cubie
 */
function Sticker({ colorKey, position, rotation, showLabels }) {
  if (!colorKey) return null;
  const hex = STICKER_HEX[colorKey] || '#FFFFFF';
  const textHex = STICKER_TEXT_HEX[colorKey] || '#000000';

  return (
    <group position={position} rotation={rotation}>
      {/* Sticker Plane */}
      <mesh>
        <planeGeometry args={[0.84, 0.84]} />
        <meshStandardMaterial
          color={hex}
          roughness={0.2}
          metalness={0.05}
          polygonOffset
          polygonOffsetFactor={-1}
        />
      </mesh>

      {/* Color Letter Overlay for accessibility */}
      {showLabels && (
        <Text
          position={[0, 0, 0.01]}
          fontSize={0.4}
          color={textHex}
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
        >
          {colorKey}
        </Text>
      )}
    </group>
  );
}

/**
 * Single Cubie (1 of 27 blocks) with black body & outer sticker planes
 */
function Cubie({ position, stickers, showLabels }) {
  const offset = 0.471; // Slightly offset plane from center of 0.94 block

  return (
    <group position={position}>
      {/* Black Plastic Inner Body */}
      <mesh>
        <boxGeometry args={[0.94, 0.94, 0.94]} />
        <meshStandardMaterial
          color={BODY_COLOR}
          roughness={0.4}
          metalness={0.2}
        />
      </mesh>

      {/* 6 Face Stickers */}
      {/* +X Right */}
      {stickers.R && (
        <Sticker
          colorKey={stickers.R}
          position={[offset, 0, 0]}
          rotation={[0, Math.PI / 2, 0]}
          showLabels={showLabels}
        />
      )}
      {/* -X Left */}
      {stickers.L && (
        <Sticker
          colorKey={stickers.L}
          position={[-offset, 0, 0]}
          rotation={[0, -Math.PI / 2, 0]}
          showLabels={showLabels}
        />
      )}
      {/* +Y Up */}
      {stickers.U && (
        <Sticker
          colorKey={stickers.U}
          position={[0, offset, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          showLabels={showLabels}
        />
      )}
      {/* -Y Down */}
      {stickers.D && (
        <Sticker
          colorKey={stickers.D}
          position={[0, -offset, 0]}
          rotation={[Math.PI / 2, 0, 0]}
          showLabels={showLabels}
        />
      )}
      {/* +Z Front */}
      {stickers.F && (
        <Sticker
          colorKey={stickers.F}
          position={[0, 0, offset]}
          rotation={[0, 0, 0]}
          showLabels={showLabels}
        />
      )}
      {/* -Z Back */}
      {stickers.B && (
        <Sticker
          colorKey={stickers.B}
          position={[0, 0, -offset]}
          rotation={[0, Math.PI, 0]}
          showLabels={showLabels}
        />
      )}
    </group>
  );
}

/**
 * 3D Interactive Rubik's Cube Group
 */
function RubiksCube({ cubeState, currentMove, isAutoRotating, showLabels }) {
  const groupRef = useRef();

  useFrame((state, delta) => {
    if (isAutoRotating && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.45;
      groupRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.6) * 0.18;
    }
  });

  const cubies = [];

  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      for (let z = -1; z <= 1; z++) {
        if (x === 0 && y === 0 && z === 0) continue;

        const stickers = {};

        // U face (+Y, y = 1): row by row z from -1 to 1, x from -1 to 1
        if (y === 1) {
          const row = z + 1; // 0, 1, 2
          const col = x + 1; // 0, 1, 2
          stickers.U = cubeState.U?.[row * 3 + col] || 'W';
        }
        // D face (-Y, y = -1)
        if (y === -1) {
          const row = 1 - z;
          const col = x + 1;
          stickers.D = cubeState.D?.[row * 3 + col] || 'Y';
        }
        // F face (+Z, z = 1)
        if (z === 1) {
          const row = 1 - y;
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
        camera={{ position: [4.2, 3.2, 4.2], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={1.1} />
        <directionalLight position={[10, 12, 10]} intensity={1.4} />
        <directionalLight position={[-10, -10, -10]} intensity={0.6} />
        <pointLight position={[0, 8, 0]} intensity={0.8} />

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
