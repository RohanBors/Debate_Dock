"use client";

import { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { Engine } from "@tsparticles/engine";

// variant: "minimal" = subtle bottom-30% decoration (landing page)
//           "default" = full-page medium density (settings page)
export default function ParticleBackground({ variant = "default" }: { variant?: "minimal" | "default" }) {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine: Engine) => {
      await loadSlim(engine);
    }).then(() => setInit(true));
  }, []);

  if (!init) return null;

  const isMinimal = variant === "minimal";

  return (
    <Particles
      id={`tsparticles-${variant}`}
      className="absolute inset-0 w-full h-full pointer-events-none"
      options={{
        background: { color: { value: "transparent" } },
        fpsLimit: 60,
        smooth: true,
        interactivity: { events: { onHover: { enable: false } } },
        particles: {
          color: { value: "#ccff00" },
          links: {
            color: "#ccff00",
            distance: isMinimal ? 120 : 130,
            enable: true,
            opacity: isMinimal ? 0.06 : 0.15,
            width: 0.6,
          },
          move: {
            direction: "none",
            enable: true,
            outModes: { default: "out" },
            random: true,
            speed: isMinimal ? 0.2 : 0.5,
            straight: false,
          },
          number: {
            density: { enable: true, width: isMinimal ? 2400 : 900, height: isMinimal ? 2400 : 900 },
            value: isMinimal ? 28 : 110,
          },
          opacity: {
            value: { min: 0.06, max: isMinimal ? 0.18 : 0.45 },
            animation: { enable: true, speed: 0.4, sync: false },
          },
          shape: { type: "circle" },
          size: { value: { min: 0.8, max: 1.5 } },
        },
        detectRetina: true,
      }}
    />
  );
}
