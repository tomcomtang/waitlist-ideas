"use client";

import { Warp } from '@paper-design/shaders-react';

export default function CanvasBackground() {
  return (
    <div className="absolute inset-0 w-full h-dvh -z-10">
      <Warp
        colors={["#0a0a1a", "#1a1a2e", "#2d2d4a"]}
        speed={0.6}
        rotation={0.5}
        swirl={0.5}
        swirlIterations={10}
        shapeScale={0.3}
        distortion={0.25}
        proportion={0.45}
        softness={1}
        scale={1}
        style={{ width: '100%', height: '100%' }}
      />
      {/* 深色叠加层，使整体变暗 */}
      <div className="absolute inset-0 bg-black/30" />
    </div>
  );
}

