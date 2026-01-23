"use client";

import { Warp } from '@paper-design/shaders-react';

export default function CanvasBackground() {
  return (
    <div className="fixed inset-0 w-screen h-screen -z-10">
      <Warp
        colors={["#0a0a1a", "#1a1a2e", "#2d2d4a"]}
        speed={0.9}
        rotation={0.5}
        swirl={0.6}
        swirlIterations={18}
        shapeScale={0.2}
        distortion={0.35}
        proportion={0.45}
        softness={1}
        scale={1}
        style={{ width: '100%', height: '100%' }}
      />
      <div className="absolute inset-0 bg-black/30" />
    </div>
  );
}

